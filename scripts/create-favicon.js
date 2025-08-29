const fs = require('fs');
const path = require('path');

// Create a simple star favicon in base64
const canvas = require('canvas');
const { createCanvas } = canvas;

const size = 32;
const canvasEl = createCanvas(size, size);
const ctx = canvasEl.getContext('2d');

// Black background
ctx.fillStyle = '#050505';
ctx.fillRect(0, 0, size, size);

// Draw pink star
ctx.fillStyle = '#ff3366';
ctx.beginPath();
const cx = size / 2;
const cy = size / 2;
const outerRadius = size * 0.4;
const innerRadius = size * 0.2;

for (let i = 0; i < 10; i++) {
  const angle = (i * Math.PI) / 5 - Math.PI / 2;
  const radius = i % 2 === 0 ? outerRadius : innerRadius;
  const x = cx + Math.cos(angle) * radius;
  const y = cy + Math.sin(angle) * radius;
  
  if (i === 0) {
    ctx.moveTo(x, y);
  } else {
    ctx.lineTo(x, y);
  }
}
ctx.closePath();
ctx.fill();

// Save as PNG
const buffer = canvasEl.toBuffer('image/png');
fs.writeFileSync(path.join(__dirname, '../public/favicon.png'), buffer);

console.log('Static favicon created!');