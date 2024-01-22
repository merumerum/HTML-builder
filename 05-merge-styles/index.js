const fs = require('fs');
const path = require('path');

const stylesFolder = path.join(__dirname, 'styles');
const bundleFile = path.join(__dirname, 'project-dist', 'bundle.css');
const writableStream = fs.createWriteStream(bundleFile);

fs.readdir(stylesFolder, { withFileTypes: true }, (error, files) => {
  if (error) {
    console.error(error.message);
    return;
  }
  files.forEach((file) => {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const filePath = path.join(stylesFolder, file.name);
      const readStream = fs.createReadStream(filePath, 'utf-8');
      readStream.pipe(writableStream);
    }
  });
});
