import { CellType, Direction, Position, Chip, WormholePair, SolutionStep, LevelData } from '../src/types/game';
import { calculatePush, getDirectionDelta, getWormholePartner, isWalkable, findPathBFS } from '../src/utils/gameLogic';
import { LEVELS } from '../src/data/levels';
import * as fs from 'fs';

const OPPOSITE_MAP: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

export interface FissionCandidate {
  n: number;
  targetPos: Position;
  pushPos: Position;
  description: string;
}

export function calculateFissionOptions(
  chip: { x: number; y: number; level: number },
  currentChips: { x: number; y: number; level: number }[],
  grid: CellType[][],
  wormholes: WormholePair[],
  wraparound: boolean,
  width: number,
  height: number
): Record<Direction, FissionCandidate[]> {
  const result: Record<Direction, FissionCandidate[]> = {
    UP: [],
    DOWN: [],
    LEFT: [],
    RIGHT: [],
  };

  const directions: { dir: Direction; opposite: Direction; dx: number; dy: number }[] = [
    { dir: 'UP', opposite: 'DOWN', dx: 0, dy: -1 },
    { dir: 'DOWN', opposite: 'UP', dx: 0, dy: 1 },
    { dir: 'LEFT', opposite: 'RIGHT', dx: -1, dy: 0 },
    { dir: 'RIGHT', opposite: 'LEFT', dx: 1, dy: 0 },
  ];

  const chipA = { x: chip.x, y: chip.y };
  const subLevel = chip.level - 1;

  for (const { dir, opposite, dx, dy } of directions) {
    const candidates: FissionCandidate[] = [];
    let currX = chipA.x;
    let currY = chipA.y;
    let stepCount = 0;
    const maxSteps = wraparound ? Math.max(width, height) * 2 : Math.max(width, height);
    const visitedStates = new Set<string>();

    while (stepCount < maxSteps) {
      stepCount++;
      const nextX = wraparound ? ((currX + dx) % width + width) % width : currX + dx;
      const nextY = wraparound ? ((currY + dy) % height + height) % height : currY + dy;

      if (!wraparound && (nextX < 0 || nextX >= width || nextY < 0 || nextY >= height)) {
        break;
      }
      if (grid[nextY][nextX] === 'WALL' || grid[nextY][nextX] === 'OBSTACLE') {
        break;
      }

      let candidateX = nextX;
      let candidateY = nextY;

      const partner = getWormholePartner({ x: nextX, y: nextY }, wormholes);
      if (partner) {
        if (grid[partner.y]?.[partner.x] === 'WALL' || grid[partner.y]?.[partner.x] === 'OBSTACLE') {
          break;
        }
        if (
          currentChips.some(
            (c) => !(c.x === chipA.x && c.y === chipA.y) && c.x === partner.x && c.y === partner.y
          )
        ) {
          break;
        }
        candidateX = partner.x;
        candidateY = partner.y;
        const stateKey = `${candidateX},${candidateY},${dx},${dy}`;
        if (visitedStates.has(stateKey)) break;
        visitedStates.add(stateKey);
      } else {
        if (
          currentChips.some(
            (c) => !(c.x === chipA.x && c.y === chipA.y) && c.x === nextX && c.y === nextY
          )
        ) {
          break;
        }
      }

      currX = candidateX;
      currY = candidateY;

      if (currX === chipA.x && currY === chipA.y) {
        break;
      }

      const pushX = wraparound ? ((currX + dx) % width + width) % width : currX + dx;
      const pushY = wraparound ? ((currY + dy) % height + height) % height : currY + dy;

      if (!wraparound && (pushX < 0 || pushX >= width || pushY < 0 || pushY >= height)) {
        continue;
      }
      if (grid[pushY][pushX] === 'WALL' || grid[pushY][pushX] === 'OBSTACLE') {
        continue;
      }
      if (pushX === chipA.x && pushY === chipA.y) {
        continue;
      }
      if (
        currentChips.some(
          (c) => !(c.x === chipA.x && c.y === chipA.y) && c.x === pushX && c.y === pushY
        )
      ) {
        continue;
      }

      const simChips: Chip[] = [
        ...currentChips
          .filter((c) => !(c.x === chipA.x && c.y === chipA.y))
          .map((c, i) => ({ id: `chip-${i}`, x: c.x, y: c.y, level: c.level })),
        { id: 'target-a', x: chipA.x, y: chipA.y, level: subLevel },
        { id: 'moving-b', x: currX, y: currY, level: subLevel },
      ];

      const pushSim = calculatePush(
        grid,
        simChips,
        { id: 'moving-b', x: currX, y: currY, level: subLevel },
        opposite,
        wraparound,
        wormholes
      );

      const isTargetOnWormhole = wormholes.some(
        (w) => (w.a.x === currX && w.a.y === currY) || (w.b.x === currX && w.b.y === currY)
      );
      const isPushOnWormhole = wormholes.some(
        (w) => (w.a.x === pushX && w.a.y === pushY) || (w.b.x === pushX && w.b.y === pushY)
      );

      if (!isTargetOnWormhole && !isPushOnWormhole && pushSim.merged && pushSim.targetChipId === 'target-a') {
        candidates.push({
          n: stepCount,
          targetPos: { x: currX, y: currY },
          pushPos: { x: pushX, y: pushY },
          description: `移開 ${stepCount} 格至 (${currX}, ${currY})，推動點 (${pushX}, ${pushY})`,
        });
      }
    }

    result[dir] = candidates;
  }

  return result;
}

// Compute Coulomb electrostatic repulsion energy: sum 1 / (d_ij^2)
export function computeCoulombRepulsion(
  chips: Position[],
  isWrap: boolean,
  boardW: number,
  boardH: number
): { energy: number; minDistance: number; avgDistance: number } {
  if (chips.length < 2) return { energy: 0, minDistance: Infinity, avgDistance: 0 };
  let energy = 0;
  let minDistance = Infinity;
  let totalDistance = 0;
  let pairCount = 0;

  for (let i = 0; i < chips.length; i++) {
    for (let j = i + 1; j < chips.length; j++) {
      const dx = isWrap
        ? Math.min(Math.abs(chips[i].x - chips[j].x), boardW - Math.abs(chips[i].x - chips[j].x))
        : Math.abs(chips[i].x - chips[j].x);
      const dy = isWrap
        ? Math.min(Math.abs(chips[i].y - chips[j].y), boardH - Math.abs(chips[i].y - chips[j].y))
        : Math.abs(chips[i].y - chips[j].y);
      const d = Math.hypot(dx, dy);
      if (d < minDistance) minDistance = d;
      totalDistance += d;
      pairCount++;
      energy += 1 / Math.max(0.25, d * d);
    }
  }

  return {
    energy,
    minDistance,
    avgDistance: pairCount > 0 ? totalDistance / pairCount : 0,
  };
}

export function simulateSolution(
  grid: CellType[][],
  chips: { x: number; y: number; level: number }[],
  wormholes: WormholePair[],
  wraparound: boolean,
  solutionSteps: SolutionStep[],
  targetLevel: number,
  playerStart?: Position
): { success: boolean; finalChipsCount: number; finalLevel?: number; validWalk: boolean } {
  let currentChips = chips.map((c, i) => ({ id: `chip-${i}`, x: c.x, y: c.y, level: c.level }));
  let player = playerStart ? { ...playerStart } : { x: solutionSteps[0]?.standX, y: solutionSteps[0]?.standY };
  let validWalk = true;

  for (let s = 0; s < solutionSteps.length; s++) {
    const step = solutionSteps[s];
    // Check player walkability
    if (player) {
      const canReach =
        (player.x === step.standX && player.y === step.standY) ||
        findPathBFS(grid, player, { x: step.standX, y: step.standY }, currentChips, wraparound) !== null;
      if (!canReach) {
        validWalk = false;
        return { success: false, finalChipsCount: currentChips.length, validWalk: false };
      }
    }

    player = { x: step.standX, y: step.standY };
    const { dx, dy } = getDirectionDelta(step.dir);
    const targetX = wraparound
      ? ((step.standX + dx) % grid[0].length + grid[0].length) % grid[0].length
      : step.standX + dx;
    const targetY = wraparound
      ? ((step.standY + dy) % grid.length + grid.length) % grid.length
      : step.standY + dy;

    const frontChip = currentChips.find((c) => c.x === targetX && c.y === targetY);
    if (!frontChip) return { success: false, finalChipsCount: currentChips.length, validWalk };

    const pushRes = calculatePush(grid, currentChips, frontChip, step.dir, wraparound, wormholes);
    if (!pushRes.canPush || !pushRes.moved) return { success: false, finalChipsCount: currentChips.length, validWalk };

    if (pushRes.merged) {
      const newLevel = frontChip.level + 1;
      currentChips = currentChips
        .filter((c) => c.id !== frontChip.id)
        .map((c) => (c.id === pushRes.targetChipId ? { ...c, level: newLevel } : c));
    } else {
      currentChips = currentChips.map((c) =>
        c.id === frontChip.id ? { ...c, x: pushRes.finalX!, y: pushRes.finalY! } : c
      );
    }
  }

  const success = currentChips.length === 1 && currentChips[0].level === targetLevel;
  return {
    success,
    finalChipsCount: currentChips.length,
    finalLevel: currentChips[0]?.level,
    validWalk,
  };
}
