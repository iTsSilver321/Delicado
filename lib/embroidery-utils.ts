
export const generateEmbroideryTexture = (
  text: string,
  font: string,
  color: string,
  width: number = 2048,
  height: number = 2048
): { canvas: HTMLCanvasElement; aspectRatio: number } => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return { canvas, aspectRatio: 1 };

  // 1. Create a Realistic "Stitch" Pattern
  const patternSize = 16;
  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = patternSize;
  patternCanvas.height = patternSize;
  const pCtx = patternCanvas.getContext('2d');
  
  if (pCtx) {
    // Base thread color
    pCtx.fillStyle = color;
    pCtx.fillRect(0, 0, patternSize, patternSize);
    
    // Create a zigzag / chaotic stitch texture
    pCtx.lineCap = 'round';
    pCtx.lineJoin = 'round';
    
    // Darker threads for depth
    pCtx.strokeStyle = adjustColorBrightness(color, -25);
    pCtx.lineWidth = 2;
    pCtx.beginPath();
    pCtx.moveTo(0, patternSize);
    pCtx.lineTo(patternSize, 0); // Diagonal 1
    pCtx.moveTo(patternSize * 0.5, patternSize);
    pCtx.lineTo(patternSize * 1.5, 0); // Offset diagonal
    pCtx.stroke();
    
    // Lighter threads for highlight
    pCtx.strokeStyle = adjustColorBrightness(color, 30);
    pCtx.lineWidth = 1;
    pCtx.beginPath();
    pCtx.moveTo(4, patternSize);
    pCtx.lineTo(patternSize + 4, 0); // Highlight offset
    pCtx.stroke();
    
    // Add some noise/roughness
    for(let i=0; i<10; i++) {
        pCtx.fillStyle = Math.random() > 0.5 ? adjustColorBrightness(color, 40) : adjustColorBrightness(color, -40);
        pCtx.fillRect(Math.random() * patternSize, Math.random() * patternSize, 1.5, 1.5);
    }
  }

  // 2. Draw Text with Stitch Pattern
  const pattern = ctx.createPattern(patternCanvas, 'repeat');
  
  // Clear
  ctx.clearRect(0, 0, width, height);
  
  // Text Config
  const fontSize = 350; // Larger font for better resolution
  ctx.font = `bold ${fontSize}px "${font === 'Playfair Display' ? 'Playfair Display' : font === 'Geist' ? 'Geist Sans' : font}"`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Simulating 3D lift/thickness of embroidery
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 6;
  ctx.shadowOffsetY = 6;
  
  // Fill text with stitch pattern
  ctx.fillStyle = pattern || color;
  ctx.fillText(text, width / 2, height / 2);

  // 3. Thick Satin Stitch Border
  // To make it look like patches or thick embroidery
  ctx.shadowColor = 'transparent'; // No shadow for stroke itself to distinguish edge
  ctx.strokeStyle = adjustColorBrightness(color, -10);
  ctx.lineWidth = 8;
  ctx.lineJoin = 'round';
  ctx.strokeText(text, width / 2, height / 2);

  // inner highlight for 3D fullness
  ctx.strokeStyle = adjustColorBrightness(color, 20);
  ctx.lineWidth = 3;
  ctx.strokeText(text, width / 2, height / 2);

  // Calculate Aspect Ratio from actual text width
  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  // We add some padding to width
  const actualRatio = Math.max(0.5, (textWidth + 100) / fontSize); 

  return { canvas, aspectRatio: actualRatio };
};

// Helper: Adjust color brightness (hex input)
function adjustColorBrightness(hex: string, percent: number) {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    r = Math.round(Math.min(255, Math.max(0, r + (r * (percent / 100)))));
    g = Math.round(Math.min(255, Math.max(0, g + (g * (percent / 100)))));
    b = Math.round(Math.min(255, Math.max(0, b + (b * (percent / 100)))));

    const rr = (r.toString(16).length === 1) ? "0" + r.toString(16) : r.toString(16);
    const gg = (g.toString(16).length === 1) ? "0" + g.toString(16) : g.toString(16);
    const bb = (b.toString(16).length === 1) ? "0" + b.toString(16) : b.toString(16);

    return "#" + rr + gg + bb;
}
