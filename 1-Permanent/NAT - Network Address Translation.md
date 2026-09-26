---
type: permanent
created: 2025-01-08 01:40
tags:
  - permanent
  - réseau
  - nat
  - protocole
---

# NAT - Network Address Translation

> [!abstract] Concept
> Le NAT traduit des adresses IP privées en adresse(s) IP publique(s) pour accéder à Internet, économisant les adresses IPv4.

## Explication

Le NAT résout la pénurie d'adresses IPv4 en permettant à plusieurs machines d'un réseau privé de partager une ou plusieurs IP publiques.

**Principe** :
1. Machine privée (192.168.1.10) → envoie requête
2. Routeur NAT → remplace IP privée par IP publique
3. Réponse revient au routeur
4. Routeur → retransmet à la machine privée

<svg viewBox="0 0 440 230" width="100%" style="max-width:440px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Le routeur NAT traduit les adresses privées en adresse publique">
<defs><marker id="natA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#4c9aff"/></marker>
<marker id="natB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#f2994a"/></marker></defs>
<rect x="16" y="52" width="110" height="108" rx="8" fill="#4c9aff" fill-opacity="0.07" stroke="#4c9aff" stroke-width="1.2" stroke-dasharray="4 3"/>
<text x="26" y="70" font-size="11" fill="#4c9aff">LAN privé (RFC 1918)</text>
<rect x="28" y="80" width="86" height="24" rx="4" fill="none" stroke="#4c9aff" stroke-width="1.3"/>
<text x="34" y="96" font-size="10" fill="#4c9aff">192.168.1.10</text>
<rect x="28" y="112" width="86" height="24" rx="4" fill="none" stroke="#4c9aff" stroke-width="1.3"/>
<text x="34" y="128" font-size="10" fill="#4c9aff">192.168.1.11</text>
<rect x="166" y="80" width="104" height="60" rx="6" fill="none" stroke="currentColor" stroke-width="1.8"/>
<text x="188" y="104" font-size="12" fill="currentColor">ROUTEUR</text>
<text x="202" y="122" font-size="12" fill="currentColor">NAT</text>
<rect x="320" y="84" width="104" height="50" rx="25" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="348" y="114" font-size="12" fill="currentColor">Internet</text>
<line x1="126" y1="100" x2="164" y2="100" stroke="#4c9aff" stroke-width="1.8" marker-end="url(#natA)"/>
<line x1="272" y1="100" x2="318" y2="100" stroke="#f2994a" stroke-width="1.8" marker-end="url(#natB)"/>
<text x="272" y="92" font-size="10" fill="#f2994a">203.0.113.1</text>
<line x1="318" y1="124" x2="274" y2="124" stroke="#f2994a" stroke-width="1.4" stroke-dasharray="4 3" marker-end="url(#natB)"/>
<line x1="164" y1="124" x2="128" y2="124" stroke="#4c9aff" stroke-width="1.4" stroke-dasharray="4 3" marker-end="url(#natA)"/>
<text x="150" y="160" font-size="10" fill="currentColor" opacity="0.75">retour : traduction inverse</text>
<rect x="150" y="172" width="240" height="44" rx="5" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-width="1"/>
<text x="158" y="188" font-size="10" fill="currentColor" opacity="0.9">table de translation (état de la connexion)</text>
<text x="158" y="204" font-size="10" fill="currentColor" opacity="0.9">192.168.1.10:5234  ↔  203.0.113.1:1024</text>
<text x="16" y="26" font-size="12" fill="currentColor">N adresses privées → 1 (ou quelques) adresse publique : l'économie d'IPv4</text>
<text x="16" y="42" font-size="11" fill="currentColor" opacity="0.75">sans entrée dans la table, aucun retour n'est possible : le NAT est un pare-feu de fait</text>
</svg>

## Types de NAT

| Type | Ratio | Usage |
|------|-------|-------|
| **NAT Statique** | 1:1 | Serveurs accessibles depuis Internet |
| **NAT Dynamique** | N:N | Pool d'IP partagées |
| **PAT/Overload** | N:1 | Box Internet, partage d'1 IP |

## Adresses privées (RFC 1918)

- Classe A : `10.0.0.0/8` (16M adresses)
- Classe B : `172.16.0.0/12` (1M adresses)
- Classe C : `192.168.0.0/16` (65k adresses)

Ces adresses ne sont **pas routables** sur Internet.

## Avantages / Inconvénients

✅ Économise les IP publiques
✅ Masque la topologie interne (sécurité)

❌ Casse le principe end-to-end
❌ Problèmes avec FTP, SIP, VoIP

## Connexions

- [[PAT - Port Address Translation]] - NAT avec ports
- [[NAT - source NAT (SNAT)]] - NAT sortant (Linux)
- [[NAT - destination NAT (DNAT)]] - NAT entrant (Linux)
- [[NAT - port forwarding]] - Redirection de ports

**Configuration** :
- [[MOC - Réseau]]

**Voir aussi** : ![[Assets/Reseau/Ex NAT.canvas]]

---
**Sources** : [[J2 - Formation Réseau|Formation Réseau - Jour 2]], RFC 1918, RFC 3022
