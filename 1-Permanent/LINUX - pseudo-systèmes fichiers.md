---
type: permanent
created: 2025-11-11 14:30
tags:
  - permanent
  - linux
  - système
  - kernel
---

# Pseudo-systèmes de fichiers Linux

> [!abstract] Concept
> Systèmes de fichiers virtuels en mémoire qui exposent des informations kernel et matériel sous forme de fichiers, sans stockage persistant sur disque.

## Explication

Les pseudo-systèmes de fichiers (ou systèmes de fichiers virtuels) sont des répertoires spéciaux dans Linux qui ressemblent à des systèmes de fichiers normaux mais n'existent qu'en mémoire RAM. Ils ne contiennent pas de fichiers réels stockés sur disque, mais servent d'interface pour accéder aux informations du noyau, des processus, et du matériel. Ces répertoires sont montés automatiquement au démarrage et disparaissent à l'extinction du système.

Les trois principaux pseudo-systèmes de fichiers sont `/proc`, `/sys`, et `/dev`. Le répertoire `/proc` expose les informations sur les processus et les structures de données du noyau. Le répertoire `/sys` (sysfs) offre une vue organisée du matériel et des pilotes détectés par le système. Le répertoire `/dev` contient les fichiers spéciaux de périphériques qui permettent aux programmes d'interagir avec le matériel.

Ces systèmes de fichiers sont essentiels pour l'administration Linux car ils permettent d'interroger et parfois de modifier l'état du système en temps réel simplement en lisant ou écrivant dans des fichiers. Par exemple, `cat /proc/cpuinfo` affiche les informations du processeur, et `echo 1 > /sys/class/leds/input3::capslock/brightness` allume la LED du Caps Lock.

## Exemples

### Exemple 1 : Consulter les informations CPU
```bash
cat /proc/cpuinfo
```
Affiche toutes les informations sur chaque cœur du processeur : modèle, fréquence, cache, flags, etc.

### Exemple 2 : Explorer le matériel dans /sys
```bash
ls /sys/class/net/
```
Sortie :
```
eth0  lo  wlan0
```
Liste toutes les interfaces réseau détectées par le système.

### Exemple 3 : Vérifier les périphériques dans /dev
```bash
ls /dev/sd*
```
Sortie :
```
/dev/sda  /dev/sda1  /dev/sda2  /dev/sdb  /dev/sdb1
```
Liste tous les disques SATA/SCSI et leurs partitions.

## Cas d'usage

- **Diagnostic système** : Lire `/proc/meminfo` pour voir l'utilisation de la mémoire, `/proc/uptime` pour le temps de fonctionnement
- **Monitoring matériel** : Consulter `/sys/class/thermal/` pour les températures, `/sys/class/power_supply/` pour la batterie
- **Gestion des processus** : Explorer `/proc/[PID]/` pour obtenir des détails sur un processus spécifique (ligne de commande, environnement, fichiers ouverts)
- **Configuration dynamique** : Modifier des paramètres kernel via `/proc/sys/` (ex: `/proc/sys/net/ipv4/ip_forward` pour activer le routage IP)
- **Accès aux périphériques** : Interagir avec le matériel via `/dev/` (lire un disque avec `/dev/sda`, générer de l'aléatoire avec `/dev/urandom`)

## Avantages et inconvénients

✅ **Avantages** :
- Interface simple et universelle (lecture/écriture de fichiers)
- Pas de commandes spéciales nécessaires, juste `cat`, `echo`, `grep`
- Informations en temps réel sur l'état du système
- Permet la configuration dynamique sans redémarrage
- Structure organisée et prévisible

❌ **Inconvénients** / Limites :
- Contenu disparaît à chaque redémarrage (non persistant)
- Certaines modifications nécessitent les privilèges root
- Structure peut varier selon la version du kernel
- Écriture dans certains fichiers peut être dangereuse (risque de crash système)
- Non adapté au stockage de données permanentes

## Connexions

### Notes liées
- [[LINUX : [lspci] - lister périphériques PCI]] - Lit les données depuis /sys/bus/pci
- [[LINUX : [lsusb] - lister périphériques USB]] - Lit les données depuis /sys/bus/usb
- [[LINUX : [lsmod] - lister les modules noyau chargés]] - Lit le fichier /proc/modules
- [[LINUX - udev détection périphériques]] - Gère automatiquement /dev et s'appuie sur /sys

### Dans le contexte de
- [[LINUX : _proc_ - système de fichiers virtuel processus]] - Détails sur les fichiers importants dans /proc
- [[MOC - Linux Administration]] - Connaissance fondamentale pour l'administration système

## Fichiers et répertoires importants

### /proc - Informations processus et kernel
```bash
/proc/cpuinfo       # Informations CPU
/proc/meminfo       # Informations mémoire
/proc/interrupts    # Interruptions I/O par CPU
/proc/ioports       # Plages I/O enregistrées
/proc/dma           # Canaux DMA en cours d'utilisation
/proc/[PID]/        # Informations sur le processus PID
/proc/sys/          # Paramètres kernel modifiables
```

### /sys - Informations matériel
```bash
/sys/class/         # Périphériques organisés par classe
/sys/block/         # Périphériques de stockage bloc
/sys/bus/           # Bus système (pci, usb, etc.)
/sys/devices/       # Arborescence complète des périphériques
```

### /dev - Fichiers de périphériques
```bash
/dev/sda            # Premier disque SATA/SCSI
/dev/tty            # Terminaux
/dev/null           # Périphérique "trou noir"
/dev/random         # Générateur aléatoire
/dev/loop0          # Périphériques loop (montage d'images)
```

## Ressources

- Source : [[Certif Linux - 101.1 Détermination et configuration des paramètres du matériel]]
- Documentation : `man proc`, `man sysfs`
- Wiki Arch Linux : https://wiki.archlinux.org/title/Sysfs

---

**Tags thématiques** : `#linux` `#kernel` `#système` `#virtualfs` `#proc` `#sys` `#dev`
