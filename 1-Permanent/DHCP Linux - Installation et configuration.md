---
type: permanent
created: 2025-01-08 16:30
tags:
  - permanent
  - réseau
  - dhcp
  - linux
  - isc-dhcp-server
---

# DHCP Linux - Installation et configuration

> [!abstract] Concept
> Installer et configurer le serveur DHCP isc-dhcp-server sur Debian/Ubuntu

## Explication

**isc-dhcp-server** est le serveur DHCP standard sur Linux. Configuration en 3 étapes :
1. **Installer** le paquet
2. **Définir l'interface** d'écoute
3. **Configurer les pools** dans dhcpd.conf

**Fichiers clés** :
- `/etc/dhcp/dhcpd.conf` : configuration principale (pools, options)
- `/etc/default/isc-dhcp-server` : interface d'écoute
- `/var/lib/dhcp/dhcpd.leases` : base de données des baux actifs
- `/var/log/syslog` : logs DHCP

## Exemples

### Installation

```bash
# Mettre à jour les paquets
apt update

# Installer isc-dhcp-server
apt install isc-dhcp-server

# Vérifier l'installation
dpkg -l | grep isc-dhcp-server
systemctl status isc-dhcp-server
```

### Définir l'interface d'écoute

Éditer `/etc/default/isc-dhcp-server` :

```bash
# IPv4 : interface où le serveur écoute
INTERFACESv4="eth0"

# IPv6 (optionnel)
INTERFACESv6=""
```

**Important** : l'interface doit avoir une IP fixe sur le réseau à servir.

### Configuration de base

Éditer `/etc/dhcp/dhcpd.conf` :

```bash
# Configuration globale
default-lease-time 86400;      # 1 jour (en secondes)
max-lease-time 604800;         # 7 jours
authoritative;                 # Ce serveur est autoritaire

# Options globales
option domain-name "exemple.local";
option domain-name-servers 8.8.8.8, 8.8.4.4;

# Pool DHCP pour 192.168.1.0/24
subnet 192.168.1.0 netmask 255.255.255.0 {
    range 192.168.1.100 192.168.1.200;
    option routers 192.168.1.254;
    option subnet-mask 255.255.255.0;
    option broadcast-address 192.168.1.255;
    option domain-name-servers 8.8.8.8, 8.8.4.4;
}
```

**Explication** :
- `authoritative` : ce serveur est le seul serveur DHCP du réseau
- `range` : plage d'IP attribuables (100-200)
- `option routers` : passerelle par défaut
- `default-lease-time` : durée bail en secondes

### Démarrer le service

```bash
# Activer au démarrage
systemctl enable isc-dhcp-server

# Démarrer
systemctl start isc-dhcp-server

# Vérifier l'état
systemctl status isc-dhcp-server

# Voir les logs en temps réel
journalctl -u isc-dhcp-server -f
tail -f /var/log/syslog | grep dhcp
```

### Redémarrer après modifications

```bash
# Vérifier la syntaxe avant de redémarrer
dhcpd -t -cf /etc/dhcp/dhcpd.conf

# Redémarrer le service
systemctl restart isc-dhcp-server

# Recharger la config (sans couper les baux actifs)
systemctl reload isc-dhcp-server
```

### Configuration multi-VLAN

```bash
# VLAN 10 - Administration
subnet 192.168.10.0 netmask 255.255.255.0 {
    range 192.168.10.50 192.168.10.200;
    option routers 192.168.10.254;
    option domain-name "admin.entreprise.local";
    option domain-name-servers 192.168.10.1, 8.8.8.8;
    default-lease-time 604800;  # 7 jours
}

# VLAN 20 - Utilisateurs
subnet 192.168.20.0 netmask 255.255.255.0 {
    range 192.168.20.50 192.168.20.250;
    option routers 192.168.20.254;
    option domain-name "entreprise.local";
    default-lease-time 172800;  # 2 jours
}

# VLAN 30 - Invités WiFi
subnet 192.168.30.0 netmask 255.255.255.0 {
    range 192.168.30.50 192.168.30.250;
    option routers 192.168.30.254;
    option domain-name-servers 8.8.8.8, 1.1.1.1;
    default-lease-time 14400;   # 4 heures
}
```

### Vérifier la configuration

```bash
# Tester la syntaxe
dhcpd -t -cf /etc/dhcp/dhcpd.conf

# Voir les baux actifs
dhcp-lease-list
cat /var/lib/dhcp/dhcpd.leases

# Voir les logs
tail -100 /var/log/syslog | grep dhcp
```

## Connexions

### Notes liées
- [[DHCP - Dynamic Host Configuration]] - Concept DHCP
- [[DHCP Linux - Réservations MAC]] - IP fixes par MAC
- [[DHCP Linux - Vérification et dépannage]] - Diagnostic
- [[DHCP Cisco - Configuration de base]] - Équivalent Cisco

### Contexte
Configuration de base pour tout serveur DHCP Linux. isc-dhcp-server est le standard sur Debian/Ubuntu. Pour des besoins simples, dnsmasq peut être une alternative plus légère.

## Sources
- Formation Réseau - DHCP Linux
- ISC DHCP Server Documentation

---
**Tags thématiques** : #dhcp #linux #isc-dhcp-server #debian #installation
