# gh-pages

Publish a static site to GitHub Pages.

This is similar in scope to the [gh-pages](https://npmjs.com/package/gh-pages)
package, but with several limitations:

- The resulting branch always has a single commit without history. Each
  invocation initializes a new, empty repository which is then filled with the
  files to publish.

- The entire directory is published. No filtering of files is currently
  possible.

The Git repository is created directly in the specified directory, which
removes the need for a copying step. This is most appropriate for when the
directory is the output of a build tool.


## Usage

```
gh-pages [options] <dir>
```

This creates a Git repository in the specified directory, adds everything,
creates a commit, and force-pushes to the `gh-pages` branch on the `origin`
remote. These can be changed using options.

**Options:**

- `-r, --remote <url>`

  The remote to push to. By default, uses the `origin` remote of the current
  repository as returned by `git remote get-url --push origin`.

- `-b, --branch <name>`

  The branch name to use. The default is `gh-pages`.

- `-m, --message <message>`

  The commit message. The default is `Update to <tag>`, where `<tag>` is the
  output of `git describe --always`.

- `-n, --dry-run`

  Pass the `-n` option to `git push`. This simulates a push without actually
  sending the updates.

## API

Note that the entire operation is synchronous.

```js
import { deploy } from '@inflmts/gh-pages';

// use the defaults
deploy(dir);

// specify options
deploy(dir, {
  remote: string,
  branch: string,
  message: string,
  dry: boolean
});
```
