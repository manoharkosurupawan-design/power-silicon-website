const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Creating latest production build for Power Silicon Technologies...');

const distDir = path.join(__dirname, 'dist_upload');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Files to copy
const singleFiles = [
  'index.html', 'about.html', 'faq.html', 'services.html', 'contact.html', 'careers.html',
  'blog.html', 'vlsi-design.html', 'physical-design.html', 'verification-signoff.html',
  'embedded-systems.html', 'industry-solutions.html', 'products-ip.html', 'rnd-innovations.html',
  'privacy-policy.html', '404.html', '.htaccess', 'robots.txt', 'sitemap.xml', 'site.webmanifest',
  'manifest.json', 'favicon.ico', 'favicon.png', 'apple-touch-icon.png', 'favicon-16x16.png',
  'favicon-32x32.png', 'favicon-48x48.png', 'icon-192.png', 'icon-512.png', '_headers'
];

singleFiles.forEach(file => {
  const src = path.join(__dirname, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(distDir, file));
  }
});

// Copy directories
const dirs = ['css', 'js', 'images', 'videos'];
dirs.forEach(dir => {
  const src = path.join(__dirname, dir);
  const dest = path.join(distDir, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true, force: true });
  }
});

console.log('✓ All production files updated in dist_upload/');

// Compress into ZIP
const zipName = 'powersilicontech_latest_build.zip';
const zipPath = path.join(__dirname, zipName);
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

try {
  execSync(`powershell -Command "Compress-Archive -Path '${distDir}\\*' -DestinationPath '${zipPath}' -Force"`, { stdio: 'inherit' });
  console.log(`✓ Created ${zipName}`);
  
  // Copy to deploy & production zips
  fs.copyFileSync(zipPath, path.join(__dirname, 'powersilicontech_deploy.zip'));
  fs.copyFileSync(zipPath, path.join(__dirname, 'powersilicontech_production.zip'));
  console.log('✓ Updated powersilicontech_deploy.zip and powersilicontech_production.zip');
  
  const stats = fs.statSync(zipPath);
  console.log(`\n🎉 Build Complete! File size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
} catch (err) {
  console.error('Error compressing archive:', err.message);
}
