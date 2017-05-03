import Tile from './Tile.js'
import Structure from './Structure.js'
import { util } from './Util.js'


export default class Area {
	constructor(x, y, sx, sy, numHouses, pokemart, pokecenter) {
		this.x = x;
		this.y = y;
		this.sx = sx; // TODO: figure out if rx is radius or diameter
		this.sy = sy;
		this.rx = Math.floor(sx / 2);
		this.ry = Math.floor(sy / 2);
		this.numHouses = numHouses;
		this.pokemart = pokemart;
		this.pokecenter = pokecenter;
		this.structures = [];
		this.neighbors = [];
    this.outlets = [];
    this.biome = undefined;

    // TODO: change spriteIDs based on biome
    this.treeSprite = 'T0';
    this.roadSprite = 'R0';
    this.pcSprite = 'PC';
    this.bpcSprite = 'BPC';
    this.pmSprite = 'PM';
    this.pondSprite = 'W0';
    this.doodads = ['D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];
	}

	init(grid) {
    this.genEntryRoads(grid);
		this.genPokecenter(grid);
		this.genPokemart(grid);
		this.genHouses(grid);
    this.repairRoads(grid);
    this.genTrees(grid);
    this.repairTrees(grid);
    this.genDoodads(grid);
    // this.genPonds(grid); // TODO: improve algorithm
	}

  genRoadx(grid, startx, starty, length, lw, rw) {
    util.iterate(startx, startx + length, i => {
      console.log(i);
      for (let w = -lw; w <= rw; w++) {
        if (grid[i][starty + w].spriteID === this.biome) {
          grid[i][starty + w] = new Tile(this.roadSprite, true, 1, 1);
        }
      }
    });
  }

  genRoady(grid, startx, starty, length, lw, rw) {
    util.iterate(starty, starty + length, i => {
      for (let w = -lw; w <= rw; w++) {
        if (grid[startx + w][i].spriteID === this.biome) {
          grid[startx + w][i] = new Tile(this.roadSprite, true, 1, 1);
        }
      }
    });
  }

	genEntryRoads(grid) {
		this.outlets.forEach(outlet => {
      let { x, y } = outlet;
			this.genRoadx(grid, this.x, this.y, x - this.x, 2, 2);
			this.genRoady(grid, x, this.y, y - this.y, 2, 2);
		});
	}

  valid(grid, px, py) {
    let r = 5;
    for (let i = 0; i < this.structures.length; i++) {
      let s = this.structures[i];
      if (Math.abs(px - s.px) + Math.abs(py - s.py) < 1.5 * r) {
        return false;
      }
    }
    for (let i = px - r; i <= px + r; i++) {
      for (let j = py - r; j <= py + r; j++) {
        if (0 <= i && i < grid.length && 0 <= j && j < grid[0].length && grid[i][j].spriteID === this.roadSprite) {
          return false;
        }
      }
    }
    return true;
  }

  validStructureLocation(grid) {
    let px, py, locx, locy;
    do {
      let rd = util.randomDisk(this.rx / 1.3, this.ry / 1.3);
      px = Math.floor(rd.px);
      py = Math.floor(rd.py);
      locx = this.x + px;
      locy = this.y + py;
    } while(!this.valid(grid, locx, locy))
    return {locx, locy};
  }

  connectRoads(grid, locx, locy, structure) {
    let nearest = this.findNearest(this.roadSprite, locx, locy + structure.sy, grid);
    this.genRoady(grid, locx, locy, structure.sy + 2, 1, 1); // protrude down a bit
    locy += structure.sy;
    this.genRoadx(grid, locx, locy, nearest.x - locx + 3 * Math.sign(nearest.x - locx), 1, 1);
    locx = nearest.x + 1;
    this.genRoady(grid, locx, locy, nearest.y - locy + 2 * Math.sign(nearest.y - locy), 1, 1);
  }

	genPokecenter(grid) {
		if (!this.pokecenter) {
			return;
		}

    let { locx, locy } = this.validStructureLocation(grid);
		let sizeRand = util.random();
		let structure = util.randChoice([
			{
				w: 3,
				o: () => {return new Structure(this.pcSprite, locx, locy, 5, 5);}
			},
			{
				w: 1,
				o: () => {return new Structure(this.bpcSprite, locx, locy, 7, 5);}
			}
		])();
    this.connectRoads(grid, locx, locy, structure);
		structure.init(grid);
		this.structures.push(structure);
	}

	genPokemart(grid) {
		if (!this.pokemart) {
			return;
		}
		let { locx, locy } = this.validStructureLocation(grid);
		let sizeRand = util.random();
		let structure = new Structure(this.pmSprite, locx, locy, 4, 4);
    this.connectRoads(grid, locx, locy, structure);
		structure.init(grid);
		this.structures.push(structure);
	}

	genHouses(grid) {
		for (let i = 0; i < this.numHouses; i++) {
			this.genHouse(grid);
		}
	}

	genHouse(grid) {
    let { locx, locy } = this.validStructureLocation(grid);
		let sizeRand = util.random();
		let structure = util.randChoice([
			{
				w: 1,
				o: () => {return new Structure('H0', locx, locy, 4, 4);}
			},
			{
				w: 1,
				o: () => {return new Structure('H1', locx, locy, 4, 4);}
			},
			{
				w: 1,
				o: () => {return new Structure('H2', locx, locy, 4, 4);}
			},
			{
				w: 1,
				o: () => {return new Structure('H3', locx, locy, 4, 4);}
			},
			{
				w: 1,
				o: () => {return new Structure('H4', locx, locy, 4, 4);}
			},
			{
				w: 1,
				o: () => {return new Structure('H5', locx, locy, 5, 5);}
			},
			{
				w: 1,
				o: () => {return new Structure('H6', locx, locy, 7, 5);}
			},
			{
				w: 1,
				o: () => {return new Structure('H7', locx, locy, 5, 5);}
			},
		])();
    this.connectRoads(grid, locx, locy, structure);
		structure.init(grid);
		this.structures.push(structure);
	}

  genTrees(grid) {
    let r = 5;
    for (let i = this.x - this.rx; i <= this.x + this.rx; i++) {
      for (let j = this.y - this.ry; j <= this.y + this.ry; j++) {
        let valid = true;
        for (let x = i - r; x <= i + r; x++) {
          for (let y = j - r; y <= j + r; y++) {
            if ([this.roadSprite, 'H0', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', this.pcSprite, this.bpcSprite, this.pmSprite].includes(grid[x][y].spriteID)) {
              valid = false;
            }
          }
        }
        if (valid && i % 2 === 0 && j % 3 === 0) {
          grid[i][j].spriteID = this.treeSprite;
          grid[i][j].traversable = false;
        }
      }
    }
  }

  repairTrees(grid) {
    let makeTree = (i, j, dx, dy) => {
      let t = grid[i + dx][j + dy];
      t.spriteID = this.treeSprite;
      t.offset(dx, dy);
      t.traversable = false;
    }
    for (let i = this.x - this.rx; i <= this.x + this.rx; i++) {
      for (let j = this.y - this.ry; j <= this.y + this.ry; j++) {
        let tile = grid[i][j];
        if (tile.spriteID === this.treeSprite && tile.offx === 0 && tile.offy === 0) {
          makeTree(i, j, 0, 1);
          makeTree(i, j, 0, 2);
          makeTree(i, j, 1, 0);
          makeTree(i, j, 1, 1);
          makeTree(i, j, 1, 2);
        }
      }
    }
  }

  genPonds(grid) {
    let r = 5;
    let px = Math.floor(this.x + util.random() * this.sx - this.rx);
    let py = Math.floor(this.y + util.random() * this.sy - this.ry);
    let rx = 3;
    let ry = 3;
    let valid = true;
    for (let i = px - rx - r; i <= px + rx + r; i++) {
      for (let j = py - ry - r; j <= py + ry + r; j++) {
        if ([this.roadSprite, 'H0', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', this.pcSprite, this.bpcSprite, this.pmSprite].includes(grid[i][j].spriteID)) {
          valid = false;
        }
      }
    }
    if (valid) {
      for (let i = px - rx; i <= px + rx; i++) {
        for (let j = py - ry; j <= py + ry; j++) {
          grid[i][j].spriteID = this.pondSprite;
          grid[i][j].traversable = false;
        }
      }
    }
  }

  repairPonds(grid) {

  }

  findNearest(spriteID, x, y, grid) {
    let cx = Infinity;
    let cy = Infinity;
    for (let i = this.x - this.rx; i <= this.x + this.rx; i++) {
      for (let j = this.y - this.ry; j <= this.y + this.ry; j++) {
        if (grid[i][j].spriteID === spriteID && (Math.abs(i - x) + Math.abs(j - y)) < (Math.abs(cx - x) + Math.abs(cy - y))) {
          cx = i;
          cy = j;
        }
      }
    }
    return {x: cx, y: cy};
  }

  repairRoads(grid) {
    for (let i = this.x - this.rx; i <= this.x + this.rx; i++) {
      for (let j = this.y - this.ry; j <= this.y + this.ry; j++) {
        let tile = grid[i][j];
        if (tile.spriteID === this.roadSprite) {
          tile.offx = tile.offy = 1;
          if (grid[i + 1][j].spriteID !== this.roadSprite) {
            tile.offx += 1;
          } else if (grid[i - 1][j].spriteID !== this.roadSprite) {
            tile.offx -= 1;
          }
          if (grid[i][j - 1].spriteID !== this.roadSprite) {
            tile.offy -= 1;
          } else if (grid[i][j + 1].spriteID !== this.roadSprite) {
            tile.offy += 1;
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

  genDoodads(grid) {
    let r = 1;
    for (let i = this.x - this.rx; i <= this.x + this.rx; i++) {
      for (let j = this.y - this.ry; j <= this.y + this.ry; j++) {
        let tile = grid[i][j];
        if (tile.spriteID === this.biome) {
          let rand = util.random();
          let spawnProb = 0.01;
          let neighbors = 0;
          for (let x = i - r; x <= i + r; x++) {
            for (let y = j - r; y <= j + r; y++) {
              if (grid[x][y].spriteID[0] === 'D') {
                neighbors++;
              }
            }
          }
          spawnProb += Math.sqrt(neighbors) * 0.03;

          if (rand < spawnProb) {
            let doodad = util.choose(this.doodads);
            tile.spriteID = doodad;
          }
        }
      }
    }
  }
}
