const fs = require('fs');
const path = require('path');
const process = require('process');

async function readFiles() {
  const dirPath = path.join(__dirname, 'secret-folder');
  try {
    const files = await fs.promises.readdir(dirPath, {withFileTypes: true})
    for (let i = 0; i < files.length; i++) {
      if (files[i].isDirectory()) continue;
      console.log(files[i]);

      const filePath = path.join(dirPath, files[i].name);

      fs.stat(filePath, (err, stats) => {
        if (err) throw err;
        const fileParse = path.parse(filePath);
        console.log(`${fileParse.name} - ${fileParse.ext.slice(1)} - ${(stats.size / 1024).toFixed(3)}kb`);
      })
    }
    // console.log(files);
  } catch (err) {
    console.error(err);
  }
}

readFiles();
