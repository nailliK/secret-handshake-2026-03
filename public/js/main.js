import Blobs from './blobs.js';

class Main {
  constructor() {
    this.initListeners();
  }

  initListeners() {
    window.onload = function () {
      document.body.classList.add('loaded');
      new Blobs(12);
    };
  }
}

const main = new Main();

export default main;
