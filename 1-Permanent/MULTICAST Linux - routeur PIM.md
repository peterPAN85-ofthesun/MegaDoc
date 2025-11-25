---
type: permanent
created: 2025-11-25 17:15
tags:
  - permanent
  - réseau
  - multicast
  - linux
  - routeur
  - pim
---

# MULTICAST Linux - routeur PIM

> [!abstract] Concept
> Configuration d'un routeur Linux avec PIM (Protocol Independent Multicast) pour router les flux multicast entre sous-réseaux.

## Explication

Un **routeur multicast** forward le trafic multicast entre différents sous-réseaux en utilisant le protocole **PIM** (Protocol Independent Multicast).

**Différence avec switch L2** :
- **Switch L2** : Distribue multicast au sein d'un VLAN (IGMP Snooping)
- **Routeur L3** : Route multicast entre VLANs/sous-réseaux (PIM)

**Mode PIM** : **Sparse Mode** (PIM-SM) est le plus utilisé car il suppose que les clients sont dispersés (sparse) et n'envoie le flux que là où il y a des abonnés.

## Architecture typique

```
   [Source 10.1.1.100]
         |
   [Routeur A] ← PIM-SM
         |
    [Internet]
         |
   [Routeur B] ← PIM-SM (RP)
         |
   [Clients 10.2.1.0/24]
```

**Rendezvous Point (RP)** : Point de rendez-vous où sources et clients se retrouvent.

## Prérequis

### 1. Activer IP forwarding

```bash
# Activer forwarding IPv4
sysctl -w net.ipv4.ip_forward=1

# Rendre persistant
echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
```

### 2. Activer multicast routing

```bash
# Activer multicast forwarding
sysctl -w net.ipv4.conf.all.mc_forwarding=1

# Rendre persistant
echo "net.ipv4.conf.all.mc_forwarding=1" >> /etc/sysctl.conf

# Appliquer
sysctl -p
```

## Installation PIM daemon (pimd)

```bash
# Debian/Ubuntu
apt update
apt install pimd

# CentOS/RHEL
yum install pimd

# Arch Linux
pacman -S pimd
```

## Configuration PIM daemon

### Fichier `/etc/pimd.conf`

```conf
# Configuration de base pimd

# Activer PIM sur interfaces
phyint eth0 enable
phyint eth1 enable
phyint eth2 enable

# Définir le Rendezvous Point (RP)
# Utiliser IP de l'interface locale ou d'un autre routeur
rp-address 10.0.0.1

# Alternative : RP sur interface spécifique
# rp-address eth0

# Désactiver PIM sur loopback
phyint lo disable

# Options avancées (optionnel)
# spt-threshold infinity    # Toujours utiliser Shared Tree
# bsr-candidate priority 10 # Bootstrap Router candidat
```

**Explication paramètres** :
- `phyint` : Interface physique
- `enable` : Active PIM sur l'interface
- `rp-address` : Adresse du Rendezvous Point

### Démarrer le service

```bash
# Démarrer pimd
systemctl enable pimd
systemctl start pimd

# Vérifier statut
systemctl status pimd

# Logs
journalctl -u pimd -f
```

## Vérification

### Voir les interfaces multicast

```bash
# Interfaces supportant multicast
ip link show | grep -i multicast

# Adresses multicast par interface
ip maddr show
```

### Voir les routes multicast (mroute)

```bash
# Table de routage multicast
ip mroute show

# Exemple sortie :
# (10.1.1.100, 239.1.1.1) Iif: eth0 Oifs: eth1
```

**Interprétation** :
- `(Source, Groupe)` : Source et groupe multicast
- `Iif` : Incoming interface (interface entrante)
- `Oifs` : Outgoing interfaces (interfaces sortantes)

### Voir les groupes IGMP

```bash
# Groupes multicast souscrits localement
cat /proc/net/igmp

# Format :
# Idx Device    : Count Querier   Group    Users Timer
# 2   eth0      : 1     V3        239.1.1.1 1     0
```

### Statistiques multicast

```bash
# Statistiques réseau multicast
netstat -g

# Statistiques détaillées
ip -s maddr show
```

### Tester avec pimd

```bash
# Voir état PIM
# (pimd n'a pas de commande CLI native, vérifier logs)
journalctl -u pimd | tail -20

# Alternative : vérifier processus
ps aux | grep pimd
```

## Exemple complet : Routeur multicast simple

```bash
#!/bin/bash
# setup-multicast-router.sh

# 1. Activer forwarding
sysctl -w net.ipv4.ip_forward=1
sysctl -w net.ipv4.conf.all.mc_forwarding=1

# 2. Configurer interfaces
ip addr add 10.1.1.1/24 dev eth0
ip addr add 10.2.1.1/24 dev eth1
ip link set eth0 up
ip link set eth1 up

# 3. Routes statiques multicast (optionnel)
ip route add 224.0.0.0/4 dev eth0
ip route add 224.0.0.0/4 dev eth1

# 4. Configuration pimd
cat > /etc/pimd.conf <<EOF
phyint eth0 enable
phyint eth1 enable
rp-address 10.1.1.1
EOF

# 5. Démarrer pimd
systemctl restart pimd

# 6. Vérifier
ip maddr show
ip mroute show
```

## Configuration avancée

### RP statique vs dynamique

**RP statique** (configuration ci-dessus) :
```conf
rp-address 10.0.0.1
```

**RP dynamique (Bootstrap Router)** :
```conf
# Devenir BSR (Bootstrap Router)
bsr-candidate priority 10

# Annoncer comme RP candidat
rp-candidate priority 10
```

### SSM (Source-Specific Multicast)

Filtrage par source (IGMPv3 requis).

```conf
# Dans /etc/pimd.conf
# SSM range (232.0.0.0/8)
ssm-range 232.0.0.0/8
```

**Utilisation** : Client s'abonne à `(Source, Groupe)` au lieu de `(*, Groupe)`.

### Limiter interfaces PIM

```conf
# Activer seulement sur interfaces spécifiques
phyint eth0 enable
phyint eth1 enable
phyint eth2 disable
phyint lo disable
```

## Firewall (autoriser PIM)

### iptables

```bash
# Autoriser PIM (protocole 103)
iptables -A INPUT -p pim -j ACCEPT
iptables -A OUTPUT -p pim -j ACCEPT

# Autoriser IGMP (protocole 2)
iptables -A INPUT -p igmp -j ACCEPT

# Autoriser multicast
iptables -A INPUT -d 224.0.0.0/4 -j ACCEPT
iptables -A FORWARD -d 224.0.0.0/4 -j ACCEPT
```

### firewalld

```bash
# Autoriser PIM et IGMP
firewall-cmd --permanent --add-protocol=pim
firewall-cmd --permanent --add-protocol=igmp
firewall-cmd --reload
```

## Troubleshooting

### Problème : Pas de routes multicast

**Vérification** :
```bash
ip mroute show
# Table vide ?
```

**Solution** :
1. Vérifier pimd actif : `systemctl status pimd`
2. Vérifier interfaces activées dans `/etc/pimd.conf`
3. Vérifier logs : `journalctl -u pimd`

### Problème : Flux ne traverse pas le routeur

**Vérification** :
```bash
# mc_forwarding activé ?
cat /proc/sys/net/ipv4/conf/all/mc_forwarding
# Doit être 1

# Vérifier mroute
ip mroute show
```

**Solution** :
```bash
# Activer mc_forwarding
sysctl -w net.ipv4.conf.all.mc_forwarding=1

# Forcer refresh PIM
systemctl restart pimd
```

### Problème : PIM neighbors non visibles

**Vérification** :
```bash
# Vérifier que PIM Hello sont envoyés
tcpdump -i eth0 -n pim

# Vérifier configuration
cat /etc/pimd.conf
```

**Solution** : S'assurer que PIM est activé sur les bonnes interfaces.

## Comparaison avec Cisco

| Fonctionnalité | Linux (pimd) | Cisco IOS |
|----------------|--------------|-----------|
| PIM Sparse Mode | ✓ | ✓ |
| PIM Dense Mode | ✗ | ✓ |
| Static RP | ✓ | ✓ |
| Auto-RP | ✗ | ✓ |
| BSR | ✓ | ✓ |
| SSM | ✓ | ✓ |
| MSDP | ✗ | ✓ |

**Avantages Linux** :
- Gratuit et open source
- Flexible et scriptable
- Parfait pour labs

**Avantages Cisco** :
- Plus de fonctionnalités (Auto-RP, MSDP)
- CLI complète (show ip pim neighbor, etc.)
- Support entreprise

## Cas d'usage

- **Lab réseau multicast** : Tests et développement
- **Routeur edge** : Passerelle multicast pour petit réseau
- **Broadcast IP** : Routeur Spine dans architecture SMPTE 2110
- **IPTV domestique** : Routeur multicast maison

## Exemple : Routeur Spine SMPTE 2110

```bash
#!/bin/bash
# spine-2110.sh : Routeur Spine pour broadcast IP

# 1. Configuration interfaces
ip addr add 192.168.10.1/24 dev eth0  # VLAN Rouge
ip addr add 192.168.20.1/24 dev eth1  # VLAN Bleu
ip link set eth0 up mtu 9000
ip link set eth1 up mtu 9000

# 2. Activer forwarding et multicast
sysctl -w net.ipv4.ip_forward=1
sysctl -w net.ipv4.conf.all.mc_forwarding=1

# 3. Routes multicast
ip route add 239.100.0.0/16 dev eth0  # Rouge
ip route add 239.200.0.0/16 dev eth1  # Bleu

# 4. Augmenter buffers UDP
sysctl -w net.core.rmem_max=134217728
sysctl -w net.core.wmem_max=134217728

# 5. Configuration PIM
cat > /etc/pimd.conf <<EOF
phyint eth0 enable
phyint eth1 enable
rp-address 192.168.10.1
EOF

# 6. Démarrer pimd
systemctl restart pimd

# 7. Vérifier
ip mroute show
ip maddr show
```

## Connexions

- [[MULTICAST - diffusion groupe]] - Concept général
- [[PIM - Protocol Independent Multicast]] - Protocole détaillé
- [[IGMP - Internet Group Management Protocol]] - Communication clients-routeur
- [[MULTICAST Cisco - routeur PIM]] - Équivalent Cisco
- [[MULTICAST Linux - client réception flux]] - Client multicast
- [[MULTICAST Linux - bridge IGMP snooping]] - Switch L2 Linux
- [[SMPTE 2110 - transport multimédia par IP]] - Cas d'usage broadcast IP

---
**Sources** : Linux IP Multicast HOWTO, pimd documentation, man pimd.conf
