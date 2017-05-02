import Tile from './Tile.js'
import Structure from './Structure.js'
import { util } from './Util.js'


export default class Area {
	constructor(x, y, rx, ry, biome, numHouses, pokemart, pokecenter) {
		this.x = x;
		this.y = y;
		this.rx = rx;
		this.ry = ry;
		this.biome = biome;
		this.numHouses = numHouses;
		this.pokemart = pokemart;
		this.pokecenter = pokecenter;
		this.structures = [];
		this.neighbors = [];
	}

	init(grid) {
		if (this.pokecenter) {
			this.genPokecenter(grid);
		}
		if (this.pokemart) {
			this.genPokemart(grid);
		}
		for (let i = 0; i < this.numHouses; i++) {
			this.genHouse(grid);
		}
	}

	genPokecenter(grid) {
		let structure;
		let { px, py } = util.randomDisk(this.rx / 2, this.ry / 2);
		let sizeRand = util.random();
		if (sizeRand < 0.75) {
			structure = new Structure('PC', px, py, 5, 5).init();
		} else {
			structure = new Structure('BPC', px, py, 5, 7).init();
		}
		this.structures.push(structure);
	}

	genPokemart(grid) {
		let structure;
		let { px, py } = util.randomDisk(this.rx / 2, this.ry / 2);
		let sizeRand = util.random();
		if (sizeRand < 0.75) {
			structure = new Structure('PM', px, py, 5, 5).init();
		} else {
			structure = new Structure('BPM', px, py, 5, 7).init();
		}
		this.structures.push(structure);
	}

	genHouse(grid) {
	}
}
