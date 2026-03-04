import { MoonPhaseData } from "./moonPhase";

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1350;
const SITE_URL = "https://cosmic-birth-lunar.lovable.app/";

function drawMoon(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, phase: number) {
  // Moon base
  const grad = ctx.createRadialGradient(cx - radius * 0.2, cy - radius * 0.15, 0, cx, cy, radius);
  grad.addColorStop(0, "#f5f0e0");
  grad.addColorStop(0.5, "#e8dfc8");
  grad.addColorStop(1, "#d4c9a8");

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // Craters
  const craters = [
    { x: -0.35, y: -0.45, r: 0.12, o: 0.4 },
    { x: 0.2, y: -0.2, r: 0.18, o: 0.3 },
    { x: -0.15, y: 0.2, r: 0.1, o: 0.35 },
    { x: 0.4, y: -0.5, r: 0.08, o: 0.25 },
    { x: -0.5, y: 0, r: 0.14, o: 0.3 },
    { x: 0.1, y: 0.4, r: 0.11, o: 0.28 },
  ];
  for (const c of craters) {
    const cGrad = ctx.createRadialGradient(
      cx + c.x * radius, cy + c.y * radius, 0,
      cx + c.x * radius, cy + c.y * radius, c.r * radius
    );
    cGrad.addColorStop(0, `rgba(200, 189, 160, ${c.o})`);
    cGrad.addColorStop(1, "transparent");
    ctx.beginPath();
    ctx.arc(cx + c.x * radius, cy + c.y * radius, c.r * radius, 0, Math.PI * 2);
    ctx.fillStyle = cGrad;
    ctx.fill();
  }

  // Shadow
  if (phase < 0.01 || phase > 0.99) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(10, 10, 20, 0.92)";
    ctx.fill();
  } else if (!(phase > 0.49 && phase < 0.51)) {
    const angle = phase * 360;
    const terminatorX = Math.cos(angle * (Math.PI / 180)) * radius;

    ctx.beginPath();
    if (phase < 0.5) {
      const sweep = phase < 0.25;
      // Shadow on left (waxing: right side lit)
      ctx.arc(cx, cy, radius, -Math.PI / 2, Math.PI / 2, true);
      ctx.ellipse(cx, cy, Math.abs(terminatorX), radius, 0, Math.PI / 2, -Math.PI / 2, !sweep);
    } else {
      const adjustedAngle = (phase - 0.5) * 360;
      const waneX = Math.cos(adjustedAngle * (Math.PI / 180)) * radius;
      const sweep = phase < 0.75;
      // Shadow on right (waning: left side lit)
      ctx.arc(cx, cy, radius, -Math.PI / 2, Math.PI / 2, false);
      ctx.ellipse(cx, cy, Math.abs(waneX), radius, 0, Math.PI / 2, -Math.PI / 2, sweep);
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(10, 10, 20, 0.92)";
    ctx.fill();
  }

  ctx.restore();
}

export async function generateShareImage(
  moonData: MoonPhaseData,
  dateStr: string
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext("2d")!;

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  bg.addColorStop(0, "#0a0a14");
  bg.addColorStop(0.5, "#0d0d1a");
  bg.addColorStop(1, "#0a0a14");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Stars
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * CANVAS_WIDTH;
    const y = Math.random() * CANVAS_HEIGHT;
    const r = Math.random() * 1.5 + 0.5;
    const alpha = Math.random() * 0.6 + 0.2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(180, 195, 220, ${alpha})`;
    ctx.fill();
  }

  // Moon glow
  const glowGrad = ctx.createRadialGradient(CANVAS_WIDTH / 2, 420, 80, CANVAS_WIDTH / 2, 420, 280);
  glowGrad.addColorStop(0, "rgba(210, 195, 150, 0.15)");
  glowGrad.addColorStop(1, "transparent");
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Draw moon
  drawMoon(ctx, CANVAS_WIDTH / 2, 420, 160, moonData.phase);

  // Date
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(180, 175, 165, 0.7)";
  ctx.font = "300 28px 'Space Grotesk', sans-serif";
  ctx.fillText(dateStr, CANVAS_WIDTH / 2, 660);

  // Phase name
  ctx.fillStyle = "#e0dcd0";
  ctx.font = "300 56px 'Cormorant Garamond', serif";
  ctx.fillText(`${moonData.emoji} ${moonData.phaseName}`, CANVAS_WIDTH / 2, 740);

  // Illumination bar
  const barWidth = 300;
  const barX = (CANVAS_WIDTH - barWidth) / 2;
  const barY = 790;
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.beginPath();
  ctx.roundRect(barX, barY, barWidth, 8, 4);
  ctx.fill();
  ctx.fillStyle = "hsl(45, 80%, 70%)";
  ctx.beginPath();
  ctx.roundRect(barX, barY, barWidth * (moonData.illumination / 100), 8, 4);
  ctx.fill();

  ctx.fillStyle = "hsl(45, 80%, 70%)";
  ctx.font = "400 22px 'Space Grotesk', sans-serif";
  ctx.fillText(`${moonData.illumination}% illuminated`, CANVAS_WIDTH / 2, 840);

  // Poetic line
  ctx.fillStyle = "rgba(180, 175, 165, 0.6)";
  ctx.font = "italic 300 28px 'Cormorant Garamond', serif";
  wrapText(ctx, `"${moonData.poeticLine}"`, CANVAS_WIDTH / 2, 920, CANVAS_WIDTH - 160, 38);

  // Title at top
  ctx.fillStyle = "rgba(224, 220, 208, 0.4)";
  ctx.font = "300 32px 'Cormorant Garamond', serif";
  ctx.fillText("Your Birth Moon", CANVAS_WIDTH / 2, 120);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/png");
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (const word of words) {
    const testLine = line + word + " ";
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line.trim(), x, currentY);
      line = word + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}
