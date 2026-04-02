export class Blob {
  constructor(radius, x, y, repulsion, opacity) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.repulsion = repulsion;
    this.opacity = opacity;
    this.el = null;
  }
}

export default class Blobs {
  fps = 30;
  friction = 0.92;
  mouseRepulsion = 3000;
  blobRepulsion = 200;
  edgeRepulsion = 500;
  edgeBuffer = 50;
  mouseX = -9999;
  mouseY = -9999;

  constructor(squareUnit, blobsPerSquareUnit, blobsPerSquareUnitDeviation = 0.25) {
    this.squareUnit = squareUnit;
    this.blobsPerSquareUnit = blobsPerSquareUnit + (Math.random() < 0.5 ? -1 : 1) * Math.random() * blobsPerSquareUnitDeviation;
    this.svg = document.getElementById('blobs');
    this.blobs = [];

    this.createBlobs();
    this.bindMouse();
    this.tick();
  }

  createBlobs() {
    const w = window.innerWidth;
    const h = document.documentElement.scrollHeight;
    const count = Math.round((w / this.squareUnit) * (h / this.squareUnit) * this.blobsPerSquareUnit);

    for (let i = 0; i < count; i++) {
      const radius = Math.random() * this.squareUnit * 0.6;
      const blob = new Blob(
        radius,
        Math.random() * w,
        Math.random() * h,
        0.5 + Math.random() * 0.5,
        Math.random(),
      );

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', blob.x);
      circle.setAttribute('cy', blob.y);
      circle.setAttribute('r', blob.radius);
      circle.style.opacity = blob.opacity;
      circle.style.filter = `blur(${Math.random() * 32}px)`;
      blob.el = circle;
      this.svg.appendChild(circle);
      this.blobs.push(blob);
    }
  }

  bindMouse() {
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY + window.scrollY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouseX = -9999;
      this.mouseY = -9999;
    });
  }

  update() {
    const blobs = this.blobs;
    const w = window.innerWidth;
    const h = document.documentElement.scrollHeight;

    for (let i = 0; i < blobs.length; i++) {
      const a = blobs[i];
      let fx = 0;
      let fy = 0;

      // blob-to-blob repulsion
      for (let j = 0; j < blobs.length; j++) {
        if (i === j) continue;
        const b = blobs[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const minDist = a.radius + b.radius;

        if (dist < minDist * 2) {
          const force = (a.repulsion + b.repulsion) * this.blobRepulsion / dist;
          fx += (dx / dist) * force;
          fy += (dy / dist) * force;
        }
      }

      // mouse repulsion
      const mdx = a.x - this.mouseX;
      const mdy = a.y - this.mouseY;
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy) || 1;
      const mouseRadius = 128;

      if (mDist < mouseRadius + a.radius) {
        const force = this.mouseRepulsion / (mDist * mDist);
        fx += (mdx / mDist) * force;
        fy += (mdy / mDist) * force;
      }

      // edge repulsion
      if (a.x < this.edgeBuffer + a.radius) {
        fx += this.edgeRepulsion / Math.max(a.x, 1);
      }
      if (a.x > w - this.edgeBuffer - a.radius) {
        fx -= this.edgeRepulsion / Math.max(w - a.x, 1);
      }
      if (a.y < this.edgeBuffer + a.radius) {
        fy += this.edgeRepulsion / Math.max(a.y, 8);
      }
      if (a.y > h - this.edgeBuffer - a.radius) {
        fy -= this.edgeRepulsion / Math.max(h - a.y, 8);
      }

      a.vx += fx;
      a.vy += fy;
      a.vx *= this.friction;
      a.vy *= this.friction;
      a.x += a.vx;
      a.y += a.vy;

      a.x = Math.max(a.radius, Math.min(w - a.radius, a.x));
    }
  }

  render() {
    for (const blob of this.blobs) {
      blob.el.setAttribute('cx', blob.x);
      blob.el.setAttribute('cy', blob.y);
    }
  }

  tick() {
    this.update();
    this.render();

    setTimeout(() => {
      requestAnimationFrame(() => this.tick());
    }, 1000 / this.fps);
  }
}
