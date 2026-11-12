class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.checkoutButton = page.getByTestId('checkout');
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.finishButton = page.getByTestId('finish');
    this.subtotal = page.getByTestId('subtotal-label');
    this.complete = page.getByTestId('complete-header');
    this.error = page.getByTestId('error');
  }

  async fillInformation(firstName, lastName, postalCode) {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.postalCode.fill(postalCode);
    await this.continueButton.click();
  }
}

module.exports = { CheckoutPage };
