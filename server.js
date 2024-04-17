const express = require("express");
const Parser = require("./Parser/ConfigParser.js");
const app = express();

app.use(express.static('public'));

app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));

const PORT = 8000;

const parser = new Parser();

(async () => {
    try {
        const config = await parser.readConfig();
        await parser.writeMain(config);
        console.log('Main.js written successfully.');
    } catch (error) {
        console.error('Error:', error.message);
    }
})();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
