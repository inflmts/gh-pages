import { execFileSync } from 'child_process';
import fs from 'fs';
import { join } from 'path';

function exec(command, args, options) {
  const capture = options?.capture ?? false;
  const input = options?.input;
  return execFileSync(command, args, {
    stdio: [
      input !== undefined ? 'pipe' : 'inherit',
      capture ? 'pipe' : 'inherit',
      'inherit'
    ],
    input,
    encoding: 'utf8'
  });
}

function createGit(dir) {
  const prefix = ['-C', dir, '--git-dir=.gh-pages-git', '--work-tree=.'];
  return (args, options) => exec('git', [...prefix, ...args], options);
}

export function deploy(dir, options) {
  const paths = options?.paths ?? ['.'];
  const targetRemote = options?.remote ?? 'origin';
  let targetRemoteUrl = options?.remoteUrl;
  const targetBranch = options?.branch ?? 'gh-pages';
  let message = options?.message;
  const dry = options?.dry ?? false;
  const jekyll = options?.jekyll ?? false;
  const cname = options?.cname;

  if (targetRemoteUrl === undefined)
    targetRemoteUrl = exec('git', ['remote', 'get-url', '--push', targetRemote], { capture: true }).trim();

  // generate message from `git describe --always` if none was specified
  if (message === undefined) {
    const version = exec('git', ['describe', '--always'], { capture: true }).trim();
    message = `Update to ${version}`;
  }

  const git = createGit(dir);
  const gitDir = join(dir, '.gh-pages-git');
  const updateIndexArgs = [];

  fs.rmSync(gitDir, { force: true, recursive: true });
  git(['init', '-q', '-b', targetBranch]);
  git(['add', '--force', '--', ...paths, ':!:.gh-pages-git']);

  if (!jekyll) {
    const id = git(['hash-object', '-w', '/dev/null'], { capture: true }).trim();
    updateIndexArgs.push('--cacheinfo', `100644,${id},.nojekyll`);
  }

  if (cname !== undefined) {
    const id = git(['hash-object', '-w', '--stdin'], { input: cname, capture: true }).trim();
    updateIndexArgs.push('--cacheinfo', `100644,${id},CNAME`);
  }

  if (updateIndexArgs.length)
    git(['update-index', '--add', ...updateIndexArgs]);

  git(['commit', '-m', message]);
  git(['push', ...(dry ? ['-n'] : []), '--force', targetRemoteUrl, targetBranch]);
}
