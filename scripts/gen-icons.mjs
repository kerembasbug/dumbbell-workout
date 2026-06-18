// Markalı dumbbell ikonlarını SVG'den PNG'ye üretir (sharp).
// Çalıştır: node scripts/gen-icons.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'assets', 'images');

const ACCENT = '#F4511E';
const ACCENT_LIGHT = '#FF6A3D';
const WHITE = '#FFFFFF';

// Yatay dumbbell — 1024x1024 tuval, merkez (512,512). `scale` ile büyütülür.
function dumbbell(scale, fill) {
  return `
    <g transform="translate(512 512) scale(${scale}) translate(-512 -512)" fill="${fill}">
      <rect x="372" y="482" width="280" height="60" rx="30"/>
      <rect x="330" y="432" width="60" height="160" rx="22"/>
      <rect x="634" y="432" width="60" height="160" rx="22"/>
      <rect x="270" y="398" width="66" height="228" rx="26"/>
      <rect x="688" y="398" width="66" height="228" rx="26"/>
      <rect x="246" y="438" width="34" height="148" rx="16"/>
      <rect x="744" y="438" width="34" height="148" rx="16"/>
    </g>`;
}

function fullIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${ACCENT_LIGHT}"/>
        <stop offset="1" stop-color="${ACCENT}"/>
      </linearGradient>
    </defs>
    <rect width="1024" height="1024" fill="url(#bg)"/>
    ${dumbbell(1.25, WHITE)}
  </svg>`;
}

// Adaptive foreground: şeffaf zemin, güvenli alana (≈66%) sığacak şekilde büyük dumbbell.
function foreground() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
    ${dumbbell(1.4, WHITE)}
  </svg>`;
}

// Splash / monochrome: şeffaf zemin, beyaz dumbbell (arka plan rengi config'te).
function glyphTransparent(fill) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
    ${dumbbell(1.2, fill)}
  </svg>`;
}

const toBuf = (svg) => Buffer.from(svg);

async function main() {
  await sharp(toBuf(fullIcon())).png().toFile(join(OUT, 'icon.png'));
  await sharp(toBuf(foreground())).png().toFile(join(OUT, 'android-icon-foreground.png'));
  await sharp(toBuf(glyphTransparent(WHITE))).png().toFile(join(OUT, 'android-icon-monochrome.png'));
  await sharp(toBuf(glyphTransparent(WHITE))).png().toFile(join(OUT, 'splash-icon.png'));
  await sharp(toBuf(fullIcon())).resize(196, 196).png().toFile(join(OUT, 'favicon.png'));
  console.log('İkonlar üretildi:', OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
