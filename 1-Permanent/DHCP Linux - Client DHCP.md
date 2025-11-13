---
type: permanent
created: 2025-01-08 16:36
tags:
  - permanent
  - réseau
  - dhcp
  - linux
  - client
  - dhclient
---

# DHCP Linux - Client DHCP

> [!abstract] Concept
> Configurer une interface réseau Linux pour obtenir son IP automatiquement via DHCP

## Explication

Sur Linux, le **client DHCP** permet à une interface réseau d'obtenir automatiquement :
- Adresse IP
- Masque de sous-réseau
- Passerelle par défaut
- Serveurs DNS

**Clients DHCP Linux** :
- **dhclient** : client standard (Debian/Ubuntu)
- **dhcpcd** : alternative (Arch Linux, Raspberry Pi)
- **NetworkManager** : interface graphique (Ubuntu Desktop)

**Fichiers clés** :
- `/etc/network/interfaces` : configuration interfaces (Debian/Ubuntu)
- `/var/lib/dhcp/dhclient.leases` : baux obtenus
- `/etc/resolv.conf` : DNS (généré automatiquement)

## Exemples

### Configuration avec dhclient (Debian/Ubuntu)

Éditer `/etc/network/interfaces` :

```bash
# Interface en DHCP
auto eth0
iface eth0 inet dhcp
```

**Résultat** : `eth0` obtient son IP via DHCP au démarrage.

### Redémarrer l'interface

```bash
# Méthode 1 : ifdown/ifup
ifdown eth0
ifup eth0

# Méthode 2 : systemctl
systemctl restart networking

# Méthode 3 : ip (moderne)
ip link set eth0 down
ip link set eth0 up
```

### Obtenir une IP manuellement

```bash
# Demander un bail DHCP
dhclient eth0

# Libérer le bail actuel
dhclient -r eth0

# Renouveler le bail
dhclient -r eth0 && dhclient eth0
```

### Vérifier l'IP obtenue

```bash
# Méthode 1
ip addr show eth0

# Méthode 2
ifconfig eth0

# Méthode 3
hostname -I
```

### Voir le bail DHCP actif

```bash
# Fichier de baux
cat /var/lib/dhcp/dhclient.leases

# Informations du bail actuel
dhclient -v eth0
```

**Contenu type** :
```
lease {
  interface "eth0";
  fixed-address 192.168.1.100;
  option subnet-mask 255.255.255.0;
  option routers 192.168.1.254;
  option domain-name-servers 8.8.8.8, 8.8.4.4;
  renew 2 2025/01/08 14:30:00;
  expire 3 2025/01/09 02:30:00;
}
```

### Configuration avec NetworkManager (Ubuntu Desktop)

**Interface graphique** : Settings → Network → Paramètres (engrenage) → IPv4 → **Automatic (DHCP)**

**Ligne de commande** :

```bash
# Voir les connexions
nmcli connection show

# Modifier en DHCP
nmcli connection modify eth0 ipv4.method auto

# Activer la connexion
nmcli connection up eth0
```

### Demander des options DHCP spécifiques

Éditer `/etc/dhcp/dhclient.conf` :

```bash
# Demander des options spécifiques
request subnet-mask, broadcast-address, time-offset, routers,
        domain-name, domain-name-servers, host-name,
        netbios-name-servers, netbios-scope, ntp-servers;

# Timeout
timeout 60;

# Retry
retry 60;
```

### Définir un hostname DHCP

```bash
# /etc/dhcp/dhclient.conf
send host-name "mon-ordinateur";
send dhcp-client-identifier "mon-client-unique";
```

Le serveur DHCP verra ce hostname dans ses logs et peut faire des réservations basées dessus.

### Forcer l'utilisation de DNS spécifiques

Éditer `/etc/dhcp/dhclient.conf` :

```bash
# Ignorer les DNS fournis par DHCP
supersede domain-name-servers 1.1.1.1, 8.8.8.8;
```

### Dépannage client DHCP

**Symptôme** : pas d'IP obtenue

**Vérifications** :

```bash
# 1. Interface up ?
ip link show eth0

# 2. Câble branché ?
ethtool eth0 | grep "Link detected"

# 3. Libérer et redemander
dhclient -r eth0
dhclient -v eth0

# 4. Logs système
journalctl -u networking -n 50
dmesg | grep eth0

# 5. Capturer trafic DHCP
tcpdump -i eth0 port 67 or port 68
```

**Chercher** : DISCOVER, OFFER, REQUEST, ACK dans tcpdump

### Configuration IP statique vs DHCP

**DHCP** (`/etc/network/interfaces`) :
```bash
auto eth0
iface eth0 inet dhcp
```

**IP statique** :
```bash
auto eth0
iface eth0 inet static
    address 192.168.1.10
    netmask 255.255.255.0
    gateway 192.168.1.254
    dns-nameservers 8.8.8.8 8.8.4.4
```

### Script de basculement DHCP → Statique

```bash
#!/bin/bash
# Passer en IP statique si DHCP échoue

dhclient -v eth0 -timeout 30
if [ $? -ne 0 ]; then
    echo "DHCP échoué, basculement IP statique"
    ip addr add 192.168.1.100/24 dev eth0
    ip route add default via 192.168.1.254
    echo "nameserver 8.8.8.8" > /etc/resolv.conf
fi
```

## Connexions

### Notes liées
- [[DHCP - Dynamic Host Configuration]] - Processus DORA
- [[DHCP Linux - Installation et configuration]] - Serveur DHCP
- [[DNS - Domain Name System]] - Résolution de noms obtenue via DHCP
- [[DHCP Cisco - Vérification et dépannage]] - Diagnostic serveur

### Contexte
Configuration client essentielle pour tout poste de travail, serveur ou équipement réseau obtenant son IP dynamiquement. La plupart des distributions Linux utilisent dhclient par défaut.

## Sources
- Formation Réseau - Client DHCP Linux
- dhclient Manual Page

---
**Tags thématiques** : #dhcp #client #dhclient #networking #linux
