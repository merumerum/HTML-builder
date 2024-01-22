const fs = require('fs').promises;
const path = require('path');
const pathToFolder = path.join(__dirname, 'files');
const pathToCopyFolder = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    await fs.rm(pathToCopyFolder, { force: true, recursive: true });
    await fs.mkdir(pathToCopyFolder, { recursive: true });

    const files = await fs.readdir(pathToFolder, { withFileTypes: true });

    files.forEach((file) => {
      const pathToFile = path.join(pathToFolder, file.name);
      const pathToCopyFile = path.join(pathToCopyFolder, file.name);
      fs.copyFile(pathToFile, pathToCopyFile);
    });
  } catch (error) {
    console.error(error.message);
  }
}

copyDir();
