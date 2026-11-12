# Playwright — Parcours d'achat sur Sauce Demo

Tests end-to-end d'une boutique en ligne ([saucedemo.com](https://www.saucedemo.com)), écrits avec Playwright et le pattern **Page Object Model**.

## Ce qui est couvert

| Fichier | Scénarios |
|---|---|
| `tests/login.spec.js` | Connexion valide, utilisateur bloqué, 3 cas invalides (tests pilotés par les données) |
| `tests/achat.spec.js` | Achat complet de 2 produits avec contrôle du total, champ obligatoire, tri par prix |

## Points techniques

- Sélecteurs stables via l'attribut `data-test` (`testIdAttribute`)
- Page Objects dans `pages/` : les tests restent lisibles et la maintenance est centralisée
- Captures, vidéos et traces conservées uniquement en cas d'échec
- Rapport HTML généré dans `playwright-report/`

## Lancer les tests

```bash
npm install
npx playwright install chromium
npm test            # exécution headless
npm run test:headed # voir le navigateur
npm run report      # ouvrir le rapport HTML
```
