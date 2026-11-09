import { CellType, Direction, Position, Chip, WormholePair, SolutionStep, LevelData } from '../src/types/game';
import { calculatePush, getDirectionDelta, getWormholePartner, isWalkable, findPathBFS } from '../src/utils/gameLogic';

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

export function calculateFissionOptionsForGrid(
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

export function generateFissionLevel(
  grid: CellType[][],
  wormholes: WormholePair[],
  wraparound: boolean,
  targetLevel: number,
  targetChipCount: number,
  initialTargetPos: Position,
  maxAttempts = 50
): { chips: { x: number; y: number; level: number }[]; solutionSteps: SolutionStep[] } | null {
  const width = grid[0].length;
  const height = grid.length;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    let workingChips: { x: number; y: number; level: number }[] = [
      { x: initialTargetPos.x, y: initialTargetPos.y, level: targetLevel },
    ];
    const attemptHistory: {
      pushPos: Position;
      pushDir: Direction;
      targetPos: Position;
      subLevel: number;
    }[] = [];

    let loopCount = 0;
    const maxLoops = targetChipCount * 40;

    while (workingChips.length < targetChipCount && loopCount < maxLoops) {
      loopCount++;
      const fissionable = workingChips.filter((c) => c.level > 1);
      if (fissionable.length === 0) break;

      // Shuffle fissionable chips
      const shuffledFissionable = [...fissionable].sort(() => Math.random() - 0.5);
      let fFound = false;

      for (const selChip of shuffledFissionable) {
        const options = calculateFissionOptionsForGrid(
          selChip,
          workingChips,
          grid,
          wormholes,
          wraparound,
          width,
          height
        );

        const validDirs = (['UP', 'DOWN', 'LEFT', 'RIGHT'] as Direction[]).filter(
          (d) => options[d] && options[d].length > 0
        );
        if (validDirs.length === 0) continue;

        // Shuffle dirs
        validDirs.sort(() => Math.random() - 0.5);
        const chosenDir = validDirs[0];
        const cands = options[chosenDir];
        // Pick random candidate or furthest candidate
        const chosenCand = cands[Math.floor(Math.random() * cands.length)];

        const subLevel = selChip.level - 1;
        workingChips = workingChips.map((c) =>
          c.x === selChip.x && c.y === selChip.y ? { ...c, level: subLevel } : c
        );
        workingChips.push({
          x: chosenCand.targetPos.x,
          y: chosenCand.targetPos.y,
          level: subLevel,
        });

        attemptHistory.push({
          pushPos: { ...chosenCand.pushPos },
          pushDir: OPPOSITE_MAP[chosenDir],
          targetPos: { ...chosenCand.targetPos },
          subLevel,
        });

        fFound = true;
        break;
      }

      if (!fFound) break;
    }

    if (workingChips.length >= targetChipCount) {
      // Convert reverse history to forward solution
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

      return {
        chips: workingChips,
        solutionSteps: forwardSteps,
      };
    }
  }

  return null;
}
