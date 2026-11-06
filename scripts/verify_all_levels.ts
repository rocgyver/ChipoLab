import { LEVELS } from '../src/data/levels';
import { calculatePush, getDirectionDelta } from '../src/utils/gameLogic';

console.log(`Verifying all ${LEVELS.length} levels in src/data/levels.ts...`);

let allPassed = true;

for (const level of LEVELS) {
  if (level.id === 0) continue; // Fab.0

  if (!level.solutionSteps || level.solutionSteps.length === 0) {
    console.error(`❌ Level ${level.id} (${level.title}) has NO solutionSteps!`);
    allPassed = false;
    continue;
  }

  let currentChips = level.chips.map((c, i) => ({
    id: `chip-${i}`,
    x: c.x,
    y: c.y,
    level: c.level,
  }));

  for (let s = 0; s < level.solutionSteps.length; s++) {
    const step = level.solutionSteps[s];
    const { dx, dy } = getDirectionDelta(step.dir);
    const targetX = level.wraparound
      ? ((step.standX + dx) % level.width + level.width) % level.width
      : step.standX + dx;
    const targetY = level.wraparound
      ? ((step.standY + dy) % level.height + level.height) % level.height
      : step.standY + dy;

    const frontChip = currentChips.find((c) => c.x === targetX && c.y === targetY);
    if (!frontChip) {
      console.error(
        `❌ Level ${level.id} Step ${s + 1}: No chip in front of Einstein at stand (${step.standX}, ${step.standY}) pushing ${step.dir}! Expected chip at (${targetX}, ${targetY})`
      );
      allPassed = false;
      break;
    }

    const pushRes = calculatePush(
      level.grid,
      currentChips,
      frontChip,
      step.dir,
      level.wraparound ?? false,
      level.wormholes
    );

    if (!pushRes.canPush || !pushRes.moved) {
      console.error(`❌ Level ${level.id} Step ${s + 1}: Chip cannot be pushed!`);
      allPassed = false;
      break;
    }

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

  // Check victory condition
  if (currentChips.length === 1 && currentChips[0].level === level.targetLevel) {
    console.log(
      `✅ Level ${level.id} [${level.chapterName} - ${level.title}]: Solved! (${level.chips.length} chips -> 1 Chip.${level.targetLevel} in ${level.solutionSteps.length} moves)`
    );
  } else {
    console.error(
      `❌ Level ${level.id} failed victory check! Remaining chips: ${JSON.stringify(currentChips)}, targetLevel: ${level.targetLevel}`
    );
    allPassed = false;
  }
}

if (allPassed) {
  console.log('\n🎉 ALL 24 LEVELS 100% VERIFIED AND PASS COMPLETE PHYSICAL SIMULATION!');
} else {
  console.error('\n⚠️ Some levels failed verification.');
  process.exit(1);
}
