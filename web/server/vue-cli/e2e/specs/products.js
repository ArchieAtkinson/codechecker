module.exports = {
  before(browser) {
    const login = browser.page.login();

    login
      .navigate()
      .loginAsRoot();

    const product = browser.page.product();
    product
      .navigate()
      .waitForElementVisible("@page", 10000)
  },

  after(browser) {
    browser.end();
  },

  "set announcement" (browser) {
    const header = browser.page.header();
    const login = browser.page.login();
    const product = browser.page.product();
    const msg = "My test announcement message";

    product
      .navigate()
      .waitForElementVisible("@page", 10000)
      .setAnnouncement(msg);

    header.assert.containsText("@announcementAppBar", msg);

    header
      .logout()
      .assert.urlEquals(`${browser.launchUrl}/login`)
      .isVisible("@announcementAppBar");

    login.loginAsRoot();

    product
      .assert.urlEquals(`${browser.launchUrl}/`)
      .waitForElementVisible("@page")
      .setAnnouncement("");

    header.waitForElementNotPresent("@announcementAppBar");
  },

  "edit global permissions" (browser) {
    const product = browser.page.product();
    const dialog = product.section.editGlobalPermissionsDialog;

    product
      .navigate()
      .showGlobalPermissionsDialog()
      .addNewGlobalPermissions([ "user1", "user2" ], [ "group1" ])
      .togglePermissions()
      .confirmChangeGlobalPermissions();

    dialog.expect.elements("@users").count.to.equal(2);
    dialog.expect.elements("@groups").count.to.equal(1);

    product
      .togglePermissions()
      .confirmChangeGlobalPermissions();

    dialog.expect.elements("@users").count.to.equal(0);
    dialog.expect.elements("@groups").count.to.equal(0);

    product.closeGlobalPermissionsDialog();
  },

  "manage products" (browser) {
    const product = browser.page.product();

    product
      .navigate()
      .showNewProductDialog();

    product
      .fillNewProductData()
      .saveProduct();

    product
      .fillNewProductData({ engine: "sqlite" })
      .saveProduct();

    product
      .fillNewProductData({ engine: "postgresql" })
      .saveProduct();

    product
      .fillNewProductData({
        endpoint: "test",
        displayName: "Test",
        description: "Test",
        runLimit: 500,
        disableReviewStatusChange: true,
        engine: "sqlite",
        dbFile: "test.sqlite"
      })
      .saveProduct();

    product
      .filterProducts("Test")
      .editProduct()
      .fillNewProductData({
        endpoint: "edit",
        displayName: "Test 2",
        description: "Renamed",
        runLimit: 600,
        disableReviewStatusChange: false
      })
      .saveProduct();

    product
      .removeProduct();
  }
}
