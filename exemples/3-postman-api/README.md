# Postman + Newman — Tests API REST

Collection Postman qui teste l'API publique [Restful Booker](https://restful-booker.herokuapp.com/apidoc/index.html) de bout en bout.
Les requêtes s'enchaînent : le token et l'identifiant de réservation sont extraits des réponses et réutilisés par les requêtes suivantes.

## Scénario

| # | Requête | Vérifications |
|---|---|---|
| 01 | `POST /auth` | Statut 200, token récupéré |
| 02 | `POST /auth` (mauvais mot de passe) | Pas de token, motif `Bad credentials` |
| 03 | `POST /booking` | Identifiant attribué, données renvoyées, **schéma JSON validé** |
| 04 | `GET /booking/{id}` | Réservation persistée |
| 05 | `GET /booking?firstname=` | Réservation trouvée par recherche |
| 06 | `PATCH` sans token | Refus 403 |
| 07 | `PATCH` avec token | Prix modifié, autres champs inchangés |
| 08 | `DELETE /booking/{id}` | Suppression acceptée |
| 09 | `GET /booking/{id}` | 404 après suppression |

Chaque requête vérifie aussi que le temps de réponse reste sous 3 secondes (test au niveau de la collection).

## Lancer les tests

Dans Postman : importer `restful-booker.postman_collection.json` puis **Run collection**.

En ligne de commande (intégrable en CI) :

```bash
npm install
npm test
```

Le rapport HTML est généré dans `rapport/rapport-api.html`.
