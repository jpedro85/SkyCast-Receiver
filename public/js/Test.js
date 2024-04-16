
import ChromecastChannel from "./communication/ChromecastChannel.js";

let communicationConstants = {};
const communicationChannel = new ChromecastChannel("urn:x-cast:com.skycast.chromecast.communication", { communicationConstants, callbacks: debuggerConsole.sendLog });

// Add custom message listener
const context = cast.framework.CastReceiverContext.getInstance();
context.addCustomMessageListener("urn:x-cast:com.skycast.chromecast.communication", communicationChannel.onMessage);

import CarouselDisplay from "./media/CarouselDisplay.js";
import AssetManager from "./media/AssetManager.js";

const elementsId = {
    containerId: "#container",
    backgroundImageId: "#background-img",
    titleImageId: "#title-img",
    slideDescriptionId: "#description-content",
    carouselId: "#carousel",
};

const carousel = new CarouselDisplay(5000, elementsId);
const assetManager = new AssetManager();
carousel.addObserver(assetManager);

carousel.setupCarousel("https://mobile.clients.peacocktv.com/bff/sections/v1?segment=all_premium_users&node_id=13dba516-9722-11ea-bbcc-234acf5d5a4e", {"Host":"mobile.clients.peacocktv.com","X-SkyOTT-Provider":"NBCU","X-SkyOTT-Proposition":"NBCUOTT","X-SkyOTT-Territory":"US","X-SkyOTT-Language":"en","X-SkyOTT-Device":"MOBILE","X-SkyOTT-Platform":"IOS"});

import PlayerManager from "./PlayerManager.js";

const playerManager = new PlayerManager(carousel);
playerManager.initPlayerManager();
playerManager.startContext();
