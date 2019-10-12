class HomePage {
    constructor(selenium) {
        this.selenium = selenium;
        this.locators = {
        }
    }

    async navigateToHomePage() {
        await this.selenium.getURL("https://lh-crm.herokuapp.com/");
    }
}

module.exports = HomePage;