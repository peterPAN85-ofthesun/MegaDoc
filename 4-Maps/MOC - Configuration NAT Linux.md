---
type: moc
created: 2025-01-08 01:44
tags:
  - moc
  - linux
  - nat
  - iptables
  - configuration
---

# 🗺️ MOC - Configuration NAT Linux

> [!note] Guide de référence
> Configuration complète du NAT avec iptables et nftables sur Linux/Debian.

## 📚 Concept

Voir [[NAT - Network Address Translation]] pour le concept général.

---

## Prérequis : IP Forwarding

```bash
# Temporaire
echo 1 > /proc/sys/net/ipv4/ip_forward

# Permanent
echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
sysctl -p

# Vérifier (doit afficher 1)
cat /proc/sys/net/ipv4/ip_forward
```

>[!important]
>Sans IP forwarding, le serveur ne route PAS les paquets.

---

## SNAT - Source NAT (Sortant)

### Méthode 1 : MASQUERADE (IP DHCP)

```bash
# NAT pour 192.168.1.0/24 sortant par eth0
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
```

>[!note]
>**MASQUERADE** recalcule automatiquement l'IP si elle change (DHCP).

### Méthode 2 : SNAT (IP fixe - recommandé)

```bash
# SNAT avec IP fixe (plus performant)
iptables -t nat -A POSTROUTING -o eth0 -s 192.168.1.0/24 -j SNAT --to-source 203.0.113.1
```

### Méthode 3 : Pool d'IP

```bash
# Pool : 203.0.113.10 à 203.0.113.20
iptables -t nat -A POSTROUTING -o eth0 -s 192.168.1.0/24 -j SNAT --to-source 203.0.113.10-203.0.113.20
```

---

## DNAT - Destination NAT (Port Forwarding)

### Port Forwarding simple

```bash
# Port 80 → Serveur web 192.168.1.10
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j DNAT --to-destination 192.168.1.10:80

# Autoriser le forwarding (IMPORTANT!)
iptables -A FORWARD -i eth0 -o eth1 -p tcp -d 192.168.1.10 --dport 80 -j ACCEPT
iptables -A FORWARD -i eth1 -o eth0 -s 192.168.1.10 -j ACCEPT
```

>[!warning]
>DNAT seul ne suffit pas ! Ajouter règles FORWARD.

### Port externe différent

```bash
# Port externe 8080 → Port interne 80
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 8080 -j DNAT --to-destination 192.168.1.10:80
iptables -A FORWARD -i eth0 -o eth1 -p tcp -d 192.168.1.10 --dport 80 -j ACCEPT
```

### Plusieurs redirections

```bash
# HTTP
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j DNAT --to-destination 192.168.1.10:80

# HTTPS
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 443 -j DNAT --to-destination 192.168.1.10:443

# SSH (port externe 2222 → interne 22)
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 2222 -j DNAT --to-destination 192.168.1.20:22

# Autoriser forwarding
iptables -A FORWARD -i eth0 -o eth1 -p tcp -m multiport --dports 80,443 -d 192.168.1.10 -j ACCEPT
iptables -A FORWARD -i eth0 -o eth1 -p tcp --dport 22 -d 192.168.1.20 -j ACCEPT
```

---

## NAT 1:1 (Full NAT)

```bash
# Entrant : 203.0.113.10 → 192.168.1.10
iptables -t nat -A PREROUTING -d 203.0.113.10 -j DNAT --to-destination 192.168.1.10

# Sortant : 192.168.1.10 → apparaît comme 203.0.113.10
iptables -t nat -A POSTROUTING -s 192.168.1.10 -j SNAT --to-source 203.0.113.10
```

---

## Script Complet : Routeur/Gateway

```bash
#!/bin/bash
# Routeur NAT Debian

WAN=eth0
LAN=eth1
LAN_NET=192.168.1.0/24
WAN_IP=203.0.113.1

# IP forwarding
echo 1 > /proc/sys/net/ipv4/ip_forward
sed -i 's/#net.ipv4.ip_forward=1/net.ipv4.ip_forward=1/' /etc/sysctl.conf

# Réinitialiser
iptables -F
iptables -t nat -F
iptables -X

# Politique par défaut
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# INPUT
iptables -A INPUT -i lo -j ACCEPT
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -i $LAN -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -i $LAN -p icmp -j ACCEPT

# FORWARD
iptables -A FORWARD -i $LAN -o $WAN -s $LAN_NET -j ACCEPT
iptables -A FORWARD -i $WAN -o $LAN -d $LAN_NET -m state --state ESTABLISHED,RELATED -j ACCEPT

# NAT (SNAT/PAT)
# Méthode 1 : MASQUERADE (IP DHCP)
iptables -t nat -A POSTROUTING -o $WAN -s $LAN_NET -j MASQUERADE

# Méthode 2 : SNAT (IP fixe - décommenter)
# iptables -t nat -A POSTROUTING -o $WAN -s $LAN_NET -j SNAT --to-source $WAN_IP

# Sauvegarder
apt install -y iptables-persistent
iptables-save > /etc/iptables/rules.v4
```

---

## Vérification

```bash
# Règles NAT
iptables -t nat -L -v -n

# Connexions actives
conntrack -L

# Filtrer par IP
conntrack -L -s 192.168.1.10

# Statistiques
conntrack -S
```

---

## Dépannage

```bash
# Tester depuis client
ping 8.8.8.8
curl http://ipinfo.io/ip

# Logs
tail -f /var/log/syslog | grep -i nat

# Capturer paquets
tcpdump -i eth0 -n host 192.168.1.10
```

---

## Problèmes Courants

| Problème | Solution |
|----------|----------|
| Pas d'Internet | Vérifier IP forwarding |
| NAT inactif | Vérifier règles POSTROUTING |
| Port forwarding KO | Ajouter règles FORWARD |
| Connexions lentes | Augmenter `nf_conntrack_max` |

### Augmenter table de connexions

```bash
# Limite actuelle
cat /proc/sys/net/netfilter/nf_conntrack_max

# Augmenter
echo 65536 > /proc/sys/net/netfilter/nf_conntrack_max

# Permanent
echo "net.netfilter.nf_conntrack_max = 65536" >> /etc/sysctl.conf
sysctl -p
```

---

## nftables (moderne)

```bash
#!/usr/sbin/nft -f

flush ruleset

table ip nat {
    chain prerouting {
        type nat hook prerouting priority -100;
        iif eth0 tcp dport 80 dnat to 192.168.1.10:80
        iif eth0 tcp dport 443 dnat to 192.168.1.10:443
    }

    chain postrouting {
        type nat hook postrouting priority 100;
        oif eth0 ip saddr 192.168.1.0/24 masquerade
    }
}

table ip filter {
    chain forward {
        type filter hook forward priority 0; policy drop;
        iif eth1 oif eth0 ip saddr 192.168.1.0/24 accept
        iif eth0 oif eth1 ip daddr 192.168.1.0/24 ct state established,related accept
        iif eth0 oif eth1 ip daddr 192.168.1.10 tcp dport { 80, 443 } accept
    }
}
```

Appliquer :
```bash
nft -f /etc/nftables.conf
systemctl enable nftables
```

---

## Connexions

### Concepts
- [[NAT - Network Address Translation]]
- [[SNAT - Source NAT]]
- [[DNAT - Destination NAT]]

### Configuration Cisco équivalente
- [[MOC - Configuration NAT Cisco]]

---

**Sources** : Fiche NAT/PAT, man iptables, man nft
