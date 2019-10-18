const logger = require("../logger/logger");
const BasePage = require("../BasePage/BasePage");
const ActionsPage = require("../Pages/ActionsPage");
const ClientsPage = require("../Pages/ClientsPage");

class ActionsPageTest {
    constructor() {
        this.testSelenium = new BasePage().selenium;
        this.actionsPage = new ActionsPage(this.testSelenium);
        this.clientsPage = new ClientsPage(this.testSelenium);
    }

    async actionsTest() {
        const client = {
            firstName: "testName",
            lastName: "testLastName",
            country: "france",
            owner: "testOwner",
            email: "test@mail.com"
        }
        await this.addClient(client);

        //nagative addClient
        const inValidClient = {
            firstName: "123",
            lastName: "inValidClient",
            country: "france",
            owner: "testOwner",
            email: "test@mail.com"
        }
        await this.addClient(inValidClient, false);

        await this.updateClient();
        await this.testSelenium.close();
    }

    async updateClient() {
        const oldEmailType = "B";
        const newEmailType = "C"
        logger.log("debug", `ActionsPageTest updateClient: From EmailType:(${oldEmailType}) to (${newEmailType})`);

        await this.clientsPage.navigateToClientsPage();
        const results = await this.clientsPage.searchByParams(oldEmailType, "email type");
        if (!results || results.length < 1) {
            logger.log("error", "ActionsPageTest - updateClient: STATUS: %s. %s", "ERROR", "No results");
            return;
        }
        const client = await this.clientsPage.getClientDetails();
        logger.log("debug", `The Client's ,${client.firstName} ${client.lastName} ,emailType before update: ${client.emailType}`);

        await this.actionsPage.navigateToActionsPage();
        const popup = await this.actionsPage.updateClient(client, newEmailType);
        if (!popup.isSuccessPopUp) {
            logger.log("error", "ActionsPageTest - addClient: STATUS: %s.", "ERROR", "Successful Message didn't appear");
        }
        await this.clientsPage.navigateToClientsPage();
        const results2 = await this.clientsPage.searchByParams(`${client.firstName} ${client.lastName}`, "name");
        const client2 = await this.clientsPage.getParamsFromClient(results2[0]);
        logger.log("debug", `The Client's ,${client2.firstName} ${client2.lastName} ,emailType AFTER update: ${client2.emailType}`);
        if (client2.emailType === newEmailType) {
            logger.log("info", "ActionsPageTest - updateClient: STATUS: %s", "PASS");
        } else {
            logger.log("warn", "ActionsPageTest - addClient: STATUS: %s.", "FAIL");
        }
    }

    async addClient(client, isPositive = true) {
        console.log(`ActionsPageTest addClient with: client = (${JSON.stringify(client)})`);
        await this.actionsPage.navigateToActionsPage();
        const popUps = await this.actionsPage.addClient(client);

        if (isPositive) {
            if (!popUps.isSuccessPopUp) {
                logger.log("error", "ActionsPageTest - addClient: STATUS: %s. %s", "ERROR", "Successful Message didn't appear");
            }
        } else {
            if (!popUps.isErrorPopUp) {
                logger.log("error", "ActionsPageTest - addClient: STATUS: %s. %s", "ERROR", "Error Message didn't appear");
            }
        }
        await this.clientsPage.navigateToClientsPage();
        const clientAfterSearch = await this.clientsPage.searchByParams(`${client.firstName} ${client.lastName}`, "name", true);
        if (clientAfterSearch === undefined) {
            logger.log("error", "ActionsPageTest - addClient: STATUS: %s.", "ERROR");
            return;
        }

        if (isPositive) {
            if (clientAfterSearch.length === 0) {
                logger.log("warn", "ActionsPageTest - addClient: STATUS: %s. %s", "FAIL", "Client not found after adding");

            } else {
                logger.log("info", "ActionsPageTest - addClient: STATUS: %s", "PASS");
            }
        } else {
            if (clientAfterSearch.length === 0) {
                logger.log("info", "ActionsPageTest - addClient: STATUS: %s", "PASS");
            } else {
                logger.log("warn", "ActionsPageTest - addClient: STATUS: %s. %s", "FAIL", "Invalid client was added");
            }
        }
    }
}

const actionsPageTest = new ActionsPageTest();
actionsPageTest.actionsTest();