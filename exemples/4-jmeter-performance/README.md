# JMeter — Test de performance d'un parcours de réservation

Plan de test JMeter qui simule des utilisateurs réservant un vol sur [BlazeDemo](https://blazedemo.com), un site mis à disposition par BlazeMeter pour les démonstrations de tests de charge.

## Scénario par utilisateur virtuel

1. **Accueil** — vérification du titre de la page
2. **Recherche de vols** — départ et destination lus dans `trajets.csv`
3. **Choix du vol** — le prix est **extrait dynamiquement** de la réponse précédente (expression régulière)
4. **Paiement** — vérification du message de confirmation

Les 4 étapes sont regroupées dans une **transaction** pour mesurer le temps du parcours complet.

## Points techniques

- Charge paramétrable en ligne de commande : `users`, `rampup`, `loops`
- Données variables via un **CSV Data Set**
- **Corrélation** : extraction du prix pour alimenter la requête suivante
- **SLA** : assertion de durée, chaque page doit répondre en moins de 2 secondes
- Temps de réflexion aléatoire de 1 à 3 s pour un comportement réaliste
- Cookies réinitialisés à chaque itération

## Lancer le test

Prérequis : [Apache JMeter 5.6+](https://jmeter.apache.org/download_jmeter.cgi) et Java 8+.

```bash
# Charge légère par défaut : 10 utilisateurs, montée en 20 s, 3 itérations
jmeter -n -t blazedemo-reservation.jmx -l resultats.jtl -e -o rapport

# Charge personnalisée
jmeter -n -t blazedemo-reservation.jmx -Jusers=25 -Jrampup=60 -Jloops=5 -l resultats.jtl -e -o rapport
```

Le tableau de bord HTML (temps de réponse, percentiles, débit, erreurs) est généré dans `rapport/index.html`.

> Ce site est public : rester sur des charges modérées.
