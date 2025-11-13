---
date: 2025/11/07
tags:
  - Réseau
  - DHCP
  - Cisco
  - Debian
---

# DHCP - Dynamic Host Configuration Protocol

Le DHCP (Dynamic Host Configuration Protocol) permet d'attribuer automatiquement des configurations réseau (adresse IP, masque, passerelle, DNS) aux clients du réseau. Cette fiche présente la configuration d'un serveur DHCP sur Cisco et Debian, ainsi que la configuration client sur Debian.

---

## Concepts de base

### Fonctionnement du DHCP (processus DORA)

| Étape | Nom | Description | Type |
|-------|-----|-------------|------|
| 1 | **D**iscover | Client cherche un serveur DHCP | Broadcast (255.255.255.255) |
| 2 | **O**ffer | Serveur propose une configuration | Unicast ou Broadcast |
| 3 | **R**equest | Client accepte l'offre | Broadcast |
| 4 | **A**ck | Serveur confirme l'attribution | Unicast ou Broadcast |

>[!NOTE]
>**Ports utilisés :**
>- **UDP 67** : Port serveur DHCP
>- **UDP 68** : Port client DHCP
>
>**Durée de bail (lease time)** : Temps pendant lequel l'IP est attribuée au client. À mi-parcours, le client tente de renouveler son bail.

### Informations distribuées par DHCP

| Option | Description | Exemple |
|--------|-------------|---------|
| Adresse IP | IP attribuée au client | 192.168.1.100 |
| Masque de sous-réseau | Netmask | 255.255.255.0 |
| Passerelle par défaut | Default gateway | 192.168.1.254 |
| Serveurs DNS | DNS primaire et secondaire | 8.8.8.8, 1.1.1.1 |
| Nom de domaine | Domain name | exemple.local |
| Serveur NTP | Time server | 192.168.1.1 |
| Serveur TFTP | Boot server (PXE) | 192.168.1.10 |

### Types de configuration

| Type | Description |
|------|-------------|
| **Attribution dynamique** | IP attribuée temporairement depuis un pool |
| **Attribution automatique** | IP attribuée de façon permanente depuis un pool |
| **Réservation (statique)** | IP fixe basée sur l'adresse MAC |
| **Exclusion** | Plage d'IP non distribuées par DHCP |

---

## Serveur DHCP sur Cisco

### Configuration de base

**Étapes :**
1. Créer un pool DHCP
2. Définir le réseau et le masque
3. Configurer passerelle, DNS et autres options
4. Exclure les adresses réservées (serveurs, imprimantes)

**Configuration minimale :**

```
Router> enable
Router# configure terminal

# Exclure les IP réservées (de .1 à .50)
Router(config)# ip dhcp excluded-address 192.168.1.1 192.168.1.50

# Créer un pool DHCP
Router(config)# ip dhcp pool LAN_POOL
Router(dhcp-config)# network 192.168.1.0 255.255.255.0
Router(dhcp-config)# default-router 192.168.1.254
Router(dhcp-config)# dns-server 8.8.8.8 8.8.4.4
Router(dhcp-config)# domain-name exemple.local
Router(dhcp-config)# lease 7
Router(dhcp-config)# exit

Router(config)# end
Router# write memory
```

>[!NOTE]
>**Lease time** : Durée en jours
>- `lease 7` : 7 jours
>- `lease 0 12` : 12 heures
>- `lease 0 0 30` : 30 minutes
>- `lease infinite` : Permanent (déconseillé)

### Configuration complète avec options avancées

```
Router(config)# ip dhcp excluded-address 192.168.1.1 192.168.1.50
Router(config)# ip dhcp excluded-address 192.168.1.200 192.168.1.254

Router(config)# ip dhcp pool VLAN10_POOL
Router(dhcp-config)# network 192.168.1.0 255.255.255.0
Router(dhcp-config)# default-router 192.168.1.254
Router(dhcp-config)# dns-server 8.8.8.8 1.1.1.1
Router(dhcp-config)# domain-name entreprise.local
Router(dhcp-config)# lease 7
Router(dhcp-config)# netbios-name-server 192.168.1.10
Router(dhcp-config)# option 150 ip 192.168.1.1
Router(dhcp-config)# exit
```

**Options courantes :**

| Option | Commande | Description |
|--------|----------|-------------|
| 3 | `default-router` | Passerelle par défaut |
| 6 | `dns-server` | Serveurs DNS |
| 15 | `domain-name` | Nom de domaine |
| 42 | `ntp-server` | Serveur NTP |
| 44 | `netbios-name-server` | Serveur WINS |
| 66 | `option 66 ascii` | Serveur TFTP (nom) |
| 150 | `option 150 ip` | Serveur TFTP (IP) - Cisco |

### Réservation d'adresse (basée sur MAC)

```
Router(config)# ip dhcp pool SERVEUR_WEB
Router(dhcp-config)# host 192.168.1.10 255.255.255.0
Router(dhcp-config)# client-identifier 01aa.bbcc.ddee.ff
Router(dhcp-config)# default-router 192.168.1.254
Router(dhcp-config)# dns-server 8.8.8.8
Router(dhcp-config)# exit
```

Ou avec l'adresse MAC directement :

```
Router(config)# ip dhcp pool IMPRIMANTE
Router(dhcp-config)# host 192.168.1.20 255.255.255.0
Router(dhcp-config)# hardware-address aabb.ccdd.eeff
Router(dhcp-config)# default-router 192.168.1.254
Router(dhcp-config)# exit
```

>[!NOTE]
>**Format MAC Cisco** : `aabb.ccdd.eeff` (notation par blocs de 4 hex)
>**Client-identifier** : Préfixe `01` suivi de l'adresse MAC

### Configuration multi-VLAN / multi-réseaux

```
# VLAN 10 - Administration
Router(config)# ip dhcp excluded-address 192.168.10.1 192.168.10.50
Router(config)# ip dhcp pool VLAN10
Router(dhcp-config)# network 192.168.10.0 255.255.255.0
Router(dhcp-config)# default-router 192.168.10.254
Router(dhcp-config)# dns-server 192.168.10.1 8.8.8.8
Router(dhcp-config)# lease 7
Router(dhcp-config)# exit

# VLAN 20 - Utilisateurs
Router(config)# ip dhcp excluded-address 192.168.20.1 192.168.20.50
Router(config)# ip dhcp pool VLAN20
Router(dhcp-config)# network 192.168.20.0 255.255.255.0
Router(dhcp-config)# default-router 192.168.20.254
Router(dhcp-config)# dns-server 192.168.10.1 8.8.8.8
Router(dhcp-config)# lease 1
Router(dhcp-config)# exit

# VLAN 30 - Invités (WiFi)
Router(config)# ip dhcp excluded-address 192.168.30.1 192.168.30.10
Router(config)# ip dhcp pool VLAN30
Router(dhcp-config)# network 192.168.30.0 255.255.255.0
Router(dhcp-config)# default-router 192.168.30.254
Router(dhcp-config)# dns-server 8.8.8.8 1.1.1.1
Router(dhcp-config)# lease 0 2
Router(dhcp-config)# exit
```

### DHCP Relay (Agent de relais)

Quand le serveur DHCP est sur un autre réseau :

**Topologie :**
```
[VLAN 10] ── [Switch] ── [Router] ── [Serveur DHCP 10.0.0.5]
```

**Configuration sur le routeur (interface VLAN) :**

```
Router(config)# interface vlan 10
Router(config-if)# ip address 192.168.10.254 255.255.255.0
Router(config-if)# ip helper-address 10.0.0.5
Router(config-if)# exit
```

Le routeur relaie les broadcasts DHCP vers le serveur `10.0.0.5`.

>[!NOTE]
>**ip helper-address** transmet aussi d'autres services :
>- DHCP (ports 67/68)
>- DNS (port 53)
>- TFTP (port 69)
>- NetBIOS (ports 137/138)
>- TACACS (port 49)

Pour relayer uniquement DHCP :

```
Router(config)# no ip forward-protocol udp tftp
Router(config)# no ip forward-protocol udp dns
Router(config)# no ip forward-protocol udp netbios-ns
Router(config)# no ip forward-protocol udp netbios-dgm
```

### Désactiver le serveur DHCP

```
Router(config)# no service dhcp
```

Réactiver :

```
Router(config)# service dhcp
```

### Vérification et dépannage

**Afficher les baux DHCP actifs :**

```
Router# show ip dhcp binding
Router# show ip dhcp binding 192.168.1.100
```

Exemple de sortie :
```
IP address       Client-ID/              Lease expiration        Type
                 Hardware address
192.168.1.100    0100.1122.3344.55       Mar 02 2025 10:30 AM    Automatic
192.168.1.101    0100.aabb.ccdd.eeff     Mar 03 2025 02:15 PM    Automatic
192.168.1.10     01aa.bbcc.ddee.ff       Infinite                Manual
```

**Afficher les pools DHCP :**

```
Router# show ip dhcp pool
Router# show ip dhcp pool VLAN10
```

**Afficher les statistiques :**

```
Router# show ip dhcp statistics
```

**Afficher les conflits d'adresses :**

```
Router# show ip dhcp conflict
```

**Supprimer un conflit :**

```
Router# clear ip dhcp conflict *
Router# clear ip dhcp conflict 192.168.1.100
```

**Libérer manuellement un bail :**

```
Router# clear ip dhcp binding *
Router# clear ip dhcp binding 192.168.1.100
```

**Déboguer le DHCP :**

```
Router# debug ip dhcp server events
Router# debug ip dhcp server packet
Router# undebug all
```

### Exemple complet : Routeur multi-VLAN avec DHCP

```
Router> enable
Router# configure terminal

# ========== Configuration des VLANs ==========
Router(config)# vlan 10
Router(config-vlan)# name ADMIN
Router(config-vlan)# exit

Router(config)# vlan 20
Router(config-vlan)# name USERS
Router(config-vlan)# exit

Router(config)# vlan 30
Router(config-vlan)# name GUESTS
Router(config-vlan)# exit

# ========== Interfaces VLAN ==========
Router(config)# interface vlan 10
Router(config-if)# ip address 192.168.10.254 255.255.255.0
Router(config-if)# no shutdown
Router(config-if)# exit

Router(config)# interface vlan 20
Router(config-if)# ip address 192.168.20.254 255.255.255.0
Router(config-if)# no shutdown
Router(config-if)# exit

Router(config)# interface vlan 30
Router(config-if)# ip address 192.168.30.254 255.255.255.0
Router(config-if)# no shutdown
Router(config-if)# exit

# ========== Configuration DHCP ==========

# VLAN 10 - Admin (7 jours, .1-.50 réservés)
Router(config)# ip dhcp excluded-address 192.168.10.1 192.168.10.50
Router(config)# ip dhcp pool ADMIN
Router(dhcp-config)# network 192.168.10.0 255.255.255.0
Router(dhcp-config)# default-router 192.168.10.254
Router(dhcp-config)# dns-server 192.168.10.1 8.8.8.8
Router(dhcp-config)# domain-name admin.entreprise.local
Router(dhcp-config)# lease 7
Router(dhcp-config)# exit

# VLAN 20 - Users (2 jours, .1-.20 réservés)
Router(config)# ip dhcp excluded-address 192.168.20.1 192.168.20.20
Router(config)# ip dhcp pool USERS
Router(dhcp-config)# network 192.168.20.0 255.255.255.0
Router(dhcp-config)# default-router 192.168.20.254
Router(dhcp-config)# dns-server 192.168.10.1 8.8.8.8
Router(dhcp-config)# domain-name entreprise.local
Router(dhcp-config)# lease 2
Router(dhcp-config)# exit

# VLAN 30 - Guests (4 heures, .1-.10 réservés)
Router(config)# ip dhcp excluded-address 192.168.30.1 192.168.30.10
Router(config)# ip dhcp pool GUESTS
Router(dhcp-config)# network 192.168.30.0 255.255.255.0
Router(dhcp-config)# default-router 192.168.30.254
Router(dhcp-config)# dns-server 8.8.8.8 1.1.1.1
Router(dhcp-config)# lease 0 4
Router(dhcp-config)# exit

# ========== Réservations ==========
# Serveur DNS/AD
Router(config)# ip dhcp pool DNS_SERVER
Router(dhcp-config)# host 192.168.10.1 255.255.255.0
Router(dhcp-config)# hardware-address 0011.2233.4455
Router(dhcp-config)# default-router 192.168.10.254
Router(dhcp-config)# exit

# Imprimante
Router(config)# ip dhcp pool PRINTER
Router(dhcp-config)# host 192.168.20.10 255.255.255.0
Router(dhcp-config)# hardware-address aabb.ccdd.eeff
Router(dhcp-config)# default-router 192.168.20.254
Router(dhcp-config)# exit

Router(config)# end
Router# write memory
```

---

## Serveur DHCP sur Debian/Linux

### Installation du serveur ISC DHCP

```bash
# Installer le paquet
apt update
apt install isc-dhcp-server

# Vérifier l'installation
dpkg -l | grep isc-dhcp-server
```

### Configuration de base

**1. Définir l'interface d'écoute**

Éditer `/etc/default/isc-dhcp-server` :

```bash
# Interface(s) où le serveur DHCP écoute
INTERFACESv4="eth0"
INTERFACESv6=""
```

**2. Configuration principale**

Éditer `/etc/dhcp/dhcpd.conf` :

```bash
# Configuration globale
default-lease-time 600;
max-lease-time 7200;
authoritative;

# Serveurs DNS globaux
option domain-name "exemple.local";
option domain-name-servers 8.8.8.8, 8.8.4.4;

# Pool DHCP pour le réseau 192.168.1.0/24
subnet 192.168.1.0 netmask 255.255.255.0 {
    range 192.168.1.100 192.168.1.200;
    option routers 192.168.1.254;
    option subnet-mask 255.255.255.0;
    option broadcast-address 192.168.1.255;
    option domain-name-servers 8.8.8.8, 8.8.4.4;
    default-lease-time 86400;      # 1 jour
    max-lease-time 604800;         # 7 jours
}
```

**3. Démarrer le service**

```bash
# Activer au démarrage
systemctl enable isc-dhcp-server

# Démarrer le service
systemctl start isc-dhcp-server

# Vérifier l'état
systemctl status isc-dhcp-server

# Voir les logs
journalctl -u isc-dhcp-server -f
tail -f /var/log/syslog | grep dhcp
```

>[!NOTE]
>**Fichiers importants :**
>- `/etc/dhcp/dhcpd.conf` : Configuration principale
>- `/etc/default/isc-dhcp-server` : Interface d'écoute
>- `/var/lib/dhcp/dhcpd.leases` : Base de données des baux actifs
>- `/var/log/syslog` : Logs du serveur DHCP

### Configuration complète avec options avancées

```bash
# ========== Configuration Globale ==========
default-lease-time 86400;           # 1 jour
max-lease-time 604800;              # 7 jours
authoritative;                      # Ce serveur est autoritaire
log-facility local7;                # Logs dans /var/log/dhcpd.log

# DNS dynamique (optionnel)
ddns-update-style none;

# ========== VLAN 10 - Administration ==========
subnet 192.168.10.0 netmask 255.255.255.0 {
    range 192.168.10.50 192.168.10.200;
    option routers 192.168.10.254;
    option subnet-mask 255.255.255.0;
    option broadcast-address 192.168.10.255;
    option domain-name "admin.entreprise.local";
    option domain-name-servers 192.168.10.1, 8.8.8.8;
    option ntp-servers 192.168.10.1;
    default-lease-time 604800;      # 7 jours
    max-lease-time 1209600;         # 14 jours
}

# ========== VLAN 20 - Utilisateurs ==========
subnet 192.168.20.0 netmask 255.255.255.0 {
    range 192.168.20.50 192.168.20.250;
    option routers 192.168.20.254;
    option subnet-mask 255.255.255.0;
    option broadcast-address 192.168.20.255;
    option domain-name "entreprise.local";
    option domain-name-servers 192.168.10.1, 8.8.8.8;
    default-lease-time 172800;      # 2 jours
    max-lease-time 604800;          # 7 jours
}

# ========== VLAN 30 - Invités (WiFi) ==========
subnet 192.168.30.0 netmask 255.255.255.0 {
    range 192.168.30.50 192.168.30.250;
    option routers 192.168.30.254;
    option subnet-mask 255.255.255.0;
    option broadcast-address 192.168.30.255;
    option domain-name "guest.entreprise.local";
    option domain-name-servers 8.8.8.8, 1.1.1.1;
    default-lease-time 14400;       # 4 heures
    max-lease-time 28800;           # 8 heures
}
```

### Réservations d'adresses (basées sur MAC)

```bash
# Serveur DNS/AD
host dns-server {
    hardware ethernet 00:11:22:33:44:55;
    fixed-address 192.168.10.1;
    option routers 192.168.10.254;
    option domain-name-servers 127.0.0.1, 8.8.8.8;
}

# Serveur Web
host web-server {
    hardware ethernet aa:bb:cc:dd:ee:ff;
    fixed-address 192.168.10.10;
    option routers 192.168.10.254;
}

# Imprimante réseau
host printer01 {
    hardware ethernet 00:1a:2b:3c:4d:5e;
    fixed-address 192.168.20.10;
    option routers 192.168.20.254;
}

# Caméra IP
host camera01 {
    hardware ethernet 11:22:33:44:55:66;
    fixed-address 192.168.20.20;
    option routers 192.168.20.254;
}
```

>[!NOTE]
>**Format MAC Linux** : `aa:bb:cc:dd:ee:ff` (notation par paires hex séparées par `:`)
>
>Pour trouver une adresse MAC :
>```bash
>ip link show
>cat /var/lib/dhcp/dhcpd.leases | grep hardware
>```

### Options DHCP avancées

```bash
subnet 192.168.1.0 netmask 255.255.255.0 {
    range 192.168.1.100 192.168.1.200;
    option routers 192.168.1.254;

    # DNS
    option domain-name "exemple.local";
    option domain-name-servers 8.8.8.8, 1.1.1.1;

    # Serveur NTP (temps)
    option ntp-servers 192.168.1.1;

    # Serveur WINS (NetBIOS)
    option netbios-name-servers 192.168.1.10;
    option netbios-node-type 8;

    # Serveur TFTP (PXE boot)
    next-server 192.168.1.5;
    filename "pxelinux.0";

    # MTU personnalisé
    option interface-mtu 1400;

    # Serveur Proxy (WPAD)
    option wpad code 252 = text;
    option wpad "http://192.168.1.1/proxy.pac";
}
```

### Classes et pools conditionnels

**Exemple 1 : Pools séparés selon le type de client**

```bash
subnet 192.168.1.0 netmask 255.255.255.0 {
    option routers 192.168.1.254;
    option domain-name-servers 8.8.8.8;

    # Pool pour ordinateurs fixes (bail long)
    pool {
        range 192.168.1.100 192.168.1.150;
        default-lease-time 604800;      # 7 jours
        max-lease-time 2592000;         # 30 jours
    }

    # Pool pour appareils mobiles (bail court)
    pool {
        range 192.168.1.151 192.168.1.200;
        default-lease-time 3600;        # 1 heure
        max-lease-time 14400;           # 4 heures
    }
}
```

**Exemple 2 : Classes basées sur le vendor**

```bash
# Classe pour les téléphones VoIP Cisco
class "cisco-phone" {
    match if substring (option vendor-class-identifier, 0, 5) = "Cisco";
}

subnet 192.168.1.0 netmask 255.255.255.0 {
    option routers 192.168.1.254;

    # Pool pour les téléphones VoIP
    pool {
        allow members of "cisco-phone";
        range 192.168.1.50 192.168.1.80;
        option tftp-server-name "192.168.1.5";
    }

    # Pool pour les autres appareils
    pool {
        deny members of "cisco-phone";
        range 192.168.1.100 192.168.1.200;
    }
}
```

### DHCP Failover (haute disponibilité)

Configuration pour deux serveurs DHCP en redondance.

**Serveur primaire (192.168.1.1) :**

```bash
failover peer "dhcp-failover" {
    primary;
    address 192.168.1.1;
    port 647;
    peer address 192.168.1.2;
    peer port 647;
    max-response-delay 60;
    max-unacked-updates 10;
    mclt 3600;
    split 128;
    load balance max seconds 3;
}

subnet 192.168.10.0 netmask 255.255.255.0 {
    pool {
        failover peer "dhcp-failover";
        range 192.168.10.100 192.168.10.200;
    }
    option routers 192.168.10.254;
    option domain-name-servers 8.8.8.8;
}
```

**Serveur secondaire (192.168.1.2) :**

```bash
failover peer "dhcp-failover" {
    secondary;
    address 192.168.1.2;
    port 647;
    peer address 192.168.1.1;
    peer port 647;
    max-response-delay 60;
    max-unacked-updates 10;
    load balance max seconds 3;
}

subnet 192.168.10.0 netmask 255.255.255.0 {
    pool {
        failover peer "dhcp-failover";
        range 192.168.10.100 192.168.10.200;
    }
    option routers 192.168.10.254;
    option domain-name-servers 8.8.8.8;
}
```

### DHCP Relay (Agent de relais)

Si le serveur DHCP est sur un autre réseau, configurer le relais sur le routeur/passerelle.

**Installation :**

```bash
apt install isc-dhcp-relay
```

**Configuration `/etc/default/isc-dhcp-relay` :**

```bash
# Serveur(s) DHCP vers qui relayer
SERVERS="10.0.0.5"

# Interfaces où écouter les requêtes
INTERFACES="eth1 eth2"

# Options supplémentaires
OPTIONS=""
```

**Démarrer le service :**

```bash
systemctl enable isc-dhcp-relay
systemctl start isc-dhcp-relay
systemctl status isc-dhcp-relay
```

### Logs personnalisés

**Configuration pour logs dédiés `/etc/rsyslog.d/dhcpd.conf` :**

```bash
local7.*    /var/log/dhcpd.log
```

**Redémarrer rsyslog :**

```bash
systemctl restart rsyslog
```

**Dans `/etc/dhcp/dhcpd.conf`, ajouter :**

```bash
log-facility local7;
```

### Vérification et dépannage

**Vérifier la configuration :**

```bash
# Tester la syntaxe
dhcpd -t -cf /etc/dhcp/dhcpd.conf

# Vérifier les baux actifs
cat /var/lib/dhcp/dhcpd.leases

# Afficher les baux de manière formatée
dhcp-lease-list
# ou
grep "^lease" /var/lib/dhcp/dhcpd.leases
```

**Voir les logs en temps réel :**

```bash
# Logs système
tail -f /var/log/syslog | grep dhcp

# Logs journald
journalctl -u isc-dhcp-server -f

# Logs personnalisés
tail -f /var/log/dhcpd.log
```

**Redémarrer le service :**

```bash
systemctl restart isc-dhcp-server
systemctl status isc-dhcp-server
```

**Statistiques réseau :**

```bash
# Écoute sur les ports DHCP
netstat -ulnp | grep dhcp
ss -ulnp | grep dhcp

# Capturer le trafic DHCP
tcpdump -i eth0 -n port 67 or port 68
tcpdump -i eth0 -n -vv port bootps or port bootpc
```

### Exemple complet : Serveur multi-réseau

```bash
# /etc/dhcp/dhcpd.conf

# ========== Configuration globale ==========
default-lease-time 86400;
max-lease-time 604800;
authoritative;
ddns-update-style none;
log-facility local7;

# ========== Réseau Management (eth0) ==========
subnet 192.168.1.0 netmask 255.255.255.0 {
    range 192.168.1.100 192.168.1.200;
    option routers 192.168.1.254;
    option domain-name "mgmt.entreprise.local";
    option domain-name-servers 192.168.1.1, 8.8.8.8;
    option ntp-servers 192.168.1.1;
    default-lease-time 604800;  # 7 jours
}

# ========== VLAN 10 - Admin (eth0.10) ==========
subnet 192.168.10.0 netmask 255.255.255.0 {
    range 192.168.10.50 192.168.10.200;
    option routers 192.168.10.254;
    option domain-name "admin.entreprise.local";
    option domain-name-servers 192.168.1.1, 8.8.8.8;
    default-lease-time 604800;
}

# ========== VLAN 20 - Users (eth0.20) ==========
subnet 192.168.20.0 netmask 255.255.255.0 {
    range 192.168.20.50 192.168.20.250;
    option routers 192.168.20.254;
    option domain-name "entreprise.local";
    option domain-name-servers 192.168.1.1, 8.8.8.8;
    default-lease-time 172800;  # 2 jours
}

# ========== VLAN 30 - Guests (eth0.30) ==========
subnet 192.168.30.0 netmask 255.255.255.0 {
    range 192.168.30.50 192.168.30.250;
    option routers 192.168.30.254;
    option domain-name "guest.local";
    option domain-name-servers 8.8.8.8, 1.1.1.1;
    default-lease-time 14400;   # 4 heures
}

# ========== Réservations ==========
host serveur-dns {
    hardware ethernet 00:11:22:33:44:55;
    fixed-address 192.168.1.1;
}

host serveur-web {
    hardware ethernet aa:bb:cc:dd:ee:ff;
    fixed-address 192.168.10.10;
}

host imprimante-rh {
    hardware ethernet 11:22:33:44:55:66;
    fixed-address 192.168.20.10;
}

host imprimante-compta {
    hardware ethernet 22:33:44:55:66:77;
    fixed-address 192.168.20.11;
}
```

---

## Client DHCP sur Debian/Linux

### Configuration avec dhclient (par défaut)

**Configuration automatique :**

La plupart des distributions Debian/Ubuntu utilisent `dhclient` par défaut.

**Fichier `/etc/network/interfaces` :**

```bash
# Interface en DHCP
auto eth0
iface eth0 inet dhcp
```

**Redémarrer l'interface :**

```bash
ifdown eth0 && ifup eth0
# ou
systemctl restart networking
```

### Configuration avec Netplan (Ubuntu/Debian récent)

**Fichier `/etc/netplan/01-netcfg.yaml` :**

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: true
      dhcp6: false
```

**Appliquer :**

```bash
netplan apply
```

**Configuration avancée avec Netplan :**

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: true
      dhcp4-overrides:
        use-dns: true
        use-routes: true
        use-ntp: true
      dhcp6: false
```

### Commandes dhclient

**Obtenir une adresse IP :**

```bash
# Demander un bail DHCP
dhclient eth0

# Avec verbose (détails)
dhclient -v eth0
```

**Renouveler le bail :**

```bash
dhclient -r eth0    # Libérer le bail (release)
dhclient eth0       # Obtenir un nouveau bail
```

**Forcer le renouvellement :**

```bash
# Méthode 1
dhclient -r eth0 && dhclient eth0

# Méthode 2
systemctl restart networking
```

**Afficher les baux actifs :**

```bash
cat /var/lib/dhcp/dhclient.leases
cat /var/lib/dhcp/dhclient.eth0.leases
```

Exemple de contenu :
```
lease {
  interface "eth0";
  fixed-address 192.168.1.100;
  option subnet-mask 255.255.255.0;
  option routers 192.168.1.254;
  option dhcp-lease-time 86400;
  option dhcp-message-type 5;
  option domain-name-servers 8.8.8.8, 8.8.4.4;
  option dhcp-server-identifier 192.168.1.254;
  option domain-name "exemple.local";
  renew 2 2025/11/09 10:00:00;
  rebind 2 2025/11/09 22:00:00;
  expire 3 2025/11/10 04:00:00;
}
```

### Configuration personnalisée de dhclient

**Fichier `/etc/dhcp/dhclient.conf` :**

```bash
# Demander des options spécifiques
request subnet-mask, broadcast-address, time-offset, routers,
        domain-name, domain-name-servers, host-name,
        netbios-name-servers, netbios-scope, interface-mtu,
        ntp-servers;

# Timeout (en secondes)
timeout 60;

# Retry (tentatives)
retry 60;

# Forcer un hostname
send host-name "mon-ordinateur";

# Utiliser un client-identifier personnalisé
send dhcp-client-identifier "mon-client-id";

# Ne pas mettre à jour /etc/resolv.conf
supersede domain-name-servers 8.8.8.8, 1.1.1.1;
```

### Hooks dhclient (scripts personnalisés)

Les scripts dans `/etc/dhcp/dhclient-enter-hooks.d/` et `/etc/dhcp/dhclient-exit-hooks.d/` sont exécutés lors des événements DHCP.

**Exemple : Logger les attributions DHCP**

Créer `/etc/dhcp/dhclient-exit-hooks.d/log-dhcp` :

```bash
#!/bin/bash
if [ "$reason" = "BOUND" ] || [ "$reason" = "RENEW" ]; then
    echo "$(date) - Interface $interface : IP $new_ip_address obtenue du serveur $new_dhcp_server_identifier" >> /var/log/dhcp-client.log
fi
```

Rendre exécutable :

```bash
chmod +x /etc/dhcp/dhclient-exit-hooks.d/log-dhcp
```

**Exemple : Exécuter un script après obtention IP**

```bash
#!/bin/bash
if [ "$reason" = "BOUND" ]; then
    # Mettre à jour un DNS dynamique
    /usr/local/bin/update-ddns.sh

    # Redémarrer un service
    systemctl restart mon-service
fi
```

### Alternative : dhcpcd (client DHCP alternatif)

**Installation :**

```bash
apt install dhcpcd5
```

**Configuration `/etc/dhcpcd.conf` :**

```bash
# Interface
interface eth0

# Demander une IP
hostname mon-ordinateur

# DNS statiques (override DHCP)
static domain_name_servers=8.8.8.8 1.1.1.1

# Metric (priorité des routes)
metric 200
```

**Démarrer :**

```bash
systemctl enable dhcpcd
systemctl start dhcpcd
```

### Dépannage client DHCP

**Problème : Pas d'adresse IP obtenue**

```bash
# Vérifier l'état de l'interface
ip addr show eth0
ip link show eth0

# L'interface est-elle UP ?
ip link set eth0 up

# Forcer une nouvelle demande
dhclient -v eth0
```

**Problème : Timeout DHCP**

```bash
# Capturer le trafic DHCP
tcpdump -i eth0 -n port 67 or port 68

# Vérifier si les broadcasts passent
tcpdump -i eth0 -n broadcast

# Vérifier les logs
journalctl -u networking
tail -f /var/log/syslog | grep -i dhcp
```

**Problème : Mauvaise configuration reçue**

```bash
# Vérifier le bail actuel
cat /var/lib/dhcp/dhclient.leases

# Vérifier les DNS reçus
cat /etc/resolv.conf

# Forcer des DNS
echo "supersede domain-name-servers 8.8.8.8, 1.1.1.1;" >> /etc/dhcp/dhclient.conf
dhclient -r eth0 && dhclient eth0
```

**Problème : Conflit d'adresse IP**

```bash
# Libérer l'IP
dhclient -r eth0

# Attendre quelques secondes
sleep 5

# Redemander une IP
dhclient eth0

# Vérifier avec arping si l'IP est libre
arping -D -I eth0 192.168.1.100
```

### Tests et validation

**Tester l'obtention DHCP :**

```bash
# Méthode 1 : Interface réelle
dhclient -v eth0

# Méthode 2 : Simuler avec nmap (depuis un autre poste)
nmap --script broadcast-dhcp-discover

# Méthode 3 : dhcping (si installé)
dhcping -s 192.168.1.254
```

**Vérifier la configuration reçue :**

```bash
# IP et masque
ip addr show eth0

# Passerelle
ip route show

# DNS
cat /etc/resolv.conf

# Bail actif
cat /var/lib/dhcp/dhclient.leases
```

---

## Comparaison Cisco vs Debian

| Aspect | Cisco (Serveur) | Debian (Serveur) | Debian (Client) |
|--------|-----------------|------------------|-----------------|
| **Configuration** | Mode config CLI | Fichier `/etc/dhcp/dhcpd.conf` | `/etc/network/interfaces` ou Netplan |
| **Pool DHCP** | `network` + `default-router` | `subnet` + `range` + `option routers` | Automatique |
| **Réservation** | `host` + `hardware-address` | `host` + `hardware ethernet` | N/A |
| **Exclusion** | `ip dhcp excluded-address` | Définir `range` en évitant les IP | N/A |
| **Lease time** | `lease X Y Z` (jours heures min) | `default-lease-time` (secondes) | Reçu du serveur |
| **Relay** | `ip helper-address` | `isc-dhcp-relay` | N/A |
| **Vérification** | `show ip dhcp binding` | `cat /var/lib/dhcp/dhcpd.leases` | `cat /var/lib/dhcp/dhclient.leases` |
| **Logs** | `debug ip dhcp server` | `/var/log/syslog` ou `/var/log/dhcpd.log` | `/var/log/syslog` |
| **Format MAC** | `aabb.ccdd.eeff` | `aa:bb:cc:dd:ee:ff` | N/A |
| **Persistance** | `write memory` | Fichier de config + service enabled | Fichier de config |

---

## Sécurité DHCP

### Attaques courantes

| Attaque | Description | Protection |
|---------|-------------|------------|
| **DHCP Starvation** | Épuisement du pool DHCP (requêtes massives) | Port Security, limite de débit |
| **Rogue DHCP Server** | Serveur DHCP pirate sur le réseau | DHCP Snooping (switch) |
| **DHCP Spoofing** | Usurpation de serveur DHCP | DHCP Snooping + DAI |

### DHCP Snooping (Cisco Switch)

**Principe :** Le switch filtre les messages DHCP et empêche les serveurs pirates.

**Configuration :**

```
Switch(config)# ip dhcp snooping
Switch(config)# ip dhcp snooping vlan 10,20,30

# Port trusted (vers le vrai serveur DHCP)
Switch(config)# interface GigabitEthernet0/1
Switch(config-if)# ip dhcp snooping trust
Switch(config-if)# exit

# Ports untrusted (clients - défaut)
Switch(config)# interface range FastEthernet0/1-24
Switch(config-if-range)# ip dhcp snooping limit rate 10
Switch(config-if-range)# exit

# Activer Option 82 (optionnel)
Switch(config)# ip dhcp snooping information option
```

**Vérification :**

```
Switch# show ip dhcp snooping
Switch# show ip dhcp snooping binding
```

### Protection côté serveur (Debian)

**Limiter les requêtes par client :**

Utiliser `fail2ban` ou des règles iptables :

```bash
# Limiter les requêtes DHCP
iptables -A INPUT -p udp --dport 67 -m limit --limit 10/minute --limit-burst 5 -j ACCEPT
iptables -A INPUT -p udp --dport 67 -j DROP
```

**Filtrer par interface (ne pas écouter sur Internet) :**

Dans `/etc/default/isc-dhcp-server` :

```bash
INTERFACESv4="eth1"  # Seulement interface LAN
```

**Logs et alertes :**

```bash
# Surveiller les logs pour activités suspectes
tail -f /var/log/syslog | grep -i dhcp

# Alertes avec fail2ban
# /etc/fail2ban/filter.d/dhcp.conf
[Definition]
failregex = DHCPDISCOVER.*via <HOST>
            DHCPREQUEST.*via <HOST>
```

---

## Bonnes pratiques

### Configuration serveur

1. **Toujours exclure les IP réservées** (serveurs, imprimantes, équipements réseau)
2. **Utiliser des réservations** pour les équipements critiques (basé sur MAC)
3. **Adapter le lease time** au type de réseau :
   - Réseau fixe (bureau) : 7 jours
   - Réseau mobile (WiFi invité) : 2-4 heures
   - Réseau événementiel : 30 minutes
4. **Documenter les pools** dans la configuration (commentaires)
5. **Sauvegarder régulièrement** la configuration et les baux
6. **Monitorer le taux d'utilisation** des pools (alertes à 80%)
7. **Activer DHCP Snooping** sur les switches
8. **Segmenter par VLAN** avec pools dédiés
9. **Logger les attributions** pour audit de sécurité
10. **Configurer la redondance** (failover) pour haute disponibilité

### Configuration client

1. **Ne pas forcer d'IP statique** sans raison valable
2. **Utiliser des scripts de hooks** pour automatisation
3. **Configurer des DNS de secours** (supersede) si nécessaire
4. **Vérifier périodiquement** le renouvellement des baux
5. **Monitorer les échecs DHCP** dans les logs

### Dépannage méthodique

1. **Vérifier la couche physique** : câble, link up
2. **Vérifier les VLANs** : client et serveur sur même VLAN ?
3. **Tester avec tcpdump** : voir les échanges DORA
4. **Vérifier les firewall** : ports 67/68 UDP ouverts
5. **Vérifier les logs** serveur et client
6. **Tester le relay** si serveur distant
7. **Vérifier DHCP Snooping** sur les switches
8. **Vérifier la table de baux** : pool épuisé ?

---

## Outils de diagnostic

### Serveur

```bash
# Debian
systemctl status isc-dhcp-server
journalctl -u isc-dhcp-server -f
dhcpd -t -cf /etc/dhcp/dhcpd.conf
dhcp-lease-list
cat /var/lib/dhcp/dhcpd.leases

# Cisco
show ip dhcp binding
show ip dhcp pool
show ip dhcp statistics
show ip dhcp conflict
show ip dhcp server statistics
debug ip dhcp server events
```

### Client

```bash
# Debian
dhclient -v eth0
cat /var/lib/dhcp/dhclient.leases
ip addr show eth0
ip route show
cat /etc/resolv.conf

# Windows
ipconfig /all
ipconfig /release
ipconfig /renew

# Linux/Cisco
tcpdump -i eth0 -n port 67 or port 68
```

### Analyse réseau

```bash
# Capturer le trafic DHCP complet
tcpdump -i eth0 -n -vv port bootps or port bootpc -w dhcp.pcap

# Analyser avec Wireshark
wireshark dhcp.pcap

# Scanner le réseau pour serveurs DHCP
nmap --script broadcast-dhcp-discover

# Tester depuis un client
dhcping -s 192.168.1.254 -c 192.168.1.100
```
