class MediaProviderWeb {
    constructor(url) {
        this.mediaURL = url;
    }

    async fetchData() {
        try {
            const response = await fetch(this.mediaURL, { method: "GET" });
            const parsedResponse = await response.json();
            return parsedResponse;
        } catch (error) {
            throw new Error("Invalid Object was retrieved or Something happened when retrieving it");
        }
    }
}

export default MediaProviderWeb;
