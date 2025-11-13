---
type: permanent
created: 2025-11-11 14:30
tags:
  - permanent
  - linux
  - kernel
  - modules
---

# LINUX : [lsmod] - lister les modules noyau chargés

> [!abstract] Concept
> Commande pour afficher la liste de tous les modules du noyau Linux actuellement chargés en mémoire.

## Explication
La commande `lsmod` affiche tous les modules kernel chargés dans le système. Elle lit le contenu de `/proc/modules` et le présente sous forme de tableau avec trois colonnes : le nom du module, sa taille en mémoire, et le nombre de processus qui l'utilisent (avec les dépendances).

Cette commande est essentielle pour diagnostiquer les problèmes matériels, vérifier qu'un driver est bien chargé, ou comprendre quels composants du noyau sont actifs.

## Exemples

```bash
# Lister tous les modules chargés
lsmod

# Chercher un module spécifique
lsmod | grep nvidia

# Compter le nombre de modules chargés
lsmod | wc -l
```

Sortie typique :
```
Module                  Size  Used by
nvidia              12345678  42
e1000                  54321  0
usb_storage            23456  1
```

## Connexions
### Notes liées
- [[LINUX : [modinfo] - afficher informations module]]
- [[LINUX : [modprobe] - charger ou décharger module noyau]]
- [[LINUX : _proc_ - système de fichiers virtuel processus]]

### Contexte
Cette note fait partie de la gestion des modules kernel Linux. Comprendre `lsmod` est fondamental pour administrer le matériel et déboguer les problèmes de drivers.

## Sources
- man lsmod
- Documentation kernel Linux

---
**Tags thématiques** : #linux #kernel #administration
