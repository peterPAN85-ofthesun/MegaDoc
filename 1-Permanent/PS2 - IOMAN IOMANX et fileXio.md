---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2
  - iop
  - filesystem
---

# PS2 - IOMAN IOMANX et fileXio

> [!abstract] Concept
> `IOMAN` et `IOMANX` sont deux API fichier **internes à l'IOP** — la seconde étendue façon POSIX — tandis que `fileXio` est le pont RPC qui les rend appelables depuis l'EE ; c'est la confusion la plus fréquente du SDK.

## Explication

`IOMAN` est l'API historique héritée de la PS1 : noms courts façon 8.3, pas de vrai `stat`, sémantique limitée. `IOMANX` lui succède avec une sémantique POSIX complète — noms longs, `stat`, répertoires profonds. Les deux tournent **exclusivement sur l'IOP**.

C'est là que le malentendu naît : le code EE ne peut pas appeler ces API directement, faute de mémoire partagée transparente entre les deux processeurs. Un `open()` écrit côté EE doit traverser le SIF pour atteindre IOMANX côté IOP. **`fileXio` est précisément ce pont** : un serveur IOP (`fileXio.irx`) et un client EE (`fileXio_rpc.h`).

D'où la règle pratique : charger `iomanX.irx` **et** `fileXio.irx` ensemble. IOMANX fait le travail de système de fichiers, fileXio fait le transport RPC. Charger l'un sans l'autre laisse soit une API inaccessible, soit un pont sans destination.

## Exemples

### Les trois couches

| Module | Rôle | Où ça tourne |
|---|---|---|
| `IOMAN` | API fichier basique héritée PS1 : noms courts, pas de vrai `stat` | IOP uniquement |
| `IOMANX` | API fichier étendue façon POSIX : noms longs, `stat` | IOP uniquement |
| `fileXio` | Pont RPC EE ↔ IOP exposant IOMANX au code EE | Client EE + serveur IOP |

### Le chargement conjoint

```c
SifExecModuleBuffer(&iomanX_irx, size_iomanX_irx, 0, NULL, NULL);   // le filesystem
SifExecModuleBuffer(&fileXio_irx, size_fileXio_irx, 0, NULL, NULL); // le pont RPC
fileXioInit();
```

### Le trajet d'un `open()`

```
open("cdrom0:\DATA.BIN;1")   [EE, client fileXio]
        ↓ SIF RPC
fileXio.irx                   [IOP, serveur]
        ↓ appel local
IOMANX                        [IOP, filesystem]
        ↓
CDVDMAN → disque
```

## Cas d'usage

- **Accès fichier depuis l'EE** avec sémantique POSIX.
- **Diagnostiquer un `open` qui échoue** : vérifier que les deux modules sont chargés.
- **Comprendre la documentation** : distinguer les fonctions IOP des fonctions EE.

## Avantages et inconvénients

✅ **Avantages** :
- Un seul client EE couvre tous les devices gérés par IOMANX.
- Sémantique POSIX, familière et complète.

❌ **Inconvénients** / Limites :
- Deux modules à charger, aucun des deux en ROM.
- Chaque appel traverse le SIF : latence sensible sur de nombreux petits accès.

## Connexions

### Notes liées
- [[PS2SDK - accès disque avec fileXio]] - La mise en œuvre côté code
- [[PS2 - hiérarchie des modules IOP]] - Le schéma driver/serveur/client
- [[PS2 - SIF pont RPC entre EE et IOP]] - Le transport utilisé
- [[PS2SDK - embarquer un module IRX avec bin2c]] - Comment ces modules arrivent sur la console

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 6c)

---
**Tags thématiques** : #ps2 #iop #ioman #iomanx #filexio #filesystem
