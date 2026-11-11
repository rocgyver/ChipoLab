import { CellType, Direction, Position, Chip, WormholePair, SolutionStep, LevelData } from '../src/types/game';
import { calculatePush, getDirectionDelta, getWormholePartner, isWalkable, findPathBFS } from '../src/utils/gameLogic';
import { calculateFissionOptions, computeCoulombRepulsion, simulateSolution } from './coulomb_fission';
import { LEVELS } from '../src/data/levels';
import * as fs from 'fs';

const OPPOSITE_MAP: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

interface FissionRecord {
  pushPos: Position;
  pushDir: Direction;
  targetPos: Position;
  subLevel: number;
}

export function runCoulombReverseFission(
  grid: CellType[][],
  wormholes: WormholePair[],
  wraparound: boolean,
  targetLevel: number,
  targetChipCount: number,
  targetPositions: Position[],
  numRounds = 500
): {
  chips: { x: number; y: number; level: number }[];
  solutionSteps: SolutionStep[];
  playerStart: Position;
  coulombEnergy: number;
  minDistance: number;
  avgDistance: number;
} | null {
  const width = grid[0].length;
  const height = grid.length;

  let bestCandidate: {
    chips: { x: number; y: number; level: number }[];
    solutionSteps: SolutionStep[];
    playerStart: Position;
    coulombEnergy: number;
    minDistance: number;
    avgDistance: number;
  } | null = null;

  for (let r = 0; r < numRounds; r++) {
    // Pick start position
    const startPos = targetPositions[r % targetPositions.length];
    let workingChips: { x: number; y: number; level: number }[] = [
      { x: startPos.x, y: startPos.y, level: targetLevel },
    ];
    const attemptHistory: FissionRecord[] = [];

    let steps = 0;
    const maxSteps = targetChipCount * 40;

    while (workingChips.length < targetChipCount && steps < maxSteps) {
      steps++;
      const fissionable = workingChips.filter((c) => c.level > 1);
      if (fissionable.length === 0) break;

      // Evaluate all fission possibilities across all fissionable chips
      interface Possibility {
        chip: { x: number; y: number; level: number };
        dir: Direction;
        cand: { n: number; targetPos: Position; pushPos: Position };
        // Projected Coulomb repulsion score
        projectedEnergy: number;
        projectedMinDist: number;
        candDistance: number;
      }

      const allPossibilities: Possibility[] = [];

      for (const chip of fissionable) {
        const options = calculateFissionOptions(chip, workingChips, grid, wormholes, wraparound, width, height);

        for (const dir of ['UP', 'DOWN', 'LEFT', 'RIGHT'] as Direction[]) {
          for (const cand of options[dir]) {
            // Check projected placement
            const otherChips = workingChips.filter((c) => !(c.x === chip.x && c.y === chip.y));
            const projectedPositions = [
              ...otherChips.map((c) => ({ x: c.x, y: c.y })),
              { x: chip.x, y: chip.y },
              { x: cand.targetPos.x, y: cand.targetPos.y },
            ];

            const stats = computeCoulombRepulsion(projectedPositions, wraparound, width, height);
            allPossibilities.push({
              chip,
              dir,
              cand,
              projectedEnergy: stats.energy,
              projectedMinDist: stats.minDistance,
              candDistance: cand.n,
            });
          }
        }
      }

      if (allPossibilities.length === 0) break;

      // Filter for minimum distance >= 1.5 if possible, else highest minDist
      // And among them, lowest Coulomb energy (strongest repulsion minimization)
      allPossibilities.sort((a, b) => {
        // High penalty for minDistance < 1.4 (adjacent or touching chips)
        const aMinPenalty = a.projectedMinDist < 1.4 ? 1000 : 0;
        const bMinPenalty = b.projectedMinDist < 1.4 ? 1000 : 0;
        const aScore = a.projectedEnergy + aMinPenalty - a.candDistance * 0.1;
        const bScore = b.projectedEnergy + bMinPenalty - b.candDistance * 0.1;
        return aScore - bScore;
      });

      // Sample randomly from top 3 to keep variety
      const topSlice = allPossibilities.slice(0, Math.min(3, allPossibilities.length));
      const chosen = topSlice[Math.floor(Math.random() * topSlice.length)];

      const subLevel = chosen.chip.level - 1;
      workingChips = workingChips.map((c) =>
        c.x === chosen.chip.x && c.y === chosen.chip.y ? { ...c, level: subLevel } : c
      );
      workingChips.push({
        x: chosen.cand.targetPos.x,
        y: chosen.cand.targetPos.y,
        level: subLevel,
      });

      attemptHistory.push({
        pushPos: { ...chosen.cand.pushPos },
        pushDir: OPPOSITE_MAP[chosen.dir],
        targetPos: { ...chosen.cand.targetPos },
        subLevel,
      });
    }

    if (workingChips.length === targetChipCount) {
      const forwardSteps: SolutionStep[] = attemptHistory
        .slice()
        .reverse()
        .map((f) => ({
          standX: f.pushPos.x,
          standY: f.pushPos.y,
          dir: f.pushDir,
          chipX: f.targetPos.x,
          chipY: f.targetPos.y,
          chipLevel: f.subLevel,
          merged: true,
        }));

      // Candidate player start
      const firstStep = forwardSteps[0];
      const playerStart = { x: firstStep.standX, y: firstStep.standY };

      // Simulate full walkthrough
      const sim = simulateSolution(
        grid,
        workingChips,
        wormholes,
        wraparound,
        forwardSteps,
        targetLevel,
        playerStart
      );

      if (sim.success && sim.validWalk) {
        const stats = computeCoulombRepulsion(
          workingChips.map((c) => ({ x: c.x, y: c.y })),
          wraparound,
          width,
          height
        );

        // Check if this candidate is better (higher minDist, lower energy)
        if (
          !bestCandidate ||
          (stats.minDistance >= 1.4 && bestCandidate.minDistance < 1.4) ||
          (stats.minDistance >= 1.4 && stats.energy < bestCandidate.coulombEnergy) ||
          (stats.minDistance < 1.4 && bestCandidate.minDistance < 1.4 && stats.energy < bestCandidate.coulombEnergy)
        ) {
          bestCandidate = {
            chips: workingChips,
            solutionSteps: forwardSteps,
            playerStart,
            coulombEnergy: stats.energy,
            minDistance: stats.minDistance,
            avgDistance: stats.avgDistance,
          };
          console.log(
            `Round ${r}: Found valid solution! MinDist: ${stats.minDistance.toFixed(2)}, CoulombEnergy: ${stats.energy.toFixed(3)}, AvgDist: ${stats.avgDistance.toFixed(2)}`
          );
          if (stats.minDistance >= 1.99 && stats.energy < 12.0) {
            // Excellent distribution reached
            break;
          }
        }
      }
    }
  }

  return bestCandidate;
}
