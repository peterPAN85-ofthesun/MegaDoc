---
type: permanent
created: 2026-08-11 00:00
tags:
  - permanent
  - réseau
  - ip
  - adressage
---

# Classe réseau A B C

> [!abstract] Concept
> Le classful addressing historique divise l'espace d'adressage IPv4 en classes (A, B, C, D, E) identifiables par les premiers bits de l'adresse, chacune avec une taille de réseau par défaut différente.

## Explication

Avant l'adoption du CIDR (masques de longueur variable), les adresses IPv4 étaient classées selon la valeur de leurs premiers bits, ce qui déterminait automatiquement la taille du masque par défaut :

| Classe | Premier octet | Masque par défaut | Usage |
|--------|---------------|--------------------|-------|
| **A** | 1 - 126 | /8 (255.0.0.0) | Très grands réseaux |
| **B** | 128 - 191 | /16 (255.255.0.0) | Réseaux moyens |
| **C** | 192 - 223 | /24 (255.255.255.0) | Petits réseaux |
| **D** | 224 - 239 | — | Multicast |
| **E** | 240 - 255 | — | Réservé/expérimental |

Ce système rigide a été remplacé par le **CIDR** (Classless Inter-Domain Routing) dans les années 1990, qui permet des masques de n'importe quelle longueur et un usage bien plus efficace de l'espace d'adressage. Les classes restent toutefois une référence historique utile pour comprendre les plages RFC 1918.

## Exemples

- `10.0.0.0` → Classe A → plage privée [[RFC 1918 - adressage IP privé]] `10.0.0.0/8`
- `172.20.5.1` → Classe B → plage privée `172.16.0.0/12`
- `192.168.1.1` → Classe C → plage privée `192.168.0.0/16`

## Cas d'usage

- Comprendre pourquoi les plages RFC 1918 correspondent à une adresse de chaque classe (A, B, C)
- Lire une documentation ou un examen de certification réseau qui utilise encore cette terminologie
- Base historique pour comprendre l'évolution vers le CIDR et le subnetting moderne

## Connexions

### Notes liées
- [[RFC 1918 - adressage IP privé]] - Une plage privée par classe historique
- [[Sous-réseau - Subnetting]] - Système moderne qui a remplacé le classful addressing

### Contexte
Concept aujourd'hui obsolète en pratique (remplacé par le CIDR), mais encore enseigné car il explique la structure des plages d'adresses privées et reste présent dans le vocabulaire réseau courant.

## Sources
- [[RFC 1918 - adressage IP privé]]
- Fiche adressage IP

---
**Tags thématiques** : #réseau #ip #classful #historique
