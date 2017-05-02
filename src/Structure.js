export default class Structure {
  constructor(spriteID, px, py, sx, sy) {
    this.spriteID = spriteID;
    this.px = px;
    this.py = py;
    this.rx = rx;
    this.ry = ry;
  }

  init() {
    for (let i = 0; i < this.sx; i++) {
      for (let j = 0; j < this.sy; j++) {
        let x = Math.floor(this.x + this.px + i - 2);
        let y = Math.floor(this.y + this.py + j - 2);
        grid[x][y] = new Tile(this.spriteID, false, i, j);
      }
    }
  }
}
