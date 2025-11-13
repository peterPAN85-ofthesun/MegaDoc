---
type: permanent
created: 2025-01-08 15:38
tags:
  - permanent
  - réseau
  - dhcp
  - cisco
  - troubleshooting
---

# DHCP Cisco - Vérification et dépannage

> [!abstract] Concept
> Commandes essentielles pour diagnostiquer, vérifier et résoudre les problèmes DHCP sur Cisco

## Explication

Le dépannage DHCP nécessite de vérifier :
1. **Baux actifs** (bindings) : qui a quelle IP ?
2. **Configuration des pools** : réseau, passerelle, options
3. **Statistiques** : requêtes, réponses, taux d'utilisation
4. **Conflits d'adresses** : détection de doublons IP
5. **Service DHCP** : activé ou désactivé ?

Les commandes Cisco permettent d'inspecter, libérer ou nettoyer les baux manuellement.

## Exemples

### Afficher les baux DHCP actifs

```
Router# show ip dhcp binding
Router# show ip dhcp binding 192.168.1.100
```

**Sortie type** :
```
IP address       Client-ID/              Lease expiration        Type
                 Hardware address
192.168.1.100    0100.1122.3344.55       Mar 02 2025 10:30 AM    Automatic
192.168.1.101    0100.aabb.ccdd.eeff     Mar 03 2025 02:15 PM    Automatic
192.168.1.10     01aa.bbcc.ddee.ff       Infinite                Manual
```

**Type** :
- **Automatic** : bail dynamique
- **Manual** : réservation MAC

### Afficher les pools DHCP

```
Router# show ip dhcp pool
Router# show ip dhcp pool VLAN10
```

Montre : réseau, utilisation, baux attribués/disponibles

### Afficher les statistiques

```
Router# show ip dhcp statistics
Router# show ip dhcp server statistics
```

Compteurs : DISCOVER, OFFER, REQUEST, ACK, NAK

### Afficher les conflits d'adresses

```
Router# show ip dhcp conflict
```

Le serveur détecte les conflits via ping avant attribution.

### Libérer manuellement un bail

```
# Libérer tous les baux
Router# clear ip dhcp binding *

# Libérer un bail spécifique
Router# clear ip dhcp binding 192.168.1.100
```

**Utilité** : forcer la réattribution, résoudre un conflit

### Supprimer les conflits

```
Router# clear ip dhcp conflict *
Router# clear ip dhcp conflict 192.168.1.100
```

### Déboguer le DHCP en temps réel

```
Router# debug ip dhcp server events
Router# debug ip dhcp server packet

# Arrêter le debug
Router# undebug all
```

**Attention** : debug génère beaucoup de logs, à utiliser ponctuellement

### Vérifier le service DHCP

```
Router# show running-config | include dhcp
Router# show ip dhcp pool
```

Si vide → `no service dhcp` est actif

## Connexions

### Notes liées
- [[DHCP - Dynamic Host Configuration]] - Processus DORA
- [[DHCP Cisco - Configuration de base]] - Setup initial
- [[DHCP Cisco - Réservations MAC]] - Baux manuels
- [[ICMP - Internet Control Message Protocol]] - Ping de détection conflit

### Contexte
Commandes indispensables pour diagnostiquer les problèmes réseau (clients sans IP, mauvaise passerelle, conflits). À utiliser lors du dépannage ou de la supervision d'un réseau en production.

## Sources
- Formation Réseau - Dépannage DHCP
- Cisco IOS DHCP Troubleshooting Guide

---
**Tags thématiques** : #dhcp #troubleshooting #diagnostic #show-commands
