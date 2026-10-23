# AGENTS.md

## Project Overview

mdcat is a simple markdown preview CLI tool. It converts a markdown file to HTML, writes it to a temp file, and opens it in the default browser. Written in Node.js (CommonJS), with no build step.

## Commands

- Install dependencies: `npm install`
- Run the CLI locally: `node bin/mdcat <file.md>` (e.g. `node bin/mdcat readme.md`)
- Install globally: `npm install mdcat -g`, then `mdcat <file.md>`

There are no test, lint, or build scripts configured in this repo. To verify changes, run the CLI on a markdown file (e.g. `node bin/mdcat readme.md`) and check that the HTML preview opens in the browser.

## Architecture

- `bin/mdcat` — CLI entry point. Parses args with commander, resolves the target file relative to `cwd`, and calls the renderer from `lib/index.js`.
- `lib/index.js` — Core logic. Configures `marked` (GFM + tables) with an hljs code-highlighting renderer, rewrites relative image `src` to absolute `file://` URLs (based on the markdown file's dir, since the HTML lives in `os.tmpdir()`), wraps output in `<div class="markdown-body">` with inlined vendor + hljs CSS, writes to `os.tmpdir()`, and opens it via `open` (macOS only).
- `vendor/` — Vendored CSS (`github-light.css`, `typo.css`) inlined into the generated HTML.
- Dependencies: `commander` (CLI), `marked` (markdown parsing), `highlight.js` (syntax highlighting).

## Conventions

- CommonJS (`require`/`module.exports`), no TypeScript, no transpilation.
- Keep the codebase minimal; this project intentionally has no framework or bundler.
- Note: `lib/index.js` uses `open` (macOS). If adding cross-platform support, use a platform check or a portable open library.
- When changing CLI behavior, update `readme.md` usage examples accordingly.
- Version bumps: update `version` in `package.json` (the CLI reads it for `--version`).
