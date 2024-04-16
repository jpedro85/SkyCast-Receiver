const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

class ConfigFile {
    constructor(filePath) {
        this.filePath = filePath;
    }

    read() { }

    write(data) {
        fs.writeFileSync(this.filePath, data);
    }
}

class JsonConfigFile extends ConfigFile {
    read() {
        return promisify(fs.readFile)(this.filePath, 'utf8');
    }
}

class MainFile extends ConfigFile {
    constructor(filePath, config) {
        super(filePath);
        this.config = config;
    }

    write() {
        const { debuggerConsole, debuggerOverlay, chromecastChannel, imageInterval, carouselUrl, carouselHeaders } = this.config;
        let content = "";

        if (debuggerConsole) {
            content += `import DebuggerConsole from "./utils/Debugger.js";

const debuggerConsole = new DebuggerConsole();
debuggerConsole.enableDebugOverlay(${debuggerOverlay ?? false});
`;
        }

        if (chromecastChannel) {
            const { NAMESPACE, communicationConstants } = chromecastChannel;
            content += `
import ChromecastChannel from "./communication/ChromecastChannel.js";

let communicationConstants = ${JSON.stringify(communicationConstants)};
const communicationChannel = new ChromecastChannel("${NAMESPACE}", { communicationConstants, callbacks: debuggerConsole.sendLog });

// Add custom message listener
const context = cast.framework.CastReceiverContext.getInstance();
context.addCustomMessageListener("${NAMESPACE}", communicationChannel.onMessage);`;
        }

        if (imageInterval) {
            content += this.getCarouselSetupCode(carouselUrl, carouselHeaders, imageInterval);
            content += this.getPlayerManagerSetupCode();
        }

        return super.write(content);
    }

    getCarouselSetupCode(carouselUrl, carouselHeaders, imageInterval) {
        return `

import CarouselDisplay from "./media/CarouselDisplay.js";
import AssetManager from "./media/AssetManager.js";

const elementsId = {
    containerId: "#container",
    backgroundImageId: "#background-img",
    titleImageId: "#title-img",
    slideDescriptionId: "#description-content",
    carouselId: "#carousel",
};

const carousel = new CarouselDisplay(${imageInterval}, elementsId);
const assetManager = new AssetManager();
carousel.addObserver(assetManager);

carousel.setupCarousel("${carouselUrl}", ${JSON.stringify(carouselHeaders)});
`;
    }

    getPlayerManagerSetupCode() {
        return `
import PlayerManager from "./PlayerManager.js";

const playerManager = new PlayerManager(carousel);
playerManager.initPlayerManager();
playerManager.startContext();
`;
    }
}

class ConfigFileFactory {
    static createConfigFile(filePath) {
        return new JsonConfigFile(filePath);
    }

    static createMainFile(filePath, config) {
        return new MainFile(filePath, config);
    }
}

module.exports = class Parser {
    constructor() {
        if (!Parser.instance) {
            this.configFile = ConfigFileFactory.createConfigFile(path.join(__dirname, 'config.json'));
            this.mainFile = null;
            Parser.instance = this;
        }

        return Parser.instance;
    }

    async readConfig() {
        const configData = await this.configFile.read();
        return JSON.parse(configData);
    }

    async writeMain(config) {
        this.mainFile = ConfigFileFactory.createMainFile(path.join(__dirname, '/public/js/Test.js'), config);
        await this.mainFile.write();
    }
}
