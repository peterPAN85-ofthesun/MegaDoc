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

<svg viewBox="0 0 450 265" width="100%" style="max-width:450px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chaîne de build et de runtime pour accéder au disque avec fileXio">
<defs><marker id="fxa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<text x="16" y="24" font-size="11" fill="#4c9aff">AU BUILD — les deux modules sont absents de la ROM</text>
<rect x="16" y="32" width="112" height="36" rx="4" fill="none" stroke="#4c9aff" stroke-width="1.3"/>
<text x="24" y="48" font-size="9" fill="#4c9aff">iomanX.irx</text>
<text x="24" y="62" font-size="9" fill="#4c9aff">fileXio.irx</text>
<line x1="128" y1="50" x2="150" y2="50" stroke="currentColor" stroke-width="1.5" marker-end="url(#fxa)"/>
<rect x="152" y="32" width="90" height="36" rx="4" fill="#4c9aff" fill-opacity="0.15" stroke="#4c9aff" stroke-width="1.3"/>
<text x="176" y="54" font-size="9.5" fill="#4c9aff">bin2c</text>
<line x1="242" y1="50" x2="264" y2="50" stroke="currentColor" stroke-width="1.5" marker-end="url(#fxa)"/>
<rect x="266" y="32" width="168" height="36" rx="4" fill="#4c9aff" fill-opacity="0.1" stroke="#4c9aff" stroke-width="1.3"/>
<text x="276" y="54" font-size="9.5" fill="#4c9aff">tableaux C liés dans l'ELF</text>
<text x="16" y="94" font-size="11" fill="#f2994a">AU RUNTIME — séquence obligatoire</text>
<rect x="16" y="102" width="100" height="40" rx="4" fill="#f2994a" fill-opacity="0.12" stroke="#f2994a" stroke-width="1.3"/>
<text x="24" y="118" font-size="9" fill="#f2994a">SifIopReset</text>
<text x="24" y="132" font-size="9" fill="#f2994a">SifIopSync</text>
<line x1="116" y1="122" x2="134" y2="122" stroke="currentColor" stroke-width="1.5" marker-end="url(#fxa)"/>
<rect x="136" y="102" width="130" height="40" rx="4" fill="#f2994a" fill-opacity="0.12" stroke="#f2994a" stroke-width="1.3"/>
<text x="144" y="118" font-size="8.5" fill="#f2994a">sbv_patch_enable_lmb()</text>
<text x="144" y="132" font-size="8.5" fill="#f2994a">…disable_prefix_check()</text>
<line x1="266" y1="122" x2="284" y2="122" stroke="currentColor" stroke-width="1.5" marker-end="url(#fxa)"/>
<rect x="286" y="102" width="148" height="40" rx="4" fill="#f2994a" fill-opacity="0.12" stroke="#f2994a" stroke-width="1.3"/>
<text x="294" y="118" font-size="9" fill="#f2994a">SifExecModuleBuffer</text>
<text x="294" y="132" font-size="8.5" fill="#f2994a" opacity="0.85">charge depuis la mémoire</text>
<text x="144" y="156" font-size="8.5" fill="#f2994a" opacity="0.85">autorisent les modules non signés</text>
<line x1="360" y1="142" x2="360" y2="164" stroke="currentColor" stroke-width="1.5" marker-end="url(#fxa)"/>
<rect x="136" y="170" width="298" height="34" rx="4" fill="#27ae60" fill-opacity="0.12" stroke="#27ae60" stroke-width="1.4"/>
<text x="146" y="191" font-size="10" fill="#27ae60">fileXioInit() → le disque est accessible</text>
<rect x="16" y="216" width="418" height="42" rx="5" fill="none" stroke="currentColor" stroke-width="1.1" stroke-dasharray="4 3"/>
<text x="26" y="234" font-size="9.5" fill="currentColor">device cdrom0: — même préfixe que dans SYSTEM.CNF, syntaxe ISO9660</text>
<text x="26" y="250" font-size="9" fill="currentColor" opacity="0.85">cdrom0:\DATA.BIN;1 · pour les secteurs bruts et la TOC, passer par libcdvd</text>
</svg>

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
