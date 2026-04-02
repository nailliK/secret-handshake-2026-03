import Blobs from './blobs.js';

class Main {
  constructor() {
    this.initListeners();
  }

  initListeners() {
    window.onload = function () {
      document.body.classList.add('loaded');

      document.querySelectorAll('details').forEach((d) => {
        d.addEventListener('click', (e) => {
          setTimeout(()=>{
            const element = document.querySelector('details:open');
            if(element) {
              const y = element.getBoundingClientRect().top + window.scrollY;
              window.scroll({
                top: y - 16 * 5,
                behavior: 'smooth'
              });
            }
          }, 125);
        })
      })
      new Blobs(256, 1, 0.025);
    };
  }
}

const main = new Main();

export default main;
