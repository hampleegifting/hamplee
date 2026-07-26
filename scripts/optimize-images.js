#!/usr/bin/env node
/**
 * scripts/optimize-images.js
 *
 * Generates three compressed JPEG versions of every hamper image:
 *   {name}-600.jpg    — mobile card thumbnails      (600px longest edge, q88)
 *   {name}-1200.jpg   — desktop card / panel view   (1200px longest edge, q90)
 *   {name}-1800.jpg   — retina panel / lightbox     (1800px longest edge, q92)
 *
 * Uses macOS built-in `sips` — no npm packages required.
 * Originals are never modified.
 *
 * Usage:
 *   node scripts/optimize-images.js
 *   node scripts/optimize-images.js --force   # regenerate existing files
 */

const { execSync } = require('child_process');
const fs   = require('fs');
const path = require('path');

const ROOT  = path.join(__dirname, '..');
const ASSET = path.join(ROOT, 'asset');
const FORCE = process.argv.includes('--force');
const SIZES = [
  { suffix: '-600',  maxDim: 600,  quality: 88 },
  { suffix: '-1200', maxDim: 1200, quality: 90 },
  { suffix: '-1800', maxDim: 1800, quality: 92 },
];
const EXTS = new Set(['.png', '.jpg', '.jpeg']);

let processed = 0, skipped = 0, errors = 0, savedBytes = 0;

// Matches generated output files like name-600.jpg, name-1200.jpg, name-1800.jpg
// (and any chained variants). Never process these as source images.
const GENERATED = /-(600|1200|1800)(\.\w+)?(\.\w+)*\.(jpg|jpeg)$/i;

function findImages(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findImages(full, results);
    } else if (
      EXTS.has(path.extname(entry.name).toLowerCase()) &&
      !GENERATED.test(entry.name)
    ) {
      results.push(full);
    }
  }
  return results;
}

function optimise(src) {
  const ext     = path.extname(src);
  const base    = src.slice(0, -ext.length);
  const srcSize = fs.statSync(src).size;

  for (const { suffix, maxDim, quality } of SIZES) {
    const dest = base + suffix + '.jpg';
    if (!FORCE && fs.existsSync(dest)) { skipped++; continue; }

    try {
      // -Z = max dimension (longest edge, never upscales)
      // -s formatOptions = JPEG quality 0-100
      execSync(
        `sips -s format jpeg -s formatOptions ${quality} -Z ${maxDim} "${src}" --out "${dest}"`,
        { stdio: 'pipe' }
      );

      const destSize = fs.statSync(dest).size;
      const saving   = ((1 - destSize / srcSize) * 100).toFixed(0);
      savedBytes    += (srcSize - destSize);
      console.log(`  ✓  ${path.relative(ROOT, dest).padEnd(60)} ${String(saving).padStart(3)}% smaller`);
      processed++;
    } catch (err) {
      console.error(`  ✗  ${path.relative(ROOT, src)}: ${err.stderr?.toString().trim() || err.message}`);
      errors++;
    }
  }
}

function fmtMB(bytes) {
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}

console.log('Scanning asset/ for source images…');
const images = findImages(ASSET);
console.log(`Found ${images.length} images. Generating 3 sizes each…\n`);

for (const img of images) {
  optimise(img);
}

console.log('\nDone.');
console.log(`  Generated : ${processed}`);
console.log(`  Skipped   : ${skipped} (already exist — pass --force to regenerate)`);
console.log(`  Errors    : ${errors}`);
if (savedBytes > 0) {
  console.log(`  Saved     : ~${fmtMB(savedBytes)} across generated files`);
}
