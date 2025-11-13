---
type: permanent
created: 2025-01-08 15:36
tags:
  - permanent
  - réseau
  - dhcp
  - relay
  - cisco
---

# DHCP Cisco - Relay Agent

> [!abstract] Concept
> Relayer les requêtes DHCP (broadcasts) vers un serveur DHCP distant sur un autre réseau

## Explication

Le **DHCP Relay** (agent de relais) permet à un routeur de transférer les broadcasts DHCP vers un serveur DHCP situé sur un réseau différent.

**Problème** : Les broadcasts ne traversent pas les routeurs par défaut
**Solution** : `ip helper-address` convertit le broadcast en unicast vers le serveur

Architecture typique :
```
[Clients VLAN 10] ─ [Switch] ─ [Router avec relay] ─ [Serveur DHCP 10.0.0.5]
```

Le routeur relaie pour le compte des clients qui ne peuvent pas atteindre directement le serveur.

## Exemples

### Configuration sur interface VLAN

```
Router(config)# interface vlan 10
Router(config-if)# ip address 192.168.10.254 255.255.255.0
Router(config-if)# ip helper-address 10.0.0.5
Router(config-if)# exit
```

Le routeur relaie les requêtes DHCP de VLAN 10 vers le serveur `10.0.0.5`.

### Multi-VLAN avec serveur centralisé

```
# VLAN 10
Router(config)# interface vlan 10
Router(config-if)# ip helper-address 10.0.0.5

# VLAN 20
Router(config)# interface vlan 20
Router(config-if)# ip helper-address 10.0.0.5

# VLAN 30
Router(config)# interface vlan 30
Router(config-if)# ip helper-address 10.0.0.5
```

Un seul serveur DHCP centralisé sert tous les VLANs.

### Services relayés par ip helper-address

Par défaut, `ip helper-address` relaie :
- **DHCP** (ports UDP 67/68) ✓
- DNS (port 53)
- TFTP (port 69)
- NetBIOS (ports 137/138)
- TACACS (port 49)

### Relayer uniquement DHCP

Pour désactiver le relay des autres protocoles :

```
Router(config)# no ip forward-protocol udp tftp
Router(config)# no ip forward-protocol udp dns
Router(config)# no ip forward-protocol udp netbios-ns
Router(config)# no ip forward-protocol udp netbios-dgm
```

### Vérification

```
Router# show ip interface vlan 10
Router# show running-config interface vlan 10
```

Chercher la ligne `ip helper-address`.

## Connexions

### Notes liées
- [[DHCP - Dynamic Host Configuration]] - Processus DORA
- [[DHCP Cisco - Multi-VLAN]] - Serveur local multi-VLAN
- [[ROUTAGE - statique]] - Communication inter-réseau
- [[VLAN - Virtual LAN]] - Segmentation réseau

### Contexte
Utile pour centraliser le serveur DHCP en entreprise (Windows Server, Linux ISC-DHCP) plutôt que configurer DHCP sur chaque routeur. Simplifie la gestion et la supervision.

## Sources
- Formation Réseau - DHCP Relay
- Cisco IOS IP Helper Address

---
**Tags thématiques** : #dhcp #relay #helper-address #broadcast
