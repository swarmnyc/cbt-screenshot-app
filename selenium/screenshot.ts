import { Builder, By, until, WebDriver, IWebDriverCookie, IWebDriverOptionsCookie, Key } from "selenium-webdriver"
import fs from "fs"
import { Driver } from "selenium-webdriver/chrome"
import dotenv from "dotenv"
import { Page } from "../src/types"
import * as rp from "request-promise"

dotenv.config()

var driver: WebDriver
var pages: Page[] = require("./pages.json")
var queue: Page[]

var email = process.env["email"]
var password = process.env["password"]
var apiKey = process.env["api_key"]
var retake = process.env["retake"] == "1" || process.env["retake"] == "true"

async function main(): Promise<void> {
  driver = await new Builder().forBrowser("chrome").build()

  try {
    await login()

    await takeScreenshots()
  } finally {
    await driver.quit()
  }
}

async function login() {
  var cookies: IWebDriverOptionsCookie[]
  if (fs.existsSync("./cookies.json")) {
    cookies = require("./cookies.json")

    await driver.get("https://app.crossbrowsertesting.com/login")

    await Promise.all(cookies.map(c => driver.manage().addCookie(c)))

    await driver.get("https://app.crossbrowsertesting.com/livetests")
    await driver.wait(until.urlContains("livetests"), 1000)
  } else {
    await driver.get("https://app.crossbrowsertesting.com/login")
    await driver.findElement(By.id("inputEmail")).sendKeys(email)
    await driver.findElement(By.id("inputPassword")).sendKeys(password)
    await driver.findElement(By.id("login-btn")).click()
    await driver.wait(until.urlContains("livetests"), 1000)

    cookies = await driver.manage().getCookies()
    fs.writeFileSync("./cookies.json", JSON.stringify(cookies))
  }
}

function takeScreenshots(): Promise<any> {
  if (retake) {
    queue = pages.map(p => p)
  } else {
    queue = pages.filter(p => p.resultId == null || p.resultId == 0)
  }

  if (queue.length > 0) {
    return takeScreenshotInQueue()
  }

  return Promise.resolve()
}

async function takeScreenshotInQueue(): Promise<any> {
  var page = queue[0]

  do {
    console.log("Take screenshot of", page.url)
    await driver.get("https://app.crossbrowsertesting.com/screenshots/run")

    await driver.sleep(2000)

    await driver.findElement(By.id("address")).sendKeys(Key.BACK_SPACE, page.url, Key.ENTER, Key.ENTER)

    await driver.sleep(2000)
    var url = await driver.getCurrentUrl()
    var match = /^https:\/\/app\.crossbrowsertesting\.com\/screenshots\/(\d+)(\/|\?)?/.exec(url)
    if (match) {
      page.resultId = parseInt(match[1])
      await fetchPageInfo(page)
      fs.writeFileSync("./pages.json", JSON.stringify(pages, null, 2))
      queue.splice(0, 1)
    }

    await driver.sleep(60000)
  } while (page.resultId == 0)

  if (queue.length > 0) {
    return takeScreenshotInQueue()
  }
}

async function fetchPageInfo(page: Page): Promise<any> {
  var options: rp.Options = {
    url: `https://crossbrowsertesting.com/api/v3/screenshots/${page.resultId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + Buffer.from(email + ":" + apiKey).toString("base64")
    },
    json: true
  }

  return rp.get(options).then(async result => {
    var resultVersion = result.versions[result.version_count - 1]

    page.resultVersionId = resultVersion.version_id
    page.resultUrl = resultVersion.show_results_public_url
  })
}

main()
