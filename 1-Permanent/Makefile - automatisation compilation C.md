---
type: permanent
created: 2025-11-13 00:30
tags:
  - permanent
  - programmation
  - makefile
  - build
  - compilation
---

# Makefile - automatisation compilation C

> [!abstract] Concept
> Un Makefile automatise le processus de compilation en définissant des règles de build, des dépendances et des commandes.

## Explication

**Structure** :
```makefile
cible: dépendances
	commande
```

**Variables automatiques** :
- `$@` : nom de la cible
- `$^` : liste des dépendances
- `$<` : première dépendance
- `%` : motif (wildcard)

## Exemples

### Makefile basique

```makefile
CXX = g++
CXXFLAGS = -Wall -Wextra -Werror
EXEC = prog

SRC = $(wildcard *.cpp)
OBJ = $(SRC:.cpp=.o)

all: $(EXEC)

%.o: %.cpp
	$(CXX) $(CXXFLAGS) -o $@ -c $<

$(EXEC): $(OBJ)
	$(CXX) -o $@ $^

clean:
	rm -rf *.o

mrproper: clean
	rm -rf $(EXEC)
```

### Utilisation

```bash
make          # Compile tout
make clean    # Supprime .o
make mrproper # Supprime tout
```

## Connexions

- [[C - compilation et linkage]] - Processus de build
- [[C - organisation multi-fichiers (headers)]] - Projets multi-fichiers

## Sources
- Fichier source : `0-Inbox/Apprendre le C/Les Bases/Makefile.md`

---
**Tags thématiques** : #makefile #build #compilation #automatisation
