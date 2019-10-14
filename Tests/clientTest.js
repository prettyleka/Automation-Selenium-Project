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
        await this.updateClient();

        await this.testSelenium.close();
    }

    async updateClient() {
        logger.log("info", "ClientTest - updateClient()");
        const isPopupAppear = await this.clientsPage.clickFirstClient();
        if (!isPopupAppear) {
            logger.log("error", "ClientTest - updateClient: %s", `Popup didnt appear`);
            return;
        }
        await this.clientsPage.putValue("email", "112233 - not valid mail");
        await this.clientsPage.clickUpdatePopUpDetail()
        const isError = await this.clientsPage.isError();
        if (isError) {
            logger.log("info", "ClientsPageTest updateClient: STATUS: %s", "PASS");
        } else {
            logger.log("warn", "ClientsPageTest updateClient: STATUS: %s: %s", `FAIL`, "Expected an error popup");
        }

    }

    async deleteClient() {
        logger.log("info", "ClientTest - deleteClient()");
        const client = await this.clientsPage.getClientDetails();

        const isPopupAppear = await this.clientsPage.clickFirstClient();
        if (!isPopupAppear) {
            logger.log("error", "ClientTest - deleteClient: %s", `Popup didnt appear`);
            return;
        }
        const isGotSuccessfulMessage = await this.clientsPage.clickDeletePopUpDetail()
        if (!isGotSuccessfulMessage) {
            logger.log("error", "ClientTest - deleteClient: %s", `Successful Message didn't appear`);
        }

        const clientAfterSearch = await this.clientsPage.searchByParams(`${client.firstName} ${client.lastName}`, "name", true)
        if (clientAfterSearch === undefined) {
            logger.log("error", "ClientsPageTest - deleteClient: STATUS: %s", "ERROR");
        } else if (clientAfterSearch.length === 0) {
            logger.log("info", "ClientsPageTest - deleteClient: STATUS: %s", "PASS");
        } else {
            logger.log("warn", "ClientsPageTest - deleteClient: STATUS: %s", "FAIL");
        }
    }

    async search() {
        logger.log("info", "ClientTest - search()");
        const result = await this.clientsPage.searchAndValidateClient("france", "country")
        if (result) {
            logger.log("info", "ClientsPageTest - search: STATUS: %s", "PASS");
        } else {
            logger.log("warn", "ClientsPageTest - search: STATUS: %s", "FAIL");
        }
    }

}

const clientPageTest = new ClientsPageTest();
clientPageTest.clientTest();