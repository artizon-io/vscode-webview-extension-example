import { assert } from "chai";
import { VSBrowser, WebDriver } from "vscode-extension-tester";

describe("Test environment spins up correctly", () => {
  let browser: VSBrowser;
  let driver: WebDriver;

  // initialize the browser and webdriver
  before(async () => {
    browser = VSBrowser.instance;
    driver = browser.driver;
  });

  it("Check window title", async () => {
    const title = await driver.getTitle();
    assert.equal(title, "Visual Studio Code");
  });
});
