const { readdir, stat } = require("fs/promises");
const path = require("path");

async function showFilesInfo() {

  try {
    const files = await readdir(path.join(__dirname, "secret-folder"), { withFileTypes: true });
    const filteredFiles = files.filter(file => file.isFile());

    for (let file of filteredFiles) {
      const stats = await stat(path.join(__dirname, "secret-folder", file.name));

      let n = file.name;
      let ext = path.extname(file.name).slice(1);
      let size = formatBytes(stats.size);
      console.log(`${n.substring(0, n.indexOf(".")).padEnd(8, " ")} - ${ext.padEnd(6, " ").padStart(8, " ")} - ${size.padStart(10, " ")} `);
    }

  } catch (err) {
    console.error(err);
  }
}

const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return "0 bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["bytes", "kb", "mb", "gb", "tb", "pb", "eb", "zb", "yb"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

showFilesInfo();
