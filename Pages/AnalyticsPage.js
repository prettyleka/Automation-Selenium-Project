class AnaliyticsPage {
    constructor(selenium) {
        this.selenium = selenium;
        this.locators = {

        }
    }

    async navigateToAnaliyticsPage() {
        await this.selenium.getURL("https://lh-crm.herokuapp.com/analytics");
    }
}

module.exports = AnaliyticsPage;