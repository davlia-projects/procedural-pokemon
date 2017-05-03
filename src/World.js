import Tile from './Tile.js'
import Agent from './Agent.js'
import Area from './Area.js'
import { util } from './Util.js'
import Route from './Route.js'

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
    this.defineAreas();
    this.defineAreaContent();
    this.defineNPContent();
    this.fillAreas();
    //this.defineCities();
}

  defineNPAreas() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.grid[i][j] = new Tile('0', false);
      }
    }
  }

  generateArea(x, y) {
    let padding = 30;
    let sx = Math.floor(util.random() * this.size / 16 + this.size / 16);
    let sy = Math.floor(util.random() * this.size / 16 + this.size / 16);
    while (x + sx/2 > this.size - padding || x - sx/2 < padding) {
      sx = Math.floor(util.random() * this.size);
    }
    while (y + sy/2 > this.size - padding || y - sy/2 < padding) {
      sy = Math.floor(util.random() * this.size);
    }
    let area = new Area(x, y, sx, sy, 3, true, true);
    this.areas.push(area);
    return area;
  }

  defineAreas() {
    // init area
    let numAreas = 7;
    let areaCnt = 1;
    let stack = [];
    let area = this.generateArea(256, 256);

    let route;
    let prev;
    stack.push(area);
    while (stack.length !== 0) {
      area = stack.shift();
      let num = util.random();
      // let num = 0;
      if (num < 0.5) {
        // one path
        let len = Math.floor(util.random() * 100 + Math.max(area.sx, area.sy));
        let dir = Math.floor(util.random() * 4);
        while (area.prev === dir) {
          dir = Math.floor(util.random() * 4);
        }
        switch(dir) {
          case 0:
            route = this.generateRoute(area, len, 'north');
            route.a2.prev = 0;
            break;
          case 1:
            route = this.generateRoute(area, len, 'south');
            route.a2.prev = 1;
            break;
          case 2:
            route = this.generateRoute(area, len, 'east');
            route.a2.prev = 2;
            break;
          case 3:
            route = this.generateRoute(area, len, 'west');
            route.a2.prev = 3;
            break;
        }
        areaCnt += 1;
        if (areaCnt < numAreas) {
          stack.push(route.a2);
        }
        else {
          break;
        }
      }
      else {
        // two paths
        // one path
        let route1, route2;
        let len = Math.floor(util.random() * 64 + Math.max(area.sx, area.sy));
        let dir = Math.floor(util.random() * 2);
        if (area.prev === 2 || area.prev === 3) {
          route1 = this.generateRoute(area, len, 'north');
          route2 = this.generateRoute(area, len, 'south');
          route1.a2.prev = 0;
          route2.a2.prev = 1;
        }
        else {
          route1 = this.generateRoute(area, len, 'east');
          route2 = this.generateRoute(area, len, 'west');
          route1.a2.prev = 2;
          route2.a2.prev = 3;
        }
        areaCnt += 2;
        if (areaCnt < numAreas) {
          stack.push(route1.a2);
          stack.push(route2.a2);
        }
        else {
          break;
        }
      }
    }
  }

  generateRoute(area, len, dir) {
    let {x, y} = area;
    let newX, newY, newArea, route;
    switch(dir) {
      case 'north':
        while (area.y - len < 0) {
          len = Math.floor(util.random() * len);
        }
        newX = x;
        newY = y - len;
        area.outlets.push({x: x, y: y - area.sy});
        newArea = this.generateArea(newX, newY);
        newArea.outlets.push({x: newX, y: newY + newArea.sy});
        route = new Route(area, newArea);
        this.drawRoute(route, 'y');
        break;
      case 'south':
        while (area.y + len > this.size) {
          len = Math.floor(util.random() * len);
        }
        newX = x;
        newY = y + len;
        area.outlets.push({x: x, y: y + area.sy});
        newArea = this.generateArea(newX, newY);
        newArea.outlets.push({x: newX, y: newY - newArea.sy});
        route = new Route(area, newArea);
        this.drawRoute(route, 'y');
        break;
      case 'east':
        while (area.x + len > this.size) {
          len = Math.floor(util.random() * len);
        }
        newX = x + len;
        newY = y;
        area.outlets.push({x: x + area.sx, y: y});
        newArea = this.generateArea(newX, newY);
        newArea.outlets.push({x: newX - area.sx, y: newY});
        route = new Route(area, newArea);
        this.drawRoute(route, 'x');
        break;
      case 'west':
        while (area.y - len < 0) {
          len = Math.floor(util.random() * len);
        }
        newX = x - len;
        newY = y;
        area.outlets.push({x: x - area.sx, y: y});
        newArea = this.generateArea(newX, newY);
        newArea.outlets.push({x: newX + area.sx, y: newY});
        route = new Route(area, newArea);
        this.drawRoute(route, 'x');
        break;
    }
    return route;
  }

  // connect a1 to a2
  drawRoute(route, dir) {
    let {a1, a2} = route;
    let pathRadius = 8;
    let del;
    let a1x = a1.x;
    let a1y = a1.y;
    if (dir === 'x') {
      del = a2.x - a1.x;
      for (let i = 0; i < Math.abs(del); i++) {
        a1x += Math.sign(del);
        for (let j = -pathRadius; j < pathRadius; j++) {
          if (0 <= a1y + j && a1y + j < this.size) {
            this.grid[a1x][a1y + j] = new Tile(a1.biome, true);
          }
        }
      }
    }
    else {
      del = a2.y - a1.y;
      for (let i = 0; i < Math.abs(del); i++) {
        a1y += Math.sign(del);
        for (let j = -pathRadius; j < pathRadius; j++) {
          if (0 <= a1x + j && a1x + j < this.size) {
            this.grid[a1x + j][a1y] = new Tile(a1.biome, true);
          }
        }
      }
    }
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
        if (npTile.traversable === false && i + 1 < this.size && i - 1 >= 0) {
          // check if this is a up, down, left, right
          let uTile = this.grid[i][j-1];
          if (uTile !== undefined && (uTile.spriteID === 'grass' || uTile.spriteID === 'sand')) {
            this.grid[i][j] = new Tile('mtn-d', false, 0, -1);
            for (let k = 1; k < 5; k++) {
              this.grid[i][j+k] = new Tile('mtn-d', false, 0, 0);
            }
            continue;
          }
          else if (uTile !== undefined && (uTile.spriteID === 'water')) {
            // let rand = util.random();
            this.grid[i][j] = new Tile('wtr-1', false);
            for (let k = 1; k < 5; k++) {
              this.grid[i][j+k] = new Tile('dwater', false);
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
          else if (dTile !== undefined && (dTile.spriteID === 'water')) {
            this.grid[i][j] = new Tile('wtr-1', false);
            for (let k = 1; k < 5; k++) {
              this.grid[i][j-k] = new Tile('dwater', false);
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
          else if (lTile !== undefined && (lTile.spriteID === 'water')) {
            this.grid[i][j] = new Tile('wtr-1', false);
            for (let k = 1; k < 7; k++) {
              this.grid[i+k][j] = new Tile('dwater', false);
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
          else if (rTile !== undefined && (rTile.spriteID === 'water')) {
            this.grid[i][j] = new Tile('wtr-1', false);
            for (let k = 1; k < 7; k++) {
              this.grid[i-k][j] = new Tile('dwater', false);
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
