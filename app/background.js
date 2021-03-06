/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("fs-jetpack");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = {"name":"production","description":"Add here any environment specific stuff you like."}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _path = _interopRequireDefault(__webpack_require__(4));

var _url = _interopRequireDefault(__webpack_require__(5));

var _electron = __webpack_require__(0);

var _dev_menu_template = __webpack_require__(6);

var _edit_menu_template = __webpack_require__(7);

var _window = _interopRequireDefault(__webpack_require__(8));

var _testInsert = _interopRequireDefault(__webpack_require__(9));

var _env = _interopRequireDefault(__webpack_require__(2));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.
// import './static/style.css' as mainCSSStyle;
// import './static/assets/css/share.min.css' as mainCSSShare;
// import './static/assets/js/pangu.min.js' as mainJS;
// import './static/assets/js/social-share.min.js' as mainJSShare;
// 
// Special module holding environment variables which you declared
// in config/env_xxx.json file.
const staticFiles = ['style.css', 'assets/css/share.min.css', 'assets/js/social-share.min.js', 'assets/js/pangu.min.js'];

const setApplicationMenu = () => {
  const menus = [_edit_menu_template.editMenuTemplate];

  if (_env.default.name !== "production") {
    menus.push(_dev_menu_template.devMenuTemplate);
  }

  _electron.Menu.setApplicationMenu(_electron.Menu.buildFromTemplate(menus));
}; // Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.


if (_env.default.name !== "production") {
  const userDataPath = _electron.app.getPath("userData");

  _electron.app.setPath("userData", `${userDataPath} (${_env.default.name})`);
}

_electron.app.on("ready", () => {
  setApplicationMenu();
  const mainWindow = (0, _window.default)("main", {
    width: 1000,
    height: 600
  });
  mainWindow.loadURL(_url.default.format({
    pathname: _path.default.join(__dirname, 'static', "index.html"),
    protocol: "file:",
    slashes: true
  }));

  if (_env.default.name === "development") {
    mainWindow.openDevTools();
  } // const reloadFilter = {
  //   urls: staticFiles.map(e => 'file://' + path.join(__dirname, 'static', e))
  // };


  const filter = {
    urls: staticFiles.map(e => 'file:///static/' + e)
  }; // console.log(filter.urls);

  _electron.session.defaultSession.webRequest.onBeforeRequest(filter, (details, callback) => {
    // console.log("Captured! This is: " , details);
    callback({
      cancel: false,
      redirectURL: details.url.replace('/static/', _path.default.join(__dirname, 'static') + '/')
    });
  });

  mainWindow.webContents.on('will-navigate', (e, u) => {
    e.preventDefault(); // console.log('Web content will navigate to: ', u);
    // console.log('The folder structure is: ', path.join(__dirname, 'static', 'index.html'));

    if (u.startsWith('file:///static/') && u.length > 15 && u.substr(15, 4) !== 'page') {
      let anotherU = _path.default.join(__dirname, 'static', u.substring(15));

      mainWindow.loadURL(_url.default.format({
        pathname: anotherU,
        protocol: "file:",
        slashes: true
      }));
    } else if (u.substr(15, 4) === 'page') {
      mainWindow.loadURL(_url.default.format({
        pathname: _path.default.join(__dirname, 'static', u.substr(15), 'index.html'),
        protocol: "file:",
        slashes: true
      }));
    } else {
      mainWindow.loadURL(_url.default.format({
        pathname: _path.default.join(__dirname, 'static', 'index.html'),
        protocol: "file:",
        slashes: true
      }));
    } // staticFiles.forEach(e => mainWindow.loadURL(
    //     url.format({
    //       pathname: path.join(__dirname, 'static', e),
    //       protocol: 'file:',
    //       slashes: true
    //     }), {
    //       baseURLForDataURL: 'file:///' + path.join(__dirname, 'static')
    //     }
    // ));

  });
});

_electron.app.on("window-all-closed", () => {
  _electron.app.quit();
});

_electron.app.on('open-file', e => {
  e.preventDefault();
  console.log("Trying Open File for : ", e);
});

_electron.app.on('open-url', e => {
  e.preventDefault();
  console.log('Trying open URL for : ', e);
});

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.devMenuTemplate = void 0;

var _electron = __webpack_require__(0);

const devMenuTemplate = {
  label: "Development",
  submenu: [{
    label: "Reload",
    accelerator: "CmdOrCtrl+R",
    click: () => {
      _electron.BrowserWindow.getFocusedWindow().webContents.reloadIgnoringCache();
    }
  }, {
    label: "Toggle DevTools",
    accelerator: "Alt+CmdOrCtrl+I",
    click: () => {
      _electron.BrowserWindow.getFocusedWindow().toggleDevTools();
    }
  }, {
    label: "Quit",
    accelerator: "CmdOrCtrl+Q",
    click: () => {
      _electron.app.quit();
    }
  }]
};
exports.devMenuTemplate = devMenuTemplate;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.editMenuTemplate = void 0;
const editMenuTemplate = {
  label: "Edit",
  submenu: [{
    label: "Undo",
    accelerator: "CmdOrCtrl+Z",
    selector: "undo:"
  }, {
    label: "Redo",
    accelerator: "Shift+CmdOrCtrl+Z",
    selector: "redo:"
  }, {
    type: "separator"
  }, {
    label: "Cut",
    accelerator: "CmdOrCtrl+X",
    selector: "cut:"
  }, {
    label: "Copy",
    accelerator: "CmdOrCtrl+C",
    selector: "copy:"
  }, {
    label: "Paste",
    accelerator: "CmdOrCtrl+V",
    selector: "paste:"
  }, {
    label: "Select All",
    accelerator: "CmdOrCtrl+A",
    selector: "selectAll:"
  }]
};
exports.editMenuTemplate = editMenuTemplate;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _electron = __webpack_require__(0);

var _fsJetpack = _interopRequireDefault(__webpack_require__(1));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This helper remembers the size and position of your windows (and restores
// them in that place after app relaunch).
// Can be used for more than one window, just construct many
// instances of it and give each different name.
var _default = (name, options) => {
  const userDataDir = _fsJetpack.default.cwd(_electron.app.getPath("userData"));

  const stateStoreFile = `window-state-${name}.json`;
  const defaultSize = {
    width: options.width,
    height: options.height
  };
  let state = {};
  let win;

  const restore = () => {
    let restoredState = {};

    try {
      restoredState = userDataDir.read(stateStoreFile, "json");
    } catch (err) {// For some reason json can't be read (might be corrupted).
      // No worries, we have defaults.
    }

    return Object.assign({}, defaultSize, restoredState);
  };

  const getCurrentPosition = () => {
    const position = win.getPosition();
    const size = win.getSize();
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1]
    };
  };

  const windowWithinBounds = (windowState, bounds) => {
    return windowState.x >= bounds.x && windowState.y >= bounds.y && windowState.x + windowState.width <= bounds.x + bounds.width && windowState.y + windowState.height <= bounds.y + bounds.height;
  };

  const resetToDefaults = () => {
    const bounds = _electron.screen.getPrimaryDisplay().bounds;

    return Object.assign({}, defaultSize, {
      x: (bounds.width - defaultSize.width) / 2,
      y: (bounds.height - defaultSize.height) / 2
    });
  };

  const ensureVisibleOnSomeDisplay = windowState => {
    const visible = _electron.screen.getAllDisplays().some(display => {
      return windowWithinBounds(windowState, display.bounds);
    });

    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetToDefaults();
    }

    return windowState;
  };

  const saveState = () => {
    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition());
    }

    userDataDir.write(stateStoreFile, state, {
      atomic: true
    });
  };

  state = ensureVisibleOnSomeDisplay(restore());
  win = new _electron.BrowserWindow(Object.assign({}, options, state));
  win.on("close", saveState);
  return win;
};

exports.default = _default;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
let mainCSSStyle = 'html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,hgroup,menu,nav,output,ruby,section,summary,time,mark,audio,video{margin:0;padding:0;border:0;font-size:100%;font:inherit;vertical-align:baseline}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul,dl{list-style:none}blockquote,q{quotes:none}blockquote:before,blockquote:after,q:before,q:after{content:"";content:none}table{border-collapse:collapse;border-spacing:0}*,*:before,*:after{-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box}html{font-size:18px}body{font-family:Optima,"Lucida Sans",Calibri,Candara,Arial,source-han-serif-sc,"Source Han Serif SC","Source Han Serif CN","Source Han Serif TC","Source Han Serif TW","Source Han Serif","Songti SC","Microsoft YaHei",sans-serif;color:#343a40;line-height:1.6}.container{margin:0 auto;max-width:740px;padding:0 10px;width:100%}h1,h2,h3,h4,h5,h6{line-height:1.7;margin:1em 0 15px;padding:0}@media screen and (max-width: 640px){h1,h2,h3,h4,h5,h6{line-height:1.4}}h1,h2,h3,h4,h5{font-weight:bold}h1{font-size:30px}h1 a{color:inherit}h2{font-size:24px}h3{font-size:20px}h4{font-size:20px}h6{color:#868e96}p{color:#343a40;margin:15px 0px;text-align:justify}a{color:#1b6ec2;text-decoration:none;cursor:pointer}a:hover,a:active{color:#1b6ec2}em,i{font-style:italic}strong,b{font-weight:bold}sub{vertical-align:sub;font-size:smaller}sup{vertical-align:super;font-size:smaller}hr{border:0;border-top:2px solid #f1f3f5;margin:1.5em auto}ol>li:before,ul>li:before{position:absolute;width:1.4em;margin-left:-1.4em;display:inline-block;box-sizing:border-box;text-align:right}ul>li:before{content:"\\2022";padding-right:.3em;font-family:inherit;font-size:1.4em;line-height:1.2}ol{counter-reset:section}ol>li:before{counter-increment:section;content:counter(section) ".";padding-right:.3em;font-family:inherit;font-size:1em;line-height:inherit}ol>li,ul>li{margin:0 auto .4em 1.4em;line-height:1.55}ol>li>ol,ol>li>ul,ul>li>ol,ul>li>ul{margin-top:.4em}li>ol>li,li>ul>li{font-size:.95em;margin:0 auto .38em 1.33em}dt{float:left;width:180px;overflow:auto;clear:left;text-align:right;white-space:nowrap;font-weight:bold;margin-bottom:.4em}@media screen and (max-width: 640px){dt{width:120px}}dd{margin-left:200px;margin-bottom:.4em}@media screen and (max-width: 640px){dd{margin-left:140px}}table{margin-bottom:1rem;width:100%;border:1px solid #e9ecef;border-collapse:collapse}td,th{padding:.25rem .5rem;border:1px solid #e9ecef}tbody tr:nth-child(odd) td,tbody tr:nth-child(odd) th{background-color:#f1f3f5}blockquote{font-weight:300;padding:0 0 0 1.4rem;margin:0 2.0rem 1rem 0rem;border-left:0.2em solid #dee2e6;text-align:justify}blockquote p{font-family:"Palatino Linotype","Book Antiqua",Palatino,STKaiti,KaiTi,"楷体",SimKai,DFKai-SB,NSimSun,serif}blockquote p:last-child{margin-bottom:0}a.footnote,.post p a.footnote,.post ol a.footnote,.post ul a.footnote{margin:0 3px;padding:0 2px;font-size:14px;text-align:center;border:1px solid #f1f3f5;border-radius:2px;-webkit-text-stroke:0.25px;-webkit-transition:0.2s ease-out all;text-decoration:none}a.footnote:hover,.post p a.footnote:hover,.post ol a.footnote:hover,.post ul a.footnote:hover{background:#f1f3f5}.footnotes{border-top:1px solid #f1f3f5;font-size:14px}img{display:block;max-width:100%;margin-left:auto;margin-right:auto;border-radius:5px}.gmnoprint img{max-width:none}::-moz-selection{color:#000;background:#f1f3f5}::selection{color:#000;background:#f1f3f5}.clearfix:before,.clearfix:after{content:" ";display:table}.clearfix:after{clear:both}.center{text-align:center}.center-image{margin:0 auto;display:block}.right{text-align:right}.wrapper-masthead{margin-bottom:50px}.masthead{padding:20px 0;border-bottom:1px solid #eee}@media screen and (max-width: 640px){.masthead{text-align:center}}.site-avatar{float:left;width:70px;height:70px;margin-right:15px}@media screen and (max-width: 640px){.site-avatar{float:none;display:block;margin:0 auto}}.site-avatar img{border-radius:5px}.site-info{float:left}@media screen and (max-width: 640px){.site-info{float:none;display:block;margin:0 auto}}.site-name{margin:0;color:#333;cursor:pointer;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-weight:300;font-size:28px;letter-spacing:1px}.site-description{margin:-5px 0 0 0;color:#666;font-size:16px}@media screen and (max-width: 640px){.site-description{margin:3px 0;text-align:center}}nav{float:right;margin-top:23px;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:18px}@media screen and (max-width: 640px){nav{float:none;margin-top:9px;display:block;font-size:16px}}nav a{margin-left:20px;color:#333;text-align:right;font-weight:300;letter-spacing:1px}@media screen and (max-width: 640px){nav a{margin:0 10px;color:#4183C4}}.posts>.post{padding-bottom:2em;border-bottom:1px solid #f1f3f5}.posts>.post:last-child{padding-bottom:1em;border-bottom:none}.post h1{margin-bottom:.1em}.post .date{font-weight:300;font-size:14px;color:#868e96;margin-right:3px}.post .tag{display:inline;font-weight:300;font-size:14px}.post .tag li:before{content:""}.post .tag li{display:inline;margin:0}.post .tag li>a{margin:3px 3px 3px 0;padding:.5px 4px;color:#343a40;background-color:#e9ecef;border-radius:3px}.post .comments{margin-top:10px}.post .read-more{font-size:15px}.pagination{font-weight:300;padding:2em 0;width:100%;display:inline-block}@media screen and (max-width: 640px){.pagination{font-size:14px}}.pagination>.prev{float:left;width:50%}.pagination>.prev a{color:#868e96}.pagination>.prev a:hover,.pagination>.prev a:focus{color:#495057}.pagination>.next{float:right;text-align:right;width:50%}.pagination>.next a{color:#868e96}.pagination>.next a:hover,.pagination>.next a:focus{color:#495057}.archive a{color:#343a40}.archive time{color:#868e96;font-size:14px;font-weight:300;margin-left:3px}.tags>.label>li:before{content:""}.tags>.label>li{margin:0;font-size:14px;font-weight:300;display:inline}.tags>.label>li>a{display:inline-block;margin:1px;color:#343a40;background-color:#e9ecef;border-radius:3px}.tags>.label>li>a span{float:left;padding:.5px 5px}.tags>.label>li>a span.count{background-color:#dee2e6;border-radius:0 3px 3px 0}.tags>.tag a{color:#343a40}.tags>.tag time{color:#868e96;font-size:14px;font-weight:300;margin-left:3px}.wrapper-footer{margin-top:50px;border-top:1px solid #e9ecef;border-bottom:1px solid #e9ecef;background-color:#f1f3f5}footer{padding:20px 0;text-align:center}footer p{font-size:14px;text-align:center}footer .svg-icon{display:block;font-size:0;list-style:none;margin:0;text-align:center}footer .svg-icon li{display:inline-block;margin:10px}footer .svg-icon svg{height:30px;width:30px}footer .svg-icon em{font-size:18px;line-height:1.5;margin-top:-.75em;position:absolute;text-align:center;top:50%;right:0;bottom:0;left:0}pre,code{font-family:"Menlo","Courier New","Monaco","Spoqa Han Sans",monospace}code.highlighter-rouge{font-size:90%;color:#364fc7;background-color:#f1f3f5;padding:.1em .2em;border-radius:3px}pre.highlight{font-size:14px;padding:.45em .45em .45em .625em;border:1px solid #dee2e6;border-radius:3px;margin:1em 0;overflow:scroll}.highlight{background:#f8f9fa}.highlight .c{color:#999988;font-style:italic}.highlight .err{color:#a61717;background-color:#e3d2d2}.highlight .k{font-weight:bold}.highlight .o{font-weight:bold}.highlight .cm{color:#999988;font-style:italic}.highlight .cp{color:#999999;font-weight:bold}.highlight .c1{color:#999988;font-style:italic}.highlight .cs{color:#999999;font-weight:bold;font-style:italic}.highlight .gd{color:#000000;background-color:#fdd}.highlight .gd .x{color:#000000;background-color:#faa}.highlight .ge{font-style:italic}.highlight .gr{color:#a00}.highlight .gh{color:#999}.highlight .gi{color:#000000;background-color:#dfd}.highlight .gi .x{color:#000000;background-color:#afa}.highlight .go{color:#888}.highlight .gp{color:#555}.highlight .gs{font-weight:bold}.highlight .gu{color:#aaa}.highlight .gt{color:#a00}.highlight .kc{font-weight:bold}.highlight .kd{font-weight:bold}.highlight .kp{font-weight:bold}.highlight .kr{font-weight:bold}.highlight .kt{color:#445588;font-weight:bold}.highlight .m{color:#099}.highlight .s{color:#d14}.highlight .na{color:teal}.highlight .nb{color:#0086B3}.highlight .nc{color:#445588;font-weight:bold}.highlight .no{color:teal}.highlight .ni{color:purple}.highlight .ne{color:#990000;font-weight:bold}.highlight .nf{color:#990000;font-weight:bold}.highlight .nn{color:#555}.highlight .nt{color:navy}.highlight .nv{color:teal}.highlight .ow{font-weight:bold}.highlight .w{color:#bbb}.highlight .mf{color:#099}.highlight .mh{color:#099}.highlight .mi{color:#099}.highlight .mo{color:#099}.highlight .sb{color:#d14}.highlight .sc{color:#d14}.highlight .sd{color:#d14}.highlight .s2{color:#d14}.highlight .se{color:#d14}.highlight .sh{color:#d14}.highlight .si{color:#d14}.highlight .sx{color:#d14}.highlight .sr{color:#009926}.highlight .s1{color:#d14}.highlight .ss{color:#990073}.highlight .bp{color:#999}.highlight .vc{color:teal}.highlight .vg{color:teal}.highlight .vi{color:teal}.highlight .il{color:#099}';
let shareCSSStyle = '@font-face{font-family:"socialshare";src:url("../fonts/iconfont.eot");src:url("../fonts/iconfont.eot?#iefix") format("embedded-opentype"),url("../fonts/iconfont.woff") format("woff"),url("../fonts/iconfont.ttf") format("truetype"),url("../fonts/iconfont.svg#iconfont") format("svg")}.social-share{font-family:"socialshare" !important;font-size:16px;font-style:normal;-webkit-font-smoothing:antialiased;-webkit-text-stroke-width:0.2px;-moz-osx-font-smoothing:grayscale}.social-share *{font-family:"socialshare" !important}.social-share .icon-tencent:before{content:"\f07a"}.social-share .icon-qq:before{content:"\f11a"}.social-share .icon-weibo:before{content:"\f12a"}.social-share .icon-wechat:before{content:"\f09a"}.social-share .icon-douban:before{content:"\f10a"}.social-share .icon-heart:before{content:"\f20a"}.social-share .icon-like:before{content:"\f00a"}.social-share .icon-qzone:before{content:"\f08a"}.social-share .icon-linkedin:before{content:"\f01a"}.social-share .icon-diandian:before{content:"\f05a"}.social-share .icon-facebook:before{content:"\f03a"}.social-share .icon-google:before{content:"\f04a"}.social-share .icon-twitter:before{content:"\f06a"}.social-share a{position:relative;text-decoration:none;margin:4px;display:inline-block;outline:none}.social-share .social-share-icon{position:relative;display:inline-block;width:32px;height:32px;font-size:20px;border-radius:50%;line-height:32px;border:1px solid #666;color:#666;text-align:center;vertical-align:middle;transition:background 0.6s ease-out 0s}.social-share .social-share-icon:hover{background:#666;color:#fff}.social-share .icon-weibo{color:#ff763b;border-color:#ff763b}.social-share .icon-weibo:hover{background:#ff763b}.social-share .icon-tencent{color:#56b6e7;border-color:#56b6e7}.social-share .icon-tencent:hover{background:#56b6e7}.social-share .icon-qq{color:#56b6e7;border-color:#56b6e7}.social-share .icon-qq:hover{background:#56b6e7}.social-share .icon-qzone{color:#FDBE3D;border-color:#FDBE3D}.social-share .icon-qzone:hover{background:#FDBE3D}.social-share .icon-douban{color:#33b045;border-color:#33b045}.social-share .icon-douban:hover{background:#33b045}.social-share .icon-linkedin{color:#0077B5;border-color:#0077B5}.social-share .icon-linkedin:hover{background:#0077B5}.social-share .icon-facebook{color:#44619D;border-color:#44619D}.social-share .icon-facebook:hover{background:#44619D}.social-share .icon-google{color:#db4437;border-color:#db4437}.social-share .icon-google:hover{background:#db4437}.social-share .icon-twitter{color:#55acee;border-color:#55acee}.social-share .icon-twitter:hover{background:#55acee}.social-share .icon-diandian{color:#307DCA;border-color:#307DCA}.social-share .icon-diandian:hover{background:#307DCA}.social-share .icon-wechat{position:relative;color:#7bc549;border-color:#7bc549}.social-share .icon-wechat:hover{background:#7bc549}.social-share .icon-wechat .wechat-qrcode{display:none;border:1px solid #eee;position:absolute;z-index:9;top:-205px;left:-84px;width:200px;height:192px;color:#666;font-size:12px;text-align:center;background-color:#fff;box-shadow:0 2px 10px #aaa;transition:all 200ms;-webkit-tansition:all 350ms;-moz-transition:all 350ms}.social-share .icon-wechat .wechat-qrcode.bottom{top:40px;left:-84px}.social-share .icon-wechat .wechat-qrcode.bottom:after{display:none}.social-share .icon-wechat .wechat-qrcode h4{font-weight:normal;height:26px;line-height:26px;font-size:12px;background-color:#f3f3f3;margin:0;padding:0;color:#777}.social-share .icon-wechat .wechat-qrcode .qrcode{width:105px;margin:10px auto}.social-share .icon-wechat .wechat-qrcode .qrcode table{margin:0 !important}.social-share .icon-wechat .wechat-qrcode .help p{font-weight:normal;line-height:16px;padding:0;margin:0}.social-share .icon-wechat .wechat-qrcode:after{content:"";position:absolute;left:50%;margin-left:-6px;bottom:-13px;width:0;height:0;border-width:8px 6px 6px 6px;border-style:solid;border-color:#fff transparent transparent transparent}.social-share .icon-wechat:hover .wechat-qrcode{display:block};';
let socialJS = 'var QRCode;!function(){function t(t){this.mode=s.MODE_8BIT_BYTE,this.data=t,this.parsedData=[];for(var e=0,r=this.data.length;e<r;e++){var i=[],n=this.data.charCodeAt(e);n>65536?(i[0]=240|(1835008&n)>>>18,i[1]=128|(258048&n)>>>12,i[2]=128|(4032&n)>>>6,i[3]=128|63&n):n>2048?(i[0]=224|(61440&n)>>>12,i[1]=128|(4032&n)>>>6,i[2]=128|63&n):n>128?(i[0]=192|(1984&n)>>>6,i[1]=128|63&n):i[0]=n,this.parsedData.push(i)}this.parsedData=Array.prototype.concat.apply([],this.parsedData),this.parsedData.length!=this.data.length&&(this.parsedData.unshift(191),this.parsedData.unshift(187),this.parsedData.unshift(239))}function e(t,e){this.typeNumber=t,this.errorCorrectLevel=e,this.modules=null,this.moduleCount=0,this.dataCache=null,this.dataList=[]}function r(t,e){if(void 0==t.length)throw new Error(t.length+"/"+e);for(var r=0;r<t.length&&0==t[r];)r++;this.num=new Array(t.length-r+e);for(var i=0;i<t.length-r;i++)this.num[i]=t[i+r]}function i(t,e){this.totalCount=t,this.dataCount=e}function n(){this.buffer=[],this.length=0}function o(){var t=!1,e=navigator.userAgent;if(/android/i.test(e)){t=!0;var r=e.toString().match(/android ([0-9]\.[0-9])/i);r&&r[1]&&(t=parseFloat(r[1]))}return t}function a(t,e){for(var r=1,i=function(t){var e=encodeURI(t).toString().replace(/\%[0-9a-fA-F]{2}/g,"a");return e.length+(e.length!=t?3:0)}(t),n=0,o=d.length;n<=o;n++){var a=0;switch(e){case h.L:a=d[n][0];break;case h.M:a=d[n][1];break;case h.Q:a=d[n][2];break;case h.H:a=d[n][3]}if(i<=a)break;r++}if(r>d.length)throw new Error("Too long data");return r}t.prototype={getLength:function(t){return this.parsedData.length},write:function(t){for(var e=0,r=this.parsedData.length;e<r;e++)t.put(this.parsedData[e],8)}},e.prototype={addData:function(e){var r=new t(e);this.dataList.push(r),this.dataCache=null},isDark:function(t,e){if(t<0||this.moduleCount<=t||e<0||this.moduleCount<=e)throw new Error(t+","+e);return this.modules[t][e]},getModuleCount:function(){return this.moduleCount},make:function(){this.makeImpl(!1,this.getBestMaskPattern())},makeImpl:function(t,r){this.moduleCount=4*this.typeNumber+17,this.modules=new Array(this.moduleCount);for(var i=0;i<this.moduleCount;i++){this.modules[i]=new Array(this.moduleCount);for(var n=0;n<this.moduleCount;n++)this.modules[i][n]=null}this.setupPositionProbePattern(0,0),this.setupPositionProbePattern(this.moduleCount-7,0),this.setupPositionProbePattern(0,this.moduleCount-7),this.setupPositionAdjustPattern(),this.setupTimingPattern(),this.setupTypeInfo(t,r),this.typeNumber>=7&&this.setupTypeNumber(t),null==this.dataCache&&(this.dataCache=e.createData(this.typeNumber,this.errorCorrectLevel,this.dataList)),this.mapData(this.dataCache,r)},setupPositionProbePattern:function(t,e){for(var r=-1;r<=7;r++)if(!(t+r<=-1||this.moduleCount<=t+r))for(var i=-1;i<=7;i++)e+i<=-1||this.moduleCount<=e+i||(this.modules[t+r][e+i]=0<=r&&r<=6&&(0==i||6==i)||0<=i&&i<=6&&(0==r||6==r)||2<=r&&r<=4&&2<=i&&i<=4)},getBestMaskPattern:function(){for(var t=0,e=0,r=0;r<8;r++){this.makeImpl(!0,r);var i=u.getLostPoint(this);(0==r||t>i)&&(t=i,e=r)}return e},createMovieClip:function(t,e,r){var i=t.createEmptyMovieClip(e,r);this.make();for(var n=0;n<this.modules.length;n++)for(var o=1*n,a=0;a<this.modules[n].length;a++){var s=1*a;this.modules[n][a]&&(i.beginFill(0,100),i.moveTo(s,o),i.lineTo(s+1,o),i.lineTo(s+1,o+1),i.lineTo(s,o+1),i.endFill())}return i},setupTimingPattern:function(){for(var t=8;t<this.moduleCount-8;t++)null==this.modules[t][6]&&(this.modules[t][6]=t%2==0);for(var e=8;e<this.moduleCount-8;e++)null==this.modules[6][e]&&(this.modules[6][e]=e%2==0)},setupPositionAdjustPattern:function(){for(var t=u.getPatternPosition(this.typeNumber),e=0;e<t.length;e++)for(var r=0;r<t.length;r++){var i=t[e],n=t[r];if(null==this.modules[i][n])for(var o=-2;o<=2;o++)for(var a=-2;a<=2;a++)this.modules[i+o][n+a]=-2==o||2==o||-2==a||2==a||0==o&&0==a}},setupTypeNumber:function(t){for(var e=u.getBCHTypeNumber(this.typeNumber),r=0;r<18;r++){i=!t&&1==(e>>r&1);this.modules[Math.floor(r/3)][r%3+this.moduleCount-8-3]=i}for(r=0;r<18;r++){var i=!t&&1==(e>>r&1);this.modules[r%3+this.moduleCount-8-3][Math.floor(r/3)]=i}},setupTypeInfo:function(t,e){for(var r=this.errorCorrectLevel<<3|e,i=u.getBCHTypeInfo(r),n=0;n<15;n++){o=!t&&1==(i>>n&1);n<6?this.modules[n][8]=o:n<8?this.modules[n+1][8]=o:this.modules[this.moduleCount-15+n][8]=o}for(n=0;n<15;n++){var o=!t&&1==(i>>n&1);n<8?this.modules[8][this.moduleCount-n-1]=o:n<9?this.modules[8][15-n-1+1]=o:this.modules[8][15-n-1]=o}this.modules[this.moduleCount-8][8]=!t},mapData:function(t,e){for(var r=-1,i=this.moduleCount-1,n=7,o=0,a=this.moduleCount-1;a>0;a-=2)for(6==a&&a--;;){for(var s=0;s<2;s++)if(null==this.modules[i][a-s]){var h=!1;o<t.length&&(h=1==(t[o]>>>n&1));u.getMask(e,i,a-s)&&(h=!h),this.modules[i][a-s]=h,-1==--n&&(o++,n=7)}if((i+=r)<0||this.moduleCount<=i){i-=r,r=-r;break}}}},e.PAD0=236,e.PAD1=17,e.createData=function(t,r,o){for(var a=i.getRSBlocks(t,r),s=new n,h=0;h<o.length;h++){var l=o[h];s.put(l.mode,4),s.put(l.getLength(),u.getLengthInBits(l.mode,t)),l.write(s)}for(var c=0,h=0;h<a.length;h++)c+=a[h].dataCount;if(s.getLengthInBits()>8*c)throw new Error("code length overflow. ("+s.getLengthInBits()+">"+8*c+")");for(s.getLengthInBits()+4<=8*c&&s.put(0,4);s.getLengthInBits()%8!=0;)s.putBit(!1);for(;;){if(s.getLengthInBits()>=8*c)break;if(s.put(e.PAD0,8),s.getLengthInBits()>=8*c)break;s.put(e.PAD1,8)}return e.createBytes(s,a)},e.createBytes=function(t,e){for(var i=0,n=0,o=0,a=new Array(e.length),s=new Array(e.length),h=0;h<e.length;h++){var l=e[h].dataCount,c=e[h].totalCount-l;n=Math.max(n,l),o=Math.max(o,c),a[h]=new Array(l);for(m=0;m<a[h].length;m++)a[h][m]=255&t.buffer[m+i];i+=l;var f=u.getErrorCorrectPolynomial(c),d=new r(a[h],f.getLength()-1).mod(f);s[h]=new Array(f.getLength()-1);for(m=0;m<s[h].length;m++){var g=m+d.getLength()-s[h].length;s[h][m]=g>=0?d.get(g):0}}for(var p=0,m=0;m<e.length;m++)p+=e[m].totalCount;for(var v=new Array(p),w=0,m=0;m<n;m++)for(h=0;h<e.length;h++)m<a[h].length&&(v[w++]=a[h][m]);for(m=0;m<o;m++)for(h=0;h<e.length;h++)m<s[h].length&&(v[w++]=s[h][m]);return v};for(var s={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},h={L:1,M:0,Q:3,H:2},l={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},u={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:1335,G18:7973,G15_MASK:21522,getBCHTypeInfo:function(t){for(var e=t<<10;u.getBCHDigit(e)-u.getBCHDigit(u.G15)>=0;)e^=u.G15<<u.getBCHDigit(e)-u.getBCHDigit(u.G15);return(t<<10|e)^u.G15_MASK},getBCHTypeNumber:function(t){for(var e=t<<12;u.getBCHDigit(e)-u.getBCHDigit(u.G18)>=0;)e^=u.G18<<u.getBCHDigit(e)-u.getBCHDigit(u.G18);return t<<12|e},getBCHDigit:function(t){for(var e=0;0!=t;)e++,t>>>=1;return e},getPatternPosition:function(t){return u.PATTERN_POSITION_TABLE[t-1]},getMask:function(t,e,r){switch(t){case l.PATTERN000:return(e+r)%2==0;case l.PATTERN001:return e%2==0;case l.PATTERN010:return r%3==0;case l.PATTERN011:return(e+r)%3==0;case l.PATTERN100:return(Math.floor(e/2)+Math.floor(r/3))%2==0;case l.PATTERN101:return e*r%2+e*r%3==0;case l.PATTERN110:return(e*r%2+e*r%3)%2==0;case l.PATTERN111:return(e*r%3+(e+r)%2)%2==0;default:throw new Error("bad maskPattern:"+t)}},getErrorCorrectPolynomial:function(t){for(var e=new r([1],0),i=0;i<t;i++)e=e.multiply(new r([1,c.gexp(i)],0));return e},getLengthInBits:function(t,e){if(1<=e&&e<10)switch(t){case s.MODE_NUMBER:return 10;case s.MODE_ALPHA_NUM:return 9;case s.MODE_8BIT_BYTE:case s.MODE_KANJI:return 8;default:throw new Error("mode:"+t)}else if(e<27)switch(t){case s.MODE_NUMBER:return 12;case s.MODE_ALPHA_NUM:return 11;case s.MODE_8BIT_BYTE:return 16;case s.MODE_KANJI:return 10;default:throw new Error("mode:"+t)}else{if(!(e<41))throw new Error("type:"+e);switch(t){case s.MODE_NUMBER:return 14;case s.MODE_ALPHA_NUM:return 13;case s.MODE_8BIT_BYTE:return 16;case s.MODE_KANJI:return 12;default:throw new Error("mode:"+t)}}},getLostPoint:function(t){for(var e=t.getModuleCount(),r=0,i=0;i<e;i++)for(u=0;u<e;u++){for(var n=0,o=t.isDark(i,u),a=-1;a<=1;a++)if(!(i+a<0||e<=i+a))for(var s=-1;s<=1;s++)u+s<0||e<=u+s||0==a&&0==s||o==t.isDark(i+a,u+s)&&n++;n>5&&(r+=3+n-5)}for(i=0;i<e-1;i++)for(u=0;u<e-1;u++){var h=0;t.isDark(i,u)&&h++,t.isDark(i+1,u)&&h++,t.isDark(i,u+1)&&h++,t.isDark(i+1,u+1)&&h++,0!=h&&4!=h||(r+=3)}for(i=0;i<e;i++)for(u=0;u<e-6;u++)t.isDark(i,u)&&!t.isDark(i,u+1)&&t.isDark(i,u+2)&&t.isDark(i,u+3)&&t.isDark(i,u+4)&&!t.isDark(i,u+5)&&t.isDark(i,u+6)&&(r+=40);for(u=0;u<e;u++)for(i=0;i<e-6;i++)t.isDark(i,u)&&!t.isDark(i+1,u)&&t.isDark(i+2,u)&&t.isDark(i+3,u)&&t.isDark(i+4,u)&&!t.isDark(i+5,u)&&t.isDark(i+6,u)&&(r+=40);for(var l=0,u=0;u<e;u++)for(i=0;i<e;i++)t.isDark(i,u)&&l++;return r+=10*(Math.abs(100*l/e/e-50)/5)}},c={glog:function(t){if(t<1)throw new Error("glog("+t+")");return c.LOG_TABLE[t]},gexp:function(t){for(;t<0;)t+=255;for(;t>=256;)t-=255;return c.EXP_TABLE[t]},EXP_TABLE:new Array(256),LOG_TABLE:new Array(256)},f=0;f<8;f++)c.EXP_TABLE[f]=1<<f;for(f=8;f<256;f++)c.EXP_TABLE[f]=c.EXP_TABLE[f-4]^c.EXP_TABLE[f-5]^c.EXP_TABLE[f-6]^c.EXP_TABLE[f-8];for(f=0;f<255;f++)c.LOG_TABLE[c.EXP_TABLE[f]]=f;r.prototype={get:function(t){return this.num[t]},getLength:function(){return this.num.length},multiply:function(t){for(var e=new Array(this.getLength()+t.getLength()-1),i=0;i<this.getLength();i++)for(var n=0;n<t.getLength();n++)e[i+n]^=c.gexp(c.glog(this.get(i))+c.glog(t.get(n)));return new r(e,0)},mod:function(t){if(this.getLength()-t.getLength()<0)return this;for(var e=c.glog(this.get(0))-c.glog(t.get(0)),i=new Array(this.getLength()),n=0;n<this.getLength();n++)i[n]=this.get(n);for(n=0;n<t.getLength();n++)i[n]^=c.gexp(c.glog(t.get(n))+e);return new r(i,0).mod(t)}},i.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],i.getRSBlocks=function(t,e){var r=i.getRsBlockTable(t,e);if(void 0==r)throw new Error("bad rs block @ typeNumber:"+t+"/errorCorrectLevel:"+e);for(var n=r.length/3,o=[],a=0;a<n;a++)for(var s=r[3*a+0],h=r[3*a+1],l=r[3*a+2],u=0;u<s;u++)o.push(new i(h,l));return o},i.getRsBlockTable=function(t,e){switch(e){case h.L:return i.RS_BLOCK_TABLE[4*(t-1)+0];case h.M:return i.RS_BLOCK_TABLE[4*(t-1)+1];case h.Q:return i.RS_BLOCK_TABLE[4*(t-1)+2];case h.H:return i.RS_BLOCK_TABLE[4*(t-1)+3];default:return}},n.prototype={get:function(t){var e=Math.floor(t/8);return 1==(this.buffer[e]>>>7-t%8&1)},put:function(t,e){for(var r=0;r<e;r++)this.putBit(1==(t>>>e-r-1&1))},getLengthInBits:function(){return this.length},putBit:function(t){var e=Math.floor(this.length/8);this.buffer.length<=e&&this.buffer.push(0),t&&(this.buffer[e]|=128>>>this.length%8),this.length++}};var d=[[17,14,11,7],[32,26,20,14],[53,42,32,24],[78,62,46,34],[106,84,60,44],[134,106,74,58],[154,122,86,64],[192,152,108,84],[230,180,130,98],[271,213,151,119],[321,251,177,137],[367,287,203,155],[425,331,241,177],[458,362,258,194],[520,412,292,220],[586,450,322,250],[644,504,364,280],[718,560,394,310],[792,624,442,338],[858,666,482,382],[929,711,509,403],[1003,779,565,439],[1091,857,611,461],[1171,911,661,511],[1273,997,715,535],[1367,1059,751,593],[1465,1125,805,625],[1528,1190,868,658],[1628,1264,908,698],[1732,1370,982,742],[1840,1452,1030,790],[1952,1538,1112,842],[2068,1628,1168,898],[2188,1722,1228,958],[2303,1809,1283,983],[2431,1911,1351,1051],[2563,1989,1423,1093],[2699,2099,1499,1139],[2809,2213,1579,1219],[2953,2331,1663,1273]],g=function(){var t=function(t,e){this._el=t,this._htOption=e};return t.prototype.draw=function(t){function e(t,e){var r=document.createElementNS("http://www.w3.org/2000/svg",t);for(var i in e)e.hasOwnProperty(i)&&r.setAttribute(i,e[i]);return r}var r=this._htOption,i=this._el,n=t.getModuleCount();Math.floor(r.width/n),Math.floor(r.height/n);this.clear();var o=e("svg",{viewBox:"0 0 "+String(n)+" "+String(n),width:"100%",height:"100%",fill:r.colorLight});o.setAttributeNS("http://www.w3.org/2000/xmlns/","xmlns:xlink","http://www.w3.org/1999/xlink"),i.appendChild(o),o.appendChild(e("rect",{fill:r.colorLight,width:"100%",height:"100%"})),o.appendChild(e("rect",{fill:r.colorDark,width:"1",height:"1",id:"template"}));for(var a=0;a<n;a++)for(var s=0;s<n;s++)if(t.isDark(a,s)){var h=e("use",{x:String(s),y:String(a)});h.setAttributeNS("http://www.w3.org/1999/xlink","href","#template"),o.appendChild(h)}},t.prototype.clear=function(){for(;this._el.hasChildNodes();)this._el.removeChild(this._el.lastChild)},t}(),p="svg"===document.documentElement.tagName.toLowerCase()?g:"undefined"==typeof CanvasRenderingContext2D?function(){var t=function(t,e){this._el=t,this._htOption=e};return t.prototype.draw=function(t){for(var e=this._htOption,r=this._el,i=t.getModuleCount(),n=Math.floor(e.width/i),o=Math.floor(e.height/i),a=["<table style=\"border:0;border-collapse:collapse;\">"],s=0;s<i;s++){a.push("<tr>");for(var h=0;h<i;h++)a.push("<td style=\"border:0;border-collapse:collapse;padding:0;margin:0;width:"+n+"px;height:"+o+"px;background-color:"+(t.isDark(s,h)?e.colorDark:e.colorLight)+";\"></td>");a.push("</tr>")}a.push("</table>"),r.innerHTML=a.join("");var l=r.childNodes[0],u=(e.width-l.offsetWidth)/2,c=(e.height-l.offsetHeight)/2;u>0&&c>0&&(l.style.margin=c+"px "+u+"px")},t.prototype.clear=function(){this._el.innerHTML=""},t}():function(){function t(){this._elImage.src=this._elCanvas.toDataURL("image/png"),this._elImage.style.display="block",this._elCanvas.style.display="none"}if(this._android&&this._android<=2.1){var e=1/window.devicePixelRatio,r=CanvasRenderingContext2D.prototype.drawImage;CanvasRenderingContext2D.prototype.drawImage=function(t,i,n,o,a,s,h,l,u){if("nodeName"in t&&/img/i.test(t.nodeName))for(var c=arguments.length-1;c>=1;c--)arguments[c]=arguments[c]*e;else void 0===l&&(arguments[1]*=e,arguments[2]*=e,arguments[3]*=e,arguments[4]*=e);r.apply(this,arguments)}}var i=function(t,e){this._bIsPainted=!1,this._android=o(),this._htOption=e,this._elCanvas=document.createElement("canvas"),this._elCanvas.width=e.width,this._elCanvas.height=e.height,t.appendChild(this._elCanvas),this._el=t,this._oContext=this._elCanvas.getContext("2d"),this._bIsPainted=!1,this._elImage=document.createElement("img"),this._elImage.alt="Scan me!",this._elImage.style.display="none",this._el.appendChild(this._elImage),this._bSupportDataURI=null};return i.prototype.draw=function(t){var e=this._elImage,r=this._oContext,i=this._htOption,n=t.getModuleCount(),o=i.width/n,a=i.height/n,s=Math.round(o),h=Math.round(a);e.style.display="none",this.clear();for(var l=0;l<n;l++)for(var u=0;u<n;u++){var c=t.isDark(l,u),f=u*o,d=l*a;r.strokeStyle=c?i.colorDark:i.colorLight,r.lineWidth=1,r.fillStyle=c?i.colorDark:i.colorLight,r.fillRect(f,d,o,a),r.strokeRect(Math.floor(f)+.5,Math.floor(d)+.5,s,h),r.strokeRect(Math.ceil(f)-.5,Math.ceil(d)-.5,s,h)}this._bIsPainted=!0},i.prototype.makeImage=function(){this._bIsPainted&&function(t,e){var r=this;if(r._fFail=e,r._fSuccess=t,null===r._bSupportDataURI){var i=document.createElement("img"),n=function(){r._bSupportDataURI=!1,r._fFail&&r._fFail.call(r)};return i.onabort=n,i.onerror=n,i.onload=function(){r._bSupportDataURI=!0,r._fSuccess&&r._fSuccess.call(r)},void(i.src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==")}!0===r._bSupportDataURI&&r._fSuccess?r._fSuccess.call(r):!1===r._bSupportDataURI&&r._fFail&&r._fFail.call(r)}.call(this,t)},i.prototype.isPainted=function(){return this._bIsPainted},i.prototype.clear=function(){this._oContext.clearRect(0,0,this._elCanvas.width,this._elCanvas.height),this._bIsPainted=!1},i.prototype.round=function(t){return t?Math.floor(1e3*t)/1e3:t},i}();(QRCode=function(t,e){if(this._htOption={width:256,height:256,typeNumber:4,colorDark:"#000000",colorLight:"#ffffff",correctLevel:h.H},"string"==typeof e&&(e={text:e}),e)for(var r in e)this._htOption[r]=e[r];"string"==typeof t&&(t=document.getElementById(t)),this._htOption.useSVG&&(p=g),this._android=o(),this._el=t,this._oQRCode=null,this._oDrawing=new p(this._el,this._htOption),this._htOption.text&&this.makeCode(this._htOption.text)}).prototype.makeCode=function(t){this._oQRCode=new e(a(t,this._htOption.correctLevel),this._htOption.correctLevel),this._oQRCode.addData(t),this._oQRCode.make(),this._el.title=t,this._oDrawing.draw(this._oQRCode),this.makeImage()},QRCode.prototype.makeImage=function(){"function"==typeof this._oDrawing.makeImage&&(!this._android||this._android>=3)&&this._oDrawing.makeImage()},QRCode.prototype.clear=function(){this._oDrawing.clear()},QRCode.CorrectLevel=h}(),function(t,e,r){function i(t,e){var i=function(){var t=arguments;if(u)return u.apply(null,t);var e={};return h(t,function(t){h(t,function(t,r){e[r]=t})}),t[0]=e}({},v,e||{},function(t){if(t.dataset)return JSON.parse(JSON.stringify(t.dataset));var e={};if(t.hasAttributes())return h(t.attributes,function(t){var r=t.name;if(0!==r.indexOf("data-"))return!0;r=r.replace(/^data-/i,"").replace(/-(\w)/g,function(t,e){return e.toUpperCase()}),e[r]=t.value}),e;return{}}(t));i.imageSelector&&(i.image=n(i.imageSelector).map(function(t){return t.src}).join("||")),function(t,e){if(e&&"string"==typeof e){var r=" ";h((t.className+" "+e).split(/\s+/),function(t){r.indexOf(" "+t+" ")<0&&(r+=t+" ")}),t.className=r.slice(1,-1)}}(t,"share-component social-share"),function(t,e){var i=function(t){t.mobileSites.length||(t.mobileSites=t.sites);var e=(f?t.mobileSites:t.sites).slice(0),r=t.disabled;"string"==typeof e&&(e=e.split(/\s*,\s*/));"string"==typeof r&&(r=r.split(/\s*,\s*/));c&&r.push("wechat");return r.length&&h(r,function(t){e.splice(function(t,e,r){var i;if(e){if(l)return l.call(e,t,r);for(i=e.length,r=r?r<0?Math.max(0,i+r):r:0;r<i;r++)if(r in e&&e[r]===t)return r}return-1}(t,e),1)}),e}(e),n="prepend"==e.mode;h(n?i.reverse():i,function(i){var o=function(t,e){e.summary||(e.summary=e.description);return w[t].replace(/\{\{(\w)(\w*)\}\}/g,function(i,n,o){var a=t+n+o.toLowerCase();return o=(n+o).toLowerCase(),encodeURIComponent((e[a]===r?e[o]:e[a])||"")})}(i,e),h=e.initialized?a(t,"icon-"+i):s("<a class=\"social-share-icon icon-"+i+"\"></a>");if(!h.length)return!0;h[0].href=o,"wechat"===i?h[0].tabindex=-1:h[0].target="_blank",e.initialized||(n?t.insertBefore(h[0],t.firstChild):t.appendChild(h[0]))})}(t,i),function(t,e){var r=a(t,"icon-wechat","a");if(0===r.length)return!1;var i=s("<div class=\"wechat-qrcode\"><h4>"+e.wechatQrcodeTitle+"</h4><div class=\"qrcode\"></div><div class=\"help\">"+e.wechatQrcodeHelper+"</div></div>"),n=a(i[0],"qrcode","div");r[0].appendChild(i[0]),new QRCode(n[0],{text:e.url,width:e.wechatQrcodeSize,height:e.wechatQrcodeSize})}(t,i),t.initialized=!0}function n(r){return(e.querySelectorAll||t.jQuery||t.Zepto||function(t){var r=[];return h(t.split(/\s*,\s*/),function(i){var n=i.match(/([#.])(\w+)/);if(null===n)throw Error("Supports only simple single #ID or .CLASS selector.");if(n[1]){var o=e.getElementById(n[2]);o&&r.push(o)}r=r.concat(a(t))}),r}).call(e,r)}function o(t){return(e.getElementsByName(t)[0]||0).content}function a(t,e,r){if(t.getElementsByClassName)return t.getElementsByClassName(e);var i=[],n=t.getElementsByTagName(r||"*");return e=" "+e+" ",h(n,function(t){(" "+(t.className||"")+" ").indexOf(e)>=0&&i.push(t)}),i}function s(t){var r=e.createElement("div");return r.innerHTML=t,r.childNodes}function h(t,e){var i=t.length;if(i===r){for(var n in t)if(t.hasOwnProperty(n)&&!1===e.call(t[n],t[n],n))break}else for(var o=0;o<i&&!1!==e.call(t[o],t[o],o);o++);}var l=Array.prototype.indexOf,u=Object.assign,c=/MicroMessenger/i.test(navigator.userAgent),f=e.documentElement.clientWidth<=768,d=(e.images[0]||0).src||"",g=o("site")||o("Site")||e.title,p=o("title")||o("Title")||e.title,m=o("description")||o("Description")||"",v={url:location.href,origin:location.origin,source:g,title:p,description:m,image:d,imageSelector:r,weiboKey:"",wechatQrcodeTitle:"微信扫一扫：分享",wechatQrcodeHelper:"<p>微信里点“发现”，扫一下</p><p>二维码便可将本文分享至朋友圈。</p>",wechatQrcodeSize:100,sites:["weibo","qq","wechat","tencent","douban","qzone","linkedin","diandian","facebook","twitter","google"],mobileSites:[],disabled:[],initialized:!1},w={qzone:"http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={{URL}}&title={{TITLE}}&desc={{DESCRIPTION}}&summary={{SUMMARY}}&site={{SOURCE}}",qq:"http://connect.qq.com/widget/shareqq/index.html?url={{URL}}&title={{TITLE}}&source={{SOURCE}}&desc={{DESCRIPTION}}&pics={{IMAGE}}&summary=\"{{SUMMARY}}\"",tencent:"http://share.v.t.qq.com/index.php?c=share&a=index&title={{TITLE}}&url={{URL}}&pic={{IMAGE}}",weibo:"http://service.weibo.com/share/share.php?url={{URL}}&title={{TITLE}}&pic={{IMAGE}}&appkey={{WEIBOKEY}}",wechat:"javascript:",douban:"http://shuo.douban.com/!service/share?href={{URL}}&name={{TITLE}}&text={{DESCRIPTION}}&image={{IMAGE}}&starid=0&aid=0&style=11",diandian:"http://www.diandian.com/share?lo={{URL}}&ti={{TITLE}}&type=link",linkedin:"http://www.linkedin.com/shareArticle?mini=true&ro=true&title={{TITLE}}&url={{URL}}&summary={{SUMMARY}}&source={{SOURCE}}&armin=armin",facebook:"https://www.facebook.com/sharer/sharer.php?u={{URL}}",twitter:"https://twitter.com/intent/tweet?text={{TITLE}}&url={{URL}}&via={{ORIGIN}}",google:"https://plus.google.com/share?url={{URL}}"};t.socialShare=function(t,e){(t="string"==typeof t?n(t):t).length===r&&(t=[t]),h(t,function(t){t.initialized||i(t,e)})},function(r){var i="addEventListener",n=e[i]?"":"on";~e.readyState.indexOf("m")?r():"load DOMContentLoaded readystatechange".replace(/\w+/g,function(o,a){(a?e:t)[n?"attachEvent":i](n+o,function(){r&&(a<6||~e.readyState.indexOf("m"))&&(r(),r=0)},!1)})}(function(){socialShare(".social-share, .share-component")})}(window,document);';
let panguJS = '!function(e,u){"object"==typeof exports&&"object"==typeof module?module.exports=u():"function"==typeof define&&define.amd?define("pangu",[],u):"object"==typeof exports?exports.pangu=u():e.pangu=u()}(this,function(){return function(e){function u(a){if(f[a])return f[a].exports;var t=f[a]={exports:{},id:a,loaded:!1};return e[a].call(t.exports,t,t.exports,u),t.loaded=!0,t.exports}var f={};return u.m=e,u.c=f,u.p="",u(0)}([function(e,u,f){"use strict";function a(e,u){if(!(e instanceof u))throw new TypeError("Cannot call a class as a function")}function t(e,u){if(!e)throw new ReferenceError("this hasn\'t been initialised - super() hasn\'t been called");return!u||"object"!=typeof u&&"function"!=typeof u?e:u}function n(e,u){if("function"!=typeof u&&null!==u)throw new TypeError("Super expression must either be null or a function, not "+typeof u);e.prototype=Object.create(u&&u.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),u&&(Object.setPrototypeOf?Object.setPrototypeOf(e,u):e.__proto__=u)}var i=function(){function e(e,u){for(var f=0;f<u.length;f++){var a=u[f];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(u,f,a){return f&&e(u.prototype,f),a&&e(u,a),u}}(),r=f(1).Pangu,o=8,s=function(e){function u(){a(this,u);var e=t(this,Object.getPrototypeOf(u).call(this));return e.topTags=/^(html|head|body|#document)$/i,e.ignoreTags=/^(script|code|pre|textarea)$/i,e.spaceSensitiveTags=/^(a|del|pre|s|strike|u)$/i,e.spaceLikeTags=/^(br|hr|i|img|pangu)$/i,e.blockTags=/^(div|h1|h2|h3|h4|h5|h6|p)$/i,e}return n(u,e),i(u,[{key:"canIgnoreNode",value:function(e){for(var u=e.parentNode;u&&u.nodeName&&u.nodeName.search(this.topTags)===-1;){if(u.nodeName.search(this.ignoreTags)>=0||u.isContentEditable||"true"===u.getAttribute("g_editable"))return!0;u=u.parentNode}return!1}},{key:"isFirstTextChild",value:function(e,u){for(var f=e.childNodes,a=0;a<f.length;a++){var t=f[a];if(t.nodeType!==o&&t.textContent)return t===u}return!1}},{key:"isLastTextChild",value:function(e,u){for(var f=e.childNodes,a=f.length-1;a>-1;a--){var t=f[a];if(t.nodeType!==o&&t.textContent)return t===u}return!1}},{key:"spacingNodeByXPath",value:function(e,u){for(var f=document.evaluate(e,u,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null),a=void 0,t=void 0,n=f.snapshotLength-1;n>-1;--n)if(a=f.snapshotItem(n),this.canIgnoreNode(a))t=a;else{var i=this.spacing(a.data);if(a.data!==i&&(a.data=i),t){if(a.nextSibling&&a.nextSibling.nodeName.search(this.spaceLikeTags)>=0){t=a;continue}var r=a.data.toString().substr(-1)+t.data.toString().substr(0,1),o=this.spacing(r);if(o!==r){for(var s=t;s.parentNode&&s.nodeName.search(this.spaceSensitiveTags)===-1&&this.isFirstTextChild(s.parentNode,s);)s=s.parentNode;for(var c=a;c.parentNode&&c.nodeName.search(this.spaceSensitiveTags)===-1&&this.isLastTextChild(c.parentNode,c);)c=c.parentNode;if(c.nextSibling&&c.nextSibling.nodeName.search(this.spaceLikeTags)>=0){t=a;continue}if(c.nodeName.search(this.blockTags)===-1)if(s.nodeName.search(this.spaceSensitiveTags)===-1)s.nodeName.search(this.ignoreTags)===-1&&s.nodeName.search(this.blockTags)===-1&&(t.previousSibling?t.previousSibling.nodeName.search(this.spaceLikeTags)===-1&&(t.data=" "+t.data):this.canIgnoreNode(t)||(t.data=" "+t.data));else if(c.nodeName.search(this.spaceSensitiveTags)===-1)a.data=a.data+" ";else{var d=document.createElement("pangu");d.innerHTML=" ",s.previousSibling?s.previousSibling.nodeName.search(this.spaceLikeTags)===-1&&s.parentNode.insertBefore(d,s):s.parentNode.insertBefore(d,s),d.previousElementSibling||d.parentNode&&d.parentNode.removeChild(d)}}}t=a}}},{key:"spacingNode",value:function(e){var u=".//*/text()[normalize-space(.)]";this.spacingNodeByXPath(u,e)}},{key:"spacingElementById",value:function(e){var u="id(\""+e+"\")//text()";this.spacingNodeByXPath(u,document)}},{key:"spacingElementByClassName",value:function(e){var u="//*[contains(concat(\" \", normalize-space(@class), \" \"), \""+e+"\")]//text()";this.spacingNodeByXPath(u,document)}},{key:"spacingElementByTagName",value:function(e){var u="//"+e+"//text()";this.spacingNodeByXPath(u,document)}},{key:"spacingPageTitle",value:function(){var e="/html/head/title/text()";this.spacingNodeByXPath(e,document)}},{key:"spacingPageBody",value:function(){for(var e="/html/body//*/text()[normalize-space(.)]",u=["script","style","textarea"],f=0;f<u.length;f++){var a=u[f];e+="[translate(name(..),\"ABCDEFGHIJKLMNOPQRSTUVWXYZ\",\"abcdefghijklmnopqrstuvwxyz\")!=\""+a+"\"]"}this.spacingNodeByXPath(e,document)}},{key:"spacingPage",value:function(){this.spacingPageTitle(),this.spacingPageBody()}}]),u}(r),c=new s;u=e.exports=c,u.Pangu=s},function(e,u){"use strict";function f(e,u){if(!(e instanceof u))throw new TypeError("Cannot call a class as a function")}var a=function(){function e(e,u){for(var f=0;f<u.length;f++){var a=u[f];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(u,f,a){return f&&e(u.prototype,f),a&&e(u,a),u}}(),t=/([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])(["])/g,n=/(["])([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/g,i=/(["\']+)(\s*)(.+?)(\s*)(["\']+)/g,r=/([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])( )(\')([A-Za-z])/g,o=/([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])(#)([A-Za-z0-9\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]+)(#)([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/g,s=/([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])(#([^ ]))/g,c=/(([^ ])#)([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/g,d=/([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])([\+\-\*\/=&\\|<>])([A-Za-z0-9])/g,p=/([A-Za-z0-9])([\+\-\*\/=&\\|<>])([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/g,l=/([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])([\(\[\{<\u201c]+(.*?)[\)\]\}>\u201d]+)([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/g,g=/([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])([\(\[\{<\u201c>])/g,h=/([\)\]\}>\u201d<])([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/g,v=/([\(\[\{<\u201c]+)(\s*)(.+?)(\s*)([\)\]\}>\u201d]+)/,b=/([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])([~!;:,\.\?\u2026])([A-Za-z0-9])/g,y=/([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])([A-Za-z0-9`\$%\^&\*\-=\+\\\|\/@\u00a1-\u00ff\u2022\u2027\u2150-\u218f])/g,m=/([A-Za-z0-9`~\$%\^&\*\-=\+\\\|\/!;:,\.\?\u00a1-\u00ff\u2022\u2026\u2027\u2150-\u218f])([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/g,$=function(){function e(){f(this,e)}return a(e,[{key:"spacing",value:function(e){var u=e;u=u.replace(t,"$1 $2"),u=u.replace(n,"$1 $2"),u=u.replace(i,"$1$3$5"),u=u.replace(r,"$1$3$4"),u=u.replace(o,"$1 $2$3$4 $5"),u=u.replace(s,"$1 $2"),u=u.replace(c,"$1 $3"),u=u.replace(d,"$1 $2 $3"),u=u.replace(p,"$1 $2 $3");var f=u,a=u.replace(l,"$1 $2 $4");return u=a,f===a&&(u=u.replace(g,"$1 $2"),u=u.replace(h,"$1 $2")),u=u.replace(v,"$1$3$5"),u=u.replace(b,"$1$2 $3"),u=u.replace(y,"$1 $2"),u=u.replace(m,"$1 $2")}},{key:"spacingText",value:function(e){var u=arguments.length<=1||void 0===arguments[1]?function(){}:arguments[1];try{var f=this.spacing(e);u(null,f)}catch(a){u(a)}}}]),e}(),N=new $;u=e.exports=N,u.Pangu=$}])});';
var _default = {
  mainCSSStyle,
  shareCSSStyle,
  panguJS,
  socialJS
};
exports.default = _default;

/***/ })
/******/ ]);
//# sourceMappingURL=background.js.map