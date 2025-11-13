---
type: permanent
created: 2025-01-08 02:01
tags:
  - permanent
  - réseau
  - routage
  - ip
---

# Routage statique

> [!abstract] Concept
> Le routage statique consiste à configurer manuellement les routes dans la table de routage d'un routeur.

## Explication

Contrairement au routage dynamique (RIP, OSPF), les routes statiques sont **configurées à la main** par l'administrateur.

**Route statique** : "Pour atteindre réseau X, passe par routeur Y"

## Quand utiliser ?

✅ **Petits réseaux** : Peu de routes à gérer
✅ **Routes spécifiques** : Réseau distant via VPN
✅ **Route par défaut** : Gateway vers Internet
✅ **Sécurité** : Contrôle total des routes

❌ **Grands réseaux** : Trop de routes à maintenir
❌ **Topologie changeante** : Pas d'adaptation automatique

## Route par défaut

Route "attrape-tout" pour tout le trafic non matché :
```
0.0.0.0/0 via 192.168.1.254
```

Signifie : "Tout ce que je ne connais pas → envoyer à cette passerelle"

## Syntaxe générale

```
ip route [réseau destination] [masque] [next-hop ou interface]
```

**Next-hop** : IP du prochain routeur
**Interface** : Interface de sortie

## Avantages

✅ Contrôle total
✅ Pas de bande passante consommée (pas de protocole)
✅ Prévisible et stable
✅ Sécurisé (pas d'annonces dynamiques)

## Inconvénients

❌ Pas d'adaptation aux pannes
❌ Administration manuelle lourde
❌ Erreur humaine possible
❌ Ne scale pas

## Métrique

Si plusieurs routes existent, la plus **spécifique** (masque le plus long) gagne.

Exemple :
- Route 1 : `192.168.1.0/24`
- Route 2 : `192.168.1.0/28`
- Destination `192.168.1.10` → Route 2 (plus spécifique)

## Connexions

- [[Table de routage]] - Où sont stockées les routes
- [[RIP - Routing Information Protocol]] - Routage dynamique
- [[OSPF - Open Shortest Path First]] - Routage dynamique
- [[Route par défaut]] - Gateway of last resort

---
**Sources** : [[J1 - Formation Réseau|Formation Réseau - Jour 1]]
