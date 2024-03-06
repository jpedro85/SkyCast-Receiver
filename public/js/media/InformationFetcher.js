import ItemType from "../utils/enums/ItemTypes.js";

class InformationFetcher {

    constructor(url, headers) {
        this.apiUrl = url;
        this.headers = headers;
    }

    async fetchInformation() {
        const response = await fetch(this.apiUrl, { method: "GET", headers: this.headers });
        const data = await response.json();
        return this.extractInformation(data);
    }

    extractInformation(data) {
        // Extracting the items from the response
        const items = data.data.rail.items;
        return items
            .map((item) => {
                let itemInformation = {};

                const itemRatingObject = item.fanCriticRatings?.find((source) => (Object.keys(source).includes("fanScore")));
                const itemRating = itemRatingObject?.fanScore;
                itemInformation.itemRating = itemRating;

                const itemType = item.type;
                if (itemType == ItemType.MOVIE) {
                    const yearReleased = item.year;
                    itemInformation.year = yearReleased;

                    // INFO: Can be either in minutes or use the runtime to display in the format hh:mm of the duration
                    // const itemDuration = item.runtime;
                    const itemDuration = item.duration.durationMinutes;
                    itemInformation.duration = itemDuration;

                } else {
                    const seasonCount = item.seasonCount;
                    itemInformation.seasonCount = seasonCount;
                }

                const ageRating = item.ageRating.display;
                itemInformation.ageRating = ageRating;
                const videoFormats = Object.keys(item.formats);
                itemInformation.videoFormats = videoFormats;

                return itemInformation;
            })
    }
}

export default InformationFetcher;
