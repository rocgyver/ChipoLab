import { CellType, Direction, LevelData, Position, SolutionStep, WormholePair } from '../src/types/game';
import { calculatePush, getDirectionDelta, getWormholePartner } from '../src/utils/gameLogic';
import * as fs from 'fs';

interface FissionCandidate {
  n: number;
  targetPos: Position;
  pushPos: Position;
  description: string;
}

interface FissionRecord {
  pushPos: Position;
  pushDir: Direction;
  targetPos: Position;
  subLevel: number;
}

const OPPOSITE_MAP: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

function calculateTileDistance(p1: Position, p2: Position, isWrap: boolean, boardW: number, boardH: number): number {
  const dx = isWrap
    ? Math.min(Math.abs(p1.x - p2.x), boardW - Math.abs(p1.x - p2.x))
    : Math.abs(p1.x - p2.x);
  const dy = isWrap
    ? Math.min(Math.abs(p1.y - p2.y), boardH - Math.abs(p1.y - p2.y))
    : Math.abs(p1.y - p2.y);
  return Math.sqrt(dx * dx + dy * dy);
}

function getDistanceToFirstObstacle(
  start: Position,
  dir: Direction,
  currentChips: Position[],
  gridData: CellType[][],
  isWrap: boolean,
  boardW: number,
  boardH: number,
  wormholesList: WormholePair[]
): number {
  const { dx, dy } = getDirectionDelta(dir);
  let currX = start.x;
  let currY = start.y;
  let step = 0;
  const maxSearchSteps = isWrap ? Math.max(boardW, boardH) * 2 : Math.max(boardW, boardH);
  const visitedStates = new Set<string>();

  while (step < maxSearchSteps) {
    step++;
    const nextX = isWrap ? ((currX + dx) % boardW + boardW) % boardW : currX + dx;
    const nextY = isWrap ? ((currY + dy) % boardH + boardH) % boardH : currY + dy;

    if (!isWrap && (nextX < 0 || nextX >= boardW || nextY < 0 || nextY >= boardH)) {
      return step;
    }

    if (gridData[nextY]?.[nextX] === 'WALL' || gridData[nextY]?.[nextX] === 'OBSTACLE') {
      return step;
    }

    const partner = getWormholePartner({ x: nextX, y: nextY }, wormholesList);
    if (partner) {
      if (gridData[partner.y]?.[partner.x] === 'WALL' || gridData[partner.y]?.[partner.x] === 'OBSTACLE') {
        return step;
      }
      if (currentChips.some((c) => !(c.x === start.x && c.y === start.y) && c.x === partner.x && c.y === partner.y)) {
        return step;
      }
      currX = partner.x;
      currY = partner.y;
      const stateKey = `${currX},${currY},${dx},${dy}`;
      if (visitedStates.has(stateKey)) {
        return step;
      }
      visitedStates.add(stateKey);
    } else {
      if (currentChips.some((c) => !(c.x === start.x && c.y === start.y) && c.x === nextX && c.y === nextY)) {
        return step;
      }
      currX = nextX;
      currY = nextY;
    }

    if (currX === start.x && currY === start.y) {
      return isWrap ? Math.max(boardW, boardH) : step;
    }
  }

  return step;
}

function getAdjacencyInfo(
  pos: Position,
  currentChips: Position[],
  gridData: CellType[][],
  isWrap: boolean,
  boardW: number,
  boardH: number
) {
  let cardinalAdjacent = 0;
  let diagonalAdjacent = 0;

  const cardinalOffsets = [
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
  ];

  const diagonalOffsets = [
    { dx: -1, dy: -1 },
    { dx: 1, dy: -1 },
    { dx: -1, dy: 1 },
    { dx: 1, dy: 1 },
  ];

  for (const { dx, dy } of cardinalOffsets) {
    const nx = isWrap ? ((pos.x + dx) % boardW + boardW) % boardW : pos.x + dx;
    const ny = isWrap ? ((pos.y + dy) % boardH + boardH) % boardH : pos.y + dy;
    if (!isWrap && (nx < 0 || nx >= boardW || ny < 0 || ny >= boardH)) {
      cardinalAdjacent++;
      continue;
    }
    if (gridData[ny]?.[nx] === 'WALL' || gridData[ny]?.[nx] === 'OBSTACLE') {
      cardinalAdjacent++;
    } else if (currentChips.some((c) => c.x === nx && c.y === ny)) {
      cardinalAdjacent++;
    }
  }

  for (const { dx, dy } of diagonalOffsets) {
    const nx = isWrap ? ((pos.x + dx) % boardW + boardW) % boardW : pos.x + dx;
    const ny = isWrap ? ((pos.y + dy) % boardH + boardH) % boardH : pos.y + dy;
    if (!isWrap && (nx < 0 || nx >= boardW || ny < 0 || ny >= boardH)) {
      diagonalAdjacent++;
      continue;
    }
    if (gridData[ny]?.[nx] === 'WALL' || gridData[ny]?.[nx] === 'OBSTACLE') {
      diagonalAdjacent++;
    } else if (currentChips.some((c) => c.x === nx && c.y === ny)) {
      diagonalAdjacent++;
    }
  }

  let minDistanceToChip = Infinity;
  let totalDistanceToChips = 0;
  for (const c of currentChips) {
    const d = calculateTileDistance(pos, c, isWrap, boardW, boardH);
    if (d < minDistanceToChip) minDistanceToChip = d;
    totalDistanceToChips += d;
  }
  const avgDistanceToChips = currentChips.length > 0 ? totalDistanceToChips / currentChips.length : 0;

  let minDistanceToWall = Infinity;
  for (let y = 0; y < boardH; y++) {
    for (let x = 0; x < boardW; x++) {
      if (gridData[y]?.[x] === 'WALL' || gridData[y]?.[x] === 'OBSTACLE') {
        const d = calculateTileDistance(pos, { x, y }, isWrap, boardW, boardH);
        if (d < minDistanceToWall) minDistanceToWall = d;
      }
    }
  }
  if (minDistanceToWall === Infinity) minDistanceToWall = Math.max(boardW, boardH);

  return { cardinalAdjacent, diagonalAdjacent, minDistanceToChip, avgDistanceToChips, minDistanceToWall };
}

function calculateFissionOptions(
  chip: { x: number; y: number; level: number },
  currentChips: { x: number; y: number; level: number }[],
  grid: CellType[][],
  width: number,
  height: number,
  wraparound: boolean,
  wormholes: WormholePair[]
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

      const simChips = [
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

      if (pushSim.merged && pushSim.targetChipId === 'target-a') {
        candidates.push({
          n: stepCount,
          targetPos: { x: currX, y: currY },
          pushPos: { x: pushX, y: pushY },
          description: `移開 ${stepCount} 格至 (${currX}, ${currY})`,
        });
      }
    }

    result[dir] = candidates;
  }

  return result;
}

function pickBestFissionCandidate(
  candidates: FissionCandidate[],
  chipA: Position,
  currentChips: Position[],
  gridData: CellType[][],
  isWrap: boolean,
  boardW: number,
  boardH: number
): FissionCandidate {
  if (candidates.length === 1) return candidates[0];

  const scored = candidates.map((cand) => {
    const adj = getAdjacencyInfo(cand.targetPos, currentChips, gridData, isWrap, boardW, boardH);

    let score = 0;
    if (adj.cardinalAdjacent > 0) score -= adj.cardinalAdjacent * 10000;
    if (adj.diagonalAdjacent > 0) score -= adj.diagonalAdjacent * 2500;

    score += adj.minDistanceToChip * 120;
    score += adj.avgDistanceToChips * 30;
    score += Math.min(adj.minDistanceToWall, 5) * 15;
    score += cand.n * 2;

    return { cand, score, adj };
  });

  scored.sort((a, b) => b.score - a.score);
  const topScore = scored[0].score;
  const topCandidates = scored.filter((s) => s.score >= topScore - 5);
  return topCandidates[Math.floor(Math.random() * topCandidates.length)].cand;
}

function evaluateBoardDispersion(chipsList: Position[], isWrap: boolean, boardW: number, boardH: number): number {
  if (chipsList.length < 2) return 0;
  let minPairwiseDist = Infinity;
  let sumNearestDist = 0;
  let repulsionEnergy = 0;

  for (let i = 0; i < chipsList.length; i++) {
    let nearestDist = Infinity;
    for (let j = 0; j < chipsList.length; j++) {
      if (i === j) continue;
      const d = calculateTileDistance(chipsList[i], chipsList[j], isWrap, boardW, boardH);
      if (d < minPairwiseDist) minPairwiseDist = d;
      if (d < nearestDist) nearestDist = d;
      repulsionEnergy += 1 / Math.max(0.5, d * d);
    }
    sumNearestDist += nearestDist;
  }

  const avgNearestDist = sumNearestDist / chipsList.length;
  return minPairwiseDist * 100 + avgNearestDist * 50 - repulsionEnergy * 10;
}

export function generateAutoLayoutLevel(
  template: {
    width: number;
    height: number;
    wraparound: boolean;
    grid: CellType[][];
    wormholes: WormholePair[];
    targetLevel: number;
    targetChipCount: number;
  }
): { chips: { x: number; y: number; level: number }[]; solutionSteps: SolutionStep[]; playerStart: Position } | null {
  const { width, height, wraparound, grid, wormholes, targetLevel, targetChipCount } = template;

  const emptySpots: Position[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y]?.[x] === 'WALL' || grid[y]?.[x] === 'OBSTACLE') continue;
      if (wormholes.some((w) => (w.a.x === x && w.a.y === y) || (w.b.x === x && w.b.y === y))) continue;
      emptySpots.push({ x, y });
    }
  }

  if (emptySpots.length < targetChipCount) return null;

  const scoredEmptySpots = emptySpots.map((spot) => {
    let totalObstacleDist = 0;
    let openDirs = 0;
    (['UP', 'DOWN', 'LEFT', 'RIGHT'] as Direction[]).forEach((d) => {
      const dist = getDistanceToFirstObstacle(spot, d, [spot], grid, wraparound, width, height, wormholes);
      totalObstacleDist += dist;
      if (dist >= 3) openDirs++;
    });
    return { spot, score: totalObstacleDist + openDirs * 5 };
  });
  scoredEmptySpots.sort((a, b) => b.score - a.score);
  const topEmptySpots = scoredEmptySpots.slice(0, Math.min(15, scoredEmptySpots.length));

  let bestResultChips: { x: number; y: number; level: number }[] = [];
  let bestFissionHistory: FissionRecord[] = [];
  let bestDispersionScore = -Infinity;

  for (let attempt = 0; attempt < 24; attempt++) {
    const attemptFissionHistory: FissionRecord[] = [];
    const startSpot = topEmptySpots[attempt % topEmptySpots.length].spot;
    let initialFissionSuccess = false;
    let workingChips: { x: number; y: number; level: number }[] = [];

    const testChip = { x: startSpot.x, y: startSpot.y, level: targetLevel };
    const initialOptions = calculateFissionOptions(testChip, [testChip], grid, width, height, wraparound, wormholes);
    const validDirs = (['UP', 'DOWN', 'LEFT', 'RIGHT'] as Direction[]).filter(
      (d) => initialOptions[d] && initialOptions[d].length > 0
    );

    if (validDirs.length > 0) {
      const dirDists = validDirs.map((d) => ({
        dir: d,
        dist: getDistanceToFirstObstacle(startSpot, d, [startSpot], grid, wraparound, width, height, wormholes),
      }));
      dirDists.sort((a, b) => b.dist - a.dist);
      const maxDist = dirDists[0].dist;
      const bestDirs = dirDists.filter((d) => d.dist === maxDist).map((d) => d.dir);
      const chosenDir = bestDirs[Math.floor(Math.random() * bestDirs.length)];

      const chosenCand = pickBestFissionCandidate(
        initialOptions[chosenDir],
        startSpot,
        [startSpot],
        grid,
        wraparound,
        width,
        height
      );

      workingChips = [
        { x: startSpot.x, y: startSpot.y, level: targetLevel - 1 },
        { x: chosenCand.targetPos.x, y: chosenCand.targetPos.y, level: targetLevel - 1 },
      ];
      attemptFissionHistory.push({
        pushPos: { ...chosenCand.pushPos },
        pushDir: OPPOSITE_MAP[chosenDir],
        targetPos: { ...chosenCand.targetPos },
        subLevel: targetLevel - 1,
      });
      initialFissionSuccess = true;
    }

    if (!initialFissionSuccess) continue;

    let loopCount = 0;
    const maxLoops = targetChipCount * 30;

    while (workingChips.length < targetChipCount && loopCount < maxLoops) {
      loopCount++;
      const fissionableChips = workingChips.filter((c) => c.level > 1);
      if (fissionableChips.length === 0) break;

      interface FissionMoveCandidate {
        chip: { x: number; y: number; level: number };
        dir: Direction;
        cand: FissionCandidate;
        distToObj: number;
        qualityScore: number;
      }

      const moveCandidates: FissionMoveCandidate[] = [];

      for (const selectedChip of fissionableChips) {
        const options = calculateFissionOptions(selectedChip, workingChips, grid, width, height, wraparound, wormholes);
        const validDirsForChip = (['UP', 'DOWN', 'LEFT', 'RIGHT'] as Direction[]).filter(
          (d) => options[d] && options[d].length > 0
        );

        if (validDirsForChip.length === 0) continue;

        const dirScores = validDirsForChip.map((d) => ({
          dir: d,
          dist: getDistanceToFirstObstacle(selectedChip, d, workingChips, grid, wraparound, width, height, wormholes),
        }));
        dirScores.sort((a, b) => b.dist - a.dist);
        const maxObjDist = dirScores[0].dist;
        const topDirs = dirScores.filter((d) => d.dist === maxObjDist);
        const selectedDirObj = topDirs[Math.floor(Math.random() * topDirs.length)];

        const bestCand = pickBestFissionCandidate(
          options[selectedDirObj.dir],
          selectedChip,
          workingChips,
          grid,
          wraparound,
          width,
          height
        );

        const adj = getAdjacencyInfo(bestCand.targetPos, workingChips, grid, wraparound, width, height);
        let quality = selectedDirObj.dist * 20;
        if (adj.cardinalAdjacent > 0) quality -= adj.cardinalAdjacent * 8000;
        if (adj.diagonalAdjacent > 0) quality -= adj.diagonalAdjacent * 1500;
        quality += adj.minDistanceToChip * 80;
        quality += adj.avgDistanceToChips * 25;

        moveCandidates.push({
          chip: selectedChip,
          dir: selectedDirObj.dir,
          cand: bestCand,
          distToObj: selectedDirObj.dist,
          qualityScore: quality,
        });
      }

      if (moveCandidates.length === 0) break;

      moveCandidates.sort((a, b) => b.qualityScore - a.qualityScore);
      const topScore = moveCandidates[0].qualityScore;
      const topMoves = moveCandidates.filter((m) => m.qualityScore >= topScore - 15);
      const chosenMove = topMoves[Math.floor(Math.random() * topMoves.length)];

      const subLevel = chosenMove.chip.level - 1;
      const nextWorking = workingChips.map((c) =>
        c.x === chosenMove.chip.x && c.y === chosenMove.chip.y ? { ...c, level: subLevel } : c
      );
      nextWorking.push({
        x: chosenMove.cand.targetPos.x,
        y: chosenMove.cand.targetPos.y,
        level: subLevel,
      });

      workingChips = nextWorking;
      attemptFissionHistory.push({
        pushPos: { ...chosenMove.cand.pushPos },
        pushDir: OPPOSITE_MAP[chosenMove.dir],
        targetPos: { ...chosenMove.cand.targetPos },
        subLevel,
      });
    }

    const attemptDispersion = evaluateBoardDispersion(workingChips, wraparound, width, height);

    if (
      workingChips.length > bestResultChips.length ||
      (workingChips.length === bestResultChips.length && attemptDispersion > bestDispersionScore)
    ) {
      bestResultChips = workingChips;
      bestFissionHistory = attemptFissionHistory;
      bestDispersionScore = attemptDispersion;
    }

    if (bestResultChips.length >= targetChipCount && attempt >= 12) {
      break;
    }
  }

  if (bestResultChips.length === 0) return null;

  const generatedSolutionSteps: SolutionStep[] = bestFissionHistory
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
    chips: bestResultChips,
    solutionSteps: generatedSolutionSteps,
    playerStart: { x: generatedSolutionSteps[0].standX, y: generatedSolutionSteps[0].standY },
  };
}
