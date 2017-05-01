import World from './World.js'
import RenderEngine from './RenderEngine.js'
import Sprite from './Sprite.js'

window.DEBUG_MODE = 0;
const ASSETS = './assets';
const SERVER_URL = 'wss://davidliao.me:8000/play';
const LOCAL_SERVER_URL = 'ws://localhost:8000/play';
const RESOLUTION_SCALE = 3;
export default class App {
  constructor () {
    this.canvas = document.createElement('canvas'); // Aspect ratio of 3:2
    this.canvas.width = 240 * RESOLUTION_SCALE;
    this.canvas.height = 160 * RESOLUTION_SCALE;
    this.terrainSpriteSrc = `${ASSETS}/biomes.png`;
    this.pokemonSpriteSrc = `${ASSETS}/pokemon.png`;
    this.playerSpriteSrc = `${ASSETS}/player.png`;
    this.clientID = -1; // default null value for client ID

    if (window.DEBUG_MODE === 1) {
      window.debugCanvas = document.createElement('canvas');
      window.debugCanvas.width = 512;
      window.debugCanvas.height = 512;
    }
  }

  setup() {
    this.setupWebsocket();
    this.setupGame();
    this.setupEventListeners();
  }

  setupGame() {
    this.world = new World();
    this.re = new RenderEngine(
      this.canvas,
      this.terrainSprite,
      this.playerSprite,
      this.pokemonSprite,
      this.world);
  }

  setupEventListeners() {
    window.addEventListener('keydown', (event) => {
      let me = this.world.getMe();
      switch (event.keyCode) {
        case 32:
          break;
        case 37:
          me.move('left', this.world);
          break;
        case 38:
          me.move('up', this.world);
          break;
        case 39:
          me.move('right', this.world);
          break;
        case 40:
          me.move('down', this.world);
          break;
      }
      this.sendEvent('update', {
        message: 'syncing shit',
        update: {
          delta: [me]
        }
      });
      this.re.render();
    });
  }

  onLoad() {
    document.body.appendChild(this.canvas);
    if (window.DEBUG_MODE === 1) {
      console.log(window.debugCanvas);
      document.body.appendChild(window.debugCanvas);
    }
    // TODO: turn into Promise.All instead of callback chain
    this.terrainSprite = new Sprite(this.terrainSpriteSrc, 16, 16, () => {
      this.pokemonSprite = new Sprite(this.pokemonSpriteSrc, 64, 64, () => {
        this.playerSprite = new Sprite(this.playerSpriteSrc, 25, 30, () => {
          this.setup();
        });
      });
    });
  }

  onUpdate() {
  }

  onResize() {

  }

/**********************
  WebSocket Shenanigans
 **********************/

  setupWebsocket() {
    this.ws = new WebSocket(LOCAL_SERVER_URL);
    this.ws.onopen = this.onWSOpen.bind(this);
    this.ws.onmessage = this.receiveEvent.bind(this);
  }

  onWSOpen() {
    this.sendEvent('init', {message: 'initializing connection and awaiting id assignment'});
  }

  sendEvent(type, data) {
    let m = {
      type: type,
      data: data,
      id: this.clientID
    }
    this.ws.send(JSON.stringify(m));
  }

  receiveEvent(e) {
    let { type, data, id } = JSON.parse(e.data);
    switch (type) {
      case 'init':
        this.clientID = id;
        this.world.initWorld(data.init.world, id);
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
}
