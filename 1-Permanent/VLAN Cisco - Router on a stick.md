---
type: permanent
created: 2025-01-08 01:42
tags:
  - permanent
  - réseau
  - vlan
  - cisco
  - routeur
  - inter-vlan
---

# VLAN Cisco - Router on a stick

> [!abstract] Concept
> Configuration du routage inter-VLAN avec sous-interfaces 802.1Q sur une seule interface physique

## Explication

**Router on a stick** : architecture où un routeur assure le routage entre VLANs en utilisant **une seule interface physique** avec **plusieurs sous-interfaces logiques** (une par VLAN).

**Principe** :
- Interface physique (ex: Gi0/0) : activée, sans IP
- Sous-interfaces (ex: Gi0/0.10, Gi0/0.20) : une par VLAN, avec encapsulation 802.1Q
- Chaque sous-interface = passerelle du VLAN

**Flux inter-VLAN** :
1. PC VLAN 10 → passerelle 192.168.10.254 (Gi0/0.10)
2. Routeur route vers Gi0/0.20
3. Gi0/0.20 → switch via trunk → PC VLAN 20

## Exemples

### Configuration complète

```cisco
# Activer l'interface physique
Router(config)# interface gigabitEthernet 0/0
Router(config-if)# no shutdown
Router(config-if)# exit
```

**Important** : l'interface physique doit être UP, même sans adresse IP.

### Créer les sous-interfaces

```cisco
# VLAN 10 - Admin
Router(config)# interface gigabitEthernet 0/0.10
Router(config-subif)# encapsulation dot1Q 10
Router(config-subif)# ip address 192.168.10.254 255.255.255.0
Router(config-subif)# exit

# VLAN 20 - Users
Router(config)# interface gigabitEthernet 0/0.20
Router(config-subif)# encapsulation dot1Q 20
Router(config-subif)# ip address 192.168.20.254 255.255.255.0
Router(config-subif)# exit

# VLAN 30 - Serveurs
Router(config)# interface gigabitEthernet 0/0.30
Router(config-subif)# encapsulation dot1Q 30
Router(config-subif)# ip address 192.168.30.254 255.255.255.0
Router(config-subif)# exit

Router(config)# end
Router# write memory
```

**Numéro après dot1Q** = ID du VLAN

### Topologie

```
[PC VLAN 10] ─┐
              │
[PC VLAN 20] ─┼─ [Switch L2] ─(trunk Fa0/24)─ [Routeur Gi0/0]
              │                                 .10 .20 .30
[PC VLAN 30] ─┘
```

### Planification adresses

| VLAN | Nom | Réseau | Passerelle | Interface |
|------|-----|--------|------------|-----------|
| 10 | ADMIN | 192.168.10.0/24 | 192.168.10.254 | Gi0/0.10 |
| 20 | USERS | 192.168.20.0/24 | 192.168.20.254 | Gi0/0.20 |
| 30 | SERVEURS | 192.168.30.0/24 | 192.168.30.254 | Gi0/0.30 |

### Vérification

```cisco
# Voir toutes les interfaces
Router# show ip interface brief

# Détails sous-interface
Router# show interfaces gigabitEthernet 0/0.10

# Table de routage
Router# show ip route
```

Les réseaux directement connectés (C) apparaissent automatiquement.

### Test de connectivité inter-VLAN

```cisco
# Depuis le routeur
Router# ping 192.168.10.1
Router# ping 192.168.20.1

# Depuis un PC VLAN 10
PC> ping 192.168.20.1
```

Si le ping échoue :
- Vérifier trunk switch ↔ routeur
- Vérifier encapsulation dot1Q
- Vérifier passerelle par défaut sur les PC

## Connexions

### Notes liées
- [[VLAN - router on a stick]] - Concept et architecture
- [[VLAN Cisco - Port trunk et 802.1Q]] - Configuration trunk côté switch
- [[802.1Q - tagging VLAN]] - Protocole d'encapsulation
- [[ROUTAGE - statique]] - Routage vers d'autres réseaux

### Contexte
Solution économique pour les petites/moyennes entreprises (1 seul routeur pour plusieurs VLANs). Pour de meilleures performances, préférer un switch Layer 3 (routage matériel).

## Sources
- Formation Réseau - Router on a stick
- Cisco Inter-VLAN Routing Configuration

---
**Tags thématiques** : #router-on-a-stick #inter-vlan #sous-interface #routage
