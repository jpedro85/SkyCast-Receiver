import DebuggerConsole from "./utils/Debugger.js";
import CarouselDisplay from "./media/CarouselDisplay.js";
import AssetManager from "./media/AssetManager.js";
import ChromecastChannel from "./communication/ChromecastChannel.js";
import { initPlayerManager, startContext } from "./PlayerManager.js";

const NAMESPACE = "urn:x-cast:com.skycast.chromecast.communication";
let communicationConstants = {};

// Initializing the debugger
const debuggerConsole = new DebuggerConsole();
debuggerConsole.enableDebugOverlay();

// Custom Message Handler
const context = cast.framework.CastReceiverContext.getInstance();
const communicationChannel = new ChromecastChannel(NAMESPACE, { communicationConstants, callbacks: debuggerConsole.sendLog });
context.addCustomMessageListener(NAMESPACE, communicationChannel.onMessage);

// Initializing Carousel
const containerId = "#container";
const imageInterval = 5000;
const backgroundImageId = "#background-img";
const titleImageId = "#title-img";
const slideDescriptionId = "#description-content";

const carousel = new CarouselDisplay(containerId, imageInterval, backgroundImageId, titleImageId, slideDescriptionId);
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

initPlayerManager(carousel);
startContext();

