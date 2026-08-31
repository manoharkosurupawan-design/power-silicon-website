const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
console.log(`Found ${files.length} HTML files to validate.`);

let errors = 0;
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const linkRegex = /href=["']([^"']+)["']/g;
  const scriptRegex = /src=["']([^"']+)["']/g;
  
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const link = match[1];
    if (link.startsWith('#') || link.startsWith('http') || link.startsWith('mailto:') || link.startsWith('tel:') || link.startsWith('javascript:')) continue;
    const target = link.split('#')[0];
    if (target && !fs.existsSync(target)) {
      console.error(`[BROKEN LINK] in ${file} -> ${target}`);
      errors++;
    }
  }

  while ((match = scriptRegex.exec(content)) !== null) {
    const src = match[1];
    if (src.startsWith('http') || src.startsWith('data:')) continue;
    if (!fs.existsSync(src)) {
      console.error(`[BROKEN SCRIPT/IMAGE] in ${file} -> ${src}`);
      errors++;
    }
  }
});

if (errors === 0) {
  console.log(`SUCCESS: All ${files.length} HTML files have 100% verified internal links, stylesheets, scripts, and image assets!`);
} else {
  console.error(`FAILURE: Found ${errors} asset/link issues.`);
  process.exit(1);
}
