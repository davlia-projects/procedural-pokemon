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
		this.entryPoints = [{x: x + Math.floor(rx / 2), y: y}, {x: x, y: Math.floor(y + ry)}];
	}

	init(grid) {
		this.genRoad(grid)
		this.genPokecenter(grid);
		this.genPokemart(grid);
		this.genHouses(grid);
	}

	genRoad(grid) {
		// TODO: entrances are mocked
		this.entryPoints.forEach(ep => {
			// let dx = ep.x - this.x;
			// let sdx = Math.sign(dx);
			// let dy = ep.y - this.y;
			// let sdy = Math.sign(dy);
			// for (let i = this.x; i !== ep.x; i += sdx) {
			// 	grid[i][this.y] = new Tile('R0', true);
			// }
			util.iterate(this.x, ep.x, i => {
				grid[i][this.y] = new Tile('R0', true);
			});
		})
	}

	genPokecenter(grid) {
		if (!this.pokecenter) {
			return;
		}
		let { px, py } = util.randomDisk(this.rx / 4, this.ry / 4);
		let sizeRand = util.random();
		let structure = util.randChoice([
			{
				w: 3,
				o: () => {return new Structure('PC', this.x + px, this.y + py, 5, 5);}
			},
			{
				w: 1,
				o: () => {return new Structure('BPC', this.x + px, this.y + py, 7, 5);}
			}
		])();
		structure.init(grid);
		this.structures.push(structure);
	}

	genPokemart(grid) {
		if (this.pokemart) {
			return;
		}
		let { px, py } = util.randomDisk(this.rx / 2, this.ry / 2);
		let sizeRand = util.random();
		let structure = new Structure('PM', this.x + px, this.y + py, 4, 4);
		structure.init(grid);
		this.structures.push(structure);
	}

	genHouses(grid) {
		for (let i = 0; i < this.numHouses; i++) {
			this.genHouse(grid);
		}
	}

	genHouse(grid) {
		let { px, py } = util.randomDisk(this.rx / 2, this.ry / 2);
		let sizeRand = util.random();
		let structure = util.randChoice([
			{
				w: 1,
				o: () => {return new Structure('H0', this.x + px, this.y + py, 4, 4);}
			},
			{
				w: 1,
				o: () => {return new Structure('H1', this.x + px, this.y + py, 4, 4);}
			},
			{
				w: 1,
				o: () => {return new Structure('H2', this.x + px, this.y + py, 4, 4);}
			},
			{
				w: 1,
				o: () => {return new Structure('H3', this.x + px, this.y + py, 4, 4);}
			},
			{
				w: 1,
				o: () => {return new Structure('H4', this.x + px, this.y + py, 4, 4);}
			},
			{
				w: 1,
				o: () => {return new Structure('H5', this.x + px, this.y + py, 5, 5);}
			},
			{
				w: 1,
				o: () => {return new Structure('H6', this.x + px, this.y + py, 7, 5);}
			},
			{
				w: 1,
				o: () => {return new Structure('H7', this.x + px, this.y + py, 5, 5);}
			},
		])();
		structure.init(grid);
		this.structures.push(structure);
	}
}
