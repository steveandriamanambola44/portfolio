const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CheckoutPage } = require('../pages/CheckoutPage');

test.describe('Parcours d\'achat', () => {
  let inventory;
  let checkout;

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    inventory = new InventoryPage(page);
    checkout = new CheckoutPage(page);
    await login.open();
    await login.login('standard_user', 'secret_sauce');
  });

  test('achat de deux produits de bout en bout', async ({ page }) => {
    await inventory.addToCart('Sauce Labs Backpack');
    await inventory.addToCart('Sauce Labs Bike Light');
    await expect(inventory.cartBadge).toHaveText('2');

    await inventory.openCart();
    await expect(page.getByTestId('inventory-item')).toHaveCount(2);

    await checkout.checkoutButton.click();
    await checkout.fillInformation('Steve', 'Andriamanambola', '101');

    // 29.99 + 9.99
    await expect(checkout.subtotal).toHaveText('Item total: $39.98');

    await checkout.finishButton.click();
    await expect(checkout.complete).toHaveText('Thank you for your order!');
  });

  test('le code postal est obligatoire au paiement', async () => {
    await inventory.addToCart('Sauce Labs Onesie');
    await inventory.openCart();
    await checkout.checkoutButton.click();
    await checkout.fillInformation('Steve', 'Andriamanambola', '');
    await expect(checkout.error).toContainText('Postal Code is required');
  });

  test('le tri par prix croissant est respecté', async () => {
    await inventory.sortBy('lohi');
    const prices = await inventory.prices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
});
