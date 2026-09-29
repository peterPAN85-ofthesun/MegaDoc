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

**Opérateurs :**
- `=` : évaluation différée
- `:=` : évaluation immédiate
- `?=` : autorise la surcharge par l'utilisateur, affecte la variable si seulement elle n'est pas déjà défini.
- `+=` : ajoute un élément à la variable déjà existante

>[!Note]
>**`=` vs `:=`** :
>- Avec `=` on peut faire référence à une variable définie plus bas, pas avec `:=` (Voir *Exemple 1* et *Exemple 2*)
>- L'auto référence est impossible avec `=`. 
>- `:=` n'est exécuté q'une seule fois, alors que `=` est exécuté à chaque ligne

*Exemple  1 :*
```Makefile
A := bonjour
B := $(A) monde
A := au revoir

all:
	@echo $(B)      # affiche : bonjour monde
```

*Exemple 2 :*
```Makefile
A = bonjour
B = $(A) monde
A = au revoir

all:
	@echo $(B)      # affiche : au revoir monde
```

*Exemple 3 :*
```Makefile
CFLAGS = $(CFLAGS) -Wall    # erreur : Recursive variable references itself
CFLAGS := $(CFLAGS) -Wall   # correct
```

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

## En vrac

### Ajouter un prefix à tous les éléments d'une liste

```Makefile
ARCH = $(addprefix $(BIN)/,$(OBJ:.o=.a))
```

Ici, on ajoute `$(BIN)/` avant chaque élément donné par la liste `$(OBJ:.o=.a)`

### Ajouter un suffix

même chose que pour les prefix :
```Makefile
$(addsuffix .c,foo)
```

### Extraire la partie "dossier" d'un fichier

```Makefile
$(dir src/foo.c)
```

Résultat :
```shell
'src/'
```

### Extraire la partie "Nom_fichier" d'un fichier

```Makefile
$(notdir src/foo.c)
```

Résultat :

```shell
'foo.c'
```
### Extraire le suffix d'un fichier

>[!Note]
>Par suffix, on entend l'extension


```Makefile
$(suffix src/foo.c)
```

Résultat:
```shell
'.c'
```

### Extraire la partie *"base-name"* d'un fichier

```Makefile
$(basename src/foo.c)
```

Résultat :
```shell
'src/foo'
```

### Joindre deux listes

Concatène les deux arguments mots à mots.

```Makefile
# exemple
$(join list1,list2)

# en pratique
$(join a b,.c .o)

# Résulat
'a.c b.o'
```

### Utiliser les paternes Shell pour définir une variable

Lorsqu'on assigne une variable dans un `Makefile`, on ne peut ps utiliser les paternes shell comme ceci :
```Makefile
OBJ = *o
```
Dans ce cas-ci, `OBJ` prend la valeur `"*.o"` et non pas *tous les fichiers qui finissent par ".o"*.
À cet effet, on utilise `wildcard`

```Makefile
OBJ := $(wildcard *o)
```

### Retourner le chemin absolue d'un fichier

```Makefile
$(realpath src/foo.c)  # Résoud les liens symboliques
$(abspath src/foo.c)   # Ne résoud pas les liens symboliques 
```
## Connexions

- [[C - compilation et linkage]] - Processus de build
- [[C - organisation multi-fichiers (headers)]] - Projets multi-fichiers

## Sources
- Fichier source : `0-Inbox/Apprendre le C/Les Bases/Makefile.md`

---
**Tags thématiques** : #makefile #build #compilation #automatisation
