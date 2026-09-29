---
type: permanent
created: 2026-08-21 23:43
tags:
  - permanent
  - ps2sdk
  - linkage
  - build
---

# PS2SDK - bibliothèques injectées par les specs GCC

> [!abstract] Concept
> `EE_LIBS` n'est pas la liste complète des bibliothèques liées : les specs du toolchain ps2dev ajoutent d'office `-lgcc -lm --start-group -lc -lcdvd -lpthread -lpthreadglue -lcglue -lkernel --end-group -lgcc` après les nôtres.

## Explication

En observant la ligne de link réelle avec `gcc -###`, on voit apparaître un bloc que le projet n'a jamais déclaré. C'est ce qui explique que `printf`, `malloc` ou `cosf` — issus de la newlib — soient disponibles sans aucune mention dans le `Makefile`. Deux conséquences directes : **`-lkernel` dans `EE_LIBS` est redondant** (il figure déjà dans le groupe injecté), et le `--start-group` entourant `libc`, `libcdvd`, `libcglue` et `libkernel` n'est pas décoratif — ces quatre archives ont des dépendances croisées (`libcglue` fait le pont entre la libc et les syscalls du noyau EE, qui rappellent eux-mêmes des fonctions de la libc), et aucun ordre linéaire ne les satisferait.

Le lien est par ailleurs **intégralement statique** : la PS2 n'a ni chargeur dynamique ni bibliothèques partagées, `ld` ne tente donc jamais d'ouvrir un `.so`. Tout le code utilisé est recopié dans l'ELF, d'où un binaire d'environ **1,4 Mo pour une centaine de lignes de C**, l'essentiel venant de `libkernel` et de la newlib.

Dernier point à connaître : le **plugin LTO** (`liblto_plugin.so`, actif par défaut) réexamine les archives et **masque les erreurs d'ordre**. Mettre les bibliothèques avant les objets — l'erreur classique décrite dans [[C - ordre de résolution des archives au link]] — passe quand même via `gcc`. L'échec ne réapparaît qu'avec `-fno-use-linker-plugin` ou en appelant `ld` directement. Il faut donc respecter l'ordre malgré tout.

<svg viewBox="0 0 450 250" width="100%" style="max-width:450px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bibliothèques ajoutées d'office par les specs du toolchain">
<text x="16" y="24" font-size="11.5" fill="currentColor">la ligne de link réelle (gcc -###) contient bien plus que EE_LIBS</text>
<rect x="16" y="34" width="120" height="34" rx="4" fill="#27ae60" fill-opacity="0.14" stroke="#27ae60" stroke-width="1.4"/>
<text x="26" y="55" font-size="9.5" fill="#27ae60">vos EE_LIBS</text>
<rect x="140" y="34" width="294" height="34" rx="4" fill="#4c9aff" fill-opacity="0.14" stroke="#4c9aff" stroke-width="1.4"/>
<text x="148" y="55" font-size="8.5" fill="#4c9aff">-lgcc -lm --start-group -lc -lcdvd -lpthread -lpthreadglue -lcglue -lkernel --end-group -lgcc</text>
<text x="140" y="82" font-size="8.5" fill="#4c9aff" opacity="0.85">injecté d'office par les specs ps2dev — jamais déclaré par le projet</text>
<rect x="16" y="94" width="206" height="64" rx="5" fill="#f2994a" fill-opacity="0.08" stroke="#f2994a" stroke-width="1.3"/>
<text x="26" y="112" font-size="9.5" fill="#f2994a">pourquoi --start-group ?</text>
<text x="26" y="128" font-size="8.5" fill="#f2994a" opacity="0.95">libc ↔ libcglue ↔ libkernel ont des</text>
<text x="26" y="142" font-size="8.5" fill="#f2994a" opacity="0.95">dépendances croisées : aucun ordre</text>
<text x="26" y="153" font-size="8.5" fill="#f2994a" opacity="0.95">linéaire ne les satisferait</text>
<rect x="232" y="94" width="202" height="64" rx="5" fill="#27ae60" fill-opacity="0.08" stroke="#27ae60" stroke-width="1.3"/>
<text x="242" y="112" font-size="9.5" fill="#27ae60">conséquences directes</text>
<text x="242" y="128" font-size="8.5" fill="#27ae60" opacity="0.95">printf, malloc, cosf dispo sans rien déclarer</text>
<text x="242" y="142" font-size="8.5" fill="#27ae60" opacity="0.95">-lkernel dans EE_LIBS est redondant</text>
<rect x="16" y="170" width="206" height="66" rx="5" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3"/>
<text x="26" y="188" font-size="9.5" fill="currentColor">lien 100 % statique</text>
<text x="26" y="204" font-size="8.5" fill="currentColor" opacity="0.9">ni chargeur dynamique ni .so sur PS2</text>
<text x="26" y="220" font-size="8.5" fill="currentColor" opacity="0.9">→ ~1,4 Mo d'ELF pour 100 lignes de C</text>
<rect x="232" y="170" width="202" height="66" rx="5" fill="#e05252" fill-opacity="0.07" stroke="#e05252" stroke-width="1.3"/>
<text x="242" y="188" font-size="9.5" fill="#e05252">⚠ le plugin LTO masque les erreurs d'ordre</text>
<text x="242" y="206" font-size="8.5" fill="#e05252" opacity="0.95">bibliothèques avant les objets : passe quand même</text>
<text x="242" y="222" font-size="8.5" fill="#e05252" opacity="0.9">l'échec ne réapparaît qu'avec -fno-use-linker-plugin</text>
</svg>

## Exemples

### La ligne de link réelle

```
main.o  -ldma -lpacket  -lgcc -lm --start-group -lc -lcdvd -lpthread -lpthreadglue -lcglue -lkernel --end-group -lgcc
        └─ nos EE_LIBS ─┘└──────────── ajoutées par le driver ps2dev ─────────────────────────┘
```

### Rendre l'injection visible

```bash
mips64r5900el-ps2-elf-gcc -### -o test.elf main.o -ldma -lpacket
```

### Le même groupe, reconstruit à la main par NEWLIB_NANO

```makefile
EXTRA_LDFLAGS = -nodefaultlibs $(LIBM) -lgcc -Wl,--start-group $(LIBC) \
                -lcdvd -lcglue -lpthread -lpthreadglue -lkernel -Wl,--end-group
```

`-nodefaultlibs` ayant désactivé l'injection automatique, il faut reconstruire le groupe soi-même.

### Symptômes rencontrés et corrections

| Message de `ld` | Cause | Correction |
|---|---|---|
| `undefined reference to 'packet_init'` | `-lpacket` absent alors que `packet.h` est inclus | ajouter `-lpacket` |
| `cannot find -lgif_tags` | un `-l` ajouté pour un en-tête header-only | retirer le `-l`, garder le `#include` |
| `cannot find -l…` alors que l'archive existe | `-L` pointant vers un répertoire inexistant | corriger le `-L` |

## Cas d'usage

- **Comprendre pourquoi la newlib fonctionne** sans être déclarée.
- **Alléger `EE_LIBS`** en retirant les redondances.
- **Diagnostiquer un link qui passe en local et échoue ailleurs** : chercher l'ordre des `-l`.

## Avantages et inconvénients

✅ **Avantages** :
- La libc standard fonctionne sans configuration.
- Les dépendances circulaires du trio libc/glue/kernel sont réglées d'office.

❌ **Inconvénients** / Limites :
- Le LTO masque les vraies erreurs d'ordre, qui ressortent sur une autre chaîne.
- L'ELF est lourd même pour un programme trivial.

## Connexions

### Notes liées
- [[C - ordre de résolution des archives au link]] - Le mécanisme générique masqué par le LTO
- [[C - convention -lfoo et recherche des archives]] - Comment `ld` trouve les archives
- [[C - compilation et linkage]] - Pourquoi `-###` révèle ces injections
- [[PS2SDK - Makefile d'un projet EE]] - Où se déclare `EE_LIBS`
- [[PS2SDK - en-têtes header-only sans archive]] - L'autre source d'erreurs de link

- [[ELF - Executable and Linkable Format]] - Pourquoi l'ELF produit pèse ~1,4 Mo

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 2, « Ce que le toolchain PS2 ajoute d'office »)

---
**Tags thématiques** : #ps2sdk #linkage #newlib #lto
