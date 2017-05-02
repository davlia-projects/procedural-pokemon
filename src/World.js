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
      return 'grass';
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
    let padding = 50;
    for (let i = 0; i < numAreas; i++) {
      let x = Math.floor(util.random() * this.size);
      let y = Math.floor(util.random() * this.size);
      let rx = Math.floor(util.random() * this.size / 8 + this.size / 10);
      let ry = Math.floor(util.random() * this.size / 8 + this.size / 10);
      while (x + rx/2 > this.size - padding || x - rx/2 < padding) {
        x = Math.floor(util.random() * this.size);
      }
      while (y + ry/2 > this.size - padding || y - ry/2 < padding) {
        y = Math.floor(util.random() * this.size);
      }
      let area = new Area(x, y, rx, ry, undefined, 0, false, false);
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
    for (let i = 0; i < this.areas.length-1; i++) {
      let c = this.areas[i];
      let nc = this.areas[i+1];
      let pathRadius = this.size / 64;
      let dx = nc.x - c.x;
      let dy = nc.y - c.y;
      let cx = c.x;
      let cy = c.y;
      let randomOrder = util.random();
      if (randomOrder > 0.80) {
        for (let i = 0; i < Math.abs(dx); i++) {
          cx += Math.sign(dx);
          for (let j = -pathRadius; j < pathRadius; j++) {
            if (0 <= cy + j && cy + j < this.size) {
              this.grid[cx][cy + j] = new Tile(c.biome, true);
            }
          }
        }
        for (let i = 0; i < Math.abs(dy); i++) {
          cy += Math.sign(dy);
          for (let j = -pathRadius; j < pathRadius; j++) {
            if (0 <= cx + j && cx + j < this.size) {
              this.grid[cx + j][cy] = new Tile(nc.biome, true);
            }
          }
        }
      }
      else {
        for (let i = 0; i < Math.abs(dy); i++) {
          cy += Math.sign(dy);
          for (let j = -pathRadius; j < pathRadius; j++) {
            if (0 <= cx + j && cx + j < this.size) {
              this.grid[cx + j][cy] = new Tile(c.biome, true);
            }
          }
        }
        for (let i = 0; i < Math.abs(dx); i++) {
          cx += Math.sign(dx);
          for (let j = -pathRadius; j < pathRadius; j++) {
            if (0 <= cy + j && cy + j < this.size) {
              this.grid[cx][cy + j] = new Tile(nc.biome, true);
            }
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
    cities.forEach(city => {
      city.init(this.grid);
    });
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
