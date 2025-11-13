---
type: permanent
created: 2025-01-08 16:04
tags:
  - permanent
  - réseau
  - nat
  - pat
  - cisco
  - overload
---

# NAT Cisco - PAT et NAT Overload

> [!abstract] Concept
> Partager une seule IP publique pour tout le réseau privé via translation de ports (PAT)

## Explication

**PAT (Port Address Translation)** ou **NAT Overload** permet de traduire **plusieurs adresses privées** vers **une seule IP publique** en utilisant des **ports source différents**.

**Principe** :
- Chaque connexion sortante reçoit un port source unique
- Le routeur maintient une table (IP privée + port) ↔ (IP publique + port traduit)
- Limite théorique : ~65000 connexions simultanées par IP publique

**Différence vs NAT dynamique** :
- NAT dynamique : pool d'IP publiques, 1 IP par hôte
- PAT : 1 seule IP publique, différenciée par ports

**Cas d'usage** : PME/particuliers avec 1 seule IP publique pour tout le réseau.

## Exemples

### PAT avec IP de l'interface

```cisco
# ACL pour définir le réseau à traduire
Router(config)# access-list 1 permit 192.168.1.0 0.0.0.255

# PAT avec l'IP de GigabitEthernet0/0
Router(config)# ip nat inside source list 1 interface GigabitEthernet0/0 overload
```

**Mot-clé `overload`** : active le PAT

**Avantage** : pas besoin de connaître l'IP publique (DHCP sur WAN)

### PAT avec IP publique fixe

```cisco
Router(config)# access-list 1 permit 192.168.1.0 0.0.0.255

# PAT vers IP publique 203.0.113.1
Router(config)# ip nat inside source list 1 pool PUBLIC overload

# Pool avec 1 seule IP
Router(config)# ip nat pool PUBLIC 203.0.113.1 203.0.113.1 netmask 255.255.255.252
```

### PAT pour plusieurs réseaux

```cisco
# ACL pour VLAN 10
Router(config)# access-list 10 permit 192.168.10.0 0.0.0.255

# ACL pour VLAN 20
Router(config)# access-list 20 permit 192.168.20.0 0.0.0.255

# PAT global
Router(config)# ip nat inside source list 10 interface GigabitEthernet0/0 overload
Router(config)# ip nat inside source list 20 interface GigabitEthernet0/0 overload
```

### Configuration complète

```cisco
# Interface WAN
Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip address dhcp
Router(config-if)# ip nat outside
Router(config-if)# exit

# Interface LAN
Router(config)# interface GigabitEthernet0/1
Router(config-if)# ip address 192.168.1.254 255.255.255.0
Router(config-if)# ip nat inside
Router(config-if)# exit

# ACL réseau LAN
Router(config)# access-list 1 permit 192.168.1.0 0.0.0.255

# PAT
Router(config)# ip nat inside source list 1 interface GigabitEthernet0/0 overload

Router(config)# end
Router# write memory
```

### Vérification translations PAT

```cisco
# Voir translations actives
Router# show ip nat translations

# Compter les connexions
Router# show ip nat translations | count

# Statistiques
Router# show ip nat statistics
```

**Sortie type** :
```
Pro Inside global         Inside local          Outside local         Outside global
tcp 203.0.113.1:1024      192.168.1.10:54321    93.184.216.34:80     93.184.216.34:80
tcp 203.0.113.1:1025      192.168.1.20:49152    1.1.1.1:443          1.1.1.1:443
```

**Inside global** : IP publique + port traduit
**Inside local** : IP privée + port source original

### NAT dynamique (pool d'IP)

Alternative : plusieurs IP publiques sans overload

```cisco
Router(config)# access-list 1 permit 192.168.1.0 0.0.0.255

# Pool de 10 IP publiques
Router(config)# ip nat pool PUBLIC 203.0.113.10 203.0.113.20 netmask 255.255.255.0

# NAT dynamique (sans overload)
Router(config)# ip nat inside source list 1 pool PUBLIC
```

**Limitation** : max 11 utilisateurs simultanés (taille du pool)

## Connexions

### Notes liées
- [[NAT - Network Address Translation]] - Concept NAT/PAT
- [[NAT Cisco - Configuration interfaces]] - Définir inside/outside
- [[NAT Cisco - Port forwarding]] - Redirection entrante
- [[RFC 1918 - adressage IP privé]] - Réseaux privés

### Contexte
PAT est la méthode la plus utilisée en entreprise et chez les particuliers (box Internet). Permet d'économiser les adresses IPv4 publiques en partageant 1 IP pour des centaines d'utilisateurs.

## Sources
- Formation Réseau - PAT Cisco
- Cisco NAT Overload Configuration

---
**Tags thématiques** : #pat #overload #nat-dynamique #partage-ip
