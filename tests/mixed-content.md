# Mixed Content with Relative Images

A general rendering test: headings, text, code, a table, a blockquote, a list, and images with relative paths.

## Paragraph with inline image

Here is an inline logo ![inline logo](images/logo.svg) inside a sentence, followed by a standalone one:

![Standalone green](images/green.png)

## Code block

```js
const path = require('path');
const img = path.join(__dirname, 'images', 'red.png'); // relative path resolved to absolute
console.log(img);
```

## Table

| Image | Reference | Status |
|-------|-----------|--------|
| Red   | `images/red.png` | ok |
| Green | `images/green.png` | ok |
| Blue  | `images/blue.png` | ok |

## Blockquote

> A quoted truth, with evidence: ![evidence](images/blue.png)

## List

1. First ![one](images/red.png)
2. Second ![two](images/green.png)
3. Third ![three](images/blue.png)

## HTML image tag (raw)

<p><img src="images/logo.svg" alt="raw html logo" width="64"></p>
