class ActionsPage {
    constructor(selenium) {
        this.selenium = selenium;
        this.locators = {
            // inputField:{
            //     locator: fieldName => `${fieldName}`,
            //     type:"id"
            // },
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
            }
        }
    }

    async navigateToActionsPage() {
        await this.selenium.getURL("https://lh-crm.herokuapp.com/actions");
    }

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

    async updateClient(clientObj){
        //** */
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