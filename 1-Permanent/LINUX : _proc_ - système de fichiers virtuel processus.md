---
type: permanent
created: 2025-11-11 15:20
tags:
  - permanent
  - linux
  - filesystem
  - kernel
---

# LINUX : _proc_ - système de fichiers virtuel processus

> [!abstract] Concept
> Système de fichiers virtuel qui expose les informations du kernel et des processus sous forme de fichiers et répertoires.

## Explication
Le répertoire `/proc/` est un pseudo-système de fichiers (procfs) qui n'existe qu'en mémoire. Il fournit une interface pour lire et modifier les informations du kernel en temps réel. Chaque processus a un sous-répertoire `/proc/[PID]/` contenant ses informations (mémoire, fichiers ouverts, état, etc.). Les fichiers à la racine de `/proc/` donnent accès aux stats globales du système.

Ce n'est pas un vrai système de fichiers sur disque : les "fichiers" sont générés dynamiquement par le kernel quand on les lit. C'est l'interface principale pour interroger l'état du système Linux.

## Exemples

```bash
# Informations CPU
cat /proc/cpuinfo

# Mémoire système
cat /proc/meminfo

# Modules chargés (utilisé par lsmod)
cat /proc/modules

# État d'un processus spécifique
cat /proc/1234/status
cat /proc/1234/cmdline

# Fichiers ouverts par un processus
ls -l /proc/1234/fd/

# Modifier paramètre kernel (sysctl)
echo 1 > /proc/sys/net/ipv4/ip_forward
```

Fichiers importants :
- `/proc/cpuinfo` : informations processeur
- `/proc/meminfo` : statistiques mémoire
- `/proc/[PID]/` : infos sur le processus PID
- `/proc/sys/` : paramètres kernel modifiables

## Connexions
### Notes liées
- [[LINUX : _sys_ - système de fichiers virtuel kernel]]
- [[LINUX : [lsmod] - lister les modules noyau chargés]]

### Contexte
Cette note est fondamentale pour comprendre comment Linux expose l'état du système. `/proc/` est utilisé par la majorité des outils de diagnostic et monitoring.

## Sources
- man proc
- Documentation kernel Linux

---
**Tags thématiques** : #linux #filesystem #kernel #processus
