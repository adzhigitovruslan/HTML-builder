
const fs = require('fs');
const { mkdir, readdir, rm, access, copyFile } = require('node:fs/promises');
const path = require('path');
const projectFolder = path.join(__dirname, 'files-copy');
const sourceFolder = path.join(__dirname, 'files');

function checkFileExists(file) {
  return access(file, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
}

async function copyFiles(source, outcome) {

  try {
    const isExisted = await checkFileExists(outcome);
    if (isExisted) await rm(outcome, { recursive: true });
    await mkdir(outcome, { recursive: true });
    const files = await readdir(source, { withFileTypes: true });

    for (let file of files) {

      if (file.isDirectory()) {
        await mkdir(path.join(outcome, file.name));
        await copyFiles(path.join(source, file.name), path.join(outcome, file.name));
      } else {
        await copyFile(path.join(source, file.name), path.join(outcome, file.name));
      }

    }

  } catch (err) {
    console.log(err.message);
  }
}
copyFiles(sourceFolder, projectFolder);