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
	
	var _World = __webpack_require__(2);
	
	var _World2 = _interopRequireDefault(_World);
	
	var _RenderEngine = __webpack_require__(21);
	
	var _RenderEngine2 = _interopRequireDefault(_RenderEngine);
	
	var _Sprite = __webpack_require__(22);
	
	var _Sprite2 = _interopRequireDefault(_Sprite);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	window.DEBUG_MODE = 1;
	var ASSETS = './assets';
	var SERVER_URL = 'wss://davidliao.me:8000/play';
	var LOCAL_SERVER_URL = 'ws://localhost:8000/play';
	var RESOLUTION_SCALE = 3;
	
	var App = function () {
	  function App() {
	    _classCallCheck(this, App);
	
	    this.canvas = document.createElement('canvas'); // Aspect ratio of 3:2
	    this.canvas.width = 240 * RESOLUTION_SCALE;
	    this.canvas.height = 160 * RESOLUTION_SCALE;
	    this.canvas.className = 'viewport';
	    this.terrainSpriteSrc = ASSETS + '/biomes.png';
	    this.pokemonSpriteSrc = ASSETS + '/pokemon.png';
	    this.playerSpriteSrc = ASSETS + '/player.png';
	    this.clientID = -1; // default null value for client ID
	
	    if (window.DEBUG_MODE === 1) {
	      window.debugCanvas = document.createElement('canvas');
	      window.debugCanvas.width = 256;
	      window.debugCanvas.height = 256;
	      window.debugCanvas.className = 'debug-canvas';
	      window.debugCanvas.style.visibility = 'hidden';
	    }
	  }
	
	  _createClass(App, [{
	    key: 'resolveParams',
	    value: function resolveParams() {
	      var url = window.location.href;
	      if (!url.includes("?")) {
	        this.seed = 0;
	        this.num_areas = 6;
	      } else {
	        var params = url.split('?');
	        var tokens = params[1].split('&');
	        var seed = tokens[0].split('=');
	        var num_areas = tokens[1].split('=');
	        this.seed = seed[1];
	        this.num_areas = num_areas[1];
	      }
	    }
	  }, {
	    key: 'setup',
	    value: function setup() {
	      this.setupWebsocket();
	      this.setupGame();
	      this.setupEventListeners();
	    }
	  }, {
	    key: 'setupGame',
	    value: function setupGame() {
	      this.resolveParams();
	      this.world = new _World2.default(this.num_areas);
	      this.re = new _RenderEngine2.default(this.canvas, this.terrainSprite, this.playerSprite, this.pokemonSprite, this.world);
	    }
	  }, {
	    key: 'setupEventListeners',
	    value: function setupEventListeners() {
	      var _this = this;
	
	      window.addEventListener('keydown', function (event) {
	        var me = _this.world.getMe();
	        switch (event.keyCode) {
	          case 32:
	            var style = window.debugCanvas.style;
	            style.visibility = style.visibility === 'visible' ? 'hidden' : 'visible';
	            console.log(me.pos, _this.world.getTile(me.pos.x, me.pos.y));
	            break;
	          case 37:
	            me.move('left', _this.world);
	            break;
	          case 38:
	            me.move('up', _this.world);
	            break;
	          case 39:
	            me.move('right', _this.world);
	            break;
	          case 40:
	            me.move('down', _this.world);
	            break;
	        }
	        _this.sendEvent('update', {
	          message: 'syncing shit',
	          update: {
	            delta: [me]
	          }
	        });
	        _this.re.render();
	      });
	    }
	  }, {
	    key: 'onLoad',
	    value: function onLoad() {
	      var _this2 = this;
	
	      var container = document.createElement('div');
	      container.className = 'viewport-container';
	      container.appendChild(this.canvas);
	      document.body.appendChild(container);
	      if (window.DEBUG_MODE === 1) {
	        container.appendChild(window.debugCanvas);
	        document.body.appendChild(container);
	      }
	      // TODO: turn into Promise.All instead of callback chain
	      this.terrainSprite = new _Sprite2.default(this.terrainSpriteSrc, 16, 16, function () {
	        _this2.pokemonSprite = new _Sprite2.default(_this2.pokemonSpriteSrc, 64, 64, function () {
	          _this2.playerSprite = new _Sprite2.default(_this2.playerSpriteSrc, 25, 30, function () {
	            _this2.setup();
	          });
	        });
	      });
	    }
	  }, {
	    key: 'onResize',
	    value: function onResize() {}
	  }, {
	    key: 'itsAlive',
	    value: function itsAlive() {
	      var _this3 = this;
	
	      this.interval = setInterval(function () {
	        var rerender = _this3.world.morph();
	        if (rerender) {
	          _this3.re.render();
	          if (window.DEBUG_MODE === 1) {
	            _this3.re.debugRendered = false;
	          }
	        }
	      }, 20000);
	    }
	
	    /**********************
	      WebSocket Shenanigans
	     **********************/
	
	  }, {
	    key: 'setupWebsocket',
	    value: function setupWebsocket() {
	      this.ws = new WebSocket(SERVER_URL);
	      this.ws.onopen = this.onWSOpen.bind(this);
	      this.ws.onmessage = this.receiveEvent.bind(this);
	    }
	  }, {
	    key: 'onWSOpen',
	    value: function onWSOpen() {
	      this.sendEvent('init', { message: 'initializing connection and awaiting id assignment' });
	    }
	  }, {
	    key: 'sendEvent',
	    value: function sendEvent(type, data) {
	      var m = {
	        type: type,
	        data: data,
	        id: this.clientID
	      };
	      this.ws.send(JSON.stringify(m));
	    }
	  }, {
	    key: 'receiveEvent',
	    value: function receiveEvent(e) {
	      var _JSON$parse = JSON.parse(e.data),
	          type = _JSON$parse.type,
	          data = _JSON$parse.data,
	          id = _JSON$parse.id;
	
	      switch (type) {
	        case 'init':
	          this.clientID = id;
	          this.world.initWorld(data.init.world, id);
	          this.itsAlive();
	          break;
	        case 'add':
	          this.world.addAgents(data.update.add);
	          break;
	        case 'update':
	          this.world.updateAgents(data.update.delta);
	          break;
	        case 'delete':
	          this.world.deleteAgents(data.update.delete);
	          break;
	        default:
	          console.log('event not handled', e.data);
	          return;
	      }
	      this.re.render();
	    }
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
	
	var _Agent = __webpack_require__(4);
	
	var _Agent2 = _interopRequireDefault(_Agent);
	
	var _Area = __webpack_require__(5);
	
	var _Area2 = _interopRequireDefault(_Area);
	
	var _Util = __webpack_require__(7);
	
	var _Route = __webpack_require__(20);
	
	var _Route2 = _interopRequireDefault(_Route);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var World = function () {
	  function World(num_areas) {
	    _classCallCheck(this, World);
	
	    this.agents = {};
	    this.areas = [];
	    this.routes = [];
	    this.num_areas = num_areas;
	  }
	
	  _createClass(World, [{
	    key: 'getTile',
	    value: function getTile(x, y) {
	      if (0 <= x && x < this.size && 0 <= y && y < this.size) {
	        return this.grid[x][y];
	      } else {
	        return null;
	      }
	    }
	  }, {
	    key: 'initWorld',
	    value: function initWorld(world, myID) {
	      var agents = world.agents,
	          size = world.size,
	          seed = world.seed;
	
	      this.me = myID;
	      for (var id in agents) {
	        var agentID = parseInt(id);
	        this.agents[agentID] = new _Agent2.default(agents[id]);
	      }
	
	      _Util.util.seed(seed);
	      this.size = size;
	
	      // creating grid[]
	      this.grid = new Array(size);
	      for (var i = 0; i < size; i++) {
	        this.grid[i] = new Array(size);
	      }
	
	      // creating areas
	      this.defineNPAreas();
	      this.defineAreas();
	      this.defineAreaContent();
	      this.defineNPContent();
	      this.fillAreas();
	      this.fillRoutes();
	      this.repairWorld();
	    }
	  }, {
	    key: 'defineNPAreas',
	    value: function defineNPAreas() {
	      for (var i = 0; i < this.size; i++) {
	        for (var j = 0; j < this.size; j++) {
	          this.grid[i][j] = new _Tile2.default('0', false);
	        }
	      }
	    }
	  }, {
	    key: 'generateArea',
	    value: function generateArea(x, y) {
	      var padding = 30;
	      var sx = Math.floor(_Util.util.random() * this.size / 16 + this.size / 16);
	      var sy = Math.floor(_Util.util.random() * this.size / 16 + this.size / 16);
	      while (x + sx / 2 > this.size - padding || x - sx / 2 < padding) {
	        sx = Math.floor(_Util.util.random() * this.size);
	      }
	      while (y + sy / 2 > this.size - padding || y - sy / 2 < padding) {
	        sy = Math.floor(_Util.util.random() * this.size);
	      }
	      sx += sx % 2 === 0 ? 0 : 2 - sx % 2;
	      sy += sy % 3 === 0 ? 0 : 3 - sy % 3;
	      var area = new _Area2.default(x, y, sx, sy, 3, true, true);
	      this.areas.push(area);
	      return area;
	    }
	  }, {
	    key: 'defineAreas',
	    value: function defineAreas() {
	      // init area
	      var numAreas = this.num_areas;
	      var areaCnt = 1;
	      var stack = [];
	      var area = this.generateArea(256, 256);
	
	      var route = void 0;
	      var prev = void 0;
	      stack.push(area);
	      while (stack.length !== 0) {
	        area = stack.shift();
	        var num = _Util.util.random();
	        // let num = 0;
	        if (num < 0.5) {
	          // one path
	          var len = Math.floor(_Util.util.random() * 64 + 32);
	          var dir = Math.floor(_Util.util.random() * 4);
	          while (area.prev === dir) {
	            dir = Math.floor(_Util.util.random() * 4);
	          }
	          switch (dir) {
	            case 0:
	              route = this.generateRoute(area, len, 'north');
	              route.a2.prev = 0;
	              break;
	            case 1:
	              route = this.generateRoute(area, len, 'south');
	              route.a2.prev = 1;
	              break;
	            case 2:
	              route = this.generateRoute(area, len, 'east');
	              route.a2.prev = 2;
	              break;
	            case 3:
	              route = this.generateRoute(area, len, 'west');
	              route.a2.prev = 3;
	              break;
	          }
	          this.routes.push(route);
	          areaCnt += 1;
	          if (areaCnt < numAreas) {
	            stack.push(route.a2);
	          } else {
	            break;
	          }
	        } else {
	          // two paths
	          // one path
	          var route1 = void 0,
	              route2 = void 0;
	          var _len = Math.floor(_Util.util.random() * 64 + 32);
	          if (area.prev === 2 || area.prev === 3) {
	            route1 = this.generateRoute(area, _len, 'north');
	            route2 = this.generateRoute(area, _len, 'south');
	            route1.a2.prev = 0;
	            route2.a2.prev = 1;
	          } else {
	            route1 = this.generateRoute(area, _len, 'east');
	            route2 = this.generateRoute(area, _len, 'west');
	            route1.a2.prev = 2;
	            route2.a2.prev = 3;
	          }
	          this.routes.push(route1, route2);
	          areaCnt += 2;
	          if (areaCnt < numAreas) {
	            stack.push(route1.a2);
	            stack.push(route2.a2);
	          } else {
	            break;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'generateRoute',
	    value: function generateRoute(area, len, dir) {
	      var x = area.x,
	          y = area.y;
	
	      var newX = void 0,
	          newY = void 0,
	          newArea = void 0,
	          route = void 0;
	      switch (dir) {
	        case 'north':
	          while (area.y - len < 0) {
	            len = Math.floor(_Util.util.random() * len);
	          }
	          newX = x;
	          newY = y - len;
	          area.outlets.push({ x: x, y: y - area.sy });
	          newArea = this.generateArea(newX, newY);
	          newArea.outlets.push({ x: newX, y: newY + newArea.ry });
	          route = new _Route2.default(area, newArea, newArea.biome, 'v');
	          this.drawRoute(route, 'y');
	          break;
	        case 'south':
	          while (area.y + len > this.size) {
	            len = Math.floor(_Util.util.random() * len);
	          }
	          newX = x;
	          newY = y + len;
	          area.outlets.push({ x: x, y: y + area.sy });
	          newArea = this.generateArea(newX, newY);
	          newArea.outlets.push({ x: newX, y: newY - newArea.ry });
	          route = new _Route2.default(area, newArea, newArea.biome, 'v');
	          this.drawRoute(route, 'y');
	          break;
	        case 'east':
	          while (area.x + len > this.size) {
	            len = Math.floor(_Util.util.random() * len);
	          }
	          newX = x + len;
	          newY = y;
	          area.outlets.push({ x: x + area.rx, y: y });
	          newArea = this.generateArea(newX, newY);
	          newArea.outlets.push({ x: newX - newArea.rx, y: newY });
	          route = new _Route2.default(area, newArea, newArea.biome, 'h');
	          this.drawRoute(route, 'x');
	          break;
	        case 'west':
	          while (area.y - len < 0) {
	            len = Math.floor(_Util.util.random() * len);
	          }
	          newX = x - len;
	          newY = y;
	          area.outlets.push({ x: x - area.rx, y: y });
	          newArea = this.generateArea(newX, newY);
	          newArea.outlets.push({ x: newX + newArea.rx, y: newY });
	          route = new _Route2.default(area, newArea, newArea.biome, 'h');
	          this.drawRoute(route, 'x');
	          break;
	      }
	      return route;
	    }
	
	    // connect a1 to a2
	
	  }, {
	    key: 'drawRoute',
	    value: function drawRoute(route, dir) {
	      var a1 = route.a1,
	          a2 = route.a2;
	
	      var pathRadius = 8;
	      var del = void 0;
	      var a1x = a1.x;
	      var a1y = a1.y;
	      if (dir === 'x') {
	        del = a2.x - a1.x;
	        for (var i = 0; i < Math.abs(del); i++) {
	          a1x += Math.sign(del);
	          for (var j = -pathRadius; j < pathRadius; j++) {
	            if (0 <= a1y + j && a1y + j < this.size) {
	              this.grid[a1x][a1y + j] = new _Tile2.default(route.biome, true);
	            }
	          }
	        }
	      } else {
	        del = a2.y - a1.y;
	        for (var _i = 0; _i < Math.abs(del); _i++) {
	          a1y += Math.sign(del);
	          for (var _j = -pathRadius; _j < pathRadius; _j++) {
	            if (0 <= a1x + _j && a1x + _j < this.size) {
	              this.grid[a1x + _j][a1y] = new _Tile2.default(route.biome, true);
	            }
	          }
	        }
	      }
	    }
	  }, {
	    key: 'defineAreaContent',
	    value: function defineAreaContent() {
	      // draw cities
	      for (var c = 0; c < this.areas.length; c++) {
	        var area = this.areas[c];
	        for (var i = Math.floor(area.x - area.rx); i < area.x + area.rx; i++) {
	          for (var j = Math.floor(area.y - area.ry); j < area.y + area.ry; j++) {
	            if (0 <= i && i < this.size && 0 <= j && j < this.size) {
	              this.grid[i][j] = new _Tile2.default(area.biome, true);
	            }
	          }
	        }
	      }
	    }
	  }, {
	    key: 'defineNPContent',
	    value: function defineNPContent() {
	      for (var i = 0; i < this.size; i++) {
	        for (var j = 0; j < this.size; j++) {
	          // check if this is NP tile
	          var npTile = this.grid[i][j];
	          if (npTile.traversable === false && i + 1 < this.size && i - 1 >= 0) {
	            // check if this is a up, down, left, right
	            var uTile = this.grid[i][j - 1];
	            if (uTile !== undefined && (uTile.spriteID === 'grass' || uTile.spriteID === 'sand')) {
	              this.grid[i][j] = new _Tile2.default('mtn-d', false, 0, -1);
	              for (var k = 1; k < 5; k++) {
	                this.grid[i][j + k] = new _Tile2.default('mtn-d', false, 0, 0);
	              }
	              continue;
	            } else if (uTile !== undefined && uTile.spriteID === 'water') {
	              // let rand = util.random();
	              this.grid[i][j] = new _Tile2.default('wtr-1', false);
	              for (var _k = 1; _k < 5; _k++) {
	                this.grid[i][j + _k] = new _Tile2.default('dwater', false);
	              }
	              continue;
	            }
	            var dTile = this.grid[i][j + 1];
	            if (dTile !== undefined && (dTile.spriteID === 'grass' || dTile.spriteID === 'sand')) {
	              this.grid[i][j] = new _Tile2.default('mtn-d', false, 0, 1);
	              for (var _k2 = 1; _k2 < 5; _k2++) {
	                this.grid[i][j - _k2] = new _Tile2.default('mtn-d', false, 0, 0);
	              }
	              continue;
	            } else if (dTile !== undefined && dTile.spriteID === 'water') {
	              this.grid[i][j] = new _Tile2.default('wtr-1', false);
	              for (var _k3 = 1; _k3 < 5; _k3++) {
	                this.grid[i][j - _k3] = new _Tile2.default('dwater', false);
	              }
	              continue;
	            }
	            var lTile = this.grid[i - 1][j];
	            if (lTile !== undefined && (lTile.spriteID === 'grass' || lTile.spriteID === 'sand')) {
	              this.grid[i][j] = new _Tile2.default('mtn-d', false, -1, 0);
	              for (var _k4 = 1; _k4 < 7; _k4++) {
	                this.grid[i + _k4][j] = new _Tile2.default('mtn-d', false, 0, 0);
	              }
	              continue;
	            } else if (lTile !== undefined && lTile.spriteID === 'water') {
	              this.grid[i][j] = new _Tile2.default('wtr-1', false);
	              for (var _k5 = 1; _k5 < 7; _k5++) {
	                this.grid[i + _k5][j] = new _Tile2.default('dwater', false);
	              }
	              continue;
	            }
	
	            var rTile = this.grid[i + 1][j];
	            if (rTile !== undefined && (rTile.spriteID === 'grass' || rTile.spriteID === 'sand')) {
	              this.grid[i][j] = new _Tile2.default('mtn-d', false, 1, 0);
	              for (var _k6 = 1; _k6 < 7; _k6++) {
	                this.grid[i - _k6][j] = new _Tile2.default('mtn-d', false, 0, 0);
	              }
	              continue;
	            } else if (rTile !== undefined && rTile.spriteID === 'water') {
	              this.grid[i][j] = new _Tile2.default('wtr-1', false);
	              for (var _k7 = 1; _k7 < 7; _k7++) {
	                this.grid[i - _k7][j] = new _Tile2.default('dwater', false);
	              }
	              continue;
	            }
	
	            // check for corners
	            var urTile = this.grid[i + 1][j + 1];
	            if (urTile !== undefined && (urTile.spriteID === 'grass' || urTile.spriteID === 'sand')) {
	              this.grid[i][j] = new _Tile2.default('mtn-d', false, 2, -1);
	              // double for loop to fill in the 'rectangle'
	              for (var _k8 = 0; _k8 < 7; _k8++) {
	                for (var l = 0; l < 5; l++) {
	                  if (i - _k8 >= 0 && j - l >= 0 && this.grid[i - _k8][j - l].spriteID === '0') {
	                    this.grid[i - _k8][j - l] = new _Tile2.default('mtn-d', false, 0, 0);
	                  }
	                }
	              }
	            }
	
	            var ulTile = this.grid[i - 1][j + 1];
	            if (ulTile !== undefined && (ulTile.spriteID === 'grass' || ulTile.spriteID === 'sand')) {
	              this.grid[i][j] = new _Tile2.default('mtn-d', false, 4, -1);
	              // double for loop to fill in the 'rectangle'
	              for (var _k9 = 0; _k9 < 7; _k9++) {
	                for (var _l = 0; _l < 5; _l++) {
	                  if (_k9 === 0 && _l === 0) {
	                    continue;
	                  }
	                  if (i + _k9 < this.size && j - _l >= 0 && this.grid[i + _k9][j - _l].spriteID === '0') {
	                    this.grid[i + _k9][j - _l] = new _Tile2.default('mtn-d', false, 0, 0);
	                  }
	                }
	              }
	            }
	
	            var brTile = this.grid[i + 1][j - 1];
	            if (brTile !== undefined && (brTile.spriteID === 'grass' || brTile.spriteID === 'sand')) {
	              this.grid[i][j] = new _Tile2.default('mtn-d', false, 2, 1);
	              // double for loop to fill in the 'rectangle'
	              for (var _k10 = 0; _k10 < 7; _k10++) {
	                for (var _l2 = 0; _l2 < 5; _l2++) {
	                  if (i - _k10 >= 0 && j + _l2 < this.size && this.grid[i - _k10][j + _l2].spriteID === '0') {
	                    this.grid[i - _k10][j + _l2] = new _Tile2.default('mtn-d', false, 0, 0);
	                  }
	                }
	              }
	            }
	
	            var blTile = this.grid[i - 1][j - 1];
	            if (blTile !== undefined && (blTile.spriteID === 'grass' || blTile.spriteID === 'sand')) {
	              this.grid[i][j] = new _Tile2.default('mtn-d', false, 4, 1);
	              // double for loop to fill in the 'rectangle'
	              for (var _k11 = 0; _k11 < 7; _k11++) {
	                for (var _l3 = 0; _l3 < 5; _l3++) {
	                  if (_k11 === 0 && _l3 === 0) {
	                    continue;
	                  }
	                  if (i + _k11 < this.size && j + _l3 < this.size && this.grid[i + _k11][j + _l3].spriteID === '0') {
	                    this.grid[i + _k11][j + _l3] = new _Tile2.default('mtn-d', false, 0, 0);
	                  }
	                }
	              }
	            }
	          }
	        }
	      }
	    }
	  }, {
	    key: 'fillNPContent',
	    value: function fillNPContent(tile, i, j) {}
	  }, {
	    key: 'fillAreas',
	    value: function fillAreas() {
	      var _this = this;
	
	      this.areas.forEach(function (area) {
	        area.init(_this.grid);
	      });
	    }
	  }, {
	    key: 'fillRoutes',
	    value: function fillRoutes() {
	      var _this2 = this;
	
	      this.routes.forEach(function (route) {
	        route.init(_this2.grid);
	      });
	    }
	  }, {
	    key: 'findNearestArea',
	    value: function findNearestArea(area, exclude) {
	      var x = area.x,
	          y = area.y,
	          rx = area.rx,
	          ry = area.ry;
	
	      var min_dist = undefined;
	      var closest = undefined;
	      for (var i = 0; i < this.areas.length; i++) {
	        var a = this.areas[i];
	        if (a == area || exclude.indexOf(a) !== -1) {
	          continue;
	        }
	        var dist = Math.sqrt(Math.pow(a.x - x, 2) + Math.pow(a.y - y, 2));
	        if (dist < min_dist || min_dist === undefined) {
	          min_dist = dist;
	          closest = a;
	        }
	      }
	      return closest;
	    }
	
	    // avgDist defined by user
	
	  }, {
	    key: 'goodAvgDist',
	    value: function goodAvgDist(x, y) {
	      if (this.areas.length === 0) {
	        return true;
	      }
	      var a = void 0,
	          min_dist = void 0,
	          closest = void 0;
	      for (var i = 0; i < this.areas.length; i++) {
	        a = this.areas[i];
	        var _dist = Math.sqrt(Math.pow(a.x - x, 2) + Math.pow(a.y - y, 2));
	        if (_dist < min_dist || min_dist === undefined) {
	          min_dist = _dist;
	          closest = a;
	        }
	      }
	      // calculate distance to closest area
	      var dist = Math.sqrt(Math.pow(closest.x - x, 2) + Math.pow(closest.y - y, 2));
	      if (dist >= 30) {
	        return true;
	      }
	      return false;
	    }
	  }, {
	    key: 'repairWorld',
	    value: function repairWorld() {
	      var grid = this.grid;
	
	      for (var i = 1; i < this.size - 1; i++) {
	        for (var j = 1; j < this.size - 1; j++) {
	          var tile = grid[i][j];
	          var ntile = grid[i][j - 1];
	          var stile = grid[i][j + 1];
	          var wtile = grid[i - 1][j];
	          var etile = grid[i + 1][j];
	          if (tile.spriteID === 'sand') {
	            if (etile.spriteID === 'water' || etile.spriteID === 'R1') {
	              tile.spriteID = 'R1';
	            } else if (wtile.spriteID === 'water' || wtile.spriteID === 'R1') {
	              tile.spriteID = 'R1';
	            }
	            if (stile.spriteID === 'water' || stile.spriteID === 'R1') {
	              tile.spriteID = 'R1';
	            } else if (ntile.spriteID === 'water' || ntile.spriteID === 'R1') {
	              tile.spriteID = 'R1';
	            }
	          }
	
	          if (tile.spriteID === 'R1') {
	            tile.offset(1, 1);
	            if (grid[i + 1][j].spriteID === 'water') {
	              tile.offx += 1;
	            } else if (grid[i - 1][j].spriteID === 'water') {
	              tile.offx -= 1;
	            }
	            if (grid[i][j - 1].spriteID === 'water') {
	              tile.offy -= 1;
	            } else if (grid[i][j + 1].spriteID === 'water') {
	              tile.offy += 1;
	            }
	            if (grid[i + 1][j + 1].spriteID === 'water' && tile.offx === 1 && tile.offy === 1) {
	              tile.offset(2, -1);
	            } else if (grid[i + 1][j - 1].spriteID === 'water' && tile.offx === 1 && tile.offy === 1) {
	              tile.offset(2, -2);
	            } else if (grid[i - 1][j + 1].spriteID === 'water' && tile.offx === 1 && tile.offy === 1) {
	              tile.offset(1, -1);
	            } else if (grid[i - 1][j - 1].spriteID === 'water' && tile.offx === 1 && tile.offy === 1) {
	              tile.offset(1, -2);
	            }
	          }
	        }
	      }
	    }
	
	    // TODO: should we differentiate between agent types? :thinking:
	
	  }, {
	    key: 'addAgents',
	    value: function addAgents(agents) {
	      var _this3 = this;
	
	      agents.forEach(function (a) {
	        _this3.agents[a.id] = new _Agent2.default(a);
	      });
	    }
	  }, {
	    key: 'updateAgents',
	    value: function updateAgents(agents) {
	      var _this4 = this;
	
	      agents.forEach(function (a) {
	        _this4.agents[a.id].update(a);
	      });
	    }
	  }, {
	    key: 'deleteAgents',
	    value: function deleteAgents(agents) {
	      var _this5 = this;
	
	      agents.forEach(function (a) {
	        delete _this5.agents[a.id];
	      });
	    }
	  }, {
	    key: 'getMe',
	    value: function getMe() {
	      return this.agents[this.me];
	    }
	  }, {
	    key: 'morph',
	    value: function morph() {
	      var _this6 = this;
	
	      var needsRerender = false;
	      this.routes.forEach(function (route) {
	        var valid = true;
	        Object.keys(_this6.agents).forEach(function (agent) {
	          var a = _this6.agents[agent];
	          valid &= !_Util.util.inBound(route.x - route.rx, a.pos.x, route.x + route.rx);
	          valid &= !_Util.util.inBound(route.y - route.ry, a.pos.y, route.y + route.ry);
	        });
	        if (valid && _Util.util.random() < route.waitThatWasntThereBeforeWTF) {
	          route.init(_this6.grid);
	          needsRerender = true;
	        }
	      });
	      this.areas.forEach(function (area) {
	        var valid = true;
	        Object.keys(_this6.agents).forEach(function (agent) {
	          var a = _this6.agents[agent];
	          valid &= !_Util.util.inBound(area.x - area.rx, a.pos.x, area.x + area.rx);
	          valid &= !_Util.util.inBound(area.y - area.ry, a.pos.y, area.y + area.ry);
	        });
	        if (valid && _Util.util.random() < area.waitThatWasntThereBeforeWTF) {
	          area.init(_this6.grid);
	          needsRerender = true;
	        }
	      });
	      return needsRerender;
	    }
	  }, {
	    key: 'serialize',
	    value: function serialize() {
	      var agents = [];
	      for (var p in this.agents) {
	        agents.push(this.agents[p]);
	      }
	      return {
	        agents: agents,
	        size: this.size,
	        seed: this.seed
	      };
	    }
	  }]);
	
	  return World;
	}();
	
	exports.default = World;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Tile = function () {
	  function Tile(spriteID, t, offx, offy) {
	    _classCallCheck(this, Tile);
	
	    this.spriteID = spriteID;
	    this.pokemon = undefined;
	    this.traversable = t;
	    this.offx = offx || 0;
	    this.offy = offy || 0;
	  }
	
	  _createClass(Tile, [{
	    key: "offset",
	    value: function offset(x, y) {
	      this.offx = x;
	      this.offy = y;
	    }
	  }]);
	
	  return Tile;
	}();
	
	exports.default = Tile;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Agent = function () {
	  function Agent(agent) {
	    _classCallCheck(this, Agent);
	
	    this.update(agent);
	  }
	
	  _createClass(Agent, [{
	    key: 'move',
	    value: function move(dir, world) {
	      this.dir = dir;
	      switch (dir) {
	        case 'right':
	          if (this.pos.x + 1 < world.size && world.getTile(this.pos.x + 1, this.pos.y).traversable) {
	            this.pos.x += 1;
	          }
	          break;
	        case 'left':
	          if (this.pos.x - 1 >= 0 && world.getTile(this.pos.x - 1, this.pos.y).traversable) {
	            this.pos.x -= 1;
	          }
	          break;
	        case 'up':
	          if (this.pos.y - 1 >= 0 && world.getTile(this.pos.x, this.pos.y - 1).traversable) {
	            this.pos.y -= 1;
	          }
	          break;
	        case 'down':
	          if (this.pos.y + 1 < world.size && world.getTile(this.pos.x, this.pos.y + 1).traversable) {
	            this.pos.y += 1;
	          }
	          break;
	      }
	    }
	  }, {
	    key: 'moveTo',
	    value: function moveTo(pos) {
	      this.pos.x = pos.x;
	      this.pos.y = pos.y;
	    }
	  }, {
	    key: 'update',
	    value: function update(agent) {
	      this.type = agent.type;
	      this.pos = agent.pos;
	      this.id = agent.id;
	      this.spriteID = agent.spriteID;
	      this.dir = agent.dir;
	    }
	
	    // Deprecated and replaced by `update` which handles deserializing -- David
	
	  }, {
	    key: 'serialize',
	    value: function serialize() {
	      return {
	        pos: {
	          x: this.pos.x,
	          y: this.pos.y
	        },
	        id: this.id
	      };
	    }
	  }]);
	
	  return Agent;
	}();
	
	exports.default = Agent;

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
	
	var _Structure = __webpack_require__(6);
	
	var _Structure2 = _interopRequireDefault(_Structure);
	
	var _Util = __webpack_require__(7);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Area = function () {
	  function Area(x, y, sx, sy, numHouses, pokemart, pokecenter) {
	    _classCallCheck(this, Area);
	
	    this.x = x;
	    this.y = y;
	    this.sx = sx; // TODO: figure out if rx is radius or diameter
	    this.sy = sy;
	    this.rx = Math.floor(sx / 2);
	    this.ry = Math.floor(sy / 2);
	    this.numHouses = numHouses;
	    this.pokemart = pokemart;
	    this.pokecenter = pokecenter;
	    this.structures = [];
	    this.neighbors = { north: false, south: false, east: false, west: false };
	    this.outlets = [];
	
	    // lol
	    this.waitThatWasntThereBeforeWTF = 0.1;
	    this.biome = this.getRandomBiome();
	  }
	
	  _createClass(Area, [{
	    key: 'init',
	    value: function init(grid) {
	      this.biome = this.getRandomBiome();
	      this.fill(grid);
	      this.resolveSprites(grid);
	      if (['grass', 'water', 'snow'].includes(this.biome)) {
	        this.genEntryRoads(grid);
	      }
	      this.genPokecenter(grid);
	      this.genPokemart(grid);
	      this.genHouses(grid);
	      if (['grass', 'water', 'snow'].includes(this.biome)) {
	        this.repairRoads(grid);
	      }
	      if (['grass', 'snow'].includes(this.biome)) {
	        this.genTrees(grid);
	        this.repairTrees(grid);
	      }
	      if (this.biome === 'sand') {
	        this.genCacti(grid);
	        this.repairTrees(grid);
	      }
	      this.genDoodads(grid);
	      // this.genPonds(grid); // TODO: improve algorithm
	    }
	  }, {
	    key: 'fill',
	    value: function fill(grid) {
	      for (var i = this.x - this.rx; i <= this.x + this.rx; i++) {
	        for (var j = this.y - this.ry; j <= this.y + this.ry; j++) {
	          grid[i][j].spriteID = this.biome;
	          grid[i][j].offset(0, 0);
	          grid[i][j].traversable = true;
	        }
	      }
	    }
	  }, {
	    key: 'getRandomBiome',
	    value: function getRandomBiome() {
	      var rand = _Util.util.random();
	      if (rand < 0.25) {
	        return 'grass';
	      } else if (rand < 0.50) {
	        return 'water';
	      } else if (rand < 0.75) {
	        return 'sand';
	      } else {
	        return 'snow';
	      }
	    }
	  }, {
	    key: 'resolveSprites',
	    value: function resolveSprites(grid) {
	      // default values
	      this.treeSprite = 'T0';
	      this.roadSprite = 'R0';
	      this.pcSprite = 'PC';
	      this.bpcSprite = 'BPC';
	      this.pmSprite = 'PM';
	      this.pondSprite = 'W0';
	      this.doodads = ['D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];
	
	      switch (this.biome) {
	        case 'water':
	          this.treeSprite = 'T1';
	          this.roadSprite = 'R1';
	          this.doodads = ['DW0', 'DW1', 'DW2', 'DW3'];
	          break;
	        case 'snow':
	          this.treeSprite = 'T2';
	          this.roadSprite = 'R2';
	          this.pcSprite = 'PC1';
	          this.bpcSprite = 'BPC1';
	          this.pmSprite = 'PM1';
	          this.doodads = ['DS0', 'DS1', 'DS2', 'DS3'];
	          break;
	        case 'sand':
	          this.treeSprite = 'T3';
	          // this.roadSprite = 'sand';
	          this.doodads = ['DD0', 'DD1'];
	      }
	    }
	  }, {
	    key: 'genRoadx',
	    value: function genRoadx(grid, startx, starty, length, lw, rw) {
	      var _this = this;
	
	      _Util.util.iterate(startx, startx + length, function (i) {
	        for (var w = -lw; w <= rw; w++) {
	          if (grid[i][starty + w].spriteID === _this.biome) {
	            grid[i][starty + w] = new _Tile2.default(_this.roadSprite, true, 1, 1);
	          }
	        }
	      });
	    }
	  }, {
	    key: 'genRoady',
	    value: function genRoady(grid, startx, starty, length, lw, rw) {
	      var _this2 = this;
	
	      _Util.util.iterate(starty, starty + length, function (i) {
	        for (var w = -lw; w <= rw; w++) {
	          if (grid[startx + w][i].spriteID === _this2.biome) {
	            grid[startx + w][i] = new _Tile2.default(_this2.roadSprite, true, 1, 1);
	          }
	        }
	      });
	    }
	  }, {
	    key: 'genEntryRoads',
	    value: function genEntryRoads(grid) {
	      var _this3 = this;
	
	      this.outlets.forEach(function (outlet) {
	        var x = outlet.x,
	            y = outlet.y;
	
	        var sdx = Math.sign(x - _this3.x);
	        _this3.genRoadx(grid, _this3.x + 2 * sdx, _this3.y, x - _this3.x, 2, 2);
	        _this3.genRoady(grid, x, _this3.y, y - _this3.y, 2, 2);
	      });
	    }
	  }, {
	    key: 'valid',
	    value: function valid(grid, px, py) {
	      var r = 5;
	      for (var i = 0; i < this.structures.length; i++) {
	        var s = this.structures[i];
	        if (Math.abs(px - s.px) + Math.abs(py - s.py) < 1.5 * r) {
	          return false;
	        }
	      }
	      for (var _i = px - r; _i <= px + r; _i++) {
	        for (var j = py - r; j <= py + r; j++) {
	          if (0 <= _i && _i < grid.length && 0 <= j && j < grid[0].length && grid[_i][j].spriteID === this.roadSprite) {
	            return false;
	          }
	        }
	      }
	      return true;
	    }
	  }, {
	    key: 'validStructureLocation',
	    value: function validStructureLocation(grid) {
	      var px = void 0,
	          py = void 0,
	          locx = void 0,
	          locy = void 0;
	      do {
	        var rd = _Util.util.randomDisk(this.rx / 1.3, this.ry / 1.3);
	        px = Math.floor(rd.px);
	        py = Math.floor(rd.py);
	        locx = this.x + px;
	        locy = this.y + py;
	      } while (!this.valid(grid, locx, locy));
	      return { locx: locx, locy: locy };
	    }
	  }, {
	    key: 'connectRoads',
	    value: function connectRoads(grid, locx, locy, structure) {
	      if (!['grass', 'water', 'snow'].includes(this.biome)) {
	        return;
	      }
	      var nearest = this.findNearest(this.roadSprite, locx, locy + structure.sy, grid);
	      this.genRoady(grid, locx, locy, structure.sy + 2, 1, 1); // protrude down a bit
	      locy += structure.sy;
	      this.genRoadx(grid, locx, locy, nearest.x - locx + 3 * Math.sign(nearest.x - locx), 1, 1);
	      locx = nearest.x + 1;
	      this.genRoady(grid, locx, locy, nearest.y - locy + 2 * Math.sign(nearest.y - locy), 1, 1);
	    }
	  }, {
	    key: 'genPokecenter',
	    value: function genPokecenter(grid) {
	      var _this4 = this;
	
	      if (!this.pokecenter) {
	        return;
	      }
	
	      var _validStructureLocati = this.validStructureLocation(grid),
	          locx = _validStructureLocati.locx,
	          locy = _validStructureLocati.locy;
	
	      var sizeRand = _Util.util.random();
	      var structure = _Util.util.randChoice([{
	        w: 3,
	        o: function o() {
	          return new _Structure2.default(_this4.pcSprite, locx, locy, 5, 5);
	        }
	      }, {
	        w: 1,
	        o: function o() {
	          return new _Structure2.default(_this4.bpcSprite, locx, locy, 7, 5);
	        }
	      }])();
	      this.connectRoads(grid, locx, locy, structure);
	      structure.init(grid);
	      this.structures.push(structure);
	    }
	  }, {
	    key: 'genPokemart',
	    value: function genPokemart(grid) {
	      if (!this.pokemart) {
	        return;
	      }
	
	      var _validStructureLocati2 = this.validStructureLocation(grid),
	          locx = _validStructureLocati2.locx,
	          locy = _validStructureLocati2.locy;
	
	      var sizeRand = _Util.util.random();
	      var structure = new _Structure2.default(this.pmSprite, locx, locy, 4, 4);
	      this.connectRoads(grid, locx, locy, structure);
	      structure.init(grid);
	      this.structures.push(structure);
	    }
	  }, {
	    key: 'genHouses',
	    value: function genHouses(grid) {
	      for (var i = 0; i < this.numHouses; i++) {
	        this.genHouse(grid);
	      }
	    }
	  }, {
	    key: 'genHouse',
	    value: function genHouse(grid) {
	      var _validStructureLocati3 = this.validStructureLocation(grid),
	          locx = _validStructureLocati3.locx,
	          locy = _validStructureLocati3.locy;
	
	      var sizeRand = _Util.util.random();
	      var structure = _Util.util.randChoice([{
	        w: 1,
	        o: function o() {
	          return new _Structure2.default('H0', locx, locy, 4, 4);
	        }
	      }, {
	        w: 1,
	        o: function o() {
	          return new _Structure2.default('H1', locx, locy, 4, 4);
	        }
	      }, {
	        w: 1,
	        o: function o() {
	          return new _Structure2.default('H2', locx, locy, 4, 4);
	        }
	      }, {
	        w: 1,
	        o: function o() {
	          return new _Structure2.default('H3', locx, locy, 4, 4);
	        }
	      }, {
	        w: 1,
	        o: function o() {
	          return new _Structure2.default('H4', locx, locy, 4, 4);
	        }
	      }, {
	        w: 1,
	        o: function o() {
	          return new _Structure2.default('H5', locx, locy, 5, 5);
	        }
	      }, {
	        w: 1,
	        o: function o() {
	          return new _Structure2.default('H6', locx, locy, 7, 5);
	        }
	      }, {
	        w: 1,
	        o: function o() {
	          return new _Structure2.default('H7', locx, locy, 5, 5);
	        }
	      }])();
	      this.connectRoads(grid, locx, locy, structure);
	      structure.init(grid);
	      this.structures.push(structure);
	    }
	  }, {
	    key: 'genTrees',
	    value: function genTrees(grid) {
	      var r = 5;
	      for (var i = this.x - this.rx; i <= this.x + this.rx; i++) {
	        for (var j = this.y - this.ry; j <= this.y + this.ry; j++) {
	          var valid = true;
	          for (var x = i - r; x <= i + r; x++) {
	            for (var y = j - r; y <= j + r; y++) {
	              if ([this.roadSprite, 'H0', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', this.pcSprite, this.bpcSprite, this.pmSprite].includes(grid[x][y].spriteID)) {
	                valid = false;
	              }
	            }
	          }
	          if (valid && i % 2 === 0 && j % 3 === 0) {
	            grid[i][j].spriteID = this.treeSprite;
	            grid[i][j].traversable = false;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'genCacti',
	    value: function genCacti(grid) {
	      var r = 5;
	      for (var i = this.x - this.rx; i <= this.x + this.rx; i++) {
	        for (var j = this.y - this.ry; j <= this.y + this.ry; j++) {
	          var prob = 0.05;
	          var valid = true;
	          for (var x = i - r; x <= i + r; x++) {
	            for (var y = j - r; y <= j + r; y++) {
	              if (['0', 'H0', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', this.pcSprite, this.bpcSprite, this.pmSprite].includes(grid[x][y].spriteID)) {
	                valid = false;
	              }
	            }
	          }
	          if (valid && i % 2 === 0 && j % 3 === 0 && _Util.util.random() < prob) {
	            grid[i][j].spriteID = this.treeSprite;
	            grid[i][j].traversable = false;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'repairTrees',
	    value: function repairTrees(grid) {
	      var _this5 = this;
	
	      var makeTree = function makeTree(i, j, dx, dy) {
	        var t = grid[i + dx][j + dy];
	        t.spriteID = _this5.treeSprite;
	        t.offset(dx, dy);
	        t.traversable = false;
	      };
	      for (var i = this.x - this.rx; i <= this.x + this.rx; i++) {
	        for (var j = this.y - this.ry; j <= this.y + this.ry; j++) {
	          var tile = grid[i][j];
	          if (tile.spriteID === this.treeSprite && tile.offx === 0 && tile.offy === 0) {
	            makeTree(i, j, 0, 1);
	            makeTree(i, j, 0, 2);
	            makeTree(i, j, 1, 0);
	            makeTree(i, j, 1, 1);
	            makeTree(i, j, 1, 2);
	          }
	        }
	      }
	    }
	  }, {
	    key: 'genPonds',
	    value: function genPonds(grid) {
	      var r = 5;
	      var px = Math.floor(this.x + _Util.util.random() * this.sx - this.rx);
	      var py = Math.floor(this.y + _Util.util.random() * this.sy - this.ry);
	      var rx = 3;
	      var ry = 3;
	      var valid = true;
	      for (var i = px - rx - r; i <= px + rx + r; i++) {
	        for (var j = py - ry - r; j <= py + ry + r; j++) {
	          if ([this.roadSprite, 'H0', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', this.pcSprite, this.bpcSprite, this.pmSprite].includes(grid[i][j].spriteID)) {
	            valid = false;
	          }
	        }
	      }
	      if (valid) {
	        for (var _i2 = px - rx; _i2 <= px + rx; _i2++) {
	          for (var _j = py - ry; _j <= py + ry; _j++) {
	            grid[_i2][_j].spriteID = this.pondSprite;
	            grid[_i2][_j].traversable = false;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'repairPonds',
	    value: function repairPonds(grid) {}
	  }, {
	    key: 'findNearest',
	    value: function findNearest(spriteID, x, y, grid) {
	      var cx = Infinity;
	      var cy = Infinity;
	      for (var i = this.x - this.rx; i <= this.x + this.rx; i++) {
	        for (var j = this.y - this.ry; j <= this.y + this.ry; j++) {
	          if (grid[i][j].spriteID === spriteID && Math.abs(i - x) + Math.abs(j - y) < Math.abs(cx - x) + Math.abs(cy - y)) {
	            cx = i;
	            cy = j;
	          }
	        }
	      }
	      return { x: cx, y: cy };
	    }
	  }, {
	    key: 'repairRoads',
	    value: function repairRoads(grid) {
	      for (var i = this.x - this.rx; i <= this.x + this.rx; i++) {
	        for (var j = this.y - this.ry; j <= this.y + this.ry; j++) {
	          var tile = grid[i][j];
	          if (tile.spriteID === this.roadSprite) {
	            tile.offset(1, 1);
	            if (grid[i + 1][j].spriteID !== this.roadSprite) {
	              tile.offx += 1;
	            } else if (grid[i - 1][j].spriteID !== this.roadSprite) {
	              tile.offx -= 1;
	            }
	            if (grid[i][j - 1].spriteID !== this.roadSprite) {
	              tile.offy -= 1;
	            } else if (grid[i][j + 1].spriteID !== this.roadSprite) {
	              tile.offy += 1;
	            }
	            if (grid[i + 1][j + 1].spriteID === this.biome && tile.offx === 1 && tile.offy === 1) {
	              tile.offset(2, -1);
	            } else if (grid[i + 1][j - 1].spriteID === this.biome && tile.offx === 1 && tile.offy === 1) {
	              tile.offset(2, -2);
	            } else if (grid[i - 1][j + 1].spriteID === this.biome && tile.offx === 1 && tile.offy === 1) {
	              tile.offset(1, -1);
	            } else if (grid[i - 1][j - 1].spriteID === this.biome && tile.offx === 1 && tile.offy === 1) {
	              tile.offset(1, -2);
	            }
	          }
	        }
	      }
	    }
	  }, {
	    key: 'genDoodads',
	    value: function genDoodads(grid) {
	      var r = 1;
	      for (var i = this.x - this.rx; i <= this.x + this.rx; i++) {
	        for (var j = this.y - this.ry; j <= this.y + this.ry; j++) {
	          var tile = grid[i][j];
	          if (tile.spriteID === this.biome) {
	            var rand = _Util.util.random();
	            var spawnProb = 0.01;
	            var neighbors = 0;
	            var valid = true;
	            for (var x = i - r; x <= i + r; x++) {
	              for (var y = j - r; y <= j + r; y++) {
	                if (grid[x][y].spriteID === this.roadSprite) {
	                  valid = false;
	                }
	                if (grid[x][y].spriteID[0] === 'D') {
	                  neighbors++;
	                }
	              }
	            }
	            spawnProb += Math.sqrt(neighbors) * 0.15;
	
	            if (valid && rand < spawnProb) {
	              var doodad = _Util.util.choose(this.doodads);
	              tile.spriteID = doodad;
	            }
	          }
	        }
	      }
	    }
	  }]);
	
	  return Area;
	}();
	
	exports.default = Area;

/***/ },
/* 6 */
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
	
	var Structure = function () {
	  function Structure(spriteID, px, py, sx, sy) {
	    _classCallCheck(this, Structure);
	
	    this.spriteID = spriteID;
	    this.px = px;
	    this.py = py;
	    this.sx = sx;
	    this.sy = sy;
	    this.offx = Math.floor(this.sx / 2);
	    this.offy = Math.floor(this.sy / 2);
	  }
	
	  _createClass(Structure, [{
	    key: 'init',
	    value: function init(grid) {
	      for (var i = 0; i < this.sx; i++) {
	        for (var j = 0; j < this.sy; j++) {
	          var x = Math.floor(this.px + i - this.offx);
	          var y = Math.floor(this.py + j - this.offy);
	          grid[x][y] = new _Tile2.default(this.spriteID, false, i, j);
	        }
	      }
	    }
	  }]);
	
	  return Structure;
	}();
	
	exports.default = Structure;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.util = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _seedrandom = __webpack_require__(8);
	
	var _seedrandom2 = _interopRequireDefault(_seedrandom);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Util = function () {
	  function Util() {
	    _classCallCheck(this, Util);
	
	    this.randSeed = 0;
	    window.util = this;
	  }
	
	  _createClass(Util, [{
	    key: 'seed',
	    value: function seed(_seed) {
	      this.randSeed = _seed + 7;
	      this.rng = new Math.seedrandom(this.randSeed);
	    }
	  }, {
	    key: 'randInt',
	    value: function randInt() {
	      return this.random() * 2147483647;
	    }
	  }, {
	    key: 'randRange',
	    value: function randRange(a, b) {
	      return this.random() * (b - a) + a;
	    }
	  }, {
	    key: 'randIntRange',
	    value: function randIntRange(a, b) {
	      return Math.floor(this.randRange(a, b));
	    }
	  }, {
	    key: 'random',
	    value: function random() {
	      return this.rng();
	    }
	  }, {
	    key: 'randomDisk',
	    value: function randomDisk(rx, ry) {
	      var sqrtrx = Math.sqrt(this.random());
	      var sqrtry = Math.sqrt(this.random());
	      var theta = this.random() * 2 * Math.PI;
	      var px = sqrtrx * Math.cos(theta) * rx;
	      var py = sqrtry * Math.sin(theta) * ry;
	      return { px: px, py: py };
	    }
	
	    /*
	    Randomly selects an object from a list given weights. Weights do not have to sum to 1.
	    Follows this parameter format:
	    [
	      {w: 3, o: choice1},
	      {w: 10, o: choice2},
	      ...
	    ]
	    Return: `o`
	    */
	
	  }, {
	    key: 'randChoice',
	    value: function randChoice(l) {
	      var sumWeights = 0;
	      l.forEach(function (item) {
	        item.w += sumWeights;
	        sumWeights = item.w;
	      });
	      var rand = this.random() * sumWeights;
	      for (var i = 0; i < l.length; i++) {
	        if (rand < l[i].w) {
	          return l[i].o;
	        }
	      }
	    }
	  }, {
	    key: 'choose',
	    value: function choose(l) {
	      return l[Math.floor(this.random() * l.length)];
	    }
	
	    /*
	    Iterates integers starting from `start` and finishes at `end` inclusively
	    and applies callback function `f`. The callback follows this signature:
	    f(i) {
	      ...
	    }
	     Return: undefined
	    */
	
	  }, {
	    key: 'iterate',
	    value: function iterate(start, end, f) {
	      var d = end - start;
	      var sd = Math.sign(d);
	      for (var i = 0; i < Math.abs(d); i++) {
	        f(start + i * sd);
	      }
	    }
	  }, {
	    key: 'clamp',
	    value: function clamp(min, x, max) {
	      return Math.min(Math.max(x, min), max);
	    }
	  }, {
	    key: 'inBound',
	    value: function inBound(min, x, max) {
	      return min <= x && x < max;
	    }
	  }, {
	    key: 'lerp',
	    value: function lerp(x1, y1, x2, y2, x) {
	      return y1 + (x - x1) * (y2 - y1) / (x2 - x1);
	    }
	  }]);
	
	  return Util;
	}();
	
	exports.default = Util;
	var util = exports.util = new Util();

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// A library of seedable RNGs implemented in Javascript.
	//
	// Usage:
	//
	// var seedrandom = require('seedrandom');
	// var random = seedrandom(1); // or any seed.
	// var x = random();       // 0 <= x < 1.  Every bit is random.
	// var x = random.quick(); // 0 <= x < 1.  32 bits of randomness.
	
	// alea, a 53-bit multiply-with-carry generator by Johannes Baagøe.
	// Period: ~2^116
	// Reported to pass all BigCrush tests.
	var alea = __webpack_require__(9);
	
	// xor128, a pure xor-shift generator by George Marsaglia.
	// Period: 2^128-1.
	// Reported to fail: MatrixRank and LinearComp.
	var xor128 = __webpack_require__(13);
	
	// xorwow, George Marsaglia's 160-bit xor-shift combined plus weyl.
	// Period: 2^192-2^32
	// Reported to fail: CollisionOver, SimpPoker, and LinearComp.
	var xorwow = __webpack_require__(14);
	
	// xorshift7, by François Panneton and Pierre L'ecuyer, takes
	// a different approach: it adds robustness by allowing more shifts
	// than Marsaglia's original three.  It is a 7-shift generator
	// with 256 bits, that passes BigCrush with no systmatic failures.
	// Period 2^256-1.
	// No systematic BigCrush failures reported.
	var xorshift7 = __webpack_require__(15);
	
	// xor4096, by Richard Brent, is a 4096-bit xor-shift with a
	// very long period that also adds a Weyl generator. It also passes
	// BigCrush with no systematic failures.  Its long period may
	// be useful if you have many generators and need to avoid
	// collisions.
	// Period: 2^4128-2^32.
	// No systematic BigCrush failures reported.
	var xor4096 = __webpack_require__(16);
	
	// Tyche-i, by Samuel Neves and Filipe Araujo, is a bit-shifting random
	// number generator derived from ChaCha, a modern stream cipher.
	// https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf
	// Period: ~2^127
	// No systematic BigCrush failures reported.
	var tychei = __webpack_require__(17);
	
	// The original ARC4-based prng included in this library.
	// Period: ~2^1600
	var sr = __webpack_require__(18);
	
	sr.alea = alea;
	sr.xor128 = xor128;
	sr.xorwow = xorwow;
	sr.xorshift7 = xorshift7;
	sr.xor4096 = xor4096;
	sr.tychei = tychei;
	
	module.exports = sr;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {// A port of an algorithm by Johannes Baagøe <baagoe@baagoe.com>, 2010
	// http://baagoe.com/en/RandomMusings/javascript/
	// https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
	// Original work is under MIT license -
	
	// Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
	//
	// Permission is hereby granted, free of charge, to any person obtaining a copy
	// of this software and associated documentation files (the "Software"), to deal
	// in the Software without restriction, including without limitation the rights
	// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	// copies of the Software, and to permit persons to whom the Software is
	// furnished to do so, subject to the following conditions:
	// 
	// The above copyright notice and this permission notice shall be included in
	// all copies or substantial portions of the Software.
	// 
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	// THE SOFTWARE.
	
	
	
	(function(global, module, define) {
	
	function Alea(seed) {
	  var me = this, mash = Mash();
	
	  me.next = function() {
	    var t = 2091639 * me.s0 + me.c * 2.3283064365386963e-10; // 2^-32
	    me.s0 = me.s1;
	    me.s1 = me.s2;
	    return me.s2 = t - (me.c = t | 0);
	  };
	
	  // Apply the seeding algorithm from Baagoe.
	  me.c = 1;
	  me.s0 = mash(' ');
	  me.s1 = mash(' ');
	  me.s2 = mash(' ');
	  me.s0 -= mash(seed);
	  if (me.s0 < 0) { me.s0 += 1; }
	  me.s1 -= mash(seed);
	  if (me.s1 < 0) { me.s1 += 1; }
	  me.s2 -= mash(seed);
	  if (me.s2 < 0) { me.s2 += 1; }
	  mash = null;
	}
	
	function copy(f, t) {
	  t.c = f.c;
	  t.s0 = f.s0;
	  t.s1 = f.s1;
	  t.s2 = f.s2;
	  return t;
	}
	
	function impl(seed, opts) {
	  var xg = new Alea(seed),
	      state = opts && opts.state,
	      prng = xg.next;
	  prng.int32 = function() { return (xg.next() * 0x100000000) | 0; }
	  prng.double = function() {
	    return prng() + (prng() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
	  };
	  prng.quick = prng;
	  if (state) {
	    if (typeof(state) == 'object') copy(state, xg);
	    prng.state = function() { return copy(xg, {}); }
	  }
	  return prng;
	}
	
	function Mash() {
	  var n = 0xefc8249d;
	
	  var mash = function(data) {
	    data = data.toString();
	    for (var i = 0; i < data.length; i++) {
	      n += data.charCodeAt(i);
	      var h = 0.02519603282416938 * n;
	      n = h >>> 0;
	      h -= n;
	      h *= n;
	      n = h >>> 0;
	      h -= n;
	      n += h * 0x100000000; // 2^32
	    }
	    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
	  };
	
	  return mash;
	}
	
	
	if (module && module.exports) {
	  module.exports = impl;
	} else if (__webpack_require__(11) && __webpack_require__(12)) {
	  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return impl; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {
	  this.alea = impl;
	}
	
	})(
	  this,
	  (typeof module) == 'object' && module,    // present in node.js
	  __webpack_require__(11)   // present with an AMD loader
	);
	
	
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)(module)))

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 12 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;
	
	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {// A Javascript implementaion of the "xor128" prng algorithm by
	// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper
	
	(function(global, module, define) {
	
	function XorGen(seed) {
	  var me = this, strseed = '';
	
	  me.x = 0;
	  me.y = 0;
	  me.z = 0;
	  me.w = 0;
	
	  // Set up generator function.
	  me.next = function() {
	    var t = me.x ^ (me.x << 11);
	    me.x = me.y;
	    me.y = me.z;
	    me.z = me.w;
	    return me.w ^= (me.w >>> 19) ^ t ^ (t >>> 8);
	  };
	
	  if (seed === (seed | 0)) {
	    // Integer seed.
	    me.x = seed;
	  } else {
	    // String seed.
	    strseed += seed;
	  }
	
	  // Mix in string seed, then discard an initial batch of 64 values.
	  for (var k = 0; k < strseed.length + 64; k++) {
	    me.x ^= strseed.charCodeAt(k) | 0;
	    me.next();
	  }
	}
	
	function copy(f, t) {
	  t.x = f.x;
	  t.y = f.y;
	  t.z = f.z;
	  t.w = f.w;
	  return t;
	}
	
	function impl(seed, opts) {
	  var xg = new XorGen(seed),
	      state = opts && opts.state,
	      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
	  prng.double = function() {
	    do {
	      var top = xg.next() >>> 11,
	          bot = (xg.next() >>> 0) / 0x100000000,
	          result = (top + bot) / (1 << 21);
	    } while (result === 0);
	    return result;
	  };
	  prng.int32 = xg.next;
	  prng.quick = prng;
	  if (state) {
	    if (typeof(state) == 'object') copy(state, xg);
	    prng.state = function() { return copy(xg, {}); }
	  }
	  return prng;
	}
	
	if (module && module.exports) {
	  module.exports = impl;
	} else if (__webpack_require__(11) && __webpack_require__(12)) {
	  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return impl; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {
	  this.xor128 = impl;
	}
	
	})(
	  this,
	  (typeof module) == 'object' && module,    // present in node.js
	  __webpack_require__(11)   // present with an AMD loader
	);
	
	
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)(module)))

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {// A Javascript implementaion of the "xorwow" prng algorithm by
	// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper
	
	(function(global, module, define) {
	
	function XorGen(seed) {
	  var me = this, strseed = '';
	
	  // Set up generator function.
	  me.next = function() {
	    var t = (me.x ^ (me.x >>> 2));
	    me.x = me.y; me.y = me.z; me.z = me.w; me.w = me.v;
	    return (me.d = (me.d + 362437 | 0)) +
	       (me.v = (me.v ^ (me.v << 4)) ^ (t ^ (t << 1))) | 0;
	  };
	
	  me.x = 0;
	  me.y = 0;
	  me.z = 0;
	  me.w = 0;
	  me.v = 0;
	
	  if (seed === (seed | 0)) {
	    // Integer seed.
	    me.x = seed;
	  } else {
	    // String seed.
	    strseed += seed;
	  }
	
	  // Mix in string seed, then discard an initial batch of 64 values.
	  for (var k = 0; k < strseed.length + 64; k++) {
	    me.x ^= strseed.charCodeAt(k) | 0;
	    if (k == strseed.length) {
	      me.d = me.x << 10 ^ me.x >>> 4;
	    }
	    me.next();
	  }
	}
	
	function copy(f, t) {
	  t.x = f.x;
	  t.y = f.y;
	  t.z = f.z;
	  t.w = f.w;
	  t.v = f.v;
	  t.d = f.d;
	  return t;
	}
	
	function impl(seed, opts) {
	  var xg = new XorGen(seed),
	      state = opts && opts.state,
	      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
	  prng.double = function() {
	    do {
	      var top = xg.next() >>> 11,
	          bot = (xg.next() >>> 0) / 0x100000000,
	          result = (top + bot) / (1 << 21);
	    } while (result === 0);
	    return result;
	  };
	  prng.int32 = xg.next;
	  prng.quick = prng;
	  if (state) {
	    if (typeof(state) == 'object') copy(state, xg);
	    prng.state = function() { return copy(xg, {}); }
	  }
	  return prng;
	}
	
	if (module && module.exports) {
	  module.exports = impl;
	} else if (__webpack_require__(11) && __webpack_require__(12)) {
	  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return impl; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {
	  this.xorwow = impl;
	}
	
	})(
	  this,
	  (typeof module) == 'object' && module,    // present in node.js
	  __webpack_require__(11)   // present with an AMD loader
	);
	
	
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)(module)))

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {// A Javascript implementaion of the "xorshift7" algorithm by
	// François Panneton and Pierre L'ecuyer:
	// "On the Xorgshift Random Number Generators"
	// http://saluc.engr.uconn.edu/refs/crypto/rng/panneton05onthexorshift.pdf
	
	(function(global, module, define) {
	
	function XorGen(seed) {
	  var me = this;
	
	  // Set up generator function.
	  me.next = function() {
	    // Update xor generator.
	    var X = me.x, i = me.i, t, v, w;
	    t = X[i]; t ^= (t >>> 7); v = t ^ (t << 24);
	    t = X[(i + 1) & 7]; v ^= t ^ (t >>> 10);
	    t = X[(i + 3) & 7]; v ^= t ^ (t >>> 3);
	    t = X[(i + 4) & 7]; v ^= t ^ (t << 7);
	    t = X[(i + 7) & 7]; t = t ^ (t << 13); v ^= t ^ (t << 9);
	    X[i] = v;
	    me.i = (i + 1) & 7;
	    return v;
	  };
	
	  function init(me, seed) {
	    var j, w, X = [];
	
	    if (seed === (seed | 0)) {
	      // Seed state array using a 32-bit integer.
	      w = X[0] = seed;
	    } else {
	      // Seed state using a string.
	      seed = '' + seed;
	      for (j = 0; j < seed.length; ++j) {
	        X[j & 7] = (X[j & 7] << 15) ^
	            (seed.charCodeAt(j) + X[(j + 1) & 7] << 13);
	      }
	    }
	    // Enforce an array length of 8, not all zeroes.
	    while (X.length < 8) X.push(0);
	    for (j = 0; j < 8 && X[j] === 0; ++j);
	    if (j == 8) w = X[7] = -1; else w = X[j];
	
	    me.x = X;
	    me.i = 0;
	
	    // Discard an initial 256 values.
	    for (j = 256; j > 0; --j) {
	      me.next();
	    }
	  }
	
	  init(me, seed);
	}
	
	function copy(f, t) {
	  t.x = f.x.slice();
	  t.i = f.i;
	  return t;
	}
	
	function impl(seed, opts) {
	  if (seed == null) seed = +(new Date);
	  var xg = new XorGen(seed),
	      state = opts && opts.state,
	      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
	  prng.double = function() {
	    do {
	      var top = xg.next() >>> 11,
	          bot = (xg.next() >>> 0) / 0x100000000,
	          result = (top + bot) / (1 << 21);
	    } while (result === 0);
	    return result;
	  };
	  prng.int32 = xg.next;
	  prng.quick = prng;
	  if (state) {
	    if (state.x) copy(state, xg);
	    prng.state = function() { return copy(xg, {}); }
	  }
	  return prng;
	}
	
	if (module && module.exports) {
	  module.exports = impl;
	} else if (__webpack_require__(11) && __webpack_require__(12)) {
	  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return impl; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {
	  this.xorshift7 = impl;
	}
	
	})(
	  this,
	  (typeof module) == 'object' && module,    // present in node.js
	  __webpack_require__(11)   // present with an AMD loader
	);
	
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)(module)))

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {// A Javascript implementaion of Richard Brent's Xorgens xor4096 algorithm.
	//
	// This fast non-cryptographic random number generator is designed for
	// use in Monte-Carlo algorithms. It combines a long-period xorshift
	// generator with a Weyl generator, and it passes all common batteries
	// of stasticial tests for randomness while consuming only a few nanoseconds
	// for each prng generated.  For background on the generator, see Brent's
	// paper: "Some long-period random number generators using shifts and xors."
	// http://arxiv.org/pdf/1004.3115v1.pdf
	//
	// Usage:
	//
	// var xor4096 = require('xor4096');
	// random = xor4096(1);                        // Seed with int32 or string.
	// assert.equal(random(), 0.1520436450538547); // (0, 1) range, 53 bits.
	// assert.equal(random.int32(), 1806534897);   // signed int32, 32 bits.
	//
	// For nonzero numeric keys, this impelementation provides a sequence
	// identical to that by Brent's xorgens 3 implementaion in C.  This
	// implementation also provides for initalizing the generator with
	// string seeds, or for saving and restoring the state of the generator.
	//
	// On Chrome, this prng benchmarks about 2.1 times slower than
	// Javascript's built-in Math.random().
	
	(function(global, module, define) {
	
	function XorGen(seed) {
	  var me = this;
	
	  // Set up generator function.
	  me.next = function() {
	    var w = me.w,
	        X = me.X, i = me.i, t, v;
	    // Update Weyl generator.
	    me.w = w = (w + 0x61c88647) | 0;
	    // Update xor generator.
	    v = X[(i + 34) & 127];
	    t = X[i = ((i + 1) & 127)];
	    v ^= v << 13;
	    t ^= t << 17;
	    v ^= v >>> 15;
	    t ^= t >>> 12;
	    // Update Xor generator array state.
	    v = X[i] = v ^ t;
	    me.i = i;
	    // Result is the combination.
	    return (v + (w ^ (w >>> 16))) | 0;
	  };
	
	  function init(me, seed) {
	    var t, v, i, j, w, X = [], limit = 128;
	    if (seed === (seed | 0)) {
	      // Numeric seeds initialize v, which is used to generates X.
	      v = seed;
	      seed = null;
	    } else {
	      // String seeds are mixed into v and X one character at a time.
	      seed = seed + '\0';
	      v = 0;
	      limit = Math.max(limit, seed.length);
	    }
	    // Initialize circular array and weyl value.
	    for (i = 0, j = -32; j < limit; ++j) {
	      // Put the unicode characters into the array, and shuffle them.
	      if (seed) v ^= seed.charCodeAt((j + 32) % seed.length);
	      // After 32 shuffles, take v as the starting w value.
	      if (j === 0) w = v;
	      v ^= v << 10;
	      v ^= v >>> 15;
	      v ^= v << 4;
	      v ^= v >>> 13;
	      if (j >= 0) {
	        w = (w + 0x61c88647) | 0;     // Weyl.
	        t = (X[j & 127] ^= (v + w));  // Combine xor and weyl to init array.
	        i = (0 == t) ? i + 1 : 0;     // Count zeroes.
	      }
	    }
	    // We have detected all zeroes; make the key nonzero.
	    if (i >= 128) {
	      X[(seed && seed.length || 0) & 127] = -1;
	    }
	    // Run the generator 512 times to further mix the state before using it.
	    // Factoring this as a function slows the main generator, so it is just
	    // unrolled here.  The weyl generator is not advanced while warming up.
	    i = 127;
	    for (j = 4 * 128; j > 0; --j) {
	      v = X[(i + 34) & 127];
	      t = X[i = ((i + 1) & 127)];
	      v ^= v << 13;
	      t ^= t << 17;
	      v ^= v >>> 15;
	      t ^= t >>> 12;
	      X[i] = v ^ t;
	    }
	    // Storing state as object members is faster than using closure variables.
	    me.w = w;
	    me.X = X;
	    me.i = i;
	  }
	
	  init(me, seed);
	}
	
	function copy(f, t) {
	  t.i = f.i;
	  t.w = f.w;
	  t.X = f.X.slice();
	  return t;
	};
	
	function impl(seed, opts) {
	  if (seed == null) seed = +(new Date);
	  var xg = new XorGen(seed),
	      state = opts && opts.state,
	      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
	  prng.double = function() {
	    do {
	      var top = xg.next() >>> 11,
	          bot = (xg.next() >>> 0) / 0x100000000,
	          result = (top + bot) / (1 << 21);
	    } while (result === 0);
	    return result;
	  };
	  prng.int32 = xg.next;
	  prng.quick = prng;
	  if (state) {
	    if (state.X) copy(state, xg);
	    prng.state = function() { return copy(xg, {}); }
	  }
	  return prng;
	}
	
	if (module && module.exports) {
	  module.exports = impl;
	} else if (__webpack_require__(11) && __webpack_require__(12)) {
	  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return impl; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {
	  this.xor4096 = impl;
	}
	
	})(
	  this,                                     // window object or global
	  (typeof module) == 'object' && module,    // present in node.js
	  __webpack_require__(11)   // present with an AMD loader
	);
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)(module)))

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {// A Javascript implementaion of the "Tyche-i" prng algorithm by
	// Samuel Neves and Filipe Araujo.
	// See https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf
	
	(function(global, module, define) {
	
	function XorGen(seed) {
	  var me = this, strseed = '';
	
	  // Set up generator function.
	  me.next = function() {
	    var b = me.b, c = me.c, d = me.d, a = me.a;
	    b = (b << 25) ^ (b >>> 7) ^ c;
	    c = (c - d) | 0;
	    d = (d << 24) ^ (d >>> 8) ^ a;
	    a = (a - b) | 0;
	    me.b = b = (b << 20) ^ (b >>> 12) ^ c;
	    me.c = c = (c - d) | 0;
	    me.d = (d << 16) ^ (c >>> 16) ^ a;
	    return me.a = (a - b) | 0;
	  };
	
	  /* The following is non-inverted tyche, which has better internal
	   * bit diffusion, but which is about 25% slower than tyche-i in JS.
	  me.next = function() {
	    var a = me.a, b = me.b, c = me.c, d = me.d;
	    a = (me.a + me.b | 0) >>> 0;
	    d = me.d ^ a; d = d << 16 ^ d >>> 16;
	    c = me.c + d | 0;
	    b = me.b ^ c; b = b << 12 ^ d >>> 20;
	    me.a = a = a + b | 0;
	    d = d ^ a; me.d = d = d << 8 ^ d >>> 24;
	    me.c = c = c + d | 0;
	    b = b ^ c;
	    return me.b = (b << 7 ^ b >>> 25);
	  }
	  */
	
	  me.a = 0;
	  me.b = 0;
	  me.c = 2654435769 | 0;
	  me.d = 1367130551;
	
	  if (seed === Math.floor(seed)) {
	    // Integer seed.
	    me.a = (seed / 0x100000000) | 0;
	    me.b = seed | 0;
	  } else {
	    // String seed.
	    strseed += seed;
	  }
	
	  // Mix in string seed, then discard an initial batch of 64 values.
	  for (var k = 0; k < strseed.length + 20; k++) {
	    me.b ^= strseed.charCodeAt(k) | 0;
	    me.next();
	  }
	}
	
	function copy(f, t) {
	  t.a = f.a;
	  t.b = f.b;
	  t.c = f.c;
	  t.d = f.d;
	  return t;
	};
	
	function impl(seed, opts) {
	  var xg = new XorGen(seed),
	      state = opts && opts.state,
	      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
	  prng.double = function() {
	    do {
	      var top = xg.next() >>> 11,
	          bot = (xg.next() >>> 0) / 0x100000000,
	          result = (top + bot) / (1 << 21);
	    } while (result === 0);
	    return result;
	  };
	  prng.int32 = xg.next;
	  prng.quick = prng;
	  if (state) {
	    if (typeof(state) == 'object') copy(state, xg);
	    prng.state = function() { return copy(xg, {}); }
	  }
	  return prng;
	}
	
	if (module && module.exports) {
	  module.exports = impl;
	} else if (__webpack_require__(11) && __webpack_require__(12)) {
	  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return impl; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {
	  this.tychei = impl;
	}
	
	})(
	  this,
	  (typeof module) == 'object' && module,    // present in node.js
	  __webpack_require__(11)   // present with an AMD loader
	);
	
	
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)(module)))

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*
	Copyright 2014 David Bau.
	
	Permission is hereby granted, free of charge, to any person obtaining
	a copy of this software and associated documentation files (the
	"Software"), to deal in the Software without restriction, including
	without limitation the rights to use, copy, modify, merge, publish,
	distribute, sublicense, and/or sell copies of the Software, and to
	permit persons to whom the Software is furnished to do so, subject to
	the following conditions:
	
	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
	IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
	CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
	TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
	SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	*/
	
	(function (pool, math) {
	//
	// The following constants are related to IEEE 754 limits.
	//
	var global = this,
	    width = 256,        // each RC4 output is 0 <= x < 256
	    chunks = 6,         // at least six RC4 outputs for each double
	    digits = 52,        // there are 52 significant digits in a double
	    rngname = 'random', // rngname: name for Math.random and Math.seedrandom
	    startdenom = math.pow(width, chunks),
	    significance = math.pow(2, digits),
	    overflow = significance * 2,
	    mask = width - 1,
	    nodecrypto;         // node.js crypto module, initialized at the bottom.
	
	//
	// seedrandom()
	// This is the seedrandom function described above.
	//
	function seedrandom(seed, options, callback) {
	  var key = [];
	  options = (options == true) ? { entropy: true } : (options || {});
	
	  // Flatten the seed string or build one from local entropy if needed.
	  var shortseed = mixkey(flatten(
	    options.entropy ? [seed, tostring(pool)] :
	    (seed == null) ? autoseed() : seed, 3), key);
	
	  // Use the seed to initialize an ARC4 generator.
	  var arc4 = new ARC4(key);
	
	  // This function returns a random double in [0, 1) that contains
	  // randomness in every bit of the mantissa of the IEEE 754 value.
	  var prng = function() {
	    var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
	        d = startdenom,                 //   and denominator d = 2 ^ 48.
	        x = 0;                          //   and no 'extra last byte'.
	    while (n < significance) {          // Fill up all significant digits by
	      n = (n + x) * width;              //   shifting numerator and
	      d *= width;                       //   denominator and generating a
	      x = arc4.g(1);                    //   new least-significant-byte.
	    }
	    while (n >= overflow) {             // To avoid rounding up, before adding
	      n /= 2;                           //   last byte, shift everything
	      d /= 2;                           //   right using integer math until
	      x >>>= 1;                         //   we have exactly the desired bits.
	    }
	    return (n + x) / d;                 // Form the number within [0, 1).
	  };
	
	  prng.int32 = function() { return arc4.g(4) | 0; }
	  prng.quick = function() { return arc4.g(4) / 0x100000000; }
	  prng.double = prng;
	
	  // Mix the randomness into accumulated entropy.
	  mixkey(tostring(arc4.S), pool);
	
	  // Calling convention: what to return as a function of prng, seed, is_math.
	  return (options.pass || callback ||
	      function(prng, seed, is_math_call, state) {
	        if (state) {
	          // Load the arc4 state from the given state if it has an S array.
	          if (state.S) { copy(state, arc4); }
	          // Only provide the .state method if requested via options.state.
	          prng.state = function() { return copy(arc4, {}); }
	        }
	
	        // If called as a method of Math (Math.seedrandom()), mutate
	        // Math.random because that is how seedrandom.js has worked since v1.0.
	        if (is_math_call) { math[rngname] = prng; return seed; }
	
	        // Otherwise, it is a newer calling convention, so return the
	        // prng directly.
	        else return prng;
	      })(
	  prng,
	  shortseed,
	  'global' in options ? options.global : (this == math),
	  options.state);
	}
	math['seed' + rngname] = seedrandom;
	
	//
	// ARC4
	//
	// An ARC4 implementation.  The constructor takes a key in the form of
	// an array of at most (width) integers that should be 0 <= x < (width).
	//
	// The g(count) method returns a pseudorandom integer that concatenates
	// the next (count) outputs from ARC4.  Its return value is a number x
	// that is in the range 0 <= x < (width ^ count).
	//
	function ARC4(key) {
	  var t, keylen = key.length,
	      me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];
	
	  // The empty key [] is treated as [0].
	  if (!keylen) { key = [keylen++]; }
	
	  // Set up S using the standard key scheduling algorithm.
	  while (i < width) {
	    s[i] = i++;
	  }
	  for (i = 0; i < width; i++) {
	    s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
	    s[j] = t;
	  }
	
	  // The "g" method returns the next (count) outputs as one number.
	  (me.g = function(count) {
	    // Using instance members instead of closure state nearly doubles speed.
	    var t, r = 0,
	        i = me.i, j = me.j, s = me.S;
	    while (count--) {
	      t = s[i = mask & (i + 1)];
	      r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
	    }
	    me.i = i; me.j = j;
	    return r;
	    // For robust unpredictability, the function call below automatically
	    // discards an initial batch of values.  This is called RC4-drop[256].
	    // See http://google.com/search?q=rsa+fluhrer+response&btnI
	  })(width);
	}
	
	//
	// copy()
	// Copies internal state of ARC4 to or from a plain object.
	//
	function copy(f, t) {
	  t.i = f.i;
	  t.j = f.j;
	  t.S = f.S.slice();
	  return t;
	};
	
	//
	// flatten()
	// Converts an object tree to nested arrays of strings.
	//
	function flatten(obj, depth) {
	  var result = [], typ = (typeof obj), prop;
	  if (depth && typ == 'object') {
	    for (prop in obj) {
	      try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
	    }
	  }
	  return (result.length ? result : typ == 'string' ? obj : obj + '\0');
	}
	
	//
	// mixkey()
	// Mixes a string seed into a key that is an array of integers, and
	// returns a shortened string seed that is equivalent to the result key.
	//
	function mixkey(seed, key) {
	  var stringseed = seed + '', smear, j = 0;
	  while (j < stringseed.length) {
	    key[mask & j] =
	      mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
	  }
	  return tostring(key);
	}
	
	//
	// autoseed()
	// Returns an object for autoseeding, using window.crypto and Node crypto
	// module if available.
	//
	function autoseed() {
	  try {
	    var out;
	    if (nodecrypto && (out = nodecrypto.randomBytes)) {
	      // The use of 'out' to remember randomBytes makes tight minified code.
	      out = out(width);
	    } else {
	      out = new Uint8Array(width);
	      (global.crypto || global.msCrypto).getRandomValues(out);
	    }
	    return tostring(out);
	  } catch (e) {
	    var browser = global.navigator,
	        plugins = browser && browser.plugins;
	    return [+new Date, global, plugins, global.screen, tostring(pool)];
	  }
	}
	
	//
	// tostring()
	// Converts an array of charcodes to a string
	//
	function tostring(a) {
	  return String.fromCharCode.apply(0, a);
	}
	
	//
	// When seedrandom.js is loaded, we immediately mix a few bits
	// from the built-in RNG into the entropy pool.  Because we do
	// not want to interfere with deterministic PRNG state later,
	// seedrandom will not call math.random on its own again after
	// initialization.
	//
	mixkey(math.random(), pool);
	
	//
	// Nodejs and AMD support: export the implementation as a module using
	// either convention.
	//
	if ((typeof module) == 'object' && module.exports) {
	  module.exports = seedrandom;
	  // When in node.js, try using crypto package for autoseeding.
	  try {
	    nodecrypto = __webpack_require__(19);
	  } catch (ex) {}
	} else if (true) {
	  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return seedrandom; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}
	
	// End anonymous scope, and pass initial values.
	})(
	  [],     // pool: entropy pool starts empty
	  Math    // math: package containing random, pow, and seedrandom
	);


/***/ },
/* 19 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Util = __webpack_require__(7);
	
	var _Tile = __webpack_require__(3);
	
	var _Tile2 = _interopRequireDefault(_Tile);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Route = function () {
	    function Route(a1, a2, biome, orientation) {
	        _classCallCheck(this, Route);
	
	        this.a1 = a1;
	        this.a2 = a2;
	        this.a1.height = 3; // TODO: mocked height;
	        this.a2.height = 0;
	        this.x = Math.floor((a1.x + a2.x) / 2);
	        this.y = Math.floor((a1.y + a2.y) / 2);
	        this.orientation = orientation;
	        if (orientation === 'v') {
	            this.sx = 16;
	            this.sy = Math.abs(a1.y - a2.y) - (a1.ry + a2.ry);
	            this.rx = Math.floor(this.sx / 2);
	            this.ry = Math.floor(this.sy / 2);
	        } else {
	            this.sx = Math.abs(a1.x - a2.x) - (a1.rx + a2.rx);
	            this.sy = 16;
	            this.rx = Math.floor(this.sx / 2);
	            this.ry = Math.floor(this.sy / 2);
	        }
	        this.biome = biome; // TODO: mocked biome
	        this.sx += this.sx % 2 === 0 ? 0 : 2 - this.sx % 2;
	        this.sy += this.sy % 3 === 0 ? 0 : 3 - this.sy % 3;
	
	        this.waitThatWasntThereBeforeWTF = 0.1;
	    }
	
	    _createClass(Route, [{
	        key: 'init',
	        value: function init(grid) {
	            this.resolveSprites();
	            if (this.orientation === 'v') {
	                this.genObstacles(grid);
	                this.repairObstacles(grid);
	                this.genWalkable(grid);
	                this.repairObstacles(grid);
	                this.genEncounterables(grid);
	            } else {
	                this.genObstacles(grid);
	                this.repairObstacles(grid);
	                this.genHorizWalkable(grid);
	                this.repairObstacles(grid);
	                this.genEncounterables(grid);
	                this.genDoodads(grid);
	            }
	            this.assignHeights(grid);
	            this.genLedges(grid);
	            this.genPokemon(grid);
	        }
	    }, {
	        key: 'resolveSprites',
	        value: function resolveSprites() {
	            switch (this.biome) {
	                case 'grass':
	                    this.obstacleFill = 'OB0';
	                    this.encounterable = 'EC0';
	                    this.doodads = ['D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];
	                    this.ledge = 'LG0';
	                    break;
	                case 'snow':
	                    this.obstacleFill = 'OBS';
	                    this.encounterable = 'ECS';
	                    this.doodads = ['DS0', 'DS1', 'DS2', 'DS3'];
	                    this.ledge = 'LGS';
	                    break;
	                case 'sand':
	                    this.obstacleFill = 'OBD';
	                    this.encounterable = 'ECD';
	                    this.doodads = ['DD0', 'DD1'];
	                    this.ledge = 'sand';
	                    break;
	                case 'water':
	                    this.obstacleFill = 'water';
	                    this.encounterable = 'water';
	                    this.doodads = ['DW0', 'DW1', 'DW2', 'DW3'];
	                    this.ledge = 'water';
	                    break;
	                default:
	                    this.obstacleFill = 'OB0';
	                    this.encounterable = 'EC0';
	                    this.doodads = ['D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];
	                    this.ledge = 'LG0';
	                    break;
	            }
	        }
	    }, {
	        key: 'traverse',
	        value: function traverse(f) {
	            for (var i = this.x - this.rx + 1; i < this.x + this.rx; i++) {
	                for (var j = this.y - this.ry; j < this.y + this.ry; j++) {
	                    f(i, j);
	                }
	            }
	        }
	    }, {
	        key: 'assignHeights',
	        value: function assignHeights(grid) {
	            var _this = this;
	
	            this.traverse(function (i, j) {
	                grid[i][j].height = Math.floor(_Util.util.lerp(_this.y - _this.ry, _this.a1.height, _this.y + _this.ry, _this.a2.height, j));
	            });
	        }
	    }, {
	        key: 'genObstacles',
	        value: function genObstacles(grid) {
	            var _this2 = this;
	
	            this.traverse(function (i, j) {
	                if (j % 2 === 0 && j !== 0) {
	                    grid[i][j] = new _Tile2.default(_this2.obstacleFill, true);
	                }
	            });
	        }
	    }, {
	        key: 'repairObstacles',
	        value: function repairObstacles(grid) {
	            var _this3 = this;
	
	            this.traverse(function (i, j) {
	                if (grid[i][j].spriteID === _this3.obstacleFill && grid[i][j].offy === 0) {
	                    grid[i][j + 1] = new _Tile2.default(_this3.obstacleFill, true, 0, 1);
	                } else if (grid[i][j].spriteID === _this3.obstacleFill && grid[i][j].offy === 1) {
	                    grid[i][j - 1] = new _Tile2.default(_this3.obstacleFill, true);
	                }
	            });
	        }
	    }, {
	        key: 'genWalkable',
	        value: function genWalkable(grid) {
	            var maxbx = this.x + this.rx;
	            var minbx = this.x - this.rx;
	            var maxby = this.y + this.ry;
	            var minby = this.y - this.ry;
	            var x = this.x,
	                y = void 0;
	            // forward path
	            for (y = minby; y <= maxby; _Util.util.random() < 0.4 ? y : y++) {
	                var curve = _Util.util.random() * this.rx * Math.sin(y * 2 * Math.PI / 16);
	                x = _Util.util.clamp(minbx, Math.sign(curve) + x, maxbx - 1);
	                for (var i = -1; i <= 1; i++) {
	                    for (var j = -1; j <= 1; j++) {
	                        if (minbx <= x + i && x + i < maxbx && minby <= y + j && y + j <= maxby) {
	                            grid[x + i][y + j] = new _Tile2.default(this.biome, true);
	                        }
	                    }
	                }
	            }
	            // backward path
	            for (y = minby; y <= maxby; _Util.util.random() < 0.4 ? y : y++) {
	                var _curve = -_Util.util.random() * this.rx * Math.sin(y * 2 * Math.PI / 16);
	                x = _Util.util.clamp(minbx, Math.sign(_curve) + x, maxbx - 1);
	                for (var _i = -1; _i <= 1; _i++) {
	                    for (var _j = -1; _j <= 1; _j++) {
	                        if (minbx <= x + _i && x + _i < maxbx && minby <= y + _j && y + _j <= maxby) {
	                            grid[x + _i][y + _j] = new _Tile2.default(this.biome, true);
	                        }
	                    }
	                }
	            }
	        }
	    }, {
	        key: 'genHorizWalkable',
	        value: function genHorizWalkable(grid) {
	            var maxbx = this.x + this.rx;
	            var minbx = this.x - this.rx;
	            var maxby = this.y + this.ry;
	            var minby = this.y - this.ry;
	            var y = this.y,
	                x = void 0;
	
	            for (x = minbx; x <= maxbx; _Util.util.random() < 0.4 ? x : x++) {
	                var curve = _Util.util.random() * this.ry * Math.sin(x * 2 * Math.PI / 16);
	                y = _Util.util.clamp(minby, Math.sign(curve) + y, maxby - 1);
	                for (var i = -1; i <= 1; i++) {
	                    for (var j = -1; j <= 1; j++) {
	                        if (minbx <= x + i && x + i < maxbx && minby <= y + j && y + j <= maxby) {
	                            grid[x + i][y + j] = new _Tile2.default(this.biome, true);
	                        }
	                    }
	                }
	            }
	
	            for (x = minbx; x <= maxbx; _Util.util.random() < 0.4 ? x : x++) {
	                var _curve2 = -_Util.util.random() * this.ry * Math.sin(x * 2 * Math.PI / 16);
	                y = _Util.util.clamp(minby, Math.sign(_curve2) + y, maxby - 1);
	                for (var _i2 = -1; _i2 <= 1; _i2++) {
	                    for (var _j2 = -1; _j2 <= 1; _j2++) {
	                        if (minbx <= x + _i2 && x + _i2 < maxbx && minby <= y + _j2 && y + _j2 <= maxby) {
	                            grid[x + _i2][y + _j2] = new _Tile2.default(this.biome, true);
	                        }
	                    }
	                }
	            }
	        }
	    }, {
	        key: 'genEncounterables',
	        value: function genEncounterables(grid) {
	            var maxbx = this.x + this.rx;
	            var minbx = this.x - this.rx;
	            var maxby = this.y + this.ry;
	            var minby = this.y - this.ry;
	            for (var k = 0; k < 20; k++) {
	                var r = Math.floor(_Util.util.random() * 5) + 1;
	                var rsq = r * r;
	                var x = Math.floor(this.x + _Util.util.random() * this.sx - this.rx);
	                var y = Math.floor(this.y + _Util.util.random() * this.sy - this.ry);
	                for (var i = x - r; i <= x + r; i++) {
	                    for (var j = y - r; j <= y + r; j++) {
	                        var tile = grid[i][j];
	                        if ((x - i) * (x - i) + (y - j) * (y - j) < rsq && tile.spriteID === this.biome && _Util.util.inBound(minbx, i, maxbx) && _Util.util.inBound(minby, j, maxby)) {
	                            tile.spriteID = this.encounterable;
	                        }
	                    }
	                }
	            }
	        }
	    }, {
	        key: 'genHorizEncounterables',
	        value: function genHorizEncounterables(grid) {
	            var maxbx = this.x + this.rx;
	            var minbx = this.x - this.rx;
	            var maxby = this.y + this.ry;
	            var minby = this.y - this.ry;
	            for (var k = 0; k < 20; k++) {
	                var r = Math.floor(_Util.util.random() * 5) + 1;
	                var rsq = r * r;
	                var x = Math.floor(this.x + _Util.util.random() * this.sx - this.rx);
	                var y = Math.floor(this.y + _Util.util.random() * this.sy - this.ry);
	                for (var i = x - r; i <= x + r; i++) {
	                    for (var j = y - r; j <= y + r; j++) {
	                        var tile = grid[i][j];
	                        if ((x - i) * (x - i) + (y - j) * (y - j) < rsq && tile.spriteID === this.biome && _Util.util.inBound(minbx, i, maxbx) && _Util.util.inBound(minby, j, maxby)) {
	                            tile.spriteID = this.encounterable;
	                        }
	                    }
	                }
	            }
	        }
	    }, {
	        key: 'genDoodads',
	        value: function genDoodads(grid) {
	            var _this4 = this;
	
	            this.traverse(function (i, j) {
	                var tile = grid[i][j];
	                // spawn berries!!! omgggggg lawl
	                if (tile.spriteID === _this4.biome) {
	                    if (_Util.util.random() < 0.01) {
	                        grid[i][j] = new _Tile2.default('D8', false, _Util.util.randIntRange(1, 4), 0);
	                    }
	
	                    var prob = 0.01;
	                    var neighbors = 0;
	                    for (var x = i - 1; x <= i + 1; x++) {
	                        for (var y = j - 1; y <= j + 1; y++) {
	                            if (grid[x][y].spriteID[0] === 'D') {
	                                neighbors++;
	                            }
	                        }
	                    }
	                    prob += Math.sqrt(neighbors) * 0.3;
	                    if (_Util.util.random() < prob) {
	                        grid[i][j] = new _Tile2.default(_Util.util.choose(_this4.doodads), true);
	                    }
	                }
	            });
	        }
	    }, {
	        key: 'genLedges',
	        value: function genLedges(grid) {
	            var _this5 = this;
	
	            this.traverse(function (i, j) {
	                var tile = grid[i][j];
	                var belowTile = grid[i][j + 1];
	                if ([_this5.biome, _this5.encounterable].includes(tile.spriteID) && [_this5.biome, _this5.encounterable].includes(belowTile.spriteID) && tile.height !== belowTile.height) {
	                    var prob = 0.3;
	                    var rand = _Util.util.random();
	                    if (grid[i + 1][j].spriteID === _this5.ledge || grid[i - 1][j].spriteID === _this5.ledge) {
	                        rand = 0;
	                    }
	
	                    if (rand < prob) {
	                        tile.spriteID = _this5.ledge;
	                        tile.offx = 0;
	                        tile.offy = 0;
	                    }
	                }
	            });
	        }
	    }, {
	        key: 'genPokemon',
	        value: function genPokemon(grid) {
	            // loop through cells of the route
	            for (var i = this.x - this.rx; i < this.x + this.rx; i++) {
	                for (var j = this.y - this.ry; j < this.y + this.ry; j++) {
	                    if (grid[i][j].spriteID === 'EC0' || grid[i][j].spriteID === 'ECS' || grid[i][j].spriteID === 'ECD' || grid[i][j].biome === 'water') {
	                        var rand = _Util.util.random();
	                        if (grid[i][j].spriteID === 'EC0' && this.biome === 'grass') {
	                            if (rand < 0.03) {
	                                grid[i][j].pokemon = 'g1';
	                            } else if (rand < 0.08) {
	                                grid[i][j].pokemon = 'g2';
	                            } else if (rand < 0.15) {
	                                grid[i][j].pokemon = 'g3';
	                            }
	                        } else if (grid[i][j].spriteID === 'ECD' && this.biome === 'sand') {
	                            if (rand < 0.03) {
	                                grid[i][j].pokemon = 's1';
	                            } else if (rand < 0.08) {
	                                grid[i][j].pokemon = 's2';
	                            } else if (rand < 0.1) {
	                                grid[i][j].pokemon = 's3';
	                            }
	                        } else if (grid[i][j].biome === 'water') {
	                            if (rand < 0.1) {
	                                grid[i][j].pokemon = 'w1';
	                            }
	                        } else {
	                            if (rand < 0.01) {
	                                grid[i][j].pokemon = 'i1';
	                            } else if (rand < 0.08) {
	                                grid[i][j].pokemon = 'i2';
	                            }
	                        }
	                    }
	                }
	            }
	        }
	    }]);
	
	    return Route;
	}();
	
	exports.default = Route;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Tile = __webpack_require__(3);
	
	var _Tile2 = _interopRequireDefault(_Tile);
	
	var _Sprite = __webpack_require__(22);
	
	var _Sprite2 = _interopRequireDefault(_Sprite);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var RenderEngine = function () {
	  function RenderEngine(canvas, ts, pls, pks, world) {
	    _classCallCheck(this, RenderEngine);
	
	    // canvas is 960 x 640
	    this.canvas = canvas;
	    this.ctx = canvas.getContext('2d');
	    this.world = world;
	    this.terrainSprite = ts;
	    this.playerSprite = pls;
	    this.pokemonSprite = pks;
	    // Viewport
	    this.vpWidth = 15;
	    this.vpHeight = 11;
	    this.halfWidth = Math.floor(this.vpWidth / 2);
	    this.halfHeight = Math.floor(this.vpHeight / 2);
	  }
	
	  _createClass(RenderEngine, [{
	    key: 'render',
	    value: function render() {
	      this._renderTerrain();
	      this._renderAgents();
	      if (window.DEBUG_MODE === 1 && !this.debugRendered) {
	        this._renderWorld();
	      }
	    }
	  }, {
	    key: '_renderTerrain',
	    value: function _renderTerrain() {
	      var _world$getMe = this.world.getMe(),
	          pos = _world$getMe.pos;
	
	      for (var i = 0; i < this.vpWidth; i++) {
	        for (var j = 0; j < this.vpHeight; j++) {
	          var x = i + pos.x - this.halfWidth;
	          var y = j + pos.y - this.halfHeight;
	          var tile = this.world.getTile(x, y);
	          this.drawTile(tile, 'terrain', i, j);
	          if (tile.pokemon !== undefined) {
	            this.drawTile(tile, 'pokemon', i, j);
	          }
	        }
	      }
	    }
	  }, {
	    key: '_renderAgents',
	    value: function _renderAgents() {
	      var agents = this.world.agents;
	
	      var me = this.world.getMe();
	      for (var a in agents) {
	        var agent = agents[a];
	        var tile = new _Tile2.default(agent.spriteID, true);
	        tile.spriteID = agent.spriteID;
	        switch (agent.dir) {
	          case 'right':
	            tile.offx = 1;
	            break;
	          case 'up':
	            tile.offx = 2;
	            break;
	          case 'left':
	            tile.offx = 3;
	            break;
	          default:
	            tile.offx = 0;
	        }
	        this.drawTile(tile, 'agent', agent.pos.x - me.pos.x + this.halfWidth, agent.pos.y - me.pos.y + this.halfHeight);
	      }
	    }
	  }, {
	    key: 'drawTile',
	    value: function drawTile(tile, type, x, y) {
	      var spritePos = void 0,
	          spriteSheet = void 0;
	      switch (type) {
	        case 'agent':
	          spritePos = _Sprite.CHARACTER_TILEMAP[tile.spriteID];
	          spriteSheet = this.playerSprite;
	          break;
	        case 'terrain':
	          spritePos = _Sprite.TERRAIN_TILEMAP[tile.spriteID];
	          spriteSheet = this.terrainSprite;
	          break;
	        case 'pokemon':
	          spritePos = _Sprite.POKE_TILEMAP[tile.pokemon];
	          spriteSheet = this.pokemonSprite;
	          break;
	      }
	      var _spriteSheet = spriteSheet,
	          tileHeight = _spriteSheet.tileHeight,
	          tileWidth = _spriteSheet.tileWidth;
	
	      var canvasTileWidth = this.canvas.width / this.vpWidth;
	      var canvasTileHeight = this.canvas.height / this.vpHeight;
	      var canvasPosx = x * canvasTileWidth;
	      var canvasPosy = y * canvasTileHeight;
	      var sx = spritePos.x + tile.offx * tileWidth;
	      var sy = spritePos.y + tile.offy * tileHeight;
	      this.ctx.drawImage(spriteSheet.image, sx, sy, tileWidth, tileHeight, canvasPosx, canvasPosy, canvasTileWidth, canvasTileHeight);
	    }
	  }, {
	    key: '_renderWorld',
	    value: function _renderWorld() {
	      // TODO: this needs to get refactored or i will cry
	      var _world$getMe2 = this.world.getMe(),
	          pos = _world$getMe2.pos;
	
	      var grid = this.world.grid.grid;
	
	      var tmpCanvas = this.canvas;
	      var tmpCtx = this.ctx;
	      this.canvas = window.debugCanvas;
	      this.ctx = window.debugCanvas.getContext('2d');
	      this.vpWidth = window.debugCanvas.width * 2;
	      this.vpHeight = window.debugCanvas.height * 2;
	      this.halfWidth = Math.floor(this.vpWidth / 2);
	      this.halfHeight = Math.floor(this.vpHeight / 2);
	      for (var i = 0; i < this.world.size; i++) {
	        for (var j = 0; j < this.world.size; j++) {
	          var tile = this.world.getTile(i, j);
	          this.drawTile(tile, 'terrain', i, j);
	        }
	      }
	      this.debugRendered = true;
	      // reset values
	      this.vpWidth = 15;
	      this.vpHeight = 11;
	      this.halfWidth = Math.floor(this.vpWidth / 2);
	      this.halfHeight = Math.floor(this.vpHeight / 2);
	      this.canvas = tmpCanvas;
	      this.ctx = tmpCtx;
	    }
	  }]);
	
	  return RenderEngine;
	}();
	
	exports.default = RenderEngine;

/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var TERRAIN_TILEMAP = exports.TERRAIN_TILEMAP = {
	  '0': { x: 0, y: 0 },
	  'grass': { x: 0, y: 2 * 16 }, // grass
	  'snow': { x: 144, y: 48 }, // snow
	  'water': { x: 240, y: 1536 }, // water
	  'dwater': { x: 96, y: 1536 },
	  'DR': { x: 64, y: 224 }, // dirt rock
	  'F': { x: 0, y: 9 * 16 }, // flower
	  'B': { x: 16, y: 128 }, // bush
	  'F2': { x: 16, y: 192 }, // more flowers
	  'sand': { x: 721, y: 48 }, // sand
	  'SB': { x: 192, y: 112 }, // snow bush
	  'WR': { x: 416, y: 128 }, // water rock
	  'PC': { x: 416, y: 384 },
	  'PC1': { x: 336, y: 384 },
	  'BPC': { x: 224, y: 384 },
	  'BPC1': { x: 112, y: 384 },
	  'PM': { x: 560, y: 400 },
	  'PM1': { x: 496, y: 400 },
	  'H0': { x: 0, y: 544 },
	  'H1': { x: 64, y: 544 },
	  'H2': { x: 64 * 2, y: 544 },
	  'H3': { x: 64 * 3, y: 544 },
	  'H4': { x: 64 * 4, y: 544 },
	  'H5': { x: 64 * 5, y: 544 },
	  'H6': { x: 400, y: 544 },
	  'H7': { x: 512, y: 544 },
	  'R0': { x: 368, y: 32 },
	  'R1': { x: 496, y: 224 },
	  'R2': { x: 80, y: 32 },
	  'R01': { x: 384, y: 0 },
	  'T0': { x: 16, y: 144 },
	  'T1': { x: 384, y: 224 },
	  'T2': { x: 304, y: 144 },
	  'T3': { x: 576, y: 144 },
	  'W0': { x: 464, y: 32 },
	  'mtn-d': { x: 432, y: 1328 },
	  'mtn-s': { x: 1056, y: 1200 },
	  'wtr-1': { x: 144, y: 1504 },
	  'wtr-2': { x: 244, y: 1504 },
	  'D0': { x: 0, y: 256 },
	  'D1': { x: 0, y: 272 },
	  'D2': { x: 0, y: 288 },
	  'D3': { x: 48, y: 208 },
	  'D4': { x: 64, y: 208 },
	  'D5': { x: 80, y: 208 },
	  'D6': { x: 96, y: 208 },
	  'D7': { x: 16, y: 192 },
	  'D8': { x: 48, y: 192 },
	  'OB0': { x: 0, y: 208 },
	  'OBS': { x: 752, y: 976 },
	  'OBD': { x: 32, y: 1568 },
	  'EC0': { x: 48, y: 32 },
	  'ECS': { x: 192, y: 80 },
	  'ECD': { x: 544, y: 96 },
	  'LG0': { x: 384, y: 96 },
	  'LGS': { x: 512, y: 1600 },
	  'DW0': { x: 416, y: 128 },
	  'DW1': { x: 464, y: 128 },
	  'DW2': { x: 480, y: 128 },
	  'DW3': { x: 496, y: 128 },
	  'DS0': { x: 160, y: 128 },
	  'DS1': { x: 176, y: 112 },
	  'DS2': { x: 192, y: 112 },
	  'DS3': { x: 192, y: 80 },
	  'DD0': { x: 544, y: 96 },
	  'DD1': { x: 560, y: 80 }
	};
	
	var POKE_TILEMAP = exports.POKE_TILEMAP = {
	  'g1': { x: 0, y: 0 },
	  'g2': { x: 64, y: 384 },
	  'g3': { x: 384, y: 448 },
	  's1': { x: 192, y: 0 },
	  's2': { x: 192, y: 256 },
	  's3': { x: 192, y: 768 },
	  'w1': { x: 192, y: 320 },
	  'i1': { x: 18 * 64, y: 5 * 64 },
	  'i2': { x: 704, y: 896 }
	};
	
	var CHARACTER_TILEMAP = exports.CHARACTER_TILEMAP = {
	  'F': { x: 0, y: 0 }
	};
	
	var Sprite = function () {
	  function Sprite(src, w, h, onload) {
	    _classCallCheck(this, Sprite);
	
	    this.image = new Image();
	    this.image.src = src;
	    this.image.onload = onload;
	    this.tileWidth = w;
	    this.tileHeight = h;
	    this.width = this.image.clientWidth / this.tileWidth;
	    this.height = this.image.clientHeight / this.tileHeight;
	  }
	
	  _createClass(Sprite, [{
	    key: 'getTile',
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