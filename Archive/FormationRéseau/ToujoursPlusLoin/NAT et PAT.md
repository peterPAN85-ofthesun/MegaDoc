---
date: 2025/11/07
tags:
  - Réseau
  - NAT
  - PAT
  - Cisco
  - Debian
---

# NAT et PAT - Network Address Translation

Le NAT (Network Address Translation) et le PAT (Port Address Translation) permettent de traduire des adresses IP privées en adresses publiques pour accéder à Internet, tout en économisant les adresses IPv4 et en ajoutant une couche de sécurité. Cette fiche présente la configuration du NAT/PAT sur les équipements Cisco et les systèmes Debian/Linux.

---

## Concepts de base

### Types de NAT

| Type | Description | Ratio | Usage |
|------|-------------|-------|-------|
| **NAT Statique** | 1 IP privée ↔ 1 IP publique fixe | 1:1 | Serveurs accessibles depuis Internet |
| **NAT Dynamique** | Pool d'IP privées ↔ Pool d'IP publiques | N:N | Plusieurs utilisateurs, IP publique variable |
| **PAT / NAT Overload** | Plusieurs IP privées ↔ 1 IP publique | N:1 | Partage connexion Internet (box ADSL) |
| **Port Forwarding** | Redirection de port vers IP privée | - | Accès à un service interne (web, SSH) |

### Plages d'adresses privées (RFC 1918)

| Classe | Plage | Masque CIDR | Nombre d'adresses |
|--------|-------|-------------|-------------------|
| A | 10.0.0.0 - 10.255.255.255 | 10.0.0.0/8 | 16 777 216 |
| B | 172.16.0.0 - 172.31.255.255 | 172.16.0.0/12 | 1 048 576 |
| C | 192.168.0.0 - 192.168.255.255 | 192.168.0.0/16 | 65 536 |

>[!NOTE]
>**NAT vs PAT** :
>- **NAT** : Translation d'adresse IP uniquement
>- **PAT** : Translation d'adresse IP + port source (permet plusieurs connexions avec 1 seule IP publique)
>
>Le PAT est aussi appelé **NAT Overload** chez Cisco.

---

## NAT/PAT sur Cisco

### Configuration générale

**Étapes de configuration :**
1. Définir les interfaces Inside (réseau privé) et Outside (Internet)
2. Configurer le type de NAT (statique, dynamique, PAT)
3. Créer les règles de translation

### NAT Statique (1:1)

**Cas d'usage :** Serveur web interne accessible depuis Internet avec une IP publique dédiée.

**Configuration :**

```
Router> enable
Router# configure terminal

# Définir les interfaces
Router(config)# interface GigabitEthernet0/0
Router(config-if)# description Interface WAN (Internet)
Router(config-if)# ip address 203.0.113.1 255.255.255.252
Router(config-if)# ip nat outside
Router(config-if)# no shutdown
Router(config-if)# exit

Router(config)# interface GigabitEthernet0/1
Router(config-if)# description Interface LAN (Réseau interne)
Router(config-if)# ip address 192.168.1.254 255.255.255.0
Router(config-if)# ip nat inside
Router(config-if)# no shutdown
Router(config-if)# exit

# NAT statique : Serveur web interne (192.168.1.10) → IP publique (203.0.113.10)
Router(config)# ip nat inside source static 192.168.1.10 203.0.113.10

Router(config)# end
Router# write memory
```

**Résultat :**
- Le serveur `192.168.1.10` est accessible depuis Internet via `203.0.113.10`
- La translation est bidirectionnelle (entrante et sortante)

**Vérification :**

```
Router# show ip nat translations
Router# show ip nat statistics
Router# show running-config | include nat
```

### NAT Dynamique (Pool d'adresses)

**Cas d'usage :** Plusieurs utilisateurs internes accèdent à Internet avec un pool d'IP publiques.

**Configuration :**

```
Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip nat outside
Router(config-if)# exit

Router(config)# interface GigabitEthernet0/1
Router(config-if)# ip nat inside
Router(config-if)# exit

# Créer une ACL pour définir les adresses à traduire
Router(config)# access-list 1 permit 192.168.1.0 0.0.0.255

# Créer un pool d'adresses publiques
Router(config)# ip nat pool PUBLIC_POOL 203.0.113.10 203.0.113.20 netmask 255.255.255.0

# Lier l'ACL au pool
Router(config)# ip nat inside source list 1 pool PUBLIC_POOL

Router(config)# end
Router# write memory
```

**Résultat :**
- Les clients du réseau `192.168.1.0/24` utilisent les IP de `203.0.113.10` à `203.0.113.20`
- Chaque client obtient temporairement une IP publique du pool
- Limitation : Maximum 11 connexions simultanées (taille du pool)

### PAT / NAT Overload (N:1)

**Cas d'usage :** Partager une seule IP publique pour tout un réseau (configuration la plus courante).

**Méthode 1 : Avec l'adresse de l'interface**

```
Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip address 203.0.113.1 255.255.255.252
Router(config-if)# ip nat outside
Router(config-if)# exit

Router(config)# interface GigabitEthernet0/1
Router(config-if)# ip address 192.168.1.254 255.255.255.0
Router(config-if)# ip nat inside
Router(config-if)# exit

# ACL pour le réseau interne
Router(config)# access-list 1 permit 192.168.1.0 0.0.0.255

# PAT avec l'IP de l'interface outside
Router(config)# ip nat inside source list 1 interface GigabitEthernet0/0 overload

Router(config)# end
Router# write memory
```

**Méthode 2 : Avec un pool (moins courant)**

```
Router(config)# ip nat pool PAT_POOL 203.0.113.1 203.0.113.1 netmask 255.255.255.252
Router(config)# ip nat inside source list 1 pool PAT_POOL overload
```

>[!NOTE]
>**Overload** : Mot-clé indiquant le PAT (utilisation des ports sources pour multiplexer les connexions)
>
>Avec PAT, des milliers de clients peuvent partager une seule IP publique grâce à la translation des ports (source port randomization).

**Vérification :**

```
Router# show ip nat translations
Pro Inside global      Inside local       Outside local      Outside global
tcp 203.0.113.1:1024   192.168.1.10:5234  8.8.8.8:80         8.8.8.8:80
tcp 203.0.113.1:1025   192.168.1.11:6781  1.1.1.1:443        1.1.1.1:443
```

### Port Forwarding (Redirection de port)

**Cas d'usage :** Rediriger un port spécifique de l'IP publique vers un serveur interne.

**Exemple : Serveur web sur port 80**

```
Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip nat outside
Router(config-if)# exit

Router(config)# interface GigabitEthernet0/1
Router(config-if)# ip nat inside
Router(config-if)# exit

# Redirection du port 80 vers le serveur web interne (192.168.1.10)
Router(config)# ip nat inside source static tcp 192.168.1.10 80 203.0.113.1 80 extendable

Router(config)# end
Router# write memory
```

**Exemple : Plusieurs redirections**

```
# Serveur web (HTTP)
Router(config)# ip nat inside source static tcp 192.168.1.10 80 203.0.113.1 80

# Serveur web (HTTPS)
Router(config)# ip nat inside source static tcp 192.168.1.10 443 203.0.113.1 443

# Serveur SSH
Router(config)# ip nat inside source static tcp 192.168.1.20 22 203.0.113.1 2222

# Serveur FTP
Router(config)# ip nat inside source static tcp 192.168.1.30 21 203.0.113.1 21
```

>[!NOTE]
>**Port externe différent :** Dans l'exemple SSH ci-dessus, le port externe 2222 redirige vers le port interne 22. Cela permet de masquer le service SSH sur un port non-standard.

### NAT avec ACL étendue (filtrage)

Pour ne NATer que certains flux :

```
Router(config)# ip access-list extended NAT_FILTER
Router(config-ext-nacl)# permit ip 192.168.1.0 0.0.0.255 any
Router(config-ext-nacl)# deny ip 192.168.2.0 0.0.0.255 any
Router(config-ext-nacl)# exit

Router(config)# ip nat inside source list NAT_FILTER interface GigabitEthernet0/0 overload
```

### Netflow et NAT (Logging)

Pour logger les translations NAT :

```
Router(config)# ip nat log translations syslog
```

### Supprimer des translations actives

```
# Supprimer toutes les translations dynamiques
Router# clear ip nat translation *

# Supprimer une translation spécifique
Router# clear ip nat translation inside 192.168.1.10 outside 203.0.113.10
```

### Exemple complet : Entreprise avec DMZ

**Topologie :**
```
Internet (203.0.113.0/29) ── [R1 GigE0/0] ── Outside
                                │
                                ├── [GigE0/1] ── LAN (192.168.1.0/24)
                                │
                                └── [GigE0/2] ── DMZ (10.0.0.0/24)
```

**Objectifs :**
- LAN : PAT vers Internet (1 IP publique partagée)
- DMZ : Serveur web (10.0.0.10) accessible via 203.0.113.2
- DMZ : Serveur mail (10.0.0.20) accessible via 203.0.113.3

**Configuration :**

```
Router> enable
Router# configure terminal

# Interface WAN
Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip address 203.0.113.1 255.255.255.248
Router(config-if)# ip nat outside
Router(config-if)# no shutdown
Router(config-if)# exit

# Interface LAN
Router(config)# interface GigabitEthernet0/1
Router(config-if)# ip address 192.168.1.254 255.255.255.0
Router(config-if)# ip nat inside
Router(config-if)# no shutdown
Router(config-if)# exit

# Interface DMZ
Router(config)# interface GigabitEthernet0/2
Router(config-if)# ip address 10.0.0.254 255.255.255.0
Router(config-if)# ip nat inside
Router(config-if)# no shutdown
Router(config-if)# exit

# ACL pour le LAN (PAT)
Router(config)# access-list 10 permit 192.168.1.0 0.0.0.255

# PAT pour le LAN
Router(config)# ip nat inside source list 10 interface GigabitEthernet0/0 overload

# NAT statique pour serveur web DMZ
Router(config)# ip nat inside source static 10.0.0.10 203.0.113.2

# NAT statique pour serveur mail DMZ
Router(config)# ip nat inside source static 10.0.0.20 203.0.113.3

Router(config)# end
Router# write memory
```

### Vérification et dépannage

```
# Afficher les translations actives
Router# show ip nat translations
Router# show ip nat translations verbose

# Afficher les statistiques
Router# show ip nat statistics

# Déboguer le NAT (attention en production)
Router# debug ip nat
Router# debug ip nat detailed

# Afficher la configuration NAT
Router# show running-config | include nat
Router# show ip nat translations | count

# Tester depuis un client
Router# ping 8.8.8.8 source 192.168.1.10
```

**Résolution des problèmes courants :**

| Problème | Solution |
|----------|----------|
| Pas de translation | Vérifier `ip nat inside/outside` sur les interfaces |
| Table NAT pleine | `clear ip nat translation *` ou augmenter timeout |
| NAT statique ne fonctionne pas | Vérifier routage et ACL firewall |
| Connexions lentes | Augmenter `ip nat translation timeout` |

---

## NAT/PAT sur Debian/Linux

Sur Linux, le NAT est réalisé avec **iptables** (table nat) ou **nftables**.

### Prérequis : Activer l'IP Forwarding

```bash
# Temporaire
echo 1 > /proc/sys/net/ipv4/ip_forward

# Permanent
echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
sysctl -p

# Vérifier
cat /proc/sys/net/ipv4/ip_forward
```

### SNAT - Source NAT (équivalent PAT Cisco)

**Cas d'usage :** Partager la connexion Internet du serveur avec le réseau local.

**Topologie :**
```
LAN (192.168.1.0/24) ── eth1 [Serveur Debian] eth0 ── Internet (IP publique)
```

**Méthode 1 : MASQUERADE (IP dynamique - DHCP)**

```bash
# Activer le forwarding
echo 1 > /proc/sys/net/ipv4/ip_forward

# MASQUERADE : NAT dynamique adapté aux IP DHCP
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
```

>[!NOTE]
>**MASQUERADE** : Utilisé quand l'IP de l'interface WAN est dynamique (DHCP/PPPoE). Il recalcule automatiquement l'IP source à chaque changement.

**Méthode 2 : SNAT (IP fixe - plus performant)**

```bash
# SNAT : NAT avec IP source fixe
iptables -t nat -A POSTROUTING -o eth0 -s 192.168.1.0/24 -j SNAT --to-source 203.0.113.1
```

**Méthode 3 : SNAT avec plage d'IP publiques**

```bash
# Pool d'IP publiques : 203.0.113.10 à 203.0.113.20
iptables -t nat -A POSTROUTING -o eth0 -s 192.168.1.0/24 -j SNAT --to-source 203.0.113.10-203.0.113.20
```

### DNAT - Destination NAT (Port Forwarding)

**Cas d'usage :** Rediriger un port externe vers un serveur interne.

**Exemple : Serveur web interne (192.168.1.10)**

```bash
# Rediriger le port 80 (HTTP) vers le serveur web interne
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j DNAT --to-destination 192.168.1.10:80

# Autoriser le forwarding
iptables -A FORWARD -i eth0 -o eth1 -p tcp -d 192.168.1.10 --dport 80 -j ACCEPT
iptables -A FORWARD -i eth1 -o eth0 -s 192.168.1.10 -j ACCEPT
```

**Exemple : Port externe différent du port interne**

```bash
# Port externe 8080 → Port interne 80
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 8080 -j DNAT --to-destination 192.168.1.10:80
iptables -A FORWARD -i eth0 -o eth1 -p tcp -d 192.168.1.10 --dport 80 -j ACCEPT
```

**Exemple : Plusieurs redirections**

```bash
# HTTP vers serveur web
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j DNAT --to-destination 192.168.1.10:80

# HTTPS vers serveur web
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 443 -j DNAT --to-destination 192.168.1.10:443

# SSH vers serveur d'administration (port externe 2222 → port interne 22)
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 2222 -j DNAT --to-destination 192.168.1.20:22

# RDP vers serveur Windows
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 3389 -j DNAT --to-destination 192.168.1.30:3389

# Autoriser le forwarding pour ces services
iptables -A FORWARD -i eth0 -o eth1 -p tcp -m multiport --dports 80,443 -d 192.168.1.10 -j ACCEPT
iptables -A FORWARD -i eth0 -o eth1 -p tcp --dport 22 -d 192.168.1.20 -j ACCEPT
iptables -A FORWARD -i eth0 -o eth1 -p tcp --dport 3389 -d 192.168.1.30 -j ACCEPT
```

### NAT 1:1 (Full NAT - équivalent NAT statique Cisco)

**Cas d'usage :** Mapper entièrement une IP publique vers une IP privée.

```bash
# Toutes les connexions vers 203.0.113.10 → 192.168.1.10
iptables -t nat -A PREROUTING -d 203.0.113.10 -j DNAT --to-destination 192.168.1.10

# Toutes les connexions depuis 192.168.1.10 → apparaissent comme 203.0.113.10
iptables -t nat -A POSTROUTING -s 192.168.1.10 -j SNAT --to-source 203.0.113.10
```

### Load Balancing avec NAT

Répartir la charge entre plusieurs serveurs internes :

```bash
# Répartition round-robin entre 3 serveurs web
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -m statistic --mode nth --every 3 --packet 0 -j DNAT --to-destination 192.168.1.10:80
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -m statistic --mode nth --every 2 --packet 0 -j DNAT --to-destination 192.168.1.11:80
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j DNAT --to-destination 192.168.1.12:80
```

### Exemple complet : Routeur/Gateway Debian

**Topologie :**
```
Internet ── eth0 [Serveur Debian] eth1 ── LAN (192.168.1.0/24)
```

**Script complet :**

```bash
#!/bin/bash
# Script NAT complet pour routeur Debian

# Variables
WAN=eth0
LAN=eth1
LAN_NET=192.168.1.0/24
WAN_IP=203.0.113.1

echo "Configuration du NAT/Firewall..."

# Activer IP forwarding
echo 1 > /proc/sys/net/ipv4/ip_forward
sed -i 's/#net.ipv4.ip_forward=1/net.ipv4.ip_forward=1/' /etc/sysctl.conf

# Réinitialiser les règles
iptables -F
iptables -t nat -F
iptables -X

# Politique par défaut
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# ========== INPUT ==========
iptables -A INPUT -i lo -j ACCEPT
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -i $LAN -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -i $LAN -p icmp -j ACCEPT

# ========== FORWARD ==========
# LAN vers Internet
iptables -A FORWARD -i $LAN -o $WAN -s $LAN_NET -j ACCEPT
iptables -A FORWARD -i $WAN -o $LAN -d $LAN_NET -m state --state ESTABLISHED,RELATED -j ACCEPT

# ========== NAT (SNAT/PAT) ==========
# Méthode 1 : MASQUERADE (si IP DHCP)
iptables -t nat -A POSTROUTING -o $WAN -s $LAN_NET -j MASQUERADE

# Méthode 2 : SNAT (si IP fixe - plus performant)
# iptables -t nat -A POSTROUTING -o $WAN -s $LAN_NET -j SNAT --to-source $WAN_IP

echo "NAT configuré : LAN ($LAN_NET) peut accéder à Internet via $WAN ($WAN_IP)"

# Sauvegarder
apt install -y iptables-persistent
iptables-save > /etc/iptables/rules.v4

echo "Configuration sauvegardée"
```

### Exemple avancé : Serveur avec DMZ

**Topologie :**
```
Internet ── eth0 [Serveur Debian] eth1 ── LAN (192.168.1.0/24)
                        │
                        └── eth2 ── DMZ (10.0.0.0/24)
```

**Script complet :**

```bash
#!/bin/bash
# Routeur avec DMZ

WAN=eth0
LAN=eth1
DMZ=eth2
LAN_NET=192.168.1.0/24
DMZ_NET=10.0.0.0/24
DMZ_WEB=10.0.0.10
DMZ_MAIL=10.0.0.20
WAN_IP=203.0.113.1

# IP forwarding
echo 1 > /proc/sys/net/ipv4/ip_forward

# Réinitialisation
iptables -F
iptables -t nat -F
iptables -X

# Politiques
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# ========== INPUT ==========
iptables -A INPUT -i lo -j ACCEPT
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -i $LAN -p tcp --dport 22 -j ACCEPT

# ========== FORWARD ==========
# LAN → Internet (PAT)
iptables -A FORWARD -i $LAN -o $WAN -s $LAN_NET -j ACCEPT
iptables -A FORWARD -i $WAN -o $LAN -d $LAN_NET -m state --state ESTABLISHED,RELATED -j ACCEPT

# Internet → DMZ (services spécifiques)
iptables -A FORWARD -i $WAN -o $DMZ -p tcp --dport 80 -d $DMZ_WEB -j ACCEPT
iptables -A FORWARD -i $WAN -o $DMZ -p tcp --dport 443 -d $DMZ_WEB -j ACCEPT
iptables -A FORWARD -i $WAN -o $DMZ -p tcp --dport 25 -d $DMZ_MAIL -j ACCEPT
iptables -A FORWARD -i $WAN -o $DMZ -p tcp --dport 587 -d $DMZ_MAIL -j ACCEPT

# DMZ → Internet (uniquement réponses)
iptables -A FORWARD -i $DMZ -o $WAN -s $DMZ_NET -m state --state ESTABLISHED,RELATED -j ACCEPT

# LAN → DMZ (administrateurs)
iptables -A FORWARD -i $LAN -o $DMZ -s $LAN_NET -d $DMZ_NET -j ACCEPT
iptables -A FORWARD -i $DMZ -o $LAN -s $DMZ_NET -d $LAN_NET -m state --state ESTABLISHED,RELATED -j ACCEPT

# DMZ → LAN : INTERDIT
iptables -A FORWARD -i $DMZ -o $LAN -j DROP

# ========== NAT ==========
# SNAT : LAN vers Internet
iptables -t nat -A POSTROUTING -o $WAN -s $LAN_NET -j SNAT --to-source $WAN_IP

# DNAT : Port forwarding vers DMZ
iptables -t nat -A PREROUTING -i $WAN -p tcp --dport 80 -j DNAT --to-destination $DMZ_WEB:80
iptables -t nat -A PREROUTING -i $WAN -p tcp --dport 443 -j DNAT --to-destination $DMZ_WEB:443
iptables -t nat -A PREROUTING -i $WAN -p tcp --dport 25 -j DNAT --to-destination $DMZ_MAIL:25
iptables -t nat -A PREROUTING -i $WAN -p tcp --dport 587 -j DNAT --to-destination $DMZ_MAIL:587

echo "NAT et DMZ configurés"
iptables-save > /etc/iptables/rules.v4
```

### NAT avec nftables (moderne)

**Configuration équivalente avec nftables :**

```bash
#!/usr/sbin/nft -f

flush ruleset

table ip nat {
    chain prerouting {
        type nat hook prerouting priority -100;

        # DNAT : Port forwarding
        iif eth0 tcp dport 80 dnat to 192.168.1.10:80
        iif eth0 tcp dport 443 dnat to 192.168.1.10:443
    }

    chain postrouting {
        type nat hook postrouting priority 100;

        # MASQUERADE : PAT pour le LAN
        oif eth0 ip saddr 192.168.1.0/24 masquerade
    }
}

table ip filter {
    chain forward {
        type filter hook forward priority 0; policy drop;

        # LAN vers Internet
        iif eth1 oif eth0 ip saddr 192.168.1.0/24 accept
        iif eth0 oif eth1 ip daddr 192.168.1.0/24 ct state established,related accept

        # Internet vers serveur web interne
        iif eth0 oif eth1 ip daddr 192.168.1.10 tcp dport { 80, 443 } accept
    }
}
```

Appliquer :

```bash
nft -f /etc/nftables.conf
systemctl enable nftables
```

### Vérification et dépannage

**Afficher les règles NAT :**

```bash
# iptables
iptables -t nat -L -v -n
iptables -t nat -L -v -n --line-numbers

# nftables
nft list ruleset
nft list table nat
```

**Afficher les connexions actives :**

```bash
# Voir toutes les connexions trackées
conntrack -L

# Filtrer par IP
conntrack -L -s 192.168.1.10
conntrack -L -d 8.8.8.8

# Statistiques
conntrack -S
```

**Tester le NAT :**

```bash
# Depuis un client du LAN
ping 8.8.8.8
curl http://ipinfo.io/ip

# Vérifier les logs
tail -f /var/log/syslog | grep -i nat

# Capturer les paquets
tcpdump -i eth0 -n host 192.168.1.10
tcpdump -i eth0 -n port 80
```

**Problèmes courants :**

| Problème | Vérification | Solution |
|----------|--------------|----------|
| Pas d'accès Internet | `cat /proc/sys/net/ipv4/ip_forward` | Activer IP forwarding |
| NAT ne fonctionne pas | `iptables -t nat -L -v -n` | Vérifier règles POSTROUTING |
| Port forwarding inactif | `iptables -L FORWARD -v -n` | Ajouter règles FORWARD |
| Connexions lentes | `conntrack -S` | Augmenter `nf_conntrack_max` |

**Augmenter la table de connexions :**

```bash
# Afficher la limite actuelle
cat /proc/sys/net/netfilter/nf_conntrack_max

# Augmenter temporairement
echo 65536 > /proc/sys/net/netfilter/nf_conntrack_max

# Augmenter définitivement
echo "net.netfilter.nf_conntrack_max = 65536" >> /etc/sysctl.conf
sysctl -p
```

---

## Comparaison Cisco vs Debian

| Aspect | Cisco | Debian/Linux |
|--------|-------|--------------|
| **NAT Statique** | `ip nat inside source static [IP_int] [IP_pub]` | `iptables -t nat -A PREROUTING -d [IP_pub] -j DNAT --to [IP_int]` |
| **PAT/Overload** | `ip nat inside source list [ACL] interface [int] overload` | `iptables -t nat -A POSTROUTING -o [int] -j MASQUERADE` |
| **Port Forwarding** | `ip nat inside source static tcp [IP_int] [port_int] [IP_pub] [port_pub]` | `iptables -t nat -A PREROUTING -p tcp --dport [port_pub] -j DNAT --to [IP_int]:[port_int]` |
| **Interfaces** | `ip nat inside/outside` | Spécifié dans les règles (-i/-o) |
| **Vérification** | `show ip nat translations` | `conntrack -L` |
| **Statistiques** | `show ip nat statistics` | `iptables -t nat -L -v` |
| **Persistance** | `write memory` | `iptables-save` / `netfilter-persistent save` |
| **Table de connexions** | Gérée automatiquement | `/proc/sys/net/netfilter/nf_conntrack_max` |
| **Logs** | `log` dans ACL ou `ip nat log translations` | `iptables -j LOG` |
| **Hairpin NAT** | `ip nat inside source ...` (même interface) | Règles spécifiques nécessaires |

---

## Concepts avancés

### Hairpin NAT / NAT Loopback

**Problème :** Un client interne veut accéder à un serveur interne via son IP publique.

**Exemple :** Client `192.168.1.50` veut accéder à `203.0.113.10` (qui est en réalité `192.168.1.10` en NAT).

**Solution Cisco :**

```
Router(config)# ip nat inside source static 192.168.1.10 203.0.113.10
Router(config)# interface GigabitEthernet0/1
Router(config-if)# ip nat inside
Router(config-if)# exit
```

Cisco gère automatiquement le hairpin NAT.

**Solution Debian :**

```bash
# DNAT : IP publique → IP privée
iptables -t nat -A PREROUTING -d 203.0.113.10 -j DNAT --to-destination 192.168.1.10

# SNAT : Pour le trafic interne (hairpin)
iptables -t nat -A POSTROUTING -s 192.168.1.0/24 -d 192.168.1.10 -j MASQUERADE
```

### NAT Traversal (pour VPN, VoIP, etc.)

**Problème :** Certains protocoles (IPsec, SIP) ne fonctionnent pas bien avec NAT.

**Solutions :**
- **NAT-T (NAT Traversal)** : Encapsulation UDP pour IPsec
- **ALG (Application Layer Gateway)** : Aide pour FTP, SIP, H.323

**Cisco :**

```
Router(config)# ip nat service ftp tcp port 21
Router(config)# ip nat service sip udp port 5060
```

**Debian :**

```bash
# Modules pour ALG
modprobe nf_nat_ftp
modprobe nf_nat_sip
modprobe nf_conntrack_ftp
modprobe nf_conntrack_sip

# Les charger au boot
echo "nf_nat_ftp" >> /etc/modules
echo "nf_nat_sip" >> /etc/modules
```

### Double NAT

**Problème :** NAT en cascade (ex: Box FAI + routeur interne).

**Impact :**
- Problèmes avec VPN
- Gaming en ligne difficile
- VoIP instable

**Solutions :**
- Mettre la box FAI en mode bridge
- DMZ sur la box vers le routeur interne
- UPnP (Universal Plug and Play) - déconseillé en production

---

## Bonnes pratiques

### Sécurité

1. **Ne pas NATer les protocoles de gestion** (SSH vers routeur)
2. **Limiter le port forwarding au strict nécessaire**
3. **Utiliser des ports non-standards** pour l'exposition externe (SSH sur 2222 au lieu de 22)
4. **Combiner NAT avec firewall** (ACL Cisco, iptables filter Debian)
5. **Logger les translations sensibles** pour audit
6. **Éviter le NAT 1:1 si possible** (préférer port forwarding spécifique)
7. **Protéger les serveurs en DMZ** avec firewall strict

### Performance

1. **Préférer SNAT à MASQUERADE** si IP fixe (Debian)
2. **Augmenter la table de connexions** sur serveurs à fort trafic
3. **Utiliser nftables** au lieu d'iptables (meilleures performances)
4. **Surveiller la table NAT** (ne pas laisser trop de connexions obsolètes)
5. **Ajuster les timeouts** selon le type de trafic

**Timeouts Cisco :**

```
Router(config)# ip nat translation timeout 300
Router(config)# ip nat translation tcp-timeout 86400
Router(config)# ip nat translation udp-timeout 300
```

**Timeouts Debian :**

```bash
# Timeouts généraux
echo 300 > /proc/sys/net/netfilter/nf_conntrack_tcp_timeout_established
echo 120 > /proc/sys/net/netfilter/nf_conntrack_udp_timeout

# Permanent
echo "net.netfilter.nf_conntrack_tcp_timeout_established = 300" >> /etc/sysctl.conf
```

### Documentation

1. **Documenter chaque NAT statique** (quel serveur, quel service)
2. **Maintenir un tableau** des mappings IP publique ↔ IP privée
3. **Versionner la configuration** (git)
4. **Alertes de monitoring** sur table NAT pleine

### Dépannage méthodique

1. Vérifier l'IP forwarding (Linux)
2. Vérifier `ip nat inside/outside` (Cisco)
3. Afficher les translations actives
4. Vérifier les ACL associées
5. Tester avec `tcpdump` ou `debug ip nat`
6. Vérifier les règles de firewall (FORWARD)
7. Tester depuis l'extérieur (port forwarding)

---

## Cas d'usage spécifiques

### 1. Serveur de jeux (Port forwarding multiple)

**Cisco :**
```
Router(config)# ip nat inside source static tcp 192.168.1.100 25565 interface GigabitEthernet0/0 25565
Router(config)# ip nat inside source static udp 192.168.1.100 25565 interface GigabitEthernet0/0 25565
```

**Debian :**
```bash
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 25565 -j DNAT --to 192.168.1.100:25565
iptables -t nat -A PREROUTING -i eth0 -p udp --dport 25565 -j DNAT --to 192.168.1.100:25565
iptables -A FORWARD -i eth0 -o eth1 -p tcp -d 192.168.1.100 --dport 25565 -j ACCEPT
iptables -A FORWARD -i eth0 -o eth1 -p udp -d 192.168.1.100 --dport 25565 -j ACCEPT
```

### 2. VPN Site-to-Site avec NAT

**Cisco :**
```
Router(config)# ip access-list extended NO_NAT
Router(config-ext-nacl)# deny ip 192.168.1.0 0.0.0.255 10.0.0.0 0.0.0.255
Router(config-ext-nacl)# permit ip 192.168.1.0 0.0.0.255 any
Router(config-ext-nacl)# exit
Router(config)# ip nat inside source list NO_NAT interface GigabitEthernet0/0 overload
```

**Debian :**
```bash
# Ne pas NATer le trafic VPN
iptables -t nat -A POSTROUTING -s 192.168.1.0/24 -d 10.0.0.0/24 -j RETURN
iptables -t nat -A POSTROUTING -o eth0 -s 192.168.1.0/24 -j MASQUERADE
```

### 3. Multi-WAN avec Load Balancing

**Debian avec 2 connexions Internet :**

```bash
# eth0 : WAN1 (203.0.113.1)
# eth1 : WAN2 (198.51.100.1)
# eth2 : LAN (192.168.1.0/24)

# Répartition du trafic sortant (round-robin)
iptables -t nat -A POSTROUTING -o eth0 -s 192.168.1.0/24 -m statistic --mode nth --every 2 --packet 0 -j SNAT --to-source 203.0.113.1
iptables -t nat -A POSTROUTING -o eth1 -s 192.168.1.0/24 -j SNAT --to-source 198.51.100.1

# Routage avancé avec iproute2
ip route add default scope global nexthop via 203.0.113.254 dev eth0 weight 1 nexthop via 198.51.100.254 dev eth1 weight 1
```

### 4. Carrier-Grade NAT (CGN/NAT444)

Pour les FAI : NAT en cascade avec pool d'IP partagées.

```bash
# Premier niveau : IP privées → IP partagées (100.64.0.0/10)
iptables -t nat -A POSTROUTING -s 10.0.0.0/8 -j SNAT --to-source 100.64.0.1-100.64.0.255

# Second niveau : IP partagées → IP publiques
iptables -t nat -A POSTROUTING -s 100.64.0.0/10 -j SNAT --to-source 203.0.113.1
```

>[!NOTE]
>**CGN** est utilisé par certains FAI pour économiser les adresses IPv4. Cela peut causer des problèmes avec certaines applications (gaming, VPN).
