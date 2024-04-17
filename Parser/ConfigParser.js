const ConfigFileValidator = require("./ConfigFileValidator.js");
const ConfigFileFactory = require("./ConfigFileFactory.js");

const CONFIG_JSON_DIR = "./config.json";
const OUTPUT_DIR = "./public/js/Main.js";

module.exports = class Parser {
    constructor() {
        if (!Parser.instance) {
            this.configFile = ConfigFileFactory.createConfigFile(CONFIG_JSON_DIR);
            this.mainFile = null;
            this.configValidator = new ConfigFileValidator();
            Parser.instance = this;
        }

        return Parser.instance;
    }

    async readConfig() {
        const configData = await this.configFile.read();
        const config = JSON.parse(configData);
        this.configValidator.validate(config);
        return config;
    }

    async writeMain(config) {
        this.mainFile = ConfigFileFactory.createMainFile(OUTPUT_DIR, config);
        await this.mainFile.write();
    }
}
