const fs = require('fs');
const path = require('path');

const pathOldFolder = path.join(__dirname, 'files');
const pathNewFolder = path.join(__dirname, 'files-copy');

function createFolder() {
  // console.log('createFolder');
  fs.mkdir(pathNewFolder, (err) => {
    if (err) throw err;
  });
}

function delteAllFiles() {
  // console.log('delteAllFiles');
  fs.readdir(pathNewFolder, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      fs.unlink(path.join(pathNewFolder, file), (errLink) => {
        if (errLink) throw errLink;
      });
    });
  });
}

function copyFiles() {
  fs.readdir(pathOldFolder, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      fs.copyFile(path.join(pathOldFolder, file), path.join(pathNewFolder, file), (errCopy) => {
        if (errCopy) throw errCopy;
      });
    });
  });
}

function startCopy() {
  // console.log('checkFolder');
  fs.stat(pathNewFolder, (err) => {
    if (err) {
      createFolder();
    } else {
      delteAllFiles();
    }
    copyFiles();
  });
}

startCopy();
