---
type: permanent
created: 2025-11-11 14:30
tags:
  - permanent
  - linux
  - système
  - matériel
---

# udev - Détection dynamique périphériques

> [!abstract] Concept
> Gestionnaire de périphériques Linux qui détecte automatiquement le matériel (connexion à chaud et à froid) et crée dynamiquement les entrées dans /dev.

## Explication

`udev` (userspace /dev) est le système moderne de gestion des périphériques sous Linux. Il fonctionne en espace utilisateur (userspace) et est responsable de la détection automatique du matériel, du chargement des modules kernel appropriés, et de la création des fichiers de périphériques dans `/dev`. Contrairement aux anciens systèmes où `/dev` contenait des milliers de fichiers statiques pour tous les périphériques possibles, udev crée dynamiquement uniquement les fichiers nécessaires.

Lorsqu'un périphérique est connecté (à chaud comme une clé USB, ou à froid au démarrage), le kernel détecte l'événement et envoie un message à udev via le pseudo-système de fichiers `/sys`. udev consulte alors ses règles de configuration (dans `/etc/udev/rules.d/` et `/lib/udev/rules.d/`) pour déterminer comment gérer ce périphérique : quel nom lui donner, quelles permissions appliquer, quels scripts exécuter, etc.

Ce système est fondamental dans Linux moderne car il permet le "plug and play" : branchez une webcam USB, udev détecte l'événement, charge le module `uvcvideo`, crée `/dev/video0`, et votre application peut immédiatement utiliser la caméra. udev permet également de créer des noms de périphériques persistants basés sur les propriétés matérielles plutôt que sur l'ordre de détection.

## Exemples

### Exemple 1 : udev en action lors de la connexion d'une clé USB
```bash
# Avant connexion
ls /dev/sd*
/dev/sda  /dev/sda1

# Connexion de la clé USB
# udev détecte l'événement, charge usb-storage, crée /dev/sdb

# Après connexion
ls /dev/sd*
/dev/sda  /dev/sda1  /dev/sdb  /dev/sdb1
```

### Exemple 2 : Surveiller les événements udev en temps réel
```bash
sudo udevadm monitor
```
Affiche tous les événements udev lorsque vous branchez/débranchez des périphériques.

### Exemple 3 : Obtenir les informations d'un périphérique
```bash
udevadm info /dev/sda
```
Affiche toutes les propriétés udev du disque : ID, numéro de série, fabricant, etc.

## Cas d'usage

- **Détection automatique** : Brancher une imprimante USB et la voir apparaître automatiquement dans les applications
- **Noms persistants** : Créer des règles udev pour qu'un disque dur ait toujours le même nom (ex: `/dev/backup-disk`) indépendamment du port USB utilisé
- **Automatisation** : Déclencher un script automatiquement lors de la connexion d'un périphérique spécifique (ex: backup automatique quand un disque est branché)
- **Gestion des permissions** : Définir que tous les utilisateurs du groupe "audio" peuvent accéder aux périphériques audio sans être root
- **Résolution de problèmes** : Diagnostiquer pourquoi un périphérique n'est pas détecté en surveillant les événements udev

## Avantages et inconvénients

✅ **Avantages** :
- Détection automatique du matériel (hot-plug et cold-plug)
- Gestion dynamique de /dev (uniquement les périphériques présents)
- Noms de périphériques persistants et prévisibles
- Personnalisation via des règles flexibles
- Permet l'exécution de scripts lors d'événements matériels
- Gestion moderne et standard sur toutes les distributions Linux

❌ **Inconvénients** / Limites :
- Syntaxe des règles udev peut être complexe pour les débutants
- Débogage parfois difficile (pourquoi une règle ne s'applique pas ?)
- Dépend de la qualité des informations dans /sys
- Règles mal écrites peuvent causer des problèmes de performance ou de sécurité
- Nécessite une compréhension de /sys et du modèle de périphériques Linux

## Connexions

### Notes liées
- [[LINUX - pseudo-systèmes fichiers]] - udev s'appuie sur /sys pour détecter les périphériques
- [[LINUX : [lsusb] - lister périphériques USB]] - Les périphériques USB sont gérés par udev
- [[LINUX : [lspci] - lister périphériques PCI]] - Les périphériques PCI sont également gérés par udev
- [[LINUX : [modprobe] - charger ou décharger module noyau]] - udev utilise modprobe pour charger automatiquement les modules nécessaires

### Dans le contexte de
- [[MOC - Linux Administration]] - Composant essentiel de l'administration système moderne
- [[LINUX : [lsmod] - lister les modules noyau chargés]] - udev charge automatiquement les modules via modprobe

## Commandes / Syntaxe

```bash
# Surveiller les événements udev en temps réel
sudo udevadm monitor

# Afficher les informations d'un périphérique
udevadm info /dev/sda
udevadm info /sys/class/net/eth0

# Lister toutes les propriétés d'un périphérique (utile pour écrire des règles)
udevadm info -a /dev/sda

# Tester une règle udev
udevadm test /sys/class/net/eth0

# Recharger les règles udev (après modification)
sudo udevadm control --reload-rules

# Forcer la réapplication des règles sur les périphériques existants
sudo udevadm trigger

# Vérifier la syntaxe et déboguer
udevadm test /sys/devices/...
```

## Configuration

### Répertoires de règles
- `/lib/udev/rules.d/` : Règles par défaut du système
- `/etc/udev/rules.d/` : Règles personnalisées (prioritaires)

### Exemple de règle personnalisée
`/etc/udev/rules.d/99-backup-disk.rules`
```bash
# Créer un lien symbolique persistant pour un disque de backup
SUBSYSTEM=="block", ATTRS{serial}=="57442D314135305A35353431353", SYMLINK+="backup-disk"

# Exécuter un script lors de la connexion d'un périphérique spécifique
ACTION=="add", SUBSYSTEM=="usb", ATTRS{idVendor}=="0781", ATTRS{idProduct}=="5567", RUN+="/usr/local/bin/backup.sh"
```

## Ressources

- Source : [[Certif Linux - 101.1 Détermination et configuration des paramètres du matériel]]
- Documentation : `man udev`, `man udevadm`
- Guide : https://www.reactivated.net/writing_udev_rules.html

---

**Tags thématiques** : `#linux` `#udev` `#périphériques` `#hotplug` `#administration`
