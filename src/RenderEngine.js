const TILEMAP = {
  '0': {x: 32, y: 304},
  '1': {x: 16, y: 16},
  '2': {x: 48, y: 16},
  'P': {x: 7 * 16, y: 16},
  'O': {x: 6 * 16, y: 2 * 16}
};

export default class RenderEngine {
  constructor(canvas, sprite, world) {
    // canvas is 960 x 640
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.sprite = sprite;
    this.world = world;

    // Viewport
    this.vpWidth = 15;
    this.vpHeight = 11;
    this.halfWidth = Math.floor(this.vpWidth / 2);
    this.halfHeight = Math.floor(this.vpHeight / 2);
    this.viewport = new Array(this.vpWidth);
    for (let i = 0; i < this.vpWidth; i++) {
      this.viewport[i] = new Array(this.vpHeight);
    }
  }

  render() {
    this._renderTerrain();
    this._renderCharacters();
  }

  _renderTerrain() {
    let { pos } = this.world.me;
    for (let i = 0; i < this.vpWidth; i++) {
      for (let j = 0; j < this.vpHeight; j++) {
        let x = i + pos.x - this.halfWidth;
        let y = j + pos.y - this.halfHeight;
        let tile = this.world.getTile(x, y);
        this.drawTile(tile.symbol, i, j);
      }
    }
  }

_renderCharacters() {
  let { players } = this.world;
  for (let p in players) {
    let player = players[p];
    let tile = this.world.getTile(player.pos.x, player.pos.y);
    let { me } = this.world;
    this.drawTile('P', player.pos.x - me.pos.x + this.halfWidth, player.pos.y - me.pos.y + this.halfHeight);
  }
}

  drawTile(tile, x, y) {
    let spritePos = TILEMAP[tile];
    let { tileHeight, tileWidth } = this.sprite;

    let canvasTileWidth = this.canvas.width / this.vpWidth;
    let canvasTileHeight = this.canvas.height / this.vpHeight;
    let canvasPosx = x * canvasTileWidth;
    let canvasPosy = y * canvasTileHeight;
    this.ctx.drawImage(
      this.sprite.image,
      spritePos.x, spritePos.y,
      tileWidth, tileHeight,
      canvasPosx, canvasPosy,
      canvasTileWidth, canvasTileHeight
    );
  }
}
