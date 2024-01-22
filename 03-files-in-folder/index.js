const fs = require('fs');
const path = require('path');
const pathToFile = path.join(__dirname, 'secret-folder');

fs.readdir(pathToFile, { withFileTypes: true }, (error, dirListArr) => {
  if (!error) {
    dirListArr.forEach((file) => {
      const filePath = path.join(pathToFile, file.name);
      fs.stat(filePath, (statError, stats) => {
        if (!statError && file.isFile()) {
          const fileSize = (stats.size / 1024).toFixed(3);
          const fileName = path.parse(filePath).name;
          const fileExt = path.extname(file.name).slice(1);

          console.log(`${fileName} - ${fileExt} - ${fileSize}kb`);
        } else if (statError) {
          console.error(statError);
        }
      });
    });
  } else {
    console.error(error);
  }
});
