import { execFileSync } from 'child_process';
import fs from 'fs';
import { join } from 'path';

function getOutput(command, ...args) {
  return execFileSync(command, args, {
    stdio: ['inherit', 'pipe', 'inherit'],
    encoding: 'utf8'
  });
}

function createGit(dir, gitDir) {
  const prefix = [`--git-dir=${gitDir}`, `--work-tree=${dir}`];
  return function git(...args) {
    execFileSync('git', [...prefix, ...args], { stdio: 'inherit' });
  };
}

export function deploy(dir, options) {
  let targetRemote = options?.remote;
  let targetBranch = options?.branch ?? 'gh-pages';
  let message = options?.message;
  let dry = options?.dry ?? false;

  if (targetRemote === undefined) {
    targetRemote = getOutput('git', 'remote', 'get-url', '--push', 'origin').trim();
  }

  if (message === undefined) {
    message = `Update to ${getOutput('git', 'describe', '--always').trim()}`;
  }

  const gitDir = join(dir, '.gh-pages-git');
  const git = createGit(dir, gitDir);

  fs.rmSync(gitDir, { force: true, recursive: true });
  git('init', '-q', '-b', targetBranch);
  git('add', '--force', ':/:', ':!/:.gh-pages-git');
  git('commit', '-m', message);

  if (dry) {
    git('push', '-n', '--force', targetRemote, targetBranch);
  } else {
    git('push', '--force', targetRemote, targetBranch);
  }
}
