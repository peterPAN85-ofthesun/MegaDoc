---
type: permanent
created: 2025-01-08 01:50
tags:
  - permanent
  - réseau
  - dns
  - protocole
---

# DNS - Domain Name System

> [!abstract] Concept
> Le DNS traduit les noms de domaine (ex: google.com) en adresses IP (ex: 142.250.185.46).

## Explication

Le DNS est l'annuaire d'Internet. Il permet aux humains d'utiliser des noms mémorisables au lieu de retenir des adresses IP.

**Principe** :
1. Utilisateur tape `www.google.com`
2. Requête DNS envoyée au serveur DNS
3. Serveur DNS répond avec l'IP `142.250.185.46`
4. Connexion établie vers cette IP

## Hiérarchie DNS

```
. (root)
 ├── .com
 │   └── google.com
 │       └── www.google.com
 ├── .fr
 └── .org
```

## Types d'enregistrements

| Type | Fonction |
|------|----------|
| **A** | Nom → IPv4 |
| **AAAA** | Nom → IPv6 |
| **CNAME** | Alias (redirection) |
| **MX** | Serveur mail |
| **NS** | Serveur DNS autoritaire |
| **PTR** | IP → Nom (DNS inversé) |

## Port

**Port 53** (UDP et TCP)

## Avantages

✅ Noms mémorisables
✅ Flexibilité (changement d'IP transparent)
✅ Répartition de charge (plusieurs IP pour 1 nom)

## Connexions

- [[DNS inversé - PTR]] - Résolution IP → Nom
- [[DHCP - Dynamic Host Configuration]] - Souvent couplé avec DNS

**Voir aussi** :
- Commande `nslookup` (Windows)
- Commande `dig` (Linux)

---
**Sources** : [[J1 - Formation Réseau|Formation Réseau - Jour 1]], Glossaire
