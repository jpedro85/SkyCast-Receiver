const JsonConfigFile = require("./ConfigJsonFile.js");
const MainFile = require("./MainFile.js");

module.exports = class ConfigFileFactory {
    static createConfigFile(filePath) {
        return new JsonConfigFile(filePath);
    }

    static createMainFile(filePath, config) {
        return new MainFile(filePath, config);
    }
}
