/**
 * One-off export: reads products.html embedded `const products = [...]` and writes catalog/products.json
 * Run: node scripts/export-products-html-to-json.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const htmlPath = path.join(root, 'products.html');
const outPath = path.join(root, 'catalog', 'products.json');

const html = fs.readFileSync(htmlPath, 'utf8');
const startMarker = 'const products = [';
const start = html.indexOf(startMarker);
if (start === -1) throw new Error('Could not find const products = [');
const end = html.indexOf('\n        ];', start);
if (end === -1) throw new Error('Could not find closing ];');
const arraySrc = html.slice(start + startMarker.length, end).trim();

// Slice is the *body* of the array (after opening '[')
// eslint-disable-next-line no-new-func
const products = new Function(`return [${arraySrc}]`)();

function toCatalogRecord(p) {
  let primary = null;
  let gallery = [];
  if (Array.isArray(p.images) && p.images.length) {
    primary = p.images[0];
    gallery = p.images.slice(1);
  } else if (p.image != null) {
    const imgs = Array.isArray(p.image) ? p.image : [p.image];
    primary = imgs[0] || null;
    gallery = imgs.slice(1);
  }

  const shortDesc =
    p.shortDesc ||
    (p.description && p.description.length > 140
      ? `${p.description.slice(0, 137)}…`
      : p.description || '');

  return {
    slug: p.slug || `sku-${p.id}`,
    legacyNumericId: p.id,
    name: p.name,
    category: p.category,
    badge: p.badge || null,
    image: primary,
    gallery,
    priceAmount: typeof p.price === 'number' ? p.price : null,
    priceLabel: p.priceLabel || null,
    shortDesc,
    description: p.description || '',
    tags: Array.isArray(p.tags) ? p.tags : [],
    filters: p.filters || {},
  };
}

const catalog = products.map(toCatalogRecord);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(catalog, null, 2), 'utf8');
console.log('Wrote', catalog.length, 'records to', path.relative(root, outPath));
