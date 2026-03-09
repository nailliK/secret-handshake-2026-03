import Blobs from "./blobs";

window.onload = function () {
  document.body.classList.add('loaded');
  new Blobs(12);
};
