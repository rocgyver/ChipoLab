import { generateAutoLayoutLevel } from './generate_all_levels';
import { CellType, WormholePair, LevelData, SolutionStep } from '../src/types/game';
import { calculatePush, getDirectionDelta } from '../src/utils/gameLogic';
import * as fs from 'fs';

function simulatePushSequence(
  grid: CellType[][],
  chips: { x: number; y: number; level: number }[],
  wormholes: WormholePair[],
  wraparound: boolean,
  solutionSteps: SolutionStep[],
  targetLevel: number
): { success: boolean; remainingCount: number; finalLevel?: number } {
  let currentChips = chips.map((c, i) => ({
    id: `chip-${i}`,
    x: c.x,
    y: c.y,
    level: c.level,
  }));

  const w = grid[0].length;
  const h = grid.length;

  for (let s = 0; s < solutionSteps.length; s++) {
    const step = solutionSteps[s];
    const { dx, dy } = getDirectionDelta(step.dir);
    const targetX = wraparound
      ? ((step.standX + dx) % w + w) % w
      : step.standX + dx;
    const targetY = wraparound
      ? ((step.standY + dy) % h + h) % h
      : step.standY + dy;

    const frontChip = currentChips.find((c) => c.x === targetX && c.y === targetY);
    if (!frontChip) return { success: false, remainingCount: currentChips.length };

    const pushRes = calculatePush(
      grid,
      currentChips,
      frontChip,
      step.dir,
      wraparound,
      wormholes
    );

    if (!pushRes.canPush || !pushRes.moved) return { success: false, remainingCount: currentChips.length };

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
  return { success, remainingCount: currentChips.length, finalLevel: currentChips[0]?.level };
}

function createOpenGrid(w: number, h: number, walls: [number, number][] = []): CellType[][] {
  const grid: CellType[][] = [];
  for (let y = 0; y < h; y++) {
    const row: CellType[] = [];
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

interface ScaledLevelDef {
  id: number;
  desktop: {
    width: number;
    height: number;
    targetChipCount: number;
    targetLevel: number;
    wraparound: boolean;
    grid: CellType[][];
    wormholes: WormholePair[];
  };
  mobile: {
    width: number;
    height: number;
    targetChipCount: number;
    targetLevel: number;
    wraparound: boolean;
    grid: CellType[][];
    wormholes: WormholePair[];
  };
}

const scaledDefs: ScaledLevelDef[] = [
  // Level 16: 窄口效應 (Chokepoint)
  // Chips: 10 * 1.6 = 16
  // Desktop: 21x19 (W+40%, H+40%)
  // Mobile: 15x19 (W unchanged, H+40%)
  {
    id: 16,
    desktop: {
      width: 21,
      height: 19,
      targetChipCount: 16,
      targetLevel: 5,
      wraparound: true,
      grid: createOpenGrid(21, 19, [
        [10, 2], [10, 3], [10, 4], [10, 5],
        [10, 13], [10, 14], [10, 15], [10, 16],
        [5, 5], [15, 5], [5, 13], [15, 13],
      ]),
      wormholes: [],
    },
    mobile: {
      width: 15,
      height: 19,
      targetChipCount: 16,
      targetLevel: 5,
      wraparound: true,
      grid: createOpenGrid(15, 19, [
        [7, 2], [7, 3], [7, 4], [7, 5],
        [7, 13], [7, 14], [7, 15], [7, 16],
        [3, 5], [11, 5], [3, 13], [11, 13],
      ]),
      wormholes: [],
    },
  },

  // Level 17: 階層金字塔 (The Hierarchy Pyramid)
  // Chips: 10 * 1.6 = 16
  // Desktop: 21x19, Mobile: 15x19
  {
    id: 17,
    desktop: {
      width: 21,
      height: 19,
      targetChipCount: 16,
      targetLevel: 6,
      wraparound: true,
      grid: createOpenGrid(21, 19, [
        [10, 4], [7, 8], [13, 8], [5, 12], [15, 12], [8, 15], [12, 15],
      ]),
      wormholes: [{ id: 1, a: { x: 3, y: 9 }, b: { x: 17, y: 9 } }],
    },
    mobile: {
      width: 15,
      height: 19,
      targetChipCount: 16,
      targetLevel: 6,
      wraparound: true,
      grid: createOpenGrid(15, 19, [
        [7, 4], [5, 8], [9, 8], [3, 12], [11, 12], [5, 15], [9, 15],
      ]),
      wormholes: [{ id: 1, a: { x: 2, y: 9 }, b: { x: 12, y: 9 } }],
    },
  },

  // Level 18: 環狀超頻 (Clock Loop)
  // Chips: 12 * 1.6 = 19.2 -> 20
  // Desktop: 21x21, Mobile: 15x21
  {
    id: 18,
    desktop: {
      width: 21,
      height: 21,
      targetChipCount: 20,
      targetLevel: 6,
      wraparound: true,
      grid: createOpenGrid(21, 21, [
        [9, 9], [11, 9], [9, 11], [11, 11],
        [5, 5], [15, 5], [5, 15], [15, 15],
      ]),
      wormholes: [{ id: 1, a: { x: 4, y: 4 }, b: { x: 16, y: 16 } }],
    },
    mobile: {
      width: 15,
      height: 21,
      targetChipCount: 20,
      targetLevel: 6,
      wraparound: true,
      grid: createOpenGrid(15, 21, [
        [6, 9], [8, 9], [6, 11], [8, 11],
        [3, 4], [11, 4], [3, 16], [11, 16],
      ]),
      wormholes: [{ id: 1, a: { x: 3, y: 3 }, b: { x: 11, y: 17 } }],
    },
  },

  // Level 22: 大腦風暴 (Brainstorm Nexus)
  // Chips: 14 * 1.6 = 22.4 -> 22
  // Desktop: 21x21, Mobile: 15x21
  {
    id: 22,
    desktop: {
      width: 21,
      height: 21,
      targetChipCount: 22,
      targetLevel: 7,
      wraparound: true,
      grid: createOpenGrid(21, 21, [
        [5, 7], [6, 7], [7, 7],
        [13, 13], [14, 13], [15, 13],
        [7, 14], [7, 15],
        [13, 5], [13, 6],
        [10, 10],
      ]),
      wormholes: [
        { id: 1, a: { x: 4, y: 4 }, b: { x: 16, y: 16 } },
        { id: 2, a: { x: 3, y: 17 }, b: { x: 17, y: 3 } },
      ],
    },
    mobile: {
      width: 15,
      height: 21,
      targetChipCount: 22,
      targetLevel: 7,
      wraparound: true,
      grid: createOpenGrid(15, 21, [
        [3, 6], [4, 6], [5, 6],
        [9, 14], [10, 14], [11, 14],
        [5, 15], [5, 16],
        [9, 4], [9, 5],
        [7, 10],
      ]),
      wormholes: [
        { id: 1, a: { x: 3, y: 3 }, b: { x: 11, y: 17 } },
        { id: 2, a: { x: 2, y: 17 }, b: { x: 12, y: 3 } },
      ],
    },
  },

  // Level 23: 超級電腦前夕 (Eve of Supercomputing)
  // Chips: 14 * 1.6 = 22.4 -> 22
  // Desktop: 21x21, Mobile: 15x21
  {
    id: 23,
    desktop: {
      width: 21,
      height: 21,
      targetChipCount: 22,
      targetLevel: 7,
      wraparound: true,
      grid: createOpenGrid(21, 21, [
        [7, 7], [13, 7], [7, 13], [13, 13], [10, 3], [10, 17],
      ]),
      wormholes: [
        { id: 1, a: { x: 3, y: 7 }, b: { x: 17, y: 7 } },
        { id: 2, a: { x: 7, y: 3 }, b: { x: 7, y: 17 } },
        { id: 3, a: { x: 13, y: 3 }, b: { x: 13, y: 17 } },
      ],
    },
    mobile: {
      width: 15,
      height: 21,
      targetChipCount: 22,
      targetLevel: 7,
      wraparound: true,
      grid: createOpenGrid(15, 21, [
        [4, 7], [10, 7], [4, 13], [10, 13], [7, 3], [7, 17],
      ]),
      wormholes: [
        { id: 1, a: { x: 2, y: 7 }, b: { x: 12, y: 7 } },
        { id: 2, a: { x: 4, y: 3 }, b: { x: 4, y: 17 } },
        { id: 3, a: { x: 10, y: 3 }, b: { x: 10, y: 17 } },
      ],
    },
  },

  // Level 24: 終極超級電腦！(The Grand Supercomputer)
  // Chips: 16 * 1.6 = 25.6 -> 26
  // Desktop: 21x21, Mobile: 15x21
  {
    id: 24,
    desktop: {
      width: 21,
      height: 21,
      targetChipCount: 26,
      targetLevel: 8,
      wraparound: true,
      grid: createOpenGrid(21, 21, [
        [4, 4], [16, 4], [4, 16], [16, 16],
        [10, 7], [10, 13], [7, 10], [13, 10],
      ]),
      wormholes: [
        { id: 1, a: { x: 3, y: 10 }, b: { x: 17, y: 10 } },
        { id: 2, a: { x: 10, y: 3 }, b: { x: 10, y: 17 } },
        { id: 3, a: { x: 5, y: 5 }, b: { x: 15, y: 15 } },
      ],
    },
    mobile: {
      width: 15,
      height: 21,
      targetChipCount: 26,
      targetLevel: 8,
      wraparound: true,
      grid: createOpenGrid(15, 21, [
        [3, 4], [11, 4], [3, 16], [11, 16],
        [7, 8], [7, 12], [4, 10], [10, 10],
      ]),
      wormholes: [
        { id: 1, a: { x: 2, y: 10 }, b: { x: 12, y: 10 } },
        { id: 2, a: { x: 7, y: 3 }, b: { x: 7, y: 17 } },
        { id: 3, a: { x: 3, y: 5 }, b: { x: 11, y: 15 } },
      ],
    },
  },
];

console.log('Generating Desktop & Mobile Variants for Level 16, 17, 18, 22, 23, 24...');

const results: Record<number, { desktop: any; mobile: any }> = {};

for (const def of scaledDefs) {
  console.log(`\n--- Generating Level ${def.id} ---`);

  // Generate Desktop
  console.log(`Generating Desktop (${def.desktop.width}x${def.desktop.height}, ${def.desktop.targetChipCount} chips)...`);
  let dtResult: any = null;
  for (let attempt = 0; attempt < 10; attempt++) {
    const res = generateAutoLayoutLevel(def.desktop);
    if (res) {
      const sim = simulatePushSequence(
        def.desktop.grid,
        res.chips,
        def.desktop.wormholes,
        def.desktop.wraparound,
        res.solutionSteps,
        def.desktop.targetLevel
      );
      if (sim.success) {
        dtResult = { ...res, parMoves: res.solutionSteps.length + 6 };
        console.log(`  ✓ Desktop verified in attempt ${attempt + 1}: ${res.chips.length} chips, ${res.solutionSteps.length} moves`);
        break;
      }
    }
  }
  if (!dtResult) {
    throw new Error(`Failed to generate solvable Desktop variant for Level ${def.id}`);
  }

  // Generate Mobile
  console.log(`Generating Mobile (${def.mobile.width}x${def.mobile.height}, ${def.mobile.targetChipCount} chips)...`);
  let mbResult: any = null;
  for (let attempt = 0; attempt < 10; attempt++) {
    const res = generateAutoLayoutLevel(def.mobile);
    if (res) {
      const sim = simulatePushSequence(
        def.mobile.grid,
        res.chips,
        def.mobile.wormholes,
        def.mobile.wraparound,
        res.solutionSteps,
        def.mobile.targetLevel
      );
      if (sim.success) {
        mbResult = { ...res, parMoves: res.solutionSteps.length + 6 };
        console.log(`  ✓ Mobile verified in attempt ${attempt + 1}: ${res.chips.length} chips, ${res.solutionSteps.length} moves`);
        break;
      }
    }
  }
  if (!mbResult) {
    throw new Error(`Failed to generate solvable Mobile variant for Level ${def.id}`);
  }

  results[def.id] = { desktop: dtResult, mobile: mbResult };
}

fs.writeFileSync('scripts/scaled_results.json', JSON.stringify(results, null, 2));
console.log('\nAll 6 stages (both Desktop & Mobile variants) generated and 100% verified! Saved to scripts/scaled_results.json');
