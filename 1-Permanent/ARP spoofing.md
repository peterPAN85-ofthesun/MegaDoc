---
type: permanent
created: 2026-08-11 00:00
tags:
  - permanent
  - réseau
  - arp
  - sécurité
  - attaque
---

# ARP spoofing

> [!abstract] Concept
> L'ARP spoofing est une attaque man-in-the-middle où l'attaquant envoie de fausses réponses ARP pour associer sa propre adresse MAC à l'IP d'une machine légitime.

## Explication

Le protocole ARP n'intègre aucune authentification : n'importe quelle machine du réseau local peut envoyer une réponse ARP non sollicitée (**gratuitous ARP**), et les hôtes qui la reçoivent mettent à jour leur [[Table ARP]] sans vérification.

Un attaquant exploite cette faiblesse en envoyant des réponses ARP falsifiées à deux machines cibles (par exemple une victime et la passerelle), chacune associant l'IP de l'autre à la MAC de l'attaquant. Le trafic entre les deux machines transite alors par l'attaquant, qui peut l'intercepter, le modifier ou simplement l'écouter, avant de le relayer pour rester invisible.

<svg viewBox="0 0 440 240" width="100%" style="max-width:440px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ARP spoofing : l'attaquant s'intercale entre la victime et la passerelle">
<defs><marker id="asA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#e05252"/></marker>
<marker id="asB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<rect x="16" y="60" width="96" height="44" rx="5" fill="none" stroke="currentColor" stroke-width="1.5"/>
<text x="36" y="78" font-size="11" fill="currentColor">VICTIME</text>
<text x="22" y="95" font-size="9.5" fill="currentColor" opacity="0.8">192.168.1.10</text>
<rect x="328" y="60" width="96" height="44" rx="5" fill="none" stroke="currentColor" stroke-width="1.5"/>
<text x="340" y="78" font-size="11" fill="currentColor">PASSERELLE</text>
<text x="336" y="95" font-size="9.5" fill="currentColor" opacity="0.8">192.168.1.1</text>
<line x1="112" y1="72" x2="326" y2="72" stroke="currentColor" stroke-width="1.2" stroke-dasharray="5 4" opacity="0.5" marker-end="url(#asB)"/>
<text x="150" y="64" font-size="10" fill="currentColor" opacity="0.6">trafic légitime attendu</text>
<rect x="160" y="160" width="120" height="48" rx="5" fill="#e05252" fill-opacity="0.12" stroke="#e05252" stroke-width="1.6"/>
<text x="180" y="180" font-size="11" fill="#e05252">ATTAQUANT</text>
<text x="170" y="197" font-size="9.5" fill="#e05252">MA:C:AT:TA:QU:AN</text>
<path d="M 112 96 L 160 168" stroke="#e05252" stroke-width="2" marker-end="url(#asA)"/>
<path d="M 328 96 L 280 168" stroke="#e05252" stroke-width="2" marker-end="url(#asA)"/>
<text x="20" y="134" font-size="9.5" fill="#e05252">« 192.168.1.1</text>
<text x="20" y="147" font-size="9.5" fill="#e05252">est à MA:C:AT… »</text>
<text x="322" y="134" font-size="9.5" fill="#e05252">« 192.168.1.10</text>
<text x="322" y="147" font-size="9.5" fill="#e05252">est à MA:C:AT… »</text>
<path d="M 160 184 C 120 184 110 140 112 104" fill="none" stroke="#e05252" stroke-width="1.4" stroke-dasharray="4 3"/>
<path d="M 280 184 C 320 184 330 140 328 104" fill="none" stroke="#e05252" stroke-width="1.4" stroke-dasharray="4 3"/>
<text x="140" y="228" font-size="10.5" fill="#e05252">tout le trafic transite par lui, puis est relayé : l'attaque reste invisible</text>
<text x="16" y="24" font-size="12" fill="currentColor">gratuitous ARP falsifié : chaque cible associe l'IP de l'autre à la MAC de l'attaquant</text>
</svg>

## Exemples

Scénario typique :
1. Victime (192.168.1.10) ↔ Passerelle (192.168.1.1) communiquent normalement
2. Attaquant envoie à la victime : "192.168.1.1 est à MA:C:AT:TA:QU:AN"
3. Attaquant envoie à la passerelle : "192.168.1.10 est à MA:C:AT:TA:QU:AN"
4. Tout le trafic victime ↔ passerelle passe désormais par l'attaquant

## Cas d'usage

- Interception de trafic non chiffré (mots de passe, sessions HTTP)
- Point de départ pour des attaques de type DNS spoofing ou SSL stripping
- Scénario de test lors d'audits de sécurité réseau (pentest interne)

## Connexions

### Notes liées
- [[ARP - Address Resolution Protocol]] - Protocole exploité par l'attaque
- [[Table ARP]] - Cache corrompu par les fausses réponses
- [[DHCP - snooping protection]] - Dynamic ARP Inspection (DAI) protège contre ce type d'attaque

### Contexte
Attaque classique de couche 2, souvent citée en formation sécurité réseau comme illustration du manque d'authentification dans les protocoles réseau historiques.

## Sources
- [[ARP - Address Resolution Protocol]]
- [[Filtrage Firewall]]

---
**Tags thématiques** : #sécurité #arp #mitm #layer2
