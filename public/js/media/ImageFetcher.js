/**
 * Responsible for fetching image data from a specified API and processing it for use in an image carousel. 
 * This class handles the network requests to retrieve image data and extracts specific pairs of images 
 * for display, such as landscape and title logo images.
 */
class ImageFetcher {
    /**
     * Constructs an ImageFetcher instance with a specified API URL and request headers.
     * @param {string} url - The URL of the API from which to fetch images.
     * @param {Object} headers - The headers object to include with the API request, used for authorization or content type specification.
     */
    constructor(url, headers) {
        this.apiUrl = url;
        this.headers = headers;
    }

    /**
     * Fetches images from the configured API URL using the provided headers. After fetching, it processes
     * the data to extract image pairs for the carousel.
     * @async
     * @return {Promise<Object[]>} A promise that resolves to an array of objects, each containing URLs for landscape and titleLogo images.
     */
    async fetchImages() {
        const response = await fetch(this.apiUrl, { method: "GET", headers: this.headers });
        const data = await response.json();
        return this.extractImagePairs(data);
    }

     /**
     * Extracts pairs of landscape and titleLogo images from the fetched API data. This method processes the raw data
     * to find and organize image URLs into a structured format suitable for the carousel.
     * @param {Object} data - The raw data retrieved from the API.
     * @return {Object[]} An array of objects, each object containing `landscape` and `titleLogo` properties with their respective image URLs.
     */
    extractImagePairs(data) {
        // Extracting the items from the response
        const items = data.data.rail.items;
        return items
            .map((item) => {
                const landscapeImage = item.images.find((image) => image.type === "landscape")?.url;
                const titleLogoImage = item.images.find((image) => image.type === "titleLogo")?.url;
                return { landscape: landscapeImage, titleLogo: titleLogoImage };
            })
            .filter((pair) => pair.landscape && pair.titleLogo); // Ensure both images exist
    }
}

export default ImageFetcher;
