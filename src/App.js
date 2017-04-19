import Grid from './Grid.js'
import Player from './Player.js'
import Viewport from './Viewport.js'
import RenderEngine from './RenderEngine.js'
import Sprite from './Sprite.js'

const ASSETS = '../assets';

export default class App {
  constructor () {
    this.canvas = document.createElement('canvas');
    // Aspect ratio of 3:2
    this.canvas.width = 960;
    this.canvas.height = 640;
    this.ctx = this.canvas.getContext('2d');
    this.spriteSrc = `${ASSETS}/sprites.png`;

  }

  setup() {
    this.grid = new Grid(10);
    this.player = new Player();
    this.re = new RenderEngine(this.ctx, this.sprite);
    this.re.renderGrid(this.grid);
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
}
