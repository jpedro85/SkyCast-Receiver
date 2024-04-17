const ConfigFile = require("./ConfigFile.js");

module.exports = class MainFile extends ConfigFile {
    constructor(filePath, config) {
        super(filePath);
        this.config = config;
    }

    write() {
        const { debuggerConsole, debuggerOverlay, chromecastChannel, imageInterval, carouselUrl, carouselHeaders } = this.config;
        let content = "";

        if (debuggerConsole) {
            content += `
import DebuggerConsole from "../utils/Debugger.js";

const debuggerConsole = new DebuggerConsole();
debuggerConsole.enableDebugOverlay(${debuggerOverlay ?? false});
`;
        }
        if (Object.keys(chromecastChannel).length !== 0) {
            const { NAMESPACE, communicationConstants } = chromecastChannel;
            content += `
import ChromecastChannel from "../communication/channels/ChromecastChannel.js";

let communicationConstants = ${JSON.stringify(communicationConstants)};
const communicationChannel = new ChromecastChannel("${NAMESPACE}", { communicationConstants, callbacks: debuggerConsole.sendLog });

// Add custom message listener
const context = cast.framework.CastReceiverContext.getInstance();
context.addCustomMessageListener("${NAMESPACE}", communicationChannel.onMessage);
`;
        }

        if (imageInterval) {
            content += this.getCarouselSetupCode(carouselUrl, carouselHeaders, imageInterval);
            content += this.getPlayerManagerSetupCode();
        }

        return super.write(content);
    }

    getCarouselSetupCode(carouselUrl, carouselHeaders, imageInterval) {
        return `
import CarouselDisplay from "../media/display/CarouselDisplay.js";
import AssetManager from "../media/AssetManager.js";

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
import PlayerManager from "../core/PlayerManager.js";

const playerManager = new PlayerManager(carousel);
playerManager.initPlayerManager();
playerManager.startContext();
`;
    }
}
