---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2sdk
  - build
  - irx
---

# PS2SDK - embarquer un module IRX avec bin2c

> [!abstract] Concept
> Un module IOP absent de la ROM se charge en le convertissant en tableau C avec `bin2c` au moment du build, en le liant dans l'ELF, puis en appelant `SifExecModuleBuffer` au runtime.

## Explication

Deux méthodes de chargement coexistent, selon l'origine du module. `SifLoadModule("rom0:PADMAN", 0, NULL)` charge un module présent dans la ROM de la console — c'est le cas de `SIO2MAN`, `PADMAN`, `MCMAN`, `MCSERV`. Mais beaucoup de modules utiles (`iomanX`, `fileXio`, `usbd`, `audsrv`) n'y sont pas : ils vivent dans `$PS2SDK/iop/irx/` sur la machine de développement, et il faut les acheminer jusqu'à la console.

La technique standard consiste à les **embarquer dans l'exécutable**. L'outil `bin2c`, fourni dans `$PS2SDK/bin/`, transforme un fichier binaire en fichier `.c` contenant un tableau d'octets et sa taille. Une règle pattern du Makefile automatise la conversion, et les objets résultants s'ajoutent à `EE_OBJS`.

Côté code, on déclare le tableau et sa taille en `extern` — avec un alignement sur 16 octets, contrainte du chargeur — puis on charge le module depuis la mémoire avec `SifExecModuleBuffer` au lieu de `SifLoadModule`. Le module n'a jamais touché un système de fichiers : il voyage dans l'ELF.

## Exemples

### La règle de build

```makefile
IRX_FILES += iomanX.irx fileXio.irx
EE_OBJS += $(IRX_FILES:.irx=_irx.o)

%_irx.c:
	$(PS2SDK)/bin/bin2c $(PS2SDK)/iop/irx/$*.irx $@ $*_irx
```

Le troisième argument de `bin2c` donne le préfixe des symboles générés : `fileXio_irx` et `size_fileXio_irx`.

### La déclaration côté C

```c
extern unsigned char fileXio_irx[] __attribute__((aligned(16)));
extern unsigned int size_fileXio_irx;
```

### Les deux méthodes de chargement

| Origine du module | Fonction | Exemple |
|---|---|---|
| ROM de la console | `SifLoadModule` | `SifLoadModule("rom0:PADMAN", 0, NULL)` |
| Embarqué dans l'ELF | `SifExecModuleBuffer` | `SifExecModuleBuffer(&fileXio_irx, size_fileXio_irx, 0, NULL, NULL)` |

## Cas d'usage

- **Système de fichiers étendu** : embarquer `iomanX` + `fileXio`.
- **Support USB** : embarquer `usbd` et `usbhdfsd`.
- **Audio** : embarquer `audsrv`.

## Avantages et inconvénients

✅ **Avantages** :
- L'exécutable est autonome : aucune dépendance à un fichier externe sur le média.
- Fonctionne quelle que soit la révision de ROM de la console.

❌ **Inconvénients** / Limites :
- Alourdit l'ELF de la taille de chaque module embarqué.
- Charger un module non signé peut exiger des patches SBV préalables.

## Connexions

### Notes liées
- [[PS2 - IOP et modules IRX]] - La nature des modules chargés
- [[PS2SDK - accès disque avec fileXio]] - Le cas d'usage le plus fréquent
- [[PS2SDK - Makefile d'un projet EE]] - Où s'insère la règle pattern
- [[PS2 - variantes de modules IOP]] - Choisir quelle version embarquer

- [[ELF - Executable and Linkable Format]] - Le binaire dans lequel le module est embarqué

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitres 2 et 5)

---
**Tags thématiques** : #ps2sdk #bin2c #irx #build #modules
