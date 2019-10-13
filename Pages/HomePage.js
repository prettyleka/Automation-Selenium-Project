class HomePage {
    constructor(selenium) {
        this.selenium = selenium;
        this.locators = {
            navTab: {
                locator: tabName => `div.navbar input[value="${tabName}"]`,
                type: "css"
            }
        }
    }

    async navigateToHomePage() {
        await this.selenium.getURL("https://lh-crm.herokuapp.com/");
    }

    /**
     * 
     * @param {string} tabName - Should be: Home,Clients,Actions or Analytics
     * @return true if navigated to the target page,false otherwise
     */
    async navBarTo(tabName) {
        tabName = this.capitlize(tabName);
        await this.selenium.clickElement(this.locators.navTab.locator(tabName), this.locators.navTab.type);
        tabName = tabName.toLowerCase();
        switch (tabName) {
            case "clients":
                tabName = "client";
                break;
            case "home":
                tabName = "";
                break;
            default:
                break;
        }
        return await this.selenium.URLvalidation(`https://lh-crm.herokuapp.com/${tabName}`);
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

module.exports = HomePage;