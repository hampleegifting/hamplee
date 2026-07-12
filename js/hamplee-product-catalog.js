/**
 * Loads catalog/products.json and normalizes entries for products.html.
 * Supported shapes (merged): image + gallery | images | image (string|array)
 */
(function (global) {
  var FILTER_KEYS = ['category', 'occasion', 'budget', 'contents', 'sustainability', 'mood', 'recipient', 'packaging'];

  function dedupePaths(list) {
    var seen = {};
    var out = [];
    for (var i = 0; i < list.length; i++) {
      var p = list[i];
      if (!p || seen[p]) continue;
      seen[p] = true;
      out.push(p);
    }
    return out;
  }

  function coalesceImages(entry) {
    if (Array.isArray(entry.images) && entry.images.length) {
      return dedupePaths(entry.images);
    }
    var list = [];
    if (entry.image != null) {
      if (Array.isArray(entry.image)) list = list.concat(entry.image);
      else list.push(entry.image);
    }
    if (Array.isArray(entry.gallery)) {
      list = list.concat(entry.gallery);
    }
    return dedupePaths(list);
  }

  function normalizeFilters(f) {
    var src = f && typeof f === 'object' ? f : {};
    var out = {};
    for (var i = 0; i < FILTER_KEYS.length; i++) {
      var k = FILTER_KEYS[i];
      out[k] = Array.isArray(src[k]) ? src[k] : [];
    }
    return out;
  }

  function parsePriceAmount(entry) {
    if (typeof entry.priceAmount === 'number') return entry.priceAmount;
    if (typeof entry.price === 'number') return entry.price;
    if (typeof entry.price === 'string') {
      var digits = entry.price.replace(/[^\d]/g, '');
      return digits ? parseInt(digits, 10) : 0;
    }
    return 0;
  }

  global.normalizeCatalogEntry = function (entry) {
    var images = coalesceImages(entry);
    var priceNum = parsePriceAmount(entry);
    var slug =
      entry.slug ||
      (entry.id != null && typeof entry.id === 'string' ? entry.id : null) ||
      (entry.legacyNumericId != null ? 'sku-' + entry.legacyNumericId : null);

    var desc = entry.description != null ? String(entry.description) : '';
    var shortDesc =
      entry.shortDesc != null && String(entry.shortDesc).trim() !== ''
        ? String(entry.shortDesc)
        : desc.length > 140
          ? desc.slice(0, 137) + '…'
          : desc;

    var priceLabel = entry.priceLabel != null && String(entry.priceLabel).trim() !== '' ? String(entry.priceLabel) : null;

    return {
      id: slug || String(entry.legacyNumericId != null ? entry.legacyNumericId : ''),
      slug: slug,
      legacyNumericId: entry.legacyNumericId != null ? entry.legacyNumericId : null,
      name: entry.name,
      category: entry.category,
      price: priceNum,
      priceLabel: priceLabel,
      images: images,
      image: images[0],
      description: desc,
      shortDesc: shortDesc,
      tags: Array.isArray(entry.tags) ? entry.tags : [],
      badge: entry.badge || null,
      filters: normalizeFilters(entry.filters),
    };
  };

  global.formatProductPrice = function (product) {
    var amount = product.priceLabel || ('₹' + product.price.toLocaleString('en-IN'));
    return amount + '<span class="price-gst">+ 18% GST</span>';
  };

  global.loadHampleeProductCatalog = async function (url) {
    var res = await fetch(url, { credentials: 'same-origin' });
    if (!res.ok) throw new Error('Catalog HTTP ' + res.status);
    var data = await res.json();
    if (!Array.isArray(data)) throw new Error('Catalog root must be an array');
    return data.map(global.normalizeCatalogEntry);
  };
})(window);
