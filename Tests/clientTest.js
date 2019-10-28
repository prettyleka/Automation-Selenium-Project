const BasePage = require("../BasePage/BasePage");
const ClientsPage = require("../Pages/ClientsPage");
const logger = require("../logger/logger");

class ClientsPageTest {
    constructor() {
        this.testSelenium = new BasePage().selenium
        this.clientsPage = new ClientsPage(this.testSelenium)
    }

    async clientTest() {
        await this.clientsPage.navigateToClientsPage();
        await this.search();

        await this.clientsPage.navigateToClientsPage();
        await this.deleteClient();

        await this.clientsPage.navigateToClientsPage();
        await this.updateClient("email", "112233 - not valid mail", false);

        await this.testSelenium.close();
    }

    async updateClient(inputType, value, isPositive = false) {
        logger.log("debug", "ClientTest - updateClient()");
        let isPass = await this.clientsPage.updateFirstClient(inputType, value, isPositive)
        if (isPass) {
            logger.log("info", "ClientsPageTest updateClient: STATUS: PASS");
            return;
        }
        if (isPositive) {
            logger.log("warn", "ClientsPageTest updateClient: STATUS: FAIL: Expected a Success popup");
        } else {
            logger.log("warn", "ClientsPageTest updateClient: STATUS: FAIL: Expected an Error popup");
        }

        return;
    }

    async deleteClient() {
        logger.log("debug", "ClientTest - deleteClient()");
        const client = await this.clientsPage.getClientDetails();

        const isPopupAppear = await this.clientsPage.clickFirstClient();
        if (!isPopupAppear) {
            logger.log("error", "ClientTest - deleteClient: Popup didnt appear");
            return;
        }
        const isGotSuccessfulMessage = await this.clientsPage.clickDeletePopUpDetail()
        if (!isGotSuccessfulMessage) {
            logger.log("error", "ClientTest - deleteClient: Successful Message didn't appear");
        }

        const clientAfterSearch = await this.clientsPage.searchByParams(`${client.firstName} ${client.lastName}`, "name", true)
        if (clientAfterSearch === undefined) {
            logger.log("error", "ClientsPageTest - deleteClient: STATUS: ERROR");
        } else if (clientAfterSearch.length === 0) {
            logger.log("info", "ClientsPageTest - deleteClient: STATUS: PASS");
        } else {
            logger.log("warn", "ClientsPageTest - deleteClient: STATUS: FAIL");
        }
    }

    async search() {
        logger.log("debug", "ClientTest - search()");
        const result = await this.clientsPage.searchAndValidateClient("france", "country")
        if (result) {
            logger.log("info", "ClientsPageTest - search: STATUS: PASS");
        } else {
            logger.log("warn", "ClientsPageTest - search: STATUS: FAIL");
        }
    }

}

const clientPageTest = new ClientsPageTest();
clientPageTest.clientTest();
