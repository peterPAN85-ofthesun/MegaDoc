---
type: permanent
created: 2026-08-11 00:00
tags:
  - permanent
  - linux
  - systemd
  - kde
---

# Systemd - Alias de service utilisateur nécessite enable

> [!abstract] Concept
> Un alias défini par `Alias=` dans un fichier `.service` systemd n'est créé sur le disque (symlink) que lorsque le service est `enable`. Un service `disabled` ne répond donc pas au nom de son alias, même s'il existe et démarre correctement sous son nom réel.

## Explication

Dans une unité systemd, la directive `Alias=` (section `[Install]`) permet de démarrer/arrêter le service sous un nom alternatif. Mais ce mécanisme repose sur un **symlink physique** créé dans `~/.config/systemd/user/` (ou `/etc/systemd/system/`) — et ce symlink n'est généré que par `systemctl enable`, jamais automatiquement.

Conséquence : si un service est installé et fonctionnel mais **jamais activé** (`disabled`), toute commande `systemctl start <alias>` échoue avec `Unit <alias>.service not found`, même si le service réel existe et pourrait démarrer sans problème sous son nom complet.

## Exemples

Symptôme typique :
```
Failed to start sunshine.service: Unit sunshine.service not found
status=5/NOTINSTALLED
```

Alors que le service réel existe :
```
/usr/lib/systemd/user/app-dev.lizardbyte.app.Sunshine.service
```
avec `Alias=sunshine.service` dans sa section `[Install]`.

Solution : activer le service (ce qui crée l'alias) au lieu de simplement le démarrer :
```bash
systemctl --user enable --now app-dev.lizardbyte.app.Sunshine.service
```

Cela crée le symlink `~/.config/systemd/user/sunshine.service` pointant vers l'unité réelle, rattache le service à `graphical-session.target.wants` (autostart à chaque session), et le démarre immédiatement.

## Cas d'usage

- Debug d'une erreur `Unit X.service not found` alors que le paquet est bien installé
- Tout autostart `.desktop` KDE ou script qui appelle `systemctl start <nom-court>` au lieu du nom complet de l'unité
- Vérifier après un `enable` que l'alias a bien été créé avant de considérer le problème résolu

## Connexions

### Notes liées
- [[SDDM - Autologin sous Wayland]] - Sunshine, l'exemple concret ici, dépend de l'autologin pour démarrer dans une session Wayland active

### Contexte
Piège classique quand un fichier d'autostart `.desktop` est écrit en supposant que `systemctl start <alias>` fonctionne dès l'installation du paquet, sans vérifier que le service a été explicitement activé.

## Sources
- Diagnostic Sunshine sur Arch Linux/KDE (2026-06-16)

---
**Tags thématiques** : #linux #systemd #kde #autostart
