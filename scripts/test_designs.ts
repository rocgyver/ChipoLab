import { LevelData, CellType, Direction, Position, Chip, WormholePair } from '../src/types/game';
import { solveAdvancedLevel } from './solve_level0';

function createBoundedRoom(w: number, h: number, extraWalls: [number, number][] = [], obstacles: [number, number][] = []): CellType[][] {
  const grid: CellType[][] = [];
  for (let y = 0; y < h; y++) {
    const row: CellType[] = [];
    for (let x = 0; x < w; x++) {
      if (x === 0 || x === w - 1 || y === 0 || y === h - 1) {
        row.push('WALL');
      } else {
        row.push('EMPTY');
      }
    }
    grid.push(row);
  }
  for (const [wx, wy] of extraWalls) {
    if (grid[wy] && grid[wy][wx] !== undefined) grid[wy][wx] = 'WALL';
  }
  for (const [ox, oy] of obstacles) {
    if (grid[oy] && grid[oy][ox] !== undefined) grid[oy][ox] = 'OBSTACLE';
  }
  return grid;
}

function createWraparoundRoom(w: number, h: number, walls: [number, number][] = [], obstacles: [number, number][] = []): CellType[][] {
  const grid: CellType[][] = [];
  for (let y = 0; y < h; y++) {
    const row: CellType[] = [];
    for (let x = 0; x < w; x++) {
      row.push('EMPTY');
    }
    grid.push(row);
  }
  for (const [wx, wy] of walls) {
    if (grid[wy] && grid[wy][wx] !== undefined) grid[wy][wx] = 'WALL';
  }
  for (const [ox, oy] of obstacles) {
    if (grid[oy] && grid[oy][ox] !== undefined) grid[oy][ox] = 'OBSTACLE';
  }
  return grid;
}

function testPuzzle(name: string, lvl: LevelData) {
  const t0 = Date.now();
  const res = solveAdvancedLevel(lvl, 80000);
  const elapsed = Date.now() - t0;
  console.log(`\n========================================`);
  console.log(`=== ${name} ===`);
  console.log(`Solved: ${res.solved}, Moves: ${res.moves}, States: ${res.statesExplored}, Time: ${elapsed}ms`);
  if (res.solved) {
    res.steps.forEach((s, i) => {
      console.log(`  Step ${i + 1}: Stand(${s.standX},${s.standY}) Push ${s.dir} on Chip(${s.chipX},${s.chipY} Lv.${s.chipLevel}) -> Merged=${s.merged}`);
    });
  }
  return res;
}

// ----------------------------------------------------
// Fab.1: 量子偏振：重定向矩陣 (The Deflection Matrix)
// ----------------------------------------------------
export function makeFab1(): LevelData {
  const w = 11;
  const h = 9;
  // Central solid divider at x=5, with single doorway at (5, 4)
  // Left side: wormhole at (2, 7). Right side: exit at (8, 2).
  // Target Lv.3 chip at (7, 6).
  // Column 8 slides down into bottom wall at (8, 7), so to hit (7, 6),
  // player needs a chip to stop or redirect it, or navigate properly!
  const walls: [number, number][] = [
    [5, 1], [5, 2], [5, 3], /* [5, 4] doorway */ [5, 5], [5, 6], [5, 7],
    [3, 3], [7, 3], // Baffle posts
  ];
  const grid = createBoundedRoom(w, h, walls);
  const wormholes: WormholePair[] = [
    { id: 1, a: { x: 2, y: 7 }, b: { x: 8, y: 2 } },
  ];

  return {
    id: 101,
    chapter: 0,
    chapterName: 'Level.0：極限挑戰工廠',
    title: '量子偏振：重定向矩陣 (The Deflection Matrix)',
    subtitle: '利用動態煞車晶片導引穿越蟲洞的遠程晶片，精準對撞合成',
    width: w,
    height: h,
    playerStart: { x: 1, y: 1 },
    targetLevel: 4,
    parMoves: 6,
    grid,
    wormholes,
    wraparound: false,
    chips: [
      { x: 1, y: 3, level: 2 },
      { x: 3, y: 1, level: 2 },
      { x: 8, y: 6, level: 3 },
    ],
  };
}

// ----------------------------------------------------
// Fab.2: 雙星蟲洞：莫比烏斯環 (Twin Wormholes: Möbius Circuit)
// ----------------------------------------------------
export function makeFab2(): LevelData {
  const w = 11;
  const h = 9;
  // Two horizontal dividing wall segments separating top and bottom halves,
  // forcing movement through dual cross-wormholes:
  // Pair 1: (2, 2) <-> (8, 6)
  // Pair 2: (8, 2) <-> (2, 6)
  const walls: [number, number][] = [
    [3, 4], [4, 4], [6, 4], [7, 4], // Central wall with center gap at (5, 4)
    [5, 2], [5, 6], // Vertical pillar in center
  ];
  const grid = createBoundedRoom(w, h, walls);
  const wormholes: WormholePair[] = [
    { id: 1, a: { x: 2, y: 2 }, b: { x: 8, y: 6 } },
    { id: 2, a: { x: 8, y: 2 }, b: { x: 2, y: 6 } },
  ];

  return {
    id: 102,
    chapter: 0,
    chapterName: 'Level.0：極限挑戰工廠',
    title: '雙星蟲洞：莫比烏斯環 (Möbius Circuit)',
    subtitle: '雙組對角交叉蟲洞！善用晶片擋塊攔截高速迴圈，促成高階聚變',
    width: w,
    height: h,
    playerStart: { x: 5, y: 4 },
    targetLevel: 5, // 486 DX2
    parMoves: 7,
    grid,
    wormholes,
    wraparound: false,
    chips: [
      { x: 2, y: 3, level: 3 },
      { x: 8, y: 3, level: 3 },
      { x: 2, y: 5, level: 4 },
    ],
  };
}

// ----------------------------------------------------
// Fab.3: 隔空導軌：三室共振 (Three-Chamber Triangulation)
// ----------------------------------------------------
export function makeFab3(): LevelData {
  const w = 11;
  const h = 9;
  // Chamber A: West (x: 1..4, y: 1..7)
  // Chamber B: East-Lower (x: 6..9, y: 5..7) - ENCLOSED! No door for player!
  // Chamber C: East-Upper (x: 6..9, y: 1..3)
  // Divider wall at x=5
  const walls: [number, number][] = [
    [5, 1], [5, 2], [5, 3], /* Doorway to Chamber C at [5, 4] */ [5, 5], [5, 6], [5, 7],
    // Seal Chamber B off completely!
    [6, 4], [7, 4], [8, 4], [9, 4],
  ];
  const grid = createBoundedRoom(w, h, walls);

  // Wormhole 1 enters Chamber B: (2, 7) in Chamber A -> (8, 7) in Chamber B
  // Inside Chamber B: chip waiting at (8, 5)!
  // When chip from Chamber A is pushed down into (2, 7), it emerges at (8, 7) sliding UP!
  // It hits the waiting chip at (8, 5) and merges into Lv.5!
  // Then the merged chip can be pushed through Wormhole 2: (7, 6) in Chamber B -> (7, 2) in Chamber C!
  const wormholes: WormholePair[] = [
    { id: 1, a: { x: 2, y: 7 }, b: { x: 8, y: 7 } },
    { id: 2, a: { x: 7, y: 6 }, b: { x: 7, y: 2 } },
  ];

  return {
    id: 103,
    chapter: 0,
    chapterName: 'Level.0：極限挑戰工廠',
    title: '隔空導軌：三室共振 (Three-Chamber Triangulation)',
    subtitle: '完全密封的無塵密室！遠端遙控晶片穿越雙重蟲洞完成跨室核融',
    width: w,
    height: h,
    playerStart: { x: 1, y: 1 },
    targetLevel: 5, // 486 DX2
    parMoves: 6,
    grid,
    wormholes,
    wraparound: false,
    chips: [
      { x: 2, y: 2, level: 3 }, // In Chamber A
      { x: 4, y: 2, level: 3 }, // In Chamber A
      { x: 8, y: 5, level: 4 }, // In Chamber B (Sealed!)
    ],
  };
}

// ----------------------------------------------------
// Fab.4: 四維偏振：環狀立交 (The Torus Flyover)
// ----------------------------------------------------
export function makeFab4(): LevelData {
  const w = 11;
  const h = 9;
  // Pure wraparound room with NO perimeter walls!
  // Only 4 strategically located obstacle pillars to arrest slides
  const obstacles: [number, number][] = [
    [3, 2], [7, 2],
    [3, 6], [7, 6],
  ];
  const walls: [number, number][] = [
    [5, 4], // Center pivot wall
  ];
  const grid = createWraparoundRoom(w, h, walls, obstacles);
  const wormholes: WormholePair[] = [
    { id: 1, a: { x: 1, y: 4 }, b: { x: 9, y: 4 } },
  ];

  return {
    id: 104,
    chapter: 0,
    chapterName: 'Level.0：極限挑戰工廠',
    title: '四維偏振：環狀立交 (The Torus Flyover)',
    subtitle: '無邊界環狀四維空間 · 善用有限石柱與晶片互為阻擋煞車',
    width: w,
    height: h,
    playerStart: { x: 5, y: 5 },
    targetLevel: 5, // 486 DX2
    parMoves: 7,
    grid,
    wormholes,
    wraparound: true,
    chips: [
      { x: 3, y: 3, level: 3 },
      { x: 7, y: 5, level: 3 },
      { x: 5, y: 2, level: 4 },
    ],
  };
}

testPuzzle('Fab.1', makeFab1());
testPuzzle('Fab.2', makeFab2());
testPuzzle('Fab.3', makeFab3());
testPuzzle('Fab.4', makeFab4());
