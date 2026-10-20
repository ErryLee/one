import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const cacheDir = path.join(root, 'node_modules', '.cache', 'gh-pages');

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    ...options,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log('1/3 build...');
run('npm', ['run', 'build']);

console.log('2/3 clean gh-pages cache...');
fs.rmSync(cacheDir, { recursive: true, force: true });

if (!fs.existsSync(dist)) {
  console.error('dist/ 不存在，构建失败');
  process.exit(1);
}

console.log('3/3 publish to gh-pages (force, no history)...');
// --no-history: 强制以新历史推送，避免本地/远端分支残留状态干扰
run('npx', ['gh-pages', '-d', 'dist', '--nojekyll', '--no-history']);

console.log('\n部署完成。到 GitHub Settings → Pages 确认 Source 为 gh-pages 分支。');
console.log('页面地址通常是: https://ErryLee.github.io/one/');
