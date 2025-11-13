---
type: moc
created: 2025-11-11 14:35
tags:
  - moc
  - index
  - linux
  - administration
---

# 🗺️ MOC - Linux Administration

> [!note] Vue d'ensemble
> Ce MOC couvre l'administration système Linux : gestion du matériel, modules kernel, configuration réseau, et services système.

## Introduction

Ce Map of Content organise les connaissances essentielles pour l'administration Linux, en particulier :
- La détection et configuration du matériel
- La gestion des modules kernel
- La configuration réseau (VLAN, NAT, DHCP)
- Les outils de diagnostic et monitoring

Ces notes sont basées sur les objectifs de la certification LPI Linux (101-500) et des formations pratiques sur l'administration réseau Linux.

## 📚 Fondamentaux Linux

### Détection et gestion du matériel

| Commande | Description |
|----------|-------------|
| [[LINUX : [lspci] - lister périphériques PCI]] | Lister et identifier les périphériques PCI |
| [[LINUX : [lsusb] - lister périphériques USB]] | Lister et identifier les périphériques USB |
| [[LINUX : [lsmod] - lister les modules noyau chargés]] | Voir les modules kernel chargés |
| [[LINUX : [modprobe] - charger ou décharger module noyau]] | Charger/décharger des modules avec dépendances |
| [[LINUX : [modinfo] - afficher informations module]] | Obtenir détails et paramètres des modules |

**Concepts associés** :
- [[LINUX - udev détection périphériques]] - Système de détection automatique (hotplug)

### Systèmes de fichiers virtuels

| Chemin/Concept | Description |
|----------------|-------------|
| [[LINUX - pseudo-systèmes fichiers]] | Vue d'ensemble de /proc, /sys, /dev |
| [[LINUX : _proc_ - système de fichiers virtuel processus]] | Détails sur les fichiers importants dans /proc |
| [[LINUX : _sys_ - système de fichiers virtuel kernel]] | Système de fichiers virtuel /sys pour le matériel |

## 🔧 Configuration réseau Linux

### DHCP sur Linux
- [[DHCP Linux - Installation et configuration]] - Serveur isc-dhcp-server
- [[DHCP Linux - Réservations MAC]] - Attribuer IPs fixes par adresse MAC
- [[DHCP Linux - DHCP Relay]] - Relayer les requêtes DHCP entre VLANs
- [[DHCP Linux - Client DHCP]] - Configuration client DHCP (dhclient)
- [[DHCP Linux - Vérification et dépannage]] - Diagnostiquer problèmes DHCP

### VLAN sur Linux
- [[VLAN Linux - Configuration interfaces]] - Créer sous-interfaces 802.1Q
- [[VLAN Linux - Routage inter-VLAN]] - Router entre VLANs sur Linux

### NAT sur Linux
- [[NAT Linux - iptables et NAT]] - Configuration NAT/PAT avec iptables
- [[NAT Linux - Port forwarding]] - Redirection de ports avec iptables

## 📖 Ressources externes

### Documentation officielle
- Man pages : `man lspci`, `man modprobe`, `man iptables`
- Linux Kernel Documentation : https://www.kernel.org/doc/html/latest/
- Arch Wiki (excellent pour Linux en général) : https://wiki.archlinux.org/

### Certifications
- LPI Linux Essentials
- LPI 101-500 (System Administrator)
- LPIC-1, LPIC-2
- RedHat RHCSA

### Formations
- Formation Réseau Linux (notes dans 0-Inbox/CertifLinux/)
- Learning LPI : https://learning.lpi.org/

### Livres recommandés
- "The Linux Command Line" - William Shotts
- "Linux Administration Handbook" - Evi Nemeth et al.
- "UNIX and Linux System Administration Handbook"

## 🚧 Concepts à développer

### Matériel et kernel
- [ ] Compilation du kernel Linux
- [ ] Gestion des firmwares (/lib/firmware)
- [ ] ACPI - Advanced Configuration and Power Interface
- [ ] Gestion de l'UEFI et Secure Boot
- [ ] Modules kernel signés

### Réseau avancé
- [ ] iproute2 - Suite moderne de commandes réseau (ip, ss)
- [ ] NetworkManager vs systemd-networkd
- [ ] nftables - Successeur d'iptables
- [ ] Firewall Linux (firewalld, ufw)
- [ ] Bridge Linux - Pont réseau
- [ ] Bonding - Agrégation de liens
- [ ] VPN sur Linux (OpenVPN, WireGuard)
- [ ] IPv6 sur Linux
- [ ] QoS - Quality of Service

### Services système
- [ ] systemd - Gestionnaire de services moderne
- [ ] journalctl - Logs systemd
- [ ] Cron et at - Planification de tâches
- [ ] SSH - Configuration serveur et client

### Stockage
- [ ] LVM - Logical Volume Manager
- [ ] RAID logiciel Linux
- [ ] Systèmes de fichiers (ext4, xfs, btrfs)
- [ ] Montage et fstab

### Sécurité
- [ ] SELinux - Security-Enhanced Linux
- [ ] AppArmor - Contrôle d'accès
- [ ] Sudo - Élévation de privilèges
- [ ] Fail2ban - Protection contre attaques

### Performance et monitoring
- [ ] top, htop, atop - Monitoring processus
- [ ] iotop - Monitoring I/O disque
- [ ] netstat, ss - Monitoring réseau
- [ ] dmesg - Messages kernel
- [ ] strace - Tracer appels système

## 🔗 MOCs connexes

- [[MOC - Réseau]] - Concepts réseau généraux (Cisco + Linux)

## 📊 Statistiques

**Dernière mise à jour** : 2025-11-11
**Nombre de notes** : 38
**Répartition** :
- Gestion matériel et kernel : 9 notes
- Configuration réseau Linux : 9 notes
- Concepts réseau généraux : 20 notes

---

**Navigation** : Utiliser la vue graphique d'Obsidian pour explorer les connexions entre ces notes
