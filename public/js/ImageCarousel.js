/**
 * Represents an image carousel that fetches and displays a series of images.
 */
class ImageCarousel {
    /**
     * Creates an instance of the ImageCarousel.
     * @param {string} apiUrl - The API URL from which to fetch images.
     * @param {Object} headers - The headers to be sent with the API request.
     */
    constructor(apiUrl, headers) {
        this.apiUrl = apiUrl;
        this.headers = headers;
        this.imagePairs = [];
    }

    /**
     * Initializes the image carousel by fetching and processing images.
     */
    init() {
        this.fetchAndProcessImages();
    }

    /**
     * Fetches images from the API and processes them for the carousel.
     * @async
     */
    async fetchAndProcessImages() {
        try {
            const response = await fetch(this.apiUrl, { method: "GET", headers: this.headers });
            const data = await response.json();
            this.imagePairs = this.extractImagePairs(data);
            await this.preloadImagePairs();
            console.log("All images preloaded");
            this.startCarousel(); // Start the carousel with preloaded images
        } catch (error) {
            console.error("Error fetching or preloading images:", error);
        }
    }

    /**
     * Extracts pairs of landscape and titleLogo images from the API data.
     * @param {Object} data - The data retrieved from the API.
     * @return {Object[]} An array of objects containing the URLs for landscape and titleLogo images.
     */
    extractImagePairs(data) {
        const items = data.data.rail.items;
        return items
            .map((item) => {
                const landscapeImage = item.images.find((image) => image.type === "landscape")?.url;
                const titleLogoImage = item.images.find((image) => image.type === "titleLogo")?.url;
                return { landscape: landscapeImage, titleLogo: titleLogoImage };
            })
            .filter((pair) => pair.landscape && pair.titleLogo); // Ensure both images exist
    }

    /**
     * Preloads the image pairs to avoid loading delays during the carousel.
     * @async
     */
    async preloadImagePairs() {
        const preloadPromises = this.imagePairs.map(({ landscape, titleLogo }) => {
            return Promise.all([this.preloadImage(landscape), this.preloadImage(titleLogo)]);
        });
        await Promise.all(preloadPromises);
    }

    /**
     * Preloads a single image.
     * @param {string} url - The URL of the image to preload.
     * @return {Promise} A promise that resolves when the image is loaded.
     */
    preloadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = resolve;
            img.onerror = reject;
        });
    }

    /**
     * Initializes and starts the carousel with preloaded image pairs.
     */
    startCarousel() {
        document.querySelector("#container").classList.toggle("hidden");
        let currentIndex = 0;
        const backgroundImageElement = document.getElementById("background-img");
        const titleImageElement = document.getElementById("title-img");

        const showNextImagePair = () => {
            const { landscape, titleLogo } = this.imagePairs[currentIndex];
            backgroundImageElement.src = landscape;
            titleImageElement.src = titleLogo;
            currentIndex = (currentIndex + 1) % this.imagePairs.length; // Loop through image pairs
        };

        setInterval(showNextImagePair, 5000);
        showNextImagePair(); // Show the first image pair immediately
    }
}

export default ImageCarousel;