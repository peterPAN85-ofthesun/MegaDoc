---
type: permanent
created: 2026-08-11 00:00
tags:
  - permanent
  - linux
  - steamvr
  - vr
  - steam
---

# SteamVR - Drivers externes et Steam Runtime container

> [!abstract] Concept
> SteamVR tourne dans un conteneur Steam Runtime qui n'a pas accès à `/usr/lib/` : un driver externe installé au niveau système doit être copié dans le home de l'utilisateur (jamais lié par symlink) pour être visible par SteamVR.

## Explication

Steam (et donc SteamVR) exécute ses processus dans un environnement **Steam Runtime**, une forme de conteneurisation qui isole l'application du système hôte pour garantir la compatibilité des dépendances. Cette isolation a une conséquence directe pour les drivers VR tiers (ex: drivers OpenHMD pour casques non supportés officiellement) : un chemin comme `/usr/lib/steamvr/mondriver` installé par le gestionnaire de paquets du système **n'est pas visible** depuis l'intérieur du conteneur.

Un **symlink** ne suffit pas à contourner cette isolation — le conteneur ne résout pas les liens vers l'extérieur de son périmètre. Il faut **copier physiquement** le driver dans un chemin du home utilisateur (`~/.local/share/`), que SteamVR sait lire, puis l'enregistrer explicitement auprès de SteamVR avec l'outil `vrpathreg`.

Un problème dérivé fréquent : le driver copié peut référencer des bibliothèques partagées (`.so`) qui ne sont pas incluses dans la copie et absentes du conteneur Steam Runtime. Il faut alors copier également ces bibliothèques manquantes à côté du driver, et corriger le chemin de recherche des bibliothèques (`RPATH`) du binaire du driver avec `patchelf` pour qu'il les trouve dans son propre dossier plutôt que dans `/usr/lib/`.

## Exemples

```bash
# Copier le driver dans un chemin accessible au container Steam
cp -r /usr/lib/steamvr/openhmd ~/.local/share/steamvr-openhmd

# Copier une bibliothèque manquante référencée par le driver
cp /usr/lib/libhidapi-libusb.so.0 ~/.local/share/steamvr-openhmd/bin/linux64/

# Patcher le RPATH pour que le driver cherche ses libs dans son propre dossier
patchelf --set-rpath '$ORIGIN' ~/.local/share/steamvr-openhmd/bin/linux64/driver_openhmd.so

# Enregistrer le driver auprès de SteamVR
~/.local/share/Steam/steamapps/common/SteamVR/bin/linux64/vrpathreg adddriver \
  ~/.local/share/steamvr-openhmd
```

Erreurs typiques révélatrices de ce problème :
| Erreur | Cause |
|---|---|
| `Skipping external driver … not a directory` | Steam Runtime ne voit pas `/usr/lib/` |
| `libhidapi-libusb.so.0: cannot open` | Lib manquante dans le conteneur, RPATH à corriger |

## Cas d'usage

- Installation de tout driver SteamVR tiers non packagé officiellement (OpenHMD, drivers communautaires)
- Diagnostic d'un driver VR « invisible » alors qu'il est bien installé au niveau système
- Plus généralement : comprendre pourquoi une application dans le Steam Runtime ne voit pas des fichiers système pourtant présents

## Connexions

### Notes liées
- [[Oculus Rift CV1 sous Linux - SteamVR via OpenHMD]] - Application concrète de ce mécanisme

### Contexte
Ce piège de conteneurisation revient pour tout driver VR tiers sous Linux, pas seulement OpenHMD — utile à retenir dès qu'un nouveau périphérique VR non supporté officiellement doit être intégré à SteamVR.

## Sources
- [[Oculus Rift CV1 sous Linux - SteamVR via OpenHMD]]
- [ArchWiki - Virtual Reality](https://wiki.archlinux.org/title/Virtual_reality)

---
**Tags thématiques** : #linux #steamvr #vr #steam-runtime
