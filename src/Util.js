export default class Util {
  constructor() {
    this.randSeed = 0;
  }

  seed(seed) {
    this._seed = seed % 2147483647;
    if (this._seed <= 0) {
      this._seed += 2147483646;
    }
    this.randSeed = seed;
  }

  randInt() {
    return this._seed = this._seed * 16807 % 2147483647 - 1;
  }

  random() {
    return (this.randInt() - 1) / 2147483646;
  }

  randomDisk(rx, ry) {
    let sqrtrx = Math.sqrt(this.random() * rx);
    let sqrtry = Math.sqrt(this.random() * ry);
    let theta = this.random() * 2 * Math.PI;
    let px = sqrtrx * Math.cos(theta);
    let py = sqrtry * Math.cos(theta);
    return {px, py};
  }
}

export let util = new Util();
