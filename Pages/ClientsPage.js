const logger = require("../logger/logger");

class ClientsPage {
    constructor(selenium) {
        this.selenium = selenium;
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



    /**
     * Click on the first client in the table
     * @returns true if PopUp details appears after the click.
     */
    async clickFirstClient() {
        await this.selenium.clickElement(this.locators.firstClient.locator, this.locators.firstClient.type);
        return await this.selenium.isElementExists(this.locators.popupDetails.locator, this.locators.popupDetails.type);
    }

    /**
     * Click on the Update button on PopUp
     * @returns true if Success Popup appears as a result of the click
     */
    async clickDeletePopUpDetail() {
        await this.selenium.clickElement(this.locators.deleteClient.locator, this.locators.deleteClient.type);
        return this.isSuccess();
    }

    /**
     * Click on the Update button on PopUp
     */
    async clickUpdatePopUpDetail() {
        await this.selenium.clickElement(this.locators.updateClient.locator, this.locators.updateClient.type);
    }

    /**
     * @returns true if Success popup appears , false otherwise
     */
    async isSuccess() {
        return await this.selenium.isElementExists(this.locators.successPopUp.locator, this.locators.successPopUp.type);
    }

    /**
     * @returns true if error popup appears, false otherwise
     */
    async isError() {
        return await this.selenium.isElementExists(this.locators.errorPopUp.locator, this.locators.errorPopUp.type);
    }

    /**
     * Writes the spceified value into a given field in the popup
     * @param {string} inputType - The input to write to.Can be: name,country or email
     * @param {string} value - Will be written to the specified field.
     */
    async putValue(inputType, value) {
        inputType = inputType.toLowerCase();
        await this.selenium.clearElementField(inputType);
        await this.selenium.write(value, inputType);
    }

    /**
     * Clears the specified field in the popup
     * @param {string} inputType - The input to write to.Can be: name,country or email 
     */
    async clearValue(inputType) {
        inputType = inputType.toLowerCase();
        await this.selenium.clearElementField(inputType);
    }

    /**
     * Click the close button on the Opened Popup
     * @returns true if the popup gone after click, false otherwise
     */
    async closePopupDetails() {
        await this.selenium.clickElement(this.locators.closePopUpBtn.locator, this.locators.closePopUpBtn.type);
        return !(await this.selenium.isElementExists(this.locators.popupDetails.locator, this.locators.popupDetails.type));
    }

    /**
     * 
     * @param {WebElement} clientElement - A WebElement that refers to a client
     * @returns an object that represent the client specified by the clientElement
     */
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

    /**
     * @returns An object that represents a the first client on the first page
     */
    async getClientDetails() {
        const firstPageResults = await this.collectResults(true);
        const firstClientElem = firstPageResults[0];
        const client = await this.getParamsFromClient(firstClientElem);
        return client;
    }

    async navigateToClientsPage() {
        await this.selenium.getURL("https://lh-crm.herokuapp.com/client")
    }

    async _goNextPage() {
        await this.selenium.clickElement(this.locators.nextPage.locator, this.locators.nextPage.type);
    }

    async _isThereNextPage() {
        const currentPageNumber = await this.selenium.getTextFromElement(this.locators.currentPageNumber.locator, this.locators.currentPageNumber.type);
        const totalPagesNumber = await this.selenium.getTextFromElement(this.locators.totalPagesNumber.locator, this.locators.totalPagesNumber.type);

        if (parseInt(currentPageNumber) < parseInt(totalPagesNumber)) {
            return true;
        }

        return false;
    }

    /**
 * 
 * @param {Array} clientsList 
 * @param {Array} clientsElems  - Array of WebElements to map to clientsList
 */

    /**
     * 
     * @param {Array} clientsList  - The mapped elements go here 
     * @param {Array} clientsElems - Array of WebElements to map to clientsList
     * @param {boolean} onlyFirstPage - if true clientsList will hold webElements of clients from first page,
     * otherwise will hold objects that each represent a client from all pages
     */
    async mapClientsElementsToList(clientsList, clientsElems, onlyFirstPage = true) {
        for (let clientsElem of clientsElems) {
            if (!onlyFirstPage) {
                clientsElem = await this.getParamsFromClient(clientsElem)
            }
            clientsList.push(clientsElem);
        }
    }

    /**
     * 
     * @param {boolean} onlyFirstPage - if true only the first page will be returned, otherwise all pages
     * @return list of results.
     */
    async collectResults(onlyFirstPage = true) {
        const clientsList = [];
        try {
            do {
                const currentPageClientsElems = await this.selenium.findElementListBy(this.locators.tableResults.locator, this.locators.tableResults.type);
                await this.mapClientsElementsToList(clientsList, currentPageClientsElems, onlyFirstPage);
                if (onlyFirstPage || !(await this._isThereNextPage())) {
                    break;
                }
                await this._goNextPage();
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
     * @returns list of results, or undefined  - if error occured
     */
    async searchByParams(input, searchBy = "Name", onlyFirstPageResults = true) {
        try {
            searchBy = this.capitlize(searchBy);
            await this.selenium.clickElement(this.locators.dropDown.locator, this.locators.dropDown.type);
            await this.selenium.clickElement(this.locators.dropDownOption.locator(searchBy), this.locators.dropDownOption.type);
            await this.selenium.clickElement(this.locators.dropDown.locator, this.locators.dropDown.type);
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
        const searchResult = await this.searchByParams(input, searchBy);
        if (searchResult && searchResult.length > 0) {
            return true;
        }
        return false;
    }

    /**
     * Scan the results show in table, and counts the number of clients with an email type
     */
    async countEmailsSent() {
        const clinetsObjs = await this.collectResults(false);
        let count = 0;

        for (let clinetsObj of clinetsObjs) {
            if (clinetsObj.emailType !== "-") {
                count++;
            }
        }
        return count;
    }


    /**
     * Updates the first client with the specified value
     * @param {string} inputType - The input to write to.Can be: name,country or email
     * @param {string} value - Will be written to the specified field.
     * @param {boolean} isPositive - if true will expect success popup,or error popup otherwise.
     * @returns {boolean} - true if pass, false otherwise
     */
    async updateFirstClient(inputType, value, isPositive = false) {
        const isPopupAppear = await this.clickFirstClient();
        if (!isPopupAppear) {
            logger.log("error", "ClientPage - updateClient: %s", `Popup didnt appear`);
            return false;
        }

        await this.putValue(inputType, value);
        await this.clickUpdatePopUpDetail();

        if (isPositive) {
            const isSuccess = await this.isSuccess();
            return isSuccess;
        } else {
            const isError = await this.isError();
            return isError;
        }
    }


    /**
     * Helpers
     */
    capitlize(str) {
        const strWords = str.split(" ");
        const capWords = strWords.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        return capWords.join(" ");
    }
}

module.exports = ClientsPage;