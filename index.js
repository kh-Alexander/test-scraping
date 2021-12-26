// Выборка данных с книги
// Запуск кода с консоли - node index

// const catalog = require("./wildberries/urls.js"); // для запуска с не папки wildberries
const catalog = require("./urls.js"); // для запуска с папки wildberries
const fs = require("fs");
const puppeteer = require("puppeteer");

const arrBook = [];
// const pages = [];
for (i in catalog) {
  const x = catalog[i].split("=")[1]; //количество страниц
  const y = catalog[i].split("=")[0]; //основа "https://www...
  for (let j = 0; j < x; j++) {
    z = `${y}${j + 1}`;
    arrBook.push(z);

    // console.log(arrBook);

    async function start() {
      // const browser = await puppeteer.launch();
      const browser = await puppeteer.launch({
        headless: false,
        slowMo: 100,
        devtools: true,
      });
      const page = await browser.newPage();
      await page.setViewport({
        width: 1400,
        height: 900,
      });

      arrBook.forEach(async (el) => {
        await page.goto(el, { waitUntil: "domcontentloaded" });

        await page.waitForSelector("div.product-card__img-wrap > img");

        const items = await page.evaluate(async () => {
          let resl = [];

          let cont;
          try {
            cont = await document.querySelectorAll("div.product-card__wrapper");
          } catch (e) {
            // console.log("cont--", e);
            cont = "";
          }

          cont.forEach((item) => {
            let title;
            try {
              title = item.querySelector(
                "div.product-card__brand-name > span"
              ).innerText;
              // console.log(title);
            } catch (e) {
              // console.log("title--", e);
              title = "";
            }

            let brand_name;
            try {
              brand_name = item.querySelector(
                "div.product-card__brand-name > strong"
              ).innerText;
            } catch (e) {
              brand_name = "";
            }
            // console.log(" brand_name--", brand_name);

            let price;
            try {
              price = item.querySelector(
                "div.product-card__price.j-cataloger-price > span > ins"
              ).innerText;
            } catch (e) {
              price = "";
            }

            let img1;
            try {
              img1 = item
                .querySelector("div.product-card__img-wrap > img")
                .getAttribute("src");
            } catch (e) {
              img1 = "";
            }
            let img = `https:${img1}`;

            console.log("img", img);

            // console.log(title, price, have, descr, img);

            resl.push({
              brand_name,
              title,
              price,
              // descr,
              img,
            });

            // console.log(resl);
          });
          return resl;
        });
        fs.writeFile("bookView.json", JSON.stringify(items), function (err) {
          if (err) throw err;
          console.log("Saved book.json file");
        });
      });
      await page.waitForTimeout(5000);
      await browser.close();
    }

    // async function all_start() {
    //   start();
    // }

    // all_start();

    start();
  }
}
