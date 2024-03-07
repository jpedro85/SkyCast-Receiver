import ContentFetcher from "./ContentFetcher.js";
import ImageLoader from "./ImageLoader.js";
import Subject from "./Subject.js";

/**
 * The CarouselDisplay class manages the functionality of an image carousel that fetches and displays images in pairs (landscape and title logo) from a specified API.
 * It leverages ImageLoader to preload images for smooth transitions and ImageFetcher to retrieve the image data. The carousel cycles through these images automatically at a set interval defined by you.
 *
 * @example <caption>HTML Setup for CarouselDisplay</caption>
 *
 * <div id="carousel-container">
 *     <img id="background-img" src="" alt="background">
 *     <img id="title-img" src="" alt="title logo">
 * </div>
 *
 * @example <caption>JavaScript Integration for CarouselDisplay</caption>
 *
 * // JavaScript implementation
 * import CarouselDisplay from './CarouselDisplay.js';
 *
 * // Define the API URL and headers for fetching images
 * const apiUrl = 'https://api.example.com/images';
 * const headers = { Authorization: 'Bearer YOUR_API_KEY' };
 *
 * // Create an instance of CarouselDisplay
 * const carousel = new CarouselDisplay('#carousel-container');
 *
 * // Setup the carousel with your API URL and headers
 * // This will fetch, preload, and start displaying the images
 * carousel.setupCarousel(apiUrl, headers).then(() => {
 *     console.log('Carousel is now setup and displaying images.');
 * }).catch(error => {
 *     console.error('Failed to setup the carousel:', error);
 * });
 */
class CarouselDisplay extends Subject {
    /**
     * Initializes a new instance of the CarouselDisplay class.
     * @param {string} containerId - The ID of the DOM element that will contain the carousel.
     * @param {number} imageInterval - The amount of time in milliseconds you want each image to have of screen time before changing
     */
    constructor(containerId, imageInterval) {
        super();
        this.container = document.querySelector(containerId);
        this.backgroundImageElement = this.container.querySelector("#background-img");
        this.titleImageElement = this.container.querySelector("#title-img");
        this.currentIndex = 0;
        this.carouselItems = [];
        this.observers = [];
        this.shouldStopCarousel = false;
        this.imageInterval = imageInterval;
        this.intervalId = null;
        this.ratingIconPath = "./images/Star.png";
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observerToRemove) {
        this.observers = this.observers.filter(observer => observer !== observerToRemove);
    }

    notifyObserver(event) {
        this.observers.forEach(observer => observer.update(this, event))
    }

    /**
    * Sets up the carousel by fetching content (image pairs and additional information) from the provided API URL
    * and preloading the images for a smooth carousel experience.
    *
    * @async
    * @param {string} apiUrl - The API URL from which to fetch content.
    * @param {Object} headers - The headers to be sent with the API request.
    * @returns {Promise<void>} A promise that resolves once the content has been fetched, processed, and the carousel is ready.
    */
    async setupCarousel(apiUrl, headers) {

        try {
            const fetcher = new ContentFetcher(apiUrl, headers);

            const { imagePairs, contentInfo } = await fetcher.fetchContent();

            await ImageLoader.preloadImages(imagePairs);
            console.log("All images preloaded");

            this.carouselItems = imagePairs.map((pair, index) => ({
                imagePair: pair,
                pairInformation: contentInfo[index]
            }));

            // Start the carousel with the structured image pairs
            this.startCarousel();
        } catch (error) {
            console.error("Failed to setup the carousel:", error)
        };
    }


    /**
     * Starts the carousel rotation by displaying the first pair of images and setting an interval for subsequent images.
     * The carousel loop can be stopped by using shouldStopCarousel. The interval between image changes is
     * determined by `imageInterval` when creating a CarouselDisplay
     */
    startCarousel() {

        this.notifyObserver("start");

        this.showNextSlide();

        // Saving the intervalId so we can stop the loop later
        this.intervalId = this.createCarouselInterval();;
    }

    createCarouselInterval() {
        return setInterval(() => {
            if (this.shouldStopCarousel) {
                // Stop the interval
                clearInterval(this.intervalId);
            } else {
                this.showNextSlide();
            }
        }, this.imageInterval);
    }

    /**
     * Stops the carousel rotation
     */
    stopCarousel() {
        this.shouldStopCarousel = true;
        this.notifyObserver("stop");
    }

    /**
     * Displays the next pair of images in the carousel, cycling through the `imagePairs` array.
     */
    showNextSlide() {
        const carrouselImagesCount = this.carouselItems.length;
        if (carrouselImagesCount === 0) return;

        const currentItem = this.carouselItems[this.currentIndex];
        const { imagePair, pairInformation } = currentItem;

        this.backgroundImageElement.src = imagePair.landscape;
        this.titleImageElement.src = imagePair.titleLogo;

        this.updateDescriptionContent(pairInformation);

        this.currentIndex = (this.currentIndex + 1) % this.carouselItems.length; // Loop through image pairs
    }

    // TODO: To further improve this part
    // Need some more logic like for example show only the format if above HD or show the best
    // Implement somekind of distinction of the between series and movies
    // How to handle in case of there is no Item Rating
    updateDescriptionContent(itemDescription) {
        const { itemRating, year, duration, ageRating, seasonCount } = itemDescription;
        const lastElement = this.container.querySelector("#description-content");
        const itemDescriptionElement = lastElement.cloneNode(true);

        itemDescriptionElement.innerHTML = `
        <div id="rating">
            <span id="item-rating">${itemRating}</span>
            <img id="item-rating-icon" src="./images/Star.png">
        </div>
        <span id="season-count">${seasonCount} Seasons</span>
        <span id="age-rating">${ageRating}</span>
        <span id="video-format">${duration}</span>
        `;

        lastElement.parentNode.insertBefore(itemDescriptionElement, lastElement);
        lastElement.remove();

    }
}

export default CarouselDisplay;
