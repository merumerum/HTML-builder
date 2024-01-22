const fs = require('fs');
const path = require('path');
const pathToFile = path.join(__dirname, 'text.txt');
const readableStream = fs.createReadStream(pathToFile, 'utf-8');

readableStream.on('data', (text) => console.log(text));
readableStream.on('error', (error) => console.log('Ошибочка:', error.message));
