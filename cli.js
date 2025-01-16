#!/usr/bin/env node

import { program } from 'commander';
import { deploy } from './index.js';

program
  .name('gh-pages')
  .description('Publish a static site to GitHub Pages')
  .option('-r, --remote <remote>', 'remote to push to [default: origin]')
  .option('-b, --branch <branch>', 'branch name [default: gh-pages]')
  .option('-m, --message <message>', 'commit message')
  .option('-n, --dry', 'pass -n to git push')
  .option('-c, --cname <domain>', 'write custom domain to CNAME')
  .option('--jekyll', 'do not write .nojekyll')
  .argument('<dir>', 'directory to publish')
  .argument('[paths...]', 'select files to publish')
  .allowExcessArguments(false)
  .action(main)
  .parse();

function main(dir, paths, opts) {
  deploy(dir, {
    paths: paths.length ? paths : undefined,
    remote: opts.remote,
    branch: opts.branch,
    message: opts.message,
    dry: opts.dry,
    cname: opts.cname,
    jekyll: opts.jekyll
  });
}
