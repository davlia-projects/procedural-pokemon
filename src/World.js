import Tile from './Tile.js'
import Agent from './Agent.js'
import Area from './Area.js'
import { util } from './Util.js'

export default class World {
  constructor() {
    this.agents = {};
    this.areas = [];
  }

  getTile(x, y) {
    if (0 <= x && x < this.size && 0 <= y && y < this.size) {
      return this.grid[x][y];
    } else {
      return null;
    }
  }

  getRandomBiome(rand) {
    if (rand < 0.25) {
      return 'grass';
    }
    else if (rand < 0.50) {
      return 'water';
    }
    else if (rand < 0.75) {
      return 'sand';
    }
    else {
      return 'snow';
    }
  }

  initWorld(world, myID) {
    let { agents, size, seed } = world;
    this.me = myID;
    for (let id in agents) {
      let agentID = parseInt(id);
      this.agents[agentID] = new Agent(agents[id]);
    }

    util.seed(seed);
    this.size = size;

    // creating grid[]
    this.grid = new Array(size);
    for (let i = 0; i < size; i++) {
      this.grid[i] = new Array(size);
    }
    // creating areas
    this.defineNPAreas();
    this.defineAreaCenters();
    this.defineAreaBiomes();
    this.defineAreaContent();
    this.connectAreaCenters();
    this.fixDisconnectedComponents();
    this.fillAreas();
    this.defineNPContent();
    //this.defineCities();
}

  defineNPAreas() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.grid[i][j] = new Tile('0', false);
      }
    }
  }

  defineAreaCenters() {
    // init area
    let numAreas = this.size / 64;

    // edit this to change how close to the side an area can be spawn
    let padding = 30;
    for (let i = 0; i < numAreas; i++) {
      let x = Math.floor(util.random() * this.size);
      let y = Math.floor(util.random() * this.size);
      let sx = Math.floor(util.random() * this.size / 8 + this.size / 10);
      let sy = Math.floor(util.random() * this.size / 8 + this.size / 10);
      while (!(this.goodAvgDist(x, y) && (x + sx/2 < this.size - padding && x - sx/2 > padding))) {
        x = Math.floor(util.random() * this.size);
      }
      while (!(this.goodAvgDist(x, y) && (y + sy/2 < this.size - padding && y - sy/2 > padding))) {
        y = Math.floor(util.random() * this.size);
      }
      let area = new Area(x, y, sx, sy, 3, true, true);
      this.areas.push(area);
    }
  }

  defineAreaBiomes() {
    for (let i = 0; i < this.areas.length; i++) {
      let rand = util.random();
      let area = this.areas[i];
      area.biome = this.getRandomBiome(rand);
    }
  }

  connectAreaCenters() {
    // connect nodes
    for (let i = 0; i < this.areas.length; i++) {
      let a1 = this.areas[i];
      let a2 = this.findNearestArea(a1, a1.neighbors);
      a1.neighbors.push(a2);
      a2.neighbors.push(a1);
      let a3 = this.findNearestArea(a1, a1.neighbors);
      let randomOrder = util.random();
      this.definePaths(a1, a2, randomOrder);
    }
  }

  definePaths(a1, a2, randomOrder) {
    let pathRadius = this.size / 64;
    let dx = a2.x - a1.x;
    let dy = a2.y - a1.y;
    let a1x = a1.x;
    let a1y = a1.y;
    let a2x = a2.x;
    let a2y = a2.y;
    // if (randomOrder < 1) {
    for (let i = 0; i < Math.abs(dx); i++) {
      a1x += Math.sign(dx);
      if (a1x === a1.x + a1.rx || a1x === a1.x - a1.rx) {
        a1.outlets.push({x: a1x, y: a1y});
      }
      if ((Math.abs(dy) < Math.abs(a1.ry)) && (a1x === a2.x + a2.rx || a1x === a2.x - a2.rx)) {
        a2.outlets.push({x: a1x, y: a1y});
      }
      for (let j = -pathRadius; j < pathRadius; j++) {
        if (0 <= a1y + j && a1y + j < this.size) {
          this.grid[a1x][a1y + j] = new Tile(a1.biome, true);
        }
      }
    }
    for (let i = 0; i < Math.abs(dy); i++) {
      a1y += Math.sign(dy);
      if (a1y === a1.y + a1.ry || a1y === a1.y - a1.ry) {
        a2.outlets.push({x: a1x, y: a1y});
      }
      if ((Math.abs(dx) < Math.abs(a1.rx)) && (a1y === a2.y + a2.ry || a1y === a2.y - a2.ry)) {
        a1.outlets.push({x: a1x, y: a1y});
      }
      for (let j = -pathRadius; j < pathRadius; j++) {
        if (0 <= a1x + j && a1x + j < this.size) {
          this.grid[a1x + j][a1y] = new Tile(a2.biome, true);
        }
      }
    }
  }

  fixDisconnectedComponents() {

  }

  defineAreaContent() {
    // draw cities
    for (let c = 0; c < this.areas.length; c++) {
      let area = this.areas[c];
      for (let i = Math.floor(area.x - area.rx); i < area.x + area.rx; i++) {
        for (let j = Math.floor(area.y - area.ry); j < area.y + area.ry; j++) {
          if (0 <= i  && i < this.size && 0 <= j && j < this.size) {
            this.grid[i][j] = new Tile(area.biome, true);
          }
        }
      }
    }
  }

  defineNPContent() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        // check if this is NP tile
        let npTile = this.grid[i][j];
        if (npTile.spriteID === '0' && i + 1 < this.size && i - 1 >= 0) {
          // check if this is a up, down, left, right
          let uTile = this.grid[i][j-1];
          if (uTile !== undefined && (uTile.spriteID === 'grass' || uTile.spriteID === 'sand')) {
            this.grid[i][j] = new Tile('mtn-d', false, 0, -1);
            for (let k = 1; k < 5; k++) {
              this.grid[i][j+k] = new Tile('mtn-d', false, 0, 0);
            }
            continue;
          }
          let dTile = this.grid[i][j+1];
          if (dTile !== undefined && (dTile.spriteID === 'grass' || dTile.spriteID === 'sand')) {
            this.grid[i][j] = new Tile('mtn-d', false, 0, 1);
            for (let k = 1; k < 5; k++) {
              this.grid[i][j-k] = new Tile('mtn-d', false, 0, 0);
            }
            continue;
          }
          let lTile = this.grid[i-1][j];
          if (lTile !== undefined && (lTile.spriteID === 'grass' || lTile.spriteID === 'sand')) {
            this.grid[i][j] = new Tile('mtn-d', false, -1, 0);
            for (let k = 1; k < 7; k++) {
              this.grid[i+k][j] = new Tile('mtn-d', false, 0, 0);
            }
            continue;
          }

          let rTile = this.grid[i+1][j];
          if (rTile !== undefined && (rTile.spriteID === 'grass' || rTile.spriteID === 'sand')) {
            this.grid[i][j] = new Tile('mtn-d', false, 1, 0);
            for (let k = 1; k < 7; k++) {
              this.grid[i-k][j] = new Tile('mtn-d', false, 0, 0);
            }
            continue;
          }

          // check for corners
          let urTile = this.grid[i+1][j+1];
          if (urTile !== undefined && (urTile.spriteID === 'grass' || urTile.spriteID === 'sand')) {
            this.grid[i][j] = new Tile('mtn-d', false, 2, -1);
            // double for loop to fill in the 'rectangle'
            for (let k = 0; k < 7; k++) {
              for (let l = 0; l < 5; l++) {
                if (i - k >= 0 && j - l >= 0 && this.grid[i-k][j-l].spriteID === '0') {
                  this.grid[i-k][j-l] = new Tile('mtn-d', false, 0, 0);
                }
              }
            }
          }

          let ulTile = this.grid[i-1][j+1];
          if (ulTile !== undefined && (ulTile.spriteID === 'grass' || ulTile.spriteID === 'sand')) {
            this.grid[i][j] = new Tile('mtn-d', false, 4, -1);
            // double for loop to fill in the 'rectangle'
            for (let k = 0; k < 7; k++) {
              for (let l = 0; l < 5; l++) {
                if (k === 0 && l === 0) {
                  continue;
                }
                if (i + k < this.size && j - l >= 0 && this.grid[i+k][j-l].spriteID === '0') {
                  this.grid[i+k][j-l] = new Tile('mtn-d', false, 0, 0);
                }
              }
            }
          }

          let brTile = this.grid[i+1][j-1];
          if (brTile !== undefined && (brTile.spriteID === 'grass' || brTile.spriteID === 'sand')) {
            this.grid[i][j] = new Tile('mtn-d', false, 2, 1);
            // double for loop to fill in the 'rectangle'
            for (let k = 0; k < 7; k++) {
              for (let l = 0; l < 5; l++) {
                if (i - k >= 0 && j + l < this.size && this.grid[i-k][j+l].spriteID === '0') {
                  this.grid[i-k][j+l] = new Tile('mtn-d', false, 0, 0);
                }
              }
            }
          }

          let blTile = this.grid[i-1][j-1];
          if (blTile !== undefined && (blTile.spriteID === 'grass' || blTile.spriteID === 'sand')) {
            this.grid[i][j] = new Tile('mtn-d', false, 4, 1);
            // double for loop to fill in the 'rectangle'
            for (let k = 0; k < 7; k++) {
              for (let l = 0; l < 5; l++) {
                if (k === 0 && l === 0) {
                  continue;
                }
                if (i + k < this.size && j + l < this.size && this.grid[i+k][j+l].spriteID === '0') {
                  this.grid[i+k][j+l] = new Tile('mtn-d', false, 0, 0);
                }
              }
            }
          }
        }
      }
    }
  }

  fillNPContent(tile, i, j) {

  }

  fillAreas() {
    this.areas.forEach(area => {
      area.init(this.grid);
    });
  }

  findNearestArea(area, exclude) {
    let {x, y, rx, ry} = area;
    let min_dist = undefined;
    let closest = undefined;
    for (let i = 0; i < this.areas.length; i++) {
      let a = this.areas[i];
      if (a == area || exclude.indexOf(a) !== -1) {
        continue;
      }
      let dist = Math.sqrt(Math.pow((a.x - x), 2) + Math.pow((a.y - y), 2));
      if (dist < min_dist || min_dist === undefined) {
        min_dist = dist;
        closest = a;
      }
    }
    return closest;
  }

  // avgDist defined by user
  goodAvgDist(x, y) {
    if (this.areas.length === 0) {
      return true;
    }
    let a, min_dist, closest;
    for (let i = 0; i < this.areas.length; i++) {
      a = this.areas[i];
      let dist = Math.sqrt(Math.pow((a.x - x), 2) + Math.pow((a.y - y), 2));
      if (dist < min_dist || min_dist === undefined) {
        min_dist = dist;
        closest = a;
      }
    }
    // calculate distance to closest area
    let dist = Math.sqrt(Math.pow((closest.x - x), 2) + Math.pow((closest.y - y), 2));
    if (dist >= 30) {
      return true;
    }
    return false;
  }

  // TODO: should we differentiate between agent types? :thinking:
  addAgents(agents) {
    agents.forEach(a => {
      this.agents[a.id] = new Agent(a);
    });
  }

  updateAgents(agents) {
    agents.forEach(a => {
      this.agents[a.id].update(a);
    });
  }

  deleteAgents(agents) {
    agents.forEach(a => {
      delete this.agents[a.id];
    });
  }

  getMe() {
    return this.agents[this.me];
  }

  resetGrid() {
    // for (let i = 0; i < this.size; i++) {
    //   for (let j = 0; j < this.size; j++) {
    //     this.grid[i][j].hasPlayer = false;
    //   }
    // }
  }

  randomPokemon(i, j, region) {
		let rand = util.random();
    switch(region) {
      case 'grass':
        if (rand < 0.1) {
          this.grid[i][j].pokemon = 'g1';
        } else if (rand < 0.15) {
          this.grid[i][j].pokemon = 'g2';
        } else if (rand < 0.2) {
          this.grid[i][j].pokemon = 'g3';
        }
        break;
      case 'water':
        if (rand < 0.1) {
          this.grid[i][j].pokemon = 'w1';
        }
        break;
      case 'sand':
        if (rand < 0.1) {
          this.grid[i][j].pokemon = 's1';
        } else if (rand < 0.15) {
          this.grid[i][j].pokemon = 's2';
        } else if (rand < 0.2) {
          this.grid[i][j].pokemon = 's3';
        }
        break;
      case 'snow':
        if (rand < 0.01) {
          this.grid[i][j].pokemon = 'i1';
        }
        break;
    }
  }

  serialize() {
    let agents = [];
    for (let p in this.agents) {
      agents.push(this.agents[p]);
    }
    return {
      agents: agents,
      size: this.size,
      seed: this.seed
    };
  }
}
