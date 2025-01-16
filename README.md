# gh-pages

Publish a static site to GitHub Pages.

This is similar in scope to the [gh-pages](https://npmjs.com/package/gh-pages)
package, but with some limitations:

- The resulting branch always has a single commit without history. Each
  invocation initializes a new, empty repository which is then filled with the
  files to publish.

The Git repository is created directly in the specified directory, which
removes the need for a copying step. This is most appropriate for the output of
build tools like [Vite](https://vite.dev).


## Usage

```
gh-pages [options] <dir> [paths...]
```

This does the following:

- Create a Git repository in the specified directory
- Add everything to the repository, or just the specified paths
- Commit
- Optionally create a `CNAME` file
- Create a `.nojekyll` file unless disabled
- Force-push to the `gh-pages` branch of the `origin` remote

**Arguments:**

- `<dir>`

  The directory to publish. The repository is created directly in this
  directory.

- `[paths...]`

  The files to publish. This is passed directly to `git add`, so the full
  pathspec syntax is supported. If not specified, all files in the directory are
  published.

**Options:**

- `-r, --remote <remote>`

  The remote to push to. The default is `origin`.

- `-b, --branch <name>`

  The branch to push to. The default is `gh-pages`.

- `-m, --message <message>`

  The commit message. The default is `Update to <tag>`, where `<tag>` is the
  output of `git describe --always`.

- `-n, --dry`

  Pass the `-n` option to `git push`. This simulates a push without actually
  sending the updates.

- `-c, --cname <domain>`

  Write a custom domain to the `CNAME` file.

- `--jekyll`

  Disable the `.nojekyll` file. By default, this file is created automatically.

## API

The API is **not** stable. Use the CLI instead.

Currently, only a synchronous function exists.

```js
import { deploy } from '@inflmts/gh-pages';

// use the defaults
deploy(dir);

// specify options
deploy(dir, {
  paths: string[],
  remote: string,
  branch: string,
  message: string,
  dry: boolean,
  cname: string,
  jekyll: boolean
});
```
