import ItemType from "../utils/enums/ItemTypes.js";
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

        // Toggling visibility for assets
        this.castLogoDiv.classList.toggle("hidden");
        const loadingAssets = this.carousel.container.querySelectorAll(".loading");
        loadingAssets.forEach(asset => {
            asset.classList.toggle("loading");
        });

        // Setting image sources
        this.castImage.src = this.castImagePath;
        this.logoImage.src = this.logoImagePath;
        this.carousel.container.style.backgroundColor = "black";
    }

    loadNextSlide() {

        // So theres is no flicker from changing image
        // And so that in that there are no cases of the previous image still being there
        this.carousel.backgroundImageElement.src = null;
        this.carousel.titleImageElement.src = null;

        const currentItem = this.carousel.carouselItems[this.carousel.currentIndex];
        const { imagePair, pairInformation } = currentItem;

        // this.checkLoadingPerformance(imagePair, pairInformation);

        const loadPromises = [new Promise(resolve => {
            this.carousel.backgroundImageElement.onload = () => resolve();
            this.carousel.backgroundImageElement.src = imagePair.landscape;
        }), new Promise(resolve => {
            this.carousel.titleImageElement.onload = () => resolve();
            this.carousel.titleImageElement.src = imagePair.titleLogo;
        })];

        Promise.all(loadPromises).then(() => {
            this.loadSlideDescription(pairInformation);
            const carouselElement = this.carousel.container.querySelector("#carousel");
            carouselElement.classList.remove("slide-in");
            carouselElement.offsetWidth;
            carouselElement.classList.add("slide-in");
        }).catch(error => {
            console.error("Error loading images:", error);
        });

    }

    // NOTE: For Development only
    // Logging the time it takes to see if its not loading images again
    checkLoadingPerformance(imagePair, pairInformation) {

        console.log("Slide: ", this.carousel.currentIndex);
        const backgroundStartTime = performance.now();
        const titleStartTime = performance.now();
        const loadPromises = [
            new Promise(resolve => {
                this.carousel.backgroundImageElement.onload = () => {
                    const duration = performance.now() - backgroundStartTime;
                    console.log(`Background image loaded in ${duration.toFixed(2)} ms`);
                    resolve();
                };
                this.carousel.backgroundImageElement.src = imagePair.landscape;
            }),
            new Promise(resolve => {
                this.carousel.titleImageElement.onload = () => {
                    const duration = performance.now() - titleStartTime;
                    console.log(`Title image loaded in ${duration.toFixed(2)} ms`);
                    resolve();
                };
                this.carousel.titleImageElement.src = imagePair.titleLogo;

            })
        ];

        Promise.all(loadPromises).then(() => {
            this.loadSlideDescription(pairInformation);
        }).catch(error => {
            console.error("Error loading images:", error);
        });
    }

    // TODO: Clean this function
    // Needs to show the best format avaiable
    /**
     * Updates the carousel's description content based on the current item's information.
     * This includes displaying item ratings, season counts, age ratings, and video format and so on.
     * @param {Object} itemDescription - An object containing the description details of the current item.
     */
    loadSlideDescription(itemDescription) {

        const { year, ageRating, duration, seasonCount, videoFormats } = itemDescription;
        let itemRating = itemDescription.itemRating ?? "";

        const lastElement = this.carousel.container.querySelector("#description-content");
        const itemDescriptionElement = lastElement.cloneNode(true);

        if (itemRating) {
            itemRating += " / 100";
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
            const seasonsString = (seasonCount > 1) ? seasonCount + " Seasons" : seasonCount + " Season";
            itemDescriptionElement.innerHTML = `
                <div id="rating">
                    <span id="item-rating">${itemRating}</span>
                </div>
                <span id="season-count">${seasonsString}</span>
                <span id="age-rating">${ageRating}</span>
                <span id="video-format"> ${videoFormats[0]}</span>
                `;
        }

        lastElement.parentNode.insertBefore(itemDescriptionElement, lastElement);
        lastElement.remove();

    }

}
export default AssetManager;
