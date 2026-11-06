import { Position, Direction, Chip, CellType, LevelData, WormholePair } from '../types/game';

export interface PushResult {
  canPush: boolean;
  moved: boolean;
  merged: boolean;
  movingChipId?: string;
  targetChipId?: string;
  finalX?: number;
  finalY?: number;
  newLevel?: number;
  traveledPath?: Position[];
  stoppedByFriction?: boolean;
  frictionSteps?: number;
}

export function getDirectionDelta(dir: Direction): { dx: number; dy: number } {
  switch (dir) {
    case 'UP':
      return { dx: 0, dy: -1 };
    case 'DOWN':
      return { dx: 0, dy: 1 };
    case 'LEFT':
      return { dx: -1, dy: 0 };
    case 'RIGHT':
      return { dx: 1, dy: 0 };
  }
}

/**
 * Gets the paired destination position for a wormhole node.
 */
export function getWormholePartner(
  pos: Position,
  wormholes?: WormholePair[]
): Position | null {
  if (!wormholes || wormholes.length === 0) return null;
  for (const pair of wormholes) {
    if (pair.a.x === pos.x && pair.a.y === pos.y) return { ...pair.b };
    if (pair.b.x === pos.x && pair.b.y === pos.y) return { ...pair.a };
  }
  return null;
}

/**
 * Checks whether a level uses Wraparound (torus topology) movement.
 * Active for any level with `wraparound: true` or Level 7 and above.
 */
export function isLevelWraparound(level?: { id: number; wraparound?: boolean }): boolean {
  if (!level) return false;
  return Boolean(level.wraparound ?? level.id >= 7);
}

/**
 * Returns the effective grid for a level.
 * When wraparound is active, outer boundary walls are open (EMPTY) so entities wrap seamlessly.
 */
export function getEffectiveGrid(level: LevelData): CellType[][] {
  const isWrap = isLevelWraparound(level);
  if (!isWrap) return level.grid;

  // Levels with designed partial boundary walls (e.g. Fab.0) preserve their grid layout
  if (level.id === 0 || level.customBoundary) {
    return level.grid;
  }

  const h = level.grid.length;
  const w = level.grid[0].length;
  return level.grid.map((row, y) =>
    row.map((cell, x) => {
      // Remove outer perimeter boundary walls in legacy wraparound levels
      if (x === 0 || x === w - 1 || y === 0 || y === h - 1) {
        return 'EMPTY';
      }
      return cell;
    })
  );
}

/**
 * Checks if a cell is inside the board boundaries and is not a wall.
 * Supports wraparound coordinates if active.
 */
export function isWalkable(
  grid: CellType[][],
  x: number,
  y: number,
  chips: Chip[],
  wraparound = false
): boolean {
  const h = grid.length;
  const w = grid[0].length;

  if (!wraparound && (y < 0 || y >= h || x < 0 || x >= w)) {
    return false;
  }

  const wx = ((x % w) + w) % w;
  const wy = ((y % h) + h) % h;

  if (grid[wy][wx] === 'WALL' || grid[wy][wx] === 'OBSTACLE') {
    return false;
  }
  // Cannot walk directly through a chip (walking into it triggers push)
  if (chips.some((c) => c.x === wx && c.y === wy)) {
    return false;
  }
  return true;
}

/**
 * Breadth-First Search to find shortest walking path from start to target.
 * Supports seamless border crossing when wraparound is active and wormhole portals.
 */
export function findPathBFS(
  grid: CellType[][],
  start: Position,
  target: Position,
  chips: Chip[],
  wraparound = false,
  wormholes?: WormholePair[]
): Position[] | null {
  const h = grid.length;
  const w = grid[0].length;
  const targetX = wraparound ? ((target.x % w) + w) % w : target.x;
  const targetY = wraparound ? ((target.y % h) + h) % h : target.y;

  if (start.x === targetX && start.y === targetY) return [];
  if (!isWalkable(grid, targetX, targetY, chips, wraparound)) return null;

  const queue: { pos: Position; path: Position[] }[] = [{ pos: start, path: [] }];
  const visited = new Set<string>();
  visited.add(`${start.x},${start.y}`);

  const directions = [
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
  ];

  while (queue.length > 0) {
    const { pos, path } = queue.shift()!;

    for (const d of directions) {
      let nx = wraparound ? ((pos.x + d.dx) % w + w) % w : pos.x + d.dx;
      let ny = wraparound ? ((pos.y + d.dy) % h + h) % h : pos.y + d.dy;

      if (!isWalkable(grid, nx, ny, chips, wraparound)) continue;

      let nextPos: Position = { x: nx, y: ny };

      // Check if stepped into a wormhole: instant transfer to partner in 1 single step!
      const partner = getWormholePartner(nextPos, wormholes);
      if (partner) {
        const partnerBlocked =
          grid[partner.y]?.[partner.x] === 'WALL' ||
          grid[partner.y]?.[partner.x] === 'OBSTACLE' ||
          chips.some((c) => c.x === partner.x && c.y === partner.y);

        if (partnerBlocked) {
          // Blocked wormhole exit cannot be entered
          continue;
        }
        nextPos = { ...partner };
      }

      const currentStepPath = [...path, nextPos];

      if (nextPos.x === targetX && nextPos.y === targetY) {
        return currentStepPath;
      }

      const key = `${nextPos.x},${nextPos.y}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({
          pos: nextPos,
          path: currentStepPath,
        });
      }
    }
  }

  return null;
}

/**
 * Calculates the full sliding behavior when the scientist pushes a chip.
 * When wraparound is active, moving out of one edge wraps to the opposite edge and continues!
 * When entering a wormhole, instantly teleports to the partner wormhole as 1 step and continues sliding!
 */
export function calculatePush(
  grid: CellType[][],
  chips: Chip[],
  pushOriginChip: Chip,
  dir: Direction,
  wraparound = false,
  wormholes?: WormholePair[]
): PushResult {
  const h = grid.length;
  const w = grid[0].length;
  const { dx, dy } = getDirectionDelta(dir);
  let currX = pushOriginChip.x;
  let currY = pushOriginChip.y;
  const traveledPath: Position[] = [{ x: currX, y: currY }];
  let steps = 0;
  const maxSteps = dx !== 0 ? w : h;
  const visitedStates = new Set<string>();

  let wormholeTraversals = 0;
  let stoppedByFriction = false;
  let frictionSteps = 0;

  while (true) {
    steps++;
    // In pure wraparound without wormhole entry, complete exactly 2 full laps (2 * maxSteps)
    if (wormholeTraversals === 0 && wraparound && steps > 2 * maxSteps) {
      stoppedByFriction = true;
      frictionSteps = Math.min(6, Math.max(3, Math.floor(maxSteps / 2)));
      break;
    }
    // Safety guard for complex paths with wormholes
    if (steps > 2 * maxSteps + (wormholes?.length || 0) * 12) {
      break;
    }

    const nextX = wraparound ? ((currX + dx) % w + w) % w : currX + dx;
    const nextY = wraparound ? ((currY + dy) % h + h) % h : currY + dy;

    // Check bounds & wall collision
    if (!wraparound && (nextY < 0 || nextY >= h || nextX < 0 || nextX >= w)) {
      break;
    }
    if (grid[nextY][nextX] === 'WALL' || grid[nextY][nextX] === 'OBSTACLE') {
      break;
    }

    // Check if next tile is a wormhole portal: instantly teleports to partner in 1 single step!
    const partner = getWormholePartner({ x: nextX, y: nextY }, wormholes);
    if (partner) {
      // Check exit destination
      if (grid[partner.y]?.[partner.x] === 'WALL' || grid[partner.y]?.[partner.x] === 'OBSTACLE') {
        break; // Exit wormhole blocked by wall
      }

      const chipAtExit = chips.find(
        (c) => c.id !== pushOriginChip.id && c.x === partner.x && c.y === partner.y
      );

      if (chipAtExit) {
        if (chipAtExit.level === pushOriginChip.level) {
          // Merge at the exit portal in 1 single step!
          traveledPath.push({ x: partner.x, y: partner.y });
          return {
            canPush: true,
            moved: true,
            merged: true,
            movingChipId: pushOriginChip.id,
            targetChipId: chipAtExit.id,
            finalX: partner.x,
            finalY: partner.y,
            newLevel: pushOriginChip.level + 1,
            traveledPath,
          };
        } else {
          // Exit is blocked by an unmergable chip, cannot enter wormhole
          break;
        }
      }

      // Exit is clear! Chip enters nextX, nextY and instantly emerges at partner.x, partner.y in 1 step!
      wormholeTraversals++;
      traveledPath.push({ x: partner.x, y: partner.y });
      currX = partner.x;
      currY = partner.y;

      const stateKey = `${currX},${currY},${dx},${dy}`;
      if (wormholeTraversals >= 3 || visitedStates.has(stateKey)) {
        // After 3 wormhole traversals (or endless loop), friction slows the chip down to a halt on open floor (3 tiles rollout)
        const frictionStepsLimit = 3;
        let rolloutCount = 0;
        for (let f = 0; f < frictionStepsLimit; f++) {
          const fx = wraparound ? ((currX + dx) % w + w) % w : currX + dx;
          const fy = wraparound ? ((currY + dy) % h + h) % h : currY + dy;

          if (!wraparound && (fy < 0 || fy >= h || fx < 0 || fx >= w)) break;
          if (grid[fy]?.[fx] === 'WALL' || grid[fy]?.[fx] === 'OBSTACLE') break;

          // Do not enter a 4th wormhole during friction rollout
          if (getWormholePartner({ x: fx, y: fy }, wormholes)) break;

          const otherChip = chips.find(
            (c) => c.id !== pushOriginChip.id && c.x === fx && c.y === fy
          );
          if (otherChip) {
            if (otherChip.level === pushOriginChip.level) {
              traveledPath.push({ x: fx, y: fy });
              return {
                canPush: true,
                moved: true,
                merged: true,
                movingChipId: pushOriginChip.id,
                targetChipId: otherChip.id,
                finalX: fx,
                finalY: fy,
                newLevel: pushOriginChip.level + 1,
                traveledPath,
              };
            }
            break;
          }

          currX = fx;
          currY = fy;
          traveledPath.push({ x: currX, y: currY });
          rolloutCount++;
        }
        stoppedByFriction = true;
        frictionSteps = rolloutCount;
        break;
      }
      visitedStates.add(stateKey);
      continue;
    }

    // Check if another chip is at next position
    const otherChip = chips.find(
      (c) => c.id !== pushOriginChip.id && c.x === nextX && c.y === nextY
    );

    if (otherChip) {
      if (otherChip.level === pushOriginChip.level) {
        // Merge!
        traveledPath.push({ x: nextX, y: nextY });
        return {
          canPush: true,
          moved: true,
          merged: true,
          movingChipId: pushOriginChip.id,
          targetChipId: otherChip.id,
          finalX: nextX,
          finalY: nextY,
          newLevel: pushOriginChip.level + 1,
          traveledPath,
        };
      } else {
        // Different level chip stops the slide right in front of it
        break;
      }
    }

    // Path is empty floor, keep sliding!
    currX = nextX;
    currY = nextY;
    traveledPath.push({ x: currX, y: currY });
  }

  const hasMoved = traveledPath.length > 1;

  return {
    canPush: hasMoved,
    moved: hasMoved,
    merged: false,
    movingChipId: pushOriginChip.id,
    finalX: currX,
    finalY: currY,
    traveledPath,
    stoppedByFriction,
    frictionSteps,
  };
}

/**
 * Evaluates whether custom chip collection can merge down to a single chip.
 */
export function evaluateChipBalance(chips: { level: number }[]): {
  isPowerOfTwo: boolean;
  targetLevel: number;
  totalEnergy: number;
} {
  let totalEnergy = 0;
  for (const c of chips) {
    totalEnergy += Math.pow(2, c.level - 1);
  }

  const isPowerOfTwo = totalEnergy > 0 && (totalEnergy & (totalEnergy - 1)) === 0;
  const targetLevel = isPowerOfTwo ? Math.log2(totalEnergy) + 1 : Math.floor(Math.log2(Math.max(1, totalEnergy))) + 1;

  return {
    isPowerOfTwo,
    targetLevel,
    totalEnergy,
  };
}
