# Fix — Sunshine ne démarrait pas à l'ouverture de session KDE

Date : 2026-06-16

## Symptôme
À l'ouverture de session KDE, le service échouait en boucle :
```
app-dev.lizardbyte.app.Sunshine@autostart.service: Failed with result 'exit-code'
Failed to start sunshine.service: Unit sunshine.service not found
status=5/NOTINSTALLED
... Start request repeated too quickly (start-limit-hit)
```

## Cause
- Sunshine est installé **nativement** (paquet pacman `sunshine`, binaire `/usr/bin/sunshine`).
- Le fichier service `/usr/lib/systemd/user/app-dev.lizardbyte.app.Sunshine.service` définit `Alias=sunshine.service`.
- **L'alias `sunshine.service` n'est créé que si le service est `enable`.**
- Le service était `disabled`. Le fichier d'autostart KDE
  `~/.config/autostart/dev.lizardbyte.app.Sunshine.desktop` exécute
  `systemctl start --u sunshine` → cherche `sunshine.service` → introuvable (alias absent).

## Solution
Activer + démarrer le service utilisateur systemd directement :
```bash
systemctl --user enable --now app-dev.lizardbyte.app.Sunshine.service
```
Cela a :
- créé l'alias `~/.config/systemd/user/sunshine.service` → unité réelle ;
- rattaché le service à `graphical-session.target.wants` (autostart à chaque session) ;
- démarré Sunshine immédiatement (NVENC HEVC détecté, system tray OK).

## Notes
- Le fichier d'autostart `.desktop` reste présent mais est désormais inoffensif :
  l'alias `sunshine.service` existe, donc son `systemctl start` réussit (no-op,
  le service est déjà lancé par `graphical-session.target`).
- Pour le supprimer si on veut éviter la redondance :
  `rm ~/.config/autostart/dev.lizardbyte.app.Sunshine.desktop`
