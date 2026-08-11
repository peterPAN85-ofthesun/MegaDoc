---
type: permanent
created: 2026-08-11 00:00
tags:
  - permanent
  - linux
  - vr
  - steamvr
  - openhmd
  - oculus
---

# Oculus Rift CV1 sous Linux - SteamVR via OpenHMD

> [!abstract] Concept
> Meta/Oculus ne fournissant aucun driver Linux officiel pour le Rift CV1, SteamVR peut néanmoins le piloter via le driver communautaire OpenHMD, à condition de contourner l'isolation du Steam Runtime et de rediriger l'affichage vers XWayland.

## Explication

Sous KDE Plasma en Wayland, deux obstacles distincts empêchent SteamVR de fonctionner nativement avec un Oculus Rift CV1 :

1. **Absence de driver officiel** : les logs SteamVR (`~/.steam/steam/logs/vrserver.txt`) montrent `Unable to load driver oculus → VRInitError_Init_FileNotFound` — Meta n'a jamais publié de driver Linux. La solution est le driver communautaire **OpenHMD**, un pilote bas niveau générique pour casques VR, exposé à SteamVR via le plugin `steamvr-openhmd`.
2. **SteamVR ne fonctionne pas nativement sous Wayland** : il doit s'exécuter sur **XWayland**, la couche de compatibilité X11 que `kwin_wayland` expose sur un display séparé (ex: `:1`).

L'installation du driver se heurte en plus au problème d'isolation du [[SteamVR - Drivers externes et Steam Runtime container|Steam Runtime container]] : le driver doit être copié dans le home utilisateur et enregistré manuellement, pas simplement installé au niveau système.

## Exemples

Architecture de la chaîne complète :
```
Oculus Rift CV1 (USB + HDMI)
        ↓
   openhmd-git (pilote bas niveau)
        ↓
  driver_openhmd.so (steamvr-openhmd-git)
        ↓
      SteamVR (sur XWayland :1)
        ↓
    Jeu VR (via Proton)
```

Paquets nécessaires (AUR) :
| Paquet | Rôle |
|---|---|
| `openhmd-git` | Pilote bas niveau pour le Rift CV1 |
| `steamvr-openhmd-git` | Driver SteamVR utilisant OpenHMD |
| `patchelf` | Correction du RPATH du driver après copie |

Script de lancement forçant XWayland (`~/.local/bin/steam-vr.sh`) :
```bash
#!/bin/bash
export DISPLAY=:1        # XWayland
export WAYLAND_DISPLAY=  # Désactiver Wayland
steam "$@"
```

Erreurs rencontrées et solutions :
| Erreur | Cause | Solution |
|---|---|---|
| `epoll_ctl(stdin) failed` | monado-service lancé hors systemd | `systemctl --user start monado` |
| `driver_oculus.so not found` | Pas de driver Oculus Linux dans SteamVR | Utiliser steamvr-openhmd |
| `cmake_minimum_required` à la compilation | CMake trop récent pour le PKGBUILD | Ajouter `-DCMAKE_POLICY_VERSION_MINIMUM=3.5` |

## Cas d'usage

- Faire fonctionner un Rift CV1 (matériel abandonné par Meta côté Linux) sur une distribution Arch/KDE Wayland moderne
- Modèle applicable à d'autres casques VR sans driver Linux officiel supportés par OpenHMD

## Connexions

### Notes liées
- [[SteamVR - Drivers externes et Steam Runtime container]] - Mécanisme général de contournement de l'isolation Steam Runtime, appliqué ici

### Contexte
Configuration fonctionnelle validée le 2026-02-25 : SteamVR détecte correctement le Rift CV1 via steamvr-openhmd.

## Sources
- [ArchWiki - Virtual Reality](https://wiki.archlinux.org/title/Virtual_reality)
- steamvr-openhmd-git : [github.com/ChristophHaag/SteamVR-OpenHMD](https://github.com/ChristophHaag/SteamVR-OpenHMD)

---
**Tags thématiques** : #linux #vr #steamvr #openhmd #oculus #wayland
