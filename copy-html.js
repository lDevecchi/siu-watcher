const fs = require('fs');
const path = require('path');

// Ruta del HTML original
const srcHtml = path.join(__dirname, 'src/renderer/index.html');

// Carpeta destino
const distHtmlDir = path.join(__dirname, 'dist/renderer');

// Crear carpeta destino si no existe
if (!fs.existsSync(distHtmlDir)) {
  fs.mkdirSync(distHtmlDir, { recursive: true });
}

// Copiar el HTML
fs.copyFileSync(srcHtml, path.join(distHtmlDir, 'index.html'));
console.log('index.html copiado a dist/renderer');
