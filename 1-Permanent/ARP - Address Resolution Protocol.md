---
type: permanent
created: 2025-01-08 01:52
tags:
  - permanent
  - réseau
  - arp
  - protocole
---

# ARP - Address Resolution Protocol

> [!abstract] Concept
> L'ARP permet de trouver l'adresse MAC (physique) correspondant à une adresse IP sur un réseau local.

## Explication

Sur un réseau local Ethernet, les machines communiquent via des adresses MAC. ARP fait le lien entre l'adresse IP (logique) et l'adresse MAC (physique).

**Principe** :
1. Machine A veut envoyer à `192.168.1.10`
2. Machine A diffuse : "Qui a l'IP 192.168.1.10 ?"
3. Machine avec cette IP répond : "C'est moi, MAC = AA:BB:CC:DD:EE:FF"
4. Machine A stocke l'association dans sa **table ARP**

## Table ARP (Cache)

Association temporaire IP ↔ MAC :
```
IP Address        MAC Address
192.168.1.1       00:11:22:33:44:55
192.168.1.10      AA:BB:CC:DD:EE:FF
```

**Durée de vie** : Quelques minutes (évite broadcasts répétés)

## Requête ARP

- **ARP Request** : Broadcast (FF:FF:FF:FF:FF:FF)
- **ARP Reply** : Unicast (réponse directe)

## RARP (Reverse ARP)

Inverse d'ARP : MAC → IP
Obsolète, remplacé par DHCP.

## Problèmes de sécurité

**ARP Spoofing** : Attaque man-in-the-middle
- Attaquant envoie fausses réponses ARP
- Redirige le trafic vers lui-même
- Solution : ARP statique ou sécurité switch (DHCP snooping)

## Connexions

- [[Table ARP]] - Cache des associations
- [[ARP spoofing]] - Attaque réseau
- Commande `arp -a` (Windows/Linux)

---
**Sources** : [[J1 - Formation Réseau|Formation Réseau - Jour 1]], Glossaire
