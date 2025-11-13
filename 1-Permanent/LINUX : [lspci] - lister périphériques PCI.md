---
type: permanent
created: 2025-11-11 14:32
tags:
  - permanent
  - linux
  - hardware
  - pci
---

# LINUX : [lspci] - lister périphériques PCI

> [!abstract] Concept
> Commande pour afficher tous les périphériques connectés au bus PCI (cartes graphiques, réseau, contrôleurs, etc.).

## Explication
La commande `lspci` interroge le bus PCI du système et liste tous les périphériques connectés. Elle affiche les informations sur les cartes d'extension, contrôleurs intégrés, et autres composants matériels utilisant le bus PCI/PCIe.

Cette commande est indispensable pour identifier le matériel présent, vérifier qu'un périphérique est détecté, ou trouver les identifiants vendor/device nécessaires pour installer les bons drivers.

## Exemples

```bash
# Lister tous les périphériques PCI
lspci

# Affichage détaillé verbeux
lspci -v

# Affichage très détaillé avec addresses mémoire
lspci -vv

# Afficher les identifiants numériques (vendor:device)
lspci -nn

# Filtrer par type (ex: Ethernet)
lspci | grep Ethernet
```

Sortie typique :
```
00:00.0 Host bridge: Intel Corporation Device 9b33
00:02.0 VGA compatible controller: Intel Corporation UHD Graphics
00:14.0 USB controller: Intel Corporation Device 06ed
01:00.0 Ethernet controller: Realtek Semiconductor RTL8111/8168/8411
```

## Connexions
### Notes liées
- [[LINUX : [lsusb] - lister périphériques USB]]
- [[LINUX : [lsmod] - lister les modules noyau chargés]]
- [[LINUX : _sys_ - système de fichiers virtuel kernel]]

### Contexte
Cette note est essentielle pour diagnostiquer le matériel et vérifier la détection des périphériques. Elle s'inscrit dans la gestion hardware Linux.

## Sources
- man lspci
- Documentation pciutils

---
**Tags thématiques** : #linux #hardware #diagnostic
