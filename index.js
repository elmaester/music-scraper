const fs = require("fs");
const rockSongs = require("./rock");
const url = "https://ru.hitmotop.com/";
const puppeteer = require("puppeteer");
const selectors = {
  search: "input.form-control",
  downloadButton: ".track__download-btn",
};

const main = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const [page] = await browser.pages();
    await page.setViewport({
      width: 1680,
      height: 1050,
    });
    await page._client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: "./rock-ballads",
    });
    await page.goto(url);
    await page.waitForSelector(selectors.search);
    for (song of rockSongs) {
      await page.$eval(selectors.search, (e) => (e.value = ""));
      await page.focus(selectors.search);
      await page.keyboard.type(song);
      await page.keyboard.press("Enter");
      await page.waitForTimeout(500);
      await page.waitForSelector(selectors.downloadButton);
      await page.click(selectors.downloadButton);
      await page.waitForTimeout(3000);
    }
  } catch (e) {
    console.error(e);
  }
};

main();
