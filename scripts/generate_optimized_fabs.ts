import { LEVELS } from '../src/data/levels';
import { runCoulombReverseFission } from './coulomb_optimizer';
import * as fs from 'fs';

const targetSpotsMap: Record<number, { x: number; y: number }[]> = {
  1: [{ x: 7, y: 7 }, { x: 5, y: 7 }, { x: 9, y: 7 }, { x: 7, y: 5 }, { x: 7, y: 9 }],
  2: [{ x: 7, y: 7 }, { x: 5, y: 5 }, { x: 9, y: 9 }, { x: 5, y: 9 }, { x: 9, y: 5 }],
  3: [
    { x: 7, y: 7 }, { x: 5, y: 5 }, { x: 9, y: 9 }, { x: 5, y: 9 }, { x: 9, y: 5 },
    { x: 7, y: 4 }, { x: 7, y: 10 }, { x: 3, y: 7 }, { x: 11, y: 7 }
  ],
  5: [
    { x: 7, y: 7 }, { x: 6, y: 6 }, { x: 8, y: 8 }, { x: 6, y: 8 }, { x: 8, y: 6 },
    { x: 7, y: 5 }, { x: 7, y: 9 }, { x: 5, y: 7 }, { x: 9, y: 7 }
  ]
};

async function main() {
  const optimizedData: Record<number, any> = {};

  for (const fab of [1, 2, 3, 5]) {
    const l = LEVELS.find(lvl => lvl.chapter === 0 && lvl.fabIndex === fab)!;
    console.log(`\n========================================`);
    console.log(`Generating optimal Coulomb layout for Fab.${fab}: ${l.title}...`);
    const candidateCenters = targetSpotsMap[fab];
    let best = null;

    for (let roundBatch = 0; roundBatch < 20; roundBatch++) {
      const res = runCoulombReverseFission(
        l.grid,
        l.wormholes,
        l.wraparound,
        l.targetLevel,
        20,
        candidateCenters,
        25
      );
      if (res) {
        if (
          !best ||
          (res.minDistance >= 1.4 && best.minDistance < 1.4) ||
          (res.minDistance >= 1.99 && best.minDistance < 1.99) ||
          (res.minDistance >= best.minDistance && res.coulombEnergy < best.coulombEnergy)
        ) {
          best = res;
          console.log(`Batch ${roundBatch}: best minDist=${best.minDistance.toFixed(2)}, energy=${best.coulombEnergy.toFixed(3)}, avgDist=${best.avgDistance.toFixed(2)}`);
          if (best.minDistance >= 2.0 && best.coulombEnergy <= 8.5) {
            break;
          }
        }
      }
    }

    if (!best) {
      throw new Error(`Failed to optimize Fab.${fab}`);
    }

    console.log(`>>> Fab.${fab} FINAL: MinDist=${best.minDistance.toFixed(2)}, Energy=${best.coulombEnergy.toFixed(3)}, AvgDist=${best.avgDistance.toFixed(2)}`);
    optimizedData[fab] = {
      chips: best.chips,
      solutionSteps: best.solutionSteps,
      playerStart: best.playerStart,
      parMoves: best.solutionSteps.length,
      coulombEnergy: best.coulombEnergy,
      minDistance: best.minDistance,
      avgDistance: best.avgDistance
    };
  }

  fs.writeFileSync('./scripts/optimized_fabs.json', JSON.stringify(optimizedData, null, 2));
  console.log('\nAll 4 Fabs successfully optimized and written to scripts/optimized_fabs.json!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
