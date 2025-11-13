---
type: permanent
created: 2025-11-13 00:32
tags:
  - permanent
  - programmation
  - c
  - compilation
  - gcc
  - linkage
---

# C - compilation et linkage

> [!abstract] Concept
> La compilation transforme le code source (.c) en code machine exécutable via plusieurs étapes : préprocessing, compilation, assemblage, linkage.

## Explication

**Étapes de build** :
1. **Préprocessing** : traite les directives (#include, #define)
2. **Compilation** : traduit C en assembleur (.s)
3. **Assemblage** : traduit assembleur en code objet (.o)
4. **Linkage** : lie les .o pour créer l'exécutable

**Commande gcc** :
```bash
gcc fichier.c -o executable
```

## Exemples

### Compilation simple

```bash
gcc main.c -o programme
./programme
```

### Compilation multi-fichiers

```bash
# Méthode 1 : tout en une fois
gcc main.c utils.c -o prog

# Méthode 2 : compilation séparée
gcc -c main.c    # → main.o
gcc -c utils.c   # → utils.o
gcc main.o utils.o -o prog
```

### Options gcc courantes

```bash
gcc -Wall -Wextra main.c -o prog  # Warnings
gcc -g main.c -o prog             # Debug symbols
gcc -O2 main.c -o prog            # Optimisation
gcc -std=c11 main.c -o prog       # Standard C11
```

## Connexions

- [[C - organisation multi-fichiers (headers)]] - Projets multi-fichiers
- [[Makefile - automatisation compilation C]] - Automatisation

## Sources
- Fichier source : `0-Inbox/Apprendre le C/Les Bases/Les Bases.md`

---
**Tags thématiques** : #c #compilation #gcc #linkage #build
