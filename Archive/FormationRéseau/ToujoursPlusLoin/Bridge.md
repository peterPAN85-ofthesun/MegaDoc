---
date: 2025/11/07
tags:
  - bridge
  - Réseau
  - Cisco
  - Linux
---

Un **bridge** (pont) permet de relier plusieurs interfaces réseau au niveau de la couche 2 (liaison de données), créant ainsi un domaine de diffusion unique. Les trames Ethernet sont transmises entre les interfaces sans routage IP.

## Bridge sur Routeur Cisco

### Méthode 1 : Integrated Routing and Bridging (IRB)

L'IRB permet de faire du routing et du bridging simultanément sur un routeur Cisco.

#### Configuration de base

```
! Activer le bridging
Router(config)# bridge irb

! Créer un groupe de bridge (numéro 1)
Router(config)# bridge 1 protocol ieee

! Configurer la première interface dans le bridge
Router(config)# interface GigabitEthernet0/0
Router(config-if)# no ip address
Router(config-if)# bridge-group 1
Router(config-if)# no shutdown

! Configurer la deuxième interface dans le bridge
Router(config)# interface GigabitEthernet0/1
Router(config-if)# no ip address
Router(config-if)# bridge-group 1
Router(config-if)# no shutdown

! Créer une interface virtuelle pour le bridge (BVI)
Router(config)# interface BVI1
Router(config-if)# ip address 192.168.1.1 255.255.255.0
Router(config-if)# no shutdown

! Activer le routage sur le bridge
Router(config)# bridge 1 route ip
```

#### Vérification

```
Router# show bridge
Router# show bridge group
Router# show interfaces bridge-group
```

### Méthode 2 : Transparent Bridging (ancien)

Pour les IOS plus anciens sans IRB :

```
! Créer un bridge group
Router(config)# bridge 1 protocol ieee

! Assigner les interfaces au bridge
Router(config)# interface FastEthernet0/0
Router(config-if)# bridge-group 1
Router(config-if)# no shutdown

Router(config)# interface FastEthernet0/1
Router(config-if)# bridge-group 1
Router(config-if)# no shutdown
```

>[!NOTE]
>Dans ce mode, aucune adresse IP n'est configurée sur les interfaces bridgées. Le routeur agit comme un switch de niveau 2.

## Bridge sur Debian/Linux

### Installation des outils nécessaires

```bash
# Installation de bridge-utils
sudo apt update
sudo apt install bridge-utils

# Ou avec iproute2 (méthode moderne)
sudo apt install iproute2
```

### Méthode 1 : Avec bridge-utils (traditionnel)

#### Configuration temporaire

```bash
# Créer un bridge
sudo brctl addbr br0

# Ajouter des interfaces au bridge
sudo brctl addif br0 eth0
sudo brctl addif br0 eth1

# Activer les interfaces
sudo ip link set eth0 up
sudo ip link set eth1 up
sudo ip link set br0 up

# Configurer une adresse IP sur le bridge (optionnel)
sudo ip addr add 192.168.1.1/24 dev br0
```

#### Vérification

```bash
# Afficher les bridges
brctl show

# Afficher les détails d'un bridge
brctl showmacs br0

# Afficher l'état du Spanning Tree
brctl showstp br0
```

#### Configuration persistante avec /etc/network/interfaces

Éditer `/etc/network/interfaces` :

```
# Interfaces physiques
auto eth0
iface eth0 inet manual

auto eth1
iface eth1 inet manual

# Bridge
auto br0
iface br0 inet static
    address 192.168.1.1
    netmask 255.255.255.0
    bridge_ports eth0 eth1
    bridge_stp off
    bridge_fd 0
    bridge_maxwait 0
```

Redémarrer le réseau :

```bash
sudo systemctl restart networking
# ou
sudo ifdown br0 && sudo ifup br0
```

### Méthode 2 : Avec iproute2 (moderne)

#### Configuration temporaire

```bash
# Créer un bridge
sudo ip link add name br0 type bridge

# Ajouter des interfaces au bridge
sudo ip link set eth0 master br0
sudo ip link set eth1 master br0

# Activer les interfaces
sudo ip link set eth0 up
sudo ip link set eth1 up
sudo ip link set br0 up

# Configurer une adresse IP
sudo ip addr add 192.168.1.1/24 dev br0
```

#### Vérification

```bash
# Afficher les bridges
ip link show type bridge

# Afficher les interfaces d'un bridge
bridge link show

# Afficher la table MAC
bridge fdb show

# Afficher les détails
ip -d link show br0
```

### Méthode 3 : Avec systemd-networkd

Créer `/etc/systemd/network/br0.netdev` :

```ini
[NetDev]
Name=br0
Kind=bridge
```

Créer `/etc/systemd/network/br0.network` :

```ini
[Match]
Name=br0

[Network]
Address=192.168.1.1/24
```

Créer `/etc/systemd/network/eth0.network` :

```ini
[Match]
Name=eth0

[Network]
Bridge=br0
```

Créer `/etc/systemd/network/eth1.network` :

```ini
[Match]
Name=eth1

[Network]
Bridge=br0
```

Redémarrer systemd-networkd :

```bash
sudo systemctl restart systemd-networkd
```

### Méthode 4 : Avec NetworkManager (Desktop)

```bash
# Créer un bridge
sudo nmcli connection add type bridge ifname br0 con-name br0

# Ajouter des interfaces esclaves
sudo nmcli connection add type bridge-slave ifname eth0 master br0
sudo nmcli connection add type bridge-slave ifname eth1 master br0

# Configurer l'IP du bridge
sudo nmcli connection modify br0 ipv4.addresses 192.168.1.1/24
sudo nmcli connection modify br0 ipv4.method manual

# Activer le bridge
sudo nmcli connection up br0
```

## Options avancées

### Désactiver le Spanning Tree Protocol (STP)

>[!NOTE] Principe du Spanning Tree Protocol
>Le **STP (IEEE 802.1D)** est un protocole de couche 2 qui prévient les **boucles de réseau** dans les topologies comportant des chemins redondants.
>
>**Fonctionnement :**
>- Les switches/bridges échangent des trames **BPDU** (Bridge Protocol Data Units) pour élire un **root bridge** (pont racine)
>- Chaque switch calcule le chemin le plus court vers le root bridge
>- Les ports sont placés dans différents états : **Blocking**, **Listening**, **Learning**, **Forwarding**, ou **Disabled**
>- Les ports redondants sont mis en état **Blocking** pour éviter les boucles
>- Si un lien actif tombe, STP recalcule la topologie et active un port bloqué (convergence ~30-50 secondes)
>
>**Pourquoi désactiver STP ?**
>- Dans une topologie simple sans boucle (2 interfaces bridgées point-à-point)
>- Pour des environnements de lab/test contrôlés
>- Pour éviter le délai de convergence (30-50 sec)
>- ⚠️ **Attention** : Ne jamais désactiver STP si des boucles physiques existent, cela causerait une **tempête de broadcast** (broadcast storm) saturant le réseau !
>
>**Variantes modernes :**
>- **RSTP** (802.1w) : convergence rapide (~1-6 secondes)
>- **MSTP** (802.1s) : STP multi-instances pour VLANs

**Cisco :**
```
Router(config)# no bridge 1 protocol ieee
```

**Linux (bridge-utils) :**
```bash
sudo brctl stp br0 off
```

**Linux (iproute2) :**
```bash
sudo ip link set br0 type bridge stp_state 0
```

### Filtrage MAC

**Linux :**
```bash
# Ajouter une entrée MAC statique
sudo bridge fdb add 00:11:22:33:44:55 dev eth0 master static

# Supprimer une entrée
sudo bridge fdb del 00:11:22:33:44:55 dev eth0 master
```

### VLAN sur Bridge

**Linux :**
```bash
# Activer VLAN filtering sur le bridge
sudo ip link set br0 type bridge vlan_filtering 1

# Ajouter un VLAN à une interface
sudo bridge vlan add vid 10 dev eth0
sudo bridge vlan add vid 10 dev br0 self
```

## Cas d'usage typiques

1. **Connexion transparente de deux segments réseau** : Le bridge agit comme un switch invisible
2. **Machine virtuelle** : Donner accès direct au réseau physique aux VMs
3. **Point d'accès WiFi** : Bridger l'interface WiFi et Ethernet
4. **Redondance de liens** : Avec STP activé pour éviter les boucles
5. **Lab réseau** : Créer des topologies complexes pour tests

## Différences Bridge vs Switch vs Router

| Caractéristique | Bridge | Switch | Router |
|----------------|--------|--------|--------|
| Couche OSI | 2 | 2 | 3 |
| Nombre de ports | 2-4 | Nombreux | 2+ |
| Décision de forwarding | Adresse MAC | Adresse MAC | Adresse IP |
| Domaines de broadcast | Unique | Unique (ou VLANs) | Séparés |
| Performance | Logicielle | Matérielle (ASIC) | Logicielle/matérielle |

