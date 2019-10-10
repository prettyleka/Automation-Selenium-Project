const SeleniumInfra = require("../Infra/SeleniumInfra");
​
class BasePage {
  constructor() {
    this.selenium = new SeleniumInfra();
  }
}
​
module.exports = BasePage;
