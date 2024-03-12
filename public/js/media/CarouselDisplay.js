import ItemType from "../utils/enums/ItemTypes.js";
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

    /**
     * Adds an observer to the carousel, allowing it to receive update notifications.
     * @param {Observer} observer - The observer object that should receive update notifications.
     */
    addObserver(observer) {
        this.observers.push(observer);
    }

    /**
     * Removes an observer from the carousel, preventing it from receiving further update notifications.
     * @param {Observer} observerToRemove - The observer object to be removed.
     */
    removeObserver(observerToRemove) {
        this.observers = this.observers.filter(observer => observer !== observerToRemove);
    }

    /**
     * Notifies all observers about an event, calling their update method.
     * @param {string} event - The event that has occurred, triggering the observers' update method.
     */
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

    /**
     * Creates and starts the interval for cycling through carousel images. The interval will automatically
     * call `showNextSlide` method at a fixed time interval defined by `imageInterval`.
     * If `shouldStopCarousel` is set to true, the interval will stop, halting the carousel.
     * @returns {number} The interval ID which can be used to clearInterval if needed.
     */
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
     * Stops the carousel rotation.
     * This method should be called to halt the carousel before starting it again or when the carousel is no longer needed.
     */
    stopCarousel() {
        this.shouldStopCarousel = true;
        this.notifyObserver("stop");
    }

    /**
     * Advances the carousel to the next slide, updating the display accordingly.
     * If there are no images in the carousel, this method does nothing.
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

    // FIX: It seems theres is a bit of lag on switching to the next slide with the images and its description
    // TODO: Clean this function
    // Needs to show the best format avaiable
    /**
     * Updates the carousel's description content based on the current item's information.
     * This includes displaying item ratings, season counts, age ratings, and video format and so on.
     * @param {Object} itemDescription - An object containing the description details of the current item.
     */
    updateDescriptionContent(itemDescription) {
        console.log(itemDescription);
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

export default CarouselDisplay;
