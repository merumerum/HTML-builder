const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const projectDistFolder = path.join(__dirname, 'project-dist');
const templateHtml = path.join(__dirname, 'template.html');
const fileHtml = path.join(projectDistFolder, 'index.html');
const compFolder = path.join(__dirname, 'components');

async function createFolder() {
  try {
    await fsPromises.mkdir(projectDistFolder, { recursive: true });
  } catch (error) {
    console.error(error.message);
  }
}

createFolder();

async function replaceTags() {
  try {
    let html = await fsPromises.readFile(templateHtml, 'utf-8');
    const dirListArr = await fsPromises.readdir(compFolder, {
      withFileTypes: true,
    });

    const promises = dirListArr.map(async (file) => {
      if (file.isFile() && path.extname(file.name) === '.html') {
        const pathToFile = path.join(compFolder, file.name);
        const text = await fsPromises.readFile(pathToFile, 'utf-8');
        html = html.replace(`{{${file.name.slice(0, -5)}}}`, text);
      }
    });

    await Promise.all(promises);
    await fsPromises.writeFile(fileHtml, html);
  } catch (error) {
    console.error(error);
  }
}

replaceTags();

const stylesFolder = path.join(__dirname, 'styles');
const bundleFile = path.join(projectDistFolder, 'style.css');

async function mergeStyles() {
  const files = await fsPromises.readdir(stylesFolder, { withFileTypes: true });
  const writableStream = fs.createWriteStream(bundleFile);

  files.forEach((file) => {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const filePath = path.join(stylesFolder, file.name);
      const readStream = fs.createReadStream(filePath, 'utf-8');
      readStream.pipe(writableStream, { end: false });
    }
  });
}

mergeStyles();

const pathToFolder = path.join(__dirname, 'assets');
const pathToCopyFolder = path.join(projectDistFolder, 'assets');

async function copyDir(src, dest) {
  try {
    await fsPromises.rm(dest, { force: true, recursive: true });
    await fsPromises.mkdir(dest, { recursive: true });

    const files = await fsPromises.readdir(src, { withFileTypes: true });

    files.forEach(async (file) => {
      const srcPath = path.join(src, file.name);
      const destPath = path.join(dest, file.name);

      try {
        if (file.isFile()) {
          await fsPromises.copyFile(srcPath, destPath);
        } else if (file.isDirectory()) {
          await copyDir(srcPath, destPath);
        }
      } catch (error) {
        console.error(error.message);
      }
    });
  } catch (error) {
    console.error(error.message);
  }
}

copyDir(pathToFolder, pathToCopyFolder);
