import { LevelData, CellType } from '../types/game';

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

export const LEVELS: VerifiedLevelData[] = [
  {
    "id": 0,
    "fabIndex": 0,
    "chapter": 0,
    "chapterName": "Level.0：極限挑戰工廠",
    "title": "Fab.0 - 晶片創世紀",
    "subtitle": "15×15 晶圓廠巨型無塵室 · 四邊 1/3 短牆與環形空間 · 合成超級電腦",
    "width": 15,
    "height": 15,
    "playerStart": {
      "x": 7,
      "y": 7
    },
    "targetLevel": 8,
    "parMoves": 27,
    "wraparound": true,
    "grid": [
      [
        "EMPTY",
        "EMPTY",
        "WALL",
        "WALL",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "WALL",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ]
    ],
    "chips": [
      {
        "x": 3,
        "y": 2,
        "level": 1
      },
      {
        "x": 6,
        "y": 2,
        "level": 1
      },
      {
        "x": 8,
        "y": 2,
        "level": 1
      },
      {
        "x": 11,
        "y": 2,
        "level": 1
      },
      {
        "x": 3,
        "y": 12,
        "level": 1
      },
      {
        "x": 6,
        "y": 12,
        "level": 1
      },
      {
        "x": 8,
        "y": 12,
        "level": 1
      },
      {
        "x": 11,
        "y": 12,
        "level": 1
      },
      {
        "x": 2,
        "y": 5,
        "level": 2
      },
      {
        "x": 5,
        "y": 5,
        "level": 2
      },
      {
        "x": 9,
        "y": 5,
        "level": 2
      },
      {
        "x": 12,
        "y": 5,
        "level": 2
      },
      {
        "x": 3,
        "y": 8,
        "level": 3
      },
      {
        "x": 11,
        "y": 8,
        "level": 3
      },
      {
        "x": 7,
        "y": 4,
        "level": 4
      },
      {
        "x": 5,
        "y": 9,
        "level": 6
      },
      {
        "x": 9,
        "y": 9,
        "level": 7
      }
    ],
    "solutionSteps": [
      {
        "standX": 6,
        "standY": 5,
        "dir": "LEFT",
        "chipX": 5,
        "chipY": 5,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 2,
        "standY": 2,
        "dir": "RIGHT",
        "chipX": 3,
        "chipY": 2,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 12,
        "standY": 2,
        "dir": "LEFT",
        "chipX": 11,
        "chipY": 2,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 2,
        "standY": 12,
        "dir": "RIGHT",
        "chipX": 3,
        "chipY": 12,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 6,
        "standY": 13,
        "dir": "UP",
        "chipX": 6,
        "chipY": 12,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 12,
        "standY": 12,
        "dir": "LEFT",
        "chipX": 11,
        "chipY": 12,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 8,
        "standY": 13,
        "dir": "UP",
        "chipX": 8,
        "chipY": 12,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 3,
        "standY": 9,
        "dir": "UP",
        "chipX": 3,
        "chipY": 8,
        "chipLevel": 3,
        "merged": false
      },
      {
        "standX": 5,
        "standY": 2,
        "dir": "RIGHT",
        "chipX": 6,
        "chipY": 2,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 13,
        "standY": 5,
        "dir": "LEFT",
        "chipX": 12,
        "chipY": 5,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 1,
        "standY": 5,
        "dir": "RIGHT",
        "chipX": 2,
        "chipY": 5,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 11,
        "standY": 9,
        "dir": "UP",
        "chipX": 11,
        "chipY": 8,
        "chipLevel": 3,
        "merged": false
      },
      {
        "standX": 2,
        "standY": 5,
        "dir": "RIGHT",
        "chipX": 3,
        "chipY": 5,
        "chipLevel": 4,
        "merged": false
      },
      {
        "standX": 12,
        "standY": 5,
        "dir": "LEFT",
        "chipX": 11,
        "chipY": 5,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 10,
        "standY": 5,
        "dir": "LEFT",
        "chipX": 9,
        "chipY": 5,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 8,
        "standY": 1,
        "dir": "DOWN",
        "chipX": 8,
        "chipY": 2,
        "chipLevel": 4,
        "merged": false
      },
      {
        "standX": 4,
        "standY": 9,
        "dir": "RIGHT",
        "chipX": 5,
        "chipY": 9,
        "chipLevel": 6,
        "merged": false
      },
      {
        "standX": 6,
        "standY": 4,
        "dir": "RIGHT",
        "chipX": 7,
        "chipY": 4,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 8,
        "standY": 3,
        "dir": "DOWN",
        "chipX": 8,
        "chipY": 4,
        "chipLevel": 5,
        "merged": true
      },
      {
        "standX": 8,
        "standY": 6,
        "dir": "UP",
        "chipX": 8,
        "chipY": 5,
        "chipLevel": 6,
        "merged": true
      },
      {
        "standX": 7,
        "standY": 9,
        "dir": "RIGHT",
        "chipX": 8,
        "chipY": 9,
        "chipLevel": 7,
        "merged": true
      }
    ],
    "hint": "Fab.0 四周邊界各留約 1/3 的兩段短牆壁，其餘為環狀穿越邊界。善用短牆煞停並將周圍晶片引導對撞，逐級連鎖推升至 Titan 超級電腦！"
  },
  {
    "id": 101,
    "fabIndex": 1,
    "chapter": 0,
    "chapterName": "Level.0：極限挑戰工廠",
    "title": "動態偏振：動量攔截 (The Momentum Interceptor)",
    "subtitle": "15×15 雙室超導走廊 · 20顆高頻晶片連鎖對撞 · 透過蟲洞跨區定向傳送與動量攔截",
    "width": 15,
    "height": 15,
    "playerStart": {
      "x": 1,
      "y": 1
    },
    "targetLevel": 7,
    "parMoves": 23,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "wormholes": [
      {
        "id": 1,
        "a": {
          "x": 3,
          "y": 11
        },
        "b": {
          "x": 11,
          "y": 3
        }
      }
    ],
    "wraparound": false,
    "chips": [
      {
        "x": 7,
        "y": 7,
        "level": 4
      },
      {
        "x": 3,
        "y": 7,
        "level": 3
      },
      {
        "x": 3,
        "y": 6,
        "level": 3
      },
      {
        "x": 5,
        "y": 7,
        "level": 3
      },
      {
        "x": 8,
        "y": 7,
        "level": 2
      },
      {
        "x": 3,
        "y": 8,
        "level": 3
      },
      {
        "x": 2,
        "y": 8,
        "level": 2
      },
      {
        "x": 5,
        "y": 4,
        "level": 3
      },
      {
        "x": 2,
        "y": 6,
        "level": 4
      },
      {
        "x": 2,
        "y": 10,
        "level": 1
      },
      {
        "x": 2,
        "y": 11,
        "level": 1
      },
      {
        "x": 4,
        "y": 6,
        "level": 2
      },
      {
        "x": 5,
        "y": 6,
        "level": 2
      },
      {
        "x": 5,
        "y": 3,
        "level": 2
      },
      {
        "x": 5,
        "y": 9,
        "level": 3
      },
      {
        "x": 2,
        "y": 7,
        "level": 3
      },
      {
        "x": 5,
        "y": 2,
        "level": 2
      },
      {
        "x": 8,
        "y": 3,
        "level": 2
      },
      {
        "x": 6,
        "y": 11,
        "level": 2
      },
      {
        "x": 8,
        "y": 5,
        "level": 2
      }
    ],
    "solutionSteps": [
      {
        "standX": 8,
        "standY": 4,
        "dir": "DOWN",
        "chipX": 8,
        "chipY": 5,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 7,
        "standY": 11,
        "dir": "LEFT",
        "chipX": 6,
        "chipY": 11,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 8,
        "standY": 2,
        "dir": "DOWN",
        "chipX": 8,
        "chipY": 3,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 5,
        "standY": 1,
        "dir": "DOWN",
        "chipX": 5,
        "chipY": 2,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 1,
        "standY": 7,
        "dir": "RIGHT",
        "chipX": 2,
        "chipY": 7,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 5,
        "standY": 10,
        "dir": "UP",
        "chipX": 5,
        "chipY": 9,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 5,
        "standY": 2,
        "dir": "DOWN",
        "chipX": 5,
        "chipY": 3,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 6,
        "standY": 6,
        "dir": "LEFT",
        "chipX": 5,
        "chipY": 6,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 5,
        "standY": 6,
        "dir": "LEFT",
        "chipX": 4,
        "chipY": 6,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 2,
        "standY": 12,
        "dir": "UP",
        "chipX": 2,
        "chipY": 11,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 2,
        "standY": 11,
        "dir": "UP",
        "chipX": 2,
        "chipY": 10,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 1,
        "standY": 6,
        "dir": "RIGHT",
        "chipX": 2,
        "chipY": 6,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 5,
        "standY": 3,
        "dir": "DOWN",
        "chipX": 5,
        "chipY": 4,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 1,
        "standY": 8,
        "dir": "RIGHT",
        "chipX": 2,
        "chipY": 8,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 3,
        "standY": 9,
        "dir": "UP",
        "chipX": 3,
        "chipY": 8,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 9,
        "standY": 7,
        "dir": "LEFT",
        "chipX": 8,
        "chipY": 7,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 4,
        "standY": 7,
        "dir": "RIGHT",
        "chipX": 5,
        "chipY": 7,
        "chipLevel": 5,
        "merged": true
      },
      {
        "standX": 3,
        "standY": 5,
        "dir": "DOWN",
        "chipX": 3,
        "chipY": 6,
        "chipLevel": 5,
        "merged": true
      },
      {
        "standX": 2,
        "standY": 7,
        "dir": "RIGHT",
        "chipX": 3,
        "chipY": 7,
        "chipLevel": 6,
        "merged": true
      }
    ],
    "hint": "巨大雙室隔離工廠中分佈著 20 顆運算單元。善用隔離牆門廊調整站位，並利用右側晶片攔截穿過蟲洞的滑行晶片，步步聚變成 Core 2 Duo！"
  },
  {
    "id": 102,
    "fabIndex": 2,
    "chapter": 0,
    "chapterName": "Level.0：極限挑戰工廠",
    "title": "莫比烏斯環：雙星蟲洞 (Möbius Circuit)",
    "subtitle": "15×15 雙組對角交叉蟲洞 · 20顆晶片矩陣 · 晶片互為動態路障，在四維維度中迴旋交錯",
    "width": 15,
    "height": 15,
    "playerStart": {
      "x": 1,
      "y": 1
    },
    "targetLevel": 7,
    "parMoves": 23,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "wormholes": [
      {
        "id": 1,
        "a": {
          "x": 2,
          "y": 12
        },
        "b": {
          "x": 12,
          "y": 2
        }
      },
      {
        "id": 2,
        "a": {
          "x": 12,
          "y": 12
        },
        "b": {
          "x": 2,
          "y": 2
        }
      }
    ],
    "wraparound": false,
    "chips": [
      {
        "x": 7,
        "y": 7,
        "level": 4
      },
      {
        "x": 7,
        "y": 8,
        "level": 4
      },
      {
        "x": 8,
        "y": 8,
        "level": 2
      },
      {
        "x": 8,
        "y": 7,
        "level": 1
      },
      {
        "x": 8,
        "y": 4,
        "level": 3
      },
      {
        "x": 8,
        "y": 6,
        "level": 1
      },
      {
        "x": 6,
        "y": 7,
        "level": 3
      },
      {
        "x": 8,
        "y": 9,
        "level": 1
      },
      {
        "x": 9,
        "y": 9,
        "level": 1
      },
      {
        "x": 10,
        "y": 8,
        "level": 1
      },
      {
        "x": 7,
        "y": 9,
        "level": 1
      },
      {
        "x": 6,
        "y": 6,
        "level": 1
      },
      {
        "x": 7,
        "y": 6,
        "level": 4
      },
      {
        "x": 4,
        "y": 8,
        "level": 3
      },
      {
        "x": 9,
        "y": 7,
        "level": 1
      },
      {
        "x": 11,
        "y": 8,
        "level": 1
      },
      {
        "x": 6,
        "y": 8,
        "level": 4
      },
      {
        "x": 5,
        "y": 7,
        "level": 3
      },
      {
        "x": 9,
        "y": 11,
        "level": 1
      },
      {
        "x": 3,
        "y": 8,
        "level": 3
      }
    ],
    "solutionSteps": [
      {
        "standX": 2,
        "standY": 8,
        "dir": "RIGHT",
        "chipX": 3,
        "chipY": 8,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 9,
        "standY": 12,
        "dir": "UP",
        "chipX": 9,
        "chipY": 11,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 4,
        "standY": 7,
        "dir": "RIGHT",
        "chipX": 5,
        "chipY": 7,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 6,
        "standY": 9,
        "dir": "UP",
        "chipX": 6,
        "chipY": 8,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 12,
        "standY": 8,
        "dir": "LEFT",
        "chipX": 11,
        "chipY": 8,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 10,
        "standY": 7,
        "dir": "LEFT",
        "chipX": 9,
        "chipY": 7,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 3,
        "standY": 8,
        "dir": "RIGHT",
        "chipX": 4,
        "chipY": 8,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 7,
        "standY": 5,
        "dir": "DOWN",
        "chipX": 7,
        "chipY": 6,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 5,
        "standY": 6,
        "dir": "RIGHT",
        "chipX": 6,
        "chipY": 6,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 6,
        "standY": 9,
        "dir": "RIGHT",
        "chipX": 7,
        "chipY": 9,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 11,
        "standY": 8,
        "dir": "LEFT",
        "chipX": 10,
        "chipY": 8,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 10,
        "standY": 9,
        "dir": "LEFT",
        "chipX": 9,
        "chipY": 9,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 8,
        "standY": 10,
        "dir": "UP",
        "chipX": 8,
        "chipY": 9,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 5,
        "standY": 7,
        "dir": "RIGHT",
        "chipX": 6,
        "chipY": 7,
        "chipLevel": 5,
        "merged": true
      },
      {
        "standX": 8,
        "standY": 5,
        "dir": "DOWN",
        "chipX": 8,
        "chipY": 6,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 8,
        "standY": 3,
        "dir": "DOWN",
        "chipX": 8,
        "chipY": 4,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 8,
        "standY": 6,
        "dir": "DOWN",
        "chipX": 8,
        "chipY": 7,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 9,
        "standY": 8,
        "dir": "LEFT",
        "chipX": 8,
        "chipY": 8,
        "chipLevel": 5,
        "merged": true
      },
      {
        "standX": 7,
        "standY": 9,
        "dir": "UP",
        "chipX": 7,
        "chipY": 8,
        "chipLevel": 6,
        "merged": true
      }
    ],
    "hint": "雙重交叉蟲洞在 15×15 工廠中形成巨大的空間折躍環！當晶片飛出蟲洞時，必須依靠停在著陸射線上的晶片擋塊攔截，否則會滑向死角。"
  },
  {
    "id": 103,
    "fabIndex": 3,
    "chapter": 0,
    "chapterName": "Level.0：極限挑戰工廠",
    "title": "三室共振：隔空導軌 (Three-Chamber Triangulation)",
    "subtitle": "15×15 三隔間大型佈局 · 20顆晶片多維推演 · 善用晶片擋塊與雙向蟲洞定向傳送",
    "width": 15,
    "height": 15,
    "playerStart": {
      "x": 1,
      "y": 1
    },
    "targetLevel": 7,
    "parMoves": 23,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "wormholes": [
      {
        "id": 1,
        "a": {
          "x": 2,
          "y": 12
        },
        "b": {
          "x": 12,
          "y": 2
        }
      },
      {
        "id": 2,
        "a": {
          "x": 7,
          "y": 2
        },
        "b": {
          "x": 7,
          "y": 12
        }
      }
    ],
    "wraparound": false,
    "chips": [
      {
        "x": 7,
        "y": 7,
        "level": 3
      },
      {
        "x": 10,
        "y": 7,
        "level": 5
      },
      {
        "x": 7,
        "y": 6,
        "level": 4
      },
      {
        "x": 9,
        "y": 7,
        "level": 2
      },
      {
        "x": 7,
        "y": 8,
        "level": 3
      },
      {
        "x": 6,
        "y": 8,
        "level": 1
      },
      {
        "x": 4,
        "y": 7,
        "level": 3
      },
      {
        "x": 6,
        "y": 7,
        "level": 1
      },
      {
        "x": 9,
        "y": 8,
        "level": 4
      },
      {
        "x": 9,
        "y": 4,
        "level": 2
      },
      {
        "x": 9,
        "y": 2,
        "level": 1
      },
      {
        "x": 6,
        "y": 6,
        "level": 1
      },
      {
        "x": 8,
        "y": 6,
        "level": 2
      },
      {
        "x": 8,
        "y": 3,
        "level": 1
      },
      {
        "x": 6,
        "y": 12,
        "level": 1
      },
      {
        "x": 8,
        "y": 4,
        "level": 2
      },
      {
        "x": 6,
        "y": 3,
        "level": 1
      },
      {
        "x": 8,
        "y": 7,
        "level": 2
      },
      {
        "x": 9,
        "y": 6,
        "level": 2
      },
      {
        "x": 10,
        "y": 2,
        "level": 1
      }
    ],
    "solutionSteps": [
      {
        "standX": 11,
        "standY": 2,
        "dir": "LEFT",
        "chipX": 10,
        "chipY": 2,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 9,
        "standY": 5,
        "dir": "DOWN",
        "chipX": 9,
        "chipY": 6,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 8,
        "standY": 8,
        "dir": "UP",
        "chipX": 8,
        "chipY": 7,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 5,
        "standY": 3,
        "dir": "RIGHT",
        "chipX": 6,
        "chipY": 3,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 8,
        "standY": 5,
        "dir": "UP",
        "chipX": 8,
        "chipY": 4,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 6,
        "standY": 13,
        "dir": "UP",
        "chipX": 6,
        "chipY": 12,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 8,
        "standY": 2,
        "dir": "DOWN",
        "chipX": 8,
        "chipY": 3,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 9,
        "standY": 6,
        "dir": "LEFT",
        "chipX": 8,
        "chipY": 6,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 6,
        "standY": 5,
        "dir": "DOWN",
        "chipX": 6,
        "chipY": 6,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 9,
        "standY": 1,
        "dir": "DOWN",
        "chipX": 9,
        "chipY": 2,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 9,
        "standY": 3,
        "dir": "DOWN",
        "chipX": 9,
        "chipY": 4,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 9,
        "standY": 9,
        "dir": "UP",
        "chipX": 9,
        "chipY": 8,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 6,
        "standY": 6,
        "dir": "DOWN",
        "chipX": 6,
        "chipY": 7,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 3,
        "standY": 7,
        "dir": "RIGHT",
        "chipX": 4,
        "chipY": 7,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 5,
        "standY": 8,
        "dir": "RIGHT",
        "chipX": 6,
        "chipY": 8,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 7,
        "standY": 9,
        "dir": "UP",
        "chipX": 7,
        "chipY": 8,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 8,
        "standY": 7,
        "dir": "RIGHT",
        "chipX": 9,
        "chipY": 7,
        "chipLevel": 5,
        "merged": true
      },
      {
        "standX": 7,
        "standY": 5,
        "dir": "DOWN",
        "chipX": 7,
        "chipY": 6,
        "chipLevel": 5,
        "merged": true
      },
      {
        "standX": 11,
        "standY": 7,
        "dir": "LEFT",
        "chipX": 10,
        "chipY": 7,
        "chipLevel": 6,
        "merged": true
      }
    ],
    "hint": "工廠由兩堵重型隔離牆分為左、中、右三室。利用中央走廊的避障立柱煞車，並巧妙將晶片定位在通道口，讓滑行晶片能穿越隔間抵達蟲洞！"
  },
  {
    "id": 104,
    "fabIndex": 4,
    "chapter": 0,
    "chapterName": "Level.0：極限挑戰工廠",
    "title": "拓撲引力：環狀四維軌 (The Torus Flyover)",
    "subtitle": "15×15 無邊界環狀四維空間 · 20顆晶片浩瀚星雲 · 善用有限石柱與晶片互為阻擋煞車",
    "width": 15,
    "height": 15,
    "playerStart": {
      "x": 1,
      "y": 1
    },
    "targetLevel": 8,
    "parMoves": 23,
    "grid": [
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "OBSTACLE",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "OBSTACLE",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "OBSTACLE",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "OBSTACLE",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "OBSTACLE",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "OBSTACLE",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "OBSTACLE",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "OBSTACLE",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ]
    ],
    "wormholes": [
      {
        "id": 1,
        "a": {
          "x": 2,
          "y": 7
        },
        "b": {
          "x": 12,
          "y": 7
        }
      }
    ],
    "wraparound": true,
    "chips": [
      {
        "x": 7,
        "y": 6,
        "level": 3
      },
      {
        "x": 7,
        "y": 5,
        "level": 6
      },
      {
        "x": 11,
        "y": 5,
        "level": 5
      },
      {
        "x": 0,
        "y": 6,
        "level": 5
      },
      {
        "x": 4,
        "y": 6,
        "level": 3
      },
      {
        "x": 11,
        "y": 10,
        "level": 3
      },
      {
        "x": 0,
        "y": 10,
        "level": 2
      },
      {
        "x": 0,
        "y": 1,
        "level": 2
      },
      {
        "x": 0,
        "y": 13,
        "level": 1
      },
      {
        "x": 6,
        "y": 6,
        "level": 4
      },
      {
        "x": 14,
        "y": 10,
        "level": 2
      },
      {
        "x": 2,
        "y": 6,
        "level": 2
      },
      {
        "x": 0,
        "y": 14,
        "level": 1
      },
      {
        "x": 12,
        "y": 10,
        "level": 3
      },
      {
        "x": 4,
        "y": 7,
        "level": 2
      },
      {
        "x": 2,
        "y": 4,
        "level": 3
      },
      {
        "x": 0,
        "y": 5,
        "level": 5
      },
      {
        "x": 10,
        "y": 6,
        "level": 3
      },
      {
        "x": 4,
        "y": 8,
        "level": 2
      },
      {
        "x": 12,
        "y": 8,
        "level": 2
      }
    ],
    "solutionSteps": [
      {
        "standX": 12,
        "standY": 9,
        "dir": "UP",
        "chipX": 12,
        "chipY": 8,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 4,
        "standY": 9,
        "dir": "UP",
        "chipX": 4,
        "chipY": 8,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 11,
        "standY": 6,
        "dir": "LEFT",
        "chipX": 10,
        "chipY": 6,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 0,
        "standY": 4,
        "dir": "DOWN",
        "chipX": 0,
        "chipY": 5,
        "chipLevel": 5,
        "merged": true
      },
      {
        "standX": 2,
        "standY": 3,
        "dir": "DOWN",
        "chipX": 2,
        "chipY": 4,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 4,
        "standY": 8,
        "dir": "UP",
        "chipX": 4,
        "chipY": 7,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 13,
        "standY": 10,
        "dir": "LEFT",
        "chipX": 12,
        "chipY": 10,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 0,
        "standY": 0,
        "dir": "UP",
        "chipX": 0,
        "chipY": 14,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 1,
        "standY": 6,
        "dir": "RIGHT",
        "chipX": 2,
        "chipY": 6,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 13,
        "standY": 10,
        "dir": "RIGHT",
        "chipX": 14,
        "chipY": 10,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 5,
        "standY": 6,
        "dir": "RIGHT",
        "chipX": 6,
        "chipY": 6,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 0,
        "standY": 12,
        "dir": "DOWN",
        "chipX": 0,
        "chipY": 13,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 0,
        "standY": 2,
        "dir": "UP",
        "chipX": 0,
        "chipY": 1,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 1,
        "standY": 10,
        "dir": "LEFT",
        "chipX": 0,
        "chipY": 10,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 11,
        "standY": 9,
        "dir": "DOWN",
        "chipX": 11,
        "chipY": 10,
        "chipLevel": 5,
        "merged": true
      },
      {
        "standX": 3,
        "standY": 6,
        "dir": "RIGHT",
        "chipX": 4,
        "chipY": 6,
        "chipLevel": 5,
        "merged": true
      },
      {
        "standX": 14,
        "standY": 6,
        "dir": "RIGHT",
        "chipX": 0,
        "chipY": 6,
        "chipLevel": 6,
        "merged": true
      },
      {
        "standX": 12,
        "standY": 5,
        "dir": "LEFT",
        "chipX": 11,
        "chipY": 5,
        "chipLevel": 6,
        "merged": true
      },
      {
        "standX": 7,
        "standY": 4,
        "dir": "DOWN",
        "chipX": 7,
        "chipY": 5,
        "chipLevel": 7,
        "merged": true
      }
    ],
    "hint": "完全沒有外牆的 15×15 環狀四維浩瀚星空！晶片一旦滑行就會無限循環繞行。必須利用場中八座石柱與晶片互為路障，一路聚變成 Titan 超級電腦！"
  },
  {
    "id": 105,
    "fabIndex": 5,
    "chapter": 0,
    "chapterName": "Level.0：極限挑戰工廠",
    "title": "終極超核：奇點反應爐 (The Hypercore Singularity)",
    "subtitle": "15×15 巨型奇點反應爐 · 20顆高能單元連鎖核融 · 雙對角蟲洞導流合成 Titan 超級電腦",
    "width": 15,
    "height": 15,
    "playerStart": {
      "x": 1,
      "y": 1
    },
    "targetLevel": 8,
    "parMoves": 23,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "wormholes": [
      {
        "id": 1,
        "a": {
          "x": 2,
          "y": 2
        },
        "b": {
          "x": 12,
          "y": 12
        }
      },
      {
        "id": 2,
        "a": {
          "x": 12,
          "y": 2
        },
        "b": {
          "x": 2,
          "y": 12
        }
      }
    ],
    "wraparound": false,
    "chips": [
      {
        "x": 7,
        "y": 7,
        "level": 4
      },
      {
        "x": 7,
        "y": 5,
        "level": 7
      },
      {
        "x": 8,
        "y": 7,
        "level": 3
      },
      {
        "x": 6,
        "y": 7,
        "level": 1
      },
      {
        "x": 7,
        "y": 8,
        "level": 3
      },
      {
        "x": 2,
        "y": 8,
        "level": 1
      },
      {
        "x": 4,
        "y": 8,
        "level": 1
      },
      {
        "x": 6,
        "y": 5,
        "level": 3
      },
      {
        "x": 6,
        "y": 4,
        "level": 3
      },
      {
        "x": 6,
        "y": 11,
        "level": 2
      },
      {
        "x": 6,
        "y": 8,
        "level": 1
      },
      {
        "x": 8,
        "y": 6,
        "level": 4
      },
      {
        "x": 9,
        "y": 7,
        "level": 4
      },
      {
        "x": 5,
        "y": 11,
        "level": 2
      },
      {
        "x": 4,
        "y": 11,
        "level": 1
      },
      {
        "x": 8,
        "y": 8,
        "level": 3
      },
      {
        "x": 12,
        "y": 4,
        "level": 1
      },
      {
        "x": 5,
        "y": 7,
        "level": 1
      },
      {
        "x": 8,
        "y": 3,
        "level": 4
      },
      {
        "x": 6,
        "y": 9,
        "level": 1
      }
    ],
    "solutionSteps": [
      {
        "standX": 6,
        "standY": 10,
        "dir": "UP",
        "chipX": 6,
        "chipY": 9,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 8,
        "standY": 2,
        "dir": "DOWN",
        "chipX": 8,
        "chipY": 3,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 4,
        "standY": 7,
        "dir": "RIGHT",
        "chipX": 5,
        "chipY": 7,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 12,
        "standY": 3,
        "dir": "DOWN",
        "chipX": 12,
        "chipY": 4,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 8,
        "standY": 9,
        "dir": "UP",
        "chipX": 8,
        "chipY": 8,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 4,
        "standY": 12,
        "dir": "UP",
        "chipX": 4,
        "chipY": 11,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 4,
        "standY": 11,
        "dir": "RIGHT",
        "chipX": 5,
        "chipY": 11,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 10,
        "standY": 7,
        "dir": "LEFT",
        "chipX": 9,
        "chipY": 7,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 8,
        "standY": 5,
        "dir": "DOWN",
        "chipX": 8,
        "chipY": 6,
        "chipLevel": 5,
        "merged": true
      },
      {
        "standX": 6,
        "standY": 9,
        "dir": "UP",
        "chipX": 6,
        "chipY": 8,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 6,
        "standY": 12,
        "dir": "UP",
        "chipX": 6,
        "chipY": 11,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 6,
        "standY": 3,
        "dir": "DOWN",
        "chipX": 6,
        "chipY": 4,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 6,
        "standY": 4,
        "dir": "DOWN",
        "chipX": 6,
        "chipY": 5,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 5,
        "standY": 8,
        "dir": "LEFT",
        "chipX": 4,
        "chipY": 8,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 1,
        "standY": 8,
        "dir": "RIGHT",
        "chipX": 2,
        "chipY": 8,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 7,
        "standY": 9,
        "dir": "UP",
        "chipX": 7,
        "chipY": 8,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 5,
        "standY": 7,
        "dir": "RIGHT",
        "chipX": 6,
        "chipY": 7,
        "chipLevel": 5,
        "merged": true
      },
      {
        "standX": 9,
        "standY": 7,
        "dir": "LEFT",
        "chipX": 8,
        "chipY": 7,
        "chipLevel": 6,
        "merged": true
      },
      {
        "standX": 7,
        "standY": 4,
        "dir": "DOWN",
        "chipX": 7,
        "chipY": 5,
        "chipLevel": 7,
        "merged": true
      }
    ],
    "hint": "15×15 巨型反應爐核心！雙對角蟲洞形成高速能量迴廊。將低階晶片推至走廊作為攔截墊腳石，一步步引導高階處理器在核心熔合為 Titan 超級電腦！"
  },
  {
    "id": 1,
    "chapter": 1,
    "chapterName": "Level.1：基礎合成室",
    "title": "首次通電 (First Contact)",
    "subtitle": "將 4 個 7400 閘晶片兩兩撞擊合併為 SRAM",
    "width": 9,
    "height": 7,
    "playerStart": {
      "x": 7,
      "y": 3
    },
    "targetLevel": 2,
    "parMoves": 1,
    "wraparound": false,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "chips": [
      {
        "x": 1,
        "y": 3,
        "level": 1
      },
      {
        "x": 6,
        "y": 3,
        "level": 1
      }
    ],
    "hint": "走到晶片後方向前推動！晶片會一路滑行並撞擊同級晶片完成合成。",
    "solutionSteps": [
      {
        "standX": 7,
        "standY": 3,
        "dir": "LEFT",
        "chipX": 6,
        "chipY": 3,
        "chipLevel": 1,
        "merged": true
      }
    ]
  },
  {
    "id": 2,
    "chapter": 1,
    "chapterName": "Level.1：基礎合成室",
    "title": "垂直匯流排 (Vertical Bus)",
    "subtitle": "利用縱向軌道完成垂直軸的連續碰撞升級",
    "width": 9,
    "height": 9,
    "playerStart": {
      "x": 3,
      "y": 7
    },
    "targetLevel": 2,
    "parMoves": 1,
    "wraparound": false,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "chips": [
      {
        "x": 3,
        "y": 1,
        "level": 1
      },
      {
        "x": 3,
        "y": 6,
        "level": 1
      }
    ],
    "hint": "善用四周牆壁煞停，並在縱向長廊推動晶片進行垂直對撞！",
    "solutionSteps": [
      {
        "standX": 3,
        "standY": 7,
        "dir": "UP",
        "chipX": 3,
        "chipY": 6,
        "chipLevel": 1,
        "merged": true
      }
    ]
  },
  {
    "id": 3,
    "chapter": 1,
    "chapterName": "Level.1：基礎合成室",
    "title": "三角校準 (Triangle Fusion)",
    "subtitle": "六顆基礎晶片連續合成，突破邁向 8086 微處理器",
    "width": 11,
    "height": 9,
    "playerStart": {
      "x": 3,
      "y": 7
    },
    "targetLevel": 3,
    "parMoves": 3,
    "wraparound": false,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "chips": [
      {
        "x": 3,
        "y": 3,
        "level": 1
      },
      {
        "x": 8,
        "y": 3,
        "level": 1
      },
      {
        "x": 8,
        "y": 6,
        "level": 1
      },
      {
        "x": 3,
        "y": 6,
        "level": 1
      }
    ],
    "hint": "先兩兩碰撞合成二級綠色 SRAM，再將它們推向同一直線軌道合成 8086 CPU！",
    "solutionSteps": [
      {
        "standX": 3,
        "standY": 7,
        "dir": "UP",
        "chipX": 3,
        "chipY": 6,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 8,
        "standY": 7,
        "dir": "UP",
        "chipX": 8,
        "chipY": 6,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 9,
        "standY": 3,
        "dir": "LEFT",
        "chipX": 8,
        "chipY": 3,
        "chipLevel": 2,
        "merged": true
      }
    ]
  },
  {
    "id": 4,
    "chapter": 1,
    "chapterName": "Level.1：基礎合成室",
    "title": "阻擋牆運用 (Wall Bounce)",
    "subtitle": "利用中央阻擋牆改變晶片軌道並在交匯點撞擊升級",
    "width": 11,
    "height": 9,
    "playerStart": {
      "x": 9,
      "y": 1
    },
    "targetLevel": 3,
    "parMoves": 3,
    "wraparound": false,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "chips": [
      {
        "x": 4,
        "y": 1,
        "level": 1
      },
      {
        "x": 4,
        "y": 5,
        "level": 1
      },
      {
        "x": 8,
        "y": 5,
        "level": 1
      },
      {
        "x": 8,
        "y": 1,
        "level": 1
      }
    ],
    "hint": "立柱可做為晶片的剎車煞停點，避免晶片一路衝到底撞牆受阻。",
    "solutionSteps": [
      {
        "standX": 9,
        "standY": 1,
        "dir": "LEFT",
        "chipX": 8,
        "chipY": 1,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 9,
        "standY": 5,
        "dir": "LEFT",
        "chipX": 8,
        "chipY": 5,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 4,
        "standY": 6,
        "dir": "UP",
        "chipX": 4,
        "chipY": 5,
        "chipLevel": 2,
        "merged": true
      }
    ]
  },
  {
    "id": 5,
    "chapter": 1,
    "chapterName": "Level.1：基礎合成室",
    "title": "轉角對齊 (Corner Alignment)",
    "subtitle": "首次解鎖空間蟲洞！穿梭蟲洞引導晶片高速折返相撞",
    "width": 11,
    "height": 9,
    "playerStart": {
      "x": 9,
      "y": 1
    },
    "targetLevel": 3,
    "parMoves": 3,
    "wraparound": false,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "chips": [
      {
        "x": 3,
        "y": 1,
        "level": 1
      },
      {
        "x": 3,
        "y": 6,
        "level": 1
      },
      {
        "x": 8,
        "y": 6,
        "level": 1
      },
      {
        "x": 8,
        "y": 1,
        "level": 1
      }
    ],
    "wormholes": [
      {
        "id": 1,
        "a": {
          "x": 2,
          "y": 4
        },
        "b": {
          "x": 8,
          "y": 4
        }
      }
    ],
    "hint": "蟲洞能將晶片或博士瞬間傳送到另一端！善用蟲洞跨越空間限制。",
    "solutionSteps": [
      {
        "standX": 9,
        "standY": 1,
        "dir": "LEFT",
        "chipX": 8,
        "chipY": 1,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 9,
        "standY": 6,
        "dir": "LEFT",
        "chipX": 8,
        "chipY": 6,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 3,
        "standY": 7,
        "dir": "UP",
        "chipX": 3,
        "chipY": 6,
        "chipLevel": 2,
        "merged": true
      }
    ]
  },
  {
    "id": 6,
    "chapter": 1,
    "chapterName": "Level.1：基礎合成室",
    "title": "SRAM 全面封裝 (SRAM Assembly)",
    "subtitle": "雙象限空間調度：結合蟲洞傳送完成大規模閘晶片封裝",
    "width": 13,
    "height": 9,
    "playerStart": {
      "x": 1,
      "y": 3
    },
    "targetLevel": 3,
    "parMoves": 3,
    "wraparound": false,
    "grid": [
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL"
      ],
      [
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL",
        "WALL"
      ]
    ],
    "chips": [
      {
        "x": 5,
        "y": 3,
        "level": 1
      },
      {
        "x": 10,
        "y": 3,
        "level": 1
      },
      {
        "x": 10,
        "y": 6,
        "level": 1
      },
      {
        "x": 2,
        "y": 3,
        "level": 1
      }
    ],
    "wormholes": [
      {
        "id": 1,
        "a": {
          "x": 3,
          "y": 2
        },
        "b": {
          "x": 9,
          "y": 6
        }
      }
    ],
    "hint": "利用蟲洞將不同區域的晶片傳遞到同一條推動軸線上撞擊！",
    "solutionSteps": [
      {
        "standX": 1,
        "standY": 3,
        "dir": "RIGHT",
        "chipX": 2,
        "chipY": 3,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 10,
        "standY": 7,
        "dir": "UP",
        "chipX": 10,
        "chipY": 6,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 11,
        "standY": 3,
        "dir": "LEFT",
        "chipX": 10,
        "chipY": 3,
        "chipLevel": 2,
        "merged": true
      }
    ]
  },
  {
    "id": 7,
    "chapter": 2,
    "chapterName": "Level.2：電路迴廊",
    "title": "環狀長廊 (The Torus Corridor)",
    "subtitle": "空間邊界已解鎖！向左滑出邊界，將從右側邊緣高速折返！",
    "width": 13,
    "height": 9,
    "playerStart": {
      "x": 7,
      "y": 0
    },
    "targetLevel": 3,
    "parMoves": 3,
    "wraparound": true,
    "grid": [
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ]
    ],
    "chips": [
      {
        "x": 0,
        "y": 0,
        "level": 1
      },
      {
        "x": 0,
        "y": 5,
        "level": 1
      },
      {
        "x": 6,
        "y": 5,
        "level": 1
      },
      {
        "x": 8,
        "y": 0,
        "level": 1
      }
    ],
    "hint": "環狀空間沒有盡頭！滑過右邊界會立即從左側穿越回來，靈活利用折返空間包抄！",
    "solutionSteps": [
      {
        "standX": 7,
        "standY": 0,
        "dir": "RIGHT",
        "chipX": 8,
        "chipY": 0,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 5,
        "standY": 5,
        "dir": "RIGHT",
        "chipX": 6,
        "chipY": 5,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 0,
        "standY": 4,
        "dir": "DOWN",
        "chipX": 0,
        "chipY": 5,
        "chipLevel": 2,
        "merged": true
      }
    ]
  },
  {
    "id": 8,
    "chapter": 2,
    "chapterName": "Level.2：電路迴廊",
    "title": "隔間穿梭 (Chamber Warp)",
    "subtitle": "穿越中央隔間，利用左右邊界環狀折返進行空間包抄",
    "width": 13,
    "height": 11,
    "playerStart": {
      "x": 1,
      "y": 7
    },
    "targetLevel": 4,
    "parMoves": 7,
    "wraparound": true,
    "grid": [
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ]
    ],
    "chips": [
      {
        "x": 8,
        "y": 0,
        "level": 1
      },
      {
        "x": 1,
        "y": 0,
        "level": 1
      },
      {
        "x": 8,
        "y": 5,
        "level": 1
      },
      {
        "x": 1,
        "y": 5,
        "level": 1
      },
      {
        "x": 4,
        "y": 0,
        "level": 1
      },
      {
        "x": 11,
        "y": 0,
        "level": 1
      },
      {
        "x": 11,
        "y": 7,
        "level": 1
      },
      {
        "x": 1,
        "y": 8,
        "level": 1
      }
    ],
    "hint": "善用隔間立柱停住晶片，再從環狀通道推向另一端！",
    "solutionSteps": [
      {
        "standX": 1,
        "standY": 7,
        "dir": "DOWN",
        "chipX": 1,
        "chipY": 8,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 11,
        "standY": 6,
        "dir": "DOWN",
        "chipX": 11,
        "chipY": 7,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 10,
        "standY": 0,
        "dir": "RIGHT",
        "chipX": 11,
        "chipY": 0,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 3,
        "standY": 0,
        "dir": "RIGHT",
        "chipX": 4,
        "chipY": 0,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 0,
        "standY": 5,
        "dir": "RIGHT",
        "chipX": 1,
        "chipY": 5,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 8,
        "standY": 4,
        "dir": "DOWN",
        "chipX": 8,
        "chipY": 5,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 0,
        "standY": 0,
        "dir": "RIGHT",
        "chipX": 1,
        "chipY": 0,
        "chipLevel": 3,
        "merged": true
      }
    ]
  },
  {
    "id": 9,
    "chapter": 2,
    "chapterName": "Level.2：電路迴廊",
    "title": "數學協同處理器 (Math Co-Processor)",
    "subtitle": "多晶片連續對撞，誕生傳奇 80387 數學協同處理器",
    "width": 13,
    "height": 11,
    "playerStart": {
      "x": 7,
      "y": 7
    },
    "targetLevel": 4,
    "parMoves": 7,
    "wraparound": true,
    "grid": [
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ]
    ],
    "chips": [
      {
        "x": 7,
        "y": 0,
        "level": 1
      },
      {
        "x": 7,
        "y": 5,
        "level": 1
      },
      {
        "x": 0,
        "y": 5,
        "level": 1
      },
      {
        "x": 0,
        "y": 10,
        "level": 1
      },
      {
        "x": 3,
        "y": 0,
        "level": 1
      },
      {
        "x": 10,
        "y": 0,
        "level": 1
      },
      {
        "x": 4,
        "y": 5,
        "level": 1
      },
      {
        "x": 7,
        "y": 8,
        "level": 1
      }
    ],
    "hint": "分步合成為四個微處理器，再於中路十字交匯點合成為 80387！",
    "solutionSteps": [
      {
        "standX": 7,
        "standY": 7,
        "dir": "DOWN",
        "chipX": 7,
        "chipY": 8,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 3,
        "standY": 5,
        "dir": "RIGHT",
        "chipX": 4,
        "chipY": 5,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 9,
        "standY": 0,
        "dir": "RIGHT",
        "chipX": 10,
        "chipY": 0,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 2,
        "standY": 0,
        "dir": "RIGHT",
        "chipX": 3,
        "chipY": 0,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 0,
        "standY": 0,
        "dir": "UP",
        "chipX": 0,
        "chipY": 10,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 1,
        "standY": 5,
        "dir": "LEFT",
        "chipX": 0,
        "chipY": 5,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 7,
        "standY": 6,
        "dir": "UP",
        "chipX": 7,
        "chipY": 5,
        "chipLevel": 3,
        "merged": true
      }
    ]
  },
  {
    "id": 10,
    "chapter": 2,
    "chapterName": "Level.2：電路迴廊",
    "title": "迴轉避險 (Turnabout Maneuver)",
    "subtitle": "利用立柱障礙與環狀通道避免晶片受困死角",
    "width": 13,
    "height": 11,
    "playerStart": {
      "x": 0,
      "y": 4
    },
    "targetLevel": 4,
    "parMoves": 7,
    "wraparound": true,
    "grid": [
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ]
    ],
    "chips": [
      {
        "x": 0,
        "y": 0,
        "level": 1
      },
      {
        "x": 6,
        "y": 0,
        "level": 1
      },
      {
        "x": 0,
        "y": 6,
        "level": 1
      },
      {
        "x": 6,
        "y": 6,
        "level": 1
      },
      {
        "x": 10,
        "y": 0,
        "level": 1
      },
      {
        "x": 10,
        "y": 4,
        "level": 1
      },
      {
        "x": 3,
        "y": 0,
        "level": 1
      },
      {
        "x": 0,
        "y": 3,
        "level": 1
      }
    ],
    "hint": "如果晶片繞圈滑回，博士可面對滑來方向迎頭擋下，穩住陣腳！",
    "solutionSteps": [
      {
        "standX": 0,
        "standY": 4,
        "dir": "UP",
        "chipX": 0,
        "chipY": 3,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 2,
        "standY": 0,
        "dir": "RIGHT",
        "chipX": 3,
        "chipY": 0,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 10,
        "standY": 5,
        "dir": "UP",
        "chipX": 10,
        "chipY": 4,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 11,
        "standY": 0,
        "dir": "LEFT",
        "chipX": 10,
        "chipY": 0,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 7,
        "standY": 6,
        "dir": "LEFT",
        "chipX": 6,
        "chipY": 6,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 0,
        "standY": 5,
        "dir": "DOWN",
        "chipX": 0,
        "chipY": 6,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 5,
        "standY": 0,
        "dir": "RIGHT",
        "chipX": 6,
        "chipY": 0,
        "chipLevel": 3,
        "merged": true
      }
    ]
  },
  {
    "id": 11,
    "chapter": 2,
    "chapterName": "Level.2：電路迴廊",
    "title": "S 型導軌 (S-Curve Guide)",
    "subtitle": "在錯落的 S 型隔板間結合蟲洞折躍靈巧穿梭",
    "width": 13,
    "height": 11,
    "playerStart": {
      "x": 6,
      "y": 1
    },
    "targetLevel": 4,
    "parMoves": 7,
    "wraparound": true,
    "grid": [
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "WALL",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "WALL",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ]
    ],
    "chips": [
      {
        "x": 10,
        "y": 1,
        "level": 1
      },
      {
        "x": 10,
        "y": 5,
        "level": 1
      },
      {
        "x": 3,
        "y": 1,
        "level": 1
      },
      {
        "x": 3,
        "y": 7,
        "level": 1
      },
      {
        "x": 0,
        "y": 5,
        "level": 1
      },
      {
        "x": 0,
        "y": 10,
        "level": 1
      },
      {
        "x": 10,
        "y": 9,
        "level": 1
      },
      {
        "x": 7,
        "y": 1,
        "level": 1
      }
    ],
    "wormholes": [
      {
        "id": 1,
        "a": {
          "x": 3,
          "y": 5
        },
        "b": {
          "x": 9,
          "y": 5
        }
      }
    ],
    "hint": "S 型隔板可改變晶片動向，搭配蟲洞能穿透無法通行的隔板。",
    "solutionSteps": [
      {
        "standX": 6,
        "standY": 1,
        "dir": "RIGHT",
        "chipX": 7,
        "chipY": 1,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 10,
        "standY": 10,
        "dir": "UP",
        "chipX": 10,
        "chipY": 9,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 0,
        "standY": 0,
        "dir": "UP",
        "chipX": 0,
        "chipY": 10,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 1,
        "standY": 5,
        "dir": "LEFT",
        "chipX": 0,
        "chipY": 5,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 3,
        "standY": 6,
        "dir": "DOWN",
        "chipX": 3,
        "chipY": 7,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 4,
        "standY": 1,
        "dir": "LEFT",
        "chipX": 3,
        "chipY": 1,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 10,
        "standY": 6,
        "dir": "UP",
        "chipX": 10,
        "chipY": 5,
        "chipLevel": 3,
        "merged": true
      }
    ]
  },
  {
    "id": 12,
    "chapter": 2,
    "chapterName": "Level.2：電路迴廊",
    "title": "十字交會 (Cross Intersection)",
    "subtitle": "縱橫雙軸交錯：兩顆 8086 微處理器在蟲洞與中軸線上撞擊升級",
    "width": 13,
    "height": 13,
    "playerStart": {
      "x": 1,
      "y": 8
    },
    "targetLevel": 4,
    "parMoves": 7,
    "wraparound": true,
    "grid": [
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ]
    ],
    "chips": [
      {
        "x": 10,
        "y": 0,
        "level": 1
      },
      {
        "x": 10,
        "y": 8,
        "level": 1
      },
      {
        "x": 3,
        "y": 0,
        "level": 1
      },
      {
        "x": 4,
        "y": 8,
        "level": 1
      },
      {
        "x": 4,
        "y": 4,
        "level": 1
      },
      {
        "x": 10,
        "y": 4,
        "level": 1
      },
      {
        "x": 6,
        "y": 0,
        "level": 1
      },
      {
        "x": 0,
        "y": 8,
        "level": 1
      }
    ],
    "wormholes": [
      {
        "id": 1,
        "a": {
          "x": 6,
          "y": 2
        },
        "b": {
          "x": 6,
          "y": 10
        }
      }
    ],
    "hint": "中央的蟲洞與環形邊界構成四維動態交通網，瞄準軸心發射晶片！",
    "solutionSteps": [
      {
        "standX": 1,
        "standY": 8,
        "dir": "LEFT",
        "chipX": 0,
        "chipY": 8,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 7,
        "standY": 0,
        "dir": "LEFT",
        "chipX": 6,
        "chipY": 0,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 10,
        "standY": 5,
        "dir": "UP",
        "chipX": 10,
        "chipY": 4,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 4,
        "standY": 5,
        "dir": "UP",
        "chipX": 4,
        "chipY": 4,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 5,
        "standY": 8,
        "dir": "LEFT",
        "chipX": 4,
        "chipY": 8,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 4,
        "standY": 0,
        "dir": "LEFT",
        "chipX": 3,
        "chipY": 0,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 10,
        "standY": 9,
        "dir": "UP",
        "chipX": 10,
        "chipY": 8,
        "chipLevel": 3,
        "merged": true
      }
    ]
  },
  {
    "id": 13,
    "chapter": 3,
    "chapterName": "Level.3：多階處理器",
    "title": "跨代合成 (Cross-Gen Fusion)",
    "subtitle": "梯級骨牌連鎖：跨越不同世代晶片循序推升至 486 DX2",
    "width": 13,
    "height": 13,
    "playerStart": {
      "x": 8,
      "y": 9
    },
    "targetLevel": 5,
    "parMoves": 7,
    "wraparound": true,
    "grid": [
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ]
    ],
    "chips": [
      {
        "x": 1,
        "y": 1,
        "level": 2
      },
      {
        "x": 1,
        "y": 8,
        "level": 4
      },
      {
        "x": 8,
        "y": 1,
        "level": 1
      },
      {
        "x": 5,
        "y": 1,
        "level": 1
      },
      {
        "x": 5,
        "y": 6,
        "level": 1
      },
      {
        "x": 11,
        "y": 1,
        "level": 1
      },
      {
        "x": 11,
        "y": 5,
        "level": 1
      },
      {
        "x": 8,
        "y": 10,
        "level": 1
      }
    ],
    "hint": "不同等級晶片不能直接撞擊，必須由低階依序升級後方能與同級結合。",
    "solutionSteps": [
      {
        "standX": 8,
        "standY": 9,
        "dir": "DOWN",
        "chipX": 8,
        "chipY": 10,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 11,
        "standY": 4,
        "dir": "DOWN",
        "chipX": 11,
        "chipY": 5,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 12,
        "standY": 1,
        "dir": "LEFT",
        "chipX": 11,
        "chipY": 1,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 5,
        "standY": 5,
        "dir": "DOWN",
        "chipX": 5,
        "chipY": 6,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 6,
        "standY": 1,
        "dir": "LEFT",
        "chipX": 5,
        "chipY": 1,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 9,
        "standY": 1,
        "dir": "LEFT",
        "chipX": 8,
        "chipY": 1,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 1,
        "standY": 7,
        "dir": "DOWN",
        "chipX": 1,
        "chipY": 8,
        "chipLevel": 4,
        "merged": true
      }
    ]
  },
  {
    "id": 14,
    "chapter": 3,
    "chapterName": "Level.3：多階處理器",
    "title": "對稱機房 (Symmetric Hub)",
    "subtitle": "四象限對稱機房中的高難度空間調度",
    "width": 13,
    "height": 13,
    "playerStart": {
      "x": 4,
      "y": 10
    },
    "targetLevel": 5,
    "parMoves": 7,
    "wraparound": true,
    "grid": [
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ]
    ],
    "chips": [
      {
        "x": 1,
        "y": 1,
        "level": 3
      },
      {
        "x": 7,
        "y": 1,
        "level": 3
      },
      {
        "x": 1,
        "y": 7,
        "level": 2
      },
      {
        "x": 7,
        "y": 8,
        "level": 2
      },
      {
        "x": 11,
        "y": 8,
        "level": 1
      },
      {
        "x": 11,
        "y": 4,
        "level": 1
      },
      {
        "x": 4,
        "y": 7,
        "level": 1
      },
      {
        "x": 4,
        "y": 11,
        "level": 1
      }
    ],
    "hint": "保持對稱思維，將分散在各象限的次級晶片匯流至中央核心！",
    "solutionSteps": [
      {
        "standX": 4,
        "standY": 10,
        "dir": "DOWN",
        "chipX": 4,
        "chipY": 11,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 3,
        "standY": 7,
        "dir": "RIGHT",
        "chipX": 4,
        "chipY": 7,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 11,
        "standY": 3,
        "dir": "DOWN",
        "chipX": 11,
        "chipY": 4,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 10,
        "standY": 8,
        "dir": "RIGHT",
        "chipX": 11,
        "chipY": 8,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 7,
        "standY": 7,
        "dir": "DOWN",
        "chipX": 7,
        "chipY": 8,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 1,
        "standY": 6,
        "dir": "DOWN",
        "chipX": 1,
        "chipY": 7,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 6,
        "standY": 1,
        "dir": "RIGHT",
        "chipX": 7,
        "chipY": 1,
        "chipLevel": 4,
        "merged": true
      }
    ]
  },
  {
    "id": 15,
    "chapter": 3,
    "chapterName": "Level.3：多階處理器",
    "title": "486 世代降臨 (486 DX2 Revolution)",
    "subtitle": "邁入 32 位元世代！在巨型機房合成出金色 486 DX2 處理器",
    "width": 15,
    "height": 13,
    "playerStart": {
      "x": 7,
      "y": 11
    },
    "targetLevel": 5,
    "parMoves": 9,
    "wraparound": true,
    "grid": [
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ]
    ],
    "chips": [
      {
        "x": 0,
        "y": 0,
        "level": 3
      },
      {
        "x": 0,
        "y": 6,
        "level": 2
      },
      {
        "x": 7,
        "y": 0,
        "level": 2
      },
      {
        "x": 7,
        "y": 6,
        "level": 1
      },
      {
        "x": 11,
        "y": 6,
        "level": 1
      },
      {
        "x": 11,
        "y": 11,
        "level": 1
      },
      {
        "x": 4,
        "y": 11,
        "level": 1
      },
      {
        "x": 11,
        "y": 2,
        "level": 1
      },
      {
        "x": 4,
        "y": 6,
        "level": 2
      },
      {
        "x": 7,
        "y": 10,
        "level": 1
      }
    ],
    "hint": "晶片數量增多時，先鎖定局部的同級晶片兩兩消除，騰出空間給高階晶片。",
    "solutionSteps": [
      {
        "standX": 7,
        "standY": 11,
        "dir": "UP",
        "chipX": 7,
        "chipY": 10,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 5,
        "standY": 6,
        "dir": "LEFT",
        "chipX": 4,
        "chipY": 6,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 11,
        "standY": 1,
        "dir": "DOWN",
        "chipX": 11,
        "chipY": 2,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 5,
        "standY": 11,
        "dir": "LEFT",
        "chipX": 4,
        "chipY": 11,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 11,
        "standY": 12,
        "dir": "UP",
        "chipX": 11,
        "chipY": 11,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 10,
        "standY": 6,
        "dir": "RIGHT",
        "chipX": 11,
        "chipY": 6,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 7,
        "standY": 5,
        "dir": "DOWN",
        "chipX": 7,
        "chipY": 6,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 8,
        "standY": 0,
        "dir": "LEFT",
        "chipX": 7,
        "chipY": 0,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 0,
        "standY": 5,
        "dir": "DOWN",
        "chipX": 0,
        "chipY": 6,
        "chipLevel": 4,
        "merged": true
      }
    ]
  },
  {
    "id": 16,
    "chapter": 3,
    "chapterName": "Level.3：多階處理器",
    "title": "窄口效應 (Chokepoint)",
    "subtitle": "21×19 巨型空間 (手機 15×19) · 16顆晶片連鎖升級",
    "width": 21,
    "height": 19,
    "playerStart": {
      "x": 14,
      "y": 4
    },
    "targetLevel": 5,
    "parMoves": 21,
    "wraparound": true,
    "grid": [
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ]
    ],
    "chips": [
      {
        "x": 3,
        "y": 0,
        "level": 1
      },
      {
        "x": 14,
        "y": 0,
        "level": 1
      },
      {
        "x": 14,
        "y": 9,
        "level": 1
      },
      {
        "x": 3,
        "y": 9,
        "level": 1
      },
      {
        "x": 9,
        "y": 9,
        "level": 1
      },
      {
        "x": 9,
        "y": 18,
        "level": 1
      },
      {
        "x": 3,
        "y": 14,
        "level": 1
      },
      {
        "x": 14,
        "y": 15,
        "level": 1
      },
      {
        "x": 19,
        "y": 15,
        "level": 1
      },
      {
        "x": 19,
        "y": 9,
        "level": 1
      },
      {
        "x": 6,
        "y": 0,
        "level": 1
      },
      {
        "x": 6,
        "y": 7,
        "level": 1
      },
      {
        "x": 19,
        "y": 0,
        "level": 1
      },
      {
        "x": 3,
        "y": 4,
        "level": 1
      },
      {
        "x": 19,
        "y": 5,
        "level": 1
      },
      {
        "x": 14,
        "y": 3,
        "level": 1
      }
    ],
    "hint": "長廊狹口只能單向通行，預先算好誰先進誰後出，避免塞車卡住。",
    "solutionSteps": [
      {
        "standX": 14,
        "standY": 4,
        "dir": "UP",
        "chipX": 14,
        "chipY": 3,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 19,
        "standY": 6,
        "dir": "UP",
        "chipX": 19,
        "chipY": 5,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 3,
        "standY": 5,
        "dir": "UP",
        "chipX": 3,
        "chipY": 4,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 20,
        "standY": 0,
        "dir": "LEFT",
        "chipX": 19,
        "chipY": 0,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 6,
        "standY": 8,
        "dir": "UP",
        "chipX": 6,
        "chipY": 7,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 7,
        "standY": 0,
        "dir": "LEFT",
        "chipX": 6,
        "chipY": 0,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 20,
        "standY": 9,
        "dir": "LEFT",
        "chipX": 19,
        "chipY": 9,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 20,
        "standY": 15,
        "dir": "LEFT",
        "chipX": 19,
        "chipY": 15,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 14,
        "standY": 16,
        "dir": "UP",
        "chipX": 14,
        "chipY": 15,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 3,
        "standY": 15,
        "dir": "UP",
        "chipX": 3,
        "chipY": 14,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 9,
        "standY": 17,
        "dir": "DOWN",
        "chipX": 9,
        "chipY": 18,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 10,
        "standY": 9,
        "dir": "LEFT",
        "chipX": 9,
        "chipY": 9,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 3,
        "standY": 8,
        "dir": "DOWN",
        "chipX": 3,
        "chipY": 9,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 14,
        "standY": 8,
        "dir": "DOWN",
        "chipX": 14,
        "chipY": 9,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 15,
        "standY": 0,
        "dir": "LEFT",
        "chipX": 14,
        "chipY": 0,
        "chipLevel": 4,
        "merged": true
      }
    ],
    "wormholes": [],
    "mobileVariant": {
      "width": 15,
      "height": 19,
      "grid": [
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ]
      ],
      "chips": [
        {
          "x": 4,
          "y": 0,
          "level": 1
        },
        {
          "x": 12,
          "y": 0,
          "level": 1
        },
        {
          "x": 12,
          "y": 9,
          "level": 1
        },
        {
          "x": 5,
          "y": 9,
          "level": 1
        },
        {
          "x": 5,
          "y": 14,
          "level": 1
        },
        {
          "x": 4,
          "y": 3,
          "level": 1
        },
        {
          "x": 12,
          "y": 15,
          "level": 1
        },
        {
          "x": 4,
          "y": 11,
          "level": 1
        },
        {
          "x": 0,
          "y": 11,
          "level": 1
        },
        {
          "x": 9,
          "y": 3,
          "level": 1
        },
        {
          "x": 1,
          "y": 15,
          "level": 1
        },
        {
          "x": 12,
          "y": 3,
          "level": 1
        },
        {
          "x": 8,
          "y": 0,
          "level": 1
        },
        {
          "x": 4,
          "y": 16,
          "level": 1
        },
        {
          "x": 9,
          "y": 16,
          "level": 1
        },
        {
          "x": 1,
          "y": 0,
          "level": 1
        }
      ],
      "playerStart": {
        "x": 0,
        "y": 0
      },
      "wormholes": [],
      "solutionSteps": [
        {
          "standX": 0,
          "standY": 0,
          "dir": "RIGHT",
          "chipX": 1,
          "chipY": 0,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 8,
          "standY": 16,
          "dir": "RIGHT",
          "chipX": 9,
          "chipY": 16,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 4,
          "standY": 15,
          "dir": "DOWN",
          "chipX": 4,
          "chipY": 16,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 7,
          "standY": 0,
          "dir": "RIGHT",
          "chipX": 8,
          "chipY": 0,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 12,
          "standY": 2,
          "dir": "DOWN",
          "chipX": 12,
          "chipY": 3,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 2,
          "standY": 15,
          "dir": "LEFT",
          "chipX": 1,
          "chipY": 15,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 8,
          "standY": 3,
          "dir": "RIGHT",
          "chipX": 9,
          "chipY": 3,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 1,
          "standY": 11,
          "dir": "LEFT",
          "chipX": 0,
          "chipY": 11,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 4,
          "standY": 12,
          "dir": "UP",
          "chipX": 4,
          "chipY": 11,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 12,
          "standY": 14,
          "dir": "DOWN",
          "chipX": 12,
          "chipY": 15,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 4,
          "standY": 2,
          "dir": "DOWN",
          "chipX": 4,
          "chipY": 3,
          "chipLevel": 3,
          "merged": true
        },
        {
          "standX": 5,
          "standY": 15,
          "dir": "UP",
          "chipX": 5,
          "chipY": 14,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 4,
          "standY": 9,
          "dir": "RIGHT",
          "chipX": 5,
          "chipY": 9,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 12,
          "standY": 10,
          "dir": "UP",
          "chipX": 12,
          "chipY": 9,
          "chipLevel": 3,
          "merged": true
        },
        {
          "standX": 11,
          "standY": 0,
          "dir": "RIGHT",
          "chipX": 12,
          "chipY": 0,
          "chipLevel": 4,
          "merged": true
        }
      ],
      "parMoves": 21
    }
  },
  {
    "id": 17,
    "chapter": 3,
    "chapterName": "Level.3：多階處理器",
    "title": "階層金字塔 (The Hierarchy Pyramid)",
    "subtitle": "21×19 巨型空間 (手機 15×19) · 16顆晶片連鎖升級",
    "width": 21,
    "height": 19,
    "playerStart": {
      "x": 16,
      "y": 9
    },
    "targetLevel": 6,
    "parMoves": 21,
    "wraparound": true,
    "grid": [
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ]
    ],
    "chips": [
      {
        "x": 9,
        "y": 0,
        "level": 3
      },
      {
        "x": 20,
        "y": 0,
        "level": 4
      },
      {
        "x": 9,
        "y": 10,
        "level": 1
      },
      {
        "x": 19,
        "y": 10,
        "level": 2
      },
      {
        "x": 19,
        "y": 5,
        "level": 1
      },
      {
        "x": 5,
        "y": 5,
        "level": 1
      },
      {
        "x": 20,
        "y": 14,
        "level": 3
      },
      {
        "x": 14,
        "y": 14,
        "level": 1
      },
      {
        "x": 14,
        "y": 3,
        "level": 1
      },
      {
        "x": 5,
        "y": 14,
        "level": 1
      },
      {
        "x": 2,
        "y": 3,
        "level": 1
      },
      {
        "x": 3,
        "y": 10,
        "level": 1
      },
      {
        "x": 3,
        "y": 18,
        "level": 1
      },
      {
        "x": 9,
        "y": 6,
        "level": 1
      },
      {
        "x": 16,
        "y": 0,
        "level": 2
      },
      {
        "x": 16,
        "y": 8,
        "level": 2
      }
    ],
    "wormholes": [
      {
        "id": 1,
        "a": {
          "x": 3,
          "y": 9
        },
        "b": {
          "x": 17,
          "y": 9
        }
      }
    ],
    "hint": "善用左右對穿的蟲洞，將對側的 486 快速送過來與本地晶片撞擊！",
    "solutionSteps": [
      {
        "standX": 16,
        "standY": 9,
        "dir": "UP",
        "chipX": 16,
        "chipY": 8,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 17,
        "standY": 0,
        "dir": "LEFT",
        "chipX": 16,
        "chipY": 0,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 9,
        "standY": 5,
        "dir": "DOWN",
        "chipX": 9,
        "chipY": 6,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 3,
        "standY": 17,
        "dir": "DOWN",
        "chipX": 3,
        "chipY": 18,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 2,
        "standY": 10,
        "dir": "RIGHT",
        "chipX": 3,
        "chipY": 10,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 3,
        "standY": 3,
        "dir": "LEFT",
        "chipX": 2,
        "chipY": 3,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 4,
        "standY": 14,
        "dir": "RIGHT",
        "chipX": 5,
        "chipY": 14,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 14,
        "standY": 4,
        "dir": "UP",
        "chipX": 14,
        "chipY": 3,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 15,
        "standY": 14,
        "dir": "LEFT",
        "chipX": 14,
        "chipY": 14,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 20,
        "standY": 15,
        "dir": "UP",
        "chipX": 20,
        "chipY": 14,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 4,
        "standY": 5,
        "dir": "RIGHT",
        "chipX": 5,
        "chipY": 5,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 19,
        "standY": 4,
        "dir": "DOWN",
        "chipX": 19,
        "chipY": 5,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 18,
        "standY": 10,
        "dir": "RIGHT",
        "chipX": 19,
        "chipY": 10,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 9,
        "standY": 9,
        "dir": "DOWN",
        "chipX": 9,
        "chipY": 10,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 0,
        "standY": 0,
        "dir": "LEFT",
        "chipX": 20,
        "chipY": 0,
        "chipLevel": 5,
        "merged": true
      }
    ],
    "mobileVariant": {
      "width": 15,
      "height": 19,
      "grid": [
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ]
      ],
      "chips": [
        {
          "x": 2,
          "y": 1,
          "level": 2
        },
        {
          "x": 10,
          "y": 1,
          "level": 4
        },
        {
          "x": 2,
          "y": 10,
          "level": 1
        },
        {
          "x": 12,
          "y": 14,
          "level": 1
        },
        {
          "x": 8,
          "y": 10,
          "level": 1
        },
        {
          "x": 10,
          "y": 6,
          "level": 3
        },
        {
          "x": 5,
          "y": 6,
          "level": 2
        },
        {
          "x": 1,
          "y": 14,
          "level": 1
        },
        {
          "x": 1,
          "y": 5,
          "level": 1
        },
        {
          "x": 8,
          "y": 17,
          "level": 1
        },
        {
          "x": 12,
          "y": 10,
          "level": 3
        },
        {
          "x": 12,
          "y": 17,
          "level": 1
        },
        {
          "x": 7,
          "y": 14,
          "level": 1
        },
        {
          "x": 5,
          "y": 0,
          "level": 1
        },
        {
          "x": 14,
          "y": 0,
          "level": 1
        },
        {
          "x": 2,
          "y": 17,
          "level": 2
        }
      ],
      "playerStart": {
        "x": 2,
        "y": 16
      },
      "wormholes": [
        {
          "id": 1,
          "a": {
            "x": 2,
            "y": 9
          },
          "b": {
            "x": 12,
            "y": 9
          }
        }
      ],
      "solutionSteps": [
        {
          "standX": 2,
          "standY": 16,
          "dir": "DOWN",
          "chipX": 2,
          "chipY": 17,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 13,
          "standY": 0,
          "dir": "RIGHT",
          "chipX": 14,
          "chipY": 0,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 5,
          "standY": 18,
          "dir": "DOWN",
          "chipX": 5,
          "chipY": 0,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 6,
          "standY": 14,
          "dir": "RIGHT",
          "chipX": 7,
          "chipY": 14,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 12,
          "standY": 16,
          "dir": "DOWN",
          "chipX": 12,
          "chipY": 17,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 12,
          "standY": 11,
          "dir": "UP",
          "chipX": 12,
          "chipY": 10,
          "chipLevel": 3,
          "merged": true
        },
        {
          "standX": 8,
          "standY": 16,
          "dir": "DOWN",
          "chipX": 8,
          "chipY": 17,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 1,
          "standY": 6,
          "dir": "UP",
          "chipX": 1,
          "chipY": 5,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 0,
          "standY": 14,
          "dir": "RIGHT",
          "chipX": 1,
          "chipY": 14,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 4,
          "standY": 6,
          "dir": "RIGHT",
          "chipX": 5,
          "chipY": 6,
          "chipLevel": 3,
          "merged": true
        },
        {
          "standX": 10,
          "standY": 7,
          "dir": "UP",
          "chipX": 10,
          "chipY": 6,
          "chipLevel": 4,
          "merged": true
        },
        {
          "standX": 9,
          "standY": 10,
          "dir": "LEFT",
          "chipX": 8,
          "chipY": 10,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 12,
          "standY": 13,
          "dir": "DOWN",
          "chipX": 12,
          "chipY": 14,
          "chipLevel": 3,
          "merged": true
        },
        {
          "standX": 2,
          "standY": 11,
          "dir": "UP",
          "chipX": 2,
          "chipY": 10,
          "chipLevel": 4,
          "merged": true
        },
        {
          "standX": 9,
          "standY": 1,
          "dir": "RIGHT",
          "chipX": 10,
          "chipY": 1,
          "chipLevel": 5,
          "merged": true
        }
      ],
      "parMoves": 21
    }
  },
  {
    "id": 18,
    "chapter": 3,
    "chapterName": "Level.3：多階處理器",
    "title": "環狀超頻 (Clock Loop)",
    "subtitle": "21×21 巨型空間 (手機 15×21) · 20顆晶片連鎖升級",
    "width": 21,
    "height": 21,
    "playerStart": {
      "x": 19,
      "y": 2
    },
    "targetLevel": 6,
    "parMoves": 25,
    "wraparound": true,
    "grid": [
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ]
    ],
    "chips": [
      {
        "x": 13,
        "y": 0,
        "level": 1
      },
      {
        "x": 13,
        "y": 10,
        "level": 2
      },
      {
        "x": 3,
        "y": 10,
        "level": 3
      },
      {
        "x": 3,
        "y": 0,
        "level": 4
      },
      {
        "x": 18,
        "y": 0,
        "level": 1
      },
      {
        "x": 18,
        "y": 14,
        "level": 1
      },
      {
        "x": 8,
        "y": 14,
        "level": 1
      },
      {
        "x": 18,
        "y": 6,
        "level": 1
      },
      {
        "x": 3,
        "y": 16,
        "level": 1
      },
      {
        "x": 8,
        "y": 4,
        "level": 1
      },
      {
        "x": 1,
        "y": 4,
        "level": 1
      },
      {
        "x": 13,
        "y": 16,
        "level": 1
      },
      {
        "x": 13,
        "y": 5,
        "level": 2
      },
      {
        "x": 19,
        "y": 10,
        "level": 1
      },
      {
        "x": 19,
        "y": 17,
        "level": 1
      },
      {
        "x": 10,
        "y": 17,
        "level": 1
      },
      {
        "x": 8,
        "y": 0,
        "level": 1
      },
      {
        "x": 7,
        "y": 10,
        "level": 1
      },
      {
        "x": 7,
        "y": 7,
        "level": 1
      },
      {
        "x": 19,
        "y": 3,
        "level": 1
      }
    ],
    "wormholes": [
      {
        "id": 1,
        "a": {
          "x": 4,
          "y": 4
        },
        "b": {
          "x": 16,
          "y": 16
        }
      }
    ],
    "hint": "對角配置的蟲洞具有強大的跨象限轉移能力，將晶片斜向甩出完成致命一擊！",
    "solutionSteps": [
      {
        "standX": 19,
        "standY": 2,
        "dir": "DOWN",
        "chipX": 19,
        "chipY": 3,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 7,
        "standY": 8,
        "dir": "UP",
        "chipX": 7,
        "chipY": 7,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 6,
        "standY": 10,
        "dir": "RIGHT",
        "chipX": 7,
        "chipY": 10,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 7,
        "standY": 0,
        "dir": "RIGHT",
        "chipX": 8,
        "chipY": 0,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 11,
        "standY": 17,
        "dir": "LEFT",
        "chipX": 10,
        "chipY": 17,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 19,
        "standY": 16,
        "dir": "DOWN",
        "chipX": 19,
        "chipY": 17,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 20,
        "standY": 10,
        "dir": "LEFT",
        "chipX": 19,
        "chipY": 10,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 13,
        "standY": 6,
        "dir": "UP",
        "chipX": 13,
        "chipY": 5,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 12,
        "standY": 16,
        "dir": "RIGHT",
        "chipX": 13,
        "chipY": 16,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 0,
        "standY": 4,
        "dir": "RIGHT",
        "chipX": 1,
        "chipY": 4,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 9,
        "standY": 4,
        "dir": "LEFT",
        "chipX": 8,
        "chipY": 4,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 3,
        "standY": 17,
        "dir": "UP",
        "chipX": 3,
        "chipY": 16,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 18,
        "standY": 7,
        "dir": "UP",
        "chipX": 18,
        "chipY": 6,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 7,
        "standY": 14,
        "dir": "RIGHT",
        "chipX": 8,
        "chipY": 14,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 18,
        "standY": 15,
        "dir": "UP",
        "chipX": 18,
        "chipY": 14,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 19,
        "standY": 0,
        "dir": "LEFT",
        "chipX": 18,
        "chipY": 0,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 4,
        "standY": 0,
        "dir": "LEFT",
        "chipX": 3,
        "chipY": 0,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 2,
        "standY": 10,
        "dir": "RIGHT",
        "chipX": 3,
        "chipY": 10,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 13,
        "standY": 11,
        "dir": "UP",
        "chipX": 13,
        "chipY": 10,
        "chipLevel": 5,
        "merged": true
      }
    ],
    "mobileVariant": {
      "width": 15,
      "height": 21,
      "grid": [
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ]
      ],
      "chips": [
        {
          "x": 1,
          "y": 0,
          "level": 2
        },
        {
          "x": 8,
          "y": 0,
          "level": 2
        },
        {
          "x": 1,
          "y": 11,
          "level": 2
        },
        {
          "x": 8,
          "y": 13,
          "level": 2
        },
        {
          "x": 12,
          "y": 13,
          "level": 1
        },
        {
          "x": 12,
          "y": 6,
          "level": 1
        },
        {
          "x": 5,
          "y": 6,
          "level": 1
        },
        {
          "x": 12,
          "y": 18,
          "level": 1
        },
        {
          "x": 1,
          "y": 7,
          "level": 2
        },
        {
          "x": 9,
          "y": 7,
          "level": 1
        },
        {
          "x": 9,
          "y": 17,
          "level": 1
        },
        {
          "x": 1,
          "y": 16,
          "level": 3
        },
        {
          "x": 4,
          "y": 13,
          "level": 1
        },
        {
          "x": 4,
          "y": 19,
          "level": 1
        },
        {
          "x": 8,
          "y": 4,
          "level": 3
        },
        {
          "x": 13,
          "y": 0,
          "level": 1
        },
        {
          "x": 13,
          "y": 9,
          "level": 1
        },
        {
          "x": 10,
          "y": 11,
          "level": 1
        },
        {
          "x": 10,
          "y": 2,
          "level": 1
        },
        {
          "x": 1,
          "y": 3,
          "level": 2
        }
      ],
      "playerStart": {
        "x": 1,
        "y": 4
      },
      "wormholes": [
        {
          "id": 1,
          "a": {
            "x": 3,
            "y": 3
          },
          "b": {
            "x": 11,
            "y": 17
          }
        }
      ],
      "solutionSteps": [
        {
          "standX": 1,
          "standY": 4,
          "dir": "UP",
          "chipX": 1,
          "chipY": 3,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 10,
          "standY": 3,
          "dir": "UP",
          "chipX": 10,
          "chipY": 2,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 9,
          "standY": 11,
          "dir": "RIGHT",
          "chipX": 10,
          "chipY": 11,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 13,
          "standY": 8,
          "dir": "DOWN",
          "chipX": 13,
          "chipY": 9,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 14,
          "standY": 0,
          "dir": "LEFT",
          "chipX": 13,
          "chipY": 0,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 8,
          "standY": 5,
          "dir": "UP",
          "chipX": 8,
          "chipY": 4,
          "chipLevel": 3,
          "merged": true
        },
        {
          "standX": 4,
          "standY": 18,
          "dir": "DOWN",
          "chipX": 4,
          "chipY": 19,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 3,
          "standY": 13,
          "dir": "RIGHT",
          "chipX": 4,
          "chipY": 13,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 1,
          "standY": 17,
          "dir": "UP",
          "chipX": 1,
          "chipY": 16,
          "chipLevel": 3,
          "merged": true
        },
        {
          "standX": 9,
          "standY": 18,
          "dir": "UP",
          "chipX": 9,
          "chipY": 17,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 10,
          "standY": 7,
          "dir": "LEFT",
          "chipX": 9,
          "chipY": 7,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 1,
          "standY": 8,
          "dir": "UP",
          "chipX": 1,
          "chipY": 7,
          "chipLevel": 3,
          "merged": true
        },
        {
          "standX": 12,
          "standY": 19,
          "dir": "UP",
          "chipX": 12,
          "chipY": 18,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 4,
          "standY": 6,
          "dir": "RIGHT",
          "chipX": 5,
          "chipY": 6,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 12,
          "standY": 5,
          "dir": "DOWN",
          "chipX": 12,
          "chipY": 6,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 13,
          "standY": 13,
          "dir": "LEFT",
          "chipX": 12,
          "chipY": 13,
          "chipLevel": 3,
          "merged": true
        },
        {
          "standX": 8,
          "standY": 12,
          "dir": "DOWN",
          "chipX": 8,
          "chipY": 13,
          "chipLevel": 4,
          "merged": true
        },
        {
          "standX": 1,
          "standY": 12,
          "dir": "UP",
          "chipX": 1,
          "chipY": 11,
          "chipLevel": 4,
          "merged": true
        },
        {
          "standX": 9,
          "standY": 0,
          "dir": "LEFT",
          "chipX": 8,
          "chipY": 0,
          "chipLevel": 5,
          "merged": true
        }
      ],
      "parMoves": 25
    }
  },
  {
    "id": 19,
    "chapter": 4,
    "chapterName": "Level.4：超級電腦誕生",
    "title": "奔騰年代 (Pentium Dawn)",
    "subtitle": "四核協同處理器兩兩對撞，穿梭雙蟲洞誕生紅色 Pentium MMX",
    "width": 15,
    "height": 15,
    "playerStart": {
      "x": 9,
      "y": 3
    },
    "targetLevel": 6,
    "parMoves": 9,
    "wraparound": true,
    "grid": [
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ]
    ],
    "chips": [
      {
        "x": 5,
        "y": 0,
        "level": 4
      },
      {
        "x": 13,
        "y": 0,
        "level": 4
      },
      {
        "x": 13,
        "y": 7,
        "level": 3
      },
      {
        "x": 5,
        "y": 8,
        "level": 3
      },
      {
        "x": 9,
        "y": 8,
        "level": 2
      },
      {
        "x": 9,
        "y": 13,
        "level": 1
      },
      {
        "x": 1,
        "y": 13,
        "level": 1
      },
      {
        "x": 1,
        "y": 7,
        "level": 2
      },
      {
        "x": 1,
        "y": 3,
        "level": 1
      },
      {
        "x": 8,
        "y": 3,
        "level": 1
      }
    ],
    "wormholes": [
      {
        "id": 1,
        "a": {
          "x": 2,
          "y": 7
        },
        "b": {
          "x": 12,
          "y": 7
        }
      },
      {
        "id": 2,
        "a": {
          "x": 7,
          "y": 2
        },
        "b": {
          "x": 7,
          "y": 12
        }
      }
    ],
    "hint": "青色與粉色雙蟲洞構成多重空間隧道，善用雙蟲洞跨越中央立柱牆群！",
    "solutionSteps": [
      {
        "standX": 9,
        "standY": 3,
        "dir": "LEFT",
        "chipX": 8,
        "chipY": 3,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 1,
        "standY": 2,
        "dir": "DOWN",
        "chipX": 1,
        "chipY": 3,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 0,
        "standY": 7,
        "dir": "RIGHT",
        "chipX": 1,
        "chipY": 7,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 2,
        "standY": 13,
        "dir": "LEFT",
        "chipX": 1,
        "chipY": 13,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 9,
        "standY": 14,
        "dir": "UP",
        "chipX": 9,
        "chipY": 13,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 10,
        "standY": 8,
        "dir": "LEFT",
        "chipX": 9,
        "chipY": 8,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 5,
        "standY": 7,
        "dir": "DOWN",
        "chipX": 5,
        "chipY": 8,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 13,
        "standY": 8,
        "dir": "UP",
        "chipX": 13,
        "chipY": 7,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 12,
        "standY": 0,
        "dir": "RIGHT",
        "chipX": 13,
        "chipY": 0,
        "chipLevel": 5,
        "merged": true
      }
    ]
  },
  {
    "id": 20,
    "chapter": 4,
    "chapterName": "Level.4：超級電腦誕生",
    "title": "光子晶片 (Photonic Core)",
    "subtitle": "兩組高階晶片逐步推展，在雙蟲洞與精密立柱間合成 Pentium",
    "width": 15,
    "height": 15,
    "playerStart": {
      "x": 7,
      "y": 13
    },
    "targetLevel": 6,
    "parMoves": 11,
    "wraparound": true,
    "grid": [
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ]
    ],
    "chips": [
      {
        "x": 13,
        "y": 0,
        "level": 3
      },
      {
        "x": 13,
        "y": 8,
        "level": 4
      },
      {
        "x": 6,
        "y": 8,
        "level": 3
      },
      {
        "x": 6,
        "y": 0,
        "level": 3
      },
      {
        "x": 2,
        "y": 0,
        "level": 3
      },
      {
        "x": 2,
        "y": 5,
        "level": 1
      },
      {
        "x": 10,
        "y": 5,
        "level": 1
      },
      {
        "x": 10,
        "y": 13,
        "level": 1
      },
      {
        "x": 2,
        "y": 10,
        "level": 1
      },
      {
        "x": 13,
        "y": 4,
        "level": 2
      },
      {
        "x": 7,
        "y": 4,
        "level": 1
      },
      {
        "x": 7,
        "y": 12,
        "level": 1
      }
    ],
    "wormholes": [
      {
        "id": 1,
        "a": {
          "x": 3,
          "y": 3
        },
        "b": {
          "x": 11,
          "y": 11
        }
      },
      {
        "id": 2,
        "a": {
          "x": 11,
          "y": 3
        },
        "b": {
          "x": 3,
          "y": 11
        }
      }
    ],
    "hint": "光子晶片需極高的精確度，雙蟲洞交叉傳送可快速建立垂直與水平碰撞線。",
    "solutionSteps": [
      {
        "standX": 7,
        "standY": 13,
        "dir": "UP",
        "chipX": 7,
        "chipY": 12,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 8,
        "standY": 4,
        "dir": "LEFT",
        "chipX": 7,
        "chipY": 4,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 13,
        "standY": 5,
        "dir": "UP",
        "chipX": 13,
        "chipY": 4,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 2,
        "standY": 11,
        "dir": "UP",
        "chipX": 2,
        "chipY": 10,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 10,
        "standY": 14,
        "dir": "UP",
        "chipX": 10,
        "chipY": 13,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 11,
        "standY": 5,
        "dir": "LEFT",
        "chipX": 10,
        "chipY": 5,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 2,
        "standY": 6,
        "dir": "UP",
        "chipX": 2,
        "chipY": 5,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 3,
        "standY": 0,
        "dir": "LEFT",
        "chipX": 2,
        "chipY": 0,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 6,
        "standY": 1,
        "dir": "UP",
        "chipX": 6,
        "chipY": 0,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 7,
        "standY": 8,
        "dir": "LEFT",
        "chipX": 6,
        "chipY": 8,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 13,
        "standY": 7,
        "dir": "DOWN",
        "chipX": 13,
        "chipY": 8,
        "chipLevel": 5,
        "merged": true
      }
    ]
  },
  {
    "id": 21,
    "chapter": 4,
    "chapterName": "Level.4：超級電腦誕生",
    "title": "量子神經元 (Quantum Entanglement)",
    "subtitle": "突破物理極限！在雙蟲洞拓撲空間中合成量子神經晶片 QPU",
    "width": 15,
    "height": 15,
    "playerStart": {
      "x": 1,
      "y": 12
    },
    "targetLevel": 7,
    "parMoves": 11,
    "wraparound": true,
    "grid": [
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ]
    ],
    "chips": [
      {
        "x": 1,
        "y": 0,
        "level": 5
      },
      {
        "x": 1,
        "y": 7,
        "level": 5
      },
      {
        "x": 9,
        "y": 0,
        "level": 4
      },
      {
        "x": 9,
        "y": 9,
        "level": 1
      },
      {
        "x": 5,
        "y": 9,
        "level": 1
      },
      {
        "x": 5,
        "y": 3,
        "level": 1
      },
      {
        "x": 13,
        "y": 3,
        "level": 1
      },
      {
        "x": 13,
        "y": 9,
        "level": 1
      },
      {
        "x": 9,
        "y": 5,
        "level": 1
      },
      {
        "x": 5,
        "y": 14,
        "level": 1
      },
      {
        "x": 13,
        "y": 13,
        "level": 1
      },
      {
        "x": 1,
        "y": 11,
        "level": 5
      }
    ],
    "wormholes": [
      {
        "id": 1,
        "a": {
          "x": 2,
          "y": 4
        },
        "b": {
          "x": 12,
          "y": 10
        }
      },
      {
        "id": 2,
        "a": {
          "x": 4,
          "y": 12
        },
        "b": {
          "x": 10,
          "y": 2
        }
      }
    ],
    "hint": "兩顆 Pentium MMX 在量子隧道中產生糾纏效應，利用外圍環狀通道完成最後衝刺！",
    "solutionSteps": [
      {
        "standX": 1,
        "standY": 12,
        "dir": "UP",
        "chipX": 1,
        "chipY": 11,
        "chipLevel": 5,
        "merged": true
      },
      {
        "standX": 13,
        "standY": 14,
        "dir": "UP",
        "chipX": 13,
        "chipY": 13,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 5,
        "standY": 0,
        "dir": "UP",
        "chipX": 5,
        "chipY": 14,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 9,
        "standY": 4,
        "dir": "DOWN",
        "chipX": 9,
        "chipY": 5,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 14,
        "standY": 9,
        "dir": "LEFT",
        "chipX": 13,
        "chipY": 9,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 12,
        "standY": 3,
        "dir": "RIGHT",
        "chipX": 13,
        "chipY": 3,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 5,
        "standY": 4,
        "dir": "UP",
        "chipX": 5,
        "chipY": 3,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 4,
        "standY": 9,
        "dir": "RIGHT",
        "chipX": 5,
        "chipY": 9,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 9,
        "standY": 8,
        "dir": "DOWN",
        "chipX": 9,
        "chipY": 9,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 10,
        "standY": 0,
        "dir": "LEFT",
        "chipX": 9,
        "chipY": 0,
        "chipLevel": 5,
        "merged": true
      },
      {
        "standX": 1,
        "standY": 6,
        "dir": "DOWN",
        "chipX": 1,
        "chipY": 7,
        "chipLevel": 6,
        "merged": true
      }
    ]
  },
  {
    "id": 22,
    "chapter": 4,
    "chapterName": "Level.4：超級電腦誕生",
    "title": "大腦風暴 (Brainstorm Nexus)",
    "subtitle": "21×21 巨型空間 (手機 15×21) · 22顆晶片連鎖升級",
    "width": 21,
    "height": 21,
    "playerStart": {
      "x": 9,
      "y": 11
    },
    "targetLevel": 7,
    "parMoves": 27,
    "wraparound": true,
    "grid": [
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "WALL",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "WALL",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ]
    ],
    "chips": [
      {
        "x": 0,
        "y": 0,
        "level": 4
      },
      {
        "x": 0,
        "y": 11,
        "level": 4
      },
      {
        "x": 11,
        "y": 0,
        "level": 2
      },
      {
        "x": 12,
        "y": 11,
        "level": 4
      },
      {
        "x": 11,
        "y": 16,
        "level": 3
      },
      {
        "x": 5,
        "y": 4,
        "level": 1
      },
      {
        "x": 4,
        "y": 16,
        "level": 1
      },
      {
        "x": 16,
        "y": 4,
        "level": 1
      },
      {
        "x": 5,
        "y": 10,
        "level": 1
      },
      {
        "x": 11,
        "y": 6,
        "level": 2
      },
      {
        "x": 0,
        "y": 6,
        "level": 2
      },
      {
        "x": 12,
        "y": 3,
        "level": 1
      },
      {
        "x": 17,
        "y": 17,
        "level": 1
      },
      {
        "x": 0,
        "y": 17,
        "level": 1
      },
      {
        "x": 17,
        "y": 9,
        "level": 1
      },
      {
        "x": 8,
        "y": 3,
        "level": 1
      },
      {
        "x": 14,
        "y": 17,
        "level": 1
      },
      {
        "x": 14,
        "y": 8,
        "level": 1
      },
      {
        "x": 8,
        "y": 17,
        "level": 1
      },
      {
        "x": 5,
        "y": 0,
        "level": 4
      },
      {
        "x": 16,
        "y": 0,
        "level": 2
      },
      {
        "x": 8,
        "y": 11,
        "level": 4
      }
    ],
    "wormholes": [
      {
        "id": 1,
        "a": {
          "x": 4,
          "y": 4
        },
        "b": {
          "x": 16,
          "y": 16
        }
      },
      {
        "id": 2,
        "a": {
          "x": 3,
          "y": 17
        },
        "b": {
          "x": 17,
          "y": 3
        }
      }
    ],
    "hint": "迷宮般的立柱考驗空間規劃能力，觀察每顆晶片的最終匯集路徑！",
    "solutionSteps": [
      {
        "standX": 9,
        "standY": 11,
        "dir": "LEFT",
        "chipX": 8,
        "chipY": 11,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 17,
        "standY": 0,
        "dir": "LEFT",
        "chipX": 16,
        "chipY": 0,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 6,
        "standY": 0,
        "dir": "LEFT",
        "chipX": 5,
        "chipY": 0,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 9,
        "standY": 17,
        "dir": "LEFT",
        "chipX": 8,
        "chipY": 17,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 14,
        "standY": 9,
        "dir": "UP",
        "chipX": 14,
        "chipY": 8,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 15,
        "standY": 17,
        "dir": "LEFT",
        "chipX": 14,
        "chipY": 17,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 9,
        "standY": 3,
        "dir": "LEFT",
        "chipX": 8,
        "chipY": 3,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 17,
        "standY": 8,
        "dir": "DOWN",
        "chipX": 17,
        "chipY": 9,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 1,
        "standY": 17,
        "dir": "LEFT",
        "chipX": 0,
        "chipY": 17,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 16,
        "standY": 17,
        "dir": "RIGHT",
        "chipX": 17,
        "chipY": 17,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 12,
        "standY": 2,
        "dir": "DOWN",
        "chipX": 12,
        "chipY": 3,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 20,
        "standY": 6,
        "dir": "RIGHT",
        "chipX": 0,
        "chipY": 6,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 11,
        "standY": 7,
        "dir": "UP",
        "chipX": 11,
        "chipY": 6,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 5,
        "standY": 9,
        "dir": "DOWN",
        "chipX": 5,
        "chipY": 10,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 15,
        "standY": 4,
        "dir": "RIGHT",
        "chipX": 16,
        "chipY": 4,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 5,
        "standY": 16,
        "dir": "LEFT",
        "chipX": 4,
        "chipY": 16,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 4,
        "standY": 4,
        "dir": "RIGHT",
        "chipX": 5,
        "chipY": 4,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 11,
        "standY": 17,
        "dir": "UP",
        "chipX": 11,
        "chipY": 16,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 11,
        "standY": 11,
        "dir": "RIGHT",
        "chipX": 12,
        "chipY": 11,
        "chipLevel": 5,
        "merged": true
      },
      {
        "standX": 12,
        "standY": 0,
        "dir": "LEFT",
        "chipX": 11,
        "chipY": 0,
        "chipLevel": 5,
        "merged": true
      },
      {
        "standX": 0,
        "standY": 10,
        "dir": "DOWN",
        "chipX": 0,
        "chipY": 11,
        "chipLevel": 6,
        "merged": true
      }
    ],
    "mobileVariant": {
      "width": 15,
      "height": 21,
      "grid": [
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "WALL",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "WALL",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ]
      ],
      "chips": [
        {
          "x": 0,
          "y": 1,
          "level": 5
        },
        {
          "x": 0,
          "y": 11,
          "level": 3
        },
        {
          "x": 7,
          "y": 1,
          "level": 2
        },
        {
          "x": 9,
          "y": 11,
          "level": 4
        },
        {
          "x": 7,
          "y": 16,
          "level": 2
        },
        {
          "x": 13,
          "y": 16,
          "level": 1
        },
        {
          "x": 13,
          "y": 6,
          "level": 1
        },
        {
          "x": 7,
          "y": 6,
          "level": 3
        },
        {
          "x": 4,
          "y": 11,
          "level": 3
        },
        {
          "x": 4,
          "y": 19,
          "level": 1
        },
        {
          "x": 10,
          "y": 19,
          "level": 1
        },
        {
          "x": 10,
          "y": 8,
          "level": 1
        },
        {
          "x": 0,
          "y": 19,
          "level": 4
        },
        {
          "x": 0,
          "y": 8,
          "level": 2
        },
        {
          "x": 13,
          "y": 3,
          "level": 1
        },
        {
          "x": 4,
          "y": 3,
          "level": 1
        },
        {
          "x": 13,
          "y": 13,
          "level": 1
        },
        {
          "x": 3,
          "y": 8,
          "level": 1
        },
        {
          "x": 3,
          "y": 15,
          "level": 1
        },
        {
          "x": 10,
          "y": 1,
          "level": 2
        },
        {
          "x": 7,
          "y": 13,
          "level": 1
        },
        {
          "x": 1,
          "y": 13,
          "level": 1
        }
      ],
      "playerStart": {
        "x": 0,
        "y": 13
      },
      "wormholes": [
        {
          "id": 1,
          "a": {
            "x": 3,
            "y": 3
          },
          "b": {
            "x": 11,
            "y": 17
          }
        },
        {
          "id": 2,
          "a": {
            "x": 2,
            "y": 17
          },
          "b": {
            "x": 12,
            "y": 3
          }
        }
      ],
      "solutionSteps": [
        {
          "standX": 0,
          "standY": 13,
          "dir": "RIGHT",
          "chipX": 1,
          "chipY": 13,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 7,
          "standY": 12,
          "dir": "DOWN",
          "chipX": 7,
          "chipY": 13,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 11,
          "standY": 1,
          "dir": "LEFT",
          "chipX": 10,
          "chipY": 1,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 3,
          "standY": 16,
          "dir": "UP",
          "chipX": 3,
          "chipY": 15,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 4,
          "standY": 8,
          "dir": "LEFT",
          "chipX": 3,
          "chipY": 8,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 13,
          "standY": 12,
          "dir": "DOWN",
          "chipX": 13,
          "chipY": 13,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 4,
          "standY": 4,
          "dir": "UP",
          "chipX": 4,
          "chipY": 3,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 13,
          "standY": 2,
          "dir": "DOWN",
          "chipX": 13,
          "chipY": 3,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 0,
          "standY": 7,
          "dir": "DOWN",
          "chipX": 0,
          "chipY": 8,
          "chipLevel": 3,
          "merged": true
        },
        {
          "standX": 0,
          "standY": 20,
          "dir": "UP",
          "chipX": 0,
          "chipY": 19,
          "chipLevel": 4,
          "merged": true
        },
        {
          "standX": 10,
          "standY": 9,
          "dir": "UP",
          "chipX": 10,
          "chipY": 8,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 9,
          "standY": 19,
          "dir": "RIGHT",
          "chipX": 10,
          "chipY": 19,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 4,
          "standY": 20,
          "dir": "UP",
          "chipX": 4,
          "chipY": 19,
          "chipLevel": 3,
          "merged": true
        },
        {
          "standX": 3,
          "standY": 11,
          "dir": "RIGHT",
          "chipX": 4,
          "chipY": 11,
          "chipLevel": 4,
          "merged": true
        },
        {
          "standX": 7,
          "standY": 7,
          "dir": "UP",
          "chipX": 7,
          "chipY": 6,
          "chipLevel": 3,
          "merged": true
        },
        {
          "standX": 13,
          "standY": 7,
          "dir": "UP",
          "chipX": 13,
          "chipY": 6,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 14,
          "standY": 16,
          "dir": "LEFT",
          "chipX": 13,
          "chipY": 16,
          "chipLevel": 3,
          "merged": true
        },
        {
          "standX": 7,
          "standY": 15,
          "dir": "DOWN",
          "chipX": 7,
          "chipY": 16,
          "chipLevel": 4,
          "merged": true
        },
        {
          "standX": 10,
          "standY": 11,
          "dir": "LEFT",
          "chipX": 9,
          "chipY": 11,
          "chipLevel": 5,
          "merged": true
        },
        {
          "standX": 8,
          "standY": 1,
          "dir": "LEFT",
          "chipX": 7,
          "chipY": 1,
          "chipLevel": 5,
          "merged": true
        },
        {
          "standX": 0,
          "standY": 12,
          "dir": "UP",
          "chipX": 0,
          "chipY": 11,
          "chipLevel": 6,
          "merged": true
        }
      ],
      "parMoves": 27
    }
  },
  {
    "id": 23,
    "chapter": 4,
    "chapterName": "Level.4：超級電腦誕生",
    "title": "超級電腦前夕 (Eve of Supercomputing)",
    "subtitle": "21×21 巨型空間 (手機 15×21) · 22顆晶片連鎖升級",
    "width": 21,
    "height": 21,
    "playerStart": {
      "x": 12,
      "y": 16
    },
    "targetLevel": 7,
    "parMoves": 27,
    "wraparound": true,
    "grid": [
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ]
    ],
    "chips": [
      {
        "x": 3,
        "y": 0,
        "level": 5
      },
      {
        "x": 17,
        "y": 10,
        "level": 2
      },
      {
        "x": 3,
        "y": 13,
        "level": 3
      },
      {
        "x": 14,
        "y": 0,
        "level": 4
      },
      {
        "x": 17,
        "y": 16,
        "level": 1
      },
      {
        "x": 10,
        "y": 10,
        "level": 3
      },
      {
        "x": 8,
        "y": 16,
        "level": 1
      },
      {
        "x": 8,
        "y": 4,
        "level": 1
      },
      {
        "x": 19,
        "y": 4,
        "level": 1
      },
      {
        "x": 14,
        "y": 5,
        "level": 3
      },
      {
        "x": 3,
        "y": 5,
        "level": 3
      },
      {
        "x": 3,
        "y": 9,
        "level": 3
      },
      {
        "x": 20,
        "y": 9,
        "level": 1
      },
      {
        "x": 20,
        "y": 19,
        "level": 1
      },
      {
        "x": 6,
        "y": 19,
        "level": 1
      },
      {
        "x": 14,
        "y": 9,
        "level": 1
      },
      {
        "x": 17,
        "y": 20,
        "level": 1
      },
      {
        "x": 10,
        "y": 20,
        "level": 1
      },
      {
        "x": 6,
        "y": 10,
        "level": 2
      },
      {
        "x": 1,
        "y": 16,
        "level": 1
      },
      {
        "x": 19,
        "y": 13,
        "level": 3
      },
      {
        "x": 13,
        "y": 16,
        "level": 1
      }
    ],
    "wormholes": [
      {
        "id": 1,
        "a": {
          "x": 3,
          "y": 7
        },
        "b": {
          "x": 17,
          "y": 7
        }
      },
      {
        "id": 2,
        "a": {
          "x": 7,
          "y": 3
        },
        "b": {
          "x": 7,
          "y": 17
        }
      },
      {
        "id": 3,
        "a": {
          "x": 13,
          "y": 3
        },
        "b": {
          "x": 13,
          "y": 17
        }
      }
    ],
    "hint": "青、粉、金三組蟲洞交織出高維空間隧道，善用蟲洞間的連續彈射！",
    "solutionSteps": [
      {
        "standX": 12,
        "standY": 16,
        "dir": "RIGHT",
        "chipX": 13,
        "chipY": 16,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 18,
        "standY": 13,
        "dir": "RIGHT",
        "chipX": 19,
        "chipY": 13,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 0,
        "standY": 16,
        "dir": "RIGHT",
        "chipX": 1,
        "chipY": 16,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 7,
        "standY": 10,
        "dir": "LEFT",
        "chipX": 6,
        "chipY": 10,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 9,
        "standY": 20,
        "dir": "RIGHT",
        "chipX": 10,
        "chipY": 20,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 17,
        "standY": 0,
        "dir": "UP",
        "chipX": 17,
        "chipY": 20,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 13,
        "standY": 9,
        "dir": "RIGHT",
        "chipX": 14,
        "chipY": 9,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 7,
        "standY": 19,
        "dir": "LEFT",
        "chipX": 6,
        "chipY": 19,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 20,
        "standY": 18,
        "dir": "DOWN",
        "chipX": 20,
        "chipY": 19,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 0,
        "standY": 9,
        "dir": "LEFT",
        "chipX": 20,
        "chipY": 9,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 3,
        "standY": 8,
        "dir": "DOWN",
        "chipX": 3,
        "chipY": 9,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 4,
        "standY": 5,
        "dir": "LEFT",
        "chipX": 3,
        "chipY": 5,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 14,
        "standY": 4,
        "dir": "DOWN",
        "chipX": 14,
        "chipY": 5,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 20,
        "standY": 4,
        "dir": "LEFT",
        "chipX": 19,
        "chipY": 4,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 8,
        "standY": 3,
        "dir": "DOWN",
        "chipX": 8,
        "chipY": 4,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 7,
        "standY": 16,
        "dir": "RIGHT",
        "chipX": 8,
        "chipY": 16,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 11,
        "standY": 10,
        "dir": "LEFT",
        "chipX": 10,
        "chipY": 10,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 17,
        "standY": 17,
        "dir": "UP",
        "chipX": 17,
        "chipY": 16,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 15,
        "standY": 0,
        "dir": "LEFT",
        "chipX": 14,
        "chipY": 0,
        "chipLevel": 5,
        "merged": true
      },
      {
        "standX": 3,
        "standY": 14,
        "dir": "UP",
        "chipX": 3,
        "chipY": 13,
        "chipLevel": 5,
        "merged": true
      },
      {
        "standX": 17,
        "standY": 11,
        "dir": "UP",
        "chipX": 17,
        "chipY": 10,
        "chipLevel": 6,
        "merged": true
      }
    ],
    "mobileVariant": {
      "width": 15,
      "height": 21,
      "grid": [
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ]
      ],
      "chips": [
        {
          "x": 10,
          "y": 0,
          "level": 5
        },
        {
          "x": 10,
          "y": 18,
          "level": 5
        },
        {
          "x": 2,
          "y": 18,
          "level": 2
        },
        {
          "x": 2,
          "y": 8,
          "level": 2
        },
        {
          "x": 12,
          "y": 12,
          "level": 1
        },
        {
          "x": 8,
          "y": 8,
          "level": 1
        },
        {
          "x": 6,
          "y": 12,
          "level": 1
        },
        {
          "x": 6,
          "y": 1,
          "level": 1
        },
        {
          "x": 12,
          "y": 5,
          "level": 1
        },
        {
          "x": 14,
          "y": 0,
          "level": 3
        },
        {
          "x": 5,
          "y": 5,
          "level": 1
        },
        {
          "x": 14,
          "y": 16,
          "level": 3
        },
        {
          "x": 8,
          "y": 15,
          "level": 1
        },
        {
          "x": 4,
          "y": 15,
          "level": 1
        },
        {
          "x": 14,
          "y": 9,
          "level": 2
        },
        {
          "x": 5,
          "y": 9,
          "level": 1
        },
        {
          "x": 2,
          "y": 2,
          "level": 1
        },
        {
          "x": 11,
          "y": 16,
          "level": 2
        },
        {
          "x": 11,
          "y": 9,
          "level": 2
        },
        {
          "x": 5,
          "y": 19,
          "level": 1
        },
        {
          "x": 8,
          "y": 5,
          "level": 1
        },
        {
          "x": 2,
          "y": 12,
          "level": 2
        }
      ],
      "playerStart": {
        "x": 2,
        "y": 11
      },
      "wormholes": [
        {
          "id": 1,
          "a": {
            "x": 2,
            "y": 7
          },
          "b": {
            "x": 12,
            "y": 7
          }
        },
        {
          "id": 2,
          "a": {
            "x": 4,
            "y": 3
          },
          "b": {
            "x": 4,
            "y": 17
          }
        },
        {
          "id": 3,
          "a": {
            "x": 10,
            "y": 3
          },
          "b": {
            "x": 10,
            "y": 17
          }
        }
      ],
      "solutionSteps": [
        {
          "standX": 2,
          "standY": 11,
          "dir": "DOWN",
          "chipX": 2,
          "chipY": 12,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 8,
          "standY": 4,
          "dir": "DOWN",
          "chipX": 8,
          "chipY": 5,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 5,
          "standY": 20,
          "dir": "UP",
          "chipX": 5,
          "chipY": 19,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 11,
          "standY": 10,
          "dir": "UP",
          "chipX": 11,
          "chipY": 9,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 12,
          "standY": 16,
          "dir": "LEFT",
          "chipX": 11,
          "chipY": 16,
          "chipLevel": 3,
          "merged": true
        },
        {
          "standX": 2,
          "standY": 1,
          "dir": "DOWN",
          "chipX": 2,
          "chipY": 2,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 4,
          "standY": 9,
          "dir": "RIGHT",
          "chipX": 5,
          "chipY": 9,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 14,
          "standY": 10,
          "dir": "UP",
          "chipX": 14,
          "chipY": 9,
          "chipLevel": 3,
          "merged": true
        },
        {
          "standX": 5,
          "standY": 15,
          "dir": "LEFT",
          "chipX": 4,
          "chipY": 15,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 8,
          "standY": 14,
          "dir": "DOWN",
          "chipX": 8,
          "chipY": 15,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 14,
          "standY": 17,
          "dir": "UP",
          "chipX": 14,
          "chipY": 16,
          "chipLevel": 4,
          "merged": true
        },
        {
          "standX": 4,
          "standY": 5,
          "dir": "RIGHT",
          "chipX": 5,
          "chipY": 5,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 0,
          "standY": 0,
          "dir": "LEFT",
          "chipX": 14,
          "chipY": 0,
          "chipLevel": 5,
          "merged": true
        },
        {
          "standX": 12,
          "standY": 4,
          "dir": "DOWN",
          "chipX": 12,
          "chipY": 5,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 6,
          "standY": 2,
          "dir": "UP",
          "chipX": 6,
          "chipY": 1,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 7,
          "standY": 12,
          "dir": "LEFT",
          "chipX": 6,
          "chipY": 12,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 9,
          "standY": 8,
          "dir": "LEFT",
          "chipX": 8,
          "chipY": 8,
          "chipLevel": 3,
          "merged": true
        },
        {
          "standX": 12,
          "standY": 13,
          "dir": "UP",
          "chipX": 12,
          "chipY": 12,
          "chipLevel": 3,
          "merged": true
        },
        {
          "standX": 2,
          "standY": 9,
          "dir": "UP",
          "chipX": 2,
          "chipY": 8,
          "chipLevel": 4,
          "merged": true
        },
        {
          "standX": 3,
          "standY": 18,
          "dir": "LEFT",
          "chipX": 2,
          "chipY": 18,
          "chipLevel": 5,
          "merged": true
        },
        {
          "standX": 10,
          "standY": 19,
          "dir": "UP",
          "chipX": 10,
          "chipY": 18,
          "chipLevel": 6,
          "merged": true
        }
      ],
      "parMoves": 27
    }
  },
  {
    "id": 24,
    "chapter": 4,
    "chapterName": "Level.4：超級電腦誕生",
    "title": "終極超級電腦！(The Grand Supercomputer)",
    "subtitle": "21×21 巨型空間 (手機 15×21) · 26顆晶片連鎖升級",
    "width": 21,
    "height": 21,
    "playerStart": {
      "x": 14,
      "y": 7
    },
    "targetLevel": 8,
    "parMoves": 31,
    "wraparound": true,
    "grid": [
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "WALL",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ],
      [
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY",
        "EMPTY"
      ]
    ],
    "chips": [
      {
        "x": 1,
        "y": 0,
        "level": 6
      },
      {
        "x": 1,
        "y": 11,
        "level": 6
      },
      {
        "x": 11,
        "y": 0,
        "level": 4
      },
      {
        "x": 11,
        "y": 11,
        "level": 5
      },
      {
        "x": 17,
        "y": 11,
        "level": 4
      },
      {
        "x": 3,
        "y": 6,
        "level": 2
      },
      {
        "x": 17,
        "y": 18,
        "level": 2
      },
      {
        "x": 17,
        "y": 2,
        "level": 1
      },
      {
        "x": 6,
        "y": 18,
        "level": 1
      },
      {
        "x": 17,
        "y": 7,
        "level": 1
      },
      {
        "x": 6,
        "y": 2,
        "level": 1
      },
      {
        "x": 12,
        "y": 6,
        "level": 3
      },
      {
        "x": 12,
        "y": 16,
        "level": 3
      },
      {
        "x": 6,
        "y": 12,
        "level": 1
      },
      {
        "x": 3,
        "y": 14,
        "level": 1
      },
      {
        "x": 20,
        "y": 14,
        "level": 1
      },
      {
        "x": 20,
        "y": 4,
        "level": 1
      },
      {
        "x": 15,
        "y": 14,
        "level": 1
      },
      {
        "x": 7,
        "y": 7,
        "level": 1
      },
      {
        "x": 3,
        "y": 18,
        "level": 2
      },
      {
        "x": 14,
        "y": 0,
        "level": 2
      },
      {
        "x": 14,
        "y": 3,
        "level": 1
      },
      {
        "x": 9,
        "y": 3,
        "level": 1
      },
      {
        "x": 0,
        "y": 17,
        "level": 1
      },
      {
        "x": 9,
        "y": 17,
        "level": 1
      },
      {
        "x": 14,
        "y": 8,
        "level": 2
      }
    ],
    "wormholes": [
      {
        "id": 1,
        "a": {
          "x": 3,
          "y": 10
        },
        "b": {
          "x": 17,
          "y": 10
        }
      },
      {
        "id": 2,
        "a": {
          "x": 10,
          "y": 3
        },
        "b": {
          "x": 10,
          "y": 17
        }
      },
      {
        "id": 3,
        "a": {
          "x": 5,
          "y": 5
        },
        "b": {
          "x": 15,
          "y": 15
        }
      }
    ],
    "hint": "十六顆晶片的宏偉交響曲！靈活駕馭三組蟲洞與四維環形拓撲，完成最後的 Titan 超級電腦！",
    "solutionSteps": [
      {
        "standX": 14,
        "standY": 7,
        "dir": "DOWN",
        "chipX": 14,
        "chipY": 8,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 9,
        "standY": 16,
        "dir": "DOWN",
        "chipX": 9,
        "chipY": 17,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 20,
        "standY": 17,
        "dir": "RIGHT",
        "chipX": 0,
        "chipY": 17,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 8,
        "standY": 3,
        "dir": "RIGHT",
        "chipX": 9,
        "chipY": 3,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 14,
        "standY": 2,
        "dir": "DOWN",
        "chipX": 14,
        "chipY": 3,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 15,
        "standY": 0,
        "dir": "LEFT",
        "chipX": 14,
        "chipY": 0,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 3,
        "standY": 17,
        "dir": "DOWN",
        "chipX": 3,
        "chipY": 18,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 8,
        "standY": 7,
        "dir": "LEFT",
        "chipX": 7,
        "chipY": 7,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 16,
        "standY": 14,
        "dir": "LEFT",
        "chipX": 15,
        "chipY": 14,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 20,
        "standY": 3,
        "dir": "DOWN",
        "chipX": 20,
        "chipY": 4,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 0,
        "standY": 14,
        "dir": "LEFT",
        "chipX": 20,
        "chipY": 14,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 3,
        "standY": 13,
        "dir": "DOWN",
        "chipX": 3,
        "chipY": 14,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 6,
        "standY": 11,
        "dir": "DOWN",
        "chipX": 6,
        "chipY": 12,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 12,
        "standY": 15,
        "dir": "DOWN",
        "chipX": 12,
        "chipY": 16,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 11,
        "standY": 6,
        "dir": "RIGHT",
        "chipX": 12,
        "chipY": 6,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 5,
        "standY": 2,
        "dir": "RIGHT",
        "chipX": 6,
        "chipY": 2,
        "chipLevel": 1,
        "merged": true
      },
      {
        "standX": 17,
        "standY": 8,
        "dir": "UP",
        "chipX": 17,
        "chipY": 7,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 5,
        "standY": 18,
        "dir": "RIGHT",
        "chipX": 6,
        "chipY": 18,
        "chipLevel": 2,
        "merged": true
      },
      {
        "standX": 17,
        "standY": 3,
        "dir": "UP",
        "chipX": 17,
        "chipY": 2,
        "chipLevel": 3,
        "merged": true
      },
      {
        "standX": 17,
        "standY": 19,
        "dir": "UP",
        "chipX": 17,
        "chipY": 18,
        "chipLevel": 4,
        "merged": true
      },
      {
        "standX": 3,
        "standY": 7,
        "dir": "UP",
        "chipX": 3,
        "chipY": 6,
        "chipLevel": 5,
        "merged": true
      },
      {
        "standX": 16,
        "standY": 11,
        "dir": "RIGHT",
        "chipX": 17,
        "chipY": 11,
        "chipLevel": 6,
        "merged": true
      },
      {
        "standX": 11,
        "standY": 12,
        "dir": "UP",
        "chipX": 11,
        "chipY": 11,
        "chipLevel": 5,
        "merged": true
      },
      {
        "standX": 10,
        "standY": 0,
        "dir": "RIGHT",
        "chipX": 11,
        "chipY": 0,
        "chipLevel": 6,
        "merged": true
      },
      {
        "standX": 1,
        "standY": 12,
        "dir": "UP",
        "chipX": 1,
        "chipY": 11,
        "chipLevel": 7,
        "merged": true
      }
    ],
    "mobileVariant": {
      "width": 15,
      "height": 21,
      "grid": [
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "WALL",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ],
        [
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY",
          "EMPTY"
        ]
      ],
      "chips": [
        {
          "x": 9,
          "y": 0,
          "level": 5
        },
        {
          "x": 9,
          "y": 12,
          "level": 6
        },
        {
          "x": 2,
          "y": 0,
          "level": 5
        },
        {
          "x": 2,
          "y": 8,
          "level": 3
        },
        {
          "x": 2,
          "y": 14,
          "level": 2
        },
        {
          "x": 12,
          "y": 6,
          "level": 2
        },
        {
          "x": 7,
          "y": 6,
          "level": 2
        },
        {
          "x": 12,
          "y": 18,
          "level": 2
        },
        {
          "x": 6,
          "y": 18,
          "level": 1
        },
        {
          "x": 13,
          "y": 14,
          "level": 1
        },
        {
          "x": 13,
          "y": 1,
          "level": 1
        },
        {
          "x": 6,
          "y": 2,
          "level": 1
        },
        {
          "x": 5,
          "y": 12,
          "level": 5
        },
        {
          "x": 5,
          "y": 15,
          "level": 3
        },
        {
          "x": 0,
          "y": 5,
          "level": 1
        },
        {
          "x": 0,
          "y": 11,
          "level": 1
        },
        {
          "x": 12,
          "y": 11,
          "level": 2
        },
        {
          "x": 8,
          "y": 15,
          "level": 1
        },
        {
          "x": 5,
          "y": 8,
          "level": 3
        },
        {
          "x": 8,
          "y": 19,
          "level": 1
        },
        {
          "x": 0,
          "y": 17,
          "level": 1
        },
        {
          "x": 5,
          "y": 5,
          "level": 1
        },
        {
          "x": 9,
          "y": 3,
          "level": 4
        },
        {
          "x": 14,
          "y": 3,
          "level": 3
        },
        {
          "x": 14,
          "y": 8,
          "level": 2
        },
        {
          "x": 14,
          "y": 20,
          "level": 2
        }
      ],
      "playerStart": {
        "x": 14,
        "y": 0
      },
      "wormholes": [
        {
          "id": 1,
          "a": {
            "x": 2,
            "y": 10
          },
          "b": {
            "x": 12,
            "y": 10
          }
        },
        {
          "id": 2,
          "a": {
            "x": 7,
            "y": 3
          },
          "b": {
            "x": 7,
            "y": 17
          }
        },
        {
          "id": 3,
          "a": {
            "x": 3,
            "y": 5
          },
          "b": {
            "x": 11,
            "y": 15
          }
        }
      ],
      "solutionSteps": [
        {
          "standX": 14,
          "standY": 0,
          "dir": "UP",
          "chipX": 14,
          "chipY": 20,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 14,
          "standY": 9,
          "dir": "UP",
          "chipX": 14,
          "chipY": 8,
          "chipLevel": 3,
          "merged": true
        },
        {
          "standX": 0,
          "standY": 3,
          "dir": "LEFT",
          "chipX": 14,
          "chipY": 3,
          "chipLevel": 4,
          "merged": true
        },
        {
          "standX": 9,
          "standY": 4,
          "dir": "UP",
          "chipX": 9,
          "chipY": 3,
          "chipLevel": 5,
          "merged": true
        },
        {
          "standX": 4,
          "standY": 5,
          "dir": "RIGHT",
          "chipX": 5,
          "chipY": 5,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 0,
          "standY": 18,
          "dir": "UP",
          "chipX": 0,
          "chipY": 17,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 8,
          "standY": 18,
          "dir": "DOWN",
          "chipX": 8,
          "chipY": 19,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 5,
          "standY": 9,
          "dir": "UP",
          "chipX": 5,
          "chipY": 8,
          "chipLevel": 3,
          "merged": true
        },
        {
          "standX": 7,
          "standY": 15,
          "dir": "RIGHT",
          "chipX": 8,
          "chipY": 15,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 13,
          "standY": 11,
          "dir": "LEFT",
          "chipX": 12,
          "chipY": 11,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 0,
          "standY": 10,
          "dir": "DOWN",
          "chipX": 0,
          "chipY": 11,
          "chipLevel": 3,
          "merged": true
        },
        {
          "standX": 1,
          "standY": 5,
          "dir": "LEFT",
          "chipX": 0,
          "chipY": 5,
          "chipLevel": 4,
          "merged": true
        },
        {
          "standX": 5,
          "standY": 14,
          "dir": "DOWN",
          "chipX": 5,
          "chipY": 15,
          "chipLevel": 5,
          "merged": true
        },
        {
          "standX": 6,
          "standY": 12,
          "dir": "LEFT",
          "chipX": 5,
          "chipY": 12,
          "chipLevel": 6,
          "merged": true
        },
        {
          "standX": 6,
          "standY": 1,
          "dir": "DOWN",
          "chipX": 6,
          "chipY": 2,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 13,
          "standY": 0,
          "dir": "DOWN",
          "chipX": 13,
          "chipY": 1,
          "chipLevel": 1,
          "merged": true
        },
        {
          "standX": 12,
          "standY": 14,
          "dir": "RIGHT",
          "chipX": 13,
          "chipY": 14,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 7,
          "standY": 18,
          "dir": "LEFT",
          "chipX": 6,
          "chipY": 18,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 12,
          "standY": 19,
          "dir": "UP",
          "chipX": 12,
          "chipY": 18,
          "chipLevel": 3,
          "merged": true
        },
        {
          "standX": 8,
          "standY": 6,
          "dir": "LEFT",
          "chipX": 7,
          "chipY": 6,
          "chipLevel": 2,
          "merged": true
        },
        {
          "standX": 12,
          "standY": 5,
          "dir": "DOWN",
          "chipX": 12,
          "chipY": 6,
          "chipLevel": 3,
          "merged": true
        },
        {
          "standX": 2,
          "standY": 15,
          "dir": "UP",
          "chipX": 2,
          "chipY": 14,
          "chipLevel": 4,
          "merged": true
        },
        {
          "standX": 2,
          "standY": 7,
          "dir": "DOWN",
          "chipX": 2,
          "chipY": 8,
          "chipLevel": 5,
          "merged": true
        },
        {
          "standX": 3,
          "standY": 0,
          "dir": "LEFT",
          "chipX": 2,
          "chipY": 0,
          "chipLevel": 6,
          "merged": true
        },
        {
          "standX": 9,
          "standY": 13,
          "dir": "UP",
          "chipX": 9,
          "chipY": 12,
          "chipLevel": 7,
          "merged": true
        }
      ],
      "parMoves": 31
    }
  }
];
