import React from 'react';
import { CHIP_DEFINITIONS } from '../data/chipEncyclopedia';
import { Direction } from '../types/game';

interface ChipCardProps {
  level: number;
  isMerging?: boolean;
  pushableDirections?: Direction[];
  onDirectPush?: (dir: Direction) => void;
  size?: 'normal' | 'large' | 'compact';
  showDetails?: boolean;
  numberOnly?: boolean;
}

export const ChipCard: React.FC<ChipCardProps> = ({
  level,
  isMerging = false,
  pushableDirections = [],
  onDirectPush,
  size = 'normal',
  showDetails = true,
  numberOnly = false,
}) => {
  const def = CHIP_DEFINITIONS[level] || CHIP_DEFINITIONS[1];

  const isSupercomputer = level === 8;
  const isQuantum = level === 7;

  return (
    <div
      className={`@container relative w-full h-full select-none flex items-center justify-center p-0.5 ${
        isMerging ? 'scale-110 transition-transform duration-150' : ''
      }`}
    >
      {/* Chip Package Wrapper: Centered at 80% to give ~2px margin from tile boundaries */}
      <div className="relative w-[80%] h-full flex items-center justify-center">
        {/* 2. 左右兩排外伸針腳 (Left Side: 3px dots in micro mode, 30% embedded, 4 bars in normal mode) */}
        <div className="absolute -left-[2.1px] @[46px]:-left-[5px] top-[14%] bottom-[14%] flex flex-col justify-evenly items-center pointer-events-none z-20">
          {numberOnly ? (
            [0, 1, 2, 3].map((i) => (
              <div
                key={`dot-l-${i}`}
                className="w-[3px] h-[3px] rounded-full bg-gradient-to-r from-amber-200 via-slate-100 to-amber-300 border-[0.5px] border-slate-900 shadow-[0_0_1.5px_rgba(251,191,36,0.6)]"
              />
            ))
          ) : (
            <>
              {/* Auto-responsive micro (<46px): 4 dots embedded 30% into chip edge */}
              <div className="flex @[46px]:hidden flex-col justify-evenly items-center w-full h-full">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={`c-dot-l-${i}`}
                    className="w-[3px] h-[3px] rounded-full bg-gradient-to-r from-amber-200 via-slate-100 to-amber-300 border-[0.5px] border-slate-900 shadow-[0_0_1.5px_rgba(251,191,36,0.6)]"
                  />
                ))}
              </div>

              {/* Normal mode (>=46px): 4 metallic extended bars */}
              <div className="hidden @[46px]:flex flex-col justify-evenly items-end w-full h-full">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={`pin-l-${i}`}
                    className="w-1.5 sm:w-2 h-1 sm:h-1.5 rounded-none bg-gradient-to-r from-slate-300 via-amber-200 to-slate-400 border-t border-b border-l border-slate-800 shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Main Epoxy Chip Casing: Straight rectangular IC package */}
        <div
          className={`relative w-full h-full rounded-none shadow-lg border flex flex-col items-center justify-between overflow-hidden transition-all duration-150 z-10 ${
            isSupercomputer
              ? 'animate-pulse ring-2 ring-yellow-400 ring-offset-1 ring-offset-black'
              : isQuantum
              ? 'ring-1 ring-cyan-400'
              : ''
          }`}
          style={{
            background: def.bgGradient,
            borderColor: def.borderColor,
            boxShadow: `0 4px 12px ${def.glowColor}, inset 0 1px 1px rgba(255,255,255,0.2)`,
          }}
        >
          {/* 1. 上方定位凹槽：隨著晶片變小而縮小的 Pin-1 方正定位凹槽 */}
          <div
            title="Pin-1 Index Notch"
            className={`absolute top-0 left-1/2 -translate-x-1/2 bg-slate-950 border-b border-x border-slate-700/90 shadow-[inset_0_1px_1px_rgba(0,0,0,0.9)] z-20 ${
              numberOnly
                ? 'w-1.5 h-0.5'
                : 'w-1.5 @[46px]:w-3.5 h-0.5 @[46px]:h-1.5'
            }`}
          />

          {/* If numberOnly or compact space: Render ONLY the centered bold number */}
          {numberOnly ? (
            <div className="flex-1 flex items-center justify-center text-center w-full h-full z-10 pt-0.5">
              <span
                className="font-black font-mono leading-none tracking-tighter select-none"
                style={{
                  color: def.borderColor,
                  textShadow: `0 0 6px ${def.glowColor}`,
                  fontSize: isSupercomputer ? 'clamp(14px, 56cqw, 24px)' : 'clamp(10px, 48cqw, 20px)',
                }}
              >
                {isSupercomputer ? '★' : level}
              </span>
            </div>
          ) : (
            <>
              {/* Auto-responsive: On very small containers (<46px), show number-only */}
              <div className="flex @[46px]:hidden flex-1 items-center justify-center text-center w-full h-full z-10 pt-0.5">
                <span
                  className="font-black font-mono leading-none tracking-tighter select-none"
                  style={{
                    color: def.borderColor,
                    textShadow: `0 0 6px ${def.glowColor}`,
                    fontSize: isSupercomputer ? 'clamp(14px, 56cqw, 24px)' : 'clamp(10px, 48cqw, 20px)',
                  }}
                >
                  {isSupercomputer ? '★' : level}
                </span>
              </div>

              {/* Detailed IC Silkscreen view: only visible when space permits (>=46px) */}
              <div className="hidden @[46px]:flex flex-col w-full h-full justify-between items-center relative pt-1.5 pb-0.5">
                {/* Chip Body Core */}
                <div className="flex-1 flex flex-col items-center justify-center text-center px-0.5 z-10 w-full min-h-0 overflow-hidden">
                  {/* Level Badge */}
                  <div
                    className="text-[7.5px] sm:text-[8.5px] font-bold tracking-tight px-1 py-0.2 rounded-none font-mono uppercase leading-none mb-0.5"
                    style={{
                      color: def.borderColor,
                      textShadow: `0 0 5px ${def.glowColor}`,
                    }}
                  >
                    {isSupercomputer ? '★ SUPER ★' : `Chip.${level}`}
                  </div>

                  {/* Chip Code Silkscreen */}
                  <div className="text-[8.5px] sm:text-[9.5px] font-black tracking-tight text-white font-mono leading-none truncate max-w-full">
                    {def.code}
                  </div>

                  {/* Micro Subtitle / Short Name */}
                  {showDetails && size !== 'compact' && (
                    <div className="text-[6.5px] sm:text-[7.5px] text-white/80 font-sans tracking-tighter truncate max-w-full mt-0.5 leading-none">
                      {def.shortName || def.name.split(' ')[0]}
                    </div>
                  )}
                </div>

                {/* Bottom Silkscreen bar */}
                <div className="w-full px-1 pb-0.5 flex items-center justify-between text-[6px] sm:text-[6.5px] text-white/40 font-mono leading-none">
                  <span>{def.pins}P</span>
                  <span>{def.year}</span>
                </div>
              </div>
            </>
          )}

          {/* Merge Shockwave Glow */}
          {isMerging && (
            <div
              className="absolute inset-0 bg-white/40 animate-ping rounded-none pointer-events-none"
              style={{ animationDuration: '0.4s' }}
            />
          )}
        </div>

        {/* 2. 左右兩排外伸針腳 (Right Side: 3px dots in micro mode, 30% embedded, 4 bars in normal mode) */}
        <div className="absolute -right-[2.1px] @[46px]:-right-[5px] top-[14%] bottom-[14%] flex flex-col justify-evenly items-center pointer-events-none z-20">
          {numberOnly ? (
            [0, 1, 2, 3].map((i) => (
              <div
                key={`dot-r-${i}`}
                className="w-[3px] h-[3px] rounded-full bg-gradient-to-l from-amber-200 via-slate-100 to-amber-300 border-[0.5px] border-slate-900 shadow-[0_0_1.5px_rgba(251,191,36,0.6)]"
              />
            ))
          ) : (
            <>
              {/* Auto-responsive micro (<46px): 4 dots embedded 30% into chip edge */}
              <div className="flex @[46px]:hidden flex-col justify-evenly items-center w-full h-full">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={`c-dot-r-${i}`}
                    className="w-[3px] h-[3px] rounded-full bg-gradient-to-l from-amber-200 via-slate-100 to-amber-300 border-[0.5px] border-slate-900 shadow-[0_0_1.5px_rgba(251,191,36,0.6)]"
                  />
                ))}
              </div>

              {/* Normal mode (>=46px): 4 metallic extended bars */}
              <div className="hidden @[46px]:flex flex-col justify-evenly items-start w-full h-full">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={`pin-r-${i}`}
                    className="w-1.5 sm:w-2 h-1 sm:h-1.5 rounded-none bg-gradient-to-l from-slate-300 via-amber-200 to-slate-400 border-t border-b border-r border-slate-800 shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Push Directional Arrows: Flashing Pale Pink Bold Arrow with Stem (↑, ↓, ←, →) */}
      {pushableDirections.map((dir) => {
        let posClass = '';
        let svgPath = '';
        if (dir === 'UP') {
          posClass = '-top-2.5 left-1/2 -translate-x-1/2';
          svgPath = 'M8 2 L13.5 7.5 L10 7.5 L10 14 L6 14 L6 7.5 L2.5 7.5 Z';
        } else if (dir === 'DOWN') {
          posClass = '-bottom-2.5 left-1/2 -translate-x-1/2';
          svgPath = 'M8 14 L2.5 8.5 L6 8.5 L6 2 L10 2 L10 8.5 L13.5 8.5 Z';
        } else if (dir === 'LEFT') {
          posClass = '-left-2.5 top-1/2 -translate-y-1/2';
          svgPath = 'M2 8 L7.5 2.5 L7.5 6 L14 6 L14 10 L7.5 10 L7.5 13.5 Z';
        } else if (dir === 'RIGHT') {
          posClass = '-right-2.5 top-1/2 -translate-y-1/2';
          svgPath = 'M14 8 L8.5 2.5 L8.5 6 L2 6 L2 10 L8.5 10 L8.5 13.5 Z';
        }

        return (
          <button
            key={`push-${dir}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDirectPush?.(dir);
            }}
            title={`向${dir === 'UP' ? '上' : dir === 'DOWN' ? '下' : dir === 'LEFT' ? '左' : '右'}推動`}
            className={`absolute ${posClass} z-30 p-0.5 bg-transparent border-none outline-none flex items-center justify-center cursor-pointer animate-pulse transition-transform hover:scale-125 focus:outline-none`}
          >
            <svg
              viewBox="0 0 16 16"
              className="w-4 h-4 text-pink-300 hover:text-pink-200 fill-current filter drop-shadow-[0_0_6px_rgba(244,114,182,0.95)] drop-shadow-[0_0_10px_rgba(244,114,182,0.6)] pointer-events-none"
            >
              <path d={svgPath} />
            </svg>
          </button>
        );
      })}
    </div>
  );
};
