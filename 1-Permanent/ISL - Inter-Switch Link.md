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

<svg viewBox="0 0 440 200" width="100%" style="max-width:440px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ISL encapsule la trame entière, 802.1Q insère 4 octets">
<text x="16" y="24" font-size="12" fill="#f2994a">ISL (Cisco, obsolète) — encapsulation complète : +30 octets</text>
<rect x="20" y="34" width="104" height="32" rx="3" fill="#f2994a" fill-opacity="0.2" stroke="#f2994a" stroke-width="1.5"/>
<text x="28" y="54" font-size="10.5" fill="#f2994a">En-tête ISL 26 o.</text>
<rect x="124" y="34" width="230" height="32" rx="3" fill="none" stroke="currentColor" stroke-width="1.4"/>
<text x="176" y="54" font-size="11" fill="currentColor">trame Ethernet originale intacte</text>
<rect x="354" y="34" width="60" height="32" rx="3" fill="#f2994a" fill-opacity="0.2" stroke="#f2994a" stroke-width="1.5"/>
<text x="362" y="54" font-size="10.5" fill="#f2994a">CRC 4 o.</text>
<text x="16" y="108" font-size="12" fill="#4c9aff">802.1Q (standard IEEE) — insertion : +4 octets</text>
<rect x="20" y="118" width="130" height="32" rx="3" fill="none" stroke="currentColor" stroke-width="1.4"/>
<text x="34" y="138" font-size="10.5" fill="currentColor">MAC Dest + Src</text>
<rect x="150" y="118" width="54" height="32" rx="3" fill="#4c9aff" fill-opacity="0.22" stroke="#4c9aff" stroke-width="1.6"/>
<text x="160" y="138" font-size="10.5" fill="#4c9aff">tag 4 o.</text>
<rect x="204" y="118" width="210" height="32" rx="3" fill="none" stroke="currentColor" stroke-width="1.4"/>
<text x="258" y="138" font-size="10.5" fill="currentColor">Type + Données + FCS</text>
<text x="16" y="176" font-size="11" fill="currentColor" opacity="0.85">ISL : plus lourd en bande passante et propriétaire Cisco — incompatible multi-constructeur</text>
<text x="16" y="192" font-size="11" fill="currentColor" opacity="0.85">802.1Q : ouvert, léger, supporté partout — y compris chez Cisco aujourd'hui</text>
</svg>

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
