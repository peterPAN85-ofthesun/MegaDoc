# Configuration Oculus Rift CV1 sur Linux (KDE Plasma Wayland)

> ✅ **Fonctionnel** — SteamVR détecte le Rift CV1 via steamvr-openhmd (2026-02-25)

## Contexte

- **OS** : Arch Linux, KDE Plasma en mode Wayland (kwin_wayland)
- **Casque** : Oculus Rift CV1
- **Problème de départ** : Wayland bloque SteamVR, le casque n'est pas détecté

---

## Diagnostic effectué

### 1. Le casque est bien reconnu en USB
```bash
lsusb | grep -i oculus
# Bus 001 Device 013: ID 2833:2031 Oculus VR, Inc. Rift CV1
# Bus 001 Device 014: ID 2833:0031 Oculus VR, Inc. Rift CV1
# Bus 002 Device 006: ID 2833:0211 Oculus VR, Inc. Rift CV1 Sensor
```
Les règles udev étaient déjà en place : `/etc/udev/rules.d/83-oculus.rules`

### 2. SteamVR n'a pas de driver Oculus pour Linux
Les logs (`~/.steam/steam/logs/vrserver.txt`) révèlent :
```
Unable to load driver oculus → VRInitError_Init_FileNotFound
Unable to load driver oculus_legacy → VRInitError_Init_FileNotFound
```
**Cause** : Meta/Oculus n'a jamais fourni de driver Linux pour SteamVR.

### 3. XWayland tourne sur le display `:1`
```bash
ps aux | grep kwin_wayland
# --xwayland-display :1
```
SteamVR doit utiliser ce display X11 au lieu de Wayland.

---

## Architecture de la solution

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

---

## Paquets installés

| Paquet | Source | Rôle |
|---|---|---|
| `openhmd-git` | AUR (remplace `openhmd`) | Pilote bas niveau pour le Rift CV1 |
| `steamvr-openhmd-git` | AUR | Driver SteamVR utilisant OpenHMD |
| `patchelf` | pacman | Correction du RPATH du driver |

### Note sur l'installation de `steamvr-openhmd-git`
Le PKGBUILD nécessite un correctif CMake (CMake trop récent) :
```bash
# Dans ~/.cache/yay/steamvr-openhmd-git/PKGBUILD, modifier la ligne cmake :
cmake -DCMAKE_POLICY_VERSION_MINIMUM=3.5 -DCMAKE_INSTALL_PREFIX=/usr/ ...
# Puis compiler manuellement :
cd ~/.cache/yay/steamvr-openhmd-git && makepkg -si
```

Conflit à résoudre avant installation :
```bash
sudo pacman -R openhmd-debug
```

---

## Étapes de configuration

### 1. Enregistrer le driver avec SteamVR

> **Important** : SteamVR tourne dans un container (Steam Runtime) qui n'a pas accès à `/usr/lib/`.
> Il faut **copier** le driver dans le home (un symlink ne suffit pas).

```bash
# Copier le driver dans un chemin accessible au container Steam
cp -r /usr/lib/steamvr/openhmd ~/.local/share/steamvr-openhmd

# Copier aussi la bibliothèque manquante libhidapi
cp /usr/lib/libhidapi-libusb.so.0 ~/.local/share/steamvr-openhmd/bin/linux64/
cp /usr/lib/libhidapi-libusb.so.0.15.0 ~/.local/share/steamvr-openhmd/bin/linux64/

# Patcher le RPATH pour que le driver trouve la lib dans son propre dossier
patchelf --set-rpath '$ORIGIN' ~/.local/share/steamvr-openhmd/bin/linux64/driver_openhmd.so

# Enregistrer le driver auprès de SteamVR
~/.local/share/Steam/steamapps/common/SteamVR/bin/linux64/vrpathreg adddriver \
  ~/.local/share/steamvr-openhmd
```

### 2. Script de lancement VR

Fichier : `~/.local/bin/steam-vr.sh`

```bash
#!/bin/bash
# Lance Steam sur XWayland pour le VR
export DISPLAY=:1        # XWayland
export WAYLAND_DISPLAY=  # Désactiver Wayland

steam "$@"
```

```bash
chmod +x ~/.local/bin/steam-vr.sh
```

### 3. Raccourci de bureau

Fichier : `~/.local/share/applications/steam-vr.desktop`

```ini
[Desktop Entry]
Name=Steam VR
Exec=/home/gregoire/.local/bin/steam-vr.sh
Icon=steam
Type=Application
```

### 4. Fichier openvrpaths.vrpath

`~/.config/openvr/openvrpaths.vrpath` — enregistrement automatique via `vrpathreg` :
```json
{
    "external_drivers": ["/home/gregoire/.local/share/steamvr-openhmd"],
    ...
}
```

---

## Debugging : erreurs rencontrées et solutions

| Erreur | Cause | Solution |
|---|---|---|
| `epoll_ctl(stdin) failed` | monado-service lancé hors systemd | Utiliser `systemctl --user start monado` |
| `driver_oculus.so not found` | Pas de driver Oculus Linux dans SteamVR | Utiliser steamvr-openhmd à la place |
| `Skipping external driver … not a directory` | Steam Runtime ne voit pas `/usr/lib/` | Copier le driver dans `~/.local/share/` |
| `libhidapi-libusb.so.0: cannot open` | Lib absente du container Steam | Copier la lib + patchelf `$ORIGIN` |
| `cmake_minimum_required` à la compilation | CMake trop récent | Ajouter `-DCMAKE_POLICY_VERSION_MINIMUM=3.5` |

---

## Fichiers importants

| Fichier | Rôle |
|---|---|
| `~/.local/share/steamvr-openhmd/` | Driver openhmd (copie locale pour le container Steam) |
| `~/.config/openvr/openvrpaths.vrpath` | Drivers externes enregistrés auprès de SteamVR |
| `~/.steam/steam/logs/vrserver.txt` | Logs SteamVR (diagnostic) |
| `~/.local/bin/steam-vr.sh` | Script de lancement VR |
| `/etc/udev/rules.d/83-oculus.rules` | Permissions USB pour le Rift CV1 |

---

## Utilisation

```bash
~/.local/bin/steam-vr.sh
```

Puis lancer SteamVR depuis Steam.

---

## Références

- [ArchWiki - Virtual Reality](https://wiki.archlinux.org/title/Virtual_reality)
- steamvr-openhmd-git : [github.com/ChristophHaag/SteamVR-OpenHMD](https://github.com/ChristophHaag/SteamVR-OpenHMD)
- Logs SteamVR : `~/.steam/steam/logs/vrserver.txt`
