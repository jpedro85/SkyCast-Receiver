/**
 * Abstract base class designed to define a template for content fetchers. This class provides the basic framework
 * that must be implemented by all derived content fetching classes. It establishes a contract that derived classes
 * must fulfill, ensuring they implement the necessary methods for fetching and processing content.
 *
 * The class is not meant to be instantiated directly but to be extended by more specific content fetcher implementations.
 *
 *@example <caption>Example of implementation:</caption>
 * class SpecificContentFetcher extends AbstractContentFetcher {
 *     async fetchContent() {
 *         // Implementation for fetching content specific to an API
 *         // Example: Fetch data from this.apiUrl using this.headers
 *     }
 *
 *     extractImagePairs(data) {
 *         // Process and extract image pairs from fetched data
 *     }
 *
 *     extractInformation(data) {
 *         // Extract additional information from data
 *     }
 * }
 *
 */
class AbstractContentFetcher {

    /**
     * Constructs an AbstractContentFetcher instance, initializing with API URL and headers.
     * Throws an error if an attempt is made to instantiate this class directly.
     * @param {string} url - The API URL to fetch data from.
     * @param {Object} headers - The headers to use for the API requests.
     */
    constructor(url, headers) {
        if (new.target === AbstractContentFetcher) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
        this.apiUrl = url;
        this.headers = headers;
    }

    /**
     * A placeholder for fetching content from the API. This method must be overridden in derived classes.
     * @throws {Error} Always thrown to enforce implementation in derived classes.
     */
    async fetchContent() {
        throw new Error("Must override fetchContent in derived class");
    }

    /**
     * A placeholder for extracting image pairs from the fetched content. This method must be overridden in derived classes.
     * @param {Object} data - The raw data from which image pairs need to be extracted.
     * @throws {Error} Always thrown to enforce implementation in derived classes.
     */
    extractImagePairs(data) {
        throw new Error("Must override extractImagePairs in derived class");
    }

    /**
     * A placeholder for extracting additional information from the fetched content. This method must be overridden in derived classes.
     * @param {Object} data - The raw data from which information needs to be extracted.
     * @throws {Error} Always thrown to enforce implementation in derived classes.
     */
    extractInformation(data) {
        throw new Error("Must override extractInformation in derived class");
    }
}

export default AbstractContentFetcher;
