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
