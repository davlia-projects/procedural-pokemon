import Tile from './Tile.js'
import Structure from './Structure.js'
import { util } from './Util.js'


export default class Area {
	constructor(x, y, sx, sy, biome, numHouses, pokemart, pokecenter) {
		this.x = x;
		this.y = y;
		this.sx = sx; // TODO: figure out if rx is radius or diameter
		this.sy = sy;
		this.rx = Math.floor(sx / 2);
		this.ry = Math.floor(sy / 2);
		this.biome = biome;
		this.numHouses = numHouses;
		this.pokemart = pokemart;
		this.pokecenter = pokecenter;
		this.structures = [];
		this.neighbors = [];
		this.entryPoints = [{x: x + this.rx, y: y}, {x: x, y: y + this.ry}];
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
			let sx = Math.sign(ep.x - this.x);
			util.iterate(this.x - sx * 2, ep.x, i => {
				for (let w = -2; w <= 2; w++) {
					grid[i][this.y + w] = new Tile('R0', true, 1, 1);
				}
			});
			let sy = Math.sign(ep.x - this.x);
			util.iterate(this.y - sy * 2, ep.y, i => {
				for (let w = -2; w <= 2; w++) {
					grid[this.x + w][i] = new Tile('R0', true, 1, 1);
				}
			});
		})

		// fix roads
		for (let i = this.x - this.rx; i <= this.x + this.rx; i++) {
			for (let j = this.y - this.ry; j <= this.y + this.ry; j++) {
				let tile = grid[i][j];
				if (tile.spriteID === 'R0') {
					tile.offx = tile.offy = 1;
					if (grid[i + 1][j].spriteID !== 'R0') {
						tile.offx += 1;
					} else if (grid[i - 1][j].spriteID !== 'R0') {
						tile.offx -= 1;
					}
					if (grid[i][j + 1].spriteID !== 'R0') {
						tile.offy += 1;
					} else if (grid[i][j - 1].spriteID !== 'R0') {
						tile.offy -= 1;
					}
					if (grid[i + 1][j + 1].spriteID === this.biome && tile.offx === 1 && tile.offy === 1) {
						tile.offx = 2;
						tile.offy = -1;
					} else if (grid[i + 1][j - 1].spriteID === this.biome && tile.offx === 1 && tile.offy === 1) {
						tile.offx = 2;
						tile.offy = -2;
					} else if (grid[i - 1][j + 1].spriteID === this.biome && tile.offx === 1 && tile.offy === 1) {
						tile.offx = 1;
						tile.offy = -1;
					} else if (grid[i - 1][j - 1].spriteID === this.biome && tile.offx === 1 && tile.offy === 1) {
						tile.offx = 1;
						tile.offy = -2;
					}
				}
			}
		}
	}

	genPokecenter(grid) {
		if (!this.pokecenter) {
			return;
		}
		let { px, py } = util.randomDisk(this.rx, this.ry);
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
		let { px, py } = util.randomDisk(this.rx, this.ry);
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
		let { px, py } = util.randomDisk(this.rx, this.ry);
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
