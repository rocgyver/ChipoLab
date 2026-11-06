import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  CellType,
  Chip,
  Direction,
  GameSnapshot,
  LevelData,
  Position,
} from './types/game';
import { LEVELS } from './data/levels';
import { CHIP_DEFINITIONS } from './data/chipEncyclopedia';
import {
  calculatePush,
  findPathBFS,
  getDirectionDelta,
  isWalkable,
  isLevelWraparound,
  getEffectiveGrid,
  getWormholePartner,
} from './utils/gameLogic';
import { sounds } from './audio/soundEffects';
import { GameBoard } from './components/GameBoard';
import { GameHUD } from './components/GameHUD';
import { DpadControls } from './components/DpadControls';
import { LevelSelectModal } from './components/LevelSelectModal';
import { EncyclopediaModal } from './components/EncyclopediaModal';
import { LevelEditorModal } from './components/LevelEditorModal';
import { WinModal } from './components/WinModal';
import { HelpModal } from './components/HelpModal';
import { SolutionModal } from './components/SolutionModal';
import { TimeOverModal } from './components/TimeOverModal';
import { BoardThemeId, BOARD_THEMES, THEME_CYCLE_ORDER, DEFAULT_THEME_ID } from './types/theme';
import { Cpu, Terminal, Sparkles, HelpCircle, ShieldCheck, Edit3 } from 'lucide-react';

const getLevelTimeLimit = (lvl: LevelData) => Math.max(25, lvl.parMoves * 6 + 15);

function resolveDeviceLevel(lvl: LevelData, isMobile: boolean): LevelData {
  if (isMobile && lvl.mobileVariant) {
    return {
      ...lvl,
      width: lvl.mobileVariant.width,
      height: lvl.mobileVariant.height,
      grid: lvl.mobileVariant.grid,
      chips: lvl.mobileVariant.chips,
      playerStart: lvl.mobileVariant.playerStart,
      wormholes: lvl.mobileVariant.wormholes ?? lvl.wormholes,
      solutionSteps: lvl.mobileVariant.solutionSteps ?? lvl.solutionSteps,
      parMoves: lvl.mobileVariant.parMoves ?? lvl.parMoves,
      mobileVariant: lvl.mobileVariant,
    };
  }
  return lvl;
}

export default function App() {
  const [isMobileScreen, setIsMobileScreen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileScreen(mobile);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Current active level
  const [currentLevel, setCurrentLevel] = useState<LevelData>(() => {
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
    return resolveDeviceLevel(LEVELS[0], isMobile);
  });
  const [lastCustomLevel, setLastCustomLevel] = useState<LevelData | null>(null);

  // Wraparound calculation & Effective Grid (outer walls removed for Level 7+)
  const isWraparound = isLevelWraparound(currentLevel);
  const effectiveGrid = useMemo(() => getEffectiveGrid(currentLevel), [currentLevel]);

  // Player position & state
  const [playerPos, setPlayerPos] = useState<Position>(LEVELS[0].playerStart);
  const [playerDir, setPlayerDir] = useState<Direction>('DOWN');
  const [isPushing, setIsPushing] = useState<boolean>(false);
  const [isWalking, setIsWalking] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [isPlayerNoTransition, setIsPlayerNoTransition] = useState<boolean>(false);

  // Chips on the board
  const [chips, setChips] = useState<Chip[]>(() =>
    LEVELS[0].chips.map((c, i) => ({
      id: `chip-${i}-${c.x}-${c.y}`,
      x: c.x,
      y: c.y,
      level: c.level,
    }))
  );

  // Moves & Undo history
  const [moves, setMoves] = useState<number>(0);
  const [history, setHistory] = useState<GameSnapshot[]>([]);

  // Sound, CRT, Ambient & Theme states
  const [isMuted, setIsMuted] = useState<boolean>(() => sounds.getMuted());
  const [isCrtOn, setIsCrtOn] = useState<boolean>(() => {
    return localStorage.getItem('lab_game_crt') === 'true';
  });
  const [isAmbientOn, setIsAmbientOn] = useState<boolean>(() => {
    return localStorage.getItem('lab_game_ambient') !== 'false';
  });
  const [currentThemeId, setCurrentThemeId] = useState<BoardThemeId>(() => {
    const saved = localStorage.getItem('lab_game_theme') as BoardThemeId;
    return saved && BOARD_THEMES[saved] ? saved : DEFAULT_THEME_ID;
  });

  // Timed Challenge Mode
  const [isTimedMode, setIsTimedMode] = useState<boolean>(() => {
    return localStorage.getItem('lab_game_timed_mode') === 'true';
  });
  const [timeLeft, setTimeLeft] = useState<number>(() => getLevelTimeLimit(LEVELS[0]));
  const [isTimeOver, setIsTimeOver] = useState<boolean>(false);
  const [isKnockedOut, setIsKnockedOut] = useState<boolean>(false);
  const [catchMessage, setCatchMessage] = useState<string | null>(null);

  // Real-time synchronization refs for live collision detection during sliding
  const playerPosRef = useRef<Position>(playerPos);
  playerPosRef.current = playerPos;
  const playerDirRef = useRef<Direction>(playerDir);
  playerDirRef.current = playerDir;
  const chipsRef = useRef<Chip[]>(chips);
  chipsRef.current = chips;
  const slidingChipIdRef = useRef<string | null>(null);
  const slidingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const handleCycleTheme = useCallback(() => {
    setCurrentThemeId((prev) => {
      const idx = THEME_CYCLE_ORDER.indexOf(prev);
      const next = THEME_CYCLE_ORDER[(idx + 1) % THEME_CYCLE_ORDER.length];
      localStorage.setItem('lab_game_theme', next);
      sounds.playStep();
      return next;
    });
  }, []);

  const handleToggleTimedMode = useCallback(() => {
    setIsTimedMode((prev) => {
      const next = !prev;
      localStorage.setItem('lab_game_timed_mode', String(next));
      setTimeLeft(getLevelTimeLimit(currentLevel));
      setIsTimeOver(false);
      sounds.playStep();
      return next;
    });
  }, [currentLevel]);

  // Solved levels records in localStorage
  const [solvedLevels, setSolvedLevels] = useState<
    Record<number, { stars: number; bestMoves: number }>
  >(() => {
    try {
      const saved = localStorage.getItem('lab_game_solved');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Modals
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState(false);
  const [isEncyclopediaOpen, setIsEncyclopediaOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [hintMessage, setHintMessage] = useState<string | null>(null);

  // Animation lock to prevent double presses during push slide
  const isBusyRef = useRef(false);
  const autoPlayAbortRef = useRef(false);

  // Load level helper
  const loadLevel = useCallback((lvl: LevelData) => {
    if (slidingTimerRef.current) {
      clearTimeout(slidingTimerRef.current);
      slidingTimerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    slidingChipIdRef.current = null;
    setIsKnockedOut(false);
    setCatchMessage(null);

    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
    const effectiveLvl = resolveDeviceLevel(lvl, isMobile);

    setCurrentLevel(effectiveLvl);
    setPlayerPos({ ...effectiveLvl.playerStart });
    playerPosRef.current = { ...effectiveLvl.playerStart };
    const initialDir =
      effectiveLvl.solutionSteps && effectiveLvl.solutionSteps.length > 0
        ? effectiveLvl.solutionSteps[0].dir
        : 'DOWN';
    setPlayerDir(initialDir);
    playerDirRef.current = initialDir;
    setMoves(0);
    setHistory([]);
    setIsVictory(false);
    setIsPushing(false);
    setIsWalking(false);
    setHintMessage(null);
    setTimeLeft(getLevelTimeLimit(effectiveLvl));
    setIsTimeOver(false);
    const initialChips = effectiveLvl.chips.map((c, i) => ({
      id: `chip-${effectiveLvl.id}-${i}-${Date.now()}`,
      x: c.x,
      y: c.y,
      level: c.level,
    }));
    setChips(initialChips);
    chipsRef.current = initialChips;
  }, []);

  // When viewport size crosses mobile/desktop breakpoint and no moves made, auto-sync level scale
  useEffect(() => {
    if (moves === 0 && currentLevel.mobileVariant) {
      const baseLvl = LEVELS.find((l) => l.id === currentLevel.id) || currentLevel;
      loadLevel(baseLvl);
    }
  }, [isMobileScreen, moves, currentLevel, loadLevel]);

  // Handle play custom level from editor
  const handlePlayCustomLevel = useCallback(
    (customLevel: LevelData) => {
      setLastCustomLevel(customLevel);
      loadLevel(customLevel);
      setIsEditorOpen(false);
    },
    [loadLevel]
  );

  // Save progress on victory
  useEffect(() => {
    if (isVictory && currentLevel.id <= 24) {
      const stars =
        moves <= currentLevel.parMoves
          ? 3
          : moves <= currentLevel.parMoves + 4
          ? 2
          : 1;

      setSolvedLevels((prev) => {
        const existing = prev[currentLevel.id];
        const updated = {
          stars: Math.max(stars, existing ? existing.stars : 0),
          bestMoves: existing ? Math.min(moves, existing.bestMoves) : moves,
        };
        const next = { ...prev, [currentLevel.id]: updated };
        localStorage.setItem('lab_game_solved', JSON.stringify(next));
        return next;
      });
    }
  }, [isVictory, currentLevel, moves]);

  // Timed challenge countdown effect
  useEffect(() => {
    if (!isTimedMode || isVictory || isTimeOver || isAutoPlaying) return;
    if (isLevelSelectOpen || isEncyclopediaOpen || isEditorOpen || isHelpOpen || isSolutionModalOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsTimeOver(true);
          sounds.playTimeOver();
          return 0;
        }
        if (prev <= 6) {
          sounds.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    isTimedMode,
    isVictory,
    isTimeOver,
    isAutoPlaying,
    isLevelSelectOpen,
    isEncyclopediaOpen,
    isEditorOpen,
    isHelpOpen,
    isSolutionModalOpen,
  ]);

  // Core movement & push handler
  const handleMove = useCallback(
    (dir: Direction, forceAction = false) => {
      if (isVictory || isTimeOver || isKnockedOut) return;

      // 1. If changing direction, turn in place first to face dir without stepping forward
      if (!forceAction && playerDirRef.current !== dir) {
        setPlayerDir(dir);
        playerDirRef.current = dir;
        sounds.playStep();
        return;
      }

      setPlayerDir(dir);
      playerDirRef.current = dir;

      const { dx, dy } = getDirectionDelta(dir);
      const w = currentLevel.width;
      const h = currentLevel.height;

      const targetX = isWraparound
        ? ((playerPosRef.current.x + dx) % w + w) % w
        : playerPosRef.current.x + dx;
      const targetY = isWraparound
        ? ((playerPosRef.current.y + dy) % h + h) % h
        : playerPosRef.current.y + dy;

      // Check if there is a chip directly in the target cell
      const frontChip = chipsRef.current.find((c) => c.x === targetX && c.y === targetY);

      if (frontChip) {
        // If a chip is already sliding, cannot start a second push
        if (slidingChipIdRef.current !== null) {
          sounds.playBump();
          return;
        }

        // Calculate the ground-truth physical trajectory
        const pushPlan = calculatePush(
          effectiveGrid,
          chipsRef.current,
          frontChip,
          dir,
          isWraparound,
          currentLevel.wormholes
        );

        // 2. Both hands push animation regardless of whether chip can slide!
        setIsPushing(true);
        setTimeout(() => setIsPushing(false), 240);

        if (!pushPlan.canPush || !pushPlan.moved) {
          sounds.playBump();
          return;
        }

        // 3. Einstein STAYS in place! Do not advance forward.
        setHistory((prev) => [
          ...prev,
          {
            playerPos: { ...playerPosRef.current },
            playerDir: dir,
            chips: chipsRef.current.map((c) => ({
              ...c,
              x: Math.round(c.x),
              y: Math.round(c.y),
              noTransition: false,
              isMerging: false,
            })),
            moves,
            actionDescription: `向${dir}推動晶片`,
          },
        ]);
        setMoves((m) => m + 1);
        sounds.playPush();

        // Start continuous, completely smooth sliding physics loop for frontChip
        slidingChipIdRef.current = frontChip.id;
        const chipId = frontChip.id;
        const startX = frontChip.x;
        const startY = frontChip.y;
        const slideDir = dir;

        const traveledPath = pushPlan.traveledPath ?? [{ x: startX, y: startY }];
        const destX = pushPlan.finalX ?? startX;
        const destY = pushPlan.finalY ?? startY;

        // Static boundary of the slide (walls, obstacles, other chips)
        const Smax = Math.max(1, traveledPath.length - 1);
        const finalTileX = destX;
        const finalTileY = destY;
        const isMerge = pushPlan.merged;

        const isFrictionStop =
          !isMerge &&
          Boolean(pushPlan.stoppedByFriction && pushPlan.frictionSteps && pushPlan.frictionSteps > 0);
        const S_friction = isFrictionStop ? Math.min(pushPlan.frictionSteps!, Smax) : 0;
        const S_cruise = Smax - S_friction;

        const v0 = 10.0; // tiles/sec (10 tiles per second)
        const T_cruise = (S_cruise / v0) * 1000;
        // Constant friction deceleration: average speed is v0 / 2, so duration is (2 * S_friction / v0)
        const T_friction = S_friction > 0 ? ((2 * S_friction) / v0) * 1000 : 0;
        const Ttotal = Math.max(90, T_cruise + T_friction);

        const startTime = performance.now();
        let lastCheckedStep = 0;

        const stopAndSnapChip = (fx: number, fy: number) => {
          slidingChipIdRef.current = null;
          if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = null;
          }
          setChips((prev) =>
            prev.map((c) =>
              c.id === chipId
                ? { ...c, x: fx, y: fy, noTransition: false }
                : c
            )
          );
          chipsRef.current = chipsRef.current.map((c) =>
            c.id === chipId ? { ...c, x: fx, y: fy, noTransition: false } : c
          );
        };

        const updatePhysicsFrame = (now: number) => {
          const elapsed = now - startTime;
          let s: number;

          if (S_friction > 0 && elapsed > T_cruise) {
            // Smooth Newtonian friction deceleration phase: v(u) = v0*(1 - u) => s = S_cruise + S_friction*(2*u - u^2)
            const tau = elapsed - T_cruise;
            const u = Math.min(1.0, tau / T_friction);
            s = S_cruise + S_friction * (2 * u - u * u);
          } else {
            // Constant cruising speed phase (10 tiles/s)
            const p = T_cruise > 0 ? Math.min(1.0, elapsed / T_cruise) : 1.0;
            s = S_cruise * p;
          }

          // Bound s strictly within [0, Smax] so it never overshoots obstacles
          s = Math.min(Smax, Math.max(0, s));

          // Continuous Sub-Pixel Coordinate & Step Indices
          const stepIdx = Math.min(Math.floor(s), Smax - 1);
          const t1 = traveledPath[stepIdx] ?? { x: startX, y: startY };
          const t2 = traveledPath[stepIdx + 1] ?? t1;
          const sub = s - stepIdx;

          const oppositeDir: Record<Direction, Direction> = {
            UP: 'DOWN',
            DOWN: 'UP',
            LEFT: 'RIGHT',
            RIGHT: 'LEFT',
          };

          // 1. Proactive Head-on Catch Check:
          // If Einstein is standing on the upcoming tile facing head-on,
          // block the chip right at t1 (in front of Einstein) without entering or overlapping!
          const nextIdx = Math.min(stepIdx + 1, Smax);
          const curP = playerPosRef.current;
          const curD = playerDirRef.current;

          if (nextIdx < traveledPath.length && nextIdx > stepIdx) {
            const nextTile = traveledPath[nextIdx];
            if (curP.x === nextTile.x && curP.y === nextTile.y) {
              if (curD === oppositeDir[slideDir]) {
                stopAndSnapChip(t1.x, t1.y);
                setIsPushing(true);
                sounds.playCatch();
                setCatchMessage('✋ 成功防禦！博士及時轉身將迎面而來的晶片穩穩擋下！');
                setTimeout(() => {
                  setIsPushing(false);
                  setCatchMessage(null);
                }, 2200);
                return;
              }
            }
          }

          // 2. Tile Entry & Off-guard Knockout Check
          const currentStep = Math.min(Smax, Math.floor(s));
          while (lastCheckedStep < currentStep) {
            const k = lastCheckedStep + 1;
            lastCheckedStep = k;

            if (k < traveledPath.length) {
              const stepTile = traveledPath[k];

              // Play warp sound when step arrives at the partner wormhole
              const wormPartner = getWormholePartner(stepTile, currentLevel.wormholes);
              if (wormPartner) {
                sounds.playWarp();
              }

              // Check if Einstein is standing on this tile and caught off-guard
              if (curP.x === stepTile.x && curP.y === stepTile.y) {
                if (curD !== oppositeDir[slideDir]) {
                  // EINSTEIN CAUGHT OFF-GUARD ON THE TRACK: KNOCKOUT!
                  stopAndSnapChip(stepTile.x, stepTile.y);
                  setIsKnockedOut(true);
                  sounds.playKnockout();
                  return;
                }
              }
            }
          }

          // If reached final destination
          if (elapsed >= Ttotal || s >= Smax) {
            if (isMerge) {
              const newLevel = frontChip.level + 1;
              slidingChipIdRef.current = null;
              if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
                animFrameRef.current = null;
              }
              sounds.playMerge(newLevel);
              setChips((prev) => {
                const nextChips = prev
                  .filter((c) => c.id !== chipId)
                  .map((c) =>
                    c.id === pushPlan.targetChipId
                      ? { ...c, level: newLevel, isMerging: true, noTransition: false }
                      : c
                  );
                chipsRef.current = nextChips;
                if (
                  nextChips.length === 1 &&
                  nextChips[0].level === currentLevel.targetLevel
                ) {
                  setTimeout(() => {
                    setIsVictory(true);
                    sounds.playVictory();
                  }, 200);
                }
                return nextChips;
              });
              setTimeout(() => {
                setChips((prev) =>
                  prev.map((c) => (c.id === pushPlan.targetChipId ? { ...c, isMerging: false } : c))
                );
              }, 300);
              return;
            } else {
              // Stopped at static obstacle / wall or coasted to a halt from friction
              stopAndSnapChip(finalTileX, finalTileY);
              if (isFrictionStop) {
                sounds.playAirBrake();
              } else {
                sounds.playBump();
              }
              return;
            }
          }

          // Continuous Sub-Pixel Visual Coordinate Calculation
          let renderX: number;
          let renderY: number;

          const { dx: ddx, dy: ddy } = getDirectionDelta(slideDir);
          const normalNextX = isWraparound ? ((t1.x + ddx) % w + w) % w : t1.x + ddx;
          const normalNextY = isWraparound ? ((t1.y + ddy) % h + h) % h : t1.y + ddy;

          const wormholePartner = getWormholePartner(
            { x: normalNextX, y: normalNextY },
            currentLevel.wormholes
          );
          const isWormholeJump =
            wormholePartner !== null &&
            wormholePartner.x === t2.x &&
            wormholePartner.y === t2.y;

          const isWrapJump =
            isWraparound &&
            normalNextX === t2.x &&
            normalNextY === t2.y &&
            (Math.abs(t2.x - t1.x) > 1 || Math.abs(t2.y - t1.y) > 1);

          if (isWormholeJump) {
            // Smoothly enter wormhole entrance (t1 + ddx), then instantly emerge at exit portal (t2)
            if (sub <= 0.5) {
              renderX = t1.x + ddx * (sub * 2);
              renderY = t1.y + ddy * (sub * 2);
            } else {
              renderX = t2.x;
              renderY = t2.y;
            }
          } else if (isWrapJump) {
            // Seamless wraparound boundary traversal:
            // sub <= 0.5: slide out of disappearing edge (t1 + ddx * sub)
            // sub > 0.5: slide in from appearing edge (t2 - ddx * (1 - sub))
            // Coupled with GameBoard edge clones and overflow-hidden, completely eliminates reverse drift and stutter!
            if (sub <= 0.5) {
              renderX = t1.x + ddx * sub;
              renderY = t1.y + ddy * sub;
            } else {
              renderX = t2.x - ddx * (1.0 - sub);
              renderY = t2.y - ddy * (1.0 - sub);
            }
          } else {
            // Normal linear step
            renderX = t1.x + (t2.x - t1.x) * sub;
            renderY = t1.y + (t2.y - t1.y) * sub;
          }

          // Update position at 60fps without CSS transition
          setChips((prev) =>
            prev.map((c) =>
              c.id === chipId
                ? { ...c, x: renderX, y: renderY, noTransition: true }
                : c
            )
          );

          animFrameRef.current = requestAnimationFrame(updatePhysicsFrame);
        };

        animFrameRef.current = requestAnimationFrame(updatePhysicsFrame);
        return;
      }

      // Empty floor: Walk forward
      if (isWalkable(effectiveGrid, targetX, targetY, chipsRef.current, isWraparound)) {
        // ONLY record walk step into history when NOT actively sliding!
        if (slidingChipIdRef.current === null) {
          setHistory((prev) => [
            ...prev,
            {
              playerPos: { ...playerPosRef.current },
              playerDir: dir,
              chips: chipsRef.current.map((c) => ({
                ...c,
                x: Math.round(c.x),
                y: Math.round(c.y),
                noTransition: false,
                isMerging: false,
              })),
              moves,
              actionDescription: '移動一步',
            },
          ]);
        }

        // Check if Einstein walked into a wormhole: instant 1-step space transfer!
        const partner = getWormholePartner({ x: targetX, y: targetY }, currentLevel.wormholes);
        if (partner) {
          const partnerBlocked =
            chipsRef.current.some((c) => c.x === partner.x && c.y === partner.y) ||
            effectiveGrid[partner.y]?.[partner.x] === 'WALL' ||
            effectiveGrid[partner.y]?.[partner.x] === 'OBSTACLE';

          if (!partnerBlocked) {
            isBusyRef.current = true;
            setIsWalking(true);
            sounds.playWarp();
            setIsPlayerNoTransition(true);
            setPlayerPos({ x: partner.x, y: partner.y });
            playerPosRef.current = { x: partner.x, y: partner.y };

            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                setIsPlayerNoTransition(false);
                setIsWalking(false);
                isBusyRef.current = false;
              });
            });
            return;
          }
        }

        const playerWrapped =
          Math.abs(targetX - playerPosRef.current.x) > 1 ||
          Math.abs(targetY - playerPosRef.current.y) > 1;

        if (playerWrapped) {
          isBusyRef.current = true;
          setIsWalking(true);
          sounds.playStep();

          const exitP: Position = { x: playerPosRef.current.x + dx, y: playerPosRef.current.y + dy };
          let entryP: Position;
          if (dx === 1) entryP = { x: -1, y: targetY };
          else if (dx === -1) entryP = { x: w, y: targetY };
          else if (dy === 1) entryP = { x: targetX, y: -1 };
          else entryP = { x: targetX, y: h };

          setIsPlayerNoTransition(false);
          setPlayerPos(exitP);

          setTimeout(() => {
            setIsPlayerNoTransition(true);
            setPlayerPos(entryP);

            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                setIsPlayerNoTransition(false);
                setPlayerPos({ x: targetX, y: targetY });
                playerPosRef.current = { x: targetX, y: targetY };

                setTimeout(() => {
                  setIsWalking(false);
                  isBusyRef.current = false;
                }, 60);
              });
            });
          }, 60);
        } else {
          setPlayerPos({ x: targetX, y: targetY });
          playerPosRef.current = { x: targetX, y: targetY };
          setIsWalking(true);
          sounds.playStep();
          setTimeout(() => setIsWalking(false), 70);
        }
      } else {
        // Bump against wall/obstacle
        sounds.playBump();
      }
    },
    [currentLevel, effectiveGrid, isKnockedOut, isTimeOver, isVictory, isWraparound, moves]
  );

  // Undo move
  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    if (slidingTimerRef.current) {
      clearTimeout(slidingTimerRef.current);
      slidingTimerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    slidingChipIdRef.current = null;
    setIsKnockedOut(false);
    setIsPushing(false);
    setCatchMessage(null);

    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setPlayerPos(previous.playerPos);
    playerPosRef.current = previous.playerPos;
    setPlayerDir(previous.playerDir);
    playerDirRef.current = previous.playerDir;

    // Ensure all restored chips have pristine integer grid coordinates and reset flags
    const cleanChips = previous.chips.map((c) => ({
      ...c,
      x: Math.round(c.x),
      y: Math.round(c.y),
      noTransition: false,
      isMerging: false,
    }));
    setChips(cleanChips);
    chipsRef.current = cleanChips;
    setMoves(previous.moves);
    setIsVictory(false);
    sounds.playUndo();
  }, [history]);

  // Reset current level
  const handleReset = useCallback(() => {
    autoPlayAbortRef.current = true;
    setIsAutoPlaying(false);
    if (slidingTimerRef.current) {
      clearTimeout(slidingTimerRef.current);
      slidingTimerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    slidingChipIdRef.current = null;
    setIsKnockedOut(false);
    setCatchMessage(null);
    const baseLvl = LEVELS.find((l) => l.id === currentLevel.id) || currentLevel;
    loadLevel(baseLvl);
    sounds.playStep();
  }, [currentLevel, loadLevel]);

  // Auto-play the verified BFS or reverse-fission solution
  const handleAutoPlaySolution = useCallback(async () => {
    if (!currentLevel.solutionSteps || currentLevel.solutionSteps.length === 0) return;
    autoPlayAbortRef.current = false;
    setIsAutoPlaying(true);
    setHintMessage('正在自動演示最佳解法...');

    // First reset level
    const baseLvl = LEVELS.find((l) => l.id === currentLevel.id) || currentLevel;
    loadLevel(baseLvl);
    await new Promise((r) => setTimeout(r, 350));

    for (let i = 0; i < currentLevel.solutionSteps.length; i++) {
      if (autoPlayAbortRef.current) break;
      const step = currentLevel.solutionSteps[i];

      // Move player to stand position
      setPlayerPos({ x: step.standX, y: step.standY });
      playerPosRef.current = { x: step.standX, y: step.standY };
      setPlayerDir(step.dir);
      playerDirRef.current = step.dir;
      sounds.playStep();
      await new Promise((r) => setTimeout(r, 260));

      if (autoPlayAbortRef.current) break;

      // Push!
      handleMove(step.dir);

      // Wait for any sliding animation to finish
      let waitTicks = 0;
      while (slidingChipIdRef.current !== null && waitTicks < 50) {
        await new Promise((r) => setTimeout(r, 60));
        waitTicks++;
      }
      await new Promise((r) => setTimeout(r, 350));
    }

    setIsAutoPlaying(false);
  }, [currentLevel, handleMove, loadLevel]);

  // Click on tile (Pathfinding to walk or direct push)
  const handleTileClick = useCallback(
    (tx: number, ty: number) => {
      if (isBusyRef.current || isVictory || isTimeOver || isKnockedOut) return;

      // Clicking stationary Einstein turns him 90 degrees to the left
      if (tx === playerPos.x && ty === playerPos.y) {
        if (!isWalking && !isPushing) {
          const turnLeftMap: Record<Direction, Direction> = {
            UP: 'LEFT',
            LEFT: 'DOWN',
            DOWN: 'RIGHT',
            RIGHT: 'UP',
          };
          const currentDir = playerDirRef.current || playerDir;
          const nextDir = turnLeftMap[currentDir];
          setPlayerDir(nextDir);
          playerDirRef.current = nextDir;
          sounds.playStep();
        }
        return;
      }

      const w = currentLevel.width;
      const h = currentLevel.height;

      // Check if clicking directly adjacent chip in front of Einstein
      const chipAtClick = chips.find((c) => c.x === tx && c.y === ty);
      if (chipAtClick) {
        let isAdjacent = false;
        let dir: Direction = 'RIGHT';

        if (isWraparound) {
          if ((playerPos.x + 1) % w === tx && playerPos.y === ty) {
            isAdjacent = true;
            dir = 'RIGHT';
          } else if (((playerPos.x - 1 + w) % w) === tx && playerPos.y === ty) {
            isAdjacent = true;
            dir = 'LEFT';
          } else if (playerPos.x === tx && (playerPos.y + 1) % h === ty) {
            isAdjacent = true;
            dir = 'DOWN';
          } else if (playerPos.x === tx && ((playerPos.y - 1 + h) % h) === ty) {
            isAdjacent = true;
            dir = 'UP';
          }
        } else {
          const dx = tx - playerPos.x;
          const dy = ty - playerPos.y;
          if (Math.abs(dx) + Math.abs(dy) === 1) {
            isAdjacent = true;
            dir = dx === 1 ? 'RIGHT' : dx === -1 ? 'LEFT' : dy === 1 ? 'DOWN' : 'UP';
          }
        }

        if (isAdjacent) {
          handleMove(dir);
          return;
        }
      }

      // Else: Empty tile -> BFS pathfinding walk
      const path = findPathBFS(
        effectiveGrid,
        playerPos,
        { x: tx, y: ty },
        chips,
        isWraparound,
        currentLevel.wormholes
      );
      if (!path || path.length === 0) {
        sounds.playBump();
        return;
      }

      // Walk path sequentially
      isBusyRef.current = true;
      let stepIndex = 0;

      const stepInterval = setInterval(() => {
        if (stepIndex >= path.length) {
          clearInterval(stepInterval);
          isBusyRef.current = false;
          setIsWalking(false);
          return;
        }

        const next = path[stepIndex];
        const cur = stepIndex === 0 ? playerPos : path[stepIndex - 1];

        const entrance = getWormholePartner(next, currentLevel.wormholes);
        const isWormholeJump =
          entrance !== null &&
          (Math.abs(next.x - cur.x) > 1 || Math.abs(next.y - cur.y) > 1);

        let dir: Direction = 'DOWN';
        if (isWormholeJump && entrance) {
          if (entrance.x === (cur.x + 1) % w) dir = 'RIGHT';
          else if (entrance.x === (cur.x - 1 + w) % w) dir = 'LEFT';
          else if (entrance.y === (cur.y + 1) % h) dir = 'DOWN';
          else if (entrance.y === (cur.y - 1 + h) % h) dir = 'UP';
        } else {
          if (next.x === (cur.x + 1) % w) dir = 'RIGHT';
          else if (next.x === (cur.x - 1 + w) % w) dir = 'LEFT';
          else if (next.y === (cur.y + 1) % h) dir = 'DOWN';
          else if (next.y === (cur.y - 1 + h) % h) dir = 'UP';
        }

        const isWrap =
          !isWormholeJump &&
          (Math.abs(next.x - cur.x) > 1 || Math.abs(next.y - cur.y) > 1);

        setPlayerDir(dir);
        if (isWormholeJump) {
          sounds.playWarp();
        } else {
          sounds.playStep();
        }
        setIsWalking(true);

        if (isWormholeJump) {
          setIsPlayerNoTransition(true);
          setPlayerPos(next);
          playerPosRef.current = next;
          setTimeout(() => {
            setIsPlayerNoTransition(false);
            setIsWalking(false);
          }, 60);
        } else if (isWrap) {
          const { dx: ddx, dy: ddy } = getDirectionDelta(dir);
          const exitP: Position = { x: cur.x + ddx, y: cur.y + ddy };
          let entryP: Position;
          if (ddx === 1) entryP = { x: -1, y: next.y };
          else if (ddx === -1) entryP = { x: w, y: next.y };
          else if (ddy === 1) entryP = { x: next.x, y: -1 };
          else entryP = { x: next.x, y: h };

          setIsPlayerNoTransition(false);
          setPlayerPos(exitP);

          setTimeout(() => {
            setIsPlayerNoTransition(true);
            setPlayerPos(entryP);

            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                setIsPlayerNoTransition(false);
                setPlayerPos(next);
              });
            });
          }, 35);
        } else {
          setIsPlayerNoTransition(false);
          setPlayerPos(next);
        }

        stepIndex++;
      }, 85);
    },
    [chips, currentLevel.height, currentLevel.width, currentLevel.wormholes, effectiveGrid, handleMove, isTimeOver, isVictory, isKnockedOut, isWraparound, playerPos, playerDir, isWalking, isPushing]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in inputs/textareas
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          handleMove('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          handleMove('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          handleMove('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          handleMove('RIGHT');
          break;
        case 'u':
        case 'U':
        case 'z':
        case 'Z':
          e.preventDefault();
          handleUndo();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          handleReset();
          break;
        case 'h':
        case 'H':
          e.preventDefault();
          setHintMessage(currentLevel.hint || '運用滑動碰撞，將同級晶片結合！');
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          setIsMuted(sounds.toggleMute());
          break;
        case 'b':
        case 'B':
          e.preventDefault();
          handleToggleAmbient();
          break;
        case 't':
        case 'T':
          e.preventDefault();
          handleCycleTheme();
          break;
        case 'c':
        case 'C':
          e.preventDefault();
          handleToggleTimedMode();
          break;
        case 'l':
        case 'L':
          e.preventDefault();
          setIsLevelSelectOpen((v) => !v);
          break;
        case 'Escape':
          setIsLevelSelectOpen(false);
          setIsEncyclopediaOpen(false);
          setIsEditorOpen(false);
          setIsHelpOpen(false);
          setHintMessage(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentLevel.hint, handleCycleTheme, handleMove, handleReset, handleToggleTimedMode, handleUndo, isAmbientOn]);

  const handleNextLevel = () => {
    const nextIdx = LEVELS.findIndex((l) => l.id === currentLevel.id) + 1;
    if (nextIdx < LEVELS.length) {
      loadLevel(LEVELS[nextIdx]);
    }
  };

  const handleToggleCrt = () => {
    const nextState = !isCrtOn;
    setIsCrtOn(nextState);
    localStorage.setItem('lab_game_crt', String(nextState));
  };

  const handleToggleAmbient = () => {
    const nextState = !isAmbientOn;
    setIsAmbientOn(nextState);
    localStorage.setItem('lab_game_ambient', String(nextState));
  };

  const bestRecord = solvedLevels[currentLevel.id]?.bestMoves || null;

  return (
    <div
      className={`min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col font-sans relative ${
        isCrtOn ? 'crt-active' : ''
      }`}
    >
      {/* Retro CRT Scanlines & Screen Curvature Overlay */}
      {isCrtOn && (
        <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
          {/* Subtle horizontal phosphor scanlines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px]" />
          {/* CRT Radial Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.6)_100%)]" />
        </div>
      )}

      {/* Top Bar Contract: 1-line Brand wordmark, 4 concise single-line nav links, 1 primary action */}
      <header className="flex items-center justify-between gap-8 px-4 sm:px-8 py-3.5 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xs shrink-0 z-30">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="text-base sm:text-lg font-black tracking-tight font-mono text-emerald-400">
            LAB // 1993 晶片推牌
          </span>
        </div>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-400">
          <button
            type="button"
            onClick={() => setIsHelpOpen(true)}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>操作指南</span>
          </button>
          <button
            type="button"
            onClick={() => setIsLevelSelectOpen(true)}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <span>關卡全覽 ({LEVELS.length}關)</span>
          </button>
          <button
            type="button"
            onClick={() => setIsEncyclopediaOpen(true)}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <span>晶片科技樹</span>
          </button>
          <button
            type="button"
            onClick={() => setIsEditorOpen(true)}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <span>自製實驗室</span>
          </button>
        </nav>

        {/* Zone 3: primary actions */}
        <div className="flex items-center gap-2 shrink-0">
          {currentLevel.id === 999 && (
            <button
              type="button"
              onClick={() => setIsEditorOpen(true)}
              className="p-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 active:scale-95 rounded-lg transition-all shrink-0 cursor-pointer shadow-md shadow-purple-600/30 flex items-center justify-center border border-purple-400/50"
              title="返回關卡編輯器"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsHelpOpen(true)}
            className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300"
            title="操作指南"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-95 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-sm shadow-emerald-400/20"
          >
            重整實驗室
          </button>
        </div>
      </header>

      {/* Main Game Stage */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 max-w-5xl mx-auto w-full">
        {/* HUD Controls */}
        <GameHUD
          currentLevel={currentLevel}
          moves={moves}
          canUndo={history.length > 0}
          isMuted={isMuted}
          isCrtOn={isCrtOn}
          isAmbientOn={isAmbientOn}
          isTimedMode={isTimedMode}
          timeLeft={timeLeft}
          currentThemeId={currentThemeId}
          bestMoves={bestRecord}
          remainingChipsCount={chips.length}
          onUndo={handleUndo}
          onReset={handleReset}
          onToggleSound={() => setIsMuted(sounds.toggleMute())}
          onToggleCrt={handleToggleCrt}
          onToggleAmbient={handleToggleAmbient}
          onToggleTimedMode={handleToggleTimedMode}
          onCycleTheme={handleCycleTheme}
          onShowHint={() =>
            setHintMessage(currentLevel.hint || '運用滑動碰撞，將同級晶片結合！')
          }
          onOpenSolution={() => setIsSolutionModalOpen(true)}
          onOpenLevelSelect={() => setIsLevelSelectOpen(true)}
          onOpenEncyclopedia={() => setIsEncyclopediaOpen(true)}
          onOpenEditor={() => setIsEditorOpen(true)}
        />

        {/* Hint Toast Banner */}
        {hintMessage && (
          <div className="w-full max-w-2xl mb-3 px-4 py-2.5 rounded-xl bg-amber-950/70 border border-amber-600/50 text-amber-200 text-xs flex items-center justify-between gap-3 shadow-md animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{hintMessage}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSolutionModalOpen(true)}
                className="text-emerald-400 hover:text-emerald-200 font-mono text-xs px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>查看解法</span>
              </button>
              <button
                type="button"
                onClick={() => setHintMessage(null)}
                className="text-amber-400 hover:text-white font-mono text-xs px-2 py-1 rounded bg-amber-900/60 cursor-pointer"
              >
                關閉
              </button>
            </div>
          </div>
        )}

        {/* Catch / Block Toast Banner */}
        {catchMessage && (
          <div className="w-full max-w-2xl mb-3 px-4 py-2.5 rounded-xl bg-cyan-950/90 border border-cyan-400/80 text-cyan-200 text-xs flex items-center justify-between gap-3 shadow-lg shadow-cyan-950/50 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2">
              <span className="text-base">✋</span>
              <span className="font-bold">{catchMessage}</span>
            </div>
          </div>
        )}

        {/* Game Grid Board */}
        <div className="w-full flex flex-col items-center justify-center my-auto gap-2">
          <GameBoard
            grid={effectiveGrid}
            width={currentLevel.width}
            height={currentLevel.height}
            isWraparound={isWraparound}
            isPlayerNoTransition={isPlayerNoTransition}
            playerPos={playerPos}
            playerDir={playerDir}
            isPushing={isPushing}
            isWalking={isWalking}
            isVictory={isVictory}
            isKnockedOut={isKnockedOut}
            isAmbientOn={isAmbientOn}
            theme={BOARD_THEMES[currentThemeId]}
            chips={chips}
            wormholes={currentLevel.wormholes}
            onTileClick={handleTileClick}
            onPush={(d) => handleMove(d, true)}
            onSwipe={handleMove}
          />

          {/* Mobile Swipe Gesture Helper Note */}
          <div className="flex md:hidden items-center justify-center gap-1.5 text-[11px] font-mono text-emerald-400/80 bg-slate-900/70 px-3 py-1 rounded-full border border-emerald-500/25 shadow-sm backdrop-blur-xs select-none">
            <span className="text-xs">👆</span>
            <span>可在棋盤向四方滑動 / 輕彈控制博士</span>
          </div>
        </div>

        {/* Lower Control & Failure Alert Section (Below GameBoard) */}
        <div className="relative w-full max-w-sm sm:max-w-2xl mx-auto mt-2 min-h-[96px] md:min-h-0 flex items-center justify-center">
          {/* Mobile Virtual D-Pad */}
          <DpadControls
            onDirectionMove={handleMove}
            onUndo={handleUndo}
            onReset={handleReset}
            canUndo={history.length > 0}
          />

          {/* Knocked Out Failure Alert Banner (Placed below GameBoard, covers virtual controls when knocked out) */}
          {isKnockedOut && (
            <div className="absolute inset-0 md:static z-30 flex items-center justify-center animate-in zoom-in-95 duration-200">
              <div className="w-full h-full md:h-auto p-3.5 sm:p-4 rounded-xl bg-red-950/95 border-2 border-red-500 text-red-100 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl shadow-red-950/80 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-900/80 border border-red-400 flex items-center justify-center shrink-0 text-xl shadow-inner">
                    💥
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-red-200 flex items-center gap-2">
                      <span>挑戰失敗：博士被高速晶片撞倒！</span>
                    </h4>
                    <p className="text-xs text-red-300/90 mt-0.5 line-clamp-2 sm:line-clamp-none">
                      晶片在環狀空間中高速折返！請及時閃開跳至鄰格，或轉身面對晶片伸手擋下！
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto mt-1 sm:mt-0">
                  {history.length > 0 && (
                    <button
                      type="button"
                      onClick={handleUndo}
                      className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs cursor-pointer shadow-sm transition-all whitespace-nowrap"
                    >
                      復原上一步 (U)
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 active:scale-95 text-slate-950 font-bold text-xs cursor-pointer shadow-sm transition-all whitespace-nowrap"
                  >
                    重新挑戰 (R)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* DOS Terminal Status Bar */}
      <footer className="w-full px-4 py-2 border-t border-slate-800 bg-slate-950 text-slate-500 font-mono text-[11px] flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-500/80">
            <Terminal className="w-3.5 h-3.5" />
            <span>MS-DOS VGA 640×480</span>
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">
            [↑↓←→ / WASD] 移動與推動
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">[U] 復原</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">[R] 重試</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">[H] 提示</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">[B] 動畫</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">[T] 主題色</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">[C] 限時挑戰</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span>博士任務：合成唯一超級電腦</span>
        </div>
      </footer>

      {/* Modals */}
      {isVictory && (
        <WinModal
          level={currentLevel}
          moves={moves}
          bestMoves={bestRecord}
          timeLeft={isTimedMode ? timeLeft : undefined}
          hasNextLevel={LEVELS.findIndex((l) => l.id === currentLevel.id) < LEVELS.length - 1}
          onNextLevel={handleNextLevel}
          onReplay={handleReset}
          onLevelSelect={() => {
            setIsVictory(false);
            setIsLevelSelectOpen(true);
          }}
          onOpenEditor={() => {
            setIsVictory(false);
            setIsEditorOpen(true);
          }}
        />
      )}

      {isLevelSelectOpen && (
        <LevelSelectModal
          currentLevelId={currentLevel.id}
          solvedLevels={solvedLevels}
          onSelectLevel={(id) => {
            const chosen = LEVELS.find((l) => l.id === id);
            if (chosen) loadLevel(chosen);
          }}
          onClose={() => setIsLevelSelectOpen(false)}
        />
      )}

      {isEncyclopediaOpen && (
        <EncyclopediaModal onClose={() => setIsEncyclopediaOpen(false)} />
      )}

      {isEditorOpen && (
        <LevelEditorModal
          initialCustomLevel={lastCustomLevel}
          onPlayCustomLevel={handlePlayCustomLevel}
          onClose={() => setIsEditorOpen(false)}
        />
      )}

      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}

      {isSolutionModalOpen && (
        <SolutionModal
          level={currentLevel}
          onAutoPlay={handleAutoPlaySolution}
          onClose={() => setIsSolutionModalOpen(false)}
        />
      )}

      {isTimeOver && (
        <TimeOverModal
          level={currentLevel}
          onRetry={handleReset}
          onExitTimedMode={() => {
            setIsTimedMode(false);
            localStorage.setItem('lab_game_timed_mode', 'false');
            setIsTimeOver(false);
            handleReset();
          }}
        />
      )}
    </div>
  );
}
