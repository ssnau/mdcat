import hljs from "highlight.js";
import path from "path";
import fs from "fs";
import osTmpdir from 'os-tmpdir';

var marked = require('marked');
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

function safe(fn) {
  try {
    fn();
  } catch (e) {
  }
}
var css = '';
safe(__ => css = fs.readFileSync(path.join(__dirname, '../vendor/typo.css'), 'utf-8'));

function html(content) {
  return `
  <html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>${css}</style>
    <style>
    body { padding: 10px; margin: 10px; }

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
  var tempdir = osTmpdir();
  var text = marked(content); // hljs.highlight('markdown', marked(content)).value
  var tmpfilename = path.basename(name) + ".html";
  var abspath = path.join(tempdir, tmpfilename);
  fs.writeFileSync(abspath, html(text), 'utf-8');
  require('child_process').exec(`open ${abspath}`);
}
