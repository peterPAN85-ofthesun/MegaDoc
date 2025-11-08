---
type: moc
created: 2025-01-08 01:46
tags:
  - moc
  - linux
  - vlan
  - configuration
---

# 🗺️ MOC - Configuration VLAN Linux

> [!note] Guide de référence
> Configuration des VLANs sur Linux avec module 8021q pour routage inter-VLAN.

## 📚 Concept

Voir [[VLAN - Virtual LAN]] pour le concept général.

Un serveur Linux peut remplacer un routeur Cisco :
- Plus économique
- Plus flexible (DHCP, DNS, firewall)
- Facilité de scripting

---

## Prérequis

```bash
# Installer support VLAN
apt update
apt install vlan

# Charger module 8021q
modprobe 8021q
echo "8021q" >> /etc/modules

# Vérifier
lsmod | grep 8021q
```

>[!note]
>Module kernel **8021q** gère le tagging 802.1Q.

---

## Configuration /etc/network/interfaces

### Méthode classique (Debian ancien)

```bash
# Interface physique (trunk)
auto eth0
iface eth0 inet manual
    up ip link set eth0 up

# VLAN 10 - ADMIN
auto eth0.10
iface eth0.10 inet static
    address 192.168.10.254
    netmask 255.255.255.0
    vlan-raw-device eth0

# VLAN 20 - USERS
auto eth0.20
iface eth0.20 inet static
    address 192.168.20.254
    netmask 255.255.255.0
    vlan-raw-device eth0

# VLAN 30 - SERVEURS
auto eth0.30
iface eth0.30 inet static
    address 192.168.30.254
    netmask 255.255.255.0
    vlan-raw-device eth0
```

Redémarrer :
```bash
systemctl restart networking
# ou
ifup eth0.10 eth0.20 eth0.30
```

---

## Configuration Netplan (Ubuntu/Debian récent)

Éditer `/etc/netplan/01-netcfg.yaml` :

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: no
  vlans:
    eth0.10:
      id: 10
      link: eth0
      addresses:
        - 192.168.10.254/24
    eth0.20:
      id: 20
      link: eth0
      addresses:
        - 192.168.20.254/24
    eth0.30:
      id: 30
      link: eth0
      addresses:
        - 192.168.30.254/24
```

Appliquer :
```bash
netplan apply
# ou debug
netplan --debug apply
```

---

## Création manuelle

```bash
# Créer interface VLAN
ip link add link eth0 name eth0.10 type vlan id 10

# Activer
ip link set eth0.10 up

# Assigner IP
ip addr add 192.168.10.254/24 dev eth0.10

# Vérifier
ip addr show eth0.10
```

Supprimer :
```bash
ip link delete eth0.10
```

---

## Activer IP Forwarding

```bash
# Temporaire
echo 1 > /proc/sys/net/ipv4/ip_forward

# Permanent
sed -i 's/#net.ipv4.ip_forward=1/net.ipv4.ip_forward=1/' /etc/sysctl.conf
sysctl -p

# Vérifier (doit = 1)
cat /proc/sys/net/ipv4/ip_forward
```

>[!important]
>Sans IP forwarding, pas de routage inter-VLAN.

---

## Pare-feu (Optionnel)

### Autoriser tout le trafic inter-VLAN

```bash
iptables -A FORWARD -i eth0.10 -o eth0.20 -j ACCEPT
iptables -A FORWARD -i eth0.20 -o eth0.10 -j ACCEPT
iptables -A FORWARD -i eth0.10 -o eth0.30 -j ACCEPT
iptables -A FORWARD -i eth0.30 -o eth0.10 -j ACCEPT
iptables -A FORWARD -i eth0.20 -o eth0.30 -j ACCEPT
iptables -A FORWARD -i eth0.30 -o eth0.20 -j ACCEPT

# Sauvegarder
apt install iptables-persistent
netfilter-persistent save
```

---

### Filtrage sélectif

```bash
# ADMIN peut accéder SERVEURS
iptables -A FORWARD -i eth0.10 -o eth0.30 -j ACCEPT
iptables -A FORWARD -i eth0.30 -o eth0.10 -m state --state ESTABLISHED,RELATED -j ACCEPT

# USERS NE PEUT PAS accéder SERVEURS
iptables -A FORWARD -i eth0.20 -o eth0.30 -j DROP
```

---

## Vérification

```bash
# Toutes les interfaces
ip addr show

# Interfaces VLAN spécifiquement
ip -d link show | grep vlan

# Routes
ip route show

# IP forwarding
cat /proc/sys/net/ipv4/ip_forward

# Statistiques
ip -s link show eth0.10
```

---

## Tester

```bash
# Ping passerelle
ping 192.168.10.254

# Ping inter-VLAN (PC VLAN 10 → PC VLAN 20)
ping 192.168.20.10
```

---

## Configuration du Switch Cisco

Le switch doit avoir :
- Port trunk vers serveur Linux
- Ports access pour les PC

```cisco
Switch(config)# interface fastEthernet 0/24
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 10,20,30
```

---

## Topologie

```
[PC VLAN 10] ─┐
              │
[PC VLAN 20] ─┼─ [Switch] ─(trunk)─ [Serveur Linux]
              │                      eth0.10: .254
[PC VLAN 30] ─┘                      eth0.20: .254
                                     eth0.30: .254
```

---

## Script Complet

```bash
#!/bin/bash
# Configuration VLANs Debian

INTERFACE=eth0

# Support VLAN
apt install -y vlan
modprobe 8021q
echo "8021q" >> /etc/modules

# Créer interfaces
ip link add link $INTERFACE name ${INTERFACE}.10 type vlan id 10
ip link add link $INTERFACE name ${INTERFACE}.20 type vlan id 20
ip link add link $INTERFACE name ${INTERFACE}.30 type vlan id 30

# IPs
ip addr add 192.168.10.254/24 dev ${INTERFACE}.10
ip addr add 192.168.20.254/24 dev ${INTERFACE}.20
ip addr add 192.168.30.254/24 dev ${INTERFACE}.30

# Activer
ip link set ${INTERFACE}.10 up
ip link set ${INTERFACE}.20 up
ip link set ${INTERFACE}.30 up

# IP forwarding
echo 1 > /proc/sys/net/ipv4/ip_forward
sed -i 's/#net.ipv4.ip_forward=1/net.ipv4.ip_forward=1/' /etc/sysctl.conf

echo "VLANs configurés!"
ip addr show | grep "eth0\."
```

---

## Avantages / Inconvénients

### Avantages ✅
- Coût réduit
- Flexibilité (services additionnels)
- Scripting facile
- Filtrage avancé

### Inconvénients ❌
- Performance < routeur matériel
- Latence plus élevée
- Compétences Linux requises
- Single point of failure

---

## Dépannage

```bash
# Modules chargés
lsmod | grep 8021q

# Erreurs réseau
dmesg | grep eth0
journalctl -u networking

# Test manuel
ip link add link eth0 name eth0.99 type vlan id 99
ip link set eth0.99 up
ip addr add 192.168.99.1/24 dev eth0.99
ping 192.168.99.1

# Nettoyer
ip link delete eth0.99
```

---

## Connexions

### Concepts
- [[VLAN - Virtual LAN]]
- [[802.1Q tagging]]
- [[Router on a stick]] - Équivalent matériel

### Configuration Cisco équivalente
- [[MOC - Configuration VLAN Cisco]]

### Voir aussi
- Images : ![[Pasted image 20251107195855.png]] ![[Pasted image 20251107200218.png]]

---

**Sources** : Fiche VLANs, [[Formation Réseau - Jour 2]], man vlan
