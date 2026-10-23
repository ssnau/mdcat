const hljs = require('highlight.js');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { pathToFileURL } = require('url');

const marked = require('marked');

function safe(fn) {
  try {
    fn();
  } catch (e) {
  }
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

var css = '';
safe(__ => css = fs.readFileSync(path.join(__dirname, '../vendor/github-light.css'), 'utf-8'));

var hljsCss = '';
safe(__ => hljsCss = fs.readFileSync(require.resolve('highlight.js/styles/github.css'), 'utf-8'));

marked.use({
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  renderer: {
    code(code, infostring) {
      var lang = (infostring || '').trim().split(/\s+/)[0];
      if (lang && hljs.getLanguage(lang)) {
        try {
          return '<pre><code class="hljs language-' + lang + '">' +
            hljs.highlight(code, { language: lang, ignoreIllegals: true }).value +
            '</code></pre>';
        } catch (e) {
        }
      }
      return '<pre><code class="hljs">' + escapeHtml(code) + '</code></pre>';
    }
  }
});

var URL_SCHEME = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;

function resolveImgSrc(src, baseDir) {
  var c = (src || '').trim();
  if (!c || c.charAt(0) === '#' || c.indexOf('//') === 0 || c.charAt(0) === '/' || URL_SCHEME.test(c)) {
    return c;
  }
  var decoded;
  try {
    decoded = decodeURIComponent(c);
  } catch (e) {
    decoded = c;
  }
  return pathToFileURL(path.resolve(baseDir, decoded)).href;
}

// the preview html lives in os.tmpdir(), so relative image paths must be
// rewritten to absolute file:// urls based on the markdown file's folder.
function localizeImages(html, baseDir) {
  return html.replace(/(<img\b[^>]*?\ssrc\s*=\s*)(["'])([^"']*)\2/gi, function (m, open, quote, src) {
    return open + quote + resolveImgSrc(src, baseDir) + quote;
  });
}

function html(content) {
  return `
  <html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>${css}</style>
    <style>${hljsCss}</style>
    <style>
    body { padding: 32px 16px; margin: 0 auto; max-width: 980px; }
    </style>
  </head>
  <body>
  <div class="markdown-body">
  ${content}
  </div>
  </body>
  </html>
  `
}


module.exports = async function({cwd, name}) {
  var filepath = '';
  if (path.isAbsolute(name)) filepath = name;
  else filepath = path.join(cwd, name);

  var content;

  safe(__ => content = fs.readFileSync(filepath, 'utf-8'));

  if (!content) {
    console.log(`${filepath} not exists or the file is empty`);
    return;
  }
  var tempdir = os.tmpdir();
  var text = localizeImages(marked.parse(content), path.dirname(filepath));
  var tmpfilename = path.basename(name) + ".html";
  var abspath = path.join(tempdir, tmpfilename);
  fs.writeFileSync(abspath, html(text), 'utf-8');
  require('child_process').execFile('open', [abspath]);
}
