export default class Tile {
  constructor(sym, t, offx, offy) {
  	this.symbol = sym;
  	this.pokemon = undefined;
  	this.traversable = t;
    this.offx = offx;
    this.offy = offy;
  }
}
