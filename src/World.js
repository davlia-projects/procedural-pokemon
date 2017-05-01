import Tile from './Tile.js'
import Agent from './Agent.js'
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

    /// REWRITE
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        this.grid[i][j] = new Tile('0', false);
      }
    }

    // init city positions 
    let cities = [];
    let num_cities = 10; // TODO: parameterize later
    for (let i = 0; i < num_cities; i++) {
      let x = Math.floor(util.random() * size);
      let y = Math.floor(util.random() * size);
      let rx = Math.floor(util.random() * size / 8 + size / 8);
      let ry = Math.floor(util.random() * size / 8 + size / 8);
      let city = {x, y, rx, ry}; 
      cities.push(city);
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
      for (let i = 0; i < Math.abs(dx); i++) {
        cx += Math.sign(dx);
        for (let j = -pathRadius; j < pathRadius; j++) {
          if (0 <= cy + j && cy + j < this.size) {
            this.grid[cx][cy + j] = new Tile('F', true);
          }
        }
      }
      for (let i = 0; i < Math.abs(dy); i++) {
        cy += Math.sign(dy);
        for (let j = -pathRadius; j < pathRadius; j++) {
          if (0 <= cx + j && cx + j < this.size) {
            this.grid[cx + j][cy] = new Tile('F', true);
          }
        }
      }
    }

    // draw cities
    for (let c = 0; c < num_cities; c++) {
      let city = cities[c];
      for (let i = Math.floor(city.x - city.rx/2.0); i < city.x + city.rx/2.0; i++) {
        for (let j = Math.floor(city.y - city.ry/2.0); j < city.y + city.ry/2.0; j++) {
          if (0 <= i  && i < this.size && 0 <= j && j < this.size) {
            this.grid[i][j] = new Tile('G', true);
          }
        }
      }
    }

  //   // generate four regions
  //   // top-left: grassy plains
  //   for (let i = 0; i < size / 2.0; i++) {
  //     for (let j = 0; j < size / 2.0; j++) {
  //       let rand = util.random();
  //       if (rand < 0.75) {
  //         this.grid[i][j] = new Tile('G', true);
  //         this.randomPokemon(i, j, 'grass') // can also not add a pokemon
  //       } else if (rand < 0.9) {
  //         this.grid[i][j] = new Tile('F', true);
  //       } else if (rand < 0.95) {
  //         this.grid[i][j] = new Tile('B', false);
  //       } else {
  //         this.grid[i][j] = new Tile('F2', true);
  //       }
  //     }
  //   }
  //   // top-right: snow region
  //   for (let i = size / 2.0; i < size; i++) {
  //     for (let j = 0; j < size / 2.0; j++) {
  //       let rand = util.random();
  //       if (rand < 0.8) {
  //         this.grid[i][j] = new Tile('S', true);
  //         this.randomPokemon(i, j, 'snow') // can also not add a pokemon
  //       } else {
  //         this.grid[i][j] = new Tile('SB', false);
  //       }
  //     }
  //   }
  //   // bottom-left: desert rocky area
  //   for (let i = 0; i < size; i++) {
  //     for (let j = size / 2.0; j < size; j++) {
  //       let rand = util.random();
  //       if (rand < 0.8) {
  //         this.grid[i][j] = new Tile('D', true);
  //         this.randomPokemon(i, j, 'sand') // can also not add a pokemon
  //       } else {
  //         this.grid[i][j] = new Tile('DR', false);
  //       }
  //     }
  //   }
  //   // bottom-right: water region
  //   for (let i = size / 2.0; i < size; i++) {
  //     for (let j = size / 2.0; j < size; j++) {
  //       let rand = util.random();
  //       if (rand < 0.8) {
  //         this.grid[i][j] = new Tile('W', true);
  //         this.randomPokemon(i, j, 'water') // can also not add a pokemon
  //       } else {
  //         this.grid[i][j] = new Tile('WR', false);
  //       }
  //     }
  //   }
  // }

  /// END REWRITE
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
