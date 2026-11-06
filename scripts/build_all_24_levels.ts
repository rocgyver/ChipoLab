import { generateAutoLayoutLevel } from './generate_all_levels';
import { CellType, WormholePair, LevelData } from '../src/types/game';
import * as fs from 'fs';

function createRoom(w: number, h: number, extraWalls: [number, number][] = []): CellType[][] {
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

interface LevelTemplate {
  id: number;
  chapter: number;
  chapterName: string;
  title: string;
  subtitle: string;
  hint: string;
  width: number;
  height: number;
  wraparound: boolean;
  targetLevel: number;
  targetChipCount: number;
  grid: CellType[][];
  wormholes: WormholePair[];
}

const templates: LevelTemplate[] = [
  // ================= Level 1: 基礎合成室 (Expanded 9x7 ~ 13x9, 4~8 chips, Wormholes in 5 & 6) =================
  {
    id: 1,
    chapter: 1,
    chapterName: 'Level.1：基礎合成室',
    title: '首次通電 (First Contact)',
    subtitle: '將 4 個 7400 閘晶片兩兩撞擊合併為 SRAM',
    hint: '走到晶片後方向前推動！晶片會一路滑行並撞擊同級晶片完成合成。',
    width: 9,
    height: 7,
    wraparound: false,
    targetLevel: 2,
    targetChipCount: 4,
    grid: createRoom(9, 7),
    wormholes: [],
  },
  {
    id: 2,
    chapter: 1,
    chapterName: 'Level.1：基礎合成室',
    title: '垂直匯流排 (Vertical Bus)',
    subtitle: '利用縱向軌道完成垂直軸的連續碰撞升級',
    hint: '善用四周牆壁煞停，並在縱向長廊推動晶片進行垂直對撞！',
    width: 9,
    height: 9,
    wraparound: false,
    targetLevel: 2,
    targetChipCount: 4,
    grid: createRoom(9, 9),
    wormholes: [],
  },
  {
    id: 3,
    chapter: 1,
    chapterName: 'Level.1：基礎合成室',
    title: '三角校準 (Triangle Fusion)',
    subtitle: '六顆基礎晶片連續合成，突破邁向 8086 微處理器',
    hint: '先兩兩碰撞合成二級綠色 SRAM，再將它們推向同一直線軌道合成 8086 CPU！',
    width: 11,
    height: 9,
    wraparound: false,
    targetLevel: 3,
    targetChipCount: 6,
    grid: createRoom(11, 9),
    wormholes: [],
  },
  {
    id: 4,
    chapter: 1,
    chapterName: 'Level.1：基礎合成室',
    title: '阻擋牆運用 (Wall Bounce)',
    subtitle: '利用中央阻擋牆改變晶片軌道並在交匯點撞擊升級',
    hint: '立柱可做為晶片的剎車煞停點，避免晶片一路衝到底撞牆受阻。',
    width: 11,
    height: 9,
    wraparound: false,
    targetLevel: 3,
    targetChipCount: 6,
    grid: createRoom(11, 9, [[3, 4], [7, 4], [5, 2], [5, 6]]),
    wormholes: [],
  },
  {
    id: 5,
    chapter: 1,
    chapterName: 'Level.1：基礎合成室',
    title: '轉角對齊 (Corner Alignment)',
    subtitle: '首次解鎖空間蟲洞！穿梭蟲洞引導晶片高速折返相撞',
    hint: '蟲洞能將晶片或博士瞬間傳送到另一端！善用蟲洞跨越空間限制。',
    width: 11,
    height: 9,
    wraparound: false,
    targetLevel: 3,
    targetChipCount: 6,
    grid: createRoom(11, 9, [[5, 3], [5, 5]]),
    wormholes: [{ id: 1, a: { x: 2, y: 4 }, b: { x: 8, y: 4 } }],
  },
  {
    id: 6,
    chapter: 1,
    chapterName: 'Level.1：基礎合成室',
    title: 'SRAM 全面封裝 (SRAM Assembly)',
    subtitle: '雙象限空間調度：結合蟲洞傳送完成大規模閘晶片封裝',
    hint: '利用蟲洞將不同區域的晶片傳遞到同一條推動軸線上撞擊！',
    width: 13,
    height: 9,
    wraparound: false,
    targetLevel: 3,
    targetChipCount: 8,
    grid: createRoom(13, 9, [[6, 2], [6, 6]]),
    wormholes: [{ id: 1, a: { x: 3, y: 2 }, b: { x: 9, y: 6 } }],
  },

  // ================= Level 2: 電路迴廊 (Wraparound Torus, 13x9 ~ 13x13, 6~10 chips, Wormholes in 11 & 12) =================
  {
    id: 7,
    chapter: 2,
    chapterName: 'Level.2：電路迴廊',
    title: '環狀長廊 (The Torus Corridor)',
    subtitle: '空間邊界已解鎖！向左滑出邊界，將從右側邊緣高速折返！',
    hint: '環狀空間沒有盡頭！滑過右邊界會立即從左側穿越回來，靈活利用折返空間包抄！',
    width: 13,
    height: 9,
    wraparound: true,
    targetLevel: 3,
    targetChipCount: 6,
    grid: createOpenGrid(13, 9, [[3, 4], [9, 4]]),
    wormholes: [],
  },
  {
    id: 8,
    chapter: 2,
    chapterName: 'Level.2：電路迴廊',
    title: '隔間穿梭 (Chamber Warp)',
    subtitle: '穿越中央隔間，利用左右邊界環狀折返進行空間包抄',
    hint: '善用隔間立柱停住晶片，再從環狀通道推向另一端！',
    width: 13,
    height: 11,
    wraparound: true,
    targetLevel: 4,
    targetChipCount: 8,
    grid: createOpenGrid(13, 11, [[6, 3], [6, 4], [6, 6], [6, 7]]),
    wormholes: [],
  },
  {
    id: 9,
    chapter: 2,
    chapterName: 'Level.2：電路迴廊',
    title: '數學協同處理器 (Math Co-Processor)',
    subtitle: '多晶片連續對撞，誕生傳奇 80387 數學協同處理器',
    hint: '分步合成為四個微處理器，再於中路十字交匯點合成為 80387！',
    width: 13,
    height: 11,
    wraparound: true,
    targetLevel: 4,
    targetChipCount: 8,
    grid: createOpenGrid(13, 11, [[3, 3], [9, 3], [3, 7], [9, 7]]),
    wormholes: [],
  },
  {
    id: 10,
    chapter: 2,
    chapterName: 'Level.2：電路迴廊',
    title: '迴轉避險 (Turnabout Maneuver)',
    subtitle: '利用立柱障礙與環狀通道避免晶片受困死角',
    hint: '如果晶片繞圈滑回，博士可面對滑來方向迎頭擋下，穩住陣腳！',
    width: 13,
    height: 11,
    wraparound: true,
    targetLevel: 4,
    targetChipCount: 8,
    grid: createOpenGrid(13, 11, [[4, 5], [8, 5], [6, 2], [6, 8]]),
    wormholes: [],
  },
  {
    id: 11,
    chapter: 2,
    chapterName: 'Level.2：電路迴廊',
    title: 'S 型導軌 (S-Curve Guide)',
    subtitle: '在錯落的 S 型隔板間結合蟲洞折躍靈巧穿梭',
    hint: 'S 型隔板可改變晶片動向，搭配蟲洞能穿透無法通行的隔板。',
    width: 13,
    height: 11,
    wraparound: true,
    targetLevel: 4,
    targetChipCount: 8,
    grid: createOpenGrid(13, 11, [[3, 3], [4, 3], [5, 3], [7, 7], [8, 7], [9, 7]]),
    wormholes: [{ id: 1, a: { x: 3, y: 5 }, b: { x: 9, y: 5 } }],
  },
  {
    id: 12,
    chapter: 2,
    chapterName: 'Level.2：電路迴廊',
    title: '十字交會 (Cross Intersection)',
    subtitle: '縱橫雙軸交錯：兩顆 8086 微處理器在蟲洞與中軸線上撞擊升級',
    hint: '中央的蟲洞與環形邊界構成四維動態交通網，瞄準軸心發射晶片！',
    width: 13,
    height: 13,
    wraparound: true,
    targetLevel: 4,
    targetChipCount: 10,
    grid: createOpenGrid(13, 13, [[3, 6], [9, 6], [6, 4], [6, 8]]),
    wormholes: [{ id: 1, a: { x: 6, y: 2 }, b: { x: 6, y: 10 } }],
  },

  // ================= Level 3: 多階處理器 (13x13 ~ 15x15, 8~12 chips, Wormholes in 17 & 18) =================
  {
    id: 13,
    chapter: 3,
    chapterName: 'Level.3：多階處理器',
    title: '跨代合成 (Cross-Gen Fusion)',
    subtitle: '梯級骨牌連鎖：跨越不同世代晶片循序推升至 486 DX2',
    hint: '不同等級晶片不能直接撞擊，必須由低階依序升級後方能與同級結合。',
    width: 13,
    height: 13,
    wraparound: true,
    targetLevel: 5,
    targetChipCount: 8,
    grid: createOpenGrid(13, 13, [[4, 4], [8, 4], [4, 8], [8, 8]]),
    wormholes: [],
  },
  {
    id: 14,
    chapter: 3,
    chapterName: 'Level.3：多階處理器',
    title: '對稱機房 (Symmetric Hub)',
    subtitle: '四象限對稱機房中的高難度空間調度',
    hint: '保持對稱思維，將分散在各象限的次級晶片匯流至中央核心！',
    width: 13,
    height: 13,
    wraparound: true,
    targetLevel: 5,
    targetChipCount: 8,
    grid: createOpenGrid(13, 13, [[3, 3], [9, 3], [3, 9], [9, 9], [6, 6]]),
    wormholes: [],
  },
  {
    id: 15,
    chapter: 3,
    chapterName: 'Level.3：多階處理器',
    title: '486 世代降臨 (486 DX2 Revolution)',
    subtitle: '邁入 32 位元世代！在巨型機房合成出金色 486 DX2 處理器',
    hint: '晶片數量增多時，先鎖定局部的同級晶片兩兩消除，騰出空間給高階晶片。',
    width: 15,
    height: 13,
    wraparound: true,
    targetLevel: 5,
    targetChipCount: 10,
    grid: createOpenGrid(15, 13, [[4, 4], [10, 4], [4, 8], [10, 8]]),
    wormholes: [],
  },
  {
    id: 16,
    chapter: 3,
    chapterName: 'Level.3：多階處理器',
    title: '窄口效應 (Chokepoint)',
    subtitle: '穿過單格走廊狹喉，進行跨隔室高等級升階',
    hint: '長廊狹口只能單向通行，預先算好誰先進誰後出，避免塞車卡住。',
    width: 15,
    height: 13,
    wraparound: true,
    targetLevel: 5,
    targetChipCount: 10,
    grid: createOpenGrid(15, 13, [[7, 2], [7, 3], [7, 4], [7, 8], [7, 9], [7, 10]]),
    wormholes: [],
  },
  {
    id: 17,
    chapter: 3,
    chapterName: 'Level.3：多階處理器',
    title: '階層金字塔 (The Hierarchy Pyramid)',
    subtitle: '金字塔階層連鎖：結合蟲洞折躍一路推升至 Pentium MMX',
    hint: '善用左右對穿的蟲洞，將對側的 486 快速送過來與本地晶片撞擊！',
    width: 15,
    height: 13,
    wraparound: true,
    targetLevel: 6,
    targetChipCount: 10,
    grid: createOpenGrid(15, 13, [[5, 4], [9, 4], [7, 8]]),
    wormholes: [{ id: 1, a: { x: 2, y: 6 }, b: { x: 12, y: 6 } }],
  },
  {
    id: 18,
    chapter: 3,
    chapterName: 'Level.3：多階處理器',
    title: '環狀超頻 (Clock Loop)',
    subtitle: '繞行中央超頻核心，透過蟲洞空間位移將雙處理器送入對撞軌道',
    hint: '對角配置的蟲洞具有強大的跨象限轉移能力，將晶片斜向甩出完成致命一擊！',
    width: 15,
    height: 15,
    wraparound: true,
    targetLevel: 6,
    targetChipCount: 12,
    grid: createOpenGrid(15, 15, [[6, 6], [8, 6], [6, 8], [8, 8]]),
    wormholes: [{ id: 1, a: { x: 3, y: 3 }, b: { x: 11, y: 11 } }],
  },

  // ================= Level 4: 超級電腦誕生 (15x15, Multiple Wormhole Pairs, Complex Baffles, 10~16 chips) =================
  {
    id: 19,
    chapter: 4,
    chapterName: 'Level.4：超級電腦誕生',
    title: '奔騰年代 (Pentium Dawn)',
    subtitle: '四核協同處理器兩兩對撞，穿梭雙蟲洞誕生紅色 Pentium MMX',
    hint: '青色與粉色雙蟲洞構成多重空間隧道，善用雙蟲洞跨越中央立柱牆群！',
    width: 15,
    height: 15,
    wraparound: true,
    targetLevel: 6,
    targetChipCount: 10,
    grid: createOpenGrid(15, 15, [[4, 4], [10, 4], [4, 10], [10, 10], [7, 7]]),
    wormholes: [
      { id: 1, a: { x: 2, y: 7 }, b: { x: 12, y: 7 } },
      { id: 2, a: { x: 7, y: 2 }, b: { x: 7, y: 12 } },
    ],
  },
  {
    id: 20,
    chapter: 4,
    chapterName: 'Level.4：超級電腦誕生',
    title: '光子晶片 (Photonic Core)',
    subtitle: '兩組高階晶片逐步推展，在雙蟲洞與精密立柱間合成 Pentium',
    hint: '光子晶片需極高的精確度，雙蟲洞交叉傳送可快速建立垂直與水平碰撞線。',
    width: 15,
    height: 15,
    wraparound: true,
    targetLevel: 6,
    targetChipCount: 12,
    grid: createOpenGrid(15, 15, [[5, 3], [9, 3], [3, 7], [11, 7], [5, 11], [9, 11]]),
    wormholes: [
      { id: 1, a: { x: 3, y: 3 }, b: { x: 11, y: 11 } },
      { id: 2, a: { x: 11, y: 3 }, b: { x: 3, y: 11 } },
    ],
  },
  {
    id: 21,
    chapter: 4,
    chapterName: 'Level.4：超級電腦誕生',
    title: '量子神經元 (Quantum Entanglement)',
    subtitle: '突破物理極限！在雙蟲洞拓撲空間中合成量子神經晶片 QPU',
    hint: '兩顆 Pentium MMX 在量子隧道中產生糾纏效應，利用外圍環狀通道完成最後衝刺！',
    width: 15,
    height: 15,
    wraparound: true,
    targetLevel: 7,
    targetChipCount: 12,
    grid: createOpenGrid(15, 15, [[4, 7], [10, 7], [7, 4], [7, 10]]),
    wormholes: [
      { id: 1, a: { x: 2, y: 4 }, b: { x: 12, y: 10 } },
      { id: 2, a: { x: 4, y: 12 }, b: { x: 10, y: 2 } },
    ],
  },
  {
    id: 22,
    chapter: 4,
    chapterName: 'Level.4：超級電腦誕生',
    title: '大腦風暴 (Brainstorm Nexus)',
    subtitle: '在錯綜複雜的迷宮與雙蟲洞中調度，推升出量子晶片 QPU',
    hint: '迷宮般的立柱考驗空間規劃能力，觀察每顆晶片的最終匯集路徑！',
    width: 15,
    height: 15,
    wraparound: true,
    targetLevel: 7,
    targetChipCount: 14,
    grid: createOpenGrid(15, 15, [
      [3, 5], [4, 5], [5, 5],
      [9, 9], [10, 9], [11, 9],
      [5, 10], [5, 11],
      [9, 3], [9, 4],
    ]),
    wormholes: [
      { id: 1, a: { x: 3, y: 3 }, b: { x: 11, y: 11 } },
      { id: 2, a: { x: 2, y: 12 }, b: { x: 12, y: 2 } },
    ],
  },
  {
    id: 23,
    chapter: 4,
    chapterName: 'Level.4：超級電腦誕生',
    title: '超級電腦前夕 (Eve of Supercomputing)',
    subtitle: '三組空間蟲洞穿梭：由 5 級、6 級一路推動合成至 7 級量子核心',
    hint: '青、粉、金三組蟲洞交織出高維空間隧道，善用蟲洞間的連續彈射！',
    width: 15,
    height: 15,
    wraparound: true,
    targetLevel: 7,
    targetChipCount: 14,
    grid: createOpenGrid(15, 15, [[5, 5], [9, 5], [5, 9], [9, 9], [7, 2], [7, 12]]),
    wormholes: [
      { id: 1, a: { x: 2, y: 5 }, b: { x: 12, y: 5 } },
      { id: 2, a: { x: 5, y: 2 }, b: { x: 5, y: 12 } },
      { id: 3, a: { x: 9, y: 2 }, b: { x: 9, y: 12 } },
    ],
  },
  {
    id: 24,
    chapter: 4,
    chapterName: 'Level.4：超級電腦誕生',
    title: '終極超級電腦！(The Grand Supercomputer)',
    subtitle: '全劇終極殿堂：穿越三組蟲洞與環形矩陣，合成無上榮耀的超級電腦！',
    hint: '十六顆晶片的宏偉交響曲！靈活駕馭三組蟲洞與四維環形拓撲，完成最後的 Titan 超級電腦！',
    width: 15,
    height: 15,
    wraparound: true,
    targetLevel: 8,
    targetChipCount: 16,
    grid: createOpenGrid(15, 15, [
      [3, 3], [11, 3], [3, 11], [11, 11],
      [7, 5], [7, 9], [5, 7], [9, 7],
    ]),
    wormholes: [
      { id: 1, a: { x: 2, y: 7 }, b: { x: 12, y: 7 } },
      { id: 2, a: { x: 7, y: 2 }, b: { x: 7, y: 12 } },
      { id: 3, a: { x: 4, y: 4 }, b: { x: 10, y: 10 } },
    ],
  },
];

console.log('Starting Auto-Layout Level Generation for all 24 stages...');
const finalLevels: any[] = [];

for (const tmpl of templates) {
  process.stdout.write(`Generating Level ${tmpl.id} (${tmpl.title})... `);
  const genResult = generateAutoLayoutLevel({
    width: tmpl.width,
    height: tmpl.height,
    wraparound: tmpl.wraparound,
    grid: tmpl.grid,
    wormholes: tmpl.wormholes,
    targetLevel: tmpl.targetLevel,
    targetChipCount: tmpl.targetChipCount,
  });

  if (!genResult) {
    console.error(`FAILED to generate Level ${tmpl.id}!`);
    process.exit(1);
  }

  console.log(`SUCCESS! Generated ${genResult.chips.length} chips, ${genResult.solutionSteps.length} verified steps.`);

  finalLevels.push({
    id: tmpl.id,
    chapter: tmpl.chapter,
    chapterName: tmpl.chapterName,
    title: tmpl.title,
    subtitle: tmpl.subtitle,
    width: tmpl.width,
    height: tmpl.height,
    playerStart: genResult.playerStart,
    targetLevel: tmpl.targetLevel,
    parMoves: genResult.solutionSteps.length,
    wraparound: tmpl.wraparound,
    grid: tmpl.grid,
    chips: genResult.chips,
    wormholes: tmpl.wormholes.length > 0 ? tmpl.wormholes : undefined,
    hint: tmpl.hint,
    solutionSteps: genResult.solutionSteps,
  });
}

const fab0Definition = `  {
    "id": 0,
    "chapter": 0,
    "chapterName": "Level.0：晶片工廠",
    "title": "Fab.0 - 晶片創世紀",
    "subtitle": "15×15 晶圓廠巨型無塵室 · 四邊 1/3 短牆與環形空間 · 合成超級電腦",
    "width": 15,
    "height": 15,
    "playerStart": {
      "x": 7,
      "y": 7
    },
    "targetLevel": 8,
    "parMoves": 36,
    "wraparound": true,
    "grid": createPartialBoundaryRoom(
      15,
      15,
      // Four edges: each edge has approx 1/3 wall coverage, divided into 2 short segments
      [
        // Top edge y=0 (5 walls: 2 segments)
        [2, 0], [3, 0], [4, 0], [10, 0], [11, 0],
        // Bottom edge y=14 (5 walls: 2 segments)
        [3, 14], [4, 14], [9, 14], [10, 14], [11, 14],
        // Left edge x=0 (5 walls: 2 segments)
        [0, 2], [0, 3], [0, 4], [0, 10], [0, 11],
        // Right edge x=14 (5 walls: 2 segments)
        [14, 3], [14, 4], [14, 9], [14, 10], [14, 11]
      ],
      // 6 interior obstacle walls
      [
        [3, 4],
        [11, 4],
        [2, 8],
        [12, 8],
        [4, 10],
        [10, 10]
      ]
    ),
    "chips": [
      { "x": 3, "y": 2, "level": 1 },
      { "x": 6, "y": 2, "level": 1 },
      { "x": 8, "y": 2, "level": 1 },
      { "x": 11, "y": 2, "level": 1 },
      { "x": 3, "y": 12, "level": 1 },
      { "x": 6, "y": 12, "level": 1 },
      { "x": 8, "y": 12, "level": 1 },
      { "x": 11, "y": 12, "level": 1 },
      { "x": 2, "y": 5, "level": 2 },
      { "x": 5, "y": 5, "level": 2 },
      { "x": 9, "y": 5, "level": 2 },
      { "x": 12, "y": 5, "level": 2 },
      { "x": 3, "y": 8, "level": 3 },
      { "x": 11, "y": 8, "level": 3 },
      { "x": 7, "y": 4, "level": 4 },
      { "x": 5, "y": 9, "level": 6 },
      { "x": 9, "y": 9, "level": 7 }
    ],
    "hint": "Fab.0 四周邊界各留約 1/3 的兩段短牆壁，其餘為環狀穿越邊界。善用短牆煞停並將周圍晶片引導對撞，逐級連鎖推升至 Titan 超級電腦！"
  }`;

// Assemble new levels.ts
const newLevelsTs = `import { LevelData, CellType } from '../types/game';

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
` + fab0Definition + `,
` + finalLevels.map((lvl) => '  ' + JSON.stringify(lvl, null, 2)).join(',\n') + `
];
`;

fs.writeFileSync('src/data/levels.ts', newLevelsTs);
console.log('All 24 levels generated and written to src/data/levels.ts successfully!');
