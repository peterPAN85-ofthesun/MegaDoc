---
date: 2026-06-16
tags: [arch, sddm, kde, autologin, wake-on-lan, sunshine]
---

# Autologin SDDM sur la session gregoire

## Objectif
Réveil Wake-on-LAN (configuré via NetworkManager) → ouverture automatique de la
session `gregoire` sans mot de passe, pour ensuite se connecter à distance via
**Sunshine/Moonlight** (Sunshine démarre via l'autostart KDE de la session).

## Point technique important (Wayland)
On ne peut **pas** lancer Sunshine « avant » la session : sous Plasma Wayland,
Sunshine capture un compositeur `kwin_wayland` actif. Tant que personne n'est
loggé, il n'y a pas de bureau à capturer (seul le greeter SDDM tourne, sous
l'utilisateur `sddm`, non capturable proprement). Le lingering systemd ne crée
aucune session graphique. → La solution est donc l'**autologin**, puis Sunshine
démarre avec la session.

## Ce qui a été fait
Création de `/etc/sddm.conf.d/zz-autologin.conf` :

```ini
[Autologin]
User=gregoire
Session=plasma.desktop
Relogin=false
```

- Fichier dédié (pas `kde_settings.conf` que KDE réécrit). Nommé `zz-…` pour
  passer **après** `kde_settings.conf` dans l'ordre alphabétique → priorité.
- `Session=plasma.desktop` = Plasma Wayland (`/usr/share/wayland-sessions/`).
- `Relogin=false` = autologin **au boot uniquement**. Après une déconnexion
  manuelle → on retombe sur l'écran de login normal. (`true` reconnecterait
  aussi après chaque logout = quasi impossible d'atteindre le greeter.)

## Comportement
- Autologin se déclenche à **chaque démarrage** (bouton power ou WoL) : SDDM ne
  distingue pas l'origine de l'allumage, un réveil WoL = un boot normal.
- Pas de conditionnement « uniquement si WoL » possible au niveau SDDM.

## Tester
```bash
sudo systemctl restart sddm   # ⚠️ coupe la session locale immédiatement
```
ou simplement rebooter.

## À surveiller
- **KWallet** : s'il est chiffré avec le mot de passe de session, il ne se
  déverrouille pas en autologin (demande le mdp au 1er accès). À basculer en
  mot de passe vide / désactiver si Sunshine ou autre en dépend.
- **VR (DISPLAY=:1 XWayland)** : indépendant, rien à changer.
