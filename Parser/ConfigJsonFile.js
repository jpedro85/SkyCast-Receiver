const ConfigFile = require("./ConfigFile.js");
const { promisify } = require('util');
const fs = require("fs");

module.exports = class JsonConfigFile extends ConfigFile {
    read() {
        return promisify(fs.readFile)(this.filePath, 'utf8');
    }
}
