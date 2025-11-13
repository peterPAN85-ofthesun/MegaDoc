---
type: permanent
created: 2025-01-08 15:30
tags:
  - permanent
  - réseau
  - dhcp
  - cisco
  - configuration
---

# DHCP Cisco - Configuration de base

> [!abstract] Concept
> Configuration minimale d'un serveur DHCP sur routeur Cisco avec pool, passerelle et exclusions

## Explication

La configuration DHCP de base sur Cisco nécessite 4 étapes essentielles :
1. **Exclure les adresses réservées** (serveurs, imprimantes, équipements réseau)
2. **Créer un pool DHCP** avec un nom descriptif
3. **Définir le réseau** à servir (network + masque)
4. **Configurer les options** : passerelle, DNS, domaine, durée de bail

Le routeur devient alors serveur DHCP pour le réseau local et répond aux requêtes DORA des clients.

## Exemples

### Configuration minimale

```
Router(config)# ip dhcp excluded-address 192.168.1.1 192.168.1.50
Router(config)# ip dhcp pool LAN_POOL
Router(dhcp-config)# network 192.168.1.0 255.255.255.0
Router(dhcp-config)# default-router 192.168.1.254
Router(dhcp-config)# dns-server 8.8.8.8 8.8.4.4
Router(dhcp-config)# domain-name exemple.local
Router(dhcp-config)# lease 7
```

### Durées de bail (lease time)

- `lease 7` → 7 jours
- `lease 0 12` → 12 heures
- `lease 0 0 30` → 30 minutes
- `lease infinite` → Permanent (déconseillé)

### Options DHCP courantes

| Option | Commande | Description |
|--------|----------|-------------|
| 3 | `default-router` | Passerelle par défaut |
| 6 | `dns-server` | Serveurs DNS |
| 15 | `domain-name` | Nom de domaine |
| 42 | `ntp-server` | Serveur NTP |
| 66 | `option 66 ascii` | Serveur TFTP (nom) |
| 150 | `option 150 ip` | Serveur TFTP (IP) - Cisco |

### Gestion du service

```
# Désactiver temporairement
Router(config)# no service dhcp

# Réactiver
Router(config)# service dhcp
```

## Connexions

### Notes liées
- [[DHCP - Dynamic Host Configuration]] - Concept et protocole DORA
- [[DHCP Cisco - Réservations MAC]] - Attribution IP fixe par MAC
- [[DHCP Cisco - Multi-VLAN]] - Configuration pour plusieurs réseaux
- [[DHCP Cisco - Relay Agent]] - Relayer DHCP entre réseaux

### Contexte
Configuration de base indispensable pour tout réseau d'entreprise. Permet l'attribution automatique d'adresses IP aux clients. À combiner avec DHCP Snooping pour la sécurité.

## Sources
- Formation Réseau - Configuration Cisco IOS
- Cisco IOS DHCP Server documentation

---
**Tags thématiques** : #cisco #dhcp #pool #configuration-réseau
