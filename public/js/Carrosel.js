// API details
const apiUrl = "https://mobile.clients.peacocktv.com/bff/sections/v1?segment=all_premium_users&node_id=13dba516-9722-11ea-bbcc-234acf5d5a4e";
const headers = {
    Host: "mobile.clients.peacocktv.com",
    "X-SkyOTT-Provider": "NBCU",
    "X-SkyOTT-Proposition": "NBCUOTT",
    "X-SkyOTT-Territory": "US",
    "X-SkyOTT-Language": "en",
    "X-SkyOTT-Device": "MOBILE",
    "X-SkyOTT-Platform": "IOS",
};

// Start fetching and processing images
fetchAndProcessImages();

// Fetch and process images from the API
function fetchAndProcessImages() {
    fetch(apiUrl, { method: "GET", headers: headers })
        .then(response => response.json())
        .then(data => {
            const imagePairs = extractImagePairs(data);
            return preloadImagePairs(imagePairs);
        })
        .then(preloadedImagePairs => {
            console.log("All images preloaded");
            startCarousel(preloadedImagePairs); // Start the carousel with preloaded images
        })
        .catch(error => console.error("Error fetching or preloading images:", error));
}

// Extract pairs of landscape and titleLogo images from API data
function extractImagePairs(data) {
    const items = data.data.rail.items;
    return items.map(item => {
        const landscapeImage = item.images.find(image => image.type === "landscape")?.url;
        const titleLogoImage = item.images.find(image => image.type === "titleLogo")?.url;
        return { landscape: landscapeImage, titleLogo: titleLogoImage };
    }).filter(pair => pair.landscape && pair.titleLogo); // Ensure both images exist
}

// Preload image pairs and return a promise that resolves when all are loaded
function preloadImagePairs(imagePairs) {
    const preloadPromises = imagePairs.map(({ landscape, titleLogo }) => {
        return Promise.all([preloadImage(landscape), preloadImage(titleLogo)]);
    });
    return Promise.all(preloadPromises).then(() => imagePairs);
}

// Preload a single image
function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = resolve;
        img.onerror = reject;
    });
}

// Initialize and start the carousel with preloaded image pairs
function startCarousel(imagePairs) {
    document.querySelector("#container").classList.toggle("hidden");
    let currentIndex = 0;
    const backgroundImageElement = document.getElementById("background-img");
    const titleImageElement = document.getElementById("title-img");

    function showNextImagePair() {
        const { landscape, titleLogo } = imagePairs[currentIndex];
        backgroundImageElement.src = landscape;
        titleImageElement.src = titleLogo;
        currentIndex = (currentIndex + 1) % imagePairs.length; // Loop through image pairs
    }

    setInterval(showNextImagePair, 5000);
    showNextImagePair(); // Show the first image pair immediately
}
