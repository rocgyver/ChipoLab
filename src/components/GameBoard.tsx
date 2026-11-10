import React, { useMemo } from 'react';
import { CellType, Chip, Direction, Position, WormholePair } from '../types/game';
import { BoardThemeConfig, BOARD_THEMES } from '../types/theme';
import { EinsteinSprite } from './EinsteinSprite';
import { ChipCard } from './ChipCard';
import { LabAtmosphere } from './LabAtmosphere';
import { SwipeGestureLayer } from './SwipeGestureLayer';
import { calculatePush, getDirectionDelta } from '../utils/gameLogic';
import { WormholeIcon } from './WormholeIcon';

const WORMHOLE_COLORS = [
  {
    ring: 'border-cyan-400',
    glow: 'shadow-[0_0_15px_rgba(34,211,238,0.5)]',
    bg: 'from-cyan-950/70 via-blue-900/50 to-indigo-950/80',
    text: 'text-cyan-300',
    stroke: '#22d3ee',
    badge: 'bg-cyan-950/90 text-cyan-300 border-cyan-400/80',
  },
  {
    ring: 'border-fuchsia-400',
    glow: 'shadow-[0_0_15px_rgba(232,121,249,0.5)]',
    bg: 'from-purple-950/70 via-fuchsia-900/50 to-pink-950/80',
    text: 'text-fuchsia-300',
    stroke: '#e879f9',
    badge: 'bg-purple-950/90 text-fuchsia-300 border-fuchsia-400/80',
  },
  {
    ring: 'border-amber-400',
    glow: 'shadow-[0_0_15px_rgba(251,191,36,0.5)]',
    bg: 'from-amber-950/70 via-orange-900/50 to-red-950/80',
    text: 'text-amber-300',
    stroke: '#fbbf24',
    badge: 'bg-amber-950/90 text-amber-300 border-amber-400/80',
  },
  {
    ring: 'border-emerald-400',
    glow: 'shadow-[0_0_15px_rgba(52,211,153,0.5)]',
    bg: 'from-emerald-950/70 via-teal-900/50 to-cyan-950/80',
    text: 'text-emerald-300',
    stroke: '#34d399',
    badge: 'bg-emerald-950/90 text-emerald-300 border-emerald-400/80',
  },
];

interface GameBoardProps {
  grid: CellType[][];
  width: number;
  height: number;
  playerPos: Position;
  playerDir: Direction;
  isPushing: boolean;
  isWalking: boolean;
  isVictory: boolean;
  isKnockedOut?: boolean;
  isAmbientOn?: boolean;
  isWraparound?: boolean;
  isPlayerNoTransition?: boolean;
  theme?: BoardThemeConfig;
  chips: Chip[];
  wormholes?: WormholePair[];
  onTileClick: (x: number, y: number) => void;
  onPush: (dir: Direction) => void;
  onSwipe?: (dir: Direction) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  width,
  height,
  playerPos,
  playerDir,
  isPushing,
  isWalking,
  isVictory,
  isKnockedOut = false,
  isAmbientOn = true,
  isWraparound = false,
  isPlayerNoTransition = false,
  theme = BOARD_THEMES['Cyber Green'],
  chips,
  wormholes = [],
  onTileClick,
  onPush,
  onSwipe,
}) => {
  // Check which chip Einstein is directly facing and can push
  const pushableChipsMap = useMemo(() => {
    const map = new Map<string, Direction[]>();

    // The push button should ONLY appear on the chip Einstein is truly facing
    const { dx, dy } = getDirectionDelta(playerDir);
    const frontX = isWraparound ? ((playerPos.x + dx) % width + width) % width : playerPos.x + dx;
    const frontY = isWraparound ? ((playerPos.y + dy) % height + height) % height : playerPos.y + dy;

    const frontChip = chips.find((c) => c.x === frontX && c.y === frontY);
    if (frontChip) {
      // Can Einstein push it in direction `playerDir`?
      const result = calculatePush(grid, chips, frontChip, playerDir, isWraparound, wormholes);
      if (result.canPush) {
        map.set(frontChip.id, [playerDir]);
      }
    }

    return map;
  }, [chips, playerPos, playerDir, grid, isWraparound, wormholes, width, height]);

  // Compute laser trajectory preview for the chip immediately in front of Einstein
  const laserTrajectory = useMemo(() => {
    const { dx, dy } = getDirectionDelta(playerDir);
    const frontX = isWraparound ? ((playerPos.x + dx) % width + width) % width : playerPos.x + dx;
    const frontY = isWraparound ? ((playerPos.y + dy) % height + height) % height : playerPos.y + dy;
    const frontChip = chips.find((c) => c.x === frontX && c.y === frontY);

    if (!frontChip) return null;
    const result = calculatePush(grid, chips, frontChip, playerDir, isWraparound, wormholes);
    if (!result.canPush || !result.traveledPath || result.traveledPath.length < 2) return null;

    return {
      path: result.traveledPath,
      merged: result.merged,
    };
  }, [playerPos, playerDir, chips, grid, isWraparound, wormholes, width, height]);

  return (
    <div
      className={`relative inline-block p-3 sm:p-5 rounded-none border-2 shadow-2xl overflow-hidden max-w-full transition-all duration-300 ${
        isWraparound
          ? `${theme.containerClass} ring-1 ring-cyan-500/50 shadow-[0_12px_40px_rgba(6,182,212,0.25)]`
          : theme.containerClass
      }`}
    >
      {/* Background Lab Grid Circuit Pattern */}
      <div
        className="absolute inset-0 [background-size:16px_16px] opacity-40 pointer-events-none transition-all duration-300"
        style={{
          backgroundImage: `radial-gradient(${theme.gridRadialDotColor} 1px, transparent 1px)`,
        }}
      />

      {/* Dynamic Background Atmosphere: Digital Dust & Flickering Circuit Pulses (Toggleable) */}
      {isAmbientOn && <LabAtmosphere theme={theme} />}

      {/* Wraparound continuous space edge portal boundary frame */}
      {isWraparound && (
        <div className="absolute inset-0 pointer-events-none rounded-none border border-dashed border-cyan-400/30 shadow-[inset_0_0_14px_rgba(34,211,238,0.10)] z-10" />
      )}



      {/* Grid Container with Visual Swipe Gesture Layer */}
      <SwipeGestureLayer
        onSwipe={onSwipe || onPush}
        disabled={isKnockedOut || isVictory}
        className="relative grid select-none mx-auto overflow-hidden rounded-none"
        style={{
          gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${height}, minmax(0, 1fr))`,
          aspectRatio: `${width} / ${height}`,
          width: `min(92vw, min(calc(55vh * ${width} / ${height}), ${width * 46}px))`,
          maxWidth: `${width * 50}px`,
          maxHeight: `${height * 50}px`,
        }}
      >
        {/* Tiles Rendering */}
        {grid.map((row, y) =>
          row.map((cell, x) => {
            const isWall = cell === 'WALL';
            const isObstacle = cell === 'OBSTACLE';
            const isPlayerHere = playerPos.x === x && playerPos.y === y;

            return (
              <div
                key={`tile-${x}-${y}`}
                onClick={() => onTileClick(x, y)}
                className={`relative flex items-center justify-center cursor-pointer transition-colors duration-200 ${
                  isWall
                    ? theme.wallClass
                    : isObstacle
                    ? theme.obstacleClass
                    : theme.emptyTileClass
                }`}
              >
                {/* Wall Details */}
                {isWall && (
                  <div className="w-full h-full flex flex-col items-center justify-center p-1 opacity-70">
                    <div className="w-full h-0.5 bg-slate-500/40 mb-auto" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400/40 shadow-xs" />
                    <div className="w-full h-0.5 bg-slate-950/60 mt-auto" />
                  </div>
                )}

                {/* Obstacle (Server Rack / Terminal) */}
                {isObstacle && (
                  <div className="w-full h-full flex flex-col items-center justify-between p-1.5 opacity-90">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    </div>
                    <div className="w-full h-1 bg-slate-700 rounded-none" />
                    <div className="w-full h-1 bg-slate-700 rounded-none" />
                  </div>
                )}

                {/* Empty Floor Decals (Coordinate markings) */}
                {!isWall && !isObstacle && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
                    <div className={`w-1 h-1 rounded-full ${theme.rivetClass}`} />
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Wormholes Layer */}
        {wormholes && wormholes.map((pair) => {
          const nodes = [
            { pos: pair.a, key: 'a' },
            { pos: pair.b, key: 'b' },
          ];

          return (
            <React.Fragment key={`wormhole-pair-${pair.id}`}>
              {nodes.map(({ pos, key }) => (
                <div
                  key={`wormhole-${pair.id}-${key}`}
                  className="absolute z-12 pointer-events-none flex items-center justify-center overflow-visible"
                  style={{
                    width: `${100 / width}%`,
                    height: `${100 / height}%`,
                    left: `${(pos.x / width) * 100}%`,
                    top: `${(pos.y / height) * 100}%`,
                  }}
                >
                  <WormholeIcon pairId={pair.id} />
                </div>
              ))}
            </React.Fragment>
          );
        })}

        {/* Laser Slide Trajectory Preview: Pink dots, ultra-fine size, sequentially lighting up forward */}
        {laserTrajectory && (
          <div className="absolute inset-0 pointer-events-none z-15">
            {laserTrajectory.path.slice(1).map((pt, idx) => {
              const isCollisionEnd =
                laserTrajectory.merged && idx === laserTrajectory.path.length - 2;

              return (
                <div
                  key={`laser-dot-${idx}`}
                  className={`absolute rounded-full animate-trajectory-flow ${
                    isCollisionEnd
                      ? 'w-1 h-1 bg-pink-200 shadow-[0_0_5px_rgba(244,114,182,1)] ring-1 ring-pink-300/80'
                      : 'w-0.5 h-0.5 bg-pink-300 shadow-[0_0_3px_rgba(244,114,182,0.9)]'
                  }`}
                  style={{
                    left: `${((pt.x + 0.5) / width) * 100}%`,
                    top: `${((pt.y + 0.5) / height) * 100}%`,
                    animationDelay: `${idx * 0.12}s`,
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Chips Layer (Continuous subpixel sliding + portal clone rendering) */}
        {chips.map((chip) => {
          const pushableDirs = pushableChipsMap.get(chip.id) || [];
          const clones: { x: number; y: number }[] = [];
          const isDenseBoard = width >= 10 || height >= 10;

          if (isWraparound && chip.noTransition) {
            if (chip.x < 1.0) clones.push({ x: chip.x + width, y: chip.y });
            if (chip.x > width - 2.0) clones.push({ x: chip.x - width, y: chip.y });
            if (chip.y < 1.0) clones.push({ x: chip.x, y: chip.y + height });
            if (chip.y > height - 2.0) clones.push({ x: chip.x, y: chip.y - height });
          }

          const renderChipElement = (px: number, py: number, cloneIdx?: number) => (
            <div
              key={cloneIdx !== undefined ? `${chip.id}-clone-${cloneIdx}` : chip.id}
              className={`absolute z-20 overflow-visible ${
                chip.noTransition
                  ? 'transition-none'
                  : 'transition-all duration-140 ease-out'
              }`}
              style={{
                width: `${100 / width}%`,
                height: `${100 / height}%`,
                left: `${(px / width) * 100}%`,
                top: `${(py / height) * 100}%`,
              }}
            >
              <ChipCard
                level={chip.level}
                isMerging={chip.isMerging}
                pushableDirections={cloneIdx !== undefined ? [] : pushableDirs}
                onDirectPush={cloneIdx !== undefined ? undefined : (d) => onPush(d)}
                numberOnly={isDenseBoard}
              />
            </div>
          );

          return (
            <React.Fragment key={chip.id}>
              {renderChipElement(chip.x, chip.y)}
              {clones.map((c, i) => renderChipElement(c.x, c.y, i))}
            </React.Fragment>
          );
        })}

        {/* Einstein Scientist Sprite Layer: Clicking stationary doctor turns him 90 degrees left */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onTileClick(playerPos.x, playerPos.y);
          }}
          title="點擊博士向左轉 90 度"
          className={`absolute z-25 cursor-pointer touch-manipulation select-none ${
            isPlayerNoTransition
              ? 'transition-none'
              : 'transition-all duration-120 ease-out'
          }`}
          style={{
            width: `${100 / width}%`,
            height: `${100 / height}%`,
            left: `${(playerPos.x / width) * 100}%`,
            top: `${(playerPos.y / height) * 100}%`,
          }}
        >
          <EinsteinSprite
            direction={playerDir}
            isPushing={isPushing}
            isWalking={isWalking}
            isVictory={isVictory}
            isKnockedOut={isKnockedOut}
          />
        </div>
      </SwipeGestureLayer>
    </div>
  );
};
