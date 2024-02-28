class ImageCarousel {
    constructor(apiUrl, headers) {
        this.apiUrl = apiUrl;
        this.headers = headers;
        this.imagePairs = [];
    }

    // Start the process
    init() {
        this.fetchAndProcessImages();
    }

    // Fetch and process images from the API
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

    // Extract pairs of landscape and titleLogo images from API data
    extractImagePairs(data) {
        const items = data.data.rail.items;
        return items.map(item => {
            const landscapeImage = item.images.find(image => image.type === "landscape")?.url;
            const titleLogoImage = item.images.find(image => image.type === "titleLogo")?.url;
            return { landscape: landscapeImage, titleLogo: titleLogoImage };
        }).filter(pair => pair.landscape && pair.titleLogo); // Ensure both images exist
    }

    // Preload image pairs
    async preloadImagePairs() {
        const preloadPromises = this.imagePairs.map(({ landscape, titleLogo }) => {
            return Promise.all([this.preloadImage(landscape), this.preloadImage(titleLogo)]);
        });
        await Promise.all(preloadPromises);
    }

    // Preload a single image
    preloadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = resolve;
            img.onerror = reject;
        });
    }

    // Initialize and start the carousel with preloaded image pairs
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