import Viewport from './Viewport.js'

export default class Player {
  constructor(world) {
    this.pos = {x: 10, y: 10};
    this.world = world;
    this.viewport = new Viewport(world, this.pos);
  }


  move(dir) {
    switch(dir) {
      case 'right':
        if (this.pos.x + 1 < this.world.size) {
          this.pos.x += 1;
        }
        break;
      case 'left':
        if (this.pos.x - 1 >= 0) {
          this.pos.x -= 1;
        }
        break;
      case 'up':
        if (this.pos.y + 1 < this.world.size) {
          this.pos.y += 1;
        }
        break;
      case 'down':
        if (this.pos.y - 1 >= 0) {
          this.pos.y -= 1;
        }
        break;
    }
    this.viewport.updateFocus(this.pos.x, this.pos.y);
  }
}
