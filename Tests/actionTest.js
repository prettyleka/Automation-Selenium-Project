const BasePage = require("../BasePage/BasePage");
const ActionsPage = require("../Pages/ActionsPage");
const ClientsPage = require("../Pages/ClientsPage");

class ActionsPageTest{
    constructor() {
        this.testSelenium = new BasePage().selenium;
        this.actionsPage = new ActionsPage(this.testSelenium);
        this.clientsPage = new ClientsPage(this.testSelenium);
        // if your test uses more pages, you will have to inisiate them here, in the constractor
    }

    async actionsTest() {
        const client = {
            firstName:"testName",
            lastName:"testLastName",
            country: "france",
            owner: "testOwner",
            email:"test@mail.com"
        }
        await this.addClient(client);

        //nagative addClient
        const inValidClient = {
            firstName:"123",
            lastName:"inValidClient",
            country: "france",
            owner: "testOwner",
            email:"test@mail.com"
        }
        await this.addClient(inValidClient, false);

        await this.updateClient();
        await this.testSelenium.close();
    }

    async updateClient(){ 
        await this.clientsPage.navigateToClientsPage();
        const results = await this.clientsPage.searchByParams("A","email type");
        if(!results || results.length<1){
            console.error(new Error(`AnalyticsPageTest outstandingClients: No results`));
            return;
        }
        const client = await this.clientsPage.getClientDetails();
        await this.actionsPage.navigateToActionsPage();
        const popup = await this.actionsPage.updateClient(client);
        if(!popup.isSuccessPopUp){
            console.error(new Error(`ActionsPageTest updateClient: Successful Message didn't appear`));
        }
        await this.clientsPage.navigateToClientsPage();
        const results2 = await this.clientsPage.searchByParams(`${client.firstName} ${client.lastName}`,"name");
        const client2 = await this.clientsPage.getParamsFromClient(results2[0]);
        if(client2.emailType === "B"){
            console.log(`ActionsPageTest updateClient: TEST PASS`);
        }else{
            console.log(`ActionsPageTest updateClient: TEST FAIL`);
        }
    }

    async addClient(client, isPositive = true) {
        console.log(`ActionsPageTest addClient with: client = (${JSON.stringify(client)})`);
        await this.actionsPage.navigateToActionsPage();
        const popUps = await this.actionsPage.addClient(client);

        if(isPositive){
            if(!popUps.isSuccessPopUp){
                console.error(new Error(`ActionsPageTest addClient: Successful Message didn't appear`));
            }
        }else{
            if(!popUps.isErrorPopUp){
                console.error(new Error(`ActionsPageTest addClient: Error Message didn't appear`));
            }
        }
        await this.clientsPage.navigateToClientsPage();
        const clientAfterSearch = await this.clientsPage.searchByParams(`${client.firstName} ${client.lastName}`, "name",true);
        if(clientAfterSearch === undefined){
            console.error(new Error(`ActionsPageTest addClient: TEST ERROR`))
            return;
        }

        if(isPositive){
            if(clientAfterSearch.length === 0){
                console.log(`ActionsPageTest addClient: TEST FAIL - Client not found after adding`)
            }else{
                console.log(`ActionsPageTest addClient: TEST PASS`)
            }
        }else{
            if(clientAfterSearch.length === 0){
                console.log(`ActionsPageTest addClient: TEST PASS`)
            }else{
                console.log(`ActionsPageTest addClient: TEST FAIL - Invalid client was added`)
            }
        }
    }
}

const actionsPageTest = new ActionsPageTest();
actionsPageTest.actionsTest();