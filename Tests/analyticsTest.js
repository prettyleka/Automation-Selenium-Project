const logger = require("../logger/logger");
const BasePage = require("../BasePage/BasePage");
const AnaliyticsPage = require("../Pages/AnalyticsPage");
const ClientsPage = require("../Pages/ClientsPage");

class AnalyticsPageTest{
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

    async emailSent(){
        await this.analyticsPage.navigateToAnaliyticsPage();
        const emailsSentAnalyticsPage = await this.analyticsPage.getEmailsSent();
        await this.clientsPage.navigateToClientsPage();

        const emailsSentClientsPage = await this.clientsPage.countEmailsSent();
        if(emailsSentAnalyticsPage === emailsSentClientsPage){
            console.log(`AnalyticsPageTest emailSent: TEST PASS`)
        }else{
            console.log(`AnalyticsPageTest emailSent: TEST FAIL`);
            console.log(`On AnalyticsPage emails sent = ${emailsSentAnalyticsPage} , but on ClientsPage: ${emailsSentClientsPage}`);
        }
    }

    async emailSent2(){
        await this.analyticsPage.navigateToAnaliyticsPage();
        const emailsSentAnalyticsPage = await this.analyticsPage.getEmailsSent();
        await this.clientsPage.navigateToClientsPage();
        const results = await this.clientsPage.searchByParams("A","email type");
        if(!results || results.length<1){
            console.error(new Error(`AnalyticsPageTest emailSent2: No results`));
            return;
        }
        const isPopupAppear = await this.clientsPage.clickFirstClient();
        if (!isPopupAppear) {
            console.error(new Error(`AnalyticsPageTest emailSent2: Popup didnt appear`));
            return;
        }

        const isGotSuccessfulMessage = await this.clientsPage.clickDeletePopUpDetail()
        if (!isGotSuccessfulMessage) {
            console.error(new Error(`AnalyticsPageTest emailSent2: Successful Message didn't appear`));
            return;
        }
        await this.analyticsPage.navigateToAnaliyticsPage();
        const afterDeleteEmailsSentAnalyticsPage = await this.analyticsPage.getEmailsSent();

        if(emailsSentAnalyticsPage === afterDeleteEmailsSentAnalyticsPage+1){
            console.log(`AnalyticsPageTest emailSent2: TEST PASS`)
        }else{
            console.log(`AnalyticsPageTest emailSent2: TEST FAIL`);
        }
    }


    async outstandingClients(){
        await this.analyticsPage.navigateToAnaliyticsPage();
        const outstandingClients = await this.analyticsPage.getOutstandingClients();
        await this.clientsPage.navigateToClientsPage();
        const results = await this.clientsPage.searchByParams("no","sold");
        if(!results || results.length<1){
            console.error(new Error(`AnalyticsPageTest outstandingClients: No results`));
            return;
        }

        const isPopupAppear = await this.clientsPage.clickFirstClient();
        if (!isPopupAppear) {
            console.error(new Error(`AnalyticsPageTest outstandingClients: Popup didnt appear`));
            return;
        }

        const isGotSuccessfulMessage = await this.clientsPage.clickDeletePopUpDetail();
        if (!isGotSuccessfulMessage) {
            console.error(new Error(`AnalyticsPageTest outstandingClients: Successful Message didn't appear`));
            return;
        }
        await this.analyticsPage.navigateToAnaliyticsPage();
        const afterDeleteOutstandingClients = await this.analyticsPage.getOutstandingClients();

        if(outstandingClients === afterDeleteOutstandingClients+1){
            console.log(`AnalyticsPageTest outstandingClients: TEST PASS`)
        }else{
            console.log(`AnalyticsPageTest outstandingClients: TEST FAIL`);
        }
    }

}

const analyticsPageTest = new AnalyticsPageTest();
analyticsPageTest.analyticsTest();