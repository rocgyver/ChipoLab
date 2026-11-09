import { LevelData, CellType, Direction, Position, Chip, WormholePair, SolutionStep } from '../src/types/game';
import { calculatePush, isWalkable, findPathBFS, getDirectionDelta, getWormholePartner } from '../src/utils/gameLogic';

export interface SolverStep {
  standX: number;
  standY: number;
  dir: Direction;
  chipX: number;
  chipY: number;
  chipLevel: number;
  merged: boolean;
}

export interface SolveResult {
  solved: boolean;
  moves: number;
  steps: SolverStep[];
  statesExplored: number;
}

export function solveAdvancedLevel(levelData: LevelData, maxStates = 40000): SolveResult {
  const { width, height, grid, targetLevel, playerStart } = levelData;
  const wraparound = Boolean(levelData.wraparound);
  const wormholes = levelData.wormholes || [];

  interface State {
    player: Position;
    chips: { id: string; x: number; y: number; level: number }[];
    steps: SolverStep[];
  }

  function hashState(player: Position, chips: { x: number; y: number; level: number }[]): string {
    // Sort chips deterministically
    const sortedChips = [...chips].sort((a, b) => a.x - b.x || a.y - b.y || a.level - b.level);
    const chipStr = sortedChips.map((c) => `${c.x},${c.y},${c.level}`).join('|');
    return `P:${player.x},${player.y}#C:${chipStr}`;
  }

  const initialChips: Chip[] = levelData.chips.map((c, i) => ({
    id: `c${i}`,
    x: c.x,
    y: c.y,
    level: c.level,
  }));

  const initialKey = hashState(playerStart, initialChips);
  const visited = new Set<string>();
  visited.add(initialKey);

  const queue: State[] = [
    {
      player: playerStart,
      chips: initialChips.map((c) => ({ ...c })),
      steps: [],
    },
  ];

  let statesExplored = 0;
  const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

  while (queue.length > 0 && statesExplored < maxStates) {
    statesExplored++;
    const current = queue.shift()!;

    // Check if target level is reached and only 1 chip remains (true ChipoLab victory condition)
    if (current.chips.length === 1 && current.chips[0].level === targetLevel) {
      return {
        solved: true,
        moves: current.steps.length,
        steps: current.steps,
        statesExplored,
      };
    }

    const currentChipsForWalk: Chip[] = current.chips.map((c) => ({
      id: c.id,
      x: c.x,
      y: c.y,
      level: c.level,
    }));

    // For every chip, try pushing in every direction
    for (const chip of current.chips) {
      for (const dir of directions) {
        const { dx, dy } = getDirectionDelta(dir);
        // Stand position is opposite to push direction: chip.x - dx, chip.y - dy
        let standX = chip.x - dx;
        let standY = chip.y - dy;
        if (wraparound) {
          standX = ((standX % width) + width) % width;
          standY = ((standY % height) + height) % height;
        } else {
          if (standX < 0 || standX >= width || standY < 0 || standY >= height) continue;
        }

        // Stand tile must be walkable
        if (!isWalkable(grid, standX, standY, currentChipsForWalk, wraparound)) {
          continue;
        }

        // Check if player can walk from current.player to (standX, standY)
        const path = findPathBFS(grid, current.player, { x: standX, y: standY }, currentChipsForWalk, wraparound, wormholes);
        if (path === null) {
          // Cannot walk to stand position
          continue;
        }

        // Simulate push
        const pushChipInput: Chip = { id: chip.id, x: chip.x, y: chip.y, level: chip.level };
        const pushResult = calculatePush(grid, currentChipsForWalk, pushChipInput, dir, wraparound, wormholes);

        // If chip didn't move and didn't merge, invalid push
        if (pushResult.finalX === chip.x && pushResult.finalY === chip.y && !pushResult.merged) {
          continue;
        }

        // Construct next chips state
        let nextChips: { id: string; x: number; y: number; level: number }[];
        if (pushResult.merged && pushResult.targetChipId) {
          // Find target chip
          const targetChip = current.chips.find((c) => c.id === pushResult.targetChipId);
          if (!targetChip) continue;
          nextChips = current.chips
            .filter((c) => c.id !== chip.id)
            .map((c) => (c.id === targetChip.id ? { ...c, level: c.level + 1 } : { ...c }));
        } else {
          nextChips = current.chips.map((c) =>
            c.id === chip.id ? { ...c, x: pushResult.finalX, y: pushResult.finalY } : { ...c }
          );
        }

        // In ChipoLab, Einstein stays in place at (standX, standY) after pushing!
        const nextPlayer: Position = { x: standX, y: standY };

        const nextKey = hashState(nextPlayer, nextChips);
        if (!visited.has(nextKey)) {
          visited.add(nextKey);
          queue.push({
            player: nextPlayer,
            chips: nextChips,
            steps: [
              ...current.steps,
              {
                standX,
                standY,
                dir,
                chipX: chip.x,
                chipY: chip.y,
                chipLevel: chip.level,
                merged: pushResult.merged,
              },
            ],
          });
        }
      }
    }
  }

  return {
    solved: false,
    moves: 0,
    steps: [],
    statesExplored,
  };
}
