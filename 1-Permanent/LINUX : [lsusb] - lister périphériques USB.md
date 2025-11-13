---
type: permanent
created: 2025-11-11 14:33
tags:
  - permanent
  - linux
  - hardware
  - usb
---

# LINUX : [lsusb] - lister périphériques USB

> [!abstract] Concept
> Commande pour afficher tous les périphériques connectés aux ports USB (clés, souris, claviers, webcams, etc.).

## Explication
La commande `lsusb` interroge le bus USB du système et liste tous les périphériques USB connectés. Elle affiche les informations sur chaque device avec son identifiant vendor:product, facilitant l'identification du matériel et la recherche de drivers compatibles.

Cette commande est cruciale pour vérifier qu'un périphérique USB est bien détecté par le système, diagnostiquer des problèmes de connexion, ou identifier précisément un device pour configuration.

## Exemples

```bash
# Lister tous les périphériques USB
lsusb

# Affichage verbeux détaillé
lsusb -v

# Afficher l'arborescence USB (topology)
lsusb -t

# Informations détaillées sur un device spécifique
lsusb -d 046d:c52b -v
```

Sortie typique :
```
Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 001 Device 003: ID 046d:c52b Logitech, Inc. Unifying Receiver
Bus 001 Device 002: ID 8087:0025 Intel Corp. Wireless-AC 9260
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
```

## Connexions
### Notes liées
- [[LINUX : [lspci] - lister périphériques PCI]]
- [[LINUX : [lsmod] - lister les modules noyau chargés]]
- [[LINUX : _sys_ - système de fichiers virtuel kernel]]

### Contexte
Cette note est essentielle pour diagnostiquer les périphériques USB et vérifier leur détection. Elle fait partie des outils de diagnostic hardware Linux.

## Sources
- man lsusb
- Documentation usbutils

---
**Tags thématiques** : #linux #hardware #usb #diagnostic
