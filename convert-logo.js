const sharp = require('sharp');
const path = require('path');

const inputPath = 'C:\\Users\\kosur\\.gemini\\antigravity-ide\\brain\\c3b7feb4-932b-4b10-b8db-7a7a00a76dd3\\logo_transparent_1788278007281.jpg';
const outputPath = path.join(__dirname, 'images', 'logo.png');

sharp(inputPath)
  .png({ quality: 100, compressionLevel: 6 })
  .toFile(outputPath, (err, info) => {
    if (err) {
      console.error('Error converting logo:', err);
      process.exit(1);
    }
    console.log('Logo converted and saved to images/logo.png');
    console.log('Size:', info.width + 'x' + info.height, '| Format:', info.format);
  });
