function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')       // Replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, '');           // Remove leading/trailing hyphens
}

module.exports = slugify;