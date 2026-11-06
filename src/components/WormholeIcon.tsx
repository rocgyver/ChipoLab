import React from 'react';

export const WORMHOLE_COLORS = [
  {
    ring: 'border-cyan-400',
    glow: 'shadow-[0_0_15px_rgba(34,211,238,0.5)]',
    stroke: '#22d3ee',
    lightFill: 'rgba(34, 211, 238, 0.25)',
  },
  {
    ring: 'border-fuchsia-400',
    glow: 'shadow-[0_0_15px_rgba(232,121,249,0.5)]',
    stroke: '#e879f9',
    lightFill: 'rgba(232, 121, 249, 0.25)',
  },
  {
    ring: 'border-amber-400',
    glow: 'shadow-[0_0_15px_rgba(251,191,36,0.5)]',
    stroke: '#fbbf24',
    lightFill: 'rgba(251, 191, 36, 0.25)',
  },
  {
    ring: 'border-emerald-400',
    glow: 'shadow-[0_0_15px_rgba(52,211,153,0.5)]',
    stroke: '#34d399',
    lightFill: 'rgba(52, 211, 153, 0.25)',
  },
];

interface WormholeIconProps {
  pairId: number;
  nodeLabel?: string;
}

export const WormholeIcon: React.FC<WormholeIconProps> = ({ pairId, nodeLabel }) => {
  const colorScheme = WORMHOLE_COLORS[(pairId - 1) % WORMHOLE_COLORS.length];

  return (
    <div className="absolute w-[108%] h-[108%] flex items-center justify-center pointer-events-none overflow-visible z-10">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
        <defs>
          <style>{`
            @keyframes wormholeRipple-${pairId} {
              0%, 100% {
                stroke: #0f172a;
                fill: rgba(15, 23, 42, 0.6);
              }
              25% {
                stroke: ${colorScheme.stroke};
                fill: ${colorScheme.lightFill};
              }
            }
            .wh-${pairId}-ring-1 { animation: wormholeRipple-${pairId} 2.0s infinite 0.0s ease-in-out; }
            .wh-${pairId}-ring-2 { animation: wormholeRipple-${pairId} 2.0s infinite 0.25s ease-in-out; }
            .wh-${pairId}-ring-3 { animation: wormholeRipple-${pairId} 2.0s infinite 0.5s ease-in-out; }
            .wh-${pairId}-ring-4 { animation: wormholeRipple-${pairId} 2.0s infinite 0.75s ease-in-out; }
          `}</style>
        </defs>
        {/* Outermost circle (108% scale relative to tile) */}
        <circle cx="50" cy="50" r="48" strokeWidth="2.2" className={`wh-${pairId}-ring-1`} />
        <circle cx="50" cy="50" r="36" strokeWidth="1.8" className={`wh-${pairId}-ring-2`} />
        <circle cx="50" cy="50" r="24" strokeWidth="1.5" className={`wh-${pairId}-ring-3`} />
        <circle cx="50" cy="50" r="12" strokeWidth="1.2" className={`wh-${pairId}-ring-4`} />
        {/* Smallest circle (center point) */}
        <circle cx="50" cy="50" r="2.5" fill={colorScheme.stroke} className="animate-pulse" />
        {nodeLabel && (
          <text
            x="50"
            y="52"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#ffffff"
            fontSize="14"
            fontWeight="bold"
            fontFamily="monospace"
            className="pointer-events-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]"
          >
            {nodeLabel}
          </text>
        )}
      </svg>
    </div>
  );
};
