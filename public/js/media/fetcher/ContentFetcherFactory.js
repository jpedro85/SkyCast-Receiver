import PeacockContentFetcher from "./PeacockContentFetcher.js";

/**
 * A factory class for creating content fetcher instances based on different API types.
 * This class abstracts the creation logic for various content fetchers, allowing for easy extension and maintenance.
 * It currently supports the Peacock API, but other APIs can be added as needed.
 *
 *
 * @example <caption>Usage example:</caption>
 * // Create a content fetcher for the Peacock API
 * const peacockFetcher = ContentFetcherFactory.createContentFetcher('Peacock', 'https://api.peacocktv.com', {
 *   Authorization: 'Bearer your_access_token'
 * });
 */
class ContentFetcherFactory {

    /**
     * Creates a content fetcher instance based on the specified API type.
     * @param {string} apiType - The type of API for which the content fetcher is to be created.
     * @param {string} url - The base URL for the API endpoint.
     * @param {Object} headers - The headers to be used for requests made by the content fetcher.
     * @returns {Object} An instance of a content fetcher specific to the provided API type.
     * @throws {Error} Throws an error if the API type is not supported.
     */
    static createContentFetcher(apiType, url, headers) {
        switch (apiType) {
            case 'Peacock':
                return new PeacockContentFetcher(url, headers);

            // NOTE: Add other APIs as cases here
            default:
                throw new Error("Unsupported API type");
        }
    }
}

export default ContentFetcherFactory;
