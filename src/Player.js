export default class Player {
  constructor(viewport) {
    this.pos = {x: 0, y: 0};
    this.viewport = viewport;
  }


  move(dir) {
    switch(dir) {
      case 'right':
        this.pos.x += 1;
        this.viewport.updateFocus(this.pos.x, this.pos.y);
        break;
      case 'left':
        this.pos.x -= 1;
        this.viewport.updateFocus(this.pos.x, this.pos.y);
        break;
      case 'up':
        this.pos.y += 1;
        this.viewport.updateFocus(this.pos.x, this.pos.y);
        break;
      case 'down':
        this.pos.y -= 1;
        this.viewport.updateFocus(this.pos.x, this.pos.y);
        break;
    }
  }
}
