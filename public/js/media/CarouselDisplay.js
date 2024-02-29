import ImageLoader from "./ImageLoader.js";
import ImageFetcher from "./ImageFetcher.js";

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
class CarouselDisplay {
    /**
     * Initializes a new instance of the CarouselDisplay class.
     * @param {string} containerId - The ID of the DOM element that will contain the carousel.
     * @param {number} imageInterval - The amount of time in milliseconds you want each image to have of screen time before changing
     */
    constructor(containerId, imageInterval) {
        this.container = document.querySelector(containerId);
        this.backgroundImageElement = this.container.querySelector("#background-img");
        this.titleImageElement = this.container.querySelector("#title-img");
        // this.apiUrl = apiUrl;
        // this.headers = headers;
        this.currentIndex = 0;
        this.imagePairs = [];
        this.stopCarousel = false;
        this.imageInterval = imageInterval;
    }

    /**
     * Sets up the carousel by fetching image pairs from the provided API URL and preloading them.
     * @async
     * @param {string} apiUrl - The API URL from which to fetch images.
     * @param {Object} headers - The headers to be sent with the API request.
     * @returns {Promise<void>} A promise that resolves once the images have been fetched and preloaded.
     */
    async setupCarousel(apiUrl, headers) {
        const fetcher = new ImageFetcher(apiUrl, headers);
        const imagePairs = await fetcher.fetchImages();
        const urls = imagePairs.flatMap((pair) => [pair.landscape, pair.titleLogo]);

        await ImageLoader.preloadImages(urls);
        console.log("All images preloaded");

        this.startCarousel(imagePairs);
    }

    /**
     * Starts the carousel rotation by displaying the first pair of images and setting an interval for subsequent images.
     * @param {Array<Object>} imagePairs - An array of image pair objects, each containing `landscape` and `titleLogo` URLs.
     */
    startCarousel(imagePairs) {
        this.imagePairs = imagePairs;
        this.container.classList.toggle("hidden");

        // Show the first image pair immediately
        this.showNextImagePair();
        if (!this.stopCarousel) {
            setInterval(this.showNextImagePair, this.imageInterval);
        }
    }

    /**
     * Displays the next pair of images in the carousel, cycling through the `imagePairs` array.
     */
    showNextImagePair() {
        const { landscape, titleLogo } = this.imagePairs[this.currentIndex];
        this.backgroundImageElement.src = landscape;
        this.titleImageElement.src = titleLogo;
        this.currentIndex = (this.currentIndex + 1) % this.imagePairs.length; // Loop through image pairs
    }
}

export default CarouselDisplay;
