import { fileURLToPath } from 'url';
import path, { dirname } from 'node:path';
import { bundle } from '@remotion/bundler';

const fileName = fileURLToPath(import.meta.url);
const dirName = dirname(fileName);

async function main() {
  const entryPoint = path.resolve(dirName, 'index.ts');
  const outDir = path.resolve(dirName, 'bundle');
  const bundleLocation = await bundle({
    entryPoint,
    outDir,
  });
  console.log('Bundle location', bundleLocation);
}

main();
