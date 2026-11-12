# Selenium Java — Formulaires et cas limites

Tests d'interface sur [the-internet.herokuapp.com](https://the-internet.herokuapp.com), un site conçu pour l'entraînement à l'automatisation.
Stack : **Java 11+, Selenium 4, JUnit 5, Maven**.

## Ce qui est couvert

| Classe | Scénarios |
|---|---|
| `LoginTest` | Connexion valide, 3 refus de connexion pilotés par `@CsvSource` |
| `ElementsTest` | Cases à cocher, liste déroulante, alertes JavaScript, chargement dynamique |

## Points techniques

- Page Object `LoginPage` avec localisateurs `By` centralisés
- Attentes explicites (`WebDriverWait` + `ExpectedConditions`), jamais de `Thread.sleep`
- Tests paramétrés JUnit 5 pour couvrir plusieurs jeux de données avec un seul test
- Mode headless par défaut, désactivable avec `-Dheadless=false`
- Selenium Manager télécharge automatiquement le bon ChromeDriver

## Lancer les tests

Prérequis : JDK 11 ou plus, Maven, Google Chrome.

```bash
mvn test                    # headless
mvn test -Dheadless=false   # voir le navigateur
```

Les résultats sont dans `target/surefire-reports/`.
