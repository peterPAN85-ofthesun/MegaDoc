---
type: permanent
created: 2025-01-08 16:15
tags:
  - permanent
  - réseau
  - routage
  - cisco
---

# Routage Cisco - Configuration de base

> [!abstract] Concept
> Ajouter et supprimer des routes statiques sur routeur Cisco pour acheminer le trafic entre réseaux

## Explication

Le **routage statique** permet de définir manuellement les chemins vers les réseaux distants. Chaque route indique :
- **Réseau de destination** (IP + masque)
- **Next hop** (IP du routeur suivant) OU interface de sortie
- **Distance administrative** (optionnel, par défaut = 1)

**Table de routage** : liste des réseaux connus et comment les atteindre.

**Codes de routes** :
- **C** : Connected (directement connecté)
- **S** : Static (route statique)
- **R** : RIP, **O** : OSPF, **D** : EIGRP (protocoles dynamiques)

## Exemples

### Afficher la table de routage

```cisco
Router# show ip route

# Uniquement routes statiques
Router# show ip route static

# Route vers IP spécifique
Router# show ip route 192.168.10.0
```

**Sortie type** :
```
C    192.168.1.0/24 is directly connected, GigabitEthernet0/1
S    192.168.10.0/24 [1/0] via 192.168.1.1
S*   0.0.0.0/0 [1/0] via 203.0.113.1
```

### Ajouter une route statique

**Méthode 1 : Via next hop (IP du routeur suivant)**

```cisco
Router(config)# ip route 192.168.10.0 255.255.255.0 192.168.1.1
```

**Méthode 2 : Via interface de sortie**

```cisco
Router(config)# ip route 10.0.0.0 255.0.0.0 GigabitEthernet0/0
```

Utile pour **liaisons point-à-point** (Serial, PPP)

**Méthode 3 : Combinée (interface + next hop)**

```cisco
Router(config)# ip route 172.16.0.0 255.255.0.0 GigabitEthernet0/0 192.168.1.1
```

Améliore les performances sur réseaux multi-accès (Ethernet)

### Route par défaut (default gateway)

```cisco
Router(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1
```

Capture **tout le trafic** dont la destination n'est pas dans la table de routage (ex: Internet).

### Supprimer une route

```cisco
Router(config)# no ip route 192.168.10.0 255.255.255.0 192.168.1.1
```

### Configuration complète - Routeur avec 2 réseaux

```cisco
Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip address 192.168.1.254 255.255.255.0
Router(config-if)# no shutdown
Router(config-if)# exit

Router(config)# interface GigabitEthernet0/1
Router(config-if)# ip address 10.0.0.254 255.255.255.0
Router(config-if)# no shutdown
Router(config-if)# exit

# Route vers réseau distant via 192.168.1.1
Router(config)# ip route 192.168.20.0 255.255.255.0 192.168.1.1

# Route par défaut vers Internet
Router(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1

Router(config)# end
Router# write memory
```

### Vérification

```cisco
# Table complète
Router# show ip route

# Interfaces actives
Router# show ip interface brief

# Configuration routes
Router# show running-config | include ip route

# Test connectivité
Router# ping 192.168.20.1
Router# traceroute 192.168.20.1
```

## Connexions

### Notes liées
- [[ROUTAGE - statique]] - Concept et principe
- [[Routage Cisco - Routes statiques avancées]] - Floating static, load balancing, NULL
- [[Routage Cisco - Distance administrative]] - Priorité des routes
- [[Routage Cisco - Vérification et dépannage]] - Diagnostic et tests

### Contexte
Configuration de base indispensable pour interconnecter des réseaux. Le routage statique est adapté aux petits réseaux ou routes par défaut. Pour les grands réseaux, préférer les protocoles dynamiques (OSPF, EIGRP).

## Sources
- Formation Réseau - Routage statique Cisco
- Cisco Static Routing Configuration

---
**Tags thématiques** : #routage #static-routes #table-routage #next-hop
