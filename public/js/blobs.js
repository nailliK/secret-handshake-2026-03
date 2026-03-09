const fps = 12;

function render() {
  console.log('rendering...');
}

function tick() {
  render();

  setTimeout(() => {
    requestAnimationFrame(tick);
  }, 1000 / fps);
}
