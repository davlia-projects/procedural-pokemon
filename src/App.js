import World from './World.js'
import Player from './Player.js'
import RenderEngine from './RenderEngine.js'
import Sprite from './Sprite.js'

const ASSETS = './assets';
const SERVER_URL = 'ws://localhost:8000/play';
const RESOLUTION_SCALE = 3;

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
    this.world = new World(100);
    this.player = new Player(this.world);
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

/*******
 WebSocket Shenanigans
 *******/

  setupWebsocket() {
    this.ws = new WebSocket(SERVER_URL);
    this.ws.onopen = this.onWSOpen.bind(this);
    this.ws.onmessage = this.receiveEvent.bind(this);
  }

  onWSOpen() {
    this.sendEvent('init', 'initializing connection and awaiting id assignment');
  }

  sendEvent(type, message) {
    console.log(type, message);
    this.ws.send(JSON.stringify({
      'type': type,
      'message': message,
      'id': this.clientID
    }));
  }

  receiveEvent(e) {
    let { type, message, id } = JSON.parse(e.data);
    console.log(type, message, id);
    if (type === 'init') {
      this.clientID = id;
    }
  }
}
