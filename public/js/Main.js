import CarouselDisplay from "./media/CarouselDisplay.js";
import AssetManager from "./media/AssetManager.js";
import PlayerManager from "./PlayerManager.js";
import DebuggerConsole from "./utils/Debugger.js";

const debuggerConsole = new DebuggerConsole();
debuggerConsole.enableDebugOverlay();

// Initializing Carousel
const imageInterval = 5000;
const elementsId = {
    containerId: "#container",
    backgroundImageId: "#background-img",
    titleImageId: "#title-img",
    slideDescriptionId: "#description-content",
    carouselId: "#carousel",
};

const carousel = new CarouselDisplay(imageInterval, elementsId);
const assetManager = new AssetManager();
carousel.addObserver(assetManager);

// Start the Image Carousel
carousel.setupCarousel("https://mobile.clients.peacocktv.com/bff/sections/v1?segment=all_premium_users&node_id=13dba516-9722-11ea-bbcc-234acf5d5a4e", {
    Host: "mobile.clients.peacocktv.com",
    "X-SkyOTT-Provider": "NBCU",
    "X-SkyOTT-Proposition": "NBCUOTT",
    "X-SkyOTT-Territory": "US",
    "X-SkyOTT-Language": "en",
    "X-SkyOTT-Device": "MOBILE",
    "X-SkyOTT-Platform": "IOS",
});

const playerManager = new PlayerManager(carousel);
playerManager.initPlayerManager();
playerManager.startContext();
