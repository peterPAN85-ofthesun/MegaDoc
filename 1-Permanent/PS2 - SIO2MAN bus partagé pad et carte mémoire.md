---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2
  - iop
  - modules
---

# PS2 - SIO2MAN bus partagé pad et carte mémoire

> [!abstract] Concept
> Manettes et cartes mémoire passent par le **même bus série SIO2**, arbitré par le module `SIO2MAN` ; `PADMAN` d'un côté et `MCMAN`+`MCSERV` de l'autre se construisent par-dessus, ce qui rend `SIO2MAN` obligatoire dans les deux cas.

## Explication

Physiquement, chaque port de la console regroupe un connecteur manette et un connecteur carte mémoire desservis par le même bus série. `SIO2MAN` est le pilote bas niveau de ce bus : il en arbitre l'accès entre les périphériques concurrents. C'est la raison pour laquelle il apparaît en premier dans toutes les séquences de chargement, qu'on veuille lire une manette ou une carte.

Par-dessus, la structure suit le schéma habituel. `PADMAN` implémente la logique manette et se voit exposé côté EE par `libpad`. Côté stockage, la pile compte deux étages : `MCMAN` fournit l'accès bloc brut, `MCSERV` ajoute le système de fichiers (répertoires, `icon.sys`) et le serveur RPC exposé par `libmc`.

Le module `MTAPMAN` s'insère dans ce schéma pour multiplier le nombre de périphériques : il permet quatre manettes et quatre cartes mémoire par port, ce qui explique le paramètre `slot` présent dans toutes les API `pad*` et `mc*` — toujours 0 en l'absence de multitap.

## Exemples

### La pile

```
                 ┌───────────┐
   port 1/2  ──► │  SIO2MAN  │  (arbitre le bus série partagé)
                 └─────┬─────┘
              ┌────────┴────────┐
              ▼                 ▼
         ┌─────────┐      ┌──────────────────┐
         │ PADMAN  │      │  MCMAN + MCSERV   │
         │ (pad)   │      │  (carte mémoire)  │
         └─────────┘      └──────────────────┘
```

### Les deux séquences de chargement

```c
// Manette
SifLoadModule("rom0:SIO2MAN", 0, NULL);
SifLoadModule("rom0:PADMAN", 0, NULL);

// Carte mémoire
SifLoadModule("rom0:SIO2MAN", 0, NULL);
SifLoadModule("rom0:MCMAN", 0, NULL);
SifLoadModule("rom0:MCSERV", 0, NULL);
```

### Les rôles

| Module | Rôle |
|---|---|
| `SIO2MAN` | Pilote bas niveau du bus SIO2 (2 ports physiques) |
| `PADMAN` | Pilote manette, exposé par `libpad` |
| `MCMAN` | Pilote bas niveau carte mémoire, accès bloc brut |
| `MCSERV` | Système de fichiers + serveur RPC, exposé par `libmc` |
| `MTAPMAN` | Multitap : 4 manettes/cartes par port |

## Cas d'usage

- **Programme utilisant pad et carte mémoire** : charger `SIO2MAN` une seule fois.
- **Support multitap** : ajouter `MTAPMAN` et utiliser le paramètre `slot`.
- **Diagnostiquer un `padPortOpen` qui échoue** : vérifier que `SIO2MAN` est chargé.

## Avantages et inconvénients

✅ **Avantages** :
- Un seul arbitre pour deux familles de périphériques : cohérence garantie.
- Le paramètre `slot` rend le code compatible multitap sans modification.

❌ **Inconvénients** / Limites :
- Bus partagé : la bande passante est commune à la manette et à la carte.
- La dépendance à `SIO2MAN` n'est signalée par aucun message d'erreur explicite.

## Connexions

### Notes liées
- [[PS2 - hiérarchie des modules IOP]] - Le schéma général dont ceci est une instance
- [[PS2SDK - lecture de la manette avec libpad]] - Le client EE de `PADMAN`
- [[PS2SDK - carte mémoire avec libmc]] - Le client EE de `MCSERV`
- [[PS2 - variantes de modules IOP]] - `XSIO2MAN`, `XMCMAN`, `freesio2`

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 6b)

---
**Tags thématiques** : #ps2 #iop #sio2man #padman #mcman
