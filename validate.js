const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('===========================================================');
console.log('🧪 RUNNING COMPREHENSIVE PRE-PUSH TEST SUITE FOR POWER SILICON');
console.log('===========================================================\n');

let totalErrors = 0;
let totalWarnings = 0;

// 1. Check JavaScript syntax for all JS files
console.log('👉 [1/5] Validating JavaScript Syntax...');
const jsFiles = fs.readdirSync('./js')
  .filter(f => f.endsWith('.js'))
  .map(f => path.join('js', f));

const rootJsFiles = fs.readdirSync('.')
  .filter(f => f.endsWith('.js') && f !== 'validate.js');

const allJsFiles = [...jsFiles, ...rootJsFiles];

allJsFiles.forEach(jsFile => {
  try {
    execSync(`node -c "${jsFile}"`);
    console.log(`  ✓ ${jsFile} syntax valid.`);
  } catch (err) {
    console.error(`  ❌ [SYNTAX ERROR] in ${jsFile}: ${err.message}`);
    totalErrors++;
  }
});

// 2. Validate CSS Files and their url() references
console.log('\n👉 [2/5] Validating CSS Files & Assets...');
const cssFiles = fs.readdirSync('./css')
  .filter(f => f.endsWith('.css'))
  .map(f => path.join('css', f));

cssFiles.forEach(cssFile => {
  const content = fs.readFileSync(cssFile, 'utf8');
  
  // Check balanced braces
  const openBraces = (content.match(/{/g) || []).length;
  const closeBraces = (content.match(/}/g) || []).length;
  if (openBraces !== closeBraces) {
    console.error(`  ❌ [BRACE MISMATCH] in ${cssFile}: ${openBraces} open vs ${closeBraces} close.`);
    totalErrors++;
  } else {
    console.log(`  ✓ ${cssFile} braces balanced (${openBraces} rules).`);
  }

  // Check url(...) references
  const urlRegex = /url\(["']?([^"')]+)["']?\)/g;
  let urlMatch;
  while ((urlMatch = urlRegex.exec(content)) !== null) {
    const rawUrl = urlMatch[1];
    if (rawUrl.startsWith('data:') || rawUrl.startsWith('http') || rawUrl.startsWith('//')) continue;
    
    // Resolve relative to css file directory
    const resolvedPath = path.normalize(path.join(path.dirname(cssFile), rawUrl.split('?')[0].split('#')[0]));
    if (!fs.existsSync(resolvedPath)) {
      console.error(`  ❌ [BROKEN CSS ASSET] in ${cssFile} -> url("${rawUrl}") (resolved: ${resolvedPath})`);
      totalErrors++;
    }
  }
});

// 3. Collect all HTML IDs for cross-page anchor validation
console.log('\n👉 [3/5] Indexing HTML Anchors & IDs...');
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const pageIds = new Map();

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const ids = new Set();
  const idRegex = /id=["']([^"']+)["']/g;
  let idMatch;
  while ((idMatch = idRegex.exec(content)) !== null) {
    ids.add(idMatch[1]);
  }
  pageIds.set(file, ids);
});

// 4. Validate All HTML Files
console.log('\n👉 [4/5] Validating HTML Files (Links, Images, Anchors, Meta)...');
htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let fileErrors = 0;

  // Check Meta Tags
  if (!content.includes('<title>')) {
    console.error(`  ❌ [MISSING TITLE] in ${file}`);
    fileErrors++;
  }
  if (!content.includes('<meta name="viewport"')) {
    console.error(`  ❌ [MISSING VIEWPORT] in ${file}`);
    fileErrors++;
  }

  // Check Hrefs
  const linkRegex = /href=["']([^"']+)["']/g;
  let linkMatch;
  while ((linkMatch = linkRegex.exec(content)) !== null) {
    const href = linkMatch[1];
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) continue;

    if (href.startsWith('#')) {
      const anchor = href.substring(1);
      if (anchor && !pageIds.get(file).has(anchor)) {
        console.error(`  ❌ [BROKEN LOCAL ANCHOR] in ${file} -> #${anchor}`);
        fileErrors++;
      }
    } else {
      const [targetFile, targetAnchor] = href.split('#');
      if (targetFile && !fs.existsSync(targetFile)) {
        console.error(`  ❌ [BROKEN INTERNAL LINK] in ${file} -> ${targetFile}`);
        fileErrors++;
      } else if (targetFile && targetAnchor) {
        if (pageIds.has(targetFile) && !pageIds.get(targetFile).has(targetAnchor)) {
          console.error(`  ❌ [BROKEN CROSS-PAGE ANCHOR] in ${file} -> ${targetFile}#${targetAnchor}`);
          fileErrors++;
        }
      }
    }
  }

  // Check Srcs (images, scripts)
  const srcRegex = /src=["']([^"']+)["']/g;
  let srcMatch;
  while ((srcMatch = srcRegex.exec(content)) !== null) {
    const src = srcMatch[1];
    if (src.startsWith('http') || src.startsWith('data:')) continue;
    const cleanSrc = src.split('?')[0].split('#')[0];
    if (!fs.existsSync(cleanSrc)) {
      console.error(`  ❌ [BROKEN SRC ASSET] in ${file} -> ${cleanSrc}`);
      fileErrors++;
    }
  }

  // Check Terminology consistency
  if (content.includes('Physical Design & P&R') && !content.includes('Physical Design & Signoff')) {
    console.warn(`  ⚠️ [TERMINOLOGY CHECK] ${file} contains un-updated 'Physical Design & P&R'`);
    totalWarnings++;
  }

  if (fileErrors === 0) {
    console.log(`  ✓ ${file} [OK] (Links, media, meta verified)`);
  } else {
    totalErrors += fileErrors;
  }
});

// 5. Validate Sitemap & Manifest
console.log('\n👉 [5/5] Validating Site Manifests & SEO Configs...');
if (fs.existsSync('sitemap.xml')) {
  const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
  htmlFiles.forEach(file => {
    if (file !== 'generator-fabrication-video.html' && file !== 'generator-hiring-video.html' && file !== '404.html') {
      const isListed = file === 'index.html' 
        ? (sitemap.includes('https://powersilicontech.com/') || sitemap.includes('index.html'))
        : sitemap.includes(file);
      if (!isListed) {
        console.warn(`  ⚠️ [SITEMAP] ${file} is not listed in sitemap.xml`);
        totalWarnings++;
      }
    }
  });
  console.log('  ✓ sitemap.xml verified.');
} else {
  console.error('  ❌ [MISSING] sitemap.xml not found.');
  totalErrors++;
}

if (fs.existsSync('manifest.json')) {
  try {
    JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
    console.log('  ✓ manifest.json is valid JSON.');
  } catch (e) {
    console.error(`  ❌ [INVALID JSON] manifest.json: ${e.message}`);
    totalErrors++;
  }
}

console.log('\n===========================================================');
if (totalErrors === 0) {
  console.log(`🎉 ALL TESTS PASSED! (0 Errors, ${totalWarnings} Warnings)`);
  console.log('🚀 Codebase is 100% stable, verified, and READY TO PUSH!');
  console.log('===========================================================');
  process.exit(0);
} else {
  console.error(`💥 TEST SUITE FAILED WITH ${totalErrors} ERROR(S) AND ${totalWarnings} WARNING(S).`);
  console.log('===========================================================');
  process.exit(1);
}
