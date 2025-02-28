const express = require("express");
const dotenv=require('dotenv');
const cors = require("cors");

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json()); 
app.get("/", (req, res) => {
    return res.json("from backend");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});