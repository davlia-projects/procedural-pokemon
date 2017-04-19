export default class Viewport {
  constructor(grid) {
    this.width = 15;
    this.height = 11;
    this.cells = new Array(this.width);
    for (let i = 0; i < this.width; i++) {
      this.cells[i] = new Array(this.height);
    }
    this.focus = {x: 0, y: 0};
    this.grid = grid;
  }

  updateFocus(x, y) {
    this.focus.x = x;
    this.focus.y = y;
    this._sampleTiles();
  }

  _sampleTiles() {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        let x = this.focus.x - Math.floor(this.width / 2);
        let y = this.focus.y - Math.floor(this.height / 2);
        this.cells[i][j] = this.grid.getTile(x, y);
      }
    }
  }


}
