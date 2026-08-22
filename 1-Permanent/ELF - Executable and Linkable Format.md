---
type: permanent
created: 2026-08-22 00:30
tags:
  - permanent
  - c
  - compilation
  - linkage
  - elf
---

# ELF - Executable and Linkable Format

> [!abstract] Concept
> ELF est le format de fichier binaire standard des systèmes Unix : il décrit du code machine accompagné de métadonnées (sections, segments, table de symboles, relocations) qui servent soit à l'éditeur de liens, soit au chargeur au moment de l'exécution.

## Explication

Un fichier ELF n'est pas un simple bloc de code machine : c'est un conteneur structuré. Son en-tête déclare l'architecture cible, le boutisme, le point d'entrée et deux tables de description. Le même format sert à quatre choses différentes, distinguées par le champ `e_type` : un fichier objet relogeable (`ET_REL`, un `.o`), un exécutable (`ET_EXEC`), un objet partagé (`ET_DYN`, un `.so`) ou un core dump (`ET_CORE`).

Le point le plus structurant est la **double vue** du contenu. La table des **sections** est la vue de l'éditeur de liens : elle découpe le fichier en `.text` (code), `.data` (données initialisées), `.bss` (données à zéro, non stockées), `.rodata` (constantes), `.symtab` (symboles) et `.rel*` (relocations). La table des **segments** — ou *program headers* — est la vue du chargeur : elle indique quelles plages copier en mémoire, à quelle adresse et avec quelles permissions. Un `.o` n'a que des sections ; un exécutable a les deux.

C'est cette structure qui explique le vocabulaire des erreurs de build. Un symbole `undefined` est une entrée de `.symtab` sans définition, que l'éditeur de liens n'a pas su résoudre. Une relocation est un emplacement du code que le linker doit corriger une fois les adresses finales connues. Et la distinction déclarer/définir se lit directement dans la table des symboles.

Sur une cible **sans système d'exploitation**, comme la PS2, tout ce qui relève du chargement dynamique disparaît : pas de `.so`, pas d'interpréteur, pas de relocation à l'exécution. L'ELF est intégralement statique — tout le code utilisé y est recopié — et un script de link (`linkfile`) impose les adresses de chargement. C'est la console elle-même, guidée par `SYSTEM.CNF`, qui joue le rôle du chargeur.

## Exemples

### Les quatre types de fichiers ELF

| `e_type` | Nature | Produit par |
|---|---|---|
| `ET_REL` | Fichier objet relogeable (`.o`) | `gcc -c`, `as` |
| `ET_EXEC` | Exécutable à adresses fixes | `ld` |
| `ET_DYN` | Objet partagé (`.so`) ou exécutable PIE | `ld -shared`, `-pie` |
| `ET_CORE` | Image mémoire d'un processus (core dump) | le noyau, après un crash |

### Sections courantes

| Section | Contenu |
|---|---|
| `.text` | Code machine exécutable |
| `.data` | Variables initialisées non nulles |
| `.bss` | Variables initialisées à zéro — occupe de la place en mémoire, pas dans le fichier |
| `.rodata` | Constantes et chaînes littérales |
| `.symtab` / `.strtab` | Table des symboles et leurs noms |
| `.rel.text` / `.rela.text` | Relocations à appliquer au code |
| `.debug_*` | Informations de debug DWARF (produites par `-g`) |

### Inspecter un ELF

```bash
readelf -h prog          # en-tête : architecture, type, point d'entrée
readelf -S prog          # table des sections (vue éditeur de liens)
readelf -l prog          # table des segments (vue chargeur)
readelf -s prog          # table des symboles
nm -g --defined-only lib.a   # symboles définis par une archive
objdump -d prog          # désassemblage
size prog                # taille de .text / .data / .bss
```

### Le cas d'une cible bare metal (PS2)

```bash
mips64r5900el-ps2-elf-readelf -h test.elf
```

Le lien y est intégralement statique : `ld` ne tente jamais d'ouvrir un `.so`, tout le code utilisé est recopié dans le binaire — d'où un ELF d'environ 1,4 Mo pour une centaine de lignes de C, l'essentiel venant de la bibliothèque système et de la newlib.

## Cas d'usage

- **Diagnostiquer un `undefined reference`** : `nm` sur les objets et archives pour voir qui définit quoi.
- **Comprendre la taille d'un binaire** : `size` distingue le code des données et du `.bss`.
- **Vérifier une cross-compilation** : `readelf -h` confirme l'architecture réellement ciblée.
- **Cible embarquée** : contrôler le placement des sections via un script de link.

## Avantages et inconvénients

✅ **Avantages** :
- Un seul format couvre objets, bibliothèques, exécutables et core dumps.
- Extensible : on ajoute des sections sans casser les outils existants.
- Entièrement inspectable avec des outils standard (`readelf`, `objdump`, `nm`).

❌ **Inconvénients** / Limites :
- La double vue sections/segments déroute au premier abord.
- Format absent de l'écosystème Windows, qui utilise PE/COFF.

## Connexions

### Notes liées
- [[C - compilation et linkage]] - Les étapes qui produisent un ELF
- [[GCC - driver et non compilateur]] - Quel programme génère quel type de fichier
- [[C - en-tête et bibliothèque (déclarer vs définir)]] - La distinction lisible dans `.symtab`
- [[C - ordre de résolution des archives au link]] - Comment les symboles indéfinis sont résolus
- [[PS2 - SYSTEM.CNF et démarrage d'un ELF]] - Le chargement d'un ELF sans OS
- [[PS2SDK - bibliothèques injectées par les specs GCC]] - Pourquoi un ELF PS2 est si volumineux

### Dans le contexte de
- [[MOC - Programmation C]] - Fait partie de ce domaine
- [[MOC - PS2 Homebrew]] - Le format du binaire produit par le SDK

## Sources
- Fichier source : `0-Inbox/PS2SDK.md` (chapitres 2 et 7)
- Spécification : Tool Interface Standard (TIS) ELF Specification v1.2
- `man 5 elf`

---
**Tags thématiques** : #elf #compilation #linkage #binaire #c
