export const TERRAIN_TILEMAP = {
  '0': {x: 0, y: 0},
  'grass': {x: 0, y: 2 * 16}, // grass
  'snow': {x: 144, y: 48}, // snow
  'water': {x: 432, y: 112}, // water
  'DR': {x: 64, y: 224}, // dirt rock
  'F': {x:0, y: 9 * 16}, // flower
  'B': {x:16, y: 128}, // bush
  'F2': {x:16, y: 192}, // more flowers
  'sand': {x: 721, y: 48}, // sand
  'SB': {x: 192, y: 112}, // snow bush
  'WR': {x: 416, y: 128}, // water rock
  'PC': {x: 416, y: 384},
  'mtn-d': {x: 432, y: 1328},
  // more to come...
};

export const POKE_TILEMAP = {
  'g1': {x: 0, y: 0},
  'g2': {x: 64, y: 384},
  'g3': {x: 384, y: 448},
  's1': {x: 192, y: 0},
  's2': {x: 192, y: 256},
  's3': {x: 192, y: 768},
  'w1': {x: 192, y: 320},
  'i1': {x: 18 * 64, y: 5 * 64}
};

export const CHARACTER_TILEMAP = {
  'F': {x: 0, y: 0},
};

export default class Sprite {
  constructor(src, w, h, onload) {
    this.image = new Image();
    this.image.src = src;
    this.image.onload = onload
    this.tileWidth = w;
    this.tileHeight = h;
    this.width = this.image.clientWidth / this.tileWidth;
    this.height = this.image.clientHeight / this.tileHeight;
  }

  getTile(x, y) {
    return {x: x * this.width, y: y * this.height};
  }
}
