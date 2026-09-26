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

<svg viewBox="0 0 450 245" width="100%" style="max-width:450px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Deux voies de chargement d'un module IOP : ROM ou embarqué par bin2c">
<defs><marker id="b2a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<text x="16" y="24" font-size="11.5" fill="#27ae60">voie 1 — le module est en ROM</text>
<rect x="16" y="32" width="150" height="34" rx="4" fill="#27ae60" fill-opacity="0.12" stroke="#27ae60" stroke-width="1.3"/>
<text x="26" y="53" font-size="9" fill="#27ae60">rom0: SIO2MAN · PADMAN…</text>
<line x1="166" y1="49" x2="188" y2="49" stroke="currentColor" stroke-width="1.4" marker-end="url(#b2a)"/>
<rect x="190" y="32" width="150" height="34" rx="4" fill="#27ae60" fill-opacity="0.12" stroke="#27ae60" stroke-width="1.3"/>
<text x="200" y="53" font-size="9" fill="#27ae60">SifLoadModule("rom0:…")</text>
<text x="16" y="92" font-size="11.5" fill="#4c9aff">voie 2 — le module n'est pas en ROM (iomanX, fileXio, usbd, audsrv)</text>
<rect x="16" y="102" width="96" height="38" rx="4" fill="none" stroke="#4c9aff" stroke-width="1.3"/>
<text x="24" y="118" font-size="8.5" fill="#4c9aff">$PS2SDK/iop/irx/</text>
<text x="24" y="132" font-size="8.5" fill="#4c9aff" opacity="0.8">machine de dev</text>
<line x1="112" y1="121" x2="128" y2="121" stroke="currentColor" stroke-width="1.4" marker-end="url(#b2a)"/>
<rect x="130" y="102" width="86" height="38" rx="4" fill="#4c9aff" fill-opacity="0.16" stroke="#4c9aff" stroke-width="1.4"/>
<text x="150" y="118" font-size="9.5" fill="#4c9aff">bin2c</text>
<text x="136" y="132" font-size="8" fill="#4c9aff" opacity="0.85">règle pattern Makefile</text>
<line x1="216" y1="121" x2="232" y2="121" stroke="currentColor" stroke-width="1.4" marker-end="url(#b2a)"/>
<rect x="234" y="102" width="96" height="38" rx="4" fill="#4c9aff" fill-opacity="0.12" stroke="#4c9aff" stroke-width="1.3"/>
<text x="242" y="118" font-size="8.5" fill="#4c9aff">tableau d'octets .c</text>
<text x="242" y="132" font-size="8.5" fill="#4c9aff" opacity="0.85">+ sa taille → EE_OBJS</text>
<line x1="330" y1="121" x2="346" y2="121" stroke="currentColor" stroke-width="1.4" marker-end="url(#b2a)"/>
<rect x="348" y="102" width="86" height="38" rx="4" fill="#4c9aff" fill-opacity="0.12" stroke="#4c9aff" stroke-width="1.3"/>
<text x="366" y="118" font-size="9" fill="#4c9aff">ELF</text>
<text x="354" y="132" font-size="8" fill="#4c9aff" opacity="0.85">le module voyage dedans</text>
<line x1="391" y1="140" x2="391" y2="162" stroke="currentColor" stroke-width="1.4" marker-end="url(#b2a)"/>
<rect x="234" y="168" width="200" height="34" rx="4" fill="#f2994a" fill-opacity="0.14" stroke="#f2994a" stroke-width="1.4"/>
<text x="244" y="189" font-size="9.5" fill="#f2994a">SifExecModuleBuffer (au runtime)</text>
<rect x="16" y="212" width="418" height="30" rx="4" fill="#e05252" fill-opacity="0.07" stroke="#e05252" stroke-width="1.2"/>
<text x="26" y="231" font-size="9" fill="#e05252">extern du tableau et de sa taille avec alignement sur 16 octets — contrainte du chargeur</text>
</svg>

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
