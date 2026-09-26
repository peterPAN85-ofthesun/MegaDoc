
**Source :** (https://cmake.org/cmake/help/latest/guide/tutorial/Before%20You%20Begin.html)

# 1 - Les Basiques

Plusieurs commandes incontournables

>*Indiquer le dossier source où se situe le fichier de conf `CMakeLists.txt` :*
```shell
cmake -S <dir>
```

>*Indiquer le dossier dans lequel on va générer le MakeFile*
```shell
cmake -B <dir>
```

>*Compiler le projet*
```shell
cmake --build <dir>
```

>*Changer de preset*
```shell
cmake -G Ninga
cmake -G "Unix MakeFiles"
```

>*Dans le cas d'un generateur multiconfiguration, on indique la config utilisé*
```shell
cmake --build build --config Debug
./build/Debug/hello
```

>[!Note]
>Il existe plusieurs *configs* par défaut :
>- Debug
>- Release
>- RelWithDebInfo
>- MinSizeRel


# 2 - Premiers pas

Le fichier `CMakeLists.txt` contient au minimum trois lignes :
- `cmake_minimum_required()`
- `project()`
- `add_executable()`

*Exemple :*
```cmake
cmake_minimum_required(VERSION 4.4.2)

project(Agro)

add_executable(Agro)
```

## a) `add_executable`()

On peut agrémenter `add_executable` avec un certain nombre d'option:
- *artefact kind* (éxécutables, librairies, header, ect ...)
- Fichiers sources
- *Include directories*
- Dépendances
- Flag de compilateur ou d'éditeur de lien
- Nom de sortie d'un éxécutable ou d'une librairie

On peut notemment ajouter à notre code des fichier sources :

```cmake
cmake_minimum_required(VERSION 4.4.2)

project(Agro)

add_executable(Agro ${SRCS})

target_sources(
	PRIVATE
		./src/main.c
)
```

>[!Note]
>Il existe 3 scopes de permissions pour les fichiers :
>- **PUBLIC :** fichiers destinés à être **utilisé** et **compilé**
>>La catégorie de fichier définie par `FILE_SET` est alors ajoutée à la variable `HEADER_SETS`
>- **PRIVATE :** fichiers destinés à être uniquement **compilé**
>>La catégorie de fichier définie par `FILE_SET` est alors ajoutée à la variable `INTERFACE_HEADER_SETS`
>- **INTERFACE :** fichiers destinés à être uniquement **utilisé**
>>La catégorie de fichier définie par `FILE_SET` est alors ajoutée à la variable `HEADER_SETS` **ET** `INTERFACE_HEADER_SETS`


On peut y ajouter des librairies :
```cmake
target_sources(MyLibrary
  PRIVATE
    library_implementation.cxx

  PUBLIC
    FILE_SET myHeaders
    TYPE HEADERS
    BASE_DIRS
      include
    FILES
      include/library_header.h
)
```

- **FILE_SET :** le nom de la collection de librairies
- **TYPE :** quels genre de fichiers sont-ils
- **BASE_DIRS :** dossier dans lequel on retrouve les fichiers, mis en option après le flag `-I` du compilateur
- **FILES :** liste des fichiers

Évidemment, on peut simplifier cette liste. On peut :
- soit lister fichier par fichier à l'aide de `FILES`
- soit inclure directement tout un dossier à l'aide de `BASE_DIRS`

*Exemple de simplification :*
```cmake
target_sources(MyLibrary
  PRIVATE
    library_implementation.cxx

  PUBLIC
	FILE_SET myHeaders
    TYPE HEADERS
    BASE_DIRS
      include
)
```

>[!Note]
>Pour créer une archive d'une librairie statique :
>- **1 :** `gcc -c lib.c -o lib.o` (`-o` est optionnel : il sert à renommer)
>- **2 :** `ar -rcs lib.o lib.a`

## b) `add_library`

Pour compiler à  destination d'une librairie `MyLibrary.a` :

```cmake
target_sources(MyLibrary
  PRIVATE
    library_implementation.cxx

  PUBLIC
    FILE_SET myHeaders
    TYPE HEADERS
    BASE_DIRS
      include
    FILES
      include/library_header.h
)
```

## c) Lié des librairies et des exécutables ensemble

Pour ajouter un lien vers une librairie déjà compilée, on utilise la commande `target_link_libraries()`

```cmake
target_link_libraries(MyProgram
  PRIVATE
    MyLibrary
)
```

*Exemple d'un CMakeLists.txt complet*
```
/
	lib/
		src/
			libhello.c
			libmath.c
	includes/
		custom.h
	src/
		main.c
	MakeLists.txt
```

```CMake
cmake_minimum_required(VERSION 4.4.3)

project(Agro)

add_library(math)
add_library(hello)
add_executable(Agro)

target_sources(math
	PRIVATE
		lib_bkp/src/libmath.c
)

target_sources(hello
	PRIVATE
		lib_bkp/src/libhello.c
)

target_link_libraries(Agro
	PRIVATE
		math
		hello
)

target_sources(Agro
	PRIVATE
		src/main.c

	PUBLIC
		FILE_SET custom
		TYPE HEADERS
		BASE_DIRS
			includes
)
```

### d) `add_subdirectory`

Il se peut que notre projet CMake soit lui même composé de plusieurs autre projets (librairies, exécutables...) avec leur propre `CMakeLists.txt`
Pour intégrer les mécaniques de build de ces *sous-projets* on utilise la commande `add_subdirectory(<dir>)`

Pour l'exemple, on a repris le cas précédent : une partie *librairie*, et une partie *main*
```
/
	lib/
		src/
			libhello.c
			libmath.c
		MakeLists.txt
	includes/
		custom.h
	src/
		main.c
	MakeLists.txt
```

**1 -** *MakeLists.txt* coté librairie
```cmake
add_library(math)
add_library(hello)

target_sources(math
	PRIVATE
		src/libmath.c
)

target_sources(hello
	PRIVATE
		src/libhello.c
)
```

**2 -** *MakeLIsts.txt* côté main
```cmake
cmake_minimum_required(VERSION 4.4.3)

project(Agro)

add_subdirectory(lib)
add_executable(Agro)

target_link_libraries(Agro
	PRIVATE
		math
		hello
)

target_sources(Agro
	PRIVATE
		src/main.c

	PUBLIC
		FILE_SET custom
		TYPE HEADERS
		BASE_DIRS
			includes
)
```

# 3 - Les fondamentaux du langage CMakeLang

## a) Les variables

```cmake
set(var "World")        #assigne "World" -> var
message("Hello ${var}") #affiche "Hello " puis "World"
```

```shell
$ cmake -P CMakelists.txt
```

>[!Note]
>Pour utiliser CMakeLists.txt comme un langage de programmation interprété, il faut utilisé l'option `-P` et s'assurer qu'il n'y pas de ligne `project()` dans le fichier.

CMakeLang ne supporte que les strings. Il faudra donc bien s'assurer d'avoir une convention "on/off" ou "true/false" pour les conditions
Les `list` et d'autres structures sont elles aussi des strings :

```cmake
set(stooges "Moe;Larry")
list(APPEND stooges "Curly")

message("Stooges contains: ${stooges}")

foreach(stooge IN LISTS stooges)
  message("Hello, ${stooge}")
endforeach()
```

```shell
$ cmake -P CMakeLists.txt
Stooges contains: Moe;Larry;Curly
Hello, Moe
Hello, Larry
Hello, Curly
```

## b) Macros, functions et lists

```cmake
macro(MyMacro MacroArgument)
  message("${MacroArgument}\n\t\tFrom Macro")
endmacro()

function(MyFunc FuncArgument)
  MyMacro("${FuncArgument}\n\tFrom Function")
endfunction()

MyFunc("From TopLevel")
```

```shell
$ cmake -P CMakeLists.txt
From TopLevel
      From Function
              From Macro
```

La différence entre fonctions et macro : les deux sont similaires, si ce n'est que les macros sont une sorte de *remplacement sémantique* de la même manière que dans le C ou le C++.

les variables créé dans une `functions()` de peuvent pas sortir du scope locale de la fonctions.