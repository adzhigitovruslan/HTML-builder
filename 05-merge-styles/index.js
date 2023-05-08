const fs = require('fs');
const path = require('path');
const { readdir, readFile } = require('node:fs/promises');
const sourceFolder = path.join(__dirname, 'styles');
const writer = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'), 'utf-8');

async function combineFiles(income) {
  const files = await readdir(income, { withFileTypes: true });

  try {
    for (let file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const fileCss = await readFile(path.join(income, file.name), 'utf-8');
        writer.write(fileCss);
      }
    }
  } catch (error) {
    console.error(error.message);
  }

}

combineFiles(sourceFolder);
