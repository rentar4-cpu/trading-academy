import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const exportRoot = join(projectRoot, 'mentavio-landing', 'out');
const publicRoot = join(projectRoot, 'public');
const landingTarget = join(publicRoot, 'landing');
const nextAssetsTarget = join(publicRoot, '_next');
const exportedNextAssets = join(exportRoot, '_next');

if (!existsSync(join(exportRoot, 'index.html')) || !existsSync(exportedNextAssets)) {
  throw new Error('Mentario landing export is incomplete.');
}

rmSync(landingTarget, { force: true, recursive: true });
rmSync(nextAssetsTarget, { force: true, recursive: true });
mkdirSync(landingTarget, { recursive: true });

cpSync(exportRoot, landingTarget, {
  filter: (source) => source !== exportedNextAssets,
  recursive: true,
});
cpSync(exportedNextAssets, nextAssetsTarget, { recursive: true });

console.log('Mentario landing copied into the web and Android application.');
