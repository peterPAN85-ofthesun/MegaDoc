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
- [[SNAT - Source NAT]] - NAT sortant (Linux)
- [[DNAT - Destination NAT]] - NAT entrant (Linux)
- [[Port forwarding]] - Redirection de ports

**Configuration** :
- [[MOC - Configuration NAT Cisco]]
- [[MOC - Configuration NAT Linux]]

**Voir aussi** : ![[Ex NAT.canvas]]

---
**Sources** : [[Formation Réseau - Jour 2]], RFC 1918, RFC 3022
