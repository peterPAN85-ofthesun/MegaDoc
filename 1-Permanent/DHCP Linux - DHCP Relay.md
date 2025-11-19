---
type: permanent
created: 2025-01-08 16:34
tags:
  - permanent
  - réseau
  - dhcp
  - linux
  - relay
---

# DHCP Linux - DHCP Relay

> [!abstract] Concept
> Relayer les requêtes DHCP (broadcasts) vers un serveur DHCP distant sur un autre réseau

## Explication

Le **DHCP Relay** permet à un routeur/serveur de transférer les broadcasts DHCP vers un serveur DHCP situé sur un réseau différent.

**Problème** : les broadcasts ne traversent pas les routeurs
**Solution** : isc-dhcp-relay convertit le broadcast en unicast vers le serveur

**Architecture typique** :
```
[Clients VLAN 10] ─ [Routeur Linux avec relay] ─ [Serveur DHCP 10.0.0.5]
```

**Paquet** : `isc-dhcp-relay` sur Debian/Ubuntu

## Exemples

### Installation

```bash
# Installer le relay DHCP
apt update
apt install isc-dhcp-relay
```

Lors de l'installation, il demande :
- **IP du serveur DHCP** : ex: `10.0.0.5`
- **Interfaces** : ex: `eth0 eth1`

### Configuration manuelle

Éditer `/etc/default/isc-dhcp-relay` :

```bash
# Serveur(s) DHCP distant(s)
SERVERS="10.0.0.5"

# Interfaces à écouter (séparées par espaces)
INTERFACES="eth0 eth1"

# Options supplémentaires
OPTIONS=""
```

**SERVERS** : IP du serveur DHCP centralisé
**INTERFACES** : interfaces réseau du routeur (LAN, VLANs)

### Configuration multi-VLAN

```bash
# Serveur DHCP centralisé
SERVERS="192.168.1.100"

# Interfaces des VLANs à servir
INTERFACES="eth0.10 eth0.20 eth0.30"

OPTIONS=""
```

Le relay écoute sur les VLANs 10, 20, 30 et relaie vers `192.168.1.100`.

### Démarrer le service

```bash
# Activer au démarrage
systemctl enable isc-dhcp-relay

# Démarrer
systemctl start isc-dhcp-relay

# Vérifier l'état
systemctl status isc-dhcp-relay

# Voir les logs
journalctl -u isc-dhcp-relay -f
```

### Vérifier le fonctionnement

```bash
# Voir les requêtes relayées
tail -f /var/log/syslog | grep dhcrelay

# Capturer le trafic DHCP
tcpdump -i eth0 port 67 or port 68
```

**Rechercher** : paquets DHCP DISCOVER/OFFER relayés

### Activer le routage IP (prérequis)

```bash
# Activer le forwarding IPv4
sysctl -w net.ipv4.ip_forward=1

# Rendre permanent
echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
sysctl -p
```

**Sans forwarding** : le relay ne peut pas relayer les paquets entre réseaux.

### Architecture complète

**Serveur DHCP centralisé** (`192.168.1.100`) :

```bash
# /etc/dhcp/dhcpd.conf

# VLAN 10 (relayé)
subnet 192.168.10.0 netmask 255.255.255.0 {
    range 192.168.10.50 192.168.10.200;
    option routers 192.168.10.254;
}

# VLAN 20 (relayé)
subnet 192.168.20.0 netmask 255.255.255.0 {
    range 192.168.20.50 192.168.20.250;
    option routers 192.168.20.254;
}

# Subnet local (nécessaire pour isc-dhcp-server)
subnet 192.168.1.0 netmask 255.255.255.0 {
    # Pas de range (pas de clients directs ici)
}
```

**Routeur avec relay** :

```bash
# /etc/default/isc-dhcp-relay
SERVERS="192.168.1.100"
INTERFACES="eth0.10 eth0.20"
```

### Dépannage

**Problème** : clients ne reçoivent pas d'IP

**Vérifications** :

```bash
# 1. Relay actif ?
systemctl status isc-dhcp-relay

# 2. Routage activé ?
sysctl net.ipv4.ip_forward

# 3. Serveur DHCP joignable ?
ping 10.0.0.5

# 4. Ports DHCP ouverts ?
netstat -ulnp | grep 67

# 5. Logs relay
journalctl -u isc-dhcp-relay -n 100
```

### Alternative : configuration iptables

Certains préfèrent utiliser `iptables` pour le relay :

```bash
# Rediriger broadcasts DHCP vers serveur
iptables -t nat -A PREROUTING -i eth0 -p udp --dport 67 -j DNAT --to-destination 10.0.0.5
```

**Note** : isc-dhcp-relay est plus propre et standard.

## Connexions

### Notes liées
- [[DHCP Relay Agent]] - Concept général et architecture
- [[DHCP - Dynamic Host Configuration]] - Processus DORA
- [[DHCP Cisco - Relay Agent]] - Équivalent Cisco (ip helper-address)
- [[DHCP Linux - Installation et configuration]] - Setup serveur DHCP
- [[ROUTAGE - statique]] - Routage nécessaire entre réseaux

### Contexte
Utile pour centraliser le serveur DHCP (ex: Windows Server, Linux) plutôt que configurer DHCP sur chaque routeur. Simplifie la gestion et la supervision dans les réseaux multi-VLANs.

## Sources
- Formation Réseau - DHCP Relay Linux
- ISC DHCP Relay Documentation

---
**Tags thématiques** : #dhcp #relay #dhcrelay #broadcast #multi-vlan
