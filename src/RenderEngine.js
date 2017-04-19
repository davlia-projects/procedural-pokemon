export default class RenderEngine {
  constructor(ctx, sprites) {
  	// canvas is 960 x 640
  	this.context = ctx;
  	this.sprites = sprites;

  }

  renderGrid(grid) {
  	for (var i = 0; i < grid.size; i++) {
  		for (var j = 0; j < grid.size; j++) {
  			var temp = grid.grid[i];
  			var t = grid.grid[i][j];
  			if (t.symbol === '$') {
  				console.log(this.sprites.image);
  				this.context.drawImage(this.sprites.image, 260, 52, 27, 29, 480, 320, 27, 29);	
  			}
  		}
  	}
  }
}
