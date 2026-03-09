export default class Blobs {
  fps = 12;

  constructor(fps) {
    this.fps = fps;
    // this.tick();
  }

  render() {
    console.log('rendering...');
  }

  tick() {
    this.render();

    setTimeout(() => {
      requestAnimationFrame(this.tick);
    }, 1000 / this.fps);
  }
}
