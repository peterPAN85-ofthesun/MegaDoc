---
banner: "![[project_management_coursefees.avif]]"
Software: Cmake
Version: v4.1.2
Type: Tuto
Auteur: PeterPan
DateCreation:
WorkInProgress: false
tags:
Sources:
  - https://cmake.org/cmake/help/latest/guide/tutorial/A%20Basic%20Starting%20Point.html
  - 
cssclasses:
  - show_properties
---
Créé : `=this.file.ctime`
Dernière modification : `=this.file.mtime`

## 1 - Créer un projet

```bash
# "-S ." : créer un projet à partir du dossier ouvert (S comme Soure Directory)
# "-B build/" : créer un dossier de build (B comme Build Directory)

cmake -S . -B build
```

## 2 - Éditer le CMakeList.txt

```CMake
cmake_minimum_required(VERSION 3.16)

project(MonPojet VERSION 0.1 LANGUAGES CXX) #adapter CXX suivant le langage

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON) #version c++ requise

set(CMAKE_CXX_FLAGS_INIT "-Werror -Wall -Wextra")
set(CMAKE_CXX_FLAGS_RELEASE "")
set(CMAKE_CXX_FLAGS_DEBUG "-g")

set(CMAKE_EXPORT_COMPILE_COMMANDS ON) #génère un fichier compile_command.json
#Utile pour les sereurs LSP comme clangd

#on ajoute dans la variable PROJECT_SOURCES l'ensemble des fichiers sources
file(GLOB_RECURSE PROJECT_SOURCES
	"${CMAKE_CURRENT_SOURCE_DIR}/*.cpp"
	"${CMAKE_CURRENT_SOURCE_DIR}/*.hpp"
)

add_executable(${PROJECT_NAME} ${PROJECT_SOURCES})
```

## 3 - Compiler

```bash
cmake --build ./build/

cmake --build ./build/ CMAKE_BUILD_TYPE=VALUE
#List of value :
# - Debug
# - Release
# - RelWithDebInfo
# - MinSizeRel
```

