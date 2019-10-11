class ClientsPage {
    constructor(selenium) {
        this.selenium = selenium,
            this.locators = {
                searchClients: {
                    locator: "div.search-clients>input",
                    type: "css"
                },
                dropDown: {
                    locator: "div.search-clients>.select-css",
                    type: "css"
                },
                dropDownOption: {
                    locator: optionValue => `.select-css>option[value='${optionValue}']`,
                    type: "css"
                },
                tableResults: {
                    locator: "table>tr.clientDetails",
                    type: "css"
                },
                currentPageNumber: {
                    locator: "div.page-numbers span.page:nth-of-type(1)",
                    type: "css"
                },
                totalPagesNumber: {
                    locator: "div.page-numbers span.page:nth-of-type(3)",
                    type: "css"
                },
                previousPage: {
                    locator: "div.page-numbers img[name='previous']",
                    type: "css"
                },
                nextPage: {
                    locator: "div.page-numbers img[name='next']",
                    type: "css"
                },
                firstClient: {
                    locator: "table>tr.clientDetails:nth-of-type(2)",
                    type: "css"
                },
                popupDetails: {
                    locator: "div.details-pop-up-container",
                    type: "css"
                },
                deleteClient: {
                    locator: "input.delete-client-popup-btn",
                    type: "css"
                },
                successPopUp: {
                    locator: ".success-pop-up",
                    type: "css"
                },
                errorPopUp: {
                    locator: ".error-pop-up",
                    type: "css"
                },
                closePopUpBtn: {
                    locator: "input.cancel-client-popup-btn",
                    type: "css"
                },
                updateClient: {
                    locator: "input.update-client-popup-btn",
                    type: "css"
                },
            }
    }





    async clickFirstClient() {
        await this.selenium.clickElement(this.locators.firstClient.locator, this.locators.firstClient.type);
        return await this.selenium.isElementExists(this.locators.popupDetails.locator, this.locators.popupDetails.type);
    }

    async clickDeletePopUpDetail() {
        await this.selenium.clickElement(this.locators.deleteClient.locator, this.locators.deleteClient.type);
        return this.isSuccess();
    }

    async clickUpdatePopUpDetail() {
        await this.selenium.clickElement(this.locators.updateClient.locator, this.locators.updateClient.type);
    }

    async isSuccess(){
        return await this.selenium.isElementExists(this.locators.successPopUp.locator, this.locators.successPopUp.type);
    }

    async isError(){
        return await this.selenium.isElementExists(this.locators.errorPopUp.locator, this.locators.errorPopUp.type);
    }

    async putValue(inputType, value) {
        inputType = inputType.toLowerCase();
        await this.selenium.clearElementField(inputType);
        await this.selenium.write(value,inputType);
    }

    async clearValue(inputType) {
        inputType = inputType.toLowerCase();
        await this.selenium.clearElementField(inputType);
    }

    async closePopupDetails() {
        await this.selenium.clickElement(this.locators.closePopUpBtn.locator, this.locators.closePopUpBtn.type);
        return !(await this.selenium.isElementExists(this.locators.popupDetails.locator, this.locators.popupDetails.type));
    }

    async getParamsFromClient(clientElement) {
        const client = {
            firstName: await this.selenium.getTextFromElement("th:nth-child(1)", "css", undefined, clientElement),
            lastName: await this.selenium.getTextFromElement("th:nth-child(2)", "css", undefined, clientElement),
            country: await this.selenium.getTextFromElement("th:nth-child(3)", "css", undefined, clientElement),
            email: await this.selenium.getTextFromElement("th:nth-child(4)", "css", undefined, clientElement),
            owner: await this.selenium.getTextFromElement("th:nth-child(5)", "css", undefined, clientElement),
            sold: await this.selenium.getTextFromElement("th:nth-child(6)", "css", undefined, clientElement),
            contactDate: await this.selenium.getTextFromElement("th:nth-child(7)", "css", undefined, clientElement),
            emailType: await this.selenium.getTextFromElement("th:nth-child(8)", "css", undefined, clientElement),
        }

        return client;
    }

    async getClientDetails() {
        const firstPageResults = await this.collectResults(true);
        const firstClientElem = firstPageResults[0];
        const client = await this.getParamsFromClient(firstClientElem);
        return client;
    }

    async navigateToClientsPage() {
        await this.selenium.getURL("https://lh-crm.herokuapp.com/client")
    }

    async goNextPage() {
        await this.selenium.clickElement(this.locators.nextPage.locator, this.locators.nextPage.type);
    }

    async isThereNextPage() {
        const currentPageNumber = await this.selenium.getTextFromElement(this.locators.currentPageNumber.locator, this.locators.currentPageNumber.type);
        const totalPagesNumber = await this.selenium.getTextFromElement(this.locators.totalPagesNumber.locator, this.locators.totalPagesNumber.type);

        if (parseInt(currentPageNumber) < parseInt(totalPagesNumber)) {
            return true;
        }

        return false;
    }

    mapClientsElementsToList(clientsList, clientsElems) {
        for (let clientsElem of clientsElems) {
            clientsList.push(clientsElem);
        }
    }

    async collectResults(onlyFirstPage = true) {
        const clientsList = [];
        try {
            do {
                const currentPageClientsElems = await this.selenium.findElementListBy(this.locators.tableResults.locator, this.locators.tableResults.type);
                this.mapClientsElementsToList(clientsList, currentPageClientsElems);
                if (onlyFirstPage || !(await this.isThereNextPage())) {
                    break;
                }
                await this.goNextPage();
            } while (true);
        } catch (error) {
            console.error(new Error(`ClientsPage collectResults()`));
            console.error(error);
        }
        return clientsList;
    }

    /**
     * 
     * @param {string} input 
     * @param {string} searchBy 
     * @returns {*} list of results ?
     */
    async searchByParams(input, searchBy = "Name", onlyFirstPageResults = true) {
        try {
            searchBy = this.capitlize(searchBy);
            await this.selenium.clickElement(this.locators.dropDown.locator, this.locators.dropDown.type);
            await this.selenium.clickElement(this.locators.dropDownOption.locator(searchBy), this.locators.dropDownOption.type);
            await this.selenium.write(input, this.locators.searchClients.locator, this.locators.searchClients.type);
            return await this.collectResults(onlyFirstPageResults);
        } catch (error) {
            console.error(new Error(`ClientsPage searchByParams(${input}, ${searchBy})`));
            console.error(error);
            return undefined;
        }
    }

    /*This method gets an input to search and the field to search by
    searchBy can be: Name, Country, Email, Owner, Sold, EmailType
    Return value: true if client exist, false otherwise
    */
    async searchAndValidateClient(input, searchBy = "Name") {
        //implement the searchAndValidateClient function
        const searchResult = await this.searchByParams(input, searchBy);
        if (searchResult && searchResult.length > 0) {
            return true;
        }
        return false;
    }

    //other methods if necessary


    /**
     * Helpers
     */
    capitlize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
}

module.exports = ClientsPage;