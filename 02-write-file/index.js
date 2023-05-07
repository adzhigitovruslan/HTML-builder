// const { error } = require("console");
const fs = require("fs");
const path = require("path");
const { stdin: input, stdout: output } = process;
const writer = fs.createWriteStream(path.join(__dirname, "output.txt"));

const signalHandler = () => {
  process.exit();
};

const create = () => {
  output.write("Enter text here ..\n");
  input.on("data", data => {
    if (data.toString().trim() === "exit") process.exit();
    writer.write(data);
  });
  process.on("exit", () => output.write("See you!\n"));
  ["SIGINT", "SIGTERM", "SIGQUIT"].forEach(signal => process.on(signal, () => signalHandler()));
};

create();