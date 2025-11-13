---
type: permanent
created: 2025-11-11 14:35
tags:
  - permanent
  - linux
  - kernel
  - modules
---

# LINUX : [modprobe] - charger ou décharger module noyau

> [!abstract] Concept
> Commande pour charger ou décharger un module kernel de manière intelligente, en gérant automatiquement les dépendances.

## Explication
La commande `modprobe` permet de charger ou retirer des modules du noyau Linux. Contrairement à `insmod`, elle gère automatiquement les dépendances : si un module nécessite d'autres modules, `modprobe` les charge dans le bon ordre. Elle utilise la configuration dans `/etc/modprobe.d/` pour appliquer les options et blacklists.

Cette commande est l'outil standard pour gérer les modules kernel, que ce soit pour activer un driver matériel, tester une fonctionnalité, ou résoudre des conflits.

## Exemples

```bash
# Charger un module
sudo modprobe e1000

# Charger un module avec paramètres
sudo modprobe iwlwifi debug=0x43fff

# Décharger un module
sudo modprobe -r nvidia

# Simuler le chargement (dry-run)
modprobe -n --verbose e1000

# Lister les dépendances qui seraient chargées
modprobe --show-depends usb_storage
```

Configuration dans `/etc/modprobe.d/` :
```bash
# Blacklist un module
blacklist nouveau

# Options par défaut
options snd-hda-intel model=auto
```

## Connexions
### Notes liées
- [[LINUX : [lsmod] - lister les modules noyau chargés]]
- [[LINUX : [modinfo] - afficher informations module]]
- [[LINUX : _sys_ - système de fichiers virtuel kernel]]

### Contexte
Cette note est essentielle pour la gestion dynamique du kernel Linux. Elle permet d'activer/désactiver des fonctionnalités sans recompiler ou redémarrer le système.

## Sources
- man modprobe
- man modprobe.d
- Documentation kernel Linux

---
**Tags thématiques** : #linux #kernel #modules #administration
