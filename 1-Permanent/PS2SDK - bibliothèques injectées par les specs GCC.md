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
- [[GCC - driver et non compilateur]] - Pourquoi `-###` révèle ces injections
- [[PS2SDK - Makefile d'un projet EE]] - Où se déclare `EE_LIBS`
- [[PS2SDK - en-têtes header-only sans archive]] - L'autre source d'erreurs de link

- [[ELF - Executable and Linkable Format]] - Pourquoi l'ELF produit pèse ~1,4 Mo

### Dans le contexte de
- [[MOC - PS2 Homebrew]] - Fait partie de ce domaine

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitre 2, « Ce que le toolchain PS2 ajoute d'office »)

---
**Tags thématiques** : #ps2sdk #linkage #newlib #lto
