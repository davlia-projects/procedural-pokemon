import Tile from './Tile.js'
export default class Grid {
  constructor(size) {
  	this.size = size;
  	this.grid = [];
  	while(this.grid.push([]) < size);
   	for (var i = 0; i < this.size; i++) {
  		for (var j = 0; j < this.size; j++) {
  			this.grid[i][j] = new Tile('0');
  		}
  	}
  	this.spawnRandomPokemonLocations();
  }

  spawnRandomPokemonLocations() {
    console.log("spawning pokemon");
  	for (var i = 0; i < this.size; i++) {
  		for (var j = 0; j < this.size; j++) {
  			var rand = Math.random();
  			if (rand > 0.5) {
  				this.grid[i][j].symbol = '$';
  			}
  		}
  	}
  }

  generateWildPokemonAreas() {

  }

}
