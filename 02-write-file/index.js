const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const pathToFile = path.join(__dirname, '02-write-file.txt');
const writableStream = fs.createWriteStream(pathToFile);

stdout.write('Привет, введите текст.\n');

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  } else {
    writableStream.write(data);
  }
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => console.log('\nПока!'));
