export default class RenderEngine {
  constructor(ctx, sprites) {
    // canvas is 960 x 640
    this.context = ctx;
    this.sprites = sprites;

  }

  renderGrid(grid) {
    for (let i = 0; i < grid.size; i++) {
      for (let j = 0; j < grid.size; j++) {
        let t = grid.grid[i][j];
        if (t.symbol === '$') {
          this.context.drawImage(this.sprites.image, 260, 52, 27, 29, 480, 320, 27, 29);  
        }
      }
    }
  }
}
