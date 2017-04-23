import World from './World.js'
import Player from './Player.js'
import RenderEngine from './RenderEngine.js'
import Sprite from './Sprite.js'

const ASSETS = './assets';
const SERVER_URL = 'ws://localhost:8000/play';
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
    this.player = new Player(this.world, DEFAULT_PLAYER_POS);
    this.re = new RenderEngine(this.canvas, this.sprite, this.world, this.player);
    this.re.render();
  }

  setupEventListeners() {
    window.addEventListener('keydown', (event) => {
      switch (event.keyCode) {
        case 37:
          this.player.move("left");
          break;
        case 38:
          this.player.move("down");
          break;
        case 39:
          this.player.move("right");
          break;
        case 40:
          this.player.move("up");
          break;
      }
      this.sendEvent('update', {
        player: this.player.serialize()
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
    console.log("Sending: ", type, JSON.stringify(data));
    this.ws.send(JSON.stringify({
      type: type,
      data: data,
      id: this.clientID
    }));
  }

  receiveEvent(e) {
    let { type, data, id } = JSON.parse(e.data);
    console.log("Receiving: ", e.data);
    switch (type) {
      case 'init':
        this.clientID = id;
        break;
      case 'update':
        this.applyUpdate(data)
        break;
      default:
        console.log('Event not handled', e.data);
    }
  }

  applyUpdate(data) {
    let { player } = data;
    this.world.grid[player.x][player.y].hasPlayer = true;
    this.re.render();
  }
}
