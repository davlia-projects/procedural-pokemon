import Tile from './Tile.js'
export default class Grid {
  constructor(size) {
  	this.size = size;
  	this.grid = new Array(this.size);
    for (let i = 0; i < this.size; i++) {
      this.grid[i] = new Array(this.size);
    }
   	for (let i = 0; i < this.size; i++) {
  		for (let j = 0; j < this.size; j++) {
  			this.grid[i][j] = new Tile('0');
  		}
  	}
  	this.spawnRandomPokemonLocations();
  }

  spawnRandomPokemonLocations() {
  	for (let i = 0; i < this.size; i++) {
  		for (let j = 0; j < this.size; j++) {
  			let rand = Math.random();
  			if (rand > 0.5) {
  				this.grid[i][j].symbol = '$';
  			}
  		}
  	}
  }

  generateWildPokemonAreas() {

  }

}
