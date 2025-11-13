---
type: permanent
created: 2025-11-11 15:21
tags:
  - permanent
  - linux
  - filesystem
  - kernel
  - hardware
---

# LINUX : _sys_ - système de fichiers virtuel kernel

> [!abstract] Concept
> Système de fichiers virtuel qui expose la structure hiérarchique des périphériques, drivers et sous-systèmes du kernel.

## Explication
Le répertoire `/sys/` est un pseudo-système de fichiers (sysfs) qui représente la vue orientée-objet du kernel Linux. Il organise les informations sur les périphériques, bus, drivers et sous-systèmes de manière hiérarchique et structurée. Contrairement à `/proc/` qui est centré sur les processus, `/sys/` est centré sur le hardware et les drivers.

Sysfs permet de lire l'état du matériel et de configurer des paramètres kernel à chaud. C'est l'interface moderne pour interagir avec les périphériques et leurs drivers.

## Exemples

```bash
# Lister les périphériques par bus
ls /sys/bus/pci/devices/
ls /sys/bus/usb/devices/

# Informations sur un périphérique réseau
cat /sys/class/net/eth0/address
cat /sys/class/net/eth0/statistics/rx_bytes

# État batterie (laptop)
cat /sys/class/power_supply/BAT0/capacity

# Contrôler rétroéclairage écran
echo 500 > /sys/class/backlight/intel_backlight/brightness

# Modules chargés et leurs paramètres
ls /sys/module/
cat /sys/module/e1000/parameters/debug
```

Organisation :
- `/sys/bus/` : périphériques organisés par type de bus
- `/sys/class/` : périphériques organisés par classe fonctionnelle
- `/sys/devices/` : hiérarchie physique des devices
- `/sys/module/` : modules kernel et leurs paramètres

## Connexions
### Notes liées
- [[LINUX : _proc_ - système de fichiers virtuel processus]]
- [[LINUX : [lspci] - lister périphériques PCI]]
- [[LINUX : [lsusb] - lister périphériques USB]]
- [[LINUX : [modprobe] - charger ou décharger module noyau]]

### Contexte
Cette note est essentielle pour comprendre la gestion moderne du hardware sous Linux. `/sys/` est utilisé par udev, systemd, et tous les outils de gestion matérielle.

## Sources
- man sysfs
- Documentation kernel Linux

---
**Tags thématiques** : #linux #filesystem #kernel #hardware
