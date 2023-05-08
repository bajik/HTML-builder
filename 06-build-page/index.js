const fs = require('fs');
const path = require('path');

const pathNewFolder = path.join(__dirname, 'project-dist');
const pathNewAssets = path.join(pathNewFolder, 'assets');
const pathAssets = path.join(__dirname, 'assets');
const pathComponents = path.join(__dirname, 'components');
const templateFile = path.join(__dirname, 'template.html');
const pathStyle = path.join(__dirname, 'styles');

async function deleteAllFilesAndFolders(directoryPath) {
  try {
    await fs.promises.access(directoryPath);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return;
    }
    throw err;
  }

  const files = await fs.promises.readdir(directoryPath);

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stats = await fs.promises.stat(filePath);

    if (stats.isFile()) {
      await fs.promises.unlink(filePath);
    } else if (stats.isDirectory()) {
      await deleteAllFilesAndFolders(filePath);
    }
  }

  await fs.promises.rmdir(directoryPath);
}

async function createFolder(folder) {
  try {
    await fs.promises.mkdir(folder);
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
}

async function getContent(file) {
  const pathFile = path.join(pathComponents, `${file}.html`);
  const content = await new Promise((resolve, reject) => {
    fs.readFile(pathFile, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
  return content;
}

async function readTemplateFile() {
  const stream = new fs.ReadStream(templateFile);
  stream.on('data', async (data) => {
    let template = data.toString();
    let startIndex = 0;
    while (startIndex !== -1) {
      startIndex = template.indexOf('{{', startIndex + 1);
      const finishIndex = template.indexOf('}}', startIndex);
      if (startIndex !== -1) {
        const templateName = template.substring(startIndex + 2, finishIndex);
        const content = await getContent(templateName);
        template = template.replace(`{{${templateName}}}`, content);
      }
    }
    const writeStream = fs.createWriteStream(path.join(pathNewFolder, 'index.html'));
    writeStream.write(template);
  });
}

async function copyFolder(currentFolder, newFolder) {
  const files = await fs.promises.readdir(currentFolder);
  for (const file of files) {
    const filePath = path.join(currentFolder, file);
    const stats = await fs.promises.stat(filePath);
    // console.log(file, stats.isFile());
    if (stats.isFile()) {
      fs.copyFile(path.join(currentFolder, file), path.join(newFolder, file), (errCopy) => {
        if (errCopy) throw errCopy;
      });
    } else {
      const oFolder = path.join(currentFolder, file);
      const nFolder = path.join(newFolder, file);
      await createFolder(nFolder);
      await copyFolder(oFolder, nFolder)
    }
  }
}

async function mergeCSS() {
  const files = await fs.promises.readdir(pathStyle, { withFileTypes: true });
  const outputStream = fs.createWriteStream(path.join(pathNewFolder, 'style.css'));

  for (let i = 0; i < files.length; i += 1) {
    if (files[i].isDirectory()) {
      // eslint-disable-next-line no-continue
      continue;
    }
    const filePath = path.join(pathStyle, files[i].name);
    const fileParse = path.parse(filePath);
    if (fileParse.ext !== '.css') {
      // eslint-disable-next-line no-continue
      continue;
    }
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(outputStream);
  }
}

async function build() {
  try {
    await deleteAllFilesAndFolders(pathNewFolder);
    await createFolder(pathNewFolder);
    await readTemplateFile();
    await createFolder(pathNewAssets);
    await copyFolder(pathAssets, pathNewAssets);
    await mergeCSS();
    // ...
  } catch (err) {
    console.error(err);
  }
}

build();