class InventoryPage {
  constructor(page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.sort = page.getByTestId('product-sort-container');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
  }

  async addToCart(productName) {
    await this.items.filter({ hasText: productName }).getByRole('button', { name: 'Add to cart' }).click();
  }

  async sortBy(option) {
    await this.sort.selectOption(option);
  }

  async prices() {
    const texts = await this.page.getByTestId('inventory-item-price').allTextContents();
    return texts.map(t => parseFloat(t.replace('$', '')));
  }

  async openCart() {
    await this.cartLink.click();
  }
}

module.exports = { InventoryPage };
