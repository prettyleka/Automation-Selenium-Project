const logger = require("../logger/logger");
const BasePage = require("../BasePage/BasePage");
const AnaliyticsPage = require("../Pages/AnalyticsPage");
const ClientsPage = require("../Pages/ClientsPage");

class AnalyticsPageTest {
    constructor() {
        this.testSelenium = new BasePage().selenium;
        this.analyticsPage = new AnaliyticsPage(this.testSelenium);
        this.clientsPage = new ClientsPage(this.testSelenium);
    }

    async analyticsTest() {
        await this.emailSent();
        await this.emailSent2();
        await this.outstandingClients();
        await this.testSelenium.close();
    }

    async emailSent() {
        logger.log("debug", "AnalyticsPageTest - emailSent()");
        await this.analyticsPage.navigateToAnaliyticsPage();
        const emailsSentAnalyticsPage = await this.analyticsPage.getEmailsSent();
        await this.clientsPage.navigateToClientsPage();

        const emailsSentClientsPage = await this.clientsPage.countEmailsSent();
        if (emailsSentAnalyticsPage === emailsSentClientsPage) {
            logger.log("info", "AnalyticsPageTest - emailSent: STATUS: %s", "PASS");
        } else {
            logger.log("warn", "AnalyticsPageTest - emailSent: %s.", "FAIL");
            logger.log('info', `On AnalyticsPage emails sent = ${emailsSentAnalyticsPage} , but on ClientsPage: ${emailsSentClientsPage}`)
        }
    }

    async emailSent2() {
        logger.log("debug", "AnalyticsPageTest - emailSent2()");
        await this.analyticsPage.navigateToAnaliyticsPage();
        const emailsSentAnalyticsPage = await this.analyticsPage.getEmailsSent();
        await this.clientsPage.navigateToClientsPage();
        const results = await this.clientsPage.searchByParams("A", "email type");
        if (!results || results.length < 1) {
            logger.log("error", "AnalyticsPageTest - emailSent2: STATUS: %s. %s", "ERROR", "No results");
            return;
        }
        const isPopupAppear = await this.clientsPage.clickFirstClient();
        if (!isPopupAppear) {
            logger.log("error", "AnalyticsPageTest - emailSent2: STATUS: %s. %s", "ERROR", "Popup didnt appear");
            return;
        }

        const isGotSuccessfulMessage = await this.clientsPage.clickDeletePopUpDetail()
        if (!isGotSuccessfulMessage) {
            logger.log("error", "AnalyticsPageTest - emailSent2: STATUS: %s. %s", "ERROR", "Successful Message didn't appear");
            return;
        }
        await this.analyticsPage.navigateToAnaliyticsPage();
        const afterDeleteEmailsSentAnalyticsPage = await this.analyticsPage.getEmailsSent();

        if (emailsSentAnalyticsPage === afterDeleteEmailsSentAnalyticsPage + 1) {
            logger.log("info", "AnalyticsPageTest - emailSent2: STATUS: %s", "PASS");
        } else {
            logger.log("warn", "AnalyticsPageTest - emailSent2: STATUS: %s", "FAIL");
        }
    }


    async outstandingClients() {
        await this.analyticsPage.navigateToAnaliyticsPage();
        const outstandingClients = await this.analyticsPage.getOutstandingClients();
        await this.clientsPage.navigateToClientsPage();
        const results = await this.clientsPage.searchByParams("no", "sold");
        if (!results || results.length < 1) {
            logger.log("error", "AnalyticsPageTest - outstandingClients: STATUS: %s. %s", "ERROR", "No results");
            return;
        }

        const isPopupAppear = await this.clientsPage.clickFirstClient();
        if (!isPopupAppear) {
            logger.log("error", "AnalyticsPageTest - outstandingClients: STATUS: %s. %s", "ERROR", "Popup didnt appear");
            return;
        }

        const isGotSuccessfulMessage = await this.clientsPage.clickDeletePopUpDetail();
        if (!isGotSuccessfulMessage) {
            logger.log("error", "AnalyticsPageTest - outstandingClients: STATUS: %s. %s", "ERROR", "Successful Message didn't appear");
            return;
        }
        await this.analyticsPage.navigateToAnaliyticsPage();
        const afterDeleteOutstandingClients = await this.analyticsPage.getOutstandingClients();

        if (outstandingClients === afterDeleteOutstandingClients + 1) {
            logger.log("info", "AnalyticsPageTest - outstandingClients: STATUS: %s", "PASS");
        } else {
            logger.log("warn", "AnalyticsPageTest - outstandingClients: STATUS: %s", "FAIL");
        }
    }

}

const analyticsPageTest = new AnalyticsPageTest();
analyticsPageTest.analyticsTest();