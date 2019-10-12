const BasePage = require("../BasePage/BasePage");
const ClientsPage = require("../Pages/ClientsPage");

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

    async updateClient(){
        const isPopupAppear = await this.clientsPage.clickFirstClient();
        if (!isPopupAppear) {
            console.error(new Error(`ClientsPageTest updateClient: Popup didnt appear`));
            return;
        }
        await this.clientsPage.putValue("email","112233 - not valid mail");
        await this.clientsPage.clickUpdatePopUpDetail()
        const isError = await this.clientsPage.isError();
        if (isError) {
            console.log(`ClientsPageTest updateClient: TEST PASS`);
        }else{
            console.log(`ClientsPageTest updateClient: TEST FAILED - EXPECTED ERROR POPUP`);
        }

    }

    async deleteClient(){
        const client = await this.clientsPage.getClientDetails();

        const isPopupAppear = await this.clientsPage.clickFirstClient();
        if (!isPopupAppear) {
            console.error(new Error(`ClientsPageTest deleteClient: Popup didnt appear`));
            return;
        }
        const isGotSuccessfulMessage = await this.clientsPage.clickDeletePopUpDetail()
        if (!isGotSuccessfulMessage) {
            console.error(new Error(`ClientsPageTest deleteClient: Successful Message didn't appear`));
        }

       const clientAfterSearch = await this.clientsPage.searchByParams(`${client.firstName} ${client.lastName}`, "name",true)
        if(clientAfterSearch === undefined){
            console.error(new Error(`ClientsPageTest deleteClient: TEST ERROR`))
        }else if(clientAfterSearch.length === 0){
            console.log(`ClientsPageTest deleteClient: TEST PASS`)
        }else{
            console.log(`ClientsPageTest deleteClient: TEST FAIL`)
        }
    }

    async search(){
        const result = await this.clientsPage.searchAndValidateClient("france","country")
        if(result){
            console.log(`ClientsPageTest - search: PASS`)
        }else{
            console.log(`ClientsPageTest - search: FAIL`)
        }
    }

}

const clientPageTest = new ClientsPageTest();
clientPageTest.clientTest();