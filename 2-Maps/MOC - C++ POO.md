---
type: moc
created: 2026-01-05 16:30
tags:
  - moc
  - cpp
  - poo
  - programmation
---

# 🗺️ MOC - C++ Programmation Orientée Objet

> [!note] Vue d'ensemble
> Ce MOC organise les concepts fondamentaux de la Programmation Orientée Objet (POO) en C++, depuis la création de classes de base jusqu'aux concepts avancés comme le polymorphisme et les classes abstraites.

## Introduction

La programmation orientée objet en C++ repose sur plusieurs piliers : l'encapsulation (via les classes), l'héritage, le polymorphisme et l'abstraction. Ce MOC structure ces concepts selon une progression pédagogique naturelle.

## Structure thématique

### 📦 Classes et fondamentaux

Les bases de la création et manipulation d'objets en C++ :

- [[C++ - Classes (structure header-source)]]
- [[C++ - Constructeur par défaut]]
- [[C++ - Constructeur de copie]]
- [[C++ - Destructeur]]
- [[C++ - Méthodes const]]

### ⚙️ Surcharge d'opérateurs

Personnaliser le comportement des opérateurs pour vos classes :

- [[C++ - Surcharge opérateurs arithmétiques]]
- [[C++ - Surcharge opérateurs composés]]
- [[C++ - Surcharge opérateurs de flux]]

### 🌳 Héritage

Créer des hiérarchies de classes et réutiliser du code :

- [[C++ - Héritage]]
- [[C++ - Modificateur protected]]
- [[C++ - Masquage de méthodes]]

### 🎭 Polymorphisme

Permettre aux objets d'adopter plusieurs formes :

- [[C++ - Polymorphisme statique]]
- [[C++ - Polymorphisme dynamique]]
- [[C++ - Méthodes virtuelles]]
- [[C++ - Destructeur virtuel]]

### 🔧 Concepts avancés

Fonctionnalités avancées pour des designs complexes :

- [[C++ - Classes abstraites]]
- [[C++ - Méthodes statiques]]
- [[C++ - Attributs statiques]]
- [[C++ - Mot-clé friend]]

## Notes principales

Les concepts essentiels à maîtriser en priorité :

1. **[[C++ - Classes (structure header-source)]]** - Structure fondamentale d'une classe
2. **[[C++ - Héritage]]** - Réutilisation et extension de code
3. **[[C++ - Polymorphisme dynamique]]** - Flexibilité via méthodes virtuelles
4. **[[C++ - Classes abstraites]]** - Modèles et interfaces
5. **[[C++ - Destructeur virtuel]]** - Gestion mémoire correcte en héritage

## 🔗 Compilation et MOCs connexes

La séparation header/source d'une classe C++ est une instance du principe général « déclarer vs définir », et les erreurs de build qui en découlent obéissent aux mêmes règles qu'en C :

- [[C - en-tête et bibliothèque (déclarer vs définir)]] - Pourquoi `undefined reference` n'est jamais une erreur de compilation
- [[GCC - driver et non compilateur]] - Les quatre étapes et l'option qui s'adresse à chacune
- [[C - ordre de résolution des archives au link]] - Objets d'abord, bibliothèques ensuite
- [[ELF - Executable and Linkable Format]] - Le format du binaire et de la table des symboles
- [[C++ - Classes (structure header-source)]] - L'application directe en C++

MOCs :
- [[MOC - Programmation C]] - Le socle procédural et la chaîne de build
- [[MOC - CMake]] - Automatiser la compilation d'un projet C++
- [[MOC - Qt avec CMake]] - C++ appliqué au framework Qt

## Ressources externes

- [OpenClassrooms - Programmez en orienté objet avec C++](https://openclassrooms.com/fr/courses/7137751-programmez-en-oriente-objet-avec-c)

## 🚧 Concepts à développer

Sujets identifiés mais pas encore couverts :

- [ ] Templates et classes génériques
- [ ] Move semantics (constructeur/opérateur de déplacement)
- [ ] RAII (Resource Acquisition Is Initialization)
- [ ] Principe SOLID en C++
- [ ] Design patterns orientés objet (Factory, Observer, Strategy, etc.)
- [ ] Gestion des exceptions dans les classes
- [ ] Opérateurs de conversion (cast)
- [ ] Fonctions virtuelles pures et interfaces
- [ ] Héritage multiple et ses pièges
- [ ] Composition vs héritage

---
**Dernière mise à jour** : 2026-08-22
**Nombre de notes** : 19
