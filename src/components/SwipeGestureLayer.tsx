import React, { useState, useRef, useCallback } from 'react';
import { Direction } from '../types/game';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface SwipeGestureLayerProps {
  onSwipe: (dir: Direction) => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

interface GestureState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  direction: Direction;
  distance: number;
  isReady: boolean;
}

interface BurstEffect {
  id: number;
  x: number;
  y: number;
  direction: Direction;
}

const MIN_SWIPE_DISTANCE = 22; // Pixels required to trigger cardinal swipe
const FLICK_VELOCITY = 0.32; // px/ms: fast flick can trigger at slightly shorter distance

function calculateDirection(dx: number, dy: number): Direction {
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0 ? 'RIGHT' : 'LEFT';
  } else {
    return dy >= 0 ? 'DOWN' : 'UP';
  }
}

export const SwipeGestureLayer: React.FC<SwipeGestureLayerProps> = ({
  onSwipe,
  disabled = false,
  children,
  className = '',
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gesture, setGesture] = useState<GestureState | null>(null);
  const [bursts, setBursts] = useState<BurstEffect[]>([]);

  // Refs for tracking touch-only gestures without ever interfering with desktop mouse clicks
  const startPosRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchSwipeCompletedRef = useRef<boolean>(false);

  // Helper to compute local coordinates relative to the grid container
  const getLocalCoords = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  const triggerBurst = useCallback((x: number, y: number, direction: Direction) => {
    const burstId = Date.now() + Math.random();
    setBursts((prev) => [...prev, { id: burstId, x, y, direction }]);
    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== burstId));
    }, 350);
  }, []);

  // TOUCH-ONLY HANDLERS: Strictly handles finger gestures on mobile/tablet screens.
  // Desktop mouse clicks bypass touch events completely and function with 100% native behavior.
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (disabled || e.touches.length !== 1) return;

      const touch = e.touches[0];
      const { x, y } = getLocalCoords(touch.clientX, touch.clientY);
      startPosRef.current = { x, y, time: performance.now() };
      touchSwipeCompletedRef.current = false;
    },
    [disabled, getLocalCoords]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (disabled || !startPosRef.current || e.touches.length !== 1) return;

      const touch = e.touches[0];
      const { x, y } = getLocalCoords(touch.clientX, touch.clientY);
      const dx = x - startPosRef.current.x;
      const dy = y - startPosRef.current.y;
      const distance = Math.hypot(dx, dy);

      // Only display the visual layer once finger has moved beyond slight touch jitter (6px)
      if (distance >= 6) {
        const direction = calculateDirection(dx, dy);
        const dt = Math.max(1, performance.now() - startPosRef.current.time);
        const velocity = distance / dt;
        const isReady =
          distance >= MIN_SWIPE_DISTANCE || (distance >= 14 && velocity >= FLICK_VELOCITY);

        setGesture({
          startX: startPosRef.current.x,
          startY: startPosRef.current.y,
          currentX: x,
          currentY: y,
          direction,
          distance,
          isReady,
        });
      }
    },
    [disabled, getLocalCoords]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!startPosRef.current || disabled) {
        setGesture(null);
        startPosRef.current = null;
        return;
      }

      const touch = e.changedTouches[0];
      if (touch) {
        const { x, y } = getLocalCoords(touch.clientX, touch.clientY);
        const dx = x - startPosRef.current.x;
        const dy = y - startPosRef.current.y;
        const distance = Math.hypot(dx, dy);
        const dt = Math.max(1, performance.now() - startPosRef.current.time);
        const velocity = distance / dt;

        const isSuccessSwipe =
          distance >= MIN_SWIPE_DISTANCE || (distance >= 14 && velocity >= FLICK_VELOCITY);

        if (isSuccessSwipe) {
          const dir = calculateDirection(dx, dy);
          onSwipe(dir);
          triggerBurst(x, y, dir);

          // Suppress upcoming synthetic click events on underlying tiles/buttons for 300ms
          touchSwipeCompletedRef.current = true;
          setTimeout(() => {
            touchSwipeCompletedRef.current = false;
          }, 300);
        }
      }

      // Cleanup
      startPosRef.current = null;
      setGesture(null);
    },
    [disabled, getLocalCoords, onSwipe, triggerBurst]
  );

  const handleTouchCancel = useCallback(() => {
    startPosRef.current = null;
    setGesture(null);
    touchSwipeCompletedRef.current = false;
  }, []);

  // Suppress synthetic clicks ONLY if the user just completed a mobile touch swipe.
  // Desktop mouse clicks never set touchSwipeCompletedRef, guaranteeing zero interference with PC mouse play.
  const handleClickCapture = useCallback((e: React.MouseEvent) => {
    if (touchSwipeCompletedRef.current) {
      e.stopPropagation();
      e.preventDefault();
      touchSwipeCompletedRef.current = false;
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`touch-none select-none ${className}`}
      style={style}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onClickCapture={handleClickCapture}
    >
      {/* Board Elements (Tiles, Chips, Einstein, Wormholes, etc.) */}
      {children}

      {/* Visual Swipe Directional Edge Cue: Illuminates board border towards swipe direction */}
      {gesture && gesture.distance >= 10 && (
        <div className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-150">
          {gesture.direction === 'UP' && (
            <div
              className={`absolute top-0 inset-x-0 h-1.5 ${
                gesture.isReady
                  ? 'bg-gradient-to-b from-emerald-400 via-emerald-400/80 to-transparent shadow-[0_0_12px_rgba(52,211,153,0.9)]'
                  : 'bg-gradient-to-b from-cyan-400 via-cyan-400/60 to-transparent'
              }`}
            />
          )}
          {gesture.direction === 'DOWN' && (
            <div
              className={`absolute bottom-0 inset-x-0 h-1.5 ${
                gesture.isReady
                  ? 'bg-gradient-to-t from-emerald-400 via-emerald-400/80 to-transparent shadow-[0_0_12px_rgba(52,211,153,0.9)]'
                  : 'bg-gradient-to-t from-cyan-400 via-cyan-400/60 to-transparent'
              }`}
            />
          )}
          {gesture.direction === 'LEFT' && (
            <div
              className={`absolute left-0 inset-y-0 w-1.5 ${
                gesture.isReady
                  ? 'bg-gradient-to-r from-emerald-400 via-emerald-400/80 to-transparent shadow-[0_0_12px_rgba(52,211,153,0.9)]'
                  : 'bg-gradient-to-r from-cyan-400 via-cyan-400/60 to-transparent'
              }`}
            />
          )}
          {gesture.direction === 'RIGHT' && (
            <div
              className={`absolute right-0 inset-y-0 w-1.5 ${
                gesture.isReady
                  ? 'bg-gradient-to-l from-emerald-400 via-emerald-400/80 to-transparent shadow-[0_0_12px_rgba(52,211,153,0.9)]'
                  : 'bg-gradient-to-l from-cyan-400 via-cyan-400/60 to-transparent'
              }`}
            />
          )}
        </div>
      )}

      {/* Visual Swipe Trail SVG Overlay */}
      {gesture && gesture.distance >= 8 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-35 overflow-visible">
          <defs>
            <filter id="swipeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="swipeLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gesture.isReady ? '#34d399' : '#22d3ee'} stopOpacity="0.4" />
              <stop offset="100%" stopColor={gesture.isReady ? '#10b981' : '#06b6d4'} stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Swipe Vector Trail */}
          <line
            x1={gesture.startX}
            y1={gesture.startY}
            x2={gesture.currentX}
            y2={gesture.currentY}
            stroke="url(#swipeLineGradient)"
            strokeWidth={gesture.isReady ? '3.5' : '2.5'}
            strokeLinecap="round"
            filter="url(#swipeGlow)"
          />

          {/* Origin Touch Ripple Indicator */}
          <circle
            cx={gesture.startX}
            cy={gesture.startY}
            r={gesture.isReady ? 9 : 7}
            fill="none"
            stroke={gesture.isReady ? '#34d399' : '#22d3ee'}
            strokeWidth="1.5"
            strokeDasharray="3 3"
            className="animate-spin"
            style={{ animationDuration: '4s' }}
          />
          <circle
            cx={gesture.startX}
            cy={gesture.startY}
            r="3.5"
            fill={gesture.isReady ? '#10b981' : '#06b6d4'}
            filter="url(#swipeGlow)"
          />
        </svg>
      )}

      {/* Floating Holographic Directional Arrow HUD Badge */}
      {gesture && gesture.distance >= 8 && (
        <div
          className={`absolute pointer-events-none z-40 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-2xl backdrop-blur-md transition-all duration-75 ${
            gesture.isReady
              ? 'bg-emerald-950/95 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.7)] scale-110'
              : 'bg-slate-950/90 border-cyan-400/80 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.45)] scale-100'
          }`}
          style={{
            left: `${gesture.currentX}px`,
            top: `${gesture.currentY}px`,
          }}
        >
          {gesture.direction === 'UP' && <ArrowUp className="w-4 h-4 animate-bounce" />}
          {gesture.direction === 'DOWN' && <ArrowDown className="w-4 h-4 animate-bounce" />}
          {gesture.direction === 'LEFT' && <ArrowLeft className="w-4 h-4 animate-bounce" />}
          {gesture.direction === 'RIGHT' && <ArrowRight className="w-4 h-4 animate-bounce" />}

          <span className="text-[11px] font-mono font-bold tracking-wider">
            {gesture.direction === 'UP' && '向上'}
            {gesture.direction === 'DOWN' && '向下'}
            {gesture.direction === 'LEFT' && '向左'}
            {gesture.direction === 'RIGHT' && '向右'}
          </span>
        </div>
      )}

      {/* Swipe Release Bursts */}
      {bursts.map((b) => (
        <div
          key={b.id}
          className="absolute pointer-events-none z-40 -translate-x-1/2 -translate-y-1/2 animate-swipe-burst flex items-center justify-center"
          style={{
            left: `${b.x}px`,
            top: `${b.y}px`,
          }}
        >
          {/* Expanding Energy Ring */}
          <div className="w-12 h-12 rounded-full border-2 border-emerald-400 bg-emerald-500/20 shadow-[0_0_25px_rgba(52,211,153,0.9)] flex items-center justify-center">
            {b.direction === 'UP' && <ArrowUp className="w-6 h-6 text-emerald-300" />}
            {b.direction === 'DOWN' && <ArrowDown className="w-6 h-6 text-emerald-300" />}
            {b.direction === 'LEFT' && <ArrowLeft className="w-6 h-6 text-emerald-300" />}
            {b.direction === 'RIGHT' && <ArrowRight className="w-6 h-6 text-emerald-300" />}
          </div>
        </div>
      ))}
    </div>
  );
};
