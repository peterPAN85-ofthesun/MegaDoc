---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2
  - iop
  - modules
---

# PS2 - hiérarchie des modules IOP

> [!abstract] Concept
> Les modules IOP forment une pile en couches, pas une liste plate : un micro-noyau toujours présent, puis partout le même schéma **driver bas niveau → couche serveur/filesystem → client RPC côté EE**.

## Explication

Le schéma à retenir se répète pour chaque famille de périphériques. Un **driver bas niveau** parle au matériel en secteurs ou blocs bruts (`MCMAN` pour la carte mémoire, `CDVDMAN` pour le disque, `USBD` pour l'USB, `libsd` pour le son). Une **couche serveur** donne par-dessus une vue fichiers et répertoires et expose un service RPC (`MCSERV`, `CDVDFSV`, `USBHDFSD`, `AUDSRV`). Enfin un **client côté EE** fournit l'API qu'on appelle réellement : `libpad`, `libmc`, `fileXio`.

En dessous de tout cela vit un micro-noyau IOP déjà chargé par le firmware avant même que l'ELF démarre. On ne le charge soi-même que pour un loader ou un BIOS custom : `LOADCORE` (le chargeur de modules, qui résout imports et exports), `SYSMEM` (allocateur), `INTRMAN` (interruptions), `THREADMAN` (ordonnanceur préemptif), `EXCEPMAN` (exceptions), `VBLANK`, la triade `SIFMAN`/`SIFCMD`/`SIFINIT` (protocole SIF, initialisée sous le capot par `sceSifInitRpc`) et `IOMAN` (API fichier héritée PS1).

Cette structure explique pourquoi l'ordre de chargement compte : charger `PADMAN` sans `SIO2MAN` échoue, puisque la couche haute s'appuie sur la couche basse. Elle explique aussi pourquoi certains modules ne se chargent jamais explicitement : le firmware l'a déjà fait.

## Exemples

### Le schéma appliqué à quatre familles

| Driver bas niveau | Couche serveur | Client EE |
|---|---|---|
| `MCMAN` | `MCSERV` | `libmc` |
| `CDVDMAN` | `CDVDFSV` | I/O standard sur `cdrom0:` |
| `USBD` | `USBHDFSD` | I/O standard sur `mass:` |
| `libsd` | `AUDSRV` | `libaudsrv` |
| `SIO2MAN` | `PADMAN` | `libpad` |

### Le micro-noyau, rarement chargé à la main

| Module | Rôle |
|---|---|
| `LOADCORE` | Chargeur de modules, résolution imports/exports |
| `SYSMEM` | Allocateur mémoire IOP |
| `INTRMAN` | Gestionnaire d'interruptions |
| `THREADMAN` | Ordonnanceur de threads |
| `EXCEPMAN` | Gestion des exceptions CPU |
| `VBLANK` | Pilote de l'interruption vblank |
| `SIFMAN`/`SIFCMD`/`SIFINIT` | Protocole SIF bas niveau |
| `IOMAN` | API fichier basique héritée PS1 |

### Autres familles

| Domaine | Modules |
|---|---|
| USB | `USBD`, `usbd_mini`, `USBHDFSD`, `ps2kbd`, `ps2mouse` |
| Son | `libsd`, `AUDSRV` |
| Réseau | `SMAP` (pilote Ethernet), `NETMAN` (liaison pile/pilote), `PS2IP` (port de lwIP) |
| Multitap | `MTAPMAN` — 4 manettes/cartes par port |
| Alimentation | `POWEROFF` — arrêt propre de la console |

## Cas d'usage

- **Déterminer quels modules charger** pour un périphérique donné.
- **Diagnostiquer un `SifLoadModule` qui échoue** : vérifier la couche inférieure.
- **Ajouter le réseau** : empiler `SMAP` + `NETMAN` + `PS2IP`.

## Avantages et inconvénients

✅ **Avantages** :
- Structure régulière : connaître un cas suffit à deviner les autres.
- Chaque couche est remplaçable indépendamment.

❌ **Inconvénients** / Limites :
- L'ordre de chargement est implicite et rarement documenté.
- Distinguer ce qui est déjà chargé de ce qui ne l'est pas demande de l'expérience.

## Connexions

### Notes liées
- [[PS2 - IOP et modules IRX]] - Ce qu'est un module IRX
- [[PS2 - SIO2MAN bus partagé pad et carte mémoire]] - Une instance du schéma
- [[PS2 - IOMAN IOMANX et fileXio]] - Le cas particulier des API fichier
- [[PS2 - variantes de modules IOP]] - Les suffixes X, numériques et free
- [[PS2 - SIF pont RPC entre EE et IOP]] - Le lien avec le client EE

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 6)

---
**Tags thématiques** : #ps2 #iop #modules #irx #architecture
