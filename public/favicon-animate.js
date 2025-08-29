// Animated favicon using canvas
(function() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  
  canvas.width = 32;
  canvas.height = 32;
  
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  document.getElementsByTagName('head')[0].appendChild(link);
  
  let frame = 0;
  const starColors = ['#ff3366', '#ff6699', '#ff99cc', '#ffccee'];
  
  function drawStar(cx, cy, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const x = cx + Math.cos(angle) * size;
      const y = cy + Math.sin(angle) * size;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        const innerAngle = ((i - 0.5) * 2 * Math.PI) / 5 - Math.PI / 2;
        const innerX = cx + Math.cos(innerAngle) * (size * 0.5);
        const innerY = cy + Math.sin(innerAngle) * (size * 0.5);
        ctx.lineTo(innerX, innerY);
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
  }
  
  function animate() {
    // Clear canvas
    ctx.clearRect(0, 0, 32, 32);
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, 32, 32);
    
    // Draw animated star
    const size = 8 + Math.sin(frame * 0.1) * 4;
    const color = starColors[Math.floor(frame / 10) % starColors.length];
    drawStar(16, 16, size, color);
    
    // Convert to favicon
    link.href = canvas.toDataURL('image/png');
    
    frame++;
    requestAnimationFrame(animate);
  }
  
  // Start animation
  animate();
})();