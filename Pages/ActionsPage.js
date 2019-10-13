class ActionsPage {
    constructor(selenium) {
        this.selenium = selenium;
        this.locators = {
            firstName: {
                locator: "input#firstName",
                type: "css"
            },
            lastName: {
                locator: "input#lastName",
                type: "css"
            },
            country: {
                locator: "input#country",
                type: "css"
            },
            owner: {
                locator: "input#owner",
                type: "css"
            },
            email: {
                locator: "input#email",
                type: "css"
            },
            addBtn: {
                locator: "input.add-client-btn",
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
            clientsInput: {
                locator: 'input[list="names"]',
                type: "css"
            },
            emailTypeInput: {
                locator: 'input[list="emailType"]',
                type: "css"
            },
            sendBtn: {
                locator: 'input[value="Send"]',
                type: "css"
            }
        }
    }

    async navigateToActionsPage() {
        await this.selenium.getURL("https://lh-crm.herokuapp.com/actions");
    }

    /**
     * Add the given client to the CRM
     * @param {*} clientObj - object that represents client to be added,should contain properties:firstName,lastName,country,owner,email.
     * @returns an object with two booleans that indicates which popups appeared after clicking on add.
     */
    async addClient(clientObj) {
        for (let prop in clientObj) {
            await this.selenium.write(clientObj[prop], this.locators[prop].locator, this.locators[prop].type);
        }
        await this.clickAddBtn();

        return {
            isSuccessPopUp: await this.isSuccess(),
            isErrorPopUp: await this.isError()
        };
    }

    /**
     * AUpdate the given client's  email type to 'B'
     * @param {*} clientObj - object that represents client to be added,should contain properties:firstName,lastName,country,owner,email.
     * @param {string} newEmailType - The email type to be set
     * @returns an object with two booleans that indicates which popups appeared after clicking on add.
     */
    async updateClient(clientObj, newEmailType) {
        await this.selenium.write(`${clientObj.firstName} ${clientObj.lastName}`, this.locators.clientsInput.locator, this.locators.clientsInput.type);
        await this.selenium.write(newEmailType, this.locators.emailTypeInput.locator, this.locators.emailTypeInput.type);
        await this.selenium.clickElement(this.locators.sendBtn.locator, this.locators.sendBtn.type);
        return {
            isSuccessPopUp: await this.isSuccess(),
            isErrorPopUp: await this.isError()
        };
    }

    /**
     * Click on the add button in the add form
     */
    async clickAddBtn() {
        await this.selenium.clickElement(this.locators.addBtn.locator, this.locators.addBtn.type);
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

}

module.exports = ActionsPage;