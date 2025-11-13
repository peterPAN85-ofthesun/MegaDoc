---
date: 2025/11/07
tags:
  - Réseau
  - Firewall
  - Sécurité
  - Cisco
  - Debian
  - ACL
---


Les firewalls permettent de contrôler et sécuriser le trafic réseau en autorisant ou bloquant les communications selon des règles définies. Cette fiche présente les solutions de filtrage au niveau 2 (couche liaison - MAC) et niveau 3 (couche réseau - IP) pour les équipements Cisco et les systèmes Debian/Linux.

---

## Filtrage sur Cisco

### ACL - Access Control Lists (Niveau 3)

Les ACL Cisco permettent de filtrer le trafic IP en fonction de critères comme les adresses source/destination, les protocoles et les ports.

#### Types d'ACL

| Type | Numéro | Filtrage | Usage |
|------|--------|----------|-------|
| **Standard** | 1-99, 1300-1999 | Adresse IP source uniquement | Filtrage simple, NAT |
| **Étendue** | 100-199, 2000-2699 | IP source/dest, protocole, port | Filtrage avancé |
| **Nommée** | Nom personnalisé | Standard ou étendue | Meilleure lisibilité |

#### ACL Standard

Syntaxe :
```
Router(config)# access-list [numéro] [permit|deny] [adresse] [wildcard-mask]
```

**Exemple 1 : Bloquer un réseau spécifique**

```
Router> enable
Router# configure terminal

Router(config)# access-list 10 deny 192.168.10.0 0.0.0.255
Router(config)# access-list 10 permit any

Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip access-group 10 in
Router(config-if)# exit
```

>[!NOTE]
>**Wildcard Mask** : Inverse du masque de sous-réseau
>- Masque réseau `255.255.255.0` → Wildcard `0.0.0.255`
>- `0` = doit correspondre exactement
>- `255` = n'importe quelle valeur acceptée
>- `any` = `0.0.0.0 255.255.255.255`
>- `host 192.168.1.1` = `192.168.1.1 0.0.0.0`

**Exemple 2 : Autoriser uniquement certaines adresses**

```
Router(config)# access-list 20 permit host 192.168.1.10
Router(config)# access-list 20 permit host 192.168.1.20
Router(config)# access-list 20 deny any
```

#### ACL Étendue

Syntaxe :
```
Router(config)# access-list [numéro] [permit|deny] [protocole] [source] [wildcard] [dest] [wildcard] [opérateurs]
```

**Exemple 1 : Bloquer le trafic HTTP d'un réseau**

```
Router(config)# access-list 100 deny tcp 192.168.10.0 0.0.0.255 any eq 80
Router(config)# access-list 100 deny tcp 192.168.10.0 0.0.0.255 any eq 443
Router(config)# access-list 100 permit ip any any

Router(config)# interface GigabitEthernet0/1
Router(config-if)# ip access-group 100 out
Router(config-if)# exit
```

**Exemple 2 : Autoriser SSH uniquement depuis l'administration**

```
Router(config)# access-list 110 permit tcp 192.168.1.0 0.0.0.255 host 10.0.0.1 eq 22
Router(config)# access-list 110 deny tcp any host 10.0.0.1 eq 22
Router(config)# access-list 110 permit ip any any
```

**Exemple 3 : Bloquer ICMP (ping) vers un serveur**

```
Router(config)# access-list 120 deny icmp any host 10.0.0.50 echo
Router(config)# access-list 120 permit ip any any
```

#### ACL Nommée (Recommandé)

**ACL Standard nommée :**

```
Router(config)# ip access-list standard BLOC_VLAN10
Router(config-std-nacl)# deny 192.168.10.0 0.0.0.255
Router(config-std-nacl)# permit any
Router(config-std-nacl)# exit

Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip access-group BLOC_VLAN10 in
```

**ACL Étendue nommée :**

```
Router(config)# ip access-list extended SECURITE_DMZ
Router(config-ext-nacl)# permit tcp 192.168.1.0 0.0.0.255 10.0.0.0 0.0.0.255 eq 80
Router(config-ext-nacl)# permit tcp 192.168.1.0 0.0.0.255 10.0.0.0 0.0.0.255 eq 443
Router(config-ext-nacl)# permit tcp 192.168.1.0 0.0.0.255 10.0.0.0 0.0.0.255 eq 22
Router(config-ext-nacl)# deny ip any any log
Router(config-ext-nacl)# exit

Router(config)# interface GigabitEthernet0/1
Router(config-if)# ip access-group SECURITE_DMZ in
```

>[!NOTE]
>**Direction d'application** :
>- `in` : Trafic entrant sur l'interface (arrivant)
>- `out` : Trafic sortant de l'interface (partant)
>
>**Règle implicite** : Toute ACL se termine par un `deny any` implicite. Il faut donc toujours terminer par `permit any` si on veut autoriser le reste du trafic.

#### Opérateurs de port

| Opérateur | Signification | Exemple |
|-----------|---------------|---------|
| `eq` | Égal à (equal) | `eq 80` (port 80) |
| `neq` | Différent de (not equal) | `neq 23` (sauf Telnet) |
| `lt` | Inférieur à (less than) | `lt 1024` (ports privilégiés) |
| `gt` | Supérieur à (greater than) | `gt 1023` (ports utilisateurs) |
| `range` | Plage de ports | `range 20 21` (FTP) |

#### Ports courants

```
Router(config-ext-nacl)# permit tcp any any eq 80     # HTTP
Router(config-ext-nacl)# permit tcp any any eq 443    # HTTPS
Router(config-ext-nacl)# permit tcp any any eq 22     # SSH
Router(config-ext-nacl)# permit tcp any any eq 23     # Telnet
Router(config-ext-nacl)# permit tcp any any eq 21     # FTP
Router(config-ext-nacl)# permit tcp any any eq 25     # SMTP
Router(config-ext-nacl)# permit tcp any any eq 53     # DNS (TCP)
Router(config-ext-nacl)# permit udp any any eq 53     # DNS (UDP)
Router(config-ext-nacl)# permit udp any any eq 67     # DHCP (serveur)
Router(config-ext-nacl)# permit udp any any eq 68     # DHCP (client)
Router(config-ext-nacl)# permit tcp any any eq 3389   # RDP
```

#### Modifier une ACL

**Afficher les ACL :**

```
Router# show access-lists
Router# show access-lists 100
Router# show ip access-lists SECURITE_DMZ
Router# show running-config | include access-list
```

**Supprimer une ACL :**

```
Router(config)# no access-list 100
Router(config)# no ip access-list extended SECURITE_DMZ
```

**Modifier une ligne spécifique (ACL nommée) :**

```
Router# show ip access-lists SECURITE_DMZ
Extended IP access list SECURITE_DMZ
    10 permit tcp 192.168.1.0 0.0.0.255 10.0.0.0 0.0.0.255 eq 80
    20 deny ip any any log

Router# configure terminal
Router(config)# ip access-list extended SECURITE_DMZ
Router(config-ext-nacl)# no 20
Router(config-ext-nacl)# 15 permit tcp 192.168.1.0 0.0.0.255 10.0.0.0 0.0.0.255 eq 443
Router(config-ext-nacl)# 30 deny ip any any log
```

#### Exemple complet : Sécurisation d'un réseau d'entreprise

**Topologie :**
```
Internet ── [R1] ── DMZ (10.0.0.0/24)
              │
              └──── LAN Interne (192.168.1.0/24)
```

**Objectifs :**
- Autoriser le LAN interne à accéder au Web (HTTP/HTTPS)
- Autoriser uniquement HTTP/HTTPS vers la DMZ depuis Internet
- Bloquer tout accès direct Internet → LAN interne
- Autoriser les administrateurs (192.168.1.0/24) à accéder en SSH à la DMZ

**Configuration :**

```
Router(config)# ip access-list extended INTERNET_TO_DMZ
Router(config-ext-nacl)# remark Autoriser HTTP et HTTPS vers DMZ
Router(config-ext-nacl)# permit tcp any 10.0.0.0 0.0.0.255 eq 80
Router(config-ext-nacl)# permit tcp any 10.0.0.0 0.0.0.255 eq 443
Router(config-ext-nacl)# deny ip any any log
Router(config-ext-nacl)# exit

Router(config)# ip access-list extended LAN_TO_INTERNET
Router(config-ext-nacl)# remark Autoriser le Web depuis le LAN
Router(config-ext-nacl)# permit tcp 192.168.1.0 0.0.0.255 any eq 80
Router(config-ext-nacl)# permit tcp 192.168.1.0 0.0.0.255 any eq 443
Router(config-ext-nacl)# permit udp 192.168.1.0 0.0.0.255 any eq 53
Router(config-ext-nacl)# deny ip any any log
Router(config-ext-nacl)# exit

Router(config)# ip access-list extended LAN_TO_DMZ
Router(config-ext-nacl)# remark Autoriser SSH admin vers DMZ
Router(config-ext-nacl)# permit tcp 192.168.1.0 0.0.0.255 10.0.0.0 0.0.0.255 eq 22
Router(config-ext-nacl)# permit icmp 192.168.1.0 0.0.0.255 10.0.0.0 0.0.0.255
Router(config-ext-nacl)# deny ip any any
Router(config-ext-nacl)# exit

# Application sur les interfaces
Router(config)# interface GigabitEthernet0/0
Router(config-if)# description Interface vers Internet
Router(config-if)# ip access-group INTERNET_TO_DMZ in
Router(config-if)# exit

Router(config)# interface GigabitEthernet0/1
Router(config-if)# description Interface vers LAN
Router(config-if)# ip access-group LAN_TO_INTERNET in
Router(config-if)# exit

Router(config)# interface GigabitEthernet0/2
Router(config-if)# description Interface vers DMZ
Router(config-if)# ip access-group LAN_TO_DMZ in
Router(config-if)# exit

Router(config)# end
Router# write memory
```

### Port Security (Niveau 2 - Switch)

La sécurité de port permet de contrôler les adresses MAC autorisées sur un port de switch.

**Configuration basique :**

```
Switch> enable
Switch# configure terminal

Switch(config)# interface FastEthernet0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport port-security
Switch(config-if)# switchport port-security maximum 1
Switch(config-if)# switchport port-security mac-address 0011.2233.4455
Switch(config-if)# switchport port-security violation shutdown
Switch(config-if)# exit
```

**Modes de violation :**

| Mode | Description |
|------|-------------|
| `shutdown` | Désactive le port (défaut) - err-disabled |
| `restrict` | Bloque les trames non autorisées, incrémente compteur |
| `protect` | Bloque silencieusement les trames non autorisées |

**Apprentissage automatique des MAC :**

```
Switch(config-if)# switchport port-security mac-address sticky
```

**Vérification :**

```
Switch# show port-security
Switch# show port-security interface FastEthernet0/1
Switch# show port-security address
```

**Réactiver un port désactivé :**

```
Switch(config)# interface FastEthernet0/1
Switch(config-if)# shutdown
Switch(config-if)# no shutdown
Switch(config-if)# exit
```

### VLAN ACL - VACL (Niveau 2/3)

Les VACL permettent de filtrer le trafic au sein d'un même VLAN.

```
Switch(config)# ip access-list extended FILTRE_VLAN10
Switch(config-ext-nacl)# deny tcp any host 192.168.10.50 eq 23
Switch(config-ext-nacl)# permit ip any any
Switch(config-ext-nacl)# exit

Switch(config)# vlan access-map SECURITE_VLAN10 10
Switch(config-access-map)# match ip address FILTRE_VLAN10
Switch(config-access-map)# action forward
Switch(config-access-map)# exit

Switch(config)# vlan filter SECURITE_VLAN10 vlan-list 10
```

### Vérification et dépannage

```
Router# show access-lists                    # Afficher toutes les ACL
Router# show ip access-lists                 # Afficher les ACL IP uniquement
Router# show ip interface GigabitEthernet0/0 # Vérifier les ACL appliquées
Router# show running-config | include access # Rechercher les ACL dans la config

Switch# show port-security                   # État de la port security
Switch# show vlan access-map                 # Afficher les VACL
```

---

## Filtrage sur Debian/Linux

### iptables (Niveau 3 - Firewall classique)

iptables est l'outil de filtrage IP traditionnel sous Linux. Il fonctionne avec des tables, des chaînes et des règles.

#### Tables et chaînes principales

| Table | Chaîne | Usage |
|-------|--------|-------|
| **filter** | INPUT | Paquets destinés au système |
| **filter** | OUTPUT | Paquets émis par le système |
| **filter** | FORWARD | Paquets traversant le système (routage) |
| **nat** | PREROUTING | Modification avant routage (DNAT) |
| **nat** | POSTROUTING | Modification après routage (SNAT/Masquerade) |
| **mangle** | - | Modification avancée des paquets |

#### Syntaxe de base

```bash
iptables -A [CHAINE] -p [protocole] -s [source] -d [dest] --dport [port] -j [ACTION]
```

**Actions principales :**
- `ACCEPT` : Autoriser le paquet
- `DROP` : Rejeter silencieusement
- `REJECT` : Rejeter avec message d'erreur
- `LOG` : Enregistrer dans les logs
- `RETURN` : Retour à la chaîne appelante

#### Règles de base

**Afficher les règles :**

```bash
# Afficher toutes les règles
iptables -L -v -n

# Afficher avec numéros de ligne
iptables -L --line-numbers

# Afficher la table NAT
iptables -t nat -L -v -n
```

**Politique par défaut :**

```bash
# Bloquer tout par défaut (sécurité maximale)
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT
```

>[!NOTE]
>**Attention** : Définir la politique INPUT à DROP sans règles d'autorisation peut vous couper l'accès SSH. Toujours garder une session ouverte lors de tests.

**Réinitialiser les règles :**

```bash
# Supprimer toutes les règles
iptables -F

# Remettre les politiques à ACCEPT
iptables -P INPUT ACCEPT
iptables -P FORWARD ACCEPT
iptables -P OUTPUT ACCEPT

# Supprimer les chaînes personnalisées
iptables -X
```

#### Règles courantes INPUT (trafic entrant)

**Autoriser le loopback (obligatoire) :**

```bash
iptables -A INPUT -i lo -j ACCEPT
```

**Autoriser les connexions établies :**

```bash
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
```

**Autoriser SSH (port 22) :**

```bash
# Depuis n'importe où
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Depuis un réseau spécifique
iptables -A INPUT -p tcp -s 192.168.1.0/24 --dport 22 -j ACCEPT

# Depuis une IP spécifique
iptables -A INPUT -p tcp -s 192.168.1.10 --dport 22 -j ACCEPT
```

**Autoriser HTTP et HTTPS :**

```bash
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

**Autoriser DNS :**

```bash
iptables -A INPUT -p udp --dport 53 -j ACCEPT
iptables -A INPUT -p tcp --dport 53 -j ACCEPT
```

**Autoriser ping (ICMP) :**

```bash
iptables -A INPUT -p icmp --icmp-type echo-request -j ACCEPT
```

**Bloquer une IP spécifique :**

```bash
iptables -A INPUT -s 192.168.10.50 -j DROP
```

**Bloquer un réseau :**

```bash
iptables -A INPUT -s 10.0.0.0/8 -j DROP
```

#### Règles FORWARD (routage/firewall)

**Autoriser le forwarding entre deux réseaux :**

```bash
iptables -A FORWARD -i eth0 -o eth1 -j ACCEPT
iptables -A FORWARD -i eth1 -o eth0 -j ACCEPT
```

**Autoriser uniquement HTTP/HTTPS vers DMZ :**

```bash
iptables -A FORWARD -i eth0 -o eth1 -d 10.0.0.0/24 -p tcp --dport 80 -j ACCEPT
iptables -A FORWARD -i eth0 -o eth1 -d 10.0.0.0/24 -p tcp --dport 443 -j ACCEPT
iptables -A FORWARD -j DROP
```

#### Règles OUTPUT (trafic sortant)

Généralement on laisse OUTPUT en ACCEPT, mais pour une sécurité maximale :

```bash
iptables -P OUTPUT DROP
iptables -A OUTPUT -o lo -j ACCEPT
iptables -A OUTPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A OUTPUT -p tcp --dport 80 -j ACCEPT
iptables -A OUTPUT -p tcp --dport 443 -j ACCEPT
iptables -A OUTPUT -p udp --dport 53 -j ACCEPT
```

#### Limitation de débit (protection anti-DoS)

**Limiter les connexions SSH :**

```bash
iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --set
iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --update --seconds 60 --hitcount 4 -j DROP
```

**Limiter les pings :**

```bash
iptables -A INPUT -p icmp --icmp-type echo-request -m limit --limit 1/s -j ACCEPT
iptables -A INPUT -p icmp --icmp-type echo-request -j DROP
```

#### Logging

**Logger les paquets rejetés :**

```bash
iptables -A INPUT -j LOG --log-prefix "IPTABLES-DROP: " --log-level 4
iptables -A INPUT -j DROP
```

Visualiser les logs :

```bash
tail -f /var/log/syslog | grep IPTABLES
# ou
journalctl -f | grep IPTABLES
```

#### Exemple complet : Serveur Web sécurisé

```bash
#!/bin/bash
# Script de configuration firewall pour serveur web

# Réinitialisation
iptables -F
iptables -X

# Politique par défaut : tout bloquer
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Autoriser loopback
iptables -A INPUT -i lo -j ACCEPT

# Autoriser connexions établies
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Autoriser SSH (limité)
iptables -A INPUT -p tcp -s 192.168.1.0/24 --dport 22 -j ACCEPT

# Autoriser HTTP/HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Autoriser ping (limité)
iptables -A INPUT -p icmp --icmp-type echo-request -m limit --limit 1/s -j ACCEPT

# Logger et bloquer le reste
iptables -A INPUT -j LOG --log-prefix "FIREWALL-BLOCK: "
iptables -A INPUT -j DROP

echo "Firewall configuré"
iptables -L -v -n
```

#### Sauvegarder les règles

**Debian/Ubuntu :**

```bash
# Installer le paquet de persistance
apt install iptables-persistent

# Sauvegarder manuellement
iptables-save > /etc/iptables/rules.v4

# Restaurer
iptables-restore < /etc/iptables/rules.v4

# Avec le service
netfilter-persistent save
netfilter-persistent reload
```

**Méthode alternative (script au démarrage) :**

Créer `/etc/network/if-pre-up.d/iptables` :

```bash
#!/bin/bash
iptables-restore < /etc/iptables/rules.v4
```

Rendre exécutable :

```bash
chmod +x /etc/network/if-pre-up.d/iptables
```

### nftables (Niveau 3 - Firewall moderne)

nftables est le successeur d'iptables, plus performant et avec une syntaxe simplifiée.

**Installation :**

```bash
apt install nftables
systemctl enable nftables
systemctl start nftables
```

**Configuration basique :**

```bash
# Créer une table
nft add table inet filter

# Créer les chaînes
nft add chain inet filter input { type filter hook input priority 0 \; policy drop \; }
nft add chain inet filter forward { type filter hook forward priority 0 \; policy drop \; }
nft add chain inet filter output { type filter hook output priority 0 \; policy accept \; }

# Ajouter des règles
nft add rule inet filter input iif lo accept
nft add rule inet filter input ct state established,related accept
nft add rule inet filter input tcp dport 22 accept
nft add rule inet filter input tcp dport { 80, 443 } accept
nft add rule inet filter input icmp type echo-request limit rate 1/second accept
```

**Afficher la configuration :**

```bash
nft list ruleset
```

**Fichier de configuration :** `/etc/nftables.conf`

```bash
#!/usr/sbin/nft -f

flush ruleset

table inet filter {
    chain input {
        type filter hook input priority 0; policy drop;

        iif lo accept
        ct state established,related accept

        tcp dport 22 ip saddr 192.168.1.0/24 accept
        tcp dport { 80, 443 } accept
        icmp type echo-request limit rate 1/second accept
    }

    chain forward {
        type filter hook forward priority 0; policy drop;
    }

    chain output {
        type filter hook output priority 0; policy accept;
    }
}
```

Appliquer :

```bash
nft -f /etc/nftables.conf
```

### ebtables (Niveau 2 - Ethernet Bridge)

ebtables filtre au niveau Ethernet (adresses MAC, VLAN tags).

**Installation :**

```bash
apt install ebtables
```

**Bloquer une adresse MAC :**

```bash
ebtables -A FORWARD -s 00:11:22:33:44:55 -j DROP
```

**Filtrer par VLAN :**

```bash
ebtables -A FORWARD -p 802_1Q --vlan-id 10 -j DROP
```

**Bloquer ARP spoofing :**

```bash
ebtables -A FORWARD -p ARP --arp-ip-src 192.168.1.1 -j DROP
```

### UFW (Uncomplicated Firewall - Frontend simplifié)

UFW est une interface simplifiée pour iptables, idéale pour les débutants.

**Installation :**

```bash
apt install ufw
```

**Utilisation basique :**

```bash
# Activer le firewall
ufw enable

# Politique par défaut
ufw default deny incoming
ufw default allow outgoing

# Autoriser SSH
ufw allow 22/tcp
ufw allow ssh

# Autoriser HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Autoriser depuis un réseau spécifique
ufw allow from 192.168.1.0/24 to any port 22

# Bloquer une IP
ufw deny from 192.168.10.50

# Supprimer une règle
ufw delete allow 80/tcp

# Afficher l'état
ufw status verbose
ufw status numbered

# Désactiver
ufw disable
```

**Configuration avancée :**

```bash
# Limiter les connexions SSH (anti brute-force)
ufw limit ssh

# Autoriser un port pour une IP spécifique
ufw allow from 192.168.1.10 to any port 3306

# Autoriser une plage de ports
ufw allow 6000:6007/tcp
```

### Exemple complet : Routeur/Firewall Debian

**Scénario :** Serveur Debian avec 2 interfaces (eth0 = WAN, eth1 = LAN)

```bash
#!/bin/bash
# Configuration firewall complet pour routeur Debian

# Variables
WAN=eth0
LAN=eth1
LAN_NET=192.168.1.0/24

# Réinitialisation
iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X

# Politique par défaut
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# ========== INPUT ==========
# Loopback
iptables -A INPUT -i lo -j ACCEPT

# Connexions établies
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# SSH depuis LAN uniquement
iptables -A INPUT -i $LAN -p tcp --dport 22 -j ACCEPT

# Ping depuis LAN
iptables -A INPUT -i $LAN -p icmp -j ACCEPT

# DNS depuis LAN (si serveur DNS local)
iptables -A INPUT -i $LAN -p udp --dport 53 -j ACCEPT
iptables -A INPUT -i $LAN -p tcp --dport 53 -j ACCEPT

# ========== FORWARD ==========
# LAN vers Internet
iptables -A FORWARD -i $LAN -o $WAN -s $LAN_NET -j ACCEPT
iptables -A FORWARD -i $WAN -o $LAN -d $LAN_NET -m state --state ESTABLISHED,RELATED -j ACCEPT

# Bloquer le reste
iptables -A FORWARD -j LOG --log-prefix "FW-FORWARD-DROP: "
iptables -A FORWARD -j DROP

# ========== NAT ==========
# Masquerade (SNAT) pour partager la connexion Internet
iptables -t nat -A POSTROUTING -o $WAN -j MASQUERADE

# Port forwarding : HTTP externe vers serveur web interne (192.168.1.100)
iptables -t nat -A PREROUTING -i $WAN -p tcp --dport 80 -j DNAT --to-destination 192.168.1.100:80
iptables -A FORWARD -i $WAN -o $LAN -p tcp -d 192.168.1.100 --dport 80 -j ACCEPT

# ========== Protection ==========
# Anti-scan de ports
iptables -A INPUT -p tcp --tcp-flags ALL NONE -j DROP
iptables -A INPUT -p tcp --tcp-flags ALL ALL -j DROP

# Anti-flood SYN
iptables -A INPUT -p tcp --syn -m limit --limit 1/s -j ACCEPT
iptables -A INPUT -p tcp --syn -j DROP

# Activer IP forwarding
echo 1 > /proc/sys/net/ipv4/ip_forward

# Sauvegarder
iptables-save > /etc/iptables/rules.v4

echo "Firewall configuré avec succès"
iptables -L -v -n
```

### Vérification et dépannage

```bash
# Afficher les règles
iptables -L -v -n
iptables -t nat -L -v -n

# Compter les paquets
iptables -L -v

# Tester une règle
iptables -I INPUT -s 192.168.1.10 -j LOG --log-prefix "TEST: "
# Générer du trafic puis :
tail -f /var/log/syslog | grep TEST

# Supprimer une règle spécifique
iptables -D INPUT 5  # Supprimer la règle numéro 5

# Vérifier IP forwarding
cat /proc/sys/net/ipv4/ip_forward
sysctl net.ipv4.ip_forward

# Tracer les paquets
iptables -t raw -A PREROUTING -p icmp -j TRACE
iptables -t raw -A OUTPUT -p icmp -j TRACE
# Puis :
modprobe nf_log_ipv4
sysctl net.netfilter.nf_log.2=nf_log_ipv4
tail -f /var/log/syslog
```

---

## Comparaison Cisco vs Debian

| Aspect | Cisco | Debian |
|--------|-------|--------|
| **Niveau 3** | ACL (Standard/Étendue) | iptables / nftables |
| **Niveau 2** | Port Security, VACL | ebtables |
| **Syntaxe** | Wildcard mask | CIDR / netmask |
| **Politique par défaut** | Implicit deny (fin ACL) | Configurable (-P) |
| **Application** | Par interface (in/out) | Par chaîne (INPUT/OUTPUT/FORWARD) |
| **Persistance** | `write memory` | iptables-persistent / scripts |
| **NAT** | ACL + commande NAT séparée | Table nat intégrée |
| **Logging** | Mot-clé `log` | Target `-j LOG` |
| **Frontend simple** | - | UFW |
| **Ordre des règles** | Top-down, première correspondance | Top-down, première correspondance |
| **Modification** | Édition numéro ligne (ACL nommée) | Insertion/suppression par numéro |

---

## Bonnes pratiques

### Sécurité

1. **Principe du moindre privilège** : Bloquer par défaut, autoriser uniquement le nécessaire
2. **Toujours autoriser le loopback** (lo) sur Linux
3. **Autoriser les connexions établies** pour éviter de bloquer les réponses
4. **Documenter chaque règle** avec des commentaires ou remarques
5. **Tester en mode non-persistant** avant de sauvegarder
6. **Garder une session de secours** (console, KVM) avant de modifier SSH
7. **Utiliser des ACL nommées** sur Cisco pour meilleure lisibilité
8. **Logger les tentatives suspectes** mais pas tout (volume)

### Performance

1. **Placer les règles fréquentes en premier** (optimisation)
2. **Utiliser le state tracking** (`ESTABLISHED,RELATED`) pour réduire le nombre de règles
3. **Éviter trop de logging** (impact performance)
4. **Utiliser nftables** plutôt qu'iptables pour meilleur performance (Debian)

### Maintenance

1. **Sauvegarder régulièrement** la configuration
2. **Versionner les configurations** (git)
3. **Tester après chaque modification**
4. **Utiliser des scripts** pour configurations complexes
5. **Monitorer les logs** régulièrement
6. **Auditer périodiquement** les règles (supprimer obsolètes)

### Dépannage méthodique

1. Vérifier la politique par défaut
2. Lire les règles dans l'ordre
3. Vérifier la direction (in/out, INPUT/OUTPUT)
4. Tester avec logging temporaire
5. Utiliser tcpdump pour voir les paquets
6. Vérifier IP forwarding (Linux router)
7. Contrôler les compteurs de paquets

---

## Cas d'usage courants

### 1. Bloquer le trafic peer-to-peer

**Cisco :**
```
Router(config)# ip access-list extended BLOCK_P2P
Router(config-ext-nacl)# deny tcp any any range 6881 6889
Router(config-ext-nacl)# deny udp any any range 6881 6889
Router(config-ext-nacl)# permit ip any any
```

**Debian :**
```bash
iptables -A FORWARD -p tcp --dport 6881:6889 -j DROP
iptables -A FORWARD -p udp --dport 6881:6889 -j DROP
```

### 2. Protection contre le SYN flood

**Cisco :**
```
Router(config)# ip tcp intercept list PROTECT_SERVER
Router(config)# ip access-list extended PROTECT_SERVER
Router(config-ext-nacl)# permit tcp any host 10.0.0.50
```

**Debian :**
```bash
iptables -A INPUT -p tcp --syn -m limit --limit 1/s --limit-burst 3 -j ACCEPT
iptables -A INPUT -p tcp --syn -j DROP
```

### 3. Autoriser VPN (IPsec)

**Cisco :**
```
Router(config-ext-nacl)# permit udp any any eq 500
Router(config-ext-nacl)# permit udp any any eq 4500
Router(config-ext-nacl)# permit esp any any
```

**Debian :**
```bash
iptables -A INPUT -p udp --dport 500 -j ACCEPT   # IKE
iptables -A INPUT -p udp --dport 4500 -j ACCEPT  # NAT-T
iptables -A INPUT -p esp -j ACCEPT                # ESP
```

### 4. Filtrage géographique (Debian uniquement)

```bash
# Installer ipset et listes GeoIP
apt install ipset

# Créer un set pour un pays (exemple : CN = Chine)
ipset create china hash:net
ipset add china 1.0.1.0/24
# ... (ajouter toutes les plages IP chinoises)

# Bloquer le trafic
iptables -A INPUT -m set --match-set china src -j DROP
```
