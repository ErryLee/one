import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
// 可在命令前设置：CF_PAGES_PROJECT=my-shop npm run deploy:cf
const projectName = process.env.CF_PAGES_PROJECT || 'shopping-demo';

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log('1/2 build...');
run('npm', ['run', 'build']);

if (!fs.existsSync(dist)) {
  console.error('dist/ 不存在，构建失败');
  process.exit(1);
}

console.log(`2/2 deploy to Cloudflare Pages (project: ${projectName})...`);
run('npx', [
  'wrangler',
  'pages',
  'deploy',
  'dist',
  `--project-name=${projectName}`,
]);
