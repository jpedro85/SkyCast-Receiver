import express from "express";
const app = express();

app.use(express.static('public'));

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
