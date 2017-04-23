import Tile from './Tile.js'

export default class World {
  constructor(size) {
  	this.size = size;
  	this.grid = new Array(this.size);
    for (let i = 0; i < this.size; i++) {
      this.grid[i] = new Array(this.size);
    }
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (Math.random() > 0.5) {
          this.grid[i][j] = new Tile('1');
        } else {
          this.grid[i][j] = new Tile('2');
        }
      }
    }
  }

  getTile(x, y) {
    if (0 <= x && x < this.size && 0 <= y && y < this.size) {
      return this.grid[x][y];
    } else {
      return new Tile('0');
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
