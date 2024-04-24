import ItemType from "../utils/enums/ItemTypes.js";
import DebuggerConsole from "../../utils/Debugger.js";

/**
 * The ContentFetcher class is responsible for fetching both image data and additional information
 * from a specified API for use in a content display, such as an image carousel or content list.
 *
 * @example
 * // How to use the ContentFetcher class
 * const contentApiUrl = 'https://api.example.com/content';
 * const headers = { Authorization: 'Bearer YOUR_API_KEY' };
 *
 * // Creating an instance of ContentFetcher
 * const contentFetcher = new ContentFetcher(contentApiUrl, headers);
 *
 * // Fetching content and handling it
 * contentFetcher.fetchContent().then(({ imagePairs, contentInfo }) => {
 *     console.log('Image Pairs:', imagePairs);
 *     console.log('Content Information:', contentInfo);
 * }).catch(error => {
 *     console.error('Failed to fetch content:', error);
 * });
 *
 * This class makes it easier to manage content fetching by combining image and information retrieval,
 * reducing the complexity and number of requests made to the backend.
 */
class PeacockContentFetcher {
    /**
    * Constructs a ContentFetcher instance with a specified API URL and request headers.
    * @param {string} url - The URL of the API from which to fetch content.
    * @param {Object} headers - The headers object to include with the API request, used for authorization or content type specification.
    */
    constructor(url, headers) {
        this.apiUrl = url;
        this.headers = headers;
        this.debuggerConsole = new DebuggerConsole();
    }

    /**
     * Fetches content from the configured API URL using the provided headers. After fetching, it processes
     * the data to extract both image pairs for the carousel and additional content information.
     * @async
     * @return {Promise<{imagePairs: Object[], contentInfo: Object[]}>} A promise that resolves to an object containing arrays of image pairs and content information.
     */
    async fetchContent() {
        try {
            const response = await fetch(this.apiUrl, { method: "GET", headers: this.headers });
            const data = await response.json();
            return {
                imagePairs: this.extractImagePairs(data),
                contentInfo: this.extractInformation(data),
            }
        }
        catch (error) {
            this.debuggerConsole.sendLog("error", "Failed to fetch content:" + error);
            throw error;
        }
    }

    /**
     * Extracts pairs of landscape and titleLogo images from the fetched API data. This method processes the raw data
     * to organize image URLs into a structured format suitable for content displays.
     * @param {Object} data - The raw data retrieved from the API.
     * @return {Object[]} An array of objects, each object containing `landscape` and `titleLogo` properties with their respective image URLs.
     */
    extractImagePairs(data) {
        const items = data.data.rail.items;
        return items.map((item) => {
            const landscapeImage = item.images.find((image) => image.type === "landscape")?.url + "&format=webp";
            const titleLogoImage = item.images.find((image) => image.type === "titleLogo")?.url + "&format=webp";

            return { landscape: landscapeImage, titleLogo: titleLogoImage };
        }).filter((pair) => pair.landscape && pair.titleLogo);
    }

    /**
     * Extracts additional information about the content from the fetched API data, such as ratings, year of release, etc.
     * This method enhances the content display with relevant information beyond just images.
     * @param {Object} data - The raw data retrieved from the API.
     * @return {Object[]} An array of objects, each containing detailed information about the content, structured as needed.
     */
    extractInformation(data) {
        const items = data.data.rail.items;

        return items.map(item => ({

            type: item.type,
            itemRating: item.fanCriticRatings?.find(source => source.fanScore)?.fanScore,

            ...(item.type === ItemType.MOVIE ? {
                year: item.year,
                duration: item.runtime,
            } : {
                seasonCount: item.seasonCount
            }),

            ageRating: item.ageRating.display,
            videoFormats: Object.keys(item.formats),
        }));
    }
}

export default PeacockContentFetcher;
