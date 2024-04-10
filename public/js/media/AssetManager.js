import ItemType from "../utils/enums/ItemTypes.js";
import VideoFormatsEnum from "../utils/enums/VideoFormats.js";
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
        this.slideDescription = null;
        this.assetsLoaded = false;
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
            this.castLogoDiv = this.carousel.container.querySelector("#cast-logo");
            this.slideDescription = this.carousel.container.querySelector(this.carousel.slideDescriptionId);
        }
        if (event == "start") {
            if (!this.assetsLoaded) {
                this.loadCarouselAssets();
                this.assetsLoaded = true;
            }
            else {
                this.carousel.container.classList.toggle("hidden");
            }
        } else if (event == "stop") {
            this.carousel.container.classList.toggle("hidden");
        } else if (event == "next") {
            this.loadNextSlide(this.carousel);
        }
    }

    /**
     * Loads and toggles visibility of assets including the casting icon and logo images.
     * Also toggles loading indicators for a smoother user experience.
     */
    loadCarouselAssets() {

        this.castLogoDiv.classList.toggle("hidden");
        const loadingAssets = this.carousel.container.querySelectorAll(".loading");
        loadingAssets.forEach(asset => {
            asset.classList.toggle("loading");
        });

        this.slideDescription.innerHTML = "";

        this.carousel.container.style.backgroundColor = "black";

        this.assetsLoaded = true;
        console.log("Assets Loaded");
    }

    /**
     * Loads the next slide's images (background and title logo) into the carousel and updates the display.
     * This function fetches the next carousel item's images based on the `carousel.currentIndex` and then
     * replaces the current images with the new ones. It ensures a smooth transition between slides by cloning
     * the current image elements, setting their `src` to null initially, and then updating their `src` to the
     * new images. After the images have loaded, it inserts the new image elements into the DOM and removes
     * the old ones. Additionally, it triggers a CSS animation for the slide transition and updates the slide
     * description based on the new item's information.
     */
    loadNextSlide() {

        const lastBackgroundElement = this.carousel.container.querySelector(this.carousel.backgroundImageId);
        const lastTitleElement = this.carousel.container.querySelector(this.carousel.titleImageId);

        const backgroundElement = lastBackgroundElement.cloneNode(true);
        const titleImageElement = lastTitleElement.cloneNode(true);
        backgroundElement.src = null;
        titleImageElement.src = null;

        const currentItem = this.carousel.carouselItems[this.carousel.currentIndex];
        const { imagePair, pairInformation } = currentItem;

        // this.checkLoadingPerformance(imagePair, pairInformation);

        Promise.all([
            new Promise(resolve => {
                backgroundElement.src = imagePair.landscape;
                backgroundElement.onload = () => resolve();
            }),
            new Promise(resolve => {
                titleImageElement.src = imagePair.titleLogo;
                titleImageElement.onload = () => resolve();
            })
        ]).then(() => {

            lastBackgroundElement.parentNode.replaceChild(backgroundElement, lastBackgroundElement);
            lastTitleElement.parentNode.replaceChild(titleImageElement, lastTitleElement);

            const carouselId = this.carousel.carouselId;
            const carouselElement = this.carousel.container.querySelector(carouselId);

            carouselElement.classList.remove("slide-in");
            carouselElement.offsetWidth;
            carouselElement.classList.add("slide-in");

            this.loadSlideDescription(pairInformation);
        }).catch(error => {
            console.error("Error loading images:", error);
        });

    }

    // NOTE: For Development only
    // Logging the time it takes to see if its not loading images again
    checkLoadingPerformance(imagePair, pairInformation) {

        console.log("Slide: ", this.carousel.currentIndex);

        const lastBackgroundElement = this.carousel.container.querySelector(this.carousel.backgroundImageId);
        const lastTitleElement = this.carousel.container.querySelector(this.carousel.titleImageId);

        const backgroundElement = lastBackgroundElement.cloneNode();
        const titleImageElement = lastTitleElement.cloneNode();
        backgroundElement.src = null;
        titleImageElement.src = null;

        const backgroundStartTime = performance.now();
        const titleStartTime = performance.now();
        let durationBackground = 0;

        Promise.all([
            new Promise(resolve => {
                backgroundElement.src = imagePair.landscape;
                backgroundElement.onload = () => {
                    durationBackground = performance.now() - backgroundStartTime;
                    console.log(`Background image loaded in ${durationBackground.toFixed(2)} ms`);
                    resolve();
                };
            }),
            new Promise(resolve => {
                titleImageElement.src = imagePair.titleLogo;
                titleImageElement.onload = () => {
                    const duration = performance.now() - titleStartTime - durationBackground;
                    console.log(`Title image loaded in ${duration.toFixed(2)} ms`);
                    resolve();
                };
            })
        ]).then(() => {

            lastBackgroundElement.parentNode.replaceChild(backgroundElement, lastBackgroundElement);
            lastTitleElement.parentNode.replaceChild(titleImageElement, lastTitleElement);

            const carouselId = this.carousel.carouselId;
            const carouselElement = this.carousel.container.querySelector(carouselId);

            carouselElement.classList.remove("slide-in");
            carouselElement.offsetWidth;
            carouselElement.classList.add("slide-in");
            this.loadSlideDescription(pairInformation);
        }).catch(error => {
            console.error("Error loading images:", error);
        });

    }

    /**
     * Updates the carousel's description content based on the current item's information.
     * This includes displaying item ratings, season counts, age ratings, and video format and so on.
     * @param {Object} itemDescription - An object containing the description details of the current item.
     */
    loadSlideDescription(itemDescription) {

        const { year, ageRating, duration, seasonCount, videoFormats } = itemDescription;

        const itemRating = itemDescription.itemRating ?? "";
        const formattedItemRating = itemRating ? `${itemRating}%` : itemRating;

        const carouselSlideDescriptionId = this.carousel.slideDescriptionId;
        const lastElement = document.querySelector(carouselSlideDescriptionId);
        const itemDescriptionElement = lastElement.cloneNode(true);

        const bestVideoFormat = this.chooseBestVideoFormat(videoFormats)
        let detailsHTML = '';

        if (itemDescription.type === ItemType.MOVIE) {
            const [hours, minutes] = duration.match(/[^:]+/g);
            const formattedDuration = `${hours}h${minutes}m`;

            detailsHTML = `
                <span id="year-released">${year}</span>
                <span id="age-rating">${ageRating}</span>
                <span id="movie-duration">${formattedDuration}</span>
                <span id="video-format">${bestVideoFormat}</span>
            `;

        } if (itemDescription.type === ItemType.SERIES) {
            const seasonsString = seasonCount > 1 ? `${seasonCount} Seasons` : `${seasonCount} Season`;
            detailsHTML = `
                <span id="season-count">${seasonsString}</span>
                <span id="age-rating">${ageRating}</span>
                <span id="video-format">${bestVideoFormat}</span>
            `;
        }

        itemDescriptionElement.innerHTML = `
            <div id="rating">
                <span id="item-rating">${formattedItemRating}</span>
            </div>
            ${detailsHTML}
        `;

        lastElement.parentNode.replaceChild(itemDescriptionElement, lastElement);

    }

    /**
     * Selects the best video format from an array of available formats based on predefined priorities.
     * This method assumes that the `videoFormats` parameter is an array of strings representing different
     * video formats (e.g., "HD", "FHD", "4K"), and it relies on the `VideoFormatsEnum` for the priority of each format.
     * The best format is considered to be the one with the highest priority as defined in `VideoFormatsEnum`.
     *
     * @param {String[]} videoFormats - An array of video format strings from which the best format is to be chosen.
     *                                  The video formats should correspond to keys in `VideoFormatsEnum`.
     * @returns {String} The best video format based on the highest priority in `VideoFormatsEnum`. If multiple formats
     *                   have the same highest priority, the first one encountered in the `videoFormats` array is returned.
     * @example
     * // Assuming VideoFormatsEnum = { "HD": 1, "FHD": 2, "4K": 3 };
     * const bestFormat = assetManager.chooseBestVideoFormat(["HD", "FHD", "4K"]);
     * console.log(bestFormat); // Outputs: "4K"
     */
    chooseBestVideoFormat(videoFormats) {

        let bestFormat = videoFormats[0];
        let highestPriority = 0;

        for (const format of videoFormats) {

            const priority = VideoFormatsEnum[format];

            if (priority && priority > highestPriority) {
                highestPriority = priority;
                bestFormat = format;
            }

        }
        return bestFormat;
    }

}
export default AssetManager;
