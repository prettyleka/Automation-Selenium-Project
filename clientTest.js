const BasePage = require("./BasePage");
const ClientsPage = require("/.ClientsPage")

class ClientsPageTest {
    constructor() {
        this.testSelenium = new BasePage().selenium
        this.clientsPage = new ClientsPage(this.testSelenium)
        // if your test uses more pages, you will have to inisiate them here, in the constractor
    }

    async clientTest() {
        await this.clientsPage.navigateToClientsPage();
        // Implement the test here...
    }

}
let clientPageTest = new ClientsPageTest();
clientPageTest.test();
