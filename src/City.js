// position 
// biome 
// radius
// number of houses
// pokemart - boolean
// pokecenter - boolean

export default class City {
	constructor(x, y, rx, ry, biome, house_cnt, pokemart, pokecenter) {
		this.x = x;
		this.y = y;
		this.rx = rx;
		this.ry = ry;
		this.biome = biome;
		this.house_count = house_cnt;
		this.pokemart = pokemart;
		this.pokecenter = pokecenter;
	}
}