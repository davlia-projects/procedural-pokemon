const TILEMAP = {
  '0': {x: 32, y: 304},
  '1': {x: 16, y: 16},
  '2': {x: 48, y: 16},
  'P': {x: 7 * 16, y: 16},
  'O': {x: 6 * 16, y: 2 * 16}
};

const TERRAIN_TILEMAP = {
  '0': {x: 224, y: 224},
  'G': {x: 0, y: 2 * 16}, // grass
  'S': {x: 144, y: 48}, // snow
  'W': {x: 432, y: 112}, // water
  'DR': {x: 64, y: 224}, // dirt rock
  'F': {x:0, y: 9 * 16}, // flower
  'B': {x:16, y: 128}, // bush
  'F2': {x:16, y: 192}, // more flowers
  'D': {x: 721, y: 48}, // sand
  'SB': {x: 192, y: 112}, // snow bush
  'WR': {x: 416, y: 128} // water rock
  // more to come...
};

const POKE_TILEMAP = {
  'g1': {x: 0, y: 0},
  'g2': {x: 64, y: 384},
  'g3': {x: 384, y: 448},
  's1': {x: 192, y: 0},
  's2': {x: 192, y: 256},
  's3': {x: 192, y: 768},
  'w1': {x: 192, y: 320},
  'i1': {x: 18 * 64, y: 5 * 64}
};

const CHARACTER_TILEMAP = {
  'F0': {x: 0, y: 0},
  'F1': {x: 25, y: 0},
  'F2': {x: 50, y: 0},
  'F3': {x: 75, y: 0},
};

export default class RenderEngine {
  constructor(canvas, ts, pls, pks, world) {
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
    this.viewport = new Array(this.vpWidth);
    for (let i = 0; i < this.vpWidth; i++) {
      this.viewport[i] = new Array(this.vpHeight);
    }
  }

  render() {
    this._renderTerrain();
    this._renderAgents();
    this._renderPokemon();
  }

  _renderTerrain() {
    let { pos } = this.world.me;
    for (let i = 0; i < this.vpWidth; i++) {
      for (let j = 0; j < this.vpHeight; j++) {
        let x = i + pos.x - this.halfWidth;
        let y = j + pos.y - this.halfHeight;
        let tile = this.world.getTile(x, y);
        this.drawTile(tile.symbol, 'terrain', i, j);
      }
    }
  }

  _renderAgents() {
    let { agents, me } = this.world;
    for (let a in agents) {
      let agent = agents[a];
      let tile = this.world.getTile(agent.pos.x, agent.pos.y);
      let sprite = agent.spriteID;
      switch (agent.dir) {
        case 'right':
          sprite += '1';
          break;
        case 'up':
          sprite += '2';
          break;
        case 'left':
          sprite += '3';
          break;
        default:
          sprite += '0';
      }
      this.drawTile(sprite, 'agent', agent.pos.x - me.pos.x + this.halfWidth, agent.pos.y - me.pos.y + this.halfHeight);
    }
  }

  _renderPokemon() {
    let {pos} = this.world.me;
    for (let i = 0; i < this.vpWidth; i++) {
      for (let j = 0; j < this.vpHeight; j++) {
        let x = i + pos.x - this.halfWidth;
        let y = j + pos.y - this.halfHeight;
        let tile = this.world.getTile(x, y);
        if (tile.pokemon !== undefined) {
          this.drawTile(tile.pokemon, 'pokemon', i, j);
        }
      }
    }
  }

  drawTile(tile, type, x, y) {
    let spritePos, spriteSheet;
    switch (type) {
      case 'agent':
        spritePos = CHARACTER_TILEMAP[tile];
        spriteSheet = this.playerSprite;
        break;
      case 'terrain':
        spritePos = TERRAIN_TILEMAP[tile];
        spriteSheet = this.terrainSprite;
        break;
      case 'pokemon':
        spritePos = POKE_TILEMAP[tile];
        spriteSheet = this.pokemonSprite;
        break;
    }
    let { tileHeight, tileWidth } = spriteSheet;
    let canvasTileWidth = this.canvas.width / this.vpWidth;
    let canvasTileHeight = this.canvas.height / this.vpHeight;
    let canvasPosx = x * canvasTileWidth;
    let canvasPosy = y * canvasTileHeight;
    this.ctx.drawImage(
      spriteSheet.image,
      spritePos.x, spritePos.y,
      tileWidth, tileHeight,
      canvasPosx, canvasPosy,
      canvasTileWidth, canvasTileHeight
    );
  }
}
