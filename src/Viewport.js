export default class Viewport {
  constructor() {
    this.width = 15;
    this.height = 11;
    this.cells = new Array(this.width);
    for (let i = 0; i < this.width; i++) {
      this.cells[i] = new Array(this.height);
    }
  }
}
