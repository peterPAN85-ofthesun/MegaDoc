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

<svg viewBox="0 0 440 225" width="100%" style="max-width:440px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Résolution ARP : requête broadcast puis réponse unicast">
<defs><marker id="apA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#4c9aff"/></marker>
<marker id="apB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#27ae60"/></marker></defs>
<rect x="16" y="66" width="86" height="42" rx="5" fill="none" stroke="currentColor" stroke-width="1.5"/>
<text x="42" y="84" font-size="11" fill="currentColor">PC A</text>
<text x="22" y="100" font-size="9.5" fill="currentColor" opacity="0.8">192.168.1.5</text>
<rect x="170" y="60" width="100" height="54" rx="5" fill="none" stroke="currentColor" stroke-width="1.5"/>
<text x="196" y="82" font-size="11" fill="currentColor">SWITCH</text>
<text x="182" y="100" font-size="9.5" fill="currentColor" opacity="0.7">domaine de broadcast</text>
<rect x="336" y="66" width="88" height="42" rx="5" fill="none" stroke="#27ae60" stroke-width="1.5"/>
<text x="362" y="84" font-size="11" fill="#27ae60">PC B</text>
<text x="342" y="100" font-size="9.5" fill="#27ae60">192.168.1.10</text>
<line x1="102" y1="78" x2="168" y2="78" stroke="#4c9aff" stroke-width="1.8" marker-end="url(#apA)"/>
<line x1="270" y1="78" x2="334" y2="78" stroke="#4c9aff" stroke-width="1.8" marker-end="url(#apA)"/>
<text x="96" y="52" font-size="10.5" fill="#4c9aff">1. « Qui a 192.168.1.10 ? » — broadcast FF:FF:FF:FF:FF:FF</text>
<line x1="334" y1="104" x2="272" y2="104" stroke="#27ae60" stroke-width="1.8" marker-end="url(#apB)"/>
<line x1="168" y1="104" x2="104" y2="104" stroke="#27ae60" stroke-width="1.8" marker-end="url(#apB)"/>
<text x="120" y="130" font-size="10.5" fill="#27ae60">2. « C'est moi : AA:BB:CC:DD:EE:FF » — unicast</text>
<rect x="60" y="148" width="320" height="52" rx="5" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-width="1"/>
<text x="70" y="166" font-size="10.5" fill="currentColor" opacity="0.9">3. table ARP de PC A (cache temporaire)</text>
<text x="70" y="186" font-size="10.5" fill="currentColor">192.168.1.10   →   AA:BB:CC:DD:EE:FF</text>
<text x="16" y="24" font-size="12" fill="currentColor">ARP fait le pont entre l'adresse logique (IP) et l'adresse physique (MAC)</text>
<text x="16" y="218" font-size="11" fill="currentColor" opacity="0.75">aucune authentification dans le protocole : toute réponse est crue sur parole</text>
</svg>

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
