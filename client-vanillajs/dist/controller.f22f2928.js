// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/config.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IMAGE_PAGE = exports.DOWNLOAD_PAGE = exports.REGISTER_PAGE = exports.HTTP_API_URL = exports.REST_API_URL = exports.TIMEOUT_MILISEC = void 0;
const TIMEOUT_MILISEC = 15000;
exports.TIMEOUT_MILISEC = TIMEOUT_MILISEC;
const REST_API_URL = 'http://localhost:8000';
exports.REST_API_URL = REST_API_URL;
const HTTP_API_URL = 'http://localhost:8080';
exports.HTTP_API_URL = HTTP_API_URL;
const REGISTER_PAGE = 'registerPage';
exports.REGISTER_PAGE = REGISTER_PAGE;
const DOWNLOAD_PAGE = 'downloadPage';
exports.DOWNLOAD_PAGE = DOWNLOAD_PAGE;
const IMAGE_PAGE = 'imagePage';
exports.IMAGE_PAGE = IMAGE_PAGE;
},{}],"js/helpers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AJAX = void 0;

var _config = require("./config.js");

const timeout = function (ms) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${ms} second`));
    }, ms * 1000);
  });
};

const AJAX = async (url, uploadData = undefined) => {
  try {
    const fetchPro = uploadData ? fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(uploadData)
    }) : fetch(url);
    const res = await Promise.race([fetchPro, timeout(_config.TIMEOUT_MILISEC)]);
    let data;

    try {
      data = await res.json();
    } catch (err) {
      return res.body;
    }

    if (!res.ok) throw new Error(`${data.error} (${res.status})`);
    return data;
  } catch (err) {
    console.error(`AJAX: ${err.toString()}`);
    throw err;
  }
};

exports.AJAX = AJAX;
},{"./config.js":"js/config.js"}],"js/model.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.downloadImage = exports.registerName = exports.state = void 0;

var model = _interopRequireWildcard(require("./model.js"));

var _helpers = require("./helpers.js");

var consts = _interopRequireWildcard(require("./config"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const state = {
  name: '',
  password: '',
  page: consts.REGISTER_PAGE
};
exports.state = state;

const registerName = async username => {
  try {
    if (!_validateName(username)) {
      return "Error: Invalid input. Name must contain english letters only.";
    }

    state.name = username;
    const password = await (0, _helpers.AJAX)(`${consts.REST_API_URL}/register`, {
      name: username
    });
    return password;
  } catch (err) {
    console.error(`model.registerName --> ${err}`);
    return err.toString();
  }
};

exports.registerName = registerName;

const downloadImage = async user => {
  try {
    const downloadBlocked = _validateDownloadCredentials(user);

    if (downloadBlocked) {
      return downloadBlocked;
    }

    state.name = user.name;
    state.password = user.password;
    const url = new URL(`${consts.HTTP_API_URL}/download`);
    const params = user;
    url.search = new URLSearchParams(params).toString();
    const binary = await (0, _helpers.AJAX)(url);
    console.log(binary);
    return binary;
  } catch (err) {
    console.log(err);
    return err.toString();
  }
};

exports.downloadImage = downloadImage;

const _validateDownloadCredentials = user => {
  if (!user) {
    return "Error: Invalid input.";
  }

  if (!user.name) {
    return "Error: Invalid input. Empty name field.";
  }

  if (!user.password) {
    return "Error: Invalid input. Empty password field.";
  }

  if (!_validateName(user.name)) {
    return "Error: Invalid input. Name must contain english letters only.";
  }

  if (!_validatePassword(user.password)) {
    return "Error: Invalid input. Password must contain english letters and digits only.";
  }

  return null;
};

const _validateName = nameStr => {
  return nameStr && nameStr.match(/[a-zA-z]/g).length === nameStr.length;
};

const _validatePassword = passwordStr => {
  return passwordStr && passwordStr.match(/[a-zA-z0-9]/g).length === passwordStr.length;
};
},{"./model.js":"js/model.js","./helpers.js":"js/helpers.js","./config":"js/config.js"}],"js/views/registerView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const _parentEl = document.querySelector('.register');

const _togglePasswordDivDisplay = () => {
  const passwordDiv = _parentEl.querySelector('.password');

  passwordDiv.style.display = passwordDiv.style.display === 'none' ? '' : 'none';
};

const _renderMsg = (msg, isError = false) => {
  const passwordLabel = document.getElementById('register-password');
  passwordLabel.innerHTML = msg;

  if (isError) {
    passwordLabel.style.color = 'red';
  } else {
    passwordLabel.style.color = 'green';
  }

  _togglePasswordDivDisplay();
};

class RegisterView {
  getInput() {
    try {
      const name = _parentEl.getElementsByTagName('input').namedItem('name').value;

      return name;
    } catch (err) {
      console.error(`RegisterView.getInput --> ${error}`);
      return null;
    }
  }

  addHandlerRegister(handler) {
    _parentEl.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }

  renderError(errorMsg) {
    _renderMsg(errorMsg, true);
  }

  renderPassword(password) {
    _renderMsg(password);
  }

  hideRegisterForm() {
    _parentEl.style.display = 'none';
  }

  showRegisterForm() {
    _parentEl.style.display = 'block';
  }

}

var _default = new RegisterView();

exports.default = _default;
},{}],"js/views/stepperView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const _parentEl = document.querySelector('.stepper');

class StepperView {
  enableNext() {
    const nextButton = document.getElementById('btnNext');
    nextButton.disabled = false;
  }

  disableNext() {
    const nextButton = document.getElementById('btnNext');
    nextButton.disabled = true;
  }

  enablePrev() {
    const nextButton = document.getElementById('btnPrev');
    nextButton.disabled = false;
  }

  disablePrev() {
    const nextButton = document.getElementById('btnPrev');
    nextButton.disabled = true;
  }

  addHandlerNext(handler) {
    document.getElementById('btnNext').addEventListener('click', e => {
      e.preventDefault();
      handler();
    });
  }

  addHandlerPrevious(handler) {
    document.getElementById('btnPrev').addEventListener('click', e => {
      e.preventDefault();
      handler();
    });
  }

}

var _default = new StepperView();

exports.default = _default;
},{}],"js/views/downloadView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const _parentEl = document.querySelector('.download');

class DownloadView {
  hideDownloadForm() {
    _parentEl.style.display = 'none';
  }

  showDownloadForm() {
    _parentEl.style.display = 'block';
  }

  updateNameLabel(name) {
    const label = _parentEl.getElementsByTagName('input').namedItem('name');

    console.log(label);
    label.value = name;
  }

  getUser() {
    return {
      name: _parentEl.getElementsByTagName('input').namedItem('name').value,
      password: _parentEl.getElementsByTagName('input').namedItem('password').value
    };
  }

}

var _default = new DownloadView();

exports.default = _default;
},{}],"js/views/imageView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const _parentEl = document.querySelector('.downloaded-image');

class ImageView {
  hideImagePane() {
    _parentEl.style.display = 'none';
  }

  showImagePane() {
    _parentEl.style.display = 'block';
  }

}

var _default = new ImageView();

exports.default = _default;
},{}],"js/controller.js":[function(require,module,exports) {
"use strict";

var model = _interopRequireWildcard(require("./model"));

var _registerView = _interopRequireDefault(require("./views/registerView"));

var _stepperView = _interopRequireDefault(require("./views/stepperView"));

var _downloadView = _interopRequireDefault(require("./views/downloadView"));

var _imageView = _interopRequireDefault(require("./views/imageView"));

var consts = _interopRequireWildcard(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const controlRegisterName = async () => {
  const inputName = _registerView.default.getInput();

  const password = await model.registerName(inputName);

  if (!password) {
    _registerView.default.renderError('Could not get password from server');
  } else if (password.includes('Error')) {
    _registerView.default.renderError(password);

    _stepperView.default.disableNext();
  } else {
    _registerView.default.renderPassword(password);

    _stepperView.default.enableNext();
  }
};

const controlStepperNext = () => {
  if (model.state.page === consts.REGISTER_PAGE) {
    _registerView.default.hideRegisterForm();

    _downloadView.default.showDownloadForm();

    _downloadView.default.updateNameLabel(model.state.name);

    _stepperView.default.enablePrev();

    model.state.page = consts.DOWNLOAD_PAGE;
  } else if (model.state.page === consts.DOWNLOAD_PAGE) {
    _downloadView.default.hideDownloadForm();

    _imageView.default.showImagePane();
    /*imageView.renderImage*/


    model.downloadImage(_downloadView.default.getUser());

    _stepperView.default.disableNext();

    model.state.page = consts.IMAGE_PAGE;
  }
};

const controlStepperPrevious = () => {
  if (model.state.page === consts.DOWNLOAD_PAGE) {
    _downloadView.default.hideDownloadForm();

    _registerView.default.showRegisterForm();

    _stepperView.default.disablePrev();

    _stepperView.default.enableNext();

    model.state.page = consts.REGISTER_PAGE;
  }
};

const init = () => {
  _registerView.default.addHandlerRegister(controlRegisterName);

  _stepperView.default.addHandlerNext(controlStepperNext);

  _stepperView.default.addHandlerPrevious(controlStepperPrevious);
};

init();
},{"./model":"js/model.js","./views/registerView":"js/views/registerView.js","./views/stepperView":"js/views/stepperView.js","./views/downloadView":"js/views/downloadView.js","./views/imageView":"js/views/imageView.js","./config":"js/config.js"}],"../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55285" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel/src/builtins/hmr-runtime.js","js/controller.js"], null)
//# sourceMappingURL=/controller.f22f2928.js.map