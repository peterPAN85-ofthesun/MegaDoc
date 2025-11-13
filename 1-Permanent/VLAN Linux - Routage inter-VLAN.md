---
type: permanent
created: 2025-01-08 16:47
tags:
  - permanent
  - réseau
  - vlan
  - linux
  - routage
  - forwarding
---

# VLAN Linux - Routage inter-VLAN

> [!abstract] Concept
> Activer le routage IP sur serveur Linux pour permettre la communication entre VLANs

## Explication

Le **routage inter-VLAN** permet aux clients de différents VLANs de communiquer entre eux via un serveur Linux agissant comme routeur.

**Prérequis** :
1. Interfaces VLAN configurées (eth0.10, eth0.20, etc.)
2. **IP forwarding activé** sur le serveur Linux
3. Routes correctes sur les clients (passerelle = IP du serveur dans leur VLAN)
4. Firewall autorise le trafic inter-VLAN (optionnel)

**Architecture** :
```
[PC VLAN 10] ─ [Switch trunk] ─ [Linux Server eth0.10/.20/.30] ─ [Internet]
[PC VLAN 20] ─                   (routage inter-VLAN)
```

## Exemples

### Activer IP Forwarding

**Temporaire** (perdu au redémarrage) :

```bash
# IPv4
sysctl -w net.ipv4.ip_forward=1

# IPv6
sysctl -w net.ipv6.conf.all.forwarding=1

# Vérifier
cat /proc/sys/net/ipv4/ip_forward
```

**Permanent** :

Éditer `/etc/sysctl.conf` :

```bash
# Décommenter ou ajouter
net.ipv4.ip_forward=1
net.ipv6.conf.all.forwarding=1
```

**Appliquer** :
```bash
sysctl -p
```

### Vérifier le routage

```bash
# Table de routage
ip route show

# Réseaux directement connectés
ip route | grep "proto kernel"
```

**Sortie attendue** :
```
192.168.10.0/24 dev eth0.10 proto kernel scope link src 192.168.10.254
192.168.20.0/24 dev eth0.20 proto kernel scope link src 192.168.20.254
192.168.30.0/24 dev eth0.30 proto kernel scope link src 192.168.30.254
```

Les réseaux directement connectés sont automatiquement routables.

### Configurer firewall (iptables)

**Autoriser tout le trafic inter-VLAN** :

```bash
# Accepter forwarding
iptables -P FORWARD ACCEPT

# Sauvegarder
iptables-save > /etc/iptables/rules.v4
```

**Filtrage sélectif** (VLAN 10 → VLAN 20 uniquement) :

```bash
# Bloquer forwarding par défaut
iptables -P FORWARD DROP

# Autoriser VLAN 10 → VLAN 20
iptables -A FORWARD -i eth0.10 -o eth0.20 -j ACCEPT
iptables -A FORWARD -i eth0.20 -o eth0.10 -m state --state ESTABLISHED,RELATED -j ACCEPT

# Autoriser loopback
iptables -A FORWARD -i lo -o lo -j ACCEPT

# Sauvegarder
iptables-save > /etc/iptables/rules.v4
```

**UFW** (alternative plus simple) :

```bash
# Activer UFW
ufw enable

# Éditer /etc/default/ufw
DEFAULT_FORWARD_POLICY="ACCEPT"

# Recharger
ufw reload
```

### Tester le routage inter-VLAN

**Depuis un PC VLAN 10** (192.168.10.10) :

```bash
# Ping passerelle VLAN 10
ping 192.168.10.254  # OK

# Ping vers VLAN 20
ping 192.168.20.1  # OK si routage activé
```

**Depuis le serveur Linux** :

```bash
# Ping vers PC VLAN 10
ping -I eth0.10 192.168.10.10

# Ping vers PC VLAN 20
ping -I eth0.20 192.168.20.1
```

### Configuration complète

**Interfaces** (`/etc/network/interfaces`) :

```bash
auto eth0
iface eth0 inet manual

auto eth0.10
iface eth0.10 inet static
    address 192.168.10.254/24
    vlan-raw-device eth0

auto eth0.20
iface eth0.20 inet static
    address 192.168.20.254/24
    vlan-raw-device eth0
```

**IP Forwarding** (`/etc/sysctl.conf`) :

```bash
net.ipv4.ip_forward=1
```

**Firewall** :

```bash
# Autoriser forwarding
iptables -P FORWARD ACCEPT

# Sauvegarder
iptables-save > /etc/iptables/rules.v4
```

**Appliquer** :

```bash
# Recharger interfaces
systemctl restart networking

# Activer forwarding
sysctl -p

# Vérifier
ip addr show
ip route show
cat /proc/sys/net/ipv4/ip_forward
```

### Ajouter une route par défaut (vers Internet)

```bash
# Route vers Internet via routeur externe
ip route add default via 203.0.113.1

# Permanent : dans /etc/network/interfaces
auto eth1
iface eth1 inet static
    address 203.0.113.2/30
    gateway 203.0.113.1
```

### Dépannage

**Problème** : ping entre VLANs échoue

**Vérifications** :

```bash
# 1. Forwarding activé ?
cat /proc/sys/net/ipv4/ip_forward
# Doit retourner "1"

# 2. Interfaces up ?
ip link show | grep eth0

# 3. Firewall bloque ?
iptables -L FORWARD -v -n

# 4. Routes présentes ?
ip route show

# 5. Ping depuis serveur fonctionne ?
ping -I eth0.10 192.168.10.1
ping -I eth0.20 192.168.20.1
```

## Connexions

### Notes liées
- [[VLAN Linux - Configuration interfaces]] - Créer interfaces VLAN
- [[ROUTAGE - statique]] - Concept de routage
- [[VLAN Cisco - Router on a stick]] - Équivalent Cisco
- [[NAT - Network Address Translation]] - Souvent combiné avec routage

### Contexte
Configuration essentielle pour transformer un serveur Linux en routeur inter-VLAN. Alternative économique au Router on a stick Cisco ou à un switch Layer 3.

## Sources
- Formation Réseau - Routage inter-VLAN Linux
- Linux IP Forwarding Documentation

---
**Tags thématiques** : #routage #inter-vlan #ip-forwarding #linux #firewall
