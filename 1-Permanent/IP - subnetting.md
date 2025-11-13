---
type: permanent
created: 2025-01-08 19:50
tags:
  - permanent
  - réseau
  - ip
  - adressage
---

# Subnetting

> [!abstract] Concept
> Le subnetting consiste à diviser un réseau IP en plusieurs sous-réseaux plus petits, permettant une meilleure organisation, sécurité et optimisation de l'espace d'adressage.

## Explication

Le **subnetting** découpe un grand réseau en plusieurs petits réseaux (subnets) en modifiant le masque de sous-réseau.

**Exemple** :
```
Réseau initial : 192.168.1.0/24 (256 adresses)

Après subnetting (/26) :
- 192.168.1.0/26    → 64 adresses (VLAN 10 - Admin)
- 192.168.1.64/26   → 64 adresses (VLAN 20 - Users)
- 192.168.1.128/26  → 64 adresses (VLAN 30 - Invités)
- 192.168.1.192/26  → 64 adresses (VLAN 40 - IoT)
```

## Masque de sous-réseau

### Notation

**Décimale** : `255.255.255.0`
**CIDR** : `/24` (24 bits à 1)
**Binaire** : `11111111.11111111.11111111.00000000`

### Masques courants

| CIDR | Masque décimal | Hôtes utilisables | Usage |
|------|----------------|-------------------|-------|
| /8 | 255.0.0.0 | 16 777 214 | Classe A (très rare) |
| /16 | 255.255.0.0 | 65 534 | Classe B |
| /24 | 255.255.255.0 | 254 | Classe C (standard PME) |
| /25 | 255.255.255.128 | 126 | Subnet /24 en 2 |
| /26 | 255.255.255.192 | 62 | Subnet /24 en 4 |
| /27 | 255.255.255.224 | 30 | Petit département |
| /28 | 255.255.255.240 | 14 | Très petit subnet |
| /29 | 255.255.255.248 | 6 | Lien point-to-point |
| /30 | 255.255.255.252 | 2 | Lien routeur ↔ routeur |
| /31 | 255.255.255.254 | 2 | RFC 3021 (point-to-point) |
| /32 | 255.255.255.255 | 1 | Hôte unique (loopback) |

## Calcul de subnetting

### Formules

**Nombre de subnets** : `2^bits empruntés`
**Hôtes par subnet** : `2^bits hôtes - 2`

### Exemple : 192.168.1.0/24 → /26

**Bits empruntés** : 26 - 24 = 2 bits
**Nombre de subnets** : 2² = 4 subnets
**Hôtes par subnet** : 2⁶ - 2 = 62 hôtes

**Résultats** :
```
Subnet 1 : 192.168.1.0/26
  - Réseau     : 192.168.1.0
  - Première IP: 192.168.1.1
  - Dernière IP: 192.168.1.62
  - Broadcast  : 192.168.1.63

Subnet 2 : 192.168.1.64/26
  - Réseau     : 192.168.1.64
  - Première IP: 192.168.1.65
  - Dernière IP: 192.168.1.126
  - Broadcast  : 192.168.1.127

Subnet 3 : 192.168.1.128/26
  - Réseau     : 192.168.1.128
  - Première IP: 192.168.1.129
  - Dernière IP: 192.168.1.190
  - Broadcast  : 192.168.1.191

Subnet 4 : 192.168.1.192/26
  - Réseau     : 192.168.1.192
  - Première IP: 192.168.1.193
  - Dernière IP: 192.168.1.254
  - Broadcast  : 192.168.1.255
```

## VLSM (Variable Length Subnet Mask)

**VLSM** permet d'utiliser des masques de longueurs différentes dans le même réseau.

**Exemple** : 192.168.1.0/24
- Admin (50 hôtes) → /26 (62 hôtes) → 192.168.1.0/26
- Users (100 hôtes) → /25 (126 hôtes) → 192.168.1.128/25
- Lien routeur (2 hôtes) → /30 (2 hôtes) → 192.168.1.64/30

**Avantage** : Optimisation de l'espace d'adressage (pas de gaspillage).

## Supernetting (Agrégation de routes)

**Inverse du subnetting** : Combiner plusieurs réseaux en un plus grand.

**Exemple** :
```
192.168.0.0/24
192.168.1.0/24
192.168.2.0/24
192.168.3.0/24

Agrégation : 192.168.0.0/22 (regroupe les 4)
```

**Usage** : Réduire taille des tables de routage.

## Outils de calcul

### Commande ipcalc (Linux)
```bash
ipcalc 192.168.1.0/24
```

Résultat :
```
Address:   192.168.1.0
Netmask:   255.255.255.0 = 24
Wildcard:  0.0.0.255
Network:   192.168.1.0/24
HostMin:   192.168.1.1
HostMax:   192.168.1.254
Broadcast: 192.168.1.255
Hosts/Net: 254
```

### Calculateurs en ligne
- subnet-calculator.com
- ipcalc.org

## Classes d'adresses (historique)

**Avant CIDR**, classes fixes :

| Classe | Plage | Masque par défaut | Usage |
|--------|-------|-------------------|-------|
| A | 1.0.0.0 - 126.255.255.255 | /8 | Très grandes organisations |
| B | 128.0.0.0 - 191.255.255.255 | /16 | Moyennes organisations |
| C | 192.0.0.0 - 223.255.255.255 | /24 | Petites organisations |
| D | 224.0.0.0 - 239.255.255.255 | N/A | Multicast |
| E | 240.0.0.0 - 255.255.255.255 | N/A | Expérimental |

**Aujourd'hui** : Classes obsolètes → CIDR utilisé partout.

## Adresses réservées

**Réseau** : Première adresse (tous bits hôtes à 0)
- Ex: 192.168.1.0/24 → 192.168.1.**0** = réseau

**Broadcast** : Dernière adresse (tous bits hôtes à 1)
- Ex: 192.168.1.0/24 → 192.168.1.**255** = broadcast

**Hôtes utilisables** : Entre réseau et broadcast
- Ex: 192.168.1.0/24 → 192.168.1.**1** à 192.168.1.**254**

## Planification d'adressage

**Bonne pratique** :
1. Inventorier besoins (nombre d'hôtes par réseau)
2. Ajouter marge de croissance (+30%)
3. Choisir masques appropriés
4. Documenter plan d'adressage

**Exemple entreprise** :
```
10.0.0.0/8 (réseau global privé)
├─ 10.1.0.0/16  : Siège social
│   ├─ 10.1.10.0/24 : VLAN Admin
│   ├─ 10.1.20.0/24 : VLAN Users
│   └─ 10.1.30.0/24 : VLAN Invités
├─ 10.2.0.0/16  : Site Paris
├─ 10.3.0.0/16  : Site Lyon
└─ 10.255.0.0/16 : Management
```

## Avantages du subnetting

✅ **Sécurité** : Isolation réseaux (VLANs, firewalls)
✅ **Performance** : Réduction broadcast domains
✅ **Organisation** : Segmentation logique (départements)
✅ **Optimisation** : Pas de gaspillage d'adresses
✅ **Routage** : Agrégation de routes (tables plus petites)

## Erreurs courantes

❌ **Oublier -2** : 2⁸ = 256, mais 254 hôtes utilisables
❌ **Utiliser réseau/broadcast** : Réservées
❌ **Overlap** : Subnets qui se chevauchent
❌ **Mauvais wildcard** : Cisco ACL (inverse du masque)

**Wildcard** (Cisco) :
- Masque : 255.255.255.0
- Wildcard : 0.0.0.255

## Connexions

- [[RFC 1918 - adressage IP privé]] - Plages privées à subnetter
- [[VLAN - Virtual LAN]] - Souvent 1 subnet = 1 VLAN
- [[ROUTAGE - statique]] - Routes entre subnets
- [[DHCP - Dynamic Host Configuration]] - Attribution IP par subnet

---
**Sources** : RFC 950 (Subnetting), RFC 4632 (CIDR), Cisco IP Addressing Guide
