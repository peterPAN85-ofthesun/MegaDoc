---
type: permanent
created: 2025-01-08 16:55
tags:
  - permanent
  - réseau
  - nat
  - linux
  - iptables
  - nftables
---

# NAT Linux - iptables et NAT

> [!abstract] Concept
> Configurer NAT/PAT sur Linux avec iptables pour partager une connexion Internet

## Explication

Linux utilise **iptables** (ou **nftables**) pour implémenter le NAT. Deux types principaux :
- **SNAT (Source NAT)** : modifier l'IP source (LAN → Internet)
- **DNAT (Destination NAT)** : modifier l'IP destination (Internet → serveur interne)

**Prérequis** :
- IP forwarding activé (`net.ipv4.ip_forward=1`)
- Deux interfaces réseau minimum (LAN + WAN)

**Table NAT iptables** : `nat` avec chaînes PREROUTING, POSTROUTING, OUTPUT

## Exemples

### Activer IP Forwarding

```bash
# Temporaire
sysctl -w net.ipv4.ip_forward=1

# Permanent
echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
sysctl -p

# Vérifier
cat /proc/sys/net/ipv4/ip_forward
```

### SNAT - Source NAT (IP fixe)

```bash
# WAN = eth0 avec IP 203.0.113.1
# LAN = eth1 réseau 192.168.1.0/24

iptables -t nat -A POSTROUTING -o eth0 -s 192.168.1.0/24 -j SNAT --to-source 203.0.113.1
```

**Résultat** : tout le trafic du LAN vers Internet apparaît comme provenant de `203.0.113.1`.

### MASQUERADE - PAT (IP dynamique)

```bash
# Même effet que SNAT mais pour IP dynamique (DHCP)
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
```

**Usage** : connexion Internet DHCP, interfaces PPP (3G/4G)

**MASQUERADE vs SNAT** :
- **MASQUERADE** : IP WAN dynamique, légèrement moins performant
- **SNAT** : IP WAN fixe, plus performant

### Configuration complète PAT

```bash
#!/bin/bash

# Variables
WAN_IF="eth0"
LAN_IF="eth1"
LAN_NET="192.168.1.0/24"

# 1. Activer IP forwarding
echo 1 > /proc/sys/net/ipv4/ip_forward

# 2. Flush rules existantes
iptables -F
iptables -t nat -F

# 3. Politique par défaut
iptables -P FORWARD DROP

# 4. Autoriser trafic établi
iptables -A FORWARD -m state --state ESTABLISHED,RELATED -j ACCEPT

# 5. Autoriser LAN → WAN
iptables -A FORWARD -i $LAN_IF -o $WAN_IF -s $LAN_NET -j ACCEPT

# 6. NAT (MASQUERADE)
iptables -t nat -A POSTROUTING -o $WAN_IF -j MASQUERADE

# 7. Sauvegarder
iptables-save > /etc/iptables/rules.v4
```

### DNAT - Port Forwarding

```bash
# Rediriger port 80 externe vers serveur web interne 192.168.1.10:80
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j DNAT --to-destination 192.168.1.10:80

# Autoriser le forward
iptables -A FORWARD -p tcp -d 192.168.1.10 --dport 80 -j ACCEPT
```

**Résultat** : `http://IP_PUBLIQUE` → `http://192.168.1.10`

### Port Forwarding multiples

```bash
# Serveur web (HTTP + HTTPS)
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j DNAT --to-destination 192.168.1.10:80
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 443 -j DNAT --to-destination 192.168.1.10:443

# SSH sur port custom (2222 → 22)
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 2222 -j DNAT --to-destination 192.168.1.20:22

# Autoriser forwards
iptables -A FORWARD -p tcp -d 192.168.1.10 --dport 80 -j ACCEPT
iptables -A FORWARD -p tcp -d 192.168.1.10 --dport 443 -j ACCEPT
iptables -A FORWARD -p tcp -d 192.168.1.20 --dport 22 -j ACCEPT
```

### Vérifier les règles NAT

```bash
# Voir table NAT
iptables -t nat -L -v -n

# Voir POSTROUTING (SNAT/MASQUERADE)
iptables -t nat -L POSTROUTING -v -n

# Voir PREROUTING (DNAT)
iptables -t nat -L PREROUTING -v -n

# Compter paquets
watch -n1 'iptables -t nat -L -v -n'
```

### Sauvegarder les règles

**Debian/Ubuntu** :

```bash
# Installer iptables-persistent
apt install iptables-persistent

# Sauvegarder
iptables-save > /etc/iptables/rules.v4
ip6tables-save > /etc/iptables/rules.v6

# Restaurer au démarrage (automatique avec iptables-persistent)
systemctl enable netfilter-persistent
```

**Alternative manuelle** :

```bash
# Dans /etc/rc.local
iptables-restore < /etc/iptables/rules.v4
```

### Supprimer règles NAT

```bash
# Flush table NAT
iptables -t nat -F

# Supprimer règle spécifique
iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
```

### Alternative : nftables (moderne)

```bash
# Configuration équivalente en nftables
nft add table nat
nft add chain nat postrouting { type nat hook postrouting priority 100 \; }
nft add rule nat postrouting oif eth0 masquerade
```

**nftables** : remplaçant moderne d'iptables (Debian 10+, Ubuntu 20.04+)

## Connexions

### Notes liées
- [[NAT - Network Address Translation]] - Concept NAT/PAT
- [[NAT Cisco - PAT et NAT Overload]] - Équivalent Cisco
- [[NAT Linux - Port forwarding]] - DNAT détaillé
- [[ROUTAGE - statique]] - Routes nécessaires pour NAT

### Contexte
Configuration essentielle pour partager une connexion Internet sur Linux (routeur, firewall, passerelle). MASQUERADE est la méthode la plus utilisée pour les petits réseaux.

## Sources
- Formation Réseau - NAT Linux
- iptables NAT Tutorial

---
**Tags thématiques** : #nat #iptables #masquerade #snat #dnat #linux
