const fs = require("fs");
const { promisify } = require("util");

const unlinkAsync = promisify(fs.unlink);

async function deleteFile(path) {
  await unlinkAsync(path);
}

module.exports = {
  deleteFile,
};
