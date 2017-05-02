import Tile from './Tile.js'
import Agent from './Agent.js'
import City from './City.js'
import { util } from './Util.js'

export default class World {
  constructor() {
    this.agents = {};
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
      return 'town';
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
    this.grid = new Array(size);
    for (let i = 0; i < size; i++) {
      this.grid[i] = new Array(size);
    }

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        this.grid[i][j] = new Tile('0', false);
      }
    }

    // init city positions
    let cities = [];
    let num_cities = size / 64; // TODO: parameterize later
    for (let i = 0; i < num_cities; i++) {
      let x = Math.floor(util.random() * size);
      let y = Math.floor(util.random() * size);
      let rx = Math.floor(util.random() * size / 8 + size / 10);
      let ry = Math.floor(util.random() * size / 8 + size / 10);
      let city = new City(x, y, rx, ry, undefined, 0, true, true);
      cities.push(city);
    }

    for (let i = 0; i < num_cities; i++) {
      let rand = util.random();
      let city = cities[i];
      city.biome = this.getRandomBiome(rand);
    }


    // connect nodes
    for (let i = 0; i < num_cities-1; i++) {
      let c = cities[i];
      let nc = cities[i+1];
      let pathRadius = size / 64;
      let dx = nc.x - c.x;
      let dy = nc.y - c.y;
      let cx = c.x;
      let cy = c.y;
      let randomOrder = util.random();
      console.log(randomOrder);
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

    // draw cities
    for (let c = 0; c < num_cities; c++) {
      let city = cities[c];
      for (let i = Math.floor(city.pos.x - city.rad.x/2.0); i < city.pos.x + city.rad.x/2.0; i++) {
        for (let j = Math.floor(city.pos.y - city.rad.y/2.0); j < city.pos.y + city.rad.y/2.0; j++) {
          if (0 <= i  && i < this.size && 0 <= j && j < this.size) {
            this.grid[i][j] = new Tile(city.biome, true);
          }
        }
      }
    }

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
