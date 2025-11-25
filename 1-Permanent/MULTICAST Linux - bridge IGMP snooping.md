---
type: permanent
created: 2025-11-25 16:50
tags:
  - permanent
  - réseau
  - multicast
  - linux
  - bridge
  - igmp
  - switch
---

# MULTICAST Linux - bridge IGMP snooping

> [!abstract] Concept
> Configuration d'un Linux en tant que switch L2 (bridge) avec IGMP snooping pour distribuer intelligemment le trafic multicast.

## Explication

Un **Linux bridge** peut agir comme un **switch L2** en connectant plusieurs interfaces réseau. Sans IGMP snooping, le trafic multicast est traité comme du broadcast (envoyé à tous les ports).

**IGMP snooping** permet au bridge d'écouter les messages IGMP entre clients et routeur, et de n'envoyer le trafic multicast qu'aux ports ayant des clients abonnés.

**Cas d'usage** :
- Switch virtuel dans VM/conteneurs
- Bridge pour réseau broadcast IP (SMPTE 2110)
- Lab réseau multicast

## Architecture

```
   [Routeur multicast]
          |
      +---+---+
      | br0   |  ← Linux bridge avec IGMP snooping
      +-------+
      /   |   \
   eth0 eth1 eth2
    |    |    |
  [A]  [B]  [C]  ← Clients

- Client B s'abonne à 239.1.1.1
- Flux envoyé uniquement vers eth1 (pas eth0 ni eth2)
```

## Configuration du bridge

### 1. Installer bridge-utils

```bash
# Debian/Ubuntu
apt install bridge-utils

# CentOS/RHEL
yum install bridge-utils
```

### 2. Créer le bridge

```bash
# Créer bridge br0
ip link add name br0 type bridge

# Activer le bridge
ip link set br0 up

# Ajouter interfaces au bridge
ip link set eth0 master br0
ip link set eth1 master br0
ip link set eth2 master br0

# Vérifier
bridge link show
```

**Alternative avec brctl** (ancien outil) :
```bash
brctl addbr br0
brctl addif br0 eth0
brctl addif br0 eth1
brctl addif br0 eth2
brctl show
```

### 3. Activer IGMP snooping

```bash
# Activer IGMP snooping sur br0
echo 1 > /sys/class/net/br0/bridge/multicast_snooping

# Vérifier
cat /sys/class/net/br0/bridge/multicast_snooping
# Output: 1 (activé)
```

### 4. Configuration avancée IGMP snooping

```bash
# Querier (envoyer requêtes IGMP si pas de routeur)
echo 1 > /sys/class/net/br0/bridge/multicast_querier

# Intervalle requêtes IGMP (secondes)
echo 30 > /sys/class/net/br0/bridge/multicast_query_interval

# Last Member Query Interval (dixièmes de seconde)
echo 10 > /sys/class/net/br0/bridge/multicast_last_member_interval

# Hash table max size (groupes multicast)
echo 512 > /sys/class/net/br0/bridge/multicast_hash_max

# Startup Query Interval (dixièmes de seconde)
echo 30 > /sys/class/net/br0/bridge/multicast_startup_query_interval
```

**Paramètres clés** :
- `multicast_snooping` : Active/désactive IGMP snooping
- `multicast_querier` : Bridge envoie queries IGMP (utile si pas de routeur)
- `multicast_query_interval` : Fréquence des queries IGMP
- `multicast_hash_max` : Nombre max de groupes multicast

## Vérification et monitoring

### Voir les groupes multicast appris

```bash
# Afficher table multicast du bridge
bridge mdb show

# Exemple sortie :
# dev br0 port eth1 grp 239.1.1.1 temp
# dev br0 port eth2 grp 239.1.1.2 temp
```

**Interprétation** :
- `port eth1` : Interface où est le client abonné
- `grp 239.1.1.1` : Groupe multicast
- `temp` : Entrée temporaire (apprise dynamiquement)

### Statistiques IGMP snooping

```bash
# Voir statistiques bridge
bridge -s link show

# Afficher configuration complète
ip -d link show br0
```

### Ajouter manuellement un groupe multicast

```bash
# Forcer trafic multicast vers eth1
bridge mdb add dev br0 port eth1 grp 239.1.1.1 permanent

# Supprimer
bridge mdb del dev br0 port eth1 grp 239.1.1.1
```

## Configuration persistante

### Avec systemd-networkd

Fichier `/etc/systemd/network/br0.netdev` :
```ini
[NetDev]
Name=br0
Kind=bridge

[Bridge]
MulticastSnooping=yes
MulticastQuerier=yes
```

Fichier `/etc/systemd/network/br0-bind.network` :
```ini
[Match]
Name=eth0 eth1 eth2

[Network]
Bridge=br0
```

Fichier `/etc/systemd/network/br0.network` :
```ini
[Match]
Name=br0

[Network]
Address=192.168.10.1/24
```

Redémarrer :
```bash
systemctl restart systemd-networkd
```

### Avec /etc/network/interfaces (Debian)

```bash
auto br0
iface br0 inet static
    address 192.168.10.1
    netmask 255.255.255.0
    bridge_ports eth0 eth1 eth2
    bridge_stp off
    bridge_fd 0
    bridge_multicast_snooping 1
    bridge_multicast_querier 1
```

## Troubleshooting

### Problème : Multicast envoyé à tous les ports

**Vérification** :
```bash
# Snooping activé ?
cat /sys/class/net/br0/bridge/multicast_snooping
# Doit être 1
```

**Solution** :
```bash
# Activer snooping
echo 1 > /sys/class/net/br0/bridge/multicast_snooping
```

### Problème : Clients ne reçoivent pas le flux

**Vérification** :
```bash
# Table multicast vide ?
bridge mdb show

# Querier actif ?
cat /sys/class/net/br0/bridge/multicast_querier
```

**Solution** :
```bash
# Activer querier si pas de routeur
echo 1 > /sys/class/net/br0/bridge/multicast_querier

# Vérifier avec tcpdump
tcpdump -i br0 -n igmp
```

### Problème : Trop de groupes multicast

**Solution** :
```bash
# Augmenter hash table
echo 1024 > /sys/class/net/br0/bridge/multicast_hash_max
```

## Exemple complet : Switch L2 pour SMPTE 2110

```bash
#!/bin/bash
# bridge-2110.sh : Bridge Linux pour broadcast IP

# 1. Créer bridge
ip link add name br0 type bridge
ip link set br0 up

# 2. Ajouter interfaces (4 caméras)
for i in {0..3}; do
    ip link set eth$i master br0
    ip link set eth$i up
    # MTU 9000 pour jumbo frames
    ip link set eth$i mtu 9000
done

# 3. MTU bridge
ip link set br0 mtu 9000

# 4. Activer IGMP snooping
echo 1 > /sys/class/net/br0/bridge/multicast_snooping
echo 1 > /sys/class/net/br0/bridge/multicast_querier
echo 10 > /sys/class/net/br0/bridge/multicast_query_interval

# 5. Augmenter hash table (100+ flux vidéo)
echo 2048 > /sys/class/net/br0/bridge/multicast_hash_max

# 6. Désactiver STP (pas nécessaire en topologie simple)
echo 0 > /sys/class/net/br0/bridge/stp_state

# 7. Vérifier
bridge link show
bridge mdb show
```

## Performance

### Optimisations pour haute charge (broadcast IP)

```bash
# Augmenter buffers réseau
sysctl -w net.core.rmem_max=134217728
sysctl -w net.core.wmem_max=134217728
sysctl -w net.core.netdev_max_backlog=5000

# Désactiver IP forwarding (pas de L3)
sysctl -w net.ipv4.ip_forward=0

# Activer offloading matériel
ethtool -K eth0 gro on
ethtool -K eth0 gso on
```

### Monitoring performance

```bash
# Voir statistiques bridge
ip -s link show br0

# Statistiques multicast
cat /sys/class/net/br0/bridge/multicast_stats_enabled
echo 1 > /sys/class/net/br0/bridge/multicast_stats_enabled

# Voir drops
ethtool -S eth0 | grep drop
```

## Comparaison avec switch matériel

| Caractéristique | Linux Bridge | Switch Cisco |
|----------------|--------------|--------------|
| IGMP Snooping | ✓ | ✓ |
| IGMP Querier | ✓ | ✓ |
| Performance | ~10-40 Gbps | 100+ Gbps |
| Latence | 1-5 ms | <100 µs |
| Coût | Gratuit | €€€ |
| Flexibilité | Très haute | Moyenne |

**Avantages Linux bridge** :
- Gratuit et flexible
- Parfait pour labs/tests
- Scripting avancé

**Avantages switch matériel** :
- Performance et latence supérieures
- Offloading matériel (ASIC)
- Support PTP hardware

## Cas d'usage

- **Lab réseau multicast** : Tests et développement
- **Switch virtuel** : VM et conteneurs (KVM, Docker)
- **Broadcast IP budget** : Alternative switch L2 coûteux
- **Agrégation flux multicast** : Combiner sources multiples

## Connexions

- [[MULTICAST - diffusion groupe]] - Concept général
- [[IGMP - Internet Group Management Protocol]] - Protocole écouté
- [[MULTICAST Linux - client réception flux]] - Client multicast
- [[MULTICAST Linux - routeur PIM]] - Routeur Linux avec PIM daemon
- [[MULTICAST Cisco - switch IGMP snooping]] - Équivalent Cisco
- [[MULTICAST Cisco - routeur PIM]] - Routeur Cisco avec PIM Sparse Mode
- [[SMPTE 2110 - transport multimédia par IP]] - Cas d'usage broadcast

---
**Sources** : Linux Bridge documentation, man bridge, iproute2 documentation
