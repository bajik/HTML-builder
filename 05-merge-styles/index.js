const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'styles');
const pathBundleFile = path.join(__dirname, 'project-dist', 'bundle.css');

async function mergeFiles() {
  const files = await fs.promises.readdir(directoryPath, { withFileTypes: true });
  // console.log(files.length);
  const outputStream = fs.createWriteStream(pathBundleFile);

  for (let i = 0; i < files.length; i += 1) {
    if (files[i].isDirectory()) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const filePath = path.join(directoryPath, files[i].name);

    const fileParse = path.parse(filePath);
    // console.log(fileParse);
    if (fileParse.ext !== '.css') {
      // eslint-disable-next-line no-continue
      continue;
    }
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(outputStream);
  }
}

mergeFiles();
