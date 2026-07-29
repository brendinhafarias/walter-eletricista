'use strict';

/**
 * Gera versões WebP otimizadas das imagens de conteúdo (fotos).
 *   node scripts/images.js
 *
 * Converte os .jpg/.jpeg/.png listados em SOURCES para .webp ao lado do original.
 * Ícones/logo/og-image ficam de fora (SVG e PNG/JPG já servem como estão).
 * Rode este script sempre que trocar uma foto por uma definitiva.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.resolve(__dirname, '..', 'assets', 'images');

// Só as fotos de conteúdo que usam <picture> com fallback.
// Ao adicionar uma foto nova na galeria (ex.: servico-7.jpg), inclua o nome aqui também.
const SOURCES = [
  'servico-1.jpg',
  'servico-2.jpg',
  'servico-3.jpg',
  'servico-4.jpg',
  'servico-5.jpg',
  'servico-6.jpg',
  'servico-7.jpg',
  'servico-8.jpg',
  'servico-9.jpg',
  'servico-10.jpg',
  'servico-11.jpg',
  'servico-12.jpg',
  'servico-13.jpg',
  'cliente-1.jpg',
];

(async () => {
  for (const file of SOURCES) {
    const from = path.join(imagesDir, file);
    if (!fs.existsSync(from)) {
      console.warn(`[images] pulando (não encontrado): ${file}`);
      continue;
    }
    const to = path.join(imagesDir, file.replace(/\.(jpe?g|png)$/i, '.webp'));
    await sharp(from).webp({ quality: 78 }).toFile(to);
    const kb = (fs.statSync(to).size / 1024).toFixed(1);
    console.log(`[images] ${file} -> ${path.basename(to)} (${kb} KB)`);
  }
  console.log('[images] concluído.');
})().catch((err) => {
  console.error('[images] erro:', err.message);
  process.exit(1);
});
