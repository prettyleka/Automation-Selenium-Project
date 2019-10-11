const BasePage = require("../BasePage/BasePage");
const ActionsPage = require("../Pages/ActionsPage");

class ActionsPageTest{
    constructor() {
        this.testSelenium = new BasePage().selenium
        this.actionsPage = new ActionsPage(this.testSelenium)
        // if your test uses more pages, you will have to inisiate them here, in the constractor
    }
}

const actionsPageTest = new ActionsPageTest();
actionsPageTest.actionsTest();