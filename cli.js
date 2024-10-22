#!/usr/bin/env node

import { program } from 'commander';
import { deploy } from './index.js';

program
  .name('gh-pages')
  .description('Publish a static site to GitHub Pages')
  .option('-r, --remote <url>', 'target remote')
  .option('-b, --branch <branch>', 'target branch')
  .option('-m, --message <message>', 'commit message')
  .option('-n, --dry-run', 'pass the -n option to git push')
  .argument('<dir>', 'directory to publish')
  .allowExcessArguments(false)
  .action(main)
  .parse();

function main(dir, opts) {
  deploy(dir, {
    remote: opts.remote,
    branch: opts.branch,
    message: opts.message,
    dry: opts.dryRun
  });
}
