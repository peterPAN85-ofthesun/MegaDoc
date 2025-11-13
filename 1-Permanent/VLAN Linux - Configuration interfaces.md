---
type: permanent
created: 2025-01-08 16:45
tags:
  - permanent
  - réseau
  - vlan
  - linux
  - 802.1Q
---

# VLAN Linux - Configuration interfaces

> [!abstract] Concept
> Créer des sous-interfaces VLAN 802.1Q sur Linux pour segmenter le réseau

## Explication

Linux supporte le **tagging 802.1Q** via le module kernel `8021q`. Chaque VLAN est configuré comme une **sous-interface** (ex: `eth0.10` pour VLAN 10).

**Prérequis** :
- Module kernel `8021q` chargé
- Package `vlan` installé (Debian/Ubuntu)
- Switch configuré en mode trunk vers le serveur Linux

**Méthodes de configuration** :
- `/etc/network/interfaces` (Debian classique)
- **Netplan** (Ubuntu/Debian récent)
- **ip** / **vconfig** (manuel temporaire)

## Exemples

### Charger le module 8021q

```bash
# Charger le module
modprobe 8021q

# Vérifier
lsmod | grep 8021q

# Charger au démarrage
echo "8021q" >> /etc/modules
```

### Installer les outils VLAN

```bash
apt update
apt install vlan
```

### Configuration avec /etc/network/interfaces

Éditer `/etc/network/interfaces` :

```bash
# Interface physique
auto eth0
iface eth0 inet manual

# VLAN 10 - Administration
auto eth0.10
iface eth0.10 inet static
    address 192.168.10.254
    netmask 255.255.255.0
    vlan-raw-device eth0

# VLAN 20 - Utilisateurs
auto eth0.20
iface eth0.20 inet static
    address 192.168.20.254
    netmask 255.255.255.0
    vlan-raw-device eth0

# VLAN 30 - Invités
auto eth0.30
iface eth0.30 inet static
    address 192.168.30.254
    netmask 255.255.255.0
    vlan-raw-device eth0
```

**Appliquer** :
```bash
ifup eth0.10
ifup eth0.20
ifup eth0.30
```

### Configuration avec Netplan (Ubuntu/Debian récent)

Éditer `/etc/netplan/01-netcfg.yaml` :

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: no
      dhcp6: no

  vlans:
    eth0.10:
      id: 10
      link: eth0
      addresses:
        - 192.168.10.254/24

    eth0.20:
      id: 20
      link: eth0
      addresses:
        - 192.168.20.254/24

    eth0.30:
      id: 30
      link: eth0
      addresses:
        - 192.168.30.254/24
```

**Appliquer** :
```bash
netplan apply
```

### Création manuelle (temporaire)

```bash
# Ajouter VLAN 10 sur eth0
ip link add link eth0 name eth0.10 type vlan id 10
ip addr add 192.168.10.254/24 dev eth0.10
ip link set dev eth0.10 up

# Ajouter VLAN 20
ip link add link eth0 name eth0.20 type vlan id 20
ip addr add 192.168.20.254/24 dev eth0.20
ip link set dev eth0.20 up
```

**Attention** : configuration perdue au redémarrage (utiliser /etc/network/interfaces ou Netplan pour rendre permanent).

### Supprimer une interface VLAN

```bash
# Méthode ip
ip link delete eth0.10

# Méthode vconfig (obsolète)
vconfig rem eth0.10
```

### Vérifier les interfaces VLAN

```bash
# Voir toutes les interfaces
ip addr show

# Filtrer VLAN
ip -d link show | grep vlan

# Détails VLAN spécifique
cat /proc/net/vlan/eth0.10
```

**Sortie** :
```
eth0.10   VID: 10   REORDER_HDR: 1  dev->priv_flags: 1
         total frames received            1234
         total bytes received          567890
```

### Tester la connectivité

```bash
# Ping depuis le serveur Linux
ping -I eth0.10 192.168.10.1
ping -I eth0.20 192.168.20.1

# Voir les interfaces up
ip link show | grep UP
```

## Connexions

### Notes liées
- [[VLAN - Virtual LAN]] - Concept de segmentation
- [[802.1Q tagging]] - Protocole d'encapsulation
- [[VLAN Linux - Routage inter-VLAN]] - Activer forwarding entre VLANs
- [[VLAN Cisco - Port trunk et 802.1Q]] - Configuration trunk côté switch

### Contexte
Configuration essentielle pour un serveur Linux routant du trafic entre VLANs ou hébergeant des services sur plusieurs VLANs. Alternative Linux au Router on a stick Cisco.

## Sources
- Formation Réseau - VLAN Linux
- Linux VLAN 802.1Q Documentation

---
**Tags thématiques** : #vlan #linux #802.1Q #netplan #networking
