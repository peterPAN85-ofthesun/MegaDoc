---
type: permanent
created: 2025-01-08 02:02
tags:
  - permanent
  - réseau
  - ip
  - adressage
---

# Adressage IP privé RFC 1918

> [!abstract] Concept
> La RFC 1918 définit des plages d'adresses IP réservées aux réseaux privés, non routables sur Internet.

## Plages privées

| Classe | Plage | CIDR | Nombre d'adresses |
|--------|-------|------|-------------------|
| **A** | 10.0.0.0 - 10.255.255.255 | 10.0.0.0/8 | 16 777 216 |
| **B** | 172.16.0.0 - 172.31.255.255 | 172.16.0.0/12 | 1 048 576 |
| **C** | 192.168.0.0 - 192.168.255.255 | 192.168.0.0/16 | 65 536 |

## Caractéristiques

**Non routables sur Internet** :
- Les routeurs Internet rejettent ces adresses
- Doivent passer par NAT pour accéder à Internet

**Réutilisables** :
- Chaque entreprise peut utiliser 10.0.0.0/8
- Pas de conflit car isolé par NAT

## Cas d'usage

**Classe A (10.x.x.x)** :
- Grandes entreprises
- Data centers
- Réseaux avec beaucoup d'équipements

**Classe B (172.16.x.x - 172.31.x.x)** :
- Moyennes entreprises
- Campus
- Divisions d'entreprise

**Classe C (192.168.x.x)** :
- Réseaux domestiques
- PME
- Réseaux de test

## Éviter les conflits VPN

Si deux réseaux privés se connectent via VPN et utilisent la même plage, conflit !

**Solution** : Utiliser des plages différentes
- Site A : `10.1.0.0/16`
- Site B : `10.2.0.0/16`
- Pas de chevauchement

## Autres plages réservées

- **127.0.0.0/8** : Loopback (localhost)
- **169.254.0.0/16** : APIPA (auto-configuration)
- **224.0.0.0/4** : Multicast (Classe D)
- **100.64.0.0/10** : Carrier-Grade NAT (CGN)

## Connexions

- [[NAT - Network Address Translation]] - Pour accéder à Internet
- [[Sous-réseau - Subnetting]] - Découper les plages
- [[Classe réseau A B C]] - Classification

---
**Sources** : RFC 1918, Fiche NAT
