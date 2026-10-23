# Tests

Markdown fixtures for verifying `mdcat` rendering, especially image references with **relative paths**.

- `basic-images.md` — images in a sibling `images/` folder, `./` prefixes, titles, linked images.
- `mixed-content.md` — images mixed with headings, code, tables, blockquotes, lists, raw HTML.
- `nested/relative-parent.md` — images referenced from a subfolder via `../`.
- `broken-refs.md` — missing files, case mismatches, bad traversal (error handling).
- `images/` — shared image assets (generated PNGs + one SVG).

Run with:

```bash
node bin/mdcat tests/basic-images.md
```

Note: the rendered HTML is written to `os.tmpdir()`, so relative image `src` values resolve
against the temp directory, not the markdown file's folder. These fixtures expose that
behavior (useful when adding path-rewriting support).
