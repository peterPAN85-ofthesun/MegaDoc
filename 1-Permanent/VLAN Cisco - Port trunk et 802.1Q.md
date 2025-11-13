---
type: permanent
created: 2025-01-08 15:47
tags:
  - permanent
  - réseau
  - vlan
  - cisco
  - trunk
  - 802.1Q
---

# VLAN Cisco - Port trunk et 802.1Q

> [!abstract] Concept
> Configurer un port trunk pour transporter plusieurs VLANs avec tagging 802.1Q

## Explication

Un **port trunk** transporte le trafic de **plusieurs VLANs simultanément** entre équipements réseau (switch ↔ switch, switch ↔ routeur).

**Protocole 802.1Q** : ajoute un tag (étiquette) de 4 octets dans la trame Ethernet pour identifier le VLAN d'origine.

**Utilisation** :
- Interconnexion entre switches
- Liaison switch → routeur (Router on a stick)
- Liaison switch → serveur avec plusieurs VLANs

**VLAN natif** : VLAN dont les trames ne sont PAS taguées sur le trunk (par défaut VLAN 1).

## Exemples

### Configuration trunk basique

```cisco
Switch(config)# interface fastEthernet 0/24
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 10,20,30
Switch(config-if)# exit

Switch(config)# end
Switch# write memory
```

**Trames transmises** : VLAN 10, 20, 30 avec tag 802.1Q

### Autoriser tous les VLANs

```cisco
Switch(config-if)# switchport trunk allowed vlan all
```

### Ajouter/Retirer des VLANs d'un trunk

```cisco
# Ajouter VLAN 40
Switch(config-if)# switchport trunk allowed vlan add 40

# Retirer VLAN 20
Switch(config-if)# switchport trunk allowed vlan remove 20
```

### Changer le VLAN natif (sécurité)

```cisco
Switch(config-if)# switchport trunk native vlan 99
```

**Raison** : éviter VLAN 1 (vecteur d'attaques). Choisir un VLAN inutilisé (ex: 99, 999).

### Désactiver DTP (Dynamic Trunking Protocol)

```cisco
Switch(config-if)# switchport nonegotiate
```

**Sécurité** : empêche la négociation automatique de trunk (attaques VLAN hopping).

### Vérification trunk

```cisco
# Voir tous les trunks
Switch# show interfaces trunk

# Voir un trunk spécifique
Switch# show interfaces fastEthernet 0/24 trunk

# Voir le mode du port
Switch# show interfaces fastEthernet 0/24 switchport
```

**Sortie utile** :
- VLANs autorisés (allowed)
- VLANs actifs (active)
- VLAN natif

## Connexions

### Notes liées
- [[802.1Q - tagging VLAN]] - Protocole d'encapsulation VLAN
- [[VLAN - mode access vs trunk]] - Différence entre les modes
- [[VLAN Cisco - Configuration switch]] - Créer VLANs et mode access
- [[VLAN - router on a stick]] - Routage inter-VLAN via trunk

### Contexte
Le trunk est essentiel pour interconnecter des équipements réseau tout en maintenant la séparation des VLANs. Toujours sécuriser : changer VLAN natif, limiter les VLANs autorisés, désactiver DTP.

## Sources
- Formation Réseau - Trunk et 802.1Q
- IEEE 802.1Q Standard

---
**Tags thématiques** : #trunk #802.1Q #vlan-tagging #interconnexion
