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
      return new Tile('0');
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

    // creating grid
    this.grid = new Array(size);
    for (let i = 0; i < size; i++) {
      this.grid[i] = new Array(size);
    }
    // creating areas
    this.defineNPAreas();
    this.defineAreaCenters();
    this.defineAreaBiomes();
    this.connectAreaCenters();
    this.defineAreaContent();
    this.defineCities();
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
      let rx = Math.floor(util.random() * this.size / 8 + this.size / 10);
      let ry = Math.floor(util.random() * this.size / 8 + this.size / 10);
      while (!(this.goodAvgDist(x, y) && (x + rx/2 < this.size - padding && x - rx/2 > padding))) {
        x = Math.floor(util.random() * this.size);
      }
      while (!(this.goodAvgDist(x, y) && (y + ry/2 < this.size - padding && y - ry/2 > padding))) {
        y = Math.floor(util.random() * this.size);
      }
      let area = new Area(x, y, rx, ry, 0, false, false);
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
    if (randomOrder < 0.5) {
      // east/west for a1, north/south for a2
      if (Math.sign(dx) === -1) {
        a1.ewOutlet = {x: a1x - a1.rx/2.0, y: a1y};
      }
      else {
        a1.ewOutlet = {x: a1x + a1.rx/2.0, y: a1y};
      }
      if (Math.sign(dy) === -1) {
        a2.nsOutlet = {x: a2x, y: a2y + a2.ry/2.0};
      }
      else {
        a2.nsOutlet = {x: a2x, y: a2y - a2.ry/2.0};
      }
      for (let i = 0; i < Math.abs(dx); i++) {
        a1x += Math.sign(dx);
        for (let j = -pathRadius; j < pathRadius; j++) {
          if (0 <= a1y + j && a1y + j < this.size) {
            this.grid[a1x][a1y + j] = new Tile(a1.biome, true);
          }
        }
      }
      for (let i = 0; i < Math.abs(dy); i++) {
        a1y += Math.sign(dy);
        for (let j = -pathRadius; j < pathRadius; j++) {
          if (0 <= a1x + j && a1x + j < this.size) {
            this.grid[a1x + j][a1y] = new Tile(a2.biome, true);
          }
        }
      }
    }
    else {
      // a1 has nsOutlet, a2 has ewOutlet
      if (Math.sign(dx) === -1) {
        a2.ewOutlet = {x: a2x - a2.rx/2.0, y: a2y};
      }
      else {
        a2.ewOutlet = {x: a2x + a2.rx/2.0, y: a2y};
      }
      if (Math.sign(dy) === -1) {
        a1.nsOutlet = {x: a1x, y: a1y + a1.ry/2.0};
      }
      else {
        a1.nsOutlet = {x: a1x, y: a1y - a1.ry/2.0};
      }
      for (let i = 0; i < Math.abs(dy); i++) {
        a1y += Math.sign(dy);
        for (let j = -pathRadius; j < pathRadius; j++) {
          if (0 <= a1x + j && a1x + j < this.size) {
            this.grid[a1x + j][a1y] = new Tile(a1.biome, true);
          }
        }
      }
      for (let i = 0; i < Math.abs(dx); i++) {
        a1x += Math.sign(dx);
        for (let j = -pathRadius; j < pathRadius; j++) {
          if (0 <= a1y + j && a1y + j < this.size) {
            this.grid[a1x][a1y + j] = new Tile(a2.biome, true);
          }
        }
      }
    }
  }

  defineAreaContent() {
    // draw cities
    for (let c = 0; c < this.areas.length; c++) {
      let area = this.areas[c];
      for (let i = Math.floor(area.x - area.rx/2.0); i < area.x + area.rx/2.0; i++) {
        for (let j = Math.floor(area.y - area.ry/2.0); j < area.y + area.ry/2.0; j++) {
          if (0 <= i  && i < this.size && 0 <= j && j < this.size) {
            this.grid[i][j] = new Tile(area.biome, true);
          }
        }
      }
    }
  }

  defineCities() {
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
      console.log(a);
      let dist = Math.sqrt(Math.pow((a.x - x), 2) + Math.pow((a.y - y), 2));
      console.log(min_dist);
      if (dist < min_dist || min_dist === undefined) {
        min_dist = dist;
        closest = a;
        console.log(closest);
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
