// Abstract base class for content fetching
class AbstractContentFetcher {
    constructor(url, headers) {
        if (new.target === AbstractContentFetcher) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
        this.apiUrl = url;
        this.headers = headers;
    }

    async fetchContent() {
        throw new Error("Must override fetchContent in derived class");
    }

    extractImagePairs(data) {
        throw new Error("Must override extractImagePairs in derived class");
    }

    extractInformation(data) {
        throw new Error("Must override extractInformation in derived class");
    }
}

export default AbstractContentFetcher;
