import Tile from './Tile.js'

class Player {
  constructor(pos, id) {
    this.pos = {x: pos.x, y: pos.y};
    this.id = id;
  }

  move(dir, world) {
    switch(dir) {
      case 'right':
        if (this.pos.x + 1 < world.size) {
          this.pos.x += 1;
        }
        break;
      case 'left':
        if (this.pos.x - 1 >= 0) {
          this.pos.x -= 1;
        }
        break;
      case 'up':
        if (this.pos.y + 1 < world.size) {
          this.pos.y += 1;
        }
        break;
      case 'down':
        if (this.pos.y - 1 >= 0) {
          this.pos.y -= 1;
        }
        break;
    }
  }

  moveTo(pos) {
    this.pos.x = pos.x;
    this.pos.y = pos.y;
  }

  serialize() {
    return {
      pos: {
        x: this.pos.x,
        y: this.pos.y
      },
      id: this.id,
    };
  }
}

export default class World {
  constructor() {
    this.players = {};
    window.x = this;
  }

  getTile(x, y) {
    if (0 <= x && x < this.size && 0 <= y && y < this.size) {
      return this.grid[x][y];
    } else {
      return new Tile('0');
    }
  }

  update(player) {
    let { pos, id } = player;
    let p = this.players[id];
    // create new player and add it if it doesn't exist yet
    if (!p) {
      p = new Player(pos, id);
      this.players[id] = p;

    }
    p.moveTo(pos);
  }

  removePlayerByID(id) {
    delete this.players[id];

  }

  initWorld(size, pos, id) {
    this.me = new Player(pos, id);
    this.players[id] = this.me;

    this.size = size;
    this.grid = new Array(size);
    for (let i = 0; i < size; i++) {
      this.grid[i] = new Array(size);
    }
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (Math.random() > 0.5) {
          this.grid[i][j] = new Tile('1');
        } else {
          this.grid[i][j] = new Tile('2');
        }
      }
    }
  }

  resetGrid() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.grid[i][j].hasPlayer = false;
      }
    }
  }

  spawnRandomPokemonLocations() {
  	for (let i = 0; i < this.size; i++) {
  		for (let j = 0; j < this.size; j++) {
  			let rand = Math.random();
  			if (rand > 0.5) {
  				this.grid[i][j].symbol = '1';
  			}
  		}
  	}
  }

  generateWildPokemonAreas() {
  }
}
