import Observer from "./Observer.js";

class AssetManager extends Observer {

    constructor() {
        super();
        this.carousel = null;
        this.castimage = null;
        this.logoimage = null;
        this.castLogoDiv = null;
        this.castImagePath = "./images/cast-ready-icon.png";
        this.logoImagePath = "./images/PeacockLogo.png";
    }

    update(subject, event) {
        if (this.carousel == null) {
            this.carousel = subject;
            this.castImage = this.carousel.container.querySelector("#cast-icon");
            this.castLogoDiv = this.carousel.container.querySelector("#cast-logo");
            this.logoImage = this.carousel.container.querySelector("#logo");
        }
        if (event == "start") {
            if (!this.assetsLoaded) {
                this.loadAsset();
                this.assetsLoaded = true;
            }
            else {
                this.carousel.classList.toggle("hidden");
            }
        } else if (event == "stop") {
            this.carousel.classList.toggle("hidden");
        }
    }

    loadAsset() {

        // Toggling visibility for assets
        this.castLogoDiv.classList.toggle("hidden");
        const loadingAssets = this.carousel.container.querySelectorAll(".loading");
        loadingAssets.forEach(asset => {
            asset.classList.toggle("loading");
        });

        // Setting image sources
        this.castImage.src = this.castImagePath;
        this.logoImage.src = this.logoImagePath;
    }

}

export default AssetManager;
