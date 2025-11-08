---
type: permanent
created: 2025-01-08 01:41
tags:
  - permanent
  - réseau
  - nat
  - pat
---

# PAT - Port Address Translation

> [!abstract] Concept
> Le PAT (NAT Overload) permet à plusieurs machines de partager une seule IP publique en utilisant différents ports sources.

## Explication

Extension du NAT qui traduit IP **+ port source**, permettant à des milliers de machines de partager 1 seule IP publique.

**Exemple** :
```
192.168.1.10:5234  →  203.0.113.1:1024  →  8.8.8.8:80
192.168.1.11:6781  →  203.0.113.1:1025  →  1.1.1.1:443
192.168.1.12:8192  →  203.0.113.1:1026  →  93.184.216.34:80
```

Le routeur maintient une **table de translation** :
- IP privée:Port privé ↔ IP publique:Port public

## NAT vs PAT

**NAT classique** : Traduit uniquement l'IP
**PAT** : Traduit IP + port → ~65000 connexions par IP publique

## Terminologie

| Cisco | Linux | Signification |
|-------|-------|---------------|
| NAT Overload | MASQUERADE | PAT avec IP dynamique |
| PAT | SNAT | PAT avec IP fixe |

## Limitations

- Environ 65000 ports par IP publique
- Problèmes avec : FTP, SIP, gaming P2P, VPN

## Connexions

- [[NAT - Network Address Translation]] - Concept parent
- [[Port forwarding]] - Inverse (connexions entrantes)
- [[SNAT - Source NAT]] - Implémentation Linux

**Configuration** :
- [[MOC - Configuration NAT Cisco]]
- [[MOC - Configuration NAT Linux]]

---
**Sources** : [[Formation Réseau - Jour 2]]
