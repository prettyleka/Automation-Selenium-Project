const logger = require("../logger/logger");

const BasePage = require("../BasePage/BasePage");
const HomePage = require("../Pages/HomePage");

class HomePageTest {
    constructor() {
        this.testSelenium = new BasePage().selenium
        this.homePage = new HomePage(this.testSelenium)
    }

    async homeTest() {
        await this.navBarTest("Home");
        await this.navBarTest("Clients");
        await this.navBarTest("Actions");
        await this.navBarTest("Analytics");
        await this.testSelenium.close();
    }

    async navBarTest(targetNavTab){
        logger.log("info","HomeTest - navBarTest(%s)",targetNavTab);

        await this.homePage.navigateToHomePage();
        const result = await this.homePage.navBarTo(targetNavTab);
        if(result){
            logger.log("info","HomeTest - navBarTest: STATUS: %s","PASS");
        }else{
            const currentUrl = await this.testSelenium.getCurrentURL();
            logger.log("warn","HomeTest - navBarTest: STATUS: %s","FAIL");
            logger.log('info',`Tried to navigate to (${targetNavTab}), but got this url: (${currentUrl})`)
        }

    }

}

const homePage = new HomePageTest();
homePage.homeTest();