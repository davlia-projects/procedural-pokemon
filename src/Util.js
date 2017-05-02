export default class Util {
  constructor() {
    this.randSeed = 0;
    window.util = this;
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
    let sqrtrx = Math.sqrt(this.random());
    let sqrtry = Math.sqrt(this.random());
    let theta = this.random() * 2 * Math.PI;
    let px = sqrtrx * Math.cos(theta) * rx;
    let py = sqrtry * Math.sin(theta) * ry;
    return {px, py};
  }

  /*
  Randomly selects an object from a list given weights. Weights do not have to sum to 1.
  Follows this parameter format:
  [
    {w: 3, o: choice1},
    {w: 10, o: choice2},
    ...
  ]
  Return: `o`
  */
  randChoice(l) {
    let sumWeights = 0;
    l.forEach(item => {
      item.w += sumWeights;
      sumWeights = item.w;
    });
    let rand = this.random() * sumWeights;
    for (let i = 0; i < l.length; i++) {
      if (rand < l[i].w) {
        return l[i].o;
      }
    }
  }

  /*
  Iterates integers starting from `start` and finishes at `end` inclusively
  and applies callback function `f`. The callback follows this signature:
  f(i) {
    ...
  }

  Return: undefined
  */

  iterate(start, end, f) {
    let d = end - start;
    let sd = Math.sign(d);
    for (let i = 0; i <= Math.abs(d); i++) {
      f(start + i * sd);
    }
  }
}

export let util = new Util();
