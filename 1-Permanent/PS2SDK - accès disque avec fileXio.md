---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2sdk
  - peripheriques
  - filesystem
---

# PS2SDK - accès disque avec fileXio

> [!abstract] Concept
> `fileXio` est le pont RPC qui expose au code EE les primitives de fichiers étendues d'`IOMANX` ; il exige de charger `iomanX.irx` **et** `fileXio.irx`, tous deux absents de la ROM et donc embarqués dans l'ELF.

## Explication

`IOMANX` fournit une API fichier de type POSIX — noms longs, `stat`, sémantique riche — mais c'est une API **interne à l'IOP**. Le code EE ne peut pas l'appeler directement, faute de mémoire partagée transparente. `fileXio` comble ce vide : serveur côté IOP (`fileXio.irx`), client côté EE (`fileXio_rpc.h`), et le SIF entre les deux. D'où le chargement systématique des deux modules ensemble.

Aucun des deux n'étant en ROM, ils sont convertis en tableaux C par `bin2c` au moment du build, liés dans l'ELF, puis chargés au runtime par `SifExecModuleBuffer`. Le sample typique commence même par un **reset complet de l'IOP** (`SifIopReset` puis `SifIopSync`) suivi des patches SBV `sbv_patch_enable_lmb()` et `sbv_patch_disable_prefix_check()`, qui autorisent le chargement de modules non signés.

Une fois `fileXioInit()` effectué, on accède au disque via le device `cdrom0:` — le même préfixe que dans `SYSTEM.CNF`, avec la syntaxe ISO9660 `cdrom0:\DATA.BIN;1` — à travers les fonctions `fileXio*` ou les I/O standard. Pour un besoin plus bas niveau (secteurs bruts, type de disque, TOC), `libcdvd` existe, mais l'accès façon fichier suffit pour charger des assets.

## Exemples

### Initialisation complète

```c
extern unsigned char iomanX_irx[] __attribute__((aligned(16)));
extern unsigned int size_iomanX_irx;
extern unsigned char fileXio_irx[] __attribute__((aligned(16)));
extern unsigned int size_fileXio_irx;

static void reset_IOP(void)
{
    sceSifInitRpc(0);
    while (!SifIopReset(NULL, 0)) {};
    while (!SifIopSync()) {};

    sceSifInitRpc(0);                    // à refaire après le reset
    sbv_patch_enable_lmb();
    sbv_patch_disable_prefix_check();
}

static int init_fileXio_driver(void)
{
    if (SifExecModuleBuffer(&iomanX_irx, size_iomanX_irx, 0, NULL, NULL) < 0)
        return -1;
    if (SifExecModuleBuffer(&fileXio_irx, size_fileXio_irx, 0, NULL, NULL) < 0)
        return -2;

    return fileXioInit();
}

int main(int argc, char *argv[])
{
    reset_IOP();
    init_fileXio_driver();
    /* ... */
}
```

### Le Makefile qui embarque les modules

```makefile
EE_BIN = filexio_sample.elf
EE_OBJS = main.o
EE_LIBS = -lfileXio -lpatches

IRX_FILES += iomanX.irx fileXio.irx
EE_OBJS += $(IRX_FILES:.irx=_irx.o)

%_irx.c:
	$(PS2SDK)/bin/bin2c $(PS2SDK)/iop/irx/$*.irx $@ $*_irx
```

## Cas d'usage

- **Charger des assets** depuis le DVD au démarrage d'un jeu.
- **Accès POSIX complet** : `stat`, noms longs, répertoires profonds.
- **Loader homebrew** : reset IOP + patches SBV pour modules non signés.

## Avantages et inconvénients

✅ **Avantages** :
- Sémantique POSIX familière depuis le code EE.
- Le même client couvre plusieurs devices (`cdrom0:`, `mass:`, `hdd0:`).

❌ **Inconvénients** / Limites :
- Deux modules à embarquer, plus une étape `bin2c` dans le build.
- Le reset IOP invalide les modules déjà chargés : l'ordre d'initialisation devient critique.

## Connexions

### Notes liées
- [[PS2 - IOMAN IOMANX et fileXio]] - La distinction entre les trois couches
- [[PS2SDK - embarquer un module IRX avec bin2c]] - La technique de build utilisée ici
- [[PS2 - SIF pont RPC entre EE et IOP]] - Le canal traversé par chaque `open`
- [[PS2 - SYSTEM.CNF et démarrage d'un ELF]] - Le device `cdrom0:` côté boot

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 5) — `samples/rpc/filexio/main.c`

---
**Tags thématiques** : #ps2sdk #filexio #iomanx #filesystem #cdrom
