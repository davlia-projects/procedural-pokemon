import Tile from './Tile.js'
import { util } from './Util.js'


export default class City {
	constructor(pos, biome, rad, numHouses, pokemart, pokecenter) {
		this.pos = pos;
		this.rad = rad;
		this.biome = biome;
		this.numHouses = numHouses;
		this.pokemart = pokemart;
		this.pokecenter = pokecenter;
	}

	init(grid) {
		// sample disk
		if (this.pokecenter) {
			let {px, py} = util.randomDisk(this.rad.x / 2, this.rad.y / 2);
			let sizeRand = util.random();
			if (sizeRand < 1) {
				// create 5x5 pokecenter
				for (let i = 0; i < 5; i++) {
					for (let j = 0; j < 5; j++) {
						let x = Math.floor(this.pos.x + px + i - 2);
						let y = Math.floor(this.pos.y + py + j - 2);
						grid[x][y] = new Tile(`PC${i}${j}`, false);
					}
				}
			} else {
				// create 7x5 pokecenter
				for (let i = 0; i < 7; i++) {
					for (let j = 0; j < 5; j++) {
						let x = Math.floor(this.pos.x + px + i - 3);
						let y = Math.floor(this.pos.y + py + j - 2);
						grid[x][y] = new Tile(`PCB${i}${j}`, false);
					}
				}
			}
		}
	}
}
