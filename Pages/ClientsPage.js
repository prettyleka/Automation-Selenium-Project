class ClientsPage {
    constructor(selenium) {
        this.selenium = selenium
    }

    async navigateToClientsPage() {
        await this.selenium.getURL("https://lh-crm.herokuapp.com/client")
    }

    /*This method gets an input to search and the field to search by
    searchBy can be: Name, Country, Email, Owner, Sold, EmailType
    Return value: true if client exist, false otherwise
    */
    searchAndValidateClient(input, searchBy) {
        //implement the searchAndValidateClient function
    }

    //other methods if necessary
}

module.exports = ClientsPage;