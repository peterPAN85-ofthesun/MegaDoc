---
type: permanent
created: 2025-01-08 16:00
tags:
  - permanent
  - réseau
  - nat
  - cisco
---

# NAT Cisco - Configuration interfaces

> [!abstract] Concept
> Définir les interfaces inside (réseau privé) et outside (Internet) pour activer la translation NAT

## Explication

Le **NAT (Network Address Translation)** nécessite de définir deux types d'interfaces :
- **Inside** : interfaces connectées au réseau privé (LAN, DMZ)
- **Outside** : interface connectée à Internet ou réseau public (WAN)

Le routeur traduit les adresses **inside → outside** (sortie) et **outside → inside** (entrée pour NAT statique/port forwarding).

**Principe** :
1. Définir les interfaces inside/outside
2. Configurer le type de NAT (statique, dynamique, PAT)
3. Le routeur traduit automatiquement selon les règles

## Exemples

### Configuration basique

```cisco
# Interface WAN (vers Internet)
Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip address 203.0.113.1 255.255.255.248
Router(config-if)# ip nat outside
Router(config-if)# exit

# Interface LAN (réseau privé)
Router(config)# interface GigabitEthernet0/1
Router(config-if)# ip address 192.168.1.254 255.255.255.0
Router(config-if)# ip nat inside
Router(config-if)# exit
```

### Avec DMZ (plusieurs interfaces inside)

```cisco
# Interface WAN
Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip nat outside
Router(config-if)# exit

# Interface LAN
Router(config)# interface GigabitEthernet0/1
Router(config-if)# ip nat inside
Router(config-if)# exit

# Interface DMZ (aussi inside)
Router(config)# interface GigabitEthernet0/2
Router(config-if)# ip nat inside
Router(config-if)# exit
```

**Inside** : toutes les interfaces avec adressage privé

### Vérification

```cisco
# Voir les interfaces NAT
Router# show ip nat statistics

# Voir la config
Router# show running-config | include nat
```

**Sortie utile** :
```
Inside interfaces:
  GigabitEthernet0/1, GigabitEthernet0/2
Outside interfaces:
  GigabitEthernet0/0
```

### Retirer NAT d'une interface

```cisco
Router(config-if)# no ip nat inside
Router(config-if)# no ip nat outside
```

## Connexions

### Notes liées
- [[NAT - Network Address Translation]] - Concept NAT/PAT
- [[NAT Cisco - NAT statique]] - Translation 1:1 permanente
- [[NAT Cisco - PAT et NAT Overload]] - Partage d'IP publique
- [[RFC 1918 - adressage IP privé]] - Plages inside

### Contexte
Première étape obligatoire de toute configuration NAT. Sans interfaces inside/outside définies, aucune translation ne sera effectuée. À faire avant de créer les règles NAT.

## Sources
- Formation Réseau - NAT Cisco
- Cisco NAT Configuration Guide

---
**Tags thématiques** : #nat #inside-outside #interfaces #cisco
