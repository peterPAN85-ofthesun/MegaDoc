---
type: permanent
created: 2026-08-11 00:00
tags:
  - permanent
  - réseau
  - ip
  - adressage
---

# Sous-réseau - Subnetting

> [!abstract] Concept
> Le subnetting consiste à découper un réseau IP en plusieurs sous-réseaux plus petits, en empruntant des bits à la partie hôte de l'adresse pour étendre le masque.

## Explication

Une adresse IP se compose d'une partie réseau et d'une partie hôte, délimitées par le masque de sous-réseau. Le subnetting **allonge le masque** (ex: passer de /24 à /26) pour créer plusieurs sous-réseaux à partir d'un seul bloc d'adresses, au prix d'une réduction du nombre d'hôtes disponibles par sous-réseau.

Chaque bit emprunté à la partie hôte double le nombre de sous-réseaux possibles et divise par deux le nombre d'hôtes utilisables par sous-réseau.

## Exemples

Réseau de départ : `192.168.1.0/24` (254 hôtes utilisables)

Découpage en 4 sous-réseaux avec /26 :
```
192.168.1.0/26    → 192.168.1.1   - 192.168.1.62   (62 hôtes)
192.168.1.64/26   → 192.168.1.65  - 192.168.1.126  (62 hôtes)
192.168.1.128/26  → 192.168.1.129 - 192.168.1.190  (62 hôtes)
192.168.1.192/26  → 192.168.1.193 - 192.168.1.254  (62 hôtes)
```

Formule : nombre d'hôtes utilisables = 2^(32-masque) - 2 (adresse réseau + broadcast réservées)

## Cas d'usage

- Segmenter un réseau `192.168.1.0/24` en un sous-réseau par [[VLAN - Virtual LAN|VLAN]] (administration, utilisateurs, invités…)
- Optimiser l'usage d'un bloc d'adresses privées ([[RFC 1918 - adressage IP privé]]) en évitant le gaspillage d'IP
- Isoler des segments réseau pour des raisons de sécurité ou de performance

## Connexions

### Notes liées
- [[RFC 1918 - adressage IP privé]] - Plages IP privées souvent subdivisées
- [[Classe réseau A B C]] - Classes historiques dont dérive le subnetting
- [[VLAN - Virtual LAN]] - Chaque VLAN correspond généralement à un sous-réseau

### Contexte
Compétence fondamentale en administration réseau, indispensable avant d'aborder le routage inter-VLAN ou la configuration DHCP par sous-réseau.

## Sources
- [[RFC 1918 - adressage IP privé]]
- [[J1 - Formation Réseau|Formation Réseau - Jour 1]]

---
**Tags thématiques** : #réseau #ip #subnetting
