const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test.describe('Connexion', () => {
  let login;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    await login.open();
  });

  test('un utilisateur standard accède au catalogue', async ({ page }) => {
    await login.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByTestId('title')).toHaveText('Products');
  });

  test('un utilisateur bloqué voit un message d\'erreur', async () => {
    await login.login('locked_out_user', 'secret_sauce');
    await expect(login.error).toContainText('this user has been locked out');
  });

  const invalidCases = [
    { name: 'identifiant vide', user: '', pass: 'secret_sauce', message: 'Username is required' },
    { name: 'mot de passe vide', user: 'standard_user', pass: '', message: 'Password is required' },
    { name: 'mot de passe faux', user: 'standard_user', pass: 'mauvais', message: 'do not match' }
  ];

  for (const c of invalidCases) {
    test(`refus de connexion : ${c.name}`, async () => {
      await login.login(c.user, c.pass);
      await expect(login.error).toContainText(c.message);
    });
  }
});
