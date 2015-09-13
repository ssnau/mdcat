"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _highlightJs = require("highlight.js");

var _highlightJs2 = _interopRequireDefault(_highlightJs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _osTmpdir = require('os-tmpdir');

var _osTmpdir2 = _interopRequireDefault(_osTmpdir);

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
  } catch (e) {}
}
var css = '';
safe(function (__) {
  return css = _fs2["default"].readFileSync(_path2["default"].join(__dirname, '../vendor/typo.css'), 'utf-8');
});

function html(content) {
  return "\n  <html>\n  <head>\n    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n    <style>" + css + "</style>\n    <style>\n    body { padding: 10px; margin: 10px; }\n\n    </style>\n  </head>\n  <body>\n  " + content + "\n  </body>\n  </html>\n  ";
}

module.exports = function callee$0$0(_ref) {
  var cwd = _ref.cwd;
  var name = _ref.name;
  var filepath, content, tempdir, text, tmpfilename, abspath;
  return regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        filepath = '';

        if (name.charAt(0) === '/') filepath = name;else filepath = _path2["default"].join(cwd, name);

        safe(function (__) {
          return content = _fs2["default"].readFileSync(filepath, 'utf-8');
        });

        if (content) {
          context$1$0.next = 6;
          break;
        }

        console.log(filepath + " not exists or the file is empty");
        return context$1$0.abrupt("return");

      case 6:
        tempdir = (0, _osTmpdir2["default"])();
        text = marked(content);
        tmpfilename = _path2["default"].basename(name) + ".html";
        abspath = _path2["default"].join(tempdir, tmpfilename);

        _fs2["default"].writeFileSync(abspath, html(text), 'utf-8');
        require('child_process').exec("open " + abspath);

      case 12:
      case "end":
        return context$1$0.stop();
    }
  }, null, this);
};
// hljs.highlight('markdown', marked(content)).value