const { Builder, By, Key, until } = require('selenium-webdriver');
const path = require('chromedriver').path;
const chrome = require('selenium-webdriver/chrome');
let service = new chrome.ServiceBuilder(path).build();
chrome.setDefaultService(service);

class SeleniumInfra {
    constructor() {
        this.driver = new Builder().forBrowser("chrome").build();
    }

    async getURL(URL) {
        try {
            await this.driver.manage().window().maximize();
            await this.driver.get(URL);
            await this.driver.manage().setTimeouts({ pageLoad: 3000 });
            await this.driver.sleep(1000);
        } catch (error) {
            return Promise.reject(new Error(`SeleniumInfra: Failed to GET the URL: ${URL}.`));
        }
    }

    async close() {
        try {
            await this.driver.sleep(1000);
            await this.driver.quit();
        } catch (error) {
            return Promise.reject(new Error(`SeleniumInfra: Failed to ClOSE the Driver.`));
        }
    }

    async clickElement(locator = "", locatorType = "id", element = null, fromElement = null) {
        if (!element) {
            element = await this.findElementBy(locator, locatorType, fromElement);
        }

        try {
            await this.driver.sleep(1000);
            await element.click();
            await this.driver.sleep(1000);
        } catch (error) {
            return Promise.reject(new Error(`SeleniumInfra: Could not CLICK on the element with:(${locator}), locatorType (${locatorType}).`));
        }
    }

    async write(data = "", locator = "", locatorType = "id", element = null, fromElement = null) {
        if (!element) {
            element = await this.findElementBy(locator, locatorType, fromElement);
        }

        try {
            await element.sendKeys(data);
        } catch (error) {
            return Promise.reject(new Error(`SeleniumInfra: Could not WRITE to the element with:(${locator}), locatorType (${locatorType}).`));
        }
    }

    async getTextFromElement(locator = "", locatorType = "id", element = null, fromElement = null) {
        if (!element) {
            element = await this.findElementBy(locator, locatorType, fromElement);
        }

        try {
            return await element.getText();;
        } catch (error) {
            return Promise.reject(new Error(`SeleniumInfra: Could not GET TEXT from the element with:(${locator}), locatorType (${locatorType}).`));
        }
    }

    async clearElementField(locator = "", locatorType = "id", element = null, fromElement = null) {
        if (!element) {
            element = await this.findElementBy(locator, locatorType, fromElement);
        }

        try {
            await element.clear();
        } catch (error) {
            return Promise.reject(new Error(`SeleniumInfra: Could not CLEAR the element with:(${locator}), locatorType (${locatorType}).`));
        }
    }

    async isElementExists(locator = "", locatorType = "id", fromElement = null) {
        try {
            await this.findElementBy(locator, locatorType, fromElement);
            return true;
        } catch (error) {
            return false;
        }
    }

    async findElementBy(locator = "", locatorType = "id", fromElement = null) {
        try {
            if (!fromElement) {
                fromElement = this.driver;
            }
            return await fromElement.findElement(By[locatorType](locator));
        } catch (error) {
            return Promise.reject(new Error(`SeleniumInfra: Element NOT FOUND with: locator (${locator}), locatorType (${locatorType}).`));
        }
    }

    async findElementListBy(locator = "", locatorType = "id", fromElement = null) {
        try {
            if (!fromElement) {
                fromElement = this.driver;
            }
            return await fromElement.findElements(By[locatorType](locator));
        } catch (error) {
            return Promise.reject(new Error(`SeleniumInfra: Element List NOT FOUND with: locator (${locator}), locatorType (${locatorType}).`));
        }
    }


    async URLvalidation(pageName) {
        try {
            const isValid = await this.driver.wait(until.urlContains(pageName), 8000);
            return isValid;
        } catch (error) {
            return false;
        }
    }

    async getCurrentURL() {
        try {
            return await this.driver.getCurrentUrl();
        } catch (error) {
            return Promise.reject(new Error(`SeleniumInfra: Failed to GET URL.`));
        }
    }

    async isUrlMatch(pageName = "") {
        try {
            const currentURL = await this.getCurrentURL();
            return currentURL.search(pageName);
        } catch (error) {
            return false;
        }
    }
}

module.exports = SeleniumInfra;