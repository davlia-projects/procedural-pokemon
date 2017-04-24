import World from './World.js'
import Player from './Player.js'
import RenderEngine from './RenderEngine.js'
import Sprite from './Sprite.js'

const ASSETS = './assets';
const SERVER_URL = 'ws://davidliao.me:8000/play';
const RESOLUTION_SCALE = 3;
const DEFAULT_WORLD_SIZE = 100;
const DEFAULT_PLAYER_POS = {x: 10, y: 10};
export default class App {
  constructor () {
    this.canvas = document.createElement('canvas');
    // Aspect ratio of 3:2
    this.canvas.width = 240 * RESOLUTION_SCALE;
    this.canvas.height = 160 * RESOLUTION_SCALE;
    this.spriteSrc = `${ASSETS}/sprites.png`;
    this.clientID = -1; // default null value for client ID

    // TODO: remove this debug statement
    window.x = this;
  }

  setup() {
    this.setupWebsocket();
    this.setupEventListeners();
    this.setupGame();
  }

  setupGame() {
    this.world = new World(DEFAULT_WORLD_SIZE);
    this.re = new RenderEngine(this.canvas, this.sprite, this.world);
  }

  setupEventListeners() {
    window.addEventListener('keydown', (event) => {
      let { me } = this.world;
      switch (event.keyCode) {
        case 32:
          break;
        case 37:
          me.move("left", this.world);
          break;
        case 38:
          me.move("down", this.world);
          break;
        case 39:
          me.move("right", this.world);
          break;
        case 40:
          me.move("up", this.world);
          break;
      }
      this.sendEvent('sync', {
        message: 'syncing shit',
        game: {
          world: this.world.serialize()
        }
      });
      this.re.render();
    });
  }

  onLoad() {
    document.body.appendChild(this.canvas);
    this.sprite = new Sprite(this.spriteSrc, () => {
      this.setup();
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
    this.ws = new WebSocket(SERVER_URL);
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
    // console.log("Sending: ", JSON.stringify(m));
    this.ws.send(JSON.stringify(m));
  }

  receiveEvent(e) {
    let { type, data, id } = JSON.parse(e.data);
    // console.log("Receiving: ", e.data);
    switch (type) {
      case 'init':
        this.clientID = id;
        this.world.initWorld(data.game.world, id);
        break;
      case 'sync':
        this.world.syncPlayers(data.game.world.players, id);
        break;
      default:
        console.log('event not handled', e.data);
        return;
    }
    this.re.render();
  }
}
