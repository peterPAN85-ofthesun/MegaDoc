---
date: 2025/11/07
tags:
  - vlan
---

# Méthode CISCO (L2/L3)

![[Pasted image 20251107200218.png]]

## Configuration du Switch (L2)

### Créer les VLANs

```
Switch> enable
Switch# configure terminal
Switch(config)# vlan 10
Switch(config-vlan)# name VLAN_ADMIN
Switch(config-vlan)# exit

Switch(config)# vlan 20
Switch(config-vlan)# name VLAN_USERS
Switch(config-vlan)# exit

Switch(config)# vlan 30
Switch(config-vlan)# name VLAN_SERVEURS
Switch(config-vlan)# exit
```

### Assigner les ports aux VLANs (mode access)

```
Switch(config)# interface fastEthernet 0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10
Switch(config-if)# exit

Switch(config)# interface fastEthernet 0/2
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 20
Switch(config-if)# exit

Switch(config)# interface fastEthernet 0/3
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 30
Switch(config-if)# exit
```

### Configurer le port trunk (vers le routeur)

```
Switch(config)# interface fastEthernet 0/24
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 10,20,30
Switch(config-if)# exit
Switch(config)# end
Switch# write memory
```

>[!NOTE]
>**Mode Access** : Port connecté à un équipement final (PC, serveur)
>**Mode Trunk** : Port qui transporte plusieurs VLANs (liaison switch-routeur ou switch-switch)

### Vérification de la configuration

```
Switch# show vlan brief
Switch# show interfaces trunk
Switch# show running-config
```

---

## Configuration du Routeur (L3) - Router on a Stick

### Configurer les sous-interfaces (sub-interfaces)

```
Router> enable
Router# configure terminal
Router(config)# interface gigabitEthernet 0/0
Router(config-if)# no shutdown
Router(config-if)# exit
```

### Créer une sous-interface par VLAN

```
Router(config)# interface gigabitEthernet 0/0.10
Router(config-subif)# encapsulation dot1Q 10
Router(config-subif)# ip address 192.168.10.254 255.255.255.0
Router(config-subif)# exit

Router(config)# interface gigabitEthernet 0/0.20
Router(config-subif)# encapsulation dot1Q 20
Router(config-subif)# ip address 192.168.20.254 255.255.255.0
Router(config-subif)# exit

Router(config)# interface gigabitEthernet 0/0.30
Router(config-subif)# encapsulation dot1Q 30
Router(config-subif)# ip address 192.168.30.254 255.255.255.0
Router(config-subif)# exit

Router(config)# end
Router# write memory
```

>[!NOTE]
>**Encapsulation dot1Q** : Protocole de tagging 802.1Q (standard IEEE)
>**Router on a Stick** : Une seule interface physique avec plusieurs sous-interfaces logiques
>Chaque sous-interface sert de passerelle pour son VLAN

### Vérification de la configuration

```
Router# show ip interface brief
Router# show interfaces gigabitEthernet 0/0.10
Router# show running-config
Router# show ip route
```

---

## Résumé de la configuration

| VLAN | Nom            | Réseau           | Passerelle      | Interface Router |
| ---- | -------------- | ---------------- | --------------- | ---------------- |
| 10   | VLAN_ADMIN     | 192.168.10.0/24  | 192.168.10.254  | Gi0/0.10         |
| 20   | VLAN_USERS     | 192.168.20.0/24  | 192.168.20.254  | Gi0/0.20         |
| 30   | VLAN_SERVEURS  | 192.168.30.0/24  | 192.168.30.254  | Gi0/0.30         |

**Flux de communication inter-VLAN** :
PC (VLAN 10) → Switch (mode access) → Switch (mode trunk) → Routeur (sous-interface .10) → Routage → Routeur (sous-interface .20) → Switch (mode trunk) → Switch (mode access) → PC (VLAN 20)

---

# Alternative : Serveur Debian comme routeur (L3)

Un serveur Debian peut remplacer le routeur Cisco pour le routage inter-VLAN. Cette solution est économique et flexible.

### Prérequis

- Serveur Debian avec une interface réseau connectée au port trunk du switch
- Paquet `vlan` installé
- Droits root ou sudo

### Installation du support VLAN

```bash
apt update
apt install vlan
modprobe 8021q
echo "8021q" >> /etc/modules
```

>[!NOTE]
>Le module kernel **8021q** permet de gérer les VLANs (802.1Q tagging)

### Configuration des interfaces VLAN

Éditez le fichier `/etc/network/interfaces` :

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

### Alternative avec Netplan (Ubuntu/Debian récent)

Créez/éditez `/etc/netplan/01-netcfg.yaml` :

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

Appliquez la configuration :

```bash
netplan apply
```

### Activer le routage IP (IP Forwarding)

```bash
# Activation temporaire
echo 1 > /proc/sys/net/ipv4/ip_forward

# Activation permanente
sed -i 's/#net.ipv4.ip_forward=1/net.ipv4.ip_forward=1/' /etc/sysctl.conf
# ou
echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf

# Appliquer les changements
sysctl -p
```

### Redémarrer les interfaces réseau

```bash
# Méthode classique
systemctl restart networking

# Avec ifupdown
ifdown eth0 && ifup eth0
ifup eth0.10 eth0.20 eth0.30

# Avec netplan
netplan apply
```

### Vérification de la configuration

```bash
# Vérifier les interfaces VLAN
ip addr show
ip -d link show | grep vlan

# Vérifier le routage
ip route show
cat /proc/sys/net/ipv4/ip_forward

# Tester la connectivité depuis un PC
# PC VLAN 10 → ping 192.168.10.254
# PC VLAN 10 → ping 192.168.20.1 (PC dans VLAN 20)
```

### Configuration du pare-feu (optionnel)

```bash
# Autoriser le routage entre VLANs
iptables -A FORWARD -i eth0.10 -o eth0.20 -j ACCEPT
iptables -A FORWARD -i eth0.20 -o eth0.10 -j ACCEPT
iptables -A FORWARD -i eth0.10 -o eth0.30 -j ACCEPT
iptables -A FORWARD -i eth0.30 -o eth0.10 -j ACCEPT
iptables -A FORWARD -i eth0.20 -o eth0.30 -j ACCEPT
iptables -A FORWARD -i eth0.30 -o eth0.20 -j ACCEPT

# Sauvegarder les règles
apt install iptables-persistent
netfilter-persistent save
```

>[!NOTE]
>**Avantages du serveur Debian** :
>- Coût réduit (pas besoin de routeur matériel)
>- Flexibilité : installation de services (DHCP, DNS, pare-feu, proxy)
>- Facilité de scripting et d'automatisation
>- Possibilité d'ajouter des règles de filtrage avancées
>
>**Inconvénients** :
>- Performance inférieure à un routeur matériel dédié
>- Latence légèrement plus élevée
>- Nécessite des compétences en administration Linux

### Configuration du Switch (identique)

La configuration du switch reste la même qu'avec le routeur Cisco :
- Port trunk vers le serveur Debian (au lieu du routeur)
- Ports access pour les équipements finaux

```
Switch(config)# interface fastEthernet 0/24
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 10,20,30
```

### Schéma de la solution

```
[PC VLAN 10] ───┐
                │
[PC VLAN 20] ───┼─── [Switch L2] ───(trunk)─── [Serveur Debian]
                │      (access)                  eth0.10: 192.168.10.254
[PC VLAN 30] ───┘                                eth0.20: 192.168.20.254
                                                 eth0.30: 192.168.30.254
```
