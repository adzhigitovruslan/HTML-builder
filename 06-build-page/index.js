const fs = require('fs');
const { mkdir, readdir, rm, access, readFile, copyFile } = require('fs/promises');
const path = require('path');
const projectFolder = path.join(__dirname, 'project-dist');
const sourceAssets = path.join(__dirname, 'assets');

async function checkFileExists(file) {

  try {
    await access(path.join(file), fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }

}

async function init(outcome) {

  try {
    await createProjectFolder(outcome);
    await copyFiles(sourceAssets, path.join(__dirname, 'project-dist', 'assets'));
    await buildHtml();
    await copyCss();
  } catch (error) {
    console.log(error.message);
  }

}

async function createProjectFolder(outcome) {

  try {
    const isExisted = await checkFileExists(outcome);
    if (isExisted) await rm(outcome, { recursive: true });
    await mkdir(outcome, { recursive: true });
  } catch (error) {
    console.log(error.message);
  }

}

async function copyFiles(source, outcome) {

  try {
    await mkdir(outcome, { recursive: true });

    const files = await readdir(source, { withFileTypes: true });

    for (let file of files) {

      if (file.isDirectory()) {
        await mkdir(path.join(outcome, file.name), { recursive: true });
        await copyFiles(path.join(source, file.name), path.join(outcome, file.name));
      } else {
        await copyFile(path.join(source, file.name), path.join(outcome, file.name));
      }


    }

  } catch (err) {
    console.log(err.message);
  }
}

async function buildHtml() {

  try {
    const html = await readFile(path.join(__dirname, 'template.html'), 'utf-8');
    const htmlComponents = await readdir(path.join(__dirname, 'components'), { withFileTypes: true });
    let newHtml = html;
    const writer = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'), 'utf-8');
    
    for(let comp of htmlComponents) {
      const templateContent = await readFile(path.join(__dirname, 'components', comp.name), 'utf-8');
      let tempName = comp.name.substring(0, comp.name.indexOf('.'));
      newHtml = newHtml.replace(`{{${tempName}}}`, templateContent);
    }

    writer.write(newHtml);
  } catch (error) {
    console.log(error.message);
  }

}

async function copyCss() {

  try {
    const writer = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'), 'utf-8');
    const source = path.join(__dirname, 'styles');
    const files = await readdir(source, { withFileTypes: true });

    for (let file of files) {

      if (file.isFile() && path.extname(file.name) === '.css') {
        const fileCss = await readFile(path.join(source, file.name), 'utf-8');
        writer.write(fileCss);
      }

    }

  } catch (error) {
    console.log(error.message);
  }


}

init(projectFolder);