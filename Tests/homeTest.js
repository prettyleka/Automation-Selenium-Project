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
        await this.homePage.navigateToHomePage();
        console.log(`HomePageTest navBarTest: targetNavTab = (${targetNavTab})`);
        const result = await this.homePage.navBarTo(targetNavTab);
        if(result){
            console.log(`homeTest navBarTest: TEST PASS`);
        }else{
            const currentUrl = await this.selenium.getCurrentURL();
            console.log(`homeTest navBarTest: TEST FAIL`);
            console.log(`Tried to navigate to (${targetNavTab}), but got this url: (${currentUrl})`);
        }

    }

}

const homePage = new HomePageTest();
homePage.homeTest();