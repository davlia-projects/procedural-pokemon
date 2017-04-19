import Grid from './Grid.js'
import Player from './Player.js'
import Viewport from './Viewport.js'

const ASSETS = '../assets';
const SERVER_URL = 'ws://localhost:8000/play';

export default class App {
  constructor () {
    this.grid = new Grid();
    this.player = new Player();
    this.canvas = document.createElement('canvas');
    // Aspect ratio of 3:2
    this.canvas.width = 960;
    this.canvas.height = 640;
    this.ctx = this.canvas.getContext('2d');

    let spriteSrc = `${ASSETS}/sprites.png`;

  setup() {
    this.setupWebsocket();
    this.setupEventListeners();
  }

  setupWebsocket() {
    let ws = new WebSocket(SERVER_URL);
    ws.onopen = () => {
      console.log('websocket connection opened');
      ws.send('ping');
    }
    ws.onmessage = (evt) => {
      console.log(`evt received ${evt}`);
    }
    ws.onclose = () => {
      console.log('websocket connection closed');
    }
  }

  setupEventListeners() {
    this.canvas.addEventListener('keypress', () => {
      switch (code) {
        case 37:
          this.player.move('left');
          break;
        case 38:
          this.player.move('up');
          break;
        case 39:
          this.player.move('right');
          break;
        case 40:
          this.player.move('down');
          break;
      }
    });
  }

  onLoad() {
    document.body.appendChild(this.canvas);
    this.sprite = new Sprite(spriteSrc, () => {
      this.setup();
    });
  }

  onUpdate() {

  }

  onResize() {

  }
}
