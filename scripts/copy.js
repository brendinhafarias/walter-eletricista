'use strict';

/**
 * Script de cópia sem dependências externas.
 *   node scripts/copy.js          -> copia HTML + assets para /dist
 *   node scripts/copy.js --watch  -> copia e observa mudanças (usado no "dev")
 *   node scripts/copy.js --clean  -> apaga a pasta /dist
 *
 * O CSS é gerado separadamente pelo Tailwind CLI direto em /dist/css.
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

// Pares de "origem -> destino" que devem existir no build final.
const targets = [
  { from: path.join(root, 'src', 'index.html'), to: path.join(dist, 'index.html') },
  { from: path.join(root, 'src', 'js'), to: path.join(dist, 'js') },
  { from: path.join(root, 'assets'), to: path.join(dist, 'assets') },
  // Arquivos que precisam ficar na RAIZ do site publicado
  { from: path.join(root, 'robots.txt'), to: path.join(dist, 'robots.txt') },
  { from: path.join(root, 'sitemap.xml'), to: path.join(dist, 'sitemap.xml') },
  { from: path.join(root, 'site.webmanifest'), to: path.join(dist, 'site.webmanifest') },
];

function copyRecursive(from, to) {
  if (!fs.existsSync(from)) return;
  const stat = fs.statSync(from);
  if (stat.isDirectory()) {
    fs.mkdirSync(to, { recursive: true });
    for (const entry of fs.readdirSync(from)) {
      copyRecursive(path.join(from, entry), path.join(to, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
  }
}

function copyAll() {
  for (const t of targets) copyRecursive(t.from, t.to);
  console.log(`[copy] assets e HTML copiados para /dist (${new Date().toLocaleTimeString()})`);
}

function clean() {
  fs.rmSync(dist, { recursive: true, force: true });
  console.log('[copy] /dist limpo.');
}

const args = process.argv.slice(2);

if (args.includes('--clean')) {
  clean();
} else {
  copyAll();

  if (args.includes('--watch')) {
    const watchDirs = [path.join(root, 'src'), path.join(root, 'assets')];
    let scheduled = false;
    const debounced = () => {
      if (scheduled) return;
      scheduled = true;
      setTimeout(() => {
        scheduled = false;
        try {
          copyAll();
        } catch (err) {
          console.error('[copy] erro ao copiar:', err.message);
        }
      }, 120);
    };

    for (const dir of watchDirs) {
      if (fs.existsSync(dir)) {
        fs.watch(dir, { recursive: true }, (_event, file) => {
          // Ignora o CSS gerado pelo Tailwind (evita loop de cópia).
          if (file && file.endsWith('styles.css')) return;
          debounced();
        });
      }
    }
    console.log('[copy] observando mudanças em /src e /assets…');
  }
}
