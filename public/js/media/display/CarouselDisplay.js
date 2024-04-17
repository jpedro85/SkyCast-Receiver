import PeacockContentFetcher from "../fetcher/PeacockContentFetcher.js";
import ImageLoader from "../display/ImageLoader.js";
import Subject from "../../utils/interfaces/Subject.js";

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
     * Constructs a new instance of the CarouselDisplay class, initializing it with the necessary properties for functionality.
     * This constructor sets up the carousel within a specified container in the DOM, using given IDs to reference specific elements
     * within the carousel (such as background and title image elements, and a slide description element). It also configures the carousel's
     * behavior, such as the duration each image is displayed and initializes properties for managing the carousel's state and observers.
     *
     * @param {number} slideInterval The duration (in milliseconds) that each image will be displayed on the screen before automatically transitioning
     * to the next image. This setting controls the pace at which the carousel cycles through its items.
     * @param {Object} elementsId An object containing specific IDs for elements within the carousel. These elements include the IDs for the background image,
     * title image, and slide description elements. This allows for flexible configuration of the carousel's components.
     * @param {string} elementsId.containerId The Id of the element that will serve as the container for the carousel. This is where the caorousel's
     * content will be displayed.
     * @param {string} elementsId.backgroundImageId The ID used to identify the background image element within the carousel.
     * @param {string} elementsId.titleImageId The ID used to identify the title image element within the carousel.
     * @param {string} elementsId.slideDescriptionId The ID used to identify the slide description element within the carousel.
     * @param {string} elementsId.carouselId The ID used to identify the carousel itself
     */
    constructor(slideInterval, elementsId) {
        super();
        this.container = document.querySelector(elementsId.containerId);
        this.backgroundImageId = elementsId.backgroundImageId;
        this.titleImageId = elementsId.titleImageId;
        this.slideDescriptionId = elementsId.slideDescriptionId;
        this.carouselId = elementsId.carouselId;
        this.currentIndex = 0;
        this.carouselItems = [];
        this.observers = [];
        this.isCarouselPlaying = false;
        this.slideInterval = slideInterval;
        this.intervalId = null;
    }

    /**
     * Checks whether the carousel is playing or not
     * @return {Boolean} isCarouselPlaying -  The boolean representing the current state of the carousel
     */
    isPlaying() {
        return this.isCarouselPlaying;
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
            const fetcher = new PeacockContentFetcher(apiUrl, headers);

            const { imagePairs, contentInfo } = await fetcher.fetchContent();

            ImageLoader.preloadImages(imagePairs)
                .then(() => {
                    console.log("All images preloaded");

                    this.carouselItems = imagePairs.map((pair, index) => ({
                        imagePair: pair,
                        pairInformation: contentInfo[index]
                    }));

                    this.startCarousel();
                });

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

        const carouselElement = this.container.querySelector(this.carouselId);
        carouselElement.classList.add("slide-in");

        this.showNextSlide();

        this.isCarouselPlaying = true;

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
            if (!this.isCarouselPlaying) {
                // Stop the interval
                clearInterval(this.intervalId);
            } else {
                this.showNextSlide();
            }
        }, this.slideInterval);
    }

    /**
     * Stops the carousel rotation.
     * This method should be called to halt the carousel before starting it again or when the carousel is no longer needed.
     */
    stopCarousel() {
        this.isCarouselPlaying = false;
        this.notifyObserver("stop");
    }

    /**
     * Advances the carousel to the next slide, updating the display accordingly.
     * If there are no images in the carousel, this method does nothing.
     */
    showNextSlide() {
        const carrouselImagesCount = this.carouselItems.length;
        if (carrouselImagesCount === 0) return;

        this.notifyObserver("next");

        this.currentIndex = (this.currentIndex + 1) % this.carouselItems.length;
    }

}

export default CarouselDisplay;
