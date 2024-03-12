import Observer from "./Observer.js";

/**
 * AssetManager is a subclass of Observer specifically designed to manage visual assets within a carousel.
 * It handles the loading and display of images and logos associated with the casting feature.
 * The class responds to events from the carousel to update its assets accordingly.
 */
class AssetManager extends Observer {

    constructor() {
        super();
        this.carousel = null;
        this.castImage = null;
        this.logoImage = null;
        this.castLogoDiv = null;
        this.castImagePath = "./images/cast-ready-icon.png";
        this.logoImagePath = "./images/PeacockLogo.png";
    }

    /**
     * Reacts to update events from the carousel, more precisely when the carousel starts and stops,
     * initializing carousel assets if not already done, and toggling visibility based on the event
     * type ('start' or 'stop').
     * @param {Subject} subject - The subject (carousel) issuing the update.
     * @param {string} event - The type of event ('start' or 'stop') that triggers the asset update.
     */
    update(subject, event) {
        if (this.carousel == null) {
            this.carousel = subject;
            this.castImage = this.carousel.container.querySelector("#cast-icon");
            this.castLogoDiv = this.carousel.container.querySelector("#cast-logo");
            this.logoImage = this.carousel.container.querySelector("#logo");
        }
        if (event == "start") {
            if (!this.assetsLoaded) {
                this.loadCarouselAssets();
                this.assetsLoaded = true;
            }
            else {
                this.carousel.classList.toggle("hidden");
            }
        } else if (event == "stop") {
            this.carousel.classList.toggle("hidden");
        } else if (event == "next") {
            this.loadNextSlide(this.carousel);
        }
    }

    /**
     * Loads and toggles visibility of assets including the casting icon and logo images.
     * Also toggles loading indicators for a smoother user experience.
     */
    loadCarouselAssets() {

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

    // TODO: Clean this function
    // Needs to show the best format avaiable
    /**
     * Updates the carousel's description content based on the current item's information.
     * This includes displaying item ratings, season counts, age ratings, and video format and so on.
     * @param {Object} itemDescription - An object containing the description details of the current item.
     */
    loadNextSlide(itemDescription) {
        const { year, ageRating, duration, seasonCount, videoFormats } = itemDescription;
        let { itemRating } = itemDescription;

        const lastElement = this.container.querySelector("#description-content");
        const itemDescriptionElement = lastElement.cloneNode(true);

        if (itemRating) {
            itemRating += " / 100";
        } else {
            itemRating = "No Rating Yet";
        }


        if (itemDescription.type === ItemType.MOVIE) {
            const slicedDuration = duration.match(/[^:]+/g);
            const formatedDuration = `${slicedDuration[0]}h${slicedDuration[1]}m`;

            itemDescriptionElement.innerHTML = `
                <div id="rating">
                    <span id="item-rating">${itemRating}</span>
                </div>
                <span id="year-released">${year}</span>
                <span id="age-rating">${ageRating}</span>
                <span id=movie-duration">${formatedDuration}</span>
                <span id="video-format"> ${videoFormats[0]}</span>
                `;

        } else {
            itemDescriptionElement.innerHTML = `
                <div id="rating">
                    <span id="item-rating">${itemRating}</span>
                </div>
                <span id="season-count">${seasonCount} Seasons</span>
                <span id="age-rating">${ageRating}</span>
                <span id="video-format"> ${videoFormats[0]}</span>
                `;
        }

        lastElement.parentNode.insertBefore(itemDescriptionElement, lastElement);
        lastElement.remove();

    }
}

export default AssetManager;
