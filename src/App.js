import Grid from './Grid.js'
import Player from './Player.js'
import Viewport from './Viewport.js'

const ASSETS = '../assets';

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


  }

  setup() {
    
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
