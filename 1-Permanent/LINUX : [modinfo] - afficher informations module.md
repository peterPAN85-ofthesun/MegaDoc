---
type: permanent
created: 2025-11-11 14:34
tags:
  - permanent
  - linux
  - kernel
  - modules
---

# LINUX : [modinfo] - afficher informations module

> [!abstract] Concept
> Commande pour afficher les informations détaillées d'un module kernel : description, auteur, paramètres, dépendances, etc.

## Explication
La commande `modinfo` interroge un module du noyau Linux (chargé ou non) et affiche ses métadonnées complètes. Elle révèle la description du module, son auteur, sa licence, les paramètres configurables, les dépendances vers d'autres modules, et le chemin du fichier .ko.

Cette commande est précieuse pour comprendre ce que fait un module, identifier ses options de configuration, ou vérifier sa compatibilité avant de le charger.

## Exemples

```bash
# Afficher les infos d'un module
modinfo e1000

# Voir uniquement la description
modinfo -d nvidia

# Afficher les paramètres disponibles
modinfo -p iwlwifi

# Lister les dépendances
modinfo -F depends usb_storage
```

Sortie typique :
```
filename:       /lib/modules/6.17.7/kernel/drivers/net/ethernet/intel/e1000/e1000.ko
version:        7.3.21-k8-NAPI
license:        GPL v2
description:    Intel(R) PRO/1000 Network Driver
author:         Intel Corporation
depends:
parm:           debug:Debug level (0=none,...,16=all) (int)
```

## Connexions
### Notes liées
- [[LINUX : [lsmod] - lister les modules noyau chargés]]
- [[LINUX : [modprobe] - charger ou décharger module noyau]]
- [[LINUX : _sys_ - système de fichiers virtuel kernel]]

### Contexte
Cette note est fondamentale pour comprendre et configurer les modules kernel. Elle aide à diagnostiquer les problèmes de drivers et à optimiser la configuration système.

## Sources
- man modinfo
- Documentation kernel Linux

---
**Tags thématiques** : #linux #kernel #modules #diagnostic
