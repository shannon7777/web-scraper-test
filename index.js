const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5050;
const axios = require("axios");
const { load } = require("cheerio");

dotenv.config();
app.use(cors());

app.get("/test/", async (req, res) => {
  const amazonURL = `https://www.amazon.com/s?k=RX+6800&rh=n%3A284822&ref=nb_sb_noss`
  const baseURL = `https://www.amazon.com`;
  const gpuList = [];
  
  await axios
    .get(amazonURL)
    .then((response) => {
      const html = response.data;
      const $ = load(html);
      $('a:contains(ASUS TUF)', html).each(function () {
        const title = $(this).text();
        const url = baseURL + $(this).attr("href");
        // const price = $(this).
        gpuList.push({ title, url });
      });
      res.json(gpuList);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => console.log(`This server is running on PORT:${PORT}`));
