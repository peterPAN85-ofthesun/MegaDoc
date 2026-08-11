---
type: permanent
created: 2026-08-11 00:00
tags:
  - permanent
  - linux
  - arch
  - sddm
  - kde
  - wayland
---

# SDDM - Autologin sous Wayland

> [!abstract] Concept
> Configurer SDDM pour ouvrir automatiquement une session au démarrage, nécessaire quand un service comme Sunshine doit capturer un compositeur Wayland actif — chose impossible tant que personne n'est connecté.

## Explication

Sous KDE Plasma en **Wayland**, un service de streaming d'écran (ex: Sunshine) ne peut pas démarrer « avant » la session utilisateur : il a besoin d'un compositeur `kwin_wayland` actif pour capturer l'affichage. Tant que personne n'est loggé, seul le greeter SDDM tourne sous l'utilisateur système `sddm`, qui n'expose aucun bureau capturable. Le *lingering* systemd (garder les services utilisateur actifs sans session ouverte) ne crée pas non plus de session graphique.

La seule solution est donc l'**autologin** : SDDM ouvre directement la session au boot, ce qui démarre le compositeur Wayland, qui permet ensuite à Sunshine (lancé via l'autostart KDE de la session) de capturer l'écran.

Configuration via un fichier dédié dans `/etc/sddm.conf.d/` plutôt que dans `kde_settings.conf` (que KDE réécrit et qui ne doit pas être modifié à la main). Le préfixe `zz-` sur le nom de fichier garantit qu'il est lu **après** les autres fichiers de conf (ordre alphabétique), donc qu'il a priorité.

## Exemples

`/etc/sddm.conf.d/zz-autologin.conf` :
```ini
[Autologin]
User=gregoire
Session=plasma.desktop
Relogin=false
```

- `Session=plasma.desktop` : session Plasma **Wayland** (fichier dans `/usr/share/wayland-sessions/`)
- `Relogin=false` : autologin **au boot uniquement**. Une déconnexion manuelle ramène au greeter normal. (`true` reconnecterait aussi après chaque logout, rendant le greeter quasi inatteignable.)

Tester la config :
```bash
sudo systemctl restart sddm   # coupe la session locale immédiatement
```

## Cas d'usage

- Réveil à distance (Wake-on-LAN) suivi d'une connexion via Sunshine/Moonlight sans intervention physique
- Tout service nécessitant un compositeur Wayland actif dès le démarrage machine, sans utilisateur physiquement présent

## Connexions

### Notes liées
- [[Systemd - Alias de service utilisateur nécessite enable]] - Sunshine, le service capturé après autologin, dépend de ce mécanisme pour son autostart

### Contexte
SDDM ne distingue pas un boot déclenché par Wake-on-LAN d'un démarrage normal : l'autologin se déclenche à chaque démarrage, sans conditionnement possible au niveau SDDM. Point de vigilance : si KWallet est chiffré avec le mot de passe de session, il ne se déverrouille pas automatiquement en autologin.

## Sources
- Configuration personnelle Arch Linux / KDE Plasma Wayland (2026-06-16)

---
**Tags thématiques** : #linux #sddm #kde #wayland #autologin
