const hljs = require('highlight.js');
const path = require('path');
const fs = require('fs');
const os = require('os');

const marked = require('marked');

marked.use({
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  mangle: false,
  headerIds: true
});

function safe(fn) {
  try {
    fn();
  } catch (e) {
  }
}
var css = '';
safe(__ => css = fs.readFileSync(path.join(__dirname, '../vendor/github-light.css'), 'utf-8'));

function html(content) {
  return `
  <html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>${css}</style>
    <style>
    body { padding: 10px; margin: 10px; margin: 0 auto; max-width: 880px; }

    </style>
  </head>
  <body>
  ${content}
  </body>
  </html>
  `
}


module.exports = async function({cwd, name}) {
  var filepath = '';
  if (name.charAt(0) === '/') filepath = name;
  else filepath = path.join(cwd, name);

  var content;

  safe(__ => content = fs.readFileSync(filepath, 'utf-8'));

  if (!content) {
    console.log(`${filepath} not exists or the file is empty`);
    return;
  }
  var tempdir = os.tmpdir();
  var text = marked.parse(content);
  var tmpfilename = path.basename(name) + ".html";
  var abspath = path.join(tempdir, tmpfilename);
  fs.writeFileSync(abspath, html(text), 'utf-8');
  require('child_process').exec(`open ${abspath}`);
}
