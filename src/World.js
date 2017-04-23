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

  update(player) {
    this.pos = player.pos;
    this.id = player.id;
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
    this.me = new Player({x: 0, y: 0}, -1);
    window.x = this;
  }

  getTile(x, y) {
    if (0 <= x && x < this.size && 0 <= y && y < this.size) {
      return this.grid[x][y];
    } else {
      return new Tile('0');
    }
  }

  initWorld(world, id) {
    let { players, size, seed } = world;
    players.forEach(p => {
      this.players[p.id] = p;
      if (p.id === id) {
        this.me.update(p);
      }
    });

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

  syncPlayers(players, id) {
    this.players = {};
    players.forEach(p => {
      this.players[p.id] = p;
      if (p.id === id) {
        this.me.update(p);
      }
    });
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

  serialize() {
    let players = [];
    for (let p in this.players) {
      console.log(this.players[p])
      players.push(this.players[p]);
    }
    return {
      players: players,
      size: this.size,
      seed: this.seed
    };
  }
}
