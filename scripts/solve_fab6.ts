import fs from 'fs';
import { calculatePush, findPathBFS, isWalkable, getDirectionDelta } from '../src/utils/gameLogic';
import { Direction } from '../src/types/game';

const raw = JSON.parse(fs.readFileSync('public/assets/aistudio/fab6_9dac5fdc.json', 'utf8'));

interface State {
  player: { x: number; y: number };
  chips: { id: string; x: number; y: number; level: number }[];
  steps: any[];
}

function hashChips(chips: any[]) {
  return [...chips].sort((a: any, b: any) => a.x - b.x || a.y - b.y || a.level - b.level).map((c: any) => `${c.x},${c.y},${c.level}`).join('|');
}

const initialChips = raw.chips.map((c: any, i: number) => ({ id: 'c'+i, x: c.x, y: c.y, level: c.level }));
let beam: State[] = [{ player: raw.playerStart, chips: initialChips, steps: [] }];
const visited = new Set<string>();
visited.add(hashChips(initialChips));

const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
const { width, height, grid, targetLevel, wraparound, wormholes } = raw;

console.log('Searching for Fab.6 solution...');

for (let step = 1; step <= 35; step++) {
  const nextCandidates: State[] = [];
  let minChips = 24;

  for (const st of beam) {
    if (st.chips.length < minChips) minChips = st.chips.length;

    if (st.chips.length === 1 && st.chips[0].level === targetLevel) {
      console.log('FOUND SOLUTION in', st.steps.length, 'steps!');
      console.log(JSON.stringify(st.steps, null, 2));
      fs.writeFileSync('fab6_solution.json', JSON.stringify(st.steps, null, 2));
      process.exit(0);
    }

    const currentChipsForWalk = st.chips.map(c => ({ ...c }));
    for (const chip of st.chips) {
      for (const dir of directions) {
        const { dx, dy } = getDirectionDelta(dir);
        let standX = chip.x - dx;
        let standY = chip.y - dy;
        if (wraparound) {
          standX = ((standX % width) + width) % width;
          standY = ((standY % height) + height) % height;
        } else {
          if (standX < 0 || standX >= width || standY < 0 || standY >= height) continue;
        }

        if (!isWalkable(grid, standX, standY, currentChipsForWalk, wraparound)) continue;
        const path = findPathBFS(grid, st.player, { x: standX, y: standY }, currentChipsForWalk, wraparound);
        if (!path) continue;

        const pushRes = calculatePush(grid, currentChipsForWalk, { id: chip.id, x: chip.x, y: chip.y, level: chip.level }, dir, wraparound, wormholes);
        if (!pushRes.canPush || !pushRes.moved) continue;

        let nextChips;
        if (pushRes.merged && pushRes.targetChipId) {
          const target = st.chips.find((c: any) => c.id === pushRes.targetChipId);
          if (!target) continue;
          nextChips = st.chips.filter((c: any) => c.id !== chip.id).map((c: any) => c.id === target.id ? { ...c, level: c.level + 1 } : { ...c });
        } else {
          nextChips = st.chips.map((c: any) => c.id === chip.id ? { ...c, x: pushRes.finalX, y: pushRes.finalY } : { ...c });
        }

        const h = hashChips(nextChips);
        if (visited.has(h)) continue;
        visited.add(h);

        nextCandidates.push({
          player: { x: standX, y: standY },
          chips: nextChips,
          steps: [
            ...st.steps,
            {
              standX,
              standY,
              dir,
              chipX: chip.x,
              chipY: chip.y,
              chipLevel: chip.level,
              merged: Boolean(pushRes.merged),
            }
          ]
        });
      }
    }
  }

  nextCandidates.sort((a, b) => a.chips.length - b.chips.length || a.steps.length - b.steps.length);
  beam = nextCandidates.slice(0, 2000);
  console.log(`Step ${step}: min chips = ${minChips}, pool = ${beam.length}`);
}
console.log('No solution found.');
