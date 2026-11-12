# FitNesse — Tests API REST depuis l'interface web

Suite de tests de l'API publique [Restful Booker](https://restful-booker.herokuapp.com/apidoc/index.html), écrite en **tables FitNesse** avec les fixtures **HSAC** (`json http test`).
Aucun code Java à écrire : chaque ligne de table est une action HTTP ou une vérification, lisible par le métier.

## Cas de test

| Page | Ce qui est vérifié |
|---|---|
| `TC01_Disponibilite` | Le service répond (`GET /ping` → 201) en moins de 3 secondes |
| `TC02_Authentification` | 4 jeux d'identifiants pilotés par une table : seuls les bons obtiennent un jeton |
| `TC03_CycleDeVieReservation` | Création, consultation, recherche, modification refusée sans jeton (403), modification avec jeton, suppression, puis 404 |

## Points techniques

- `json http test` (HSAC) : `post`, `get from`, `patch`, `delete`, en-têtes, contrôles **JsonPath**
- **Symboles Slim** : le jeton et l'identifiant de réservation sont capturés (`$jeton=`, `$id=`) puis réutilisés
- **`table template`** : un scénario réutilisable alimenté par une table de données
- `reject` pour exprimer clairement les refus attendus (403, 404)
- Comparaisons de valeurs (`<3000`) et filtres JsonPath (`$[?(@.bookingid == $id)]`)

## Lancer

Prérequis : Java 8 ou plus.

1. Double-cliquer sur `lancer-fitnesse.bat`
   - au premier lancement, FitNesse et les fixtures HSAC 4.32.0 sont téléchargés depuis Maven Central dans `runtime/` (environ 50 Mo)
   - le proxy système éventuel est détecté et transmis à Java
2. Le navigateur s'ouvre sur `http://localhost:9090/RestfulBookerApi`
3. Cliquer sur **Suite** : les cellules passent au vert au fil de l'exécution

## Extrait

```
|script          |json http test                                                 |
|post            |${RESERVATION}   |to                |${BASE_URL}/booking         |
|check           |response status  |200                                            |
|$id=            |json path        |bookingid                                      |
|check           |json path        |booking.totalprice|150                         |
|reject          |patch            |${BASE_URL}/booking/$id|with|{"totalprice": 1} |
|check           |response status  |403                                            |
```
