const BasePage = require("../BasePage/BasePage");
const AnaliyticsPage = require("../Pages/AnalyticsPage");
const ClientsPage = require("../Pages/ClientsPage");

class AnalyticsPageTest{
    constructor() {
        this.testSelenium = new BasePage().selenium;
        this.analyticsPage = new AnaliyticsPage(this.testSelenium);
        this.clientsPage = new ClientsPage(this.testSelenium);
        // if your test uses more pages, you will have to inisiate them here, in the constractor
    }

    async analyticsTest() {
        await this.emailSent();
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
            console.log(`AnalyticsPageTest emailSent: TEST FAIL`)
        }

    }

}

const analyticsPageTest = new AnalyticsPageTest();
analyticsPageTest.analyticsTest();