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

const amazonAmdGpu = `https://www.amazon.com/s?k=RX+6800&rh=n%3A284822&ref=nb_sb_noss`;
const amazonRtxGpu = `https://www.amazon.com/s?k=rtx+3070&rh=n%3A284822&ref=nb_sb_noss`;

app.get("/test/", (req, res) => {
  const gpuList = [];

  axios
    .get(amazonAmdGpu)
    .then((response) => {
      const html = response.data;
      const $ = load(html);
      $('a:contains("6800")', html).each(function () {
        const title = $(this).text();
        const link = baseURL + $(this).attr("href");
        // const price = title.find(`span.a-price-whole`).text();
        gpuList.push({ title });
      });
      res.json(gpuList);
    })
    .catch((err) => console.log(err));
});

app.get("/gpuList/", async (req, res) => {
  const gpuList = [];
  try {
    const response = await fetch(amazonRtxGpu);
    const html = await response.text();
    const $ = load(html);
    $(
      "div.sg-col.sg-col-4-of-12.sg-col-8-of-16.sg-col-12-of-20.s-list-col-right"
    ).map((index, el) => {
      const gpu = $(el);
      const title = gpu
        .find("span.a-size-medium.a-color-base.a-text-normal")
        .text();

      const gpuPrice = gpu.find("span.a-price > span.a-offscreen").text();
      const price = gpuPrice ? gpuPrice : "no price listed";
      const gpuLink = gpu
        .find("a.a-link-normal.s-underline-text.s-underline-link-text")
        .attr("href");
      const link = `https://www.amazon.com${gpuLink}`;

      const gpuRating = gpu
        .find("div.a-section.a-spacing-none.a-spacing-top-micro > div")
        .children("span")
        .attr("aria-label");
      const rating = gpuRating ? gpuRating : "no rating for this product";

      const reviews = gpu
        .find(
          "div.a-section.a-spacing-none.a-spacing-top-micro > div.a-row.a-size-small > span"
        )
        .last()
        .attr("aria-label");
      gpuList.push({ title, price, link, rating, reviews });
    });

    res.status(200).json({ gpuList });
  } catch (err) {
    res.json({ message: "could not scrape", error: err.message });
  }
});

app.listen(PORT, () => console.log(`This server is running on PORT:${PORT}`));
