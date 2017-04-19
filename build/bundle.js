/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _App = __webpack_require__(1);
	
	var _App2 = _interopRequireDefault(_App);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	(function main() {
	  var app = new _App2.default();
	  window.addEventListener('load', app.onLoad.bind(app));
	  window.addEventListener('resize', app.onResize.bind(app), false);
	})();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Grid = __webpack_require__(2);
	
	var _Grid2 = _interopRequireDefault(_Grid);
	
	var _Player = __webpack_require__(4);
	
	var _Player2 = _interopRequireDefault(_Player);
	
	var _RenderEngine = __webpack_require__(6);
	
	var _RenderEngine2 = _interopRequireDefault(_RenderEngine);
	
	var _Sprite = __webpack_require__(7);
	
	var _Sprite2 = _interopRequireDefault(_Sprite);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ASSETS = './assets';
	var SERVER_URL = 'ws://localhost:8000/play';
	
	var App = function () {
	  function App() {
	    _classCallCheck(this, App);
	
	    this.canvas = document.createElement('canvas');
	    // Aspect ratio of 3:2
	    // this.canvas.width = 960;
	    // this.canvas.height = 640;
	    this.canvas.width = 480;
	    this.canvas.height = 320;
	    this.spriteSrc = ASSETS + '/sprites.png';
	  }
	
	  _createClass(App, [{
	    key: 'setup',
	    value: function setup() {
	      // this.setupWebsocket();
	      this.setupEventListeners();
	      this.grid = new _Grid2.default(100);
	      this.player = new _Player2.default(this.grid);
	      this.re = new _RenderEngine2.default(this.canvas, this.sprite, this.grid, this.player);
	      this.re.render();
	    }
	  }, {
	    key: 'setupWebsocket',
	    value: function setupWebsocket() {
	      var ws = new WebSocket(SERVER_URL);
	      ws.onopen = function () {
	        console.log('websocket connection opened');
	        ws.send('ping');
	      };
	      ws.onmessage = function (evt) {
	        console.log('evt received ' + evt);
	      };
	      ws.onclose = function () {
	        console.log('websocket connection closed');
	      };
	    }
	  }, {
	    key: 'setupEventListeners',
	    value: function setupEventListeners() {
	      var _this = this;
	
	      window.addEventListener('keydown', function (event) {
	        switch (event.keyCode) {
	          case 37:
	            _this.player.move("left");
	            break;
	          case 38:
	            _this.player.move("down");
	            break;
	          case 39:
	            _this.player.move("right");
	            break;
	          case 40:
	            _this.player.move("up");
	            break;
	        }
	        _this.re.render();
	      });
	    }
	  }, {
	    key: 'onLoad',
	    value: function onLoad() {
	      var _this2 = this;
	
	      document.body.appendChild(this.canvas);
	      this.sprite = new _Sprite2.default(this.spriteSrc, function () {
	        _this2.setup();
	      });
	    }
	  }, {
	    key: 'onUpdate',
	    value: function onUpdate() {}
	  }, {
	    key: 'onResize',
	    value: function onResize() {}
	  }]);
	
	  return App;
	}();
	
	exports.default = App;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Tile = __webpack_require__(3);
	
	var _Tile2 = _interopRequireDefault(_Tile);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var BLACK = new _Tile2.default('0');
	
	var Grid = function () {
	  function Grid(size) {
	    _classCallCheck(this, Grid);
	
	    this.size = size;
	    this.grid = new Array(this.size);
	    for (var i = 0; i < this.size; i++) {
	      this.grid[i] = new Array(this.size);
	    }
	    for (var _i = 0; _i < this.size; _i++) {
	      for (var j = 0; j < this.size; j++) {
	        if (Math.random() > 0.5) {
	          this.grid[_i][j] = new _Tile2.default('1');
	        } else {
	          this.grid[_i][j] = new _Tile2.default('2');
	        }
	      }
	    }
	  }
	
	  _createClass(Grid, [{
	    key: 'getTile',
	    value: function getTile(x, y) {
	      if (0 <= x && x < this.size && 0 <= y && y < this.size) {
	        return this.grid[x][y];
	      } else {
	        return BLACK;
	      }
	    }
	  }, {
	    key: 'spawnRandomPokemonLocations',
	    value: function spawnRandomPokemonLocations() {
	      for (var i = 0; i < this.size; i++) {
	        for (var j = 0; j < this.size; j++) {
	          var rand = Math.random();
	          if (rand > 0.5) {
	            this.grid[i][j].symbol = '1';
	          }
	        }
	      }
	    }
	  }, {
	    key: 'generateWildPokemonAreas',
	    value: function generateWildPokemonAreas() {}
	  }]);
	
	  return Grid;
	}();
	
	exports.default = Grid;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Tile = function Tile(sym) {
	  _classCallCheck(this, Tile);
	
	  this.spriteTextureCoords = null;
	  this.symbol = sym;
	  this.traversable = true;
	};
	
	exports.default = Tile;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Viewport = __webpack_require__(5);
	
	var _Viewport2 = _interopRequireDefault(_Viewport);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Player = function () {
	  function Player(grid) {
	    _classCallCheck(this, Player);
	
	    this.pos = { x: 10, y: 10 };
	    this.grid = grid;
	    this.viewport = new _Viewport2.default(grid, this.pos);
	  }
	
	  _createClass(Player, [{
	    key: 'move',
	    value: function move(dir) {
	      switch (dir) {
	        case 'right':
	          if (this.pos.x + 1 < this.grid.size) {
	            this.pos.x += 1;
	          }
	          break;
	        case 'left':
	          if (this.pos.x - 1 >= 0) {
	            this.pos.x -= 1;
	          }
	          break;
	        case 'up':
	          if (this.pos.y + 1 < this.grid.size) {
	            this.pos.y += 1;
	          }
	          break;
	        case 'down':
	          if (this.pos.y - 1 >= 0) {
	            this.pos.y -= 1;
	          }
	          break;
	      }
	      this.viewport.updateFocus(this.pos.x, this.pos.y);
	    }
	  }]);
	
	  return Player;
	}();
	
	exports.default = Player;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Tile = __webpack_require__(3);
	
	var _Tile2 = _interopRequireDefault(_Tile);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var PLAYER = 'P';
	
	var Viewport = function () {
	  function Viewport(grid, pos) {
	    _classCallCheck(this, Viewport);
	
	    this.width = 15;
	    this.height = 11;
	    this.halfWidth = Math.floor(this.width / 2);
	    this.halfHeight = Math.floor(this.height / 2);
	
	    this.cells = new Array(this.width);
	    for (var i = 0; i < this.width; i++) {
	      this.cells[i] = new Array(this.height);
	    }
	    this.focus = { x: pos.x, y: pos.y };
	    this.grid = grid;
	    this._sampleTiles();
	  }
	
	  _createClass(Viewport, [{
	    key: 'updateFocus',
	    value: function updateFocus(x, y) {
	      this.focus.x = x;
	      this.focus.y = y;
	      this._sampleTiles();
	    }
	  }, {
	    key: '_sampleTiles',
	    value: function _sampleTiles() {
	      for (var i = 0; i < this.width; i++) {
	        for (var j = 0; j < this.height; j++) {
	          var x = i + this.focus.x - this.halfWidth;
	          var y = j + this.focus.y - this.halfHeight;
	          this.cells[i][j] = this.grid.getTile(x, y);
	        }
	      }
	      this.cells[Math.floor(this.width / 2)][Math.floor(this.height / 2)] = new _Tile2.default(PLAYER);
	    }
	  }]);
	
	  return Viewport;
	}();
	
	exports.default = Viewport;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var TILEMAP = {
	  '0': { x: 32, y: 304 },
	  '1': { x: 16, y: 16 },
	  '2': { x: 48, y: 16 },
	  'P': { x: 7 * 16, y: 16 }
	};
	
	var RenderEngine = function () {
	  function RenderEngine(canvas, sprite, grid, player) {
	    _classCallCheck(this, RenderEngine);
	
	    // canvas is 960 x 640
	    this.canvas = canvas;
	    this.ctx = canvas.getContext('2d');
	    this.sprite = sprite;
	    this.grid = grid;
	    this.player = player;
	    this.viewport = player.viewport;
	  }
	
	  _createClass(RenderEngine, [{
	    key: 'render',
	    value: function render() {
	      for (var i = 0; i < this.viewport.width; i++) {
	        for (var j = 0; j < this.viewport.height; j++) {
	          this.drawTile(this.viewport.cells[i][j].symbol, i, j);
	        }
	      }
	    }
	  }, {
	    key: 'drawTile',
	    value: function drawTile(tile, x, y) {
	      var spritePos = TILEMAP[tile];
	      var _sprite = this.sprite,
	          tileHeight = _sprite.tileHeight,
	          tileWidth = _sprite.tileWidth;
	
	
	      var canvasTileWidth = this.canvas.width / this.viewport.width;
	      var canvasTileHeight = this.canvas.height / this.viewport.height;
	      var canvasPosx = x * canvasTileWidth;
	      var canvasPosy = y * canvasTileHeight;
	      this.ctx.drawImage(this.sprite.image, spritePos.x, spritePos.y, tileWidth, tileHeight, canvasPosx, canvasPosy, canvasTileWidth, canvasTileHeight);
	    }
	  }]);
	
	  return RenderEngine;
	}();
	
	exports.default = RenderEngine;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Sprite = function () {
	  function Sprite(src, onload) {
	    _classCallCheck(this, Sprite);
	
	    this.image = new Image();
	    this.image.src = src;
	    this.image.onload = onload;
	    this.tileWidth = 16;
	    this.tileHeight = 16;
	    this.width = this.image.clientWidth / this.tileWidth;
	    this.height = this.image.clientHeight / this.tileHeight;
	  }
	
	  _createClass(Sprite, [{
	    key: "getTile",
	    value: function getTile(x, y) {
	      return { x: x * this.width, y: y * this.height };
	    }
	  }]);
	
	  return Sprite;
	}();
	
	exports.default = Sprite;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map