import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Play,
  Copy,
  Check,
  Download,
  Upload,
  AlertCircle,
  Sparkles,
  RotateCcw,
  RotateCw,
  Trash2,
  Settings2,
  Move,
  Scissors,
  HelpCircle,
  Maximize2,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Zap,
  Wand2,
} from 'lucide-react';
import { CellType, Chip, Direction, LevelData, Position, SolutionStep, WormholePair } from '../types/game';
import { evaluateChipBalance, calculatePush, getDirectionDelta, getWormholePartner } from '../utils/gameLogic';
import { CHIP_DEFINITIONS } from '../data/chipEncyclopedia';
import { EinsteinSprite } from './EinsteinSprite';
import { ChipCard } from './ChipCard';
import { sounds } from '../audio/soundEffects';
import { WormholeIcon, WORMHOLE_COLORS } from './WormholeIcon';

interface LevelEditorModalProps {
  initialCustomLevel?: LevelData | null;
  onPlayCustomLevel: (level: LevelData) => void;
  onClose: () => void;
}

type ToolMode = 'WALL' | 'EMPTY' | 'WORMHOLE' | number; // number = chip level 1..8

interface DragItem {
  type: 'CHIP' | 'WALL' | 'WORMHOLE';
  x: number;
  y: number;
  level?: number;
  wormholeId?: number;
  wormholeNode?: 'a' | 'b';
}

interface EditorHistorySnapshot {
  grid: CellType[][];
  chips: { x: number; y: number; level: number }[];
  wormholes: WormholePair[];
  width: number;
  height: number;
  wraparound: boolean;
  title: string;
  solutionSteps?: SolutionStep[];
}

export interface FissionCandidate {
  n: number;
  targetPos: Position;
  pushPos: Position;
  description: string;
}



export const LevelEditorModal: React.FC<LevelEditorModalProps> = ({
  initialCustomLevel,
  onPlayCustomLevel,
  onClose,
}) => {
  // Dimension Selection Dialog State (shown on opening only if no initialCustomLevel)
  const [isDimensionDialogOpen, setIsDimensionDialogOpen] = useState(!initialCustomLevel);
  const [selectedPresetSize, setSelectedPresetSize] = useState<number>(initialCustomLevel?.width || 15);
  const [customWidth, setCustomWidth] = useState<number>(initialCustomLevel?.width || 15);
  const [customHeight, setCustomHeight] = useState<number>(initialCustomLevel?.height || 15);
  const [initialBorderType, setInitialBorderType] = useState<'WALLS' | 'WRAPAROUND' | 'EMPTY'>(
    initialCustomLevel ? (initialCustomLevel.wraparound ? 'WRAPAROUND' : 'WALLS') : 'WRAPAROUND'
  );

  // Board State
  const [width, setWidth] = useState(initialCustomLevel?.width || 15);
  const [height, setHeight] = useState(initialCustomLevel?.height || 15);
  const [wraparound, setWraparound] = useState(initialCustomLevel?.wraparound ?? true);
  const [activeTool, setActiveTool] = useState<ToolMode>(1);
  const [wormholes, setWormholes] = useState<WormholePair[]>(() =>
    initialCustomLevel?.wormholes
      ? initialCustomLevel.wormholes.map((w) => ({ id: w.id, a: { ...w.a }, b: { ...w.b } }))
      : []
  );
  const [pendingWormhole, setPendingWormhole] = useState<Position | null>(null);
  const [title, setTitle] = useState(initialCustomLevel?.title || '自製實驗大樓關卡');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Undo / Redo History
  const [history, setHistory] = useState<EditorHistorySnapshot[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Import / Export State
  const [copied, setCopied] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [showJsonBox, setShowJsonBox] = useState(false);

  // Drag and Drop state (Mouse & Mobile Touch)
  const [draggingItem, setDraggingItem] = useState<DragItem | null>(null);
  const [dragPointerPos, setDragPointerPos] = useState<{ x: number; y: number } | null>(null);
  const [hoverTile, setHoverTile] = useState<{ x: number; y: number } | null>(null);

  // Fission (裂變) Direction Menu State
  const [fissionMenu, setFissionMenu] = useState<{
    x: number;
    y: number;
    chip: { x: number; y: number; level: number };
    validDirections: Record<Direction, FissionCandidate[]>;
  } | null>(null);

  // Auto Layout (自定晶片自動佈局) Dialog State - Single unified count
  const [isAutoLayoutDialogOpen, setIsAutoLayoutDialogOpen] = useState(false);
  const [autoChipsCount, setAutoChipsCount] = useState<number>(12);

  // Mobile long-press detection & click suppression state
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const longPressPosRef = useRef<{ x: number; y: number } | null>(null);
  const isLongPressActiveRef = useRef<boolean>(false);
  const suppressClickRef = useRef<boolean>(false);
  const pendingDragRef = useRef<{
    item: DragItem;
    startX: number;
    startY: number;
  } | null>(null);
  const boardContainerRef = useRef<HTMLDivElement>(null);

  // Initialize empty or walled grid
  const createInitialGrid = useCallback(
    (w: number, h: number, borderType: 'WALLS' | 'WRAPAROUND' | 'EMPTY') => {
      const g: CellType[][] = [];
      for (let y = 0; y < h; y++) {
        const row: CellType[] = [];
        for (let x = 0; x < w; x++) {
          if (borderType === 'WALLS') {
            row.push(x === 0 || x === w - 1 || y === 0 || y === h - 1 ? 'WALL' : 'EMPTY');
          } else {
            row.push('EMPTY');
          }
        }
        g.push(row);
      }
      return g;
    },
    []
  );

  const [grid, setGrid] = useState<CellType[][]>(() =>
    initialCustomLevel?.grid
      ? initialCustomLevel.grid.map((r) => [...r])
      : createInitialGrid(15, 15, 'WRAPAROUND')
  );
  const [editorChips, setEditorChips] = useState<{ x: number; y: number; level: number }[]>(() =>
    initialCustomLevel?.chips
      ? initialCustomLevel.chips.map((c) => ({ x: c.x, y: c.y, level: c.level }))
      : [
          { x: 2, y: 2, level: 1 },
          { x: 3, y: 2, level: 1 },
        ]
  );

  const [editorSolutionSteps, setEditorSolutionSteps] = useState<SolutionStep[]>(
    () => (initialCustomLevel?.solutionSteps ? [...initialCustomLevel.solutionSteps] : [])
  );
  const editorSolutionStepsRef = useRef(editorSolutionSteps);
  editorSolutionStepsRef.current = editorSolutionSteps;

  const editorChipsRef = useRef(editorChips);
  editorChipsRef.current = editorChips;
  const gridRef = useRef(grid);
  gridRef.current = grid;
  const wormholesRef = useRef(wormholes);
  wormholesRef.current = wormholes;

  // Continuous paint & erase dragging state (牆壁連續砌牆與橡皮擦連續清除)
  const paintDragRef = useRef<{
    tool: 'WALL' | 'EMPTY';
    paintedTiles: Set<string>;
    hasModified: boolean;
  } | null>(null);

  // Initialize history snapshot if starting from initialCustomLevel
  useEffect(() => {
    if (initialCustomLevel && history.length === 0) {
      const snap: EditorHistorySnapshot = {
        grid: initialCustomLevel.grid.map((r) => [...r]),
        chips: initialCustomLevel.chips.map((c) => ({ x: c.x, y: c.y, level: c.level })),
        wormholes: (initialCustomLevel.wormholes || []).map((w) => ({
          id: w.id,
          a: { ...w.a },
          b: { ...w.b },
        })),
        width: initialCustomLevel.width,
        height: initialCustomLevel.height,
        wraparound: !!initialCustomLevel.wraparound,
        title: initialCustomLevel.title || '自製實驗大樓關卡',
        solutionSteps: initialCustomLevel.solutionSteps ? [...initialCustomLevel.solutionSteps] : [],
      };
      setHistory([snap]);
      setHistoryIndex(0);
    }
  }, [initialCustomLevel, history.length]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    };
  }, []);

  // Push snapshot to history
  const recordHistory = useCallback(
    (
      newGrid: CellType[][],
      newChips: { x: number; y: number; level: number }[],
      newWormholes: WormholePair[] = wormholes,
      w: number = width,
      h: number = height,
      wrap: boolean = wraparound,
      solSteps: SolutionStep[] = editorSolutionStepsRef.current
    ) => {
      setEditorSolutionSteps(solSteps);
      const snapshot: EditorHistorySnapshot = {
        grid: newGrid.map((row) => [...row]),
        chips: newChips.map((c) => ({ ...c })),
        wormholes: newWormholes.map((p) => ({ id: p.id, a: { ...p.a }, b: { ...p.b } })),
        width: w,
        height: h,
        wraparound: wrap,
        title,
        solutionSteps: [...solSteps],
      };

      setHistory((prev) => {
        const truncated = prev.slice(0, historyIndex + 1);
        return [...truncated, snapshot];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [width, height, wraparound, wormholes, title, historyIndex]
  );

  // Show temporary toast message
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Find first open floor tile on the board to serve as Einstein's starting point
  const getAutoPlayerStart = useCallback((): Position => {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (grid[y]?.[x] === 'WALL' || grid[y]?.[x] === 'OBSTACLE') continue;
        if (editorChips.some((c) => c.x === x && c.y === y)) continue;
        if (wormholes.some((w) => (w.a.x === x && w.a.y === y) || (w.b.x === x && w.b.y === y))) continue;
        return { x, y };
      }
    }
    return { x: 0, y: 0 };
  }, [grid, editorChips, wormholes, width, height]);

  // Confirm size from dialog and build blank board
  const handleConfirmDimensions = () => {
    const finalW = Math.min(20, Math.max(5, customWidth));
    const finalH = Math.min(20, Math.max(5, customHeight));
    const newGrid = createInitialGrid(finalW, finalH, initialBorderType);
    const newChips: { x: number; y: number; level: number }[] = [];
    const newWormholes: WormholePair[] = [];
    const newWrap = initialBorderType === 'WRAPAROUND';

    setWidth(finalW);
    setHeight(finalH);
    setGrid(newGrid);
    setEditorChips(newChips);
    setWormholes(newWormholes);
    setPendingWormhole(null);
    setWraparound(newWrap);

    // Initial history state
    const snapshot: EditorHistorySnapshot = {
      grid: newGrid.map((row) => [...row]),
      chips: [],
      wormholes: [],
      width: finalW,
      height: finalH,
      wraparound: newWrap,
      title,
    };
    setHistory([snapshot]);
    setHistoryIndex(0);

    setIsDimensionDialogOpen(false);
    showToast(`已建立 ${finalW}×${finalH} 空白實驗大樓！請開始規劃`);
  };

  // Undo Handler
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const targetIdx = historyIndex - 1;
      const snap = history[targetIdx];
      setGrid(snap.grid.map((r) => [...r]));
      setEditorChips(snap.chips.map((c) => ({ ...c })));
      setWormholes((snap.wormholes || []).map((p) => ({ id: p.id, a: { ...p.a }, b: { ...p.b } })));
      setWidth(snap.width);
      setHeight(snap.height);
      setWraparound(snap.wraparound);
      setTitle(snap.title);
      setEditorSolutionSteps(snap.solutionSteps ? [...snap.solutionSteps] : []);
      setHistoryIndex(targetIdx);
      sounds.playStep();
    }
  }, [history, historyIndex]);

  // Redo Handler
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const targetIdx = historyIndex + 1;
      const snap = history[targetIdx];
      setGrid(snap.grid.map((r) => [...r]));
      setEditorChips(snap.chips.map((c) => ({ ...c })));
      setWormholes((snap.wormholes || []).map((p) => ({ id: p.id, a: { ...p.a }, b: { ...p.b } })));
      setWidth(snap.width);
      setHeight(snap.height);
      setWraparound(snap.wraparound);
      setTitle(snap.title);
      setEditorSolutionSteps(snap.solutionSteps ? [...snap.solutionSteps] : []);
      setHistoryIndex(targetIdx);
      sounds.playStep();
    }
  }, [history, historyIndex]);

  // Keyboard shortcut listener for Ctrl+Z, Ctrl+Y, Ctrl+Shift+Z
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Z')) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Check balance
  const balance = evaluateChipBalance(editorChips);

  // 1. (點擊) Click / Tap Handling
  // 筆刷選定一個物件後，點擊棋盤空白格子表示在此置放該物件；點擊已置放物件表示立即清除它。
  const handleCellClick = (x: number, y: number) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }

    const existingChip = editorChipsRef.current.find((c) => c.x === x && c.y === y);
    const existingWormholePair = wormholes.find(
      (w) => (w.a.x === x && w.a.y === y) || (w.b.x === x && w.b.y === y)
    );
    const isWall = grid[y][x] === 'WALL';

    // (A) Clicking on an ALREADY PLACED OBJECT: Clear it immediately!
    if (existingChip) {
      const nextChips = editorChipsRef.current.filter((c) => !(c.x === x && c.y === y));
      setEditorChips(nextChips);
      recordHistory(grid, nextChips, wormholes);
      sounds.playBump();
      return;
    }

    if (existingWormholePair) {
      const nextWormholes = wormholes.filter((w) => w.id !== existingWormholePair.id);
      setWormholes(nextWormholes);
      if (pendingWormhole && ((pendingWormhole.x === x && pendingWormhole.y === y))) {
        setPendingWormhole(null);
      }
      recordHistory(grid, editorChipsRef.current, nextWormholes);
      showToast(`已移除蟲洞 #${existingWormholePair.id} 空間雙向配對`);
      sounds.playBump();
      return;
    }

    if (isWall) {
      const nextGrid = grid.map((r) => [...r]);
      nextGrid[y][x] = 'EMPTY';
      setGrid(nextGrid);
      recordHistory(nextGrid, editorChipsRef.current, wormholes);
      sounds.playBump();
      return;
    }

    // (B) Clicking on an EMPTY TILE: Place active tool object
    if (activeTool === 'WORMHOLE') {
      if (pendingWormhole === null) {
        setPendingWormhole({ x, y });
        showToast('🌀 已設定蟲洞 A 端！請點擊棋盤另一個空格子以完成配對');
        sounds.playStep();
        return;
      } else {
        if (pendingWormhole.x === x && pendingWormhole.y === y) {
          setPendingWormhole(null);
          showToast('已取消本次蟲洞設置');
          return;
        }

        const nextId = wormholes.length > 0 ? Math.max(...wormholes.map((w) => w.id)) + 1 : 1;
        const newPair: WormholePair = {
          id: nextId,
          a: { ...pendingWormhole },
          b: { x, y },
        };
        const nextWormholes = [...wormholes, newPair];
        setWormholes(nextWormholes);
        setPendingWormhole(null);
        recordHistory(grid, editorChipsRef.current, nextWormholes);
        sounds.playWarp();
        showToast(`🌀 成功建立第 #${nextId} 組蟲洞空間連結！`);
        return;
      }
    }

    if (activeTool === 'WALL') {
      const nextGrid = grid.map((r) => [...r]);
      nextGrid[y][x] = 'WALL';
      // Remove any pending wormhole at this spot if any
      if (pendingWormhole && pendingWormhole.x === x && pendingWormhole.y === y) {
        setPendingWormhole(null);
      }
      setGrid(nextGrid);
      recordHistory(nextGrid, editorChipsRef.current, wormholes);
      sounds.playStep();
      return;
    }

    if (activeTool === 'EMPTY') {
      return;
    }

    if (typeof activeTool === 'number') {
      const nextChips = [...editorChipsRef.current, { x, y, level: activeTool }];
      setEditorChips(nextChips);
      recordHistory(grid, nextChips, wormholes);
      sounds.playStep();
    }
  };

  // Calculate available fission n-distances for all 4 directions
  // Fully accounts for Wraparound torus space, Wormhole portals, and reverse push merge physics!
  const calculateFissionOptions = useCallback(
    (
      chip: { x: number; y: number; level: number },
      customChipsList?: { x: number; y: number; level: number }[]
    ) => {
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
      const currentChips = customChipsList || editorChipsRef.current;
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

          // Check grid boundaries
          if (!wraparound && (nextX < 0 || nextX >= width || nextY < 0 || nextY >= height)) {
            break;
          }
          // Check walls / obstacles
          if (grid[nextY][nextX] === 'WALL' || grid[nextY][nextX] === 'OBSTACLE') {
            break;
          }

          let candidateX = nextX;
          let candidateY = nextY;

          // Check if next tile is a wormhole: instant 1-step space transfer!
          const partner = getWormholePartner({ x: nextX, y: nextY }, wormholes);
          if (partner) {
            // Check partner exit tile
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
            // Check if tile has another chip
            if (
              currentChips.some(
                (c) => !(c.x === chipA.x && c.y === chipA.y) && c.x === nextX && c.y === nextY
              )
            ) {
              break;
            }
          }

          // Tile is open floor or exit wormhole: candidate for Chip B
          currX = candidateX;
          currY = candidateY;

          // If curr is back at chipA position (wraparound full loop), stop
          if (currX === chipA.x && currY === chipA.y) {
            break;
          }

          // Push position is 1 step further in direction dir
          const pushX = wraparound ? ((currX + dx) % width + width) % width : currX + dx;
          const pushY = wraparound ? ((currY + dy) % height + height) % height : currY + dy;

          // Push spot must be in bounds
          if (!wraparound && (pushX < 0 || pushX >= width || pushY < 0 || pushY >= height)) {
            continue;
          }
          // Push spot cannot be a wall or obstacle
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

          // Now test physical simulation: when Einstein stands at pushPos and pushes Chip B in `opposite` direction,
          // does it slide (through wraparound and wormholes) and collide/merge with Chip A?
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

          // 新生成的晶片可以緊鄰蟲洞，但絕不要覆蓋在蟲洞上
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
    },
    [grid, width, height, wraparound, wormholes]
  );

  // Helper: Toroidal / Bounded Euclidean tile distance
  const calculateTileDistance = useCallback(
    (p1: Position, p2: Position, isWrap: boolean, boardW: number, boardH: number): number => {
      const dx = isWrap
        ? Math.min(Math.abs(p1.x - p2.x), boardW - Math.abs(p1.x - p2.x))
        : Math.abs(p1.x - p2.x);
      const dy = isWrap
        ? Math.min(Math.abs(p1.y - p2.y), boardH - Math.abs(p1.y - p2.y))
        : Math.abs(p1.y - p2.y);
      return Math.sqrt(dx * dx + dy * dy);
    },
    []
  );

  // Rule 1: Find distance to the first existing object (wall, obstacle, or other chip) in direction `dir`
  const getDistanceToFirstObstacle = useCallback(
    (
      start: Position,
      dir: Direction,
      currentChips: Position[],
      gridData: CellType[][],
      isWrap: boolean,
      boardW: number,
      boardH: number,
      wormholesList: WormholePair[]
    ): number => {
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

        // Check bounded edges
        if (!isWrap && (nextX < 0 || nextX >= boardW || nextY < 0 || nextY >= boardH)) {
          return step;
        }

        // Check walls / obstacles
        if (gridData[nextY]?.[nextX] === 'WALL' || gridData[nextY]?.[nextX] === 'OBSTACLE') {
          return step;
        }

        // Check wormholes
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
          // Check other chips
          if (currentChips.some((c) => !(c.x === start.x && c.y === start.y) && c.x === nextX && c.y === nextY)) {
            return step;
          }
          currX = nextX;
          currY = nextY;
        }

        // If looped all the way back to start in wraparound
        if (currX === start.x && currY === start.y) {
          return isWrap ? Math.max(boardW, boardH) : step;
        }
      }

      return step;
    },
    []
  );

  // Rule 2: Check adjacency to existing objects (chips or walls) & dispersion metrics
  const getAdjacencyInfo = useCallback(
    (
      pos: Position,
      currentChips: Position[],
      gridData: CellType[][],
      isWrap: boolean,
      boardW: number,
      boardH: number
    ) => {
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
    },
    [calculateTileDistance]
  );

  // Rule 2 Selection: Choose candidate displacement n that avoids adjacent objects & maximizes spacing
  const pickBestFissionCandidate = useCallback(
    (
      candidates: FissionCandidate[],
      chipA: Position,
      currentChips: Position[],
      gridData: CellType[][],
      isWrap: boolean,
      boardW: number,
      boardH: number
    ): FissionCandidate => {
      if (candidates.length === 1) return candidates[0];

      const scored = candidates.map((cand) => {
        const adj = getAdjacencyInfo(cand.targetPos, currentChips, gridData, isWrap, boardW, boardH);

        // Heavy penalties for cardinal and diagonal adjacency to existing objects (chips or walls)
        let score = 0;
        if (adj.cardinalAdjacent > 0) score -= adj.cardinalAdjacent * 10000;
        if (adj.diagonalAdjacent > 0) score -= adj.diagonalAdjacent * 2500;

        // High reward for being far from nearest chip (even distribution)
        score += adj.minDistanceToChip * 120;

        // Reward for average distance to all existing chips (global dispersion)
        score += adj.avgDistanceToChips * 30;

        // Reward for distance to walls
        score += Math.min(adj.minDistanceToWall, 5) * 15;

        // Favor larger displacement distance n (moves B further out)
        score += cand.n * 2;

        return { cand, score, adj };
      });

      scored.sort((a, b) => b.score - a.score);

      // If there's a tie or close scores within top 5%, pick among them for variety across runs
      const topScore = scored[0].score;
      const topCandidates = scored.filter((s) => s.score >= topScore - 5);
      return topCandidates[Math.floor(Math.random() * topCandidates.length)].cand;
    },
    [getAdjacencyInfo]
  );

  // Global dispersion metric: maximizes distance between chips and minimizes crowding
  const evaluateBoardDispersion = useCallback(
    (chipsList: Position[], isWrap: boolean, boardW: number, boardH: number): number => {
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
    },
    [calculateTileDistance]
  );

  // Execute Fission in the selected direction with smart non-adjacent placement (Rule 2)
  const handleExecuteFission = useCallback(
    (dir: Direction) => {
      if (!fissionMenu) return;
      const candidates = fissionMenu.validDirections[dir];
      if (!candidates || candidates.length === 0) return;

      const { chip } = fissionMenu;
      const subLevel = chip.level - 1;

      // Smart candidate selection ensuring B chip is not adjacent to existing objects (Rule 2)
      const chosen = pickBestFissionCandidate(
        candidates,
        { x: chip.x, y: chip.y },
        editorChipsRef.current,
        grid,
        wraparound,
        width,
        height
      );

      // Update chip A at (chip.x, chip.y) to subLevel
      // Add chip B at (chosen.targetPos.x, chosen.targetPos.y) with subLevel
      const nextChips = editorChipsRef.current.map((c) =>
        c.x === chip.x && c.y === chip.y ? { ...c, level: subLevel } : c
      );
      nextChips.push({ x: chosen.targetPos.x, y: chosen.targetPos.y, level: subLevel });

      setEditorChips(nextChips);
      recordHistory(grid, nextChips, wormholes);
      sounds.playPush();

      const dirName = dir === 'UP' ? '向上' : dir === 'DOWN' ? '向下' : dir === 'LEFT' ? '向左' : '向右';
      showToast(
        `⚛️ 裂變成功！Chip.${chip.level} 向${dirName}移開 ${chosen.n} 格至 (${chosen.targetPos.x}, ${chosen.targetPos.y})，推動點 (${chosen.pushPos.x}, ${chosen.pushPos.y})！`
      );

      setFissionMenu(null);
    },
    [fissionMenu, grid, wormholes, width, height, wraparound, pickBestFissionCandidate, recordHistory]
  );

  // Open Auto Layout Dialog
  const handleOpenAutoLayoutDialog = useCallback(() => {
    // 讓玩家輸入晶片總數的頁面，不需要加上預先放置的晶片數量，保持常規設定
    setAutoChipsCount((prev) => (prev >= 4 ? prev : 12));
    setIsAutoLayoutDialogOpen(true);
  }, []);

  // Auto Layout algorithm:
  // 1. 若棋盤已有預先佈置晶片，跳過放置超級電腦的步驟，直接以此晶片格局為基礎接續進行定向物理裂變。
  //    若棋盤尚無晶片，則隨機在開闊空白處放置一顆超級電腦 (level 8) 晶片後裂變。
  // 2. 選擇「往某個方向前進，遇到的第一個已存在物件最遠」的方向裂變 (Rule 1)。
  // 3. 決定B晶片位移值(n)時，優先滿足「不緊鄰現有物件」，並最大化全盤分散度 (Rule 2 & Dispersion)。
  // 4. 重複前項動作，直到晶片數量大於等於 K 為止，並從多次推演中選取全盤最平均分佈的格局。
  const handleExecuteAutoLayout = useCallback(
    (targetK: number) => {
      // Find all empty spaces on the board (non-wall, non-obstacle, non-wormhole)
      const emptySpots: Position[] = [];
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (grid[y]?.[x] === 'WALL' || grid[y]?.[x] === 'OBSTACLE') continue;
          if (wormholes.some((w) => (w.a.x === x && w.a.y === y) || (w.b.x === x && w.b.y === y))) continue;
          emptySpots.push({ x, y });
        }
      }

      if (emptySpots.length < 2) {
        showToast('⚠️ 棋盤可用開放空間過小，無法進行自動裂變佈局！');
        return;
      }

      const hasPreplacedChips = editorChips.length > 0;

      if (hasPreplacedChips) {
        if (targetK <= editorChips.length) {
          showToast(`⚠️ 棋盤上現有晶片數（${editorChips.length} 顆）已達到或超過設定的數量（${targetK} 顆）！請設定大於 ${editorChips.length} 顆以繼續加晶片。`);
          return;
        }
        const hasFissionable = editorChips.some((c) => c.level > 1);
        if (!hasFissionable) {
          showToast('⚠️ 棋盤上的預佈置晶片等級皆為 1，無法再進行裂變！請先將部分晶片等級設為 2 以上。');
          return;
        }
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

      const actualTargetK = Math.min(targetK, emptySpots.length);
      let bestResultChips: { x: number; y: number; level: number }[] = [];
      let bestFissionHistory: FissionRecord[] = [];
      let bestDispersionScore = -Infinity;

      // Score empty spots by open space in 4 directions so the initial Supercomputer starts in a spacious location (for empty board mode)
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
      const topEmptySpots = scoredEmptySpots.slice(0, Math.min(12, scoredEmptySpots.length));

      // Multiple random restart attempts (16 attempts) to find the globally most evenly distributed layout
      for (let attempt = 0; attempt < 16; attempt++) {
        const attemptFissionHistory: FissionRecord[] = [];
        let workingChips: { x: number; y: number; level: number }[] = [];

        if (hasPreplacedChips) {
          // Pre-placed chips mode: skip placing supercomputer, start directly from current chips
          workingChips = editorChips.map((c) => ({ x: c.x, y: c.y, level: c.level }));
        } else {
          // Clean layout mode: Step 1: 放置一顆超級電腦 (level 8) 晶片，並向第一障礙最遠的方向裂變 (Rule 1 & Rule 2)
          const startSpot = topEmptySpots[attempt % topEmptySpots.length].spot;
          let initialFissionSuccess = false;

          const testChip = { x: startSpot.x, y: startSpot.y, level: 8 };
          const initialOptions = calculateFissionOptions(testChip, [testChip]);
          const validDirs = (['UP', 'DOWN', 'LEFT', 'RIGHT'] as Direction[]).filter(
            (d) => initialOptions[d] && initialOptions[d].length > 0
          );

          if (validDirs.length > 0) {
            // Rule 1: Find direction where distance to first object is furthest
            const dirDists = validDirs.map((d) => ({
              dir: d,
              dist: getDistanceToFirstObstacle(startSpot, d, [startSpot], grid, wraparound, width, height, wormholes),
            }));
            dirDists.sort((a, b) => b.dist - a.dist);
            const maxDist = dirDists[0].dist;
            const bestDirs = dirDists.filter((d) => d.dist === maxDist).map((d) => d.dir);
            const chosenDir = bestDirs[Math.floor(Math.random() * bestDirs.length)];

            // Rule 2: In chosen direction, pick candidate that avoids adjacent objects
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
              { x: startSpot.x, y: startSpot.y, level: 7 },
              { x: chosenCand.targetPos.x, y: chosenCand.targetPos.y, level: 7 },
            ];
            attemptFissionHistory.push({
              pushPos: { ...chosenCand.pushPos },
              pushDir: OPPOSITE_MAP[chosenDir],
              targetPos: { ...chosenCand.targetPos },
              subLevel: 7,
            });
            initialFissionSuccess = true;
          }

          if (!initialFissionSuccess) {
            continue;
          }
        }

        // Step 2 & 3:
        // 2. 選擇「往某個方向前進，遇到的第一個已存在物件能離A晶片越遠越好」的方向 (Rule 1)。
        // 3. 決定B晶片位移值(n)時，確保B晶片不要緊鄰棋盤上現有的物件 (Rule 2)。
        // 重複進行直到晶片數量達到 targetK。
        let loopCount = 0;
        const maxLoops = actualTargetK * 30;

        while (workingChips.length < actualTargetK && loopCount < maxLoops) {
          loopCount++;
          const fissionableChips = workingChips.filter((c) => c.level > 1);
          if (fissionableChips.length === 0) {
            break;
          }

          // Evaluate all possible fission moves across all fissionable chips
          interface FissionMoveCandidate {
            chip: { x: number; y: number; level: number };
            dir: Direction;
            cand: FissionCandidate;
            distToObj: number;
            qualityScore: number;
          }

          const moveCandidates: FissionMoveCandidate[] = [];

          for (const selectedChip of fissionableChips) {
            const options = calculateFissionOptions(selectedChip, workingChips);
            const validDirsForChip = (['UP', 'DOWN', 'LEFT', 'RIGHT'] as Direction[]).filter(
              (d) => options[d] && options[d].length > 0
            );

            if (validDirsForChip.length === 0) continue;

            // Rule 1: Find direction where distance to first existing object is FURTHEST
            const dirScores = validDirsForChip.map((d) => ({
              dir: d,
              dist: getDistanceToFirstObstacle(
                selectedChip,
                d,
                workingChips,
                grid,
                wraparound,
                width,
                height,
                wormholes
              ),
            }));
            dirScores.sort((a, b) => b.dist - a.dist);
            const maxObjDist = dirScores[0].dist;
            const topDirs = dirScores.filter((d) => d.dist === maxObjDist);
            const selectedDirObj = topDirs[Math.floor(Math.random() * topDirs.length)];

            // Rule 2: In that furthest direction, choose candidate B that is NOT adjacent to existing objects
            const bestCand = pickBestFissionCandidate(
              options[selectedDirObj.dir],
              selectedChip,
              workingChips,
              grid,
              wraparound,
              width,
              height
            );

            // Compute move quality score (evaluating open space and lack of adjacency)
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

          if (moveCandidates.length === 0) {
            break;
          }

          // Pick among the top-rated moves to combine high distribution with search tree variety
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

        // Evaluate overall board dispersion: maximum pairwise distance and minimum crowding
        const attemptDispersion = evaluateBoardDispersion(workingChips, wraparound, width, height);

        if (
          workingChips.length > bestResultChips.length ||
          (workingChips.length === bestResultChips.length && attemptDispersion > bestDispersionScore)
        ) {
          bestResultChips = workingChips;
          bestFissionHistory = attemptFissionHistory;
          bestDispersionScore = attemptDispersion;
        }
      }

      if (hasPreplacedChips) {
        if (bestResultChips.length <= editorChips.length) {
          showToast('⚠️ 現有預佈置晶片周圍空間受限，無足夠空間進行裂變推演！請嘗試調整晶片位置或開啟環狀邊界。');
          return;
        }
      } else {
        if (bestResultChips.length === 0) {
          showToast('⚠️ 自動裂變失敗，請嘗試放寬棋盤障礙或開啟環狀邊界！');
          return;
        }
      }

      // Convert reverse-fission history into forward SolutionSteps
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

      const finalSolutionSteps =
        hasPreplacedChips && editorSolutionSteps && editorSolutionSteps.length > 0
          ? [...generatedSolutionSteps, ...editorSolutionSteps]
          : generatedSolutionSteps;

      setEditorChips(bestResultChips);
      setEditorSolutionSteps(finalSolutionSteps);
      recordHistory(grid, bestResultChips, wormholes, width, height, wraparound, finalSolutionSteps);
      sounds.playVictory();
      setIsAutoLayoutDialogOpen(false);

      if (hasPreplacedChips) {
        const addedCount = bestResultChips.length - editorChips.length;
        if (bestResultChips.length >= actualTargetK) {
          showToast(`✨ 自動佈局完成！已由預佈置的 ${editorChips.length} 顆加晶片至設定的 ${bestResultChips.length} 顆（增加 ${addedCount} 顆，已推演 ${generatedSolutionSteps.length} 步裂變解法）！`);
        } else {
          showToast(`✨ 自動佈局完成！共加晶片至 ${bestResultChips.length} 顆（受限於棋盤當前格局之最大均勻裂變路徑）`);
        }
      } else {
        if (bestResultChips.length >= actualTargetK) {
          showToast(`✨ 自動佈局完成！已生成 ${bestResultChips.length} 顆均勻分佈晶片（已推演 ${generatedSolutionSteps.length} 步通關解法）！`);
        } else {
          showToast(`✨ 自動佈局完成！共生成 ${bestResultChips.length} 顆晶片（棋盤格局已達最大裂變均勻路徑）`);
        }
      }
    },
    [
      grid,
      height,
      width,
      wraparound,
      wormholes,
      editorChips,
      editorSolutionSteps,
      calculateFissionOptions,
      getDistanceToFirstObstacle,
      getAdjacencyInfo,
      pickBestFissionCandidate,
      evaluateBoardDispersion,
      recordHistory,
    ]
  );

  // Desktop Mouse Right-Click Context Menu for Fission
  const handleCellContextMenu = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    e.stopPropagation();

    const chip = editorChipsRef.current.find((c) => c.x === x && c.y === y);
    if (!chip) return;

    if (chip.level <= 1) {
      showToast('⚡ Chip.1 已經是最初級閘晶片，無法進行裂變！');
      sounds.playBump();
      return;
    }

    const options = calculateFissionOptions(chip);
    const hasAnyValid =
      options.UP.length > 0 ||
      options.DOWN.length > 0 ||
      options.LEFT.length > 0 ||
      options.RIGHT.length > 0;

    if (!hasAnyValid) {
      showToast('⚠️ 此晶片四周無足夠直線空間，或博士路徑受阻無法走到推動點！');
      sounds.playBump();
      setFissionMenu(null);
      return;
    }

    setFissionMenu({
      x,
      y,
      chip,
      validDirections: options,
    });
    sounds.playStep();
    showToast('⚛️ 請點選晶片旁的 ↑ ← ↓ → 箭頭裂變（點空白處或按 Esc 取消）');
  };

  // Keyboard Arrow shortcuts for Fission Menu
  useEffect(() => {
    if (!fissionMenu) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFissionMenu(null);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleExecuteFission('UP');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleExecuteFission('DOWN');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleExecuteFission('LEFT');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleExecuteFission('RIGHT');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fissionMenu, handleExecuteFission]);

  // Helper to convert screen client coordinates (mouse or touch) to board tile coordinates
  const getTileFromClientCoords = (clientX: number, clientY: number): { x: number; y: number } | null => {
    if (!boardContainerRef.current) return null;
    const rect = boardContainerRef.current.getBoundingClientRect();
    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      return null;
    }

    const relativeX = clientX - rect.left;
    const relativeY = clientY - rect.top;
    const tileWidth = rect.width / width;
    const tileHeight = rect.height / height;

    const tx = Math.floor(relativeX / tileWidth);
    const ty = Math.floor(relativeY / tileHeight);

    if (tx >= 0 && tx < width && ty >= 0 && ty < height) {
      return { x: tx, y: ty };
    }
    return null;
  };

  // Apply continuous painting or erasing along drag trajectory
  const applyPaintToTile = useCallback(
    (tx: number, ty: number, tool: 'WALL' | 'EMPTY') => {
      if (tx < 0 || tx >= width || ty < 0 || ty >= height) return;
      const key = `${tx},${ty}`;
      if (!paintDragRef.current || paintDragRef.current.paintedTiles.has(key)) return;
      paintDragRef.current.paintedTiles.add(key);

      if (tool === 'WALL') {
        // Continuous wall painting: only paint on empty spaces (not overwriting chips or wormholes)
        const hasChip = editorChipsRef.current.some((c) => c.x === tx && c.y === ty);
        const hasWormhole = wormholesRef.current.some(
          (w) => (w.a.x === tx && w.a.y === ty) || (w.b.x === tx && w.b.y === ty)
        );
        if (!hasChip && !hasWormhole && gridRef.current[ty]?.[tx] !== 'WALL') {
          const nextGrid = gridRef.current.map((row) => [...row]);
          nextGrid[ty][tx] = 'WALL';
          gridRef.current = nextGrid;
          setGrid(nextGrid);
          paintDragRef.current.hasModified = true;
        }
      } else if (tool === 'EMPTY') {
        // Continuous eraser: remove all objects on the trajectory (walls, chips, wormholes)
        let modified = false;
        if (gridRef.current[ty]?.[tx] === 'WALL') {
          const nextGrid = gridRef.current.map((row) => [...row]);
          nextGrid[ty][tx] = 'EMPTY';
          gridRef.current = nextGrid;
          setGrid(nextGrid);
          modified = true;
        }

        const nextChips = editorChipsRef.current.filter((c) => !(c.x === tx && c.y === ty));
        if (nextChips.length !== editorChipsRef.current.length) {
          editorChipsRef.current = nextChips;
          setEditorChips(nextChips);
          modified = true;
        }

        const nextWormholes = wormholesRef.current.filter(
          (w) => !((w.a.x === tx && w.a.y === ty) || (w.b.x === tx && w.b.y === ty))
        );
        if (nextWormholes.length !== wormholesRef.current.length) {
          wormholesRef.current = nextWormholes;
          setWormholes(nextWormholes);
          modified = true;
        }

        if (modified) {
          paintDragRef.current.hasModified = true;
        }
      }
    },
    [width, height]
  );

  // 2. (拖曳) Drag & Drop Handlers (Mouse + Touch Support)
  const handlePointerDownCell = (e: React.PointerEvent, x: number, y: number) => {
    if (isLongPressActiveRef.current) return;

    // Check if clicking existing object
    const chip = editorChipsRef.current.find((c) => c.x === x && c.y === y);
    const wormPair = wormholesRef.current.find((w) => (w.a.x === x && w.a.y === y) || (w.b.x === x && w.b.y === y));
    const isWall = gridRef.current[y]?.[x] === 'WALL';

    // 1. Continuous eraser: removes all objects along drag trajectory
    if (activeTool === 'EMPTY') {
      paintDragRef.current = {
        tool: 'EMPTY',
        paintedTiles: new Set<string>(),
        hasModified: false,
      };
      applyPaintToTile(x, y, 'EMPTY');
      return;
    }

    // 2. Continuous wall paint: dragging across empty spaces builds walls continuously
    if (activeTool === 'WALL' && !chip && !wormPair && !isWall) {
      paintDragRef.current = {
        tool: 'WALL',
        paintedTiles: new Set<string>(),
        hasModified: false,
      };
      applyPaintToTile(x, y, 'WALL');
      return;
    }

    // 3. Object relocation drag (Chip, Wormhole, Wall)
    let item: DragItem | null = null;
    if (chip) {
      item = { type: 'CHIP', x, y, level: chip.level };
    } else if (wormPair) {
      const node = wormPair.a.x === x && wormPair.a.y === y ? 'a' : 'b';
      item = { type: 'WORMHOLE', x, y, wormholeId: wormPair.id, wormholeNode: node };
    } else if (isWall) {
      item = { type: 'WALL', x, y };
    }

    if (item) {
      pendingDragRef.current = {
        item,
        startX: e.clientX,
        startY: e.clientY,
      };
    }
  };

  // Global Pointer Move & Up for Dragging
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      // Paint drag active (Wall or Eraser)
      if (paintDragRef.current) {
        const tile = getTileFromClientCoords(e.clientX, e.clientY);
        if (tile) {
          applyPaintToTile(tile.x, tile.y, paintDragRef.current.tool);
        }
        return;
      }

      // If we have a pending drag item and pointer moved > 8px, activate dragging
      if (pendingDragRef.current && !draggingItem) {
        const dx = e.clientX - pendingDragRef.current.startX;
        const dy = e.clientY - pendingDragRef.current.startY;
        if (Math.hypot(dx, dy) > 8) {
          if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
          }
          setDraggingItem(pendingDragRef.current.item);
          setDragPointerPos({ x: e.clientX, y: e.clientY });
          const tile = getTileFromClientCoords(e.clientX, e.clientY);
          setHoverTile(tile);
        }
      } else if (draggingItem) {
        setDragPointerPos({ x: e.clientX, y: e.clientY });
        const tile = getTileFromClientCoords(e.clientX, e.clientY);
        setHoverTile(tile);
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      // Paint drag finish (Wall or Eraser)
      if (paintDragRef.current) {
        const { tool, hasModified } = paintDragRef.current;
        paintDragRef.current = null;
        if (hasModified) {
          recordHistory(gridRef.current, editorChipsRef.current, wormholesRef.current);
          if (tool === 'WALL') {
            sounds.playStep();
          } else {
            sounds.playBump();
          }
          suppressClickRef.current = true;
          setTimeout(() => {
            suppressClickRef.current = false;
          }, 120);
        }
        return;
      }

      pendingDragRef.current = null;
      if (!draggingItem) return;

      const targetTile = getTileFromClientCoords(e.clientX, e.clientY);
      if (targetTile && (targetTile.x !== draggingItem.x || targetTile.y !== draggingItem.y)) {
        suppressClickRef.current = true;
        setTimeout(() => {
          suppressClickRef.current = false;
        }, 80);

        const { x: toX, y: toY } = targetTile;
        const { x: fromX, y: fromY, type, level, wormholeId, wormholeNode } = draggingItem;

        // Perform Drop Relocation
        if (type === 'WORMHOLE' && wormholeId && wormholeNode) {
          const nextWormholes = wormholes.map((w) =>
            w.id === wormholeId
              ? {
                  ...w,
                  [wormholeNode]: { x: toX, y: toY },
                }
              : w
          );
          setWormholes(nextWormholes);
          recordHistory(grid, editorChipsRef.current, nextWormholes);
          sounds.playWarp();
          showToast(`已移動蟲洞 #${wormholeId} 端點至 (${toX}, ${toY})`);
        } else if (type === 'CHIP' && level) {
          // Relocate chip
          let nextChips = editorChipsRef.current.filter((c) => !(c.x === fromX && c.y === fromY));
          const nextGrid = grid.map((r) => [...r]);
          if (nextGrid[toY][toX] === 'WALL') nextGrid[toY][toX] = 'EMPTY';

          // If target is another chip of same level: prompt to fuse or replace
          const targetChip = nextChips.find((c) => c.x === toX && c.y === toY);
          if (targetChip && targetChip.level === level && level < 8) {
            nextChips = nextChips.filter((c) => !(c.x === toX && c.y === toY));
            nextChips.push({ x: toX, y: toY, level: level + 1 });
            sounds.playPush();
            showToast(`🎉 拖曳合併成功！合成出 Chip.${level + 1}`);
          } else {
            nextChips = nextChips.filter((c) => !(c.x === toX && c.y === toY));
            nextChips.push({ x: toX, y: toY, level });
            sounds.playStep();
            showToast(`已移動 Chip.${level} 至 (${toX}, ${toY})`);
          }

          setGrid(nextGrid);
          setEditorChips(nextChips);
          recordHistory(nextGrid, nextChips, wormholes);
        } else if (type === 'WALL') {
          const nextGrid = grid.map((r) => [...r]);
          nextGrid[fromY][fromX] = 'EMPTY';
          nextGrid[toY][toX] = 'WALL';
          const nextChips = editorChipsRef.current.filter((c) => !(c.x === toX && c.y === toY));

          setGrid(nextGrid);
          setEditorChips(nextChips);
          recordHistory(nextGrid, nextChips, wormholes);
          sounds.playStep();
          showToast(`已移動牆壁至 (${toX}, ${toY})`);
        }
      }

      setDraggingItem(null);
      setDragPointerPos(null);
      setHoverTile(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggingItem, grid, wormholes, width, height, recordHistory, applyPaintToTile]);

  // Touch Handlers for Long-Press (Mobile: 手機長按晶片開啟裂變選單) & Touch continuous drag
  const handleTouchStartCell = (e: React.TouchEvent, x: number, y: number) => {
    const chip = editorChipsRef.current.find((c) => c.x === x && c.y === y);
    const wormPair = wormholesRef.current.find((w) => (w.a.x === x && w.a.y === y) || (w.b.x === x && w.b.y === y));
    const isWall = gridRef.current[y]?.[x] === 'WALL';

    // 1. Mobile touch continuous eraser: removes all objects along drag path
    if (activeTool === 'EMPTY') {
      paintDragRef.current = {
        tool: 'EMPTY',
        paintedTiles: new Set<string>(),
        hasModified: false,
      };
      applyPaintToTile(x, y, 'EMPTY');
      return;
    }

    // 2. Mobile touch continuous wall paint on empty spaces
    if (activeTool === 'WALL' && !chip && !wormPair && !isWall) {
      paintDragRef.current = {
        tool: 'WALL',
        paintedTiles: new Set<string>(),
        hasModified: false,
      };
      applyPaintToTile(x, y, 'WALL');
      return;
    }

    if (!chip) return;

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    const touch = e.touches[0];
    longPressPosRef.current = { x: touch.clientX, y: touch.clientY };
    isLongPressActiveRef.current = false;

    longPressTimerRef.current = setTimeout(() => {
      isLongPressActiveRef.current = true;
      suppressClickRef.current = true;
      pendingDragRef.current = null;
      setDraggingItem(null);
      setDragPointerPos(null);
      setHoverTile(null);

      if (chip.level <= 1) {
        showToast('⚡ Chip.1 已經是最初級閘晶片，無法進行裂變！');
        sounds.playBump();
        return;
      }

      // Open Fission Menu on mobile
      const options = calculateFissionOptions(chip);
      const hasAnyValid =
        options.UP.length > 0 ||
        options.DOWN.length > 0 ||
        options.LEFT.length > 0 ||
        options.RIGHT.length > 0;

      if (!hasAnyValid) {
        showToast('⚠️ 此晶片四周無足夠直線空間，或博士路徑受阻無法走到推動點！');
        sounds.playBump();
        setFissionMenu(null);
        return;
      }

      setFissionMenu({
        x,
        y,
        chip,
        validDirections: options,
      });

      sounds.playStep();
      showToast('⚛️ 請點選晶片旁的 ↑ ← ↓ → 箭頭裂變（點空白處取消）');

      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([40, 30, 40]);
        } catch {
          // ignore
        }
      }
    }, 450);
  };

  const handleTouchMoveCell = (e: React.TouchEvent) => {
    // Mobile continuous paint/erase drag
    if (paintDragRef.current && e.touches[0]) {
      const tile = getTileFromClientCoords(e.touches[0].clientX, e.touches[0].clientY);
      if (tile) {
        applyPaintToTile(tile.x, tile.y, paintDragRef.current.tool);
      }
      return;
    }

    if (longPressTimerRef.current && longPressPosRef.current && e.touches[0]) {
      const dx = e.touches[0].clientX - longPressPosRef.current.x;
      const dy = e.touches[0].clientY - longPressPosRef.current.y;
      if (Math.hypot(dx, dy) > 10) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }
  };

  const handleTouchEndCell = (e: React.TouchEvent) => {
    // Finish mobile touch paint/erase drag
    if (paintDragRef.current) {
      const { tool, hasModified } = paintDragRef.current;
      paintDragRef.current = null;
      if (hasModified) {
        recordHistory(gridRef.current, editorChipsRef.current, wormholesRef.current);
        if (tool === 'WALL') {
          sounds.playStep();
        } else {
          sounds.playBump();
        }
        suppressClickRef.current = true;
        setTimeout(() => {
          suppressClickRef.current = false;
        }, 120);
      }
      return;
    }

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (isLongPressActiveRef.current) {
      e.preventDefault();
      suppressClickRef.current = true;
      setTimeout(() => {
        suppressClickRef.current = false;
        isLongPressActiveRef.current = false;
      }, 100);
    }
  };

  const handleTouchCancelCell = () => {
    paintDragRef.current = null;
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    isLongPressActiveRef.current = false;
  };

  const handleStartPlay = () => {
    if (editorChips.length < 2) {
      showToast('請至少在實驗室中放置 2 顆晶片方能進行推牌！');
      sounds.playBump();
      return;
    }

    const startPos =
      editorSolutionSteps.length > 0
        ? { x: editorSolutionSteps[0].standX, y: editorSolutionSteps[0].standY }
        : getAutoPlayerStart();

    const customLevel: LevelData = {
      id: 999,
      chapter: 99,
      chapterName: '自訂實驗室',
      title: title || '自製實驗大樓關卡',
      subtitle: `自製挑戰 · 目標等級 Chip.${balance.targetLevel} · ${width}×${height} 網格`,
      width,
      height,
      wraparound,
      playerStart: startPos,
      targetLevel: balance.targetLevel,
      parMoves: editorSolutionSteps.length > 0 ? editorSolutionSteps.length : Math.max(15, editorChips.length * 3),
      grid,
      chips: editorChips,
      wormholes,
      hint:
        editorSolutionSteps.length > 0
          ? `自動佈局已推演生成 ${editorSolutionSteps.length} 步逆向裂變通關解法，可點擊「解法步驟」查看或進行自動演示。`
          : '運用推動與合併，嘗試將所有晶片合成為單一終極晶片！',
      solutionSteps: editorSolutionSteps.length > 0 ? editorSolutionSteps : undefined,
    };

    onPlayCustomLevel(customLevel);
    onClose();
  };

  const handleExportJSON = () => {
    const data = {
      title,
      width,
      height,
      wraparound,
      playerStart: getAutoPlayerStart(),
      grid,
      chips: editorChips,
      wormholes,
      targetLevel: balance.targetLevel,
      solutionSteps: editorSolutionSteps.length > 0 ? editorSolutionSteps : undefined,
    };
    const jsonStr = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast('已將關卡代碼複製至剪貼簿！');
  };

  const handleDownloadJSON = () => {
    const data = {
      title,
      width,
      height,
      wraparound,
      playerStart: getAutoPlayerStart(),
      grid,
      chips: editorChips,
      wormholes,
      targetLevel: balance.targetLevel,
      solutionSteps: editorSolutionSteps.length > 0 ? editorSolutionSteps : undefined,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_') || 'custom_level'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('已下載關卡 JSON 檔案！');
  };

  const handleImportJSON = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (parsed.width && parsed.height && parsed.grid && parsed.chips) {
        setWidth(parsed.width);
        setHeight(parsed.height);
        setGrid(parsed.grid);
        setEditorChips(parsed.chips);
        if (parsed.wraparound !== undefined) setWraparound(parsed.wraparound);
        if (parsed.wormholes) setWormholes(parsed.wormholes);
        if (parsed.title) setTitle(parsed.title);
        const importedSol = parsed.solutionSteps || [];
        setEditorSolutionSteps(importedSol);
        setShowJsonBox(false);

        recordHistory(
          parsed.grid,
          parsed.chips,
          parsed.wormholes || [],
          parsed.width,
          parsed.height,
          parsed.wraparound || false,
          importedSol
        );

        showToast('關卡代碼已成功載入！');
        sounds.playPush();
      } else {
        alert('無效的關卡資料格式！缺少 width/height/grid/chips');
      }
    } catch {
      alert('JSON 解析失敗，請確認格式正確。');
    }
  };

  const handleClearAll = () => {
    if (window.confirm('確定要清空棋盤上的所有牆壁、晶片與蟲洞嗎？（可透過 Undo 復原）')) {
      const emptyGrid = createInitialGrid(width, height, 'EMPTY');
      setGrid(emptyGrid);
      setEditorChips([]);
      setWormholes([]);
      setPendingWormhole(null);
      recordHistory(emptyGrid, [], []);
      sounds.playBump();
      showToast('已清空棋盤內容');
    }
  };

  // Adaptive Tile Size so grid fits inside viewport regardless of board size
  const maxTileDimension = Math.min(
    44,
    Math.max(24, Math.floor(Math.min(window.innerWidth - 60, 680) / width)),
    Math.max(24, Math.floor(480 / height))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-5xl bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[96vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Settings2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-transparent text-white font-bold text-base sm:text-lg tracking-tight border-b border-transparent hover:border-slate-600 focus:border-emerald-400 focus:outline-none transition-colors"
                  placeholder="關卡名稱..."
                />
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {width}×{height} {wraparound ? '環形無塵室' : '實體封裝'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                點擊：置放 / 清除 · 拖曳：移動 · 滑鼠右鍵 / 手機長按：晶片裂變 (Fission)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto Layout (自動佈局) */}
            <button
              type="button"
              onClick={handleOpenAutoLayoutDialog}
              className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-900/80 to-indigo-900/80 hover:from-purple-800 hover:to-indigo-800 text-purple-200 text-xs font-mono flex items-center gap-1.5 border border-purple-500/50 shadow-sm cursor-pointer transition-all hover:scale-105"
              title="晶片裂變自動佈局 (Auto Layout)"
            >
              <Wand2 className="w-3.5 h-3.5 text-purple-400" />
              <span>自動佈局</span>
            </button>

            {/* Change dimensions / New board */}
            <button
              type="button"
              onClick={() => setIsDimensionDialogOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 border border-slate-700 cursor-pointer transition-colors"
              title="調整棋盤大小或重新開局"
            >
              <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">規格 / 尺寸</span>
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toolbar: Brushes, Undo/Redo, Wraparound Toggle */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Brushes */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-mono text-slate-400 mr-1">筆刷:</span>

            {/* Player Start Brush */}
            {/* Wormhole (成雙蟲洞) Brush */}
            <button
              type="button"
              onClick={() => {
                setActiveTool('WORMHOLE');
                setPendingWormhole(null);
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 cursor-pointer transition-all ${
                activeTool === 'WORMHOLE'
                  ? 'bg-cyan-950/90 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.5)] scale-105 ring-1 ring-cyan-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-cyan-300'
              }`}
              title="置放成對蟲洞：點擊第1格設A端，點第2格完成配對；點擊既有蟲洞可刪除配對"
            >
              <span className="text-sm">🌀</span>
              <span>蟲洞 (雙向)</span>
              {pendingWormhole && (
                <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-xs animate-pulse">
                  待配對
                </span>
              )}
            </button>

            {/* Wall Brush */}
            <button
              type="button"
              onClick={() => setActiveTool('WALL')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 cursor-pointer transition-all ${
                activeTool === 'WALL'
                  ? 'bg-slate-600 text-white border-slate-400 shadow-sm scale-105'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="牆壁筆刷：點擊空白處置放，或沿著拖曳軌跡連續砌牆壁"
            >
              <div className="w-3 h-3 bg-slate-500 rounded-xs border border-slate-400" />
              <span>牆壁 (可連續砌牆)</span>
            </button>

            {/* Eraser / Empty Brush */}
            <button
              type="button"
              onClick={() => setActiveTool('EMPTY')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 cursor-pointer transition-all ${
                activeTool === 'EMPTY'
                  ? 'bg-rose-900/80 text-rose-200 border-rose-500 shadow-sm scale-105'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="橡皮擦：點擊物件清除，或沿著拖曳軌跡連續移除所有物件"
            >
              <Trash2 className="w-3 h-3 text-rose-400" />
              <span>橡皮擦 (可連續清除)</span>
            </button>

            <div className="h-5 w-px bg-slate-700 mx-1 hidden sm:block" />

            {/* Chips 1..8 Brushes */}
            <div className="flex flex-wrap items-center gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((lvl) => {
                const def = CHIP_DEFINITIONS[lvl];
                const isActive = activeTool === lvl;

                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setActiveTool(lvl)}
                    className={`px-2 py-1 rounded-none text-xs font-mono font-bold border transition-all cursor-pointer ${
                      isActive
                        ? 'ring-2 ring-white scale-110 shadow-lg z-10'
                        : 'opacity-85 hover:opacity-100 hover:scale-105'
                    }`}
                    style={{
                      background: def.bgGradient,
                      color: def.borderColor,
                      borderColor: def.borderColor,
                    }}
                    title={`放置 ${def.name} (${def.code})`}
                  >
                    {lvl === 8 ? '8★' : `C.${lvl}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: History Controls & Wraparound */}
          <div className="flex items-center gap-2">
            {/* Undo */}
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className={`p-1.5 rounded-lg border text-xs font-mono flex items-center gap-1 transition-colors ${
                historyIndex > 0
                  ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 cursor-pointer'
                  : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed opacity-50'
              }`}
              title="復原 (Ctrl+Z)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">復原</span>
            </button>

            {/* Redo */}
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className={`p-1.5 rounded-lg border text-xs font-mono flex items-center gap-1 transition-colors ${
                historyIndex < history.length - 1
                  ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 cursor-pointer'
                  : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed opacity-50'
              }`}
              title="重做 (Ctrl+Y)"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">重做</span>
            </button>

            {/* Wraparound Toggle */}
            <button
              type="button"
              onClick={() => {
                const nextWrap = !wraparound;
                setWraparound(nextWrap);
                recordHistory(grid, editorChips, wormholes, width, height, nextWrap);
                sounds.playStep();
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono border flex items-center gap-1.5 transition-colors cursor-pointer ${
                wraparound
                  ? 'bg-purple-900/70 border-purple-500 text-purple-200 shadow-sm'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="切換四周邊界是否允許無縫環狀穿越"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${wraparound ? 'text-purple-400 animate-spin-slow' : ''}`} />
              <span>{wraparound ? '環狀邊界: 開' : '環狀邊界: 關'}</span>
            </button>

            {/* Auto Layout in Toolbar */}
            <button
              type="button"
              onClick={handleOpenAutoLayoutDialog}
              className="px-2.5 py-1 rounded-lg text-xs font-mono border flex items-center gap-1.5 transition-colors cursor-pointer bg-purple-950/80 border-purple-500/60 text-purple-200 hover:bg-purple-900 hover:border-purple-400"
              title="晶片自動佈局 (Auto Layout)"
            >
              <Wand2 className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">自動佈局</span>
            </button>

            {/* Clear All */}
            <button
              type="button"
              onClick={handleClearAll}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-950/80 hover:border-rose-700 border border-slate-700 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
              title="全部清空"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Balance Status Banner */}
        <div className="px-4 sm:px-6 py-1.5 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            {balance.isPowerOfTwo ? (
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>能量完美平衡 · 可合成為 Chip.{balance.targetLevel}（現有 {editorChips.length} 顆晶片）</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-amber-400">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>能量非 2 的次方 · 現有 {editorChips.length} 顆晶片（最終可能有晶片無法消除）</span>
              </div>
            )}
          </div>

          <div className="text-slate-400 text-[11px] hidden sm:block">
            提示：滑鼠右鍵 / 手機長按晶片開啟【裂變選單】定向分裂 · 拖曳可移動或碰撞合併
          </div>
        </div>

        {/* Board Workspace */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-slate-950 relative">
          {/* Floating Action Toast */}
          {toastMessage && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-xl bg-slate-800/95 border border-emerald-500/50 text-emerald-300 text-xs font-mono shadow-xl backdrop-blur-md animate-fade-in pointer-events-none">
              {toastMessage}
            </div>
          )}

          {/* Click-away backdrop to dismiss fission arrows */}
          {fissionMenu && (
            <div
              className="fixed inset-0 z-30 bg-transparent"
              onClick={() => setFissionMenu(null)}
              onContextMenu={(e) => {
                e.preventDefault();
                setFissionMenu(null);
              }}
            />
          )}

          {/* Grid Canvas */}
          <div
            ref={boardContainerRef}
            onContextMenu={(e) => e.preventDefault()}
            className={`grid select-none border-2 p-1.5 sm:p-2.5 shadow-2xl relative transition-all ${
              wraparound
                ? 'border-dashed border-purple-500/80 bg-slate-950/90'
                : 'border-solid border-slate-700 bg-slate-900'
            }`}
            style={{
              gridTemplateColumns: `repeat(${width}, ${maxTileDimension}px)`,
              gridTemplateRows: `repeat(${height}, ${maxTileDimension}px)`,
              touchAction: 'none',
            }}
          >
            {grid.map((row, y) =>
              row.map((cell, x) => {
                const isWall = cell === 'WALL';
                const chip = editorChips.find((c) => c.x === x && c.y === y);
                const wormPair = wormholes.find((w) => (w.a.x === x && w.a.y === y) || (w.b.x === x && w.b.y === y));
                const wormNodeLabel = wormPair ? (wormPair.a.x === x && wormPair.a.y === y ? `${wormPair.id}A` : `${wormPair.id}B`) : null;
                const isPendingHere = pendingWormhole && pendingWormhole.x === x && pendingWormhole.y === y;

                const isHoverTarget = hoverTile && hoverTile.x === x && hoverTile.y === y;
                const isDragSource = draggingItem && draggingItem.x === x && draggingItem.y === y;
                const isFissionTarget = fissionMenu && fissionMenu.x === x && fissionMenu.y === y;

                return (
                  <div
                    key={`ed-${x}-${y}`}
                    onClick={() => handleCellClick(x, y)}
                    onContextMenu={(e) => handleCellContextMenu(e, x, y)}
                    onPointerDown={(e) => handlePointerDownCell(e, x, y)}
                    onTouchStart={(e) => handleTouchStartCell(e, x, y)}
                    onTouchMove={handleTouchMoveCell}
                    onTouchEnd={handleTouchEndCell}
                    onTouchCancel={handleTouchCancelCell}
                    style={{
                      width: `${maxTileDimension}px`,
                      height: `${maxTileDimension}px`,
                    }}
                    className={`relative border border-slate-800 flex items-center justify-center cursor-pointer transition-colors duration-150 ${
                      isFissionTarget
                        ? 'z-40 ring-2 ring-cyan-400 shadow-[0_0_14px_rgba(6,182,212,0.9)] bg-cyan-950/40'
                        : isWall
                        ? 'bg-slate-700 border-slate-600'
                        : isHoverTarget
                        ? 'bg-emerald-500/20 border-emerald-400'
                        : 'bg-slate-950/70 hover:bg-slate-800/50 hover:border-slate-600'
                    } ${isDragSource ? 'opacity-40 border-dashed border-amber-400' : ''}`}
                    title={`(${x}, ${y}) - 點擊置放/清除 · 拖曳移動 · 滑鼠右鍵/手機長按裂變`}
                  >
                    {/* Empty cell center dot */}
                    {!isWall && !wormPair && !isPendingHere && !chip && (
                      <div className="w-1 h-1 rounded-full bg-slate-800 pointer-events-none" />
                    )}

                    {/* Wall pattern */}
                    {isWall && (
                      <div className="w-full h-full p-0.5 flex flex-col justify-between items-center pointer-events-none opacity-60">
                        <div className="w-full h-0.5 bg-slate-500/40" />
                        <div className="w-1 h-1 rounded-full bg-slate-400/40" />
                        <div className="w-full h-0.5 bg-slate-950/60" />
                      </div>
                    )}

                    {/* Wormhole Node */}
                    {wormPair && (
                      <WormholeIcon pairId={wormPair.id} nodeLabel={wormNodeLabel || undefined} />
                    )}

                    {/* Pending Wormhole Indicator (A端待配對) */}
                    {isPendingHere && (
                      <div className="w-[88%] h-[88%] rounded-full border-2 border-dashed border-cyan-400 bg-cyan-500/20 animate-pulse flex items-center justify-center pointer-events-none z-10">
                        <span className="text-[9px] font-mono font-bold text-cyan-300">
                          🌀A待配
                        </span>
                      </div>
                    )}

                    {/* Chip */}
                    {chip && (
                      <div className="w-[94%] h-[94%] pointer-events-none">
                        <ChipCard
                          level={chip.level}
                          size="compact"
                          numberOnly={width >= 10 || height >= 10}
                        />
                      </div>
                    )}

                    {/* Fission Directional Buttons (↑ ← ↓ →) attached directly around the chip */}
                    {isFissionTarget && (
                      <>
                        {(['UP', 'DOWN', 'LEFT', 'RIGHT'] as const).map((dir) => {
                          const validCandidates = fissionMenu.validDirections[dir];
                          if (!validCandidates || validCandidates.length === 0) return null;

                          let posClass = '';
                          let svgPath = '';
                          if (dir === 'UP') {
                            posClass = '-top-3 sm:-top-3.5 left-1/2 -translate-x-1/2';
                            svgPath = 'M8 2 L13.5 7.5 L10 7.5 L10 14 L6 14 L6 7.5 L2.5 7.5 Z';
                          } else if (dir === 'DOWN') {
                            posClass = '-bottom-3 sm:-bottom-3.5 left-1/2 -translate-x-1/2';
                            svgPath = 'M8 14 L2.5 8.5 L6 8.5 L6 2 L10 2 L10 8.5 L13.5 8.5 Z';
                          } else if (dir === 'LEFT') {
                            posClass = '-left-3 sm:-left-3.5 top-1/2 -translate-y-1/2';
                            svgPath = 'M2 8 L7.5 2.5 L7.5 6 L14 6 L14 10 L7.5 10 L7.5 13.5 Z';
                          } else if (dir === 'RIGHT') {
                            posClass = '-right-3 sm:-right-3.5 top-1/2 -translate-y-1/2';
                            svgPath = 'M14 8 L8.5 2.5 L8.5 6 L2 6 L2 10 L8.5 10 L8.5 13.5 Z';
                          }

                          const dirName = dir === 'UP' ? '上' : dir === 'DOWN' ? '下' : dir === 'LEFT' ? '左' : '右';

                          return (
                            <button
                              key={`fiss-btn-${dir}`}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExecuteFission(dir);
                              }}
                              onTouchStart={(e) => {
                                e.stopPropagation();
                              }}
                              onTouchEnd={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleExecuteFission(dir);
                              }}
                              title={`向${dirName}裂變 (${validCandidates.map((c) => c.n).join('/')} 格)`}
                              className={`absolute ${posClass} z-50 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-950/95 border border-cyan-400 text-cyan-300 hover:text-white hover:border-cyan-200 hover:bg-cyan-600 flex items-center justify-center cursor-pointer shadow-[0_0_8px_rgba(6,182,212,0.95)] animate-pulse transition-transform hover:scale-125 active:scale-90 focus:outline-none`}
                            >
                              <svg
                                viewBox="0 0 16 16"
                                className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current pointer-events-none drop-shadow-[0_0_4px_rgba(6,182,212,0.95)]"
                              >
                                <path d={svgPath} />
                              </svg>
                            </button>
                          );
                        })}
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Floating Drag Representation (Follows Cursor / Touch Finger) */}
          {draggingItem && dragPointerPos && (
            <div
              className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 opacity-90 scale-110 shadow-2xl"
              style={{
                left: `${dragPointerPos.x}px`,
                top: `${dragPointerPos.y}px`,
                width: `${maxTileDimension}px`,
                height: `${maxTileDimension}px`,
              }}
            >
              {draggingItem.type === 'WORMHOLE' && (
                <div className="w-full h-full rounded-full border-2 border-cyan-400 bg-cyan-950/80 shadow-[0_0_12px_rgba(6,182,212,0.8)] flex items-center justify-center">
                  <span className="text-base animate-spin">🌀</span>
                </div>
              )}
              {draggingItem.type === 'CHIP' && draggingItem.level && (
                <div className="w-full h-full">
                  <ChipCard
                    level={draggingItem.level}
                    size="compact"
                    numberOnly={width >= 10 || height >= 10}
                  />
                </div>
              )}
              {draggingItem.type === 'WALL' && (
                <div className="w-full h-full bg-slate-700 border border-slate-500 rounded-none" />
              )}
            </div>
          )}
        </div>

        {/* JSON Import/Export Drawer (Toggleable) */}
        {showJsonBox && (
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-300 font-bold">關卡代碼 (JSON)</span>
              <button
                type="button"
                onClick={() => setShowJsonBox(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                關閉
              </button>
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="在此貼上關卡 JSON 代碼..."
              className="w-full h-24 p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleImportJSON}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
              >
                確認載入此關卡
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Copy JSON */}
            <button
              type="button"
              onClick={handleExportJSON}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-slate-700 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已複製代碼' : '複製代碼'}</span>
            </button>

            {/* Download JSON */}
            <button
              type="button"
              onClick={handleDownloadJSON}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-slate-700 cursor-pointer transition-colors"
              title="下載 .json 關卡檔案"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">下載關卡檔</span>
            </button>

            {/* Import JSON */}
            <button
              type="button"
              onClick={() => setShowJsonBox(!showJsonBox)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-slate-700 cursor-pointer transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>匯入代碼</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleStartPlay}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>進入實驗室試玩！</span>
            </button>
          </div>
        </div>
      </div>



      {/* 0. 尺寸選擇與建立空白關卡對話框 (Pre-edit Board Dimension Selection Dialog) */}
      {isDimensionDialogOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border-2 border-emerald-500/60 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Maximize2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    選擇實驗大樓棋盤規格
                  </h4>
                  <p className="text-xs text-slate-400">
                    設定棋盤尺寸，按確認開啟全新空白實驗室進行編輯
                  </p>
                </div>
              </div>

              {/* Close if board already exists */}
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsDimensionDialogOpen(false)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Preset Buttons 8x8 .. 15x15 */}
            <div>
              <label className="text-xs font-mono text-slate-300 font-semibold block mb-2">
                標準尺寸規格 (8×8 至 15×15)：
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[8, 9, 10, 11, 12, 13, 14, 15].map((sz) => {
                  const isSelected = customWidth === sz && customHeight === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => {
                        setSelectedPresetSize(sz);
                        setCustomWidth(sz);
                        setCustomHeight(sz);
                      }}
                      className={`py-2 px-1 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-md scale-105'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      <span>{sz} × {sz}</span>
                      <span className="text-[10px] opacity-70 font-normal">{sz * sz} 格</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Width & Height Inputs */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col gap-2">
              <span className="text-xs font-mono text-slate-300 font-semibold">
                客製化長寬設定 (5 ~ 20)：
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">
                    自訂寬度 (Width)：
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={20}
                    value={customWidth}
                    onChange={(e) => setCustomWidth(Math.max(5, Math.min(20, parseInt(e.target.value) || 5)))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm text-center focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">
                    自訂高度 (Height)：
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={20}
                    value={customHeight}
                    onChange={(e) => setCustomHeight(Math.max(5, Math.min(20, parseInt(e.target.value) || 5)))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm text-center focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Border Template Selection */}
            <div>
              <label className="text-xs font-mono text-slate-300 font-semibold block mb-2">
                初始邊界模板：
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setInitialBorderType('WALLS')}
                  className={`p-2 rounded-xl text-xs font-mono border transition-all cursor-pointer flex flex-col items-center ${
                    initialBorderType === 'WALLS'
                      ? 'bg-slate-700 text-white border-slate-400 shadow-md'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  <span className="font-bold">外圍邊界牆</span>
                  <span className="text-[10px] opacity-70">四周實體牆壁</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInitialBorderType('WRAPAROUND')}
                  className={`p-2 rounded-xl text-xs font-mono border transition-all cursor-pointer flex flex-col items-center ${
                    initialBorderType === 'WRAPAROUND'
                      ? 'bg-purple-900/80 text-purple-200 border-purple-400 shadow-md'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  <span className="font-bold">環形穿越</span>
                  <span className="text-[10px] opacity-70">無邊界連續空間</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInitialBorderType('EMPTY')}
                  className={`p-2 rounded-xl text-xs font-mono border transition-all cursor-pointer flex flex-col items-center ${
                    initialBorderType === 'EMPTY'
                      ? 'bg-emerald-900/80 text-emerald-200 border-emerald-400 shadow-md'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  <span className="font-bold">完全空白</span>
                  <span className="text-[10px] opacity-70">全地磚自建</span>
                </button>
              </div>
            </div>

            {/* Confirm button */}
            <div className="pt-2 flex justify-end gap-2">
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsDimensionDialogOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  取消
                </button>
              )}
              <button
                type="button"
                onClick={handleConfirmDimensions}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>確認建立 {customWidth}×{customHeight} 空白棋盤</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto Layout (自定晶片自動佈局) Modal Dialog - Single unified interface */}
      {isAutoLayoutDialogOpen && (() => {
        const hasPreplaced = editorChips.length > 0;
        const minK = 2;
        const hasFissionable = !hasPreplaced || editorChips.some((c) => c.level > 1);

        // 玩家輸入晶片總數的頁面，不需要加上預先放置的晶片數量，使用常規標準推薦總數
        const quickPresets = [8, 10, 12, 16, 20, 24, 30, 36];

        return (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-lg bg-slate-900 border-2 border-purple-500/60 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${hasPreplaced ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' : 'bg-purple-500/20 border border-purple-500/40 text-purple-400'}`}>
                    <Wand2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        晶片自動佈局 (Auto Layout)
                      </h4>
                      {hasPreplaced ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          預佈置晶片擴展模式 ({editorChips.length} 顆)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-mono font-bold">
                          全新佈局模式
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {hasPreplaced
                        ? `保留現有 ${editorChips.length} 顆晶片，跳過放置超級電腦，往棋盤加晶片加到設定的數量為止`
                        : '反向物理裂變推演：放置超級電腦並反覆裂變，生成具備解法的均勻關卡'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAutoLayoutDialogOpen(false)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Warning if pre-placed chips have no fissionable level > 1 */}
              {hasPreplaced && !hasFissionable && (
                <div className="p-3 bg-amber-950/40 border border-amber-500/50 rounded-xl text-xs text-amber-200 flex items-start gap-2">
                  <span className="text-base leading-none">⚠️</span>
                  <span>
                    棋盤上的預佈置晶片等級皆為 1，無法再進行裂變！請先點擊棋盤上的晶片將其等級設為 2 以上，再啟動自動佈局。
                  </span>
                </div>
              )}

              {/* Unified Direct Input Section */}
              <div className="flex flex-col gap-3.5">
                {/* Stepper + Direct numeric input for K */}
                <div className="p-4 bg-slate-950/80 rounded-xl border border-purple-500/40 flex flex-col items-center gap-2 shadow-inner">
                  <span className="text-xs font-mono text-purple-300 font-bold">
                    設定最終晶片總數 (K)：
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAutoChipsCount((prev) => Math.max(minK, prev - 1))}
                      className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-mono font-bold text-lg border border-slate-700 flex items-center justify-center cursor-pointer transition-all"
                      title="減少 1 顆"
                    >
                      -
                    </button>
                    <div className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 border-2 border-purple-500/70 rounded-xl shadow-inner shadow-purple-950/50">
                      <input
                        type="number"
                        min={minK}
                        max={64}
                        value={autoChipsCount}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setAutoChipsCount(isNaN(val) ? minK : Math.max(minK, Math.min(64, val)));
                        }}
                        className="w-20 py-0.5 bg-transparent text-white font-mono text-2xl font-black text-center focus:outline-none"
                      />
                      <span className="text-xs text-purple-400 font-mono font-bold">顆晶片</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoChipsCount((prev) => Math.min(64, prev + 1))}
                      className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-mono font-bold text-lg border border-slate-700 flex items-center justify-center cursor-pointer transition-all"
                      title="增加 1 顆"
                    >
                      +
                    </button>
                  </div>
                  {hasPreplaced && (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono mt-1">
                      <span className="text-slate-400">棋盤現有 {editorChips.length} 顆</span>
                      <span>·</span>
                      {autoChipsCount > editorChips.length ? (
                        <span className="text-emerald-400 font-bold">
                          將加晶片至設定的 {autoChipsCount} 顆（增加 {autoChipsCount - editorChips.length} 顆）
                        </span>
                      ) : (
                        <span className="text-amber-400 font-bold">
                          （現有 {editorChips.length} 顆，請設定大於 {editorChips.length} 顆以繼續加晶片）
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Preset Buttons */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-mono text-slate-400">快速選擇推薦總數：</span>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {quickPresets.map((num) => {
                      const isSelected = autoChipsCount === num;
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setAutoChipsCount(num)}
                          className={`py-2 px-1 rounded-xl font-mono text-sm font-bold border transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                            isSelected
                              ? 'bg-purple-900/90 text-purple-100 border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.5)] scale-105 ring-1 ring-purple-300'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:border-slate-600'
                          }`}
                        >
                          <span>{num}</span>
                          <span className="text-[9px] text-slate-400 font-normal">顆</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Rules description */}
                {hasPreplaced ? (
                  <div className="p-3 bg-emerald-950/25 border border-emerald-500/30 rounded-xl text-xs text-slate-300 flex flex-col gap-1.5">
                    <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>預設晶片自動裂變流程（保留現有佈局）：</span>
                    </div>
                    <div className="text-[11px] text-slate-300 flex flex-col gap-1 pl-1 font-mono leading-relaxed">
                      <div>
                        ✓ <span className="text-emerald-300 font-semibold">跳過步驟一：</span>
                        不清除現有晶片、不放置超級電腦，保留棋盤上預先安排的 {editorChips.length} 顆晶片。
                      </div>
                      <div>
                        ✓ <span className="text-purple-300 font-semibold">定向物理裂變：</span>
                        對棋盤上等級 &gt; 1 的現有晶片依序計算推動方向與位移，避開緊鄰障礙並挑選空曠路徑。
                      </div>
                      <div>
                        ✓ <span className="text-cyan-300 font-semibold">蟲洞規則：</span>
                        新生成的晶片可以緊鄰蟲洞，但絕不會覆蓋在蟲洞上。
                      </div>
                      <div>
                        ✓ <span className="text-emerald-300 font-semibold">加至設定數量：</span>
                        往棋盤上加晶片加到設定的數量（{autoChipsCount} 顆）為止。
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-purple-950/30 border border-purple-900/50 rounded-xl text-xs text-slate-300 flex flex-col gap-1.5">
                    <div className="font-bold text-purple-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>全新關卡反向物理推演流程：</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex flex-col gap-1 pl-1 font-mono leading-relaxed">
                      <div>1. 隨機在棋盤開闊空白處放置 1 顆最高級 (超級電腦，等級 8) 晶片並進行首輪裂變。</div>
                      <div>2. 選擇朝障礙物最遠方向且位移不緊鄰現有物件之路徑進行定向物理裂變。</div>
                      <div>3. 蟲洞規則：新生成的晶片可以緊鄰蟲洞，但絕不會覆蓋在蟲洞上。</div>
                      <div>4. 重複前項動作，往棋盤上加晶片加到設定的數量（{autoChipsCount} 顆）為止。</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm / Cancel Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAutoLayoutDialogOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs cursor-pointer transition-colors"
                >
                  取消
                </button>
                <button
                  type="button"
                  disabled={hasPreplaced && (!hasFissionable || autoChipsCount <= editorChips.length)}
                  onClick={() => handleExecuteAutoLayout(autoChipsCount)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all ${
                    hasPreplaced && (!hasFissionable || autoChipsCount <= editorChips.length)
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30 active:scale-95 cursor-pointer'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>
                    {hasPreplaced
                      ? `確定自動佈局（加到 ${autoChipsCount} 顆）`
                      : `確定執行自動佈局 (${autoChipsCount} 顆)`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
