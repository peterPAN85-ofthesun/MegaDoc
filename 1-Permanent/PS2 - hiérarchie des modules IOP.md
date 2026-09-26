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

<svg viewBox="0 0 450 295" width="100%" style="max-width:450px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pile en couches des modules IOP, du micro-noyau au client EE">
<defs><marker id="isa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<rect x="20" y="42" width="410" height="48" rx="6" fill="#4c9aff" fill-opacity="0.1" stroke="#4c9aff" stroke-width="1.6"/>
<text x="30" y="60" font-size="11" fill="#4c9aff">CLIENT côté EE — l'API que vous appelez</text>
<text x="30" y="80" font-size="10" fill="#4c9aff">libpad · libmc · fileXio</text>
<line x1="225" y1="90" x2="225" y2="106" stroke="currentColor" stroke-width="1.6" marker-end="url(#isa)"/>
<rect x="20" y="106" width="410" height="48" rx="6" fill="#27ae60" fill-opacity="0.1" stroke="#27ae60" stroke-width="1.6"/>
<text x="30" y="124" font-size="11" fill="#27ae60">COUCHE SERVEUR — vue fichiers/répertoires + service RPC</text>
<text x="30" y="144" font-size="10" fill="#27ae60">MCSERV · CDVDFSV · USBHDFSD · AUDSRV</text>
<line x1="225" y1="154" x2="225" y2="170" stroke="currentColor" stroke-width="1.6" marker-end="url(#isa)"/>
<rect x="20" y="170" width="410" height="48" rx="6" fill="#f2994a" fill-opacity="0.1" stroke="#f2994a" stroke-width="1.6"/>
<text x="30" y="188" font-size="11" fill="#f2994a">DRIVER BAS NIVEAU — secteurs et blocs bruts</text>
<text x="30" y="208" font-size="10" fill="#f2994a">MCMAN · CDVDMAN · USBD · libsd</text>
<line x1="225" y1="218" x2="225" y2="234" stroke="currentColor" stroke-width="1.6" marker-end="url(#isa)"/>
<rect x="20" y="234" width="410" height="52" rx="6" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"/>
<text x="30" y="252" font-size="11" fill="currentColor">MICRO-NOYAU IOP — déjà chargé par le firmware</text>
<text x="30" y="268" font-size="9.5" fill="currentColor" opacity="0.85">LOADCORE · SYSMEM · INTRMAN · THREADMAN · EXCEPMAN · VBLANK</text>
<text x="30" y="281" font-size="9.5" fill="currentColor" opacity="0.85">SIFMAN/SIFCMD/SIFINIT · IOMAN</text>
<text x="16" y="28" font-size="12" fill="currentColor">le même schéma se répète pour chaque famille de périphériques</text>
</svg>

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
