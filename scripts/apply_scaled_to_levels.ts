import * as fs from 'fs';
import { LEVELS } from '../src/data/levels';

function createOpenGrid(w: number, h: number, walls: [number, number][] = []): any[][] {
  const grid: any[][] = [];
  for (let y = 0; y < h; y++) {
    const row: any[] = [];
    for (let x = 0; x < w; x++) {
      row.push('EMPTY');
    }
    grid.push(row);
  }
  for (const [wx, wy] of walls) {
    if (grid[wy] && grid[wy][wx] !== undefined) {
      grid[wy][wx] = 'WALL';
    }
  }
  return grid;
}

const scaledData = JSON.parse(fs.readFileSync('scripts/scaled_results.json', 'utf8'));

// Desktop & Mobile wall layouts
const wallLayouts: Record<number, { dtWalls: [number, number][]; mbWalls: [number, number][]; dtWorms: any[]; mbWorms: any[] }> = {
  16: {
    dtWalls: [
      [10, 2], [10, 3], [10, 4], [10, 5],
      [10, 13], [10, 14], [10, 15], [10, 16],
      [5, 5], [15, 5], [5, 13], [15, 13],
    ],
    mbWalls: [
      [7, 2], [7, 3], [7, 4], [7, 5],
      [7, 13], [7, 14], [7, 15], [7, 16],
      [3, 5], [11, 5], [3, 13], [11, 13],
    ],
    dtWorms: [],
    mbWorms: [],
  },
  17: {
    dtWalls: [
      [10, 4], [7, 8], [13, 8], [5, 12], [15, 12], [8, 15], [12, 15],
    ],
    mbWalls: [
      [7, 4], [5, 8], [9, 8], [3, 12], [11, 12], [5, 15], [9, 15],
    ],
    dtWorms: [{ id: 1, a: { x: 3, y: 9 }, b: { x: 17, y: 9 } }],
    mbWorms: [{ id: 1, a: { x: 2, y: 9 }, b: { x: 12, y: 9 } }],
  },
  18: {
    dtWalls: [
      [9, 9], [11, 9], [9, 11], [11, 11],
      [5, 5], [15, 5], [5, 15], [15, 15],
    ],
    mbWalls: [
      [6, 9], [8, 9], [6, 11], [8, 11],
      [3, 4], [11, 4], [3, 16], [11, 16],
    ],
    dtWorms: [{ id: 1, a: { x: 4, y: 4 }, b: { x: 16, y: 16 } }],
    mbWorms: [{ id: 1, a: { x: 3, y: 3 }, b: { x: 11, y: 17 } }],
  },
  22: {
    dtWalls: [
      [5, 7], [6, 7], [7, 7],
      [13, 13], [14, 13], [15, 13],
      [7, 14], [7, 15],
      [13, 5], [13, 6],
      [10, 10],
    ],
    mbWalls: [
      [3, 6], [4, 6], [5, 6],
      [9, 14], [10, 14], [11, 14],
      [5, 15], [5, 16],
      [9, 4], [9, 5],
      [7, 10],
    ],
    dtWorms: [
      { id: 1, a: { x: 4, y: 4 }, b: { x: 16, y: 16 } },
      { id: 2, a: { x: 3, y: 17 }, b: { x: 17, y: 3 } },
    ],
    mbWorms: [
      { id: 1, a: { x: 3, y: 3 }, b: { x: 11, y: 17 } },
      { id: 2, a: { x: 2, y: 17 }, b: { x: 12, y: 3 } },
    ],
  },
  23: {
    dtWalls: [
      [7, 7], [13, 7], [7, 13], [13, 13], [10, 3], [10, 17],
    ],
    mbWalls: [
      [4, 7], [10, 7], [4, 13], [10, 13], [7, 3], [7, 17],
    ],
    dtWorms: [
      { id: 1, a: { x: 3, y: 7 }, b: { x: 17, y: 7 } },
      { id: 2, a: { x: 7, y: 3 }, b: { x: 7, y: 17 } },
      { id: 3, a: { x: 13, y: 3 }, b: { x: 13, y: 17 } },
    ],
    mbWorms: [
      { id: 1, a: { x: 2, y: 7 }, b: { x: 12, y: 7 } },
      { id: 2, a: { x: 4, y: 3 }, b: { x: 4, y: 17 } },
      { id: 3, a: { x: 10, y: 3 }, b: { x: 10, y: 17 } },
    ],
  },
  24: {
    dtWalls: [
      [4, 4], [16, 4], [4, 16], [16, 16],
      [10, 7], [10, 13], [7, 10], [13, 10],
    ],
    mbWalls: [
      [3, 4], [11, 4], [3, 16], [11, 16],
      [7, 8], [7, 12], [4, 10], [10, 10],
    ],
    dtWorms: [
      { id: 1, a: { x: 3, y: 10 }, b: { x: 17, y: 10 } },
      { id: 2, a: { x: 10, y: 3 }, b: { x: 10, y: 17 } },
      { id: 3, a: { x: 5, y: 5 }, b: { x: 15, y: 15 } },
    ],
    mbWorms: [
      { id: 1, a: { x: 2, y: 10 }, b: { x: 12, y: 10 } },
      { id: 2, a: { x: 7, y: 3 }, b: { x: 7, y: 17 } },
      { id: 3, a: { x: 3, y: 5 }, b: { x: 11, y: 15 } },
    ],
  },
};

const updatedLevels = LEVELS.map((lvl) => {
  if (!scaledData[lvl.id]) return lvl;

  const res = scaledData[lvl.id];
  const wl = wallLayouts[lvl.id];

  const dtW = res.desktop.chips.length === 16 ? 21 : 21;
  const dtH = lvl.id <= 17 ? 19 : 21;
  const mbW = 15;
  const mbH = lvl.id <= 17 ? 19 : 21;

  const dtGrid = createOpenGrid(dtW, dtH, wl.dtWalls);
  const mbGrid = createOpenGrid(mbW, mbH, wl.mbWalls);

  return {
    ...lvl,
    width: dtW,
    height: dtH,
    subtitle: `${dtW}×${dtH} 巨型空間 (手機 ${mbW}×${mbH}) · ${res.desktop.chips.length}顆晶片連鎖升級`,
    grid: dtGrid,
    chips: res.desktop.chips,
    playerStart: res.desktop.playerStart,
    wormholes: wl.dtWorms,
    solutionSteps: res.desktop.solutionSteps,
    parMoves: res.desktop.parMoves,
    mobileVariant: {
      width: mbW,
      height: mbH,
      grid: mbGrid,
      chips: res.mobile.chips,
      playerStart: res.mobile.playerStart,
      wormholes: wl.mbWorms,
      solutionSteps: res.mobile.solutionSteps,
      parMoves: res.mobile.parMoves,
    },
  };
});

// Write to src/data/levels.ts
const fileContent = `import { LevelData, CellType } from '../types/game';

// Helper to construct a room with outer perimeter walls
function createEmptyRoom(w: number, h: number, extraWalls: [number, number][] = []): CellType[][] {
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
    if (grid[wy] && grid[wy][wx] !== undefined) {
      grid[wy][wx] = 'WALL';
    }
  }
  return grid;
}

// Helper to construct a room with partial boundary walls (e.g. 1/3 coverage, 2 segments per edge)
function createPartialBoundaryRoom(
  w: number,
  h: number,
  boundaryWalls: [number, number][],
  interiorWalls: [number, number][]
): CellType[][] {
  const grid: CellType[][] = [];
  for (let y = 0; y < h; y++) {
    const row: CellType[] = [];
    for (let x = 0; x < w; x++) {
      row.push('EMPTY');
    }
    grid.push(row);
  }
  for (const [bx, by] of boundaryWalls) {
    if (grid[by] && grid[by][bx] !== undefined) {
      grid[by][bx] = 'WALL';
    }
  }
  for (const [ix, iy] of interiorWalls) {
    if (grid[iy] && grid[iy][ix] !== undefined) {
      grid[iy][ix] = 'WALL';
    }
  }
  return grid;
}

export interface LevelSolutionStep {
  standX: number;
  standY: number;
  dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  chipX: number;
  chipY: number;
  chipLevel: number;
  merged: boolean;
}

export interface VerifiedLevelData extends LevelData {
  solutionSteps?: LevelSolutionStep[];
}

export const LEVELS: VerifiedLevelData[] = ${JSON.stringify(updatedLevels, null, 2)};
`;

fs.writeFileSync('src/data/levels.ts', fileContent);
console.log('Successfully updated src/data/levels.ts with Desktop & Mobile scaled variants!');
