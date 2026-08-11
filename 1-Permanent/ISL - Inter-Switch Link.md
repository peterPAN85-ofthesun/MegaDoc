---
type: permanent
created: 2026-08-11 00:00
tags:
  - permanent
  - réseau
  - vlan
  - cisco
  - protocole
---

# ISL - Inter-Switch Link

> [!abstract] Concept
> ISL est un protocole propriétaire Cisco, antérieur au 802.1Q, permettant de transporter plusieurs VLANs sur un même lien trunk en encapsulant chaque trame Ethernet.

## Explication

Avant la standardisation IEEE 802.1Q, Cisco utilisait son propre protocole de trunking : **ISL**. Contrairement au 802.1Q qui ajoute un simple tag de 4 octets à la trame existante, ISL **encapsule entièrement** la trame Ethernet d'origine dans un en-tête ISL (26 octets) suivi d'un CRC de fin (4 octets).

Cette encapsulation complète rend ISL plus lourd en bande passante que 802.1Q, et surtout **incompatible avec du matériel non-Cisco**, contrairement au 802.1Q qui est un standard ouvert supporté par tous les constructeurs.

## Exemples

Structure d'une trame ISL :
```
[En-tête ISL 26 octets][Trame Ethernet originale][CRC 4 octets]
```

À comparer avec 802.1Q qui insère seulement 4 octets dans la trame existante (voir [[802.1Q - tagging VLAN]]).

## Cas d'usage

- Ancien matériel Cisco (Catalyst des années 1990-2000)
- Aujourd'hui **obsolète** : tout équipement moderne utilise 802.1Q, y compris chez Cisco

## Connexions

### Notes liées
- [[802.1Q - tagging VLAN]] - Standard ouvert qui a remplacé ISL
- [[VLAN Cisco - Port trunk et 802.1Q]] - Configuration trunk moderne (802.1Q)
- [[VLAN - mode access vs trunk]] - Contexte d'utilisation du trunking

### Contexte
Connaître ISL aide à comprendre pourquoi 802.1Q s'est imposé comme standard : interopérabilité multi-constructeurs et overhead réduit.

## Sources
- [[802.1Q - tagging VLAN]]
- Fiche VLANs

---
**Tags thématiques** : #réseau #vlan #cisco #obsolète
