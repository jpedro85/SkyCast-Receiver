import PeacockContentFetcher from "./PeacockContentFetcher.js";

class ContentFetcherFactory {
    static createContentFetcher(apiType, url, headers) {
        switch(apiType) {
            case 'Peacock':
                return new PeacockContentFetcher(url, headers);
            // NOTE: Add other APIs as cases here
            default:
                throw new Error("Unsupported API type");
        }
    }
}

export default ContentFetcherFactory;
