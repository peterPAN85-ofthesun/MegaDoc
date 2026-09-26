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

<svg viewBox="0 0 450 250" width="100%" style="max-width:450px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="IOMAN et IOMANX vivent sur l'IOP, fileXio est le pont RPC depuis l'EE">
<defs><marker id="ima" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<text x="16" y="26" font-size="12" fill="currentColor">la confusion la plus fréquente du SDK : qui tourne où ?</text>
<rect x="16" y="38" width="130" height="94" rx="6" fill="#4c9aff" fill-opacity="0.08" stroke="#4c9aff" stroke-width="1.6"/>
<text x="26" y="56" font-size="11" fill="#4c9aff">CÔTÉ EE</text>
<rect x="26" y="66" width="110" height="26" rx="4" fill="none" stroke="#4c9aff" stroke-width="1.2"/>
<text x="32" y="83" font-size="9" fill="#4c9aff">votre open() / read()</text>
<rect x="26" y="98" width="110" height="26" rx="4" fill="#4c9aff" fill-opacity="0.15" stroke="#4c9aff" stroke-width="1.3"/>
<text x="32" y="115" font-size="9" fill="#4c9aff">fileXio_rpc.h — client</text>
<rect x="166" y="52" width="70" height="66" rx="5" fill="#f2994a" fill-opacity="0.14" stroke="#f2994a" stroke-width="1.5"/>
<text x="184" y="80" font-size="10" fill="#f2994a">SIF</text>
<text x="172" y="98" font-size="8.5" fill="#f2994a">le pont RPC</text>
<line x1="146" y1="85" x2="164" y2="85" stroke="currentColor" stroke-width="1.6" marker-end="url(#ima)"/>
<line x1="236" y1="85" x2="254" y2="85" stroke="currentColor" stroke-width="1.6" marker-end="url(#ima)"/>
<rect x="256" y="38" width="178" height="146" rx="6" fill="#f2994a" fill-opacity="0.07" stroke="#f2994a" stroke-width="1.6"/>
<text x="266" y="56" font-size="11" fill="#f2994a">CÔTÉ IOP — exclusivement</text>
<rect x="266" y="66" width="158" height="26" rx="4" fill="#f2994a" fill-opacity="0.15" stroke="#f2994a" stroke-width="1.3"/>
<text x="272" y="83" font-size="9" fill="#f2994a">fileXio.irx — serveur</text>
<rect x="266" y="100" width="158" height="30" rx="4" fill="none" stroke="#27ae60" stroke-width="1.4"/>
<text x="272" y="114" font-size="9" fill="#27ae60">IOMANX — POSIX complet</text>
<text x="272" y="126" font-size="8" fill="#27ae60" opacity="0.85">noms longs, stat, répertoires profonds</text>
<rect x="266" y="138" width="158" height="30" rx="4" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 2"/>
<text x="272" y="152" font-size="9" fill="currentColor" opacity="0.85">IOMAN — historique PS1</text>
<text x="272" y="164" font-size="8" fill="currentColor" opacity="0.7">noms 8.3, pas de vrai stat</text>
<rect x="16" y="198" width="418" height="42" rx="5" fill="#27ae60" fill-opacity="0.08" stroke="#27ae60" stroke-width="1.3"/>
<text x="26" y="216" font-size="10" fill="#27ae60">règle pratique : charger iomanX.irx ET fileXio.irx ensemble</text>
<text x="26" y="232" font-size="9" fill="#27ae60" opacity="0.9">IOMANX = le système de fichiers · fileXio = le transport RPC — l'un sans l'autre ne sert à rien</text>
</svg>

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
