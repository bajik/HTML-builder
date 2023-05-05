const fs = require('fs');
const path = require('path');
const process = require('process');

function readFile(fileName) {
  const stream = new fs.ReadStream(path.join(__dirname, fileName));

  stream.on('error', (err) => {
    process.stdout.write(`Error reading file ${fileName}: ${err.message}`);
  });

  stream.on('open', () => {
    process.stdout.write(`Start read file "${fileName}"\n`);
  });

  stream.on('readable', () => {
    let data;
    while ((data === stream.read()) != null) {
      process.stdout.write(data);
    }
  });

  stream.on('end', () => {
    process.stdout.write(`Finish read file "${fileName}"`);
  });
}

fs.readdir(__dirname, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    const fileParse = path.parse(file);
    if (fileParse.ext === '.txt') {
      readFile(fileParse.base);
    }
  });
});
