/**
 * Provides functionality to preload images from URLs. This can be useful for ensuring that images are cached
 * and ready to be displayed in the browser without delay, such as in an image carousel or gallery.
 */
class ImageLoader {
    /**
     * Preloads an array of image URLs. This method is useful for loading multiple images concurrently.
     * @param {string[]} urls - An array of image URLs to preload.
     * @return {Promise<void>} A promise that resolves when all images are loaded successfully. The promise
     * will reject if any image fails to load.
     */
    static async preloadImages(imagePairs) {
        const urls = imagePairs.flatMap((pair) => [pair.landscape, pair.titleLogo]);
        return Promise.all(urls.map((url) => this.preloadImage(url)));
    }

    /**
     * Preloads a single image. This method creates an HTMLImageElement and sets its source to the provided URL.
     * The method returns a promise that resolves when the image is loaded or rejects if an error occurs.
     * @param {string} url - The URL of the image to preload.
     * @return {Promise<HTMLImageElement>} A promise that resolves with the HTMLImageElement once the image is loaded.
     * The promise rejects if the image fails to load.
     */
    static preloadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = resolve;
            img.onerror = reject;
        });
    }
}

export default ImageLoader;
