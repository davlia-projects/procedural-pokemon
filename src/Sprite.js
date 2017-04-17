export default class Sprite {
  constructor(src, onload) {
    this.image = new Image();
    this.image.src = src;
    this.image.onload = onload
  }
}
