---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2
  - hardware
  - sif
  - rpc
---

# PS2 - SIF pont RPC entre EE et IOP

> [!abstract] Concept
> Le SIF (Sub-system Interface) est le bus qui relie l'EE et l'IOP ; toute utilisation d'un périphérique passe par un appel RPC sur ce bus, initialisé une fois pour toutes par `sceSifInitRpc(0)`.

## Explication

L'EE et l'IOP ne partagent pas de mémoire adressable de façon transparente. Leur communication repose sur un protocole de type **RPC** (Remote Procedure Call) : l'EE envoie une requête à un module IRX chargé côté IOP, celui-ci exécute l'opération sur le matériel et renvoie le résultat. Ce protocole est implémenté côté IOP par les modules `SIFMAN`, `SIFCMD` et `SIFINIT`, et côté EE par `libkernel` (en-têtes `sifrpc-common.h`, `sifcmd-common.h`).

Matériellement, deux canaux DMA de l'EE portent ce trafic : `DMA_CHANNEL_fromSIF0` (IOP → EE) et `DMA_CHANNEL_toSIF1` (EE → IOP), plus un canal `SIF2` bidirectionnel peu utilisé. Le programmeur ne les manipule presque jamais directement : `sceSifInitRpc`, `SifLoadModule` et les bibliothèques clientes (`libpad`, `libmc`, `fileXio`) les utilisent sous le capot.

En pratique, la règle est simple : **`sceSifInitRpc(0)` est obligatoire avant toute chose** dès qu'on touche à un périphérique — c'est la première ligne de presque tous les samples. Certains scénarios exigent en plus un redémarrage propre de l'IOP (`SifIopReset` puis `SifIopSync`) pour reprendre la main sur ses modules avant d'y charger les siens.

## Exemples

### Séquence d'initialisation minimale

```c
sceSifInitRpc(0);
SifLoadModule("rom0:SIO2MAN", 0, NULL);
```

### Reset complet de l'IOP avant de charger ses propres modules

```c
sceSifInitRpc(0);
while (!SifIopReset(NULL, 0)) {};
while (!SifIopSync()) {};

sceSifInitRpc(0);           // à refaire après le reset
sbv_patch_enable_lmb();
sbv_patch_disable_prefix_check();
```

## Cas d'usage

- **Tout accès périphérique** : pad, carte mémoire, disque, réseau, son.
- **Chargement de modules** : `SifLoadModule` / `SifExecModuleBuffer` transitent par le SIF.
- **Loader homebrew** : reset IOP + patches SBV pour charger des modules non signés.

## Avantages et inconvénients

✅ **Avantages** :
- Isolation nette entre calcul (EE) et I/O (IOP).
- Les appels RPC sont asynchrones : l'EE peut continuer pendant l'opération.

❌ **Inconvénients** / Limites :
- Latence non négligeable sur chaque aller-retour.
- Oublier `sceSifInitRpc` produit des échecs difficiles à diagnostiquer.

## Connexions

### Notes liées
- [[PS2 - IOP et modules IRX]] - L'autre extrémité du pont
- [[PS2 - canaux DMA de l'EE]] - Les canaux fromSIF0 / toSIF1
- [[PS2SDK - squelette d'un programme EE]] - Où `sceSifInitRpc` se place
- [[PS2 - IOMAN IOMANX et fileXio]] - Un pont RPC concret par-dessus le SIF
- [[PS2 - architecture multiprocesseur]] - Sa place dans le système

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitres 1, 2, 5 et 6)

---
**Tags thématiques** : #ps2 #sif #rpc #iop #ee
