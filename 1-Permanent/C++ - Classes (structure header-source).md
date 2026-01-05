---
type: permanent
created: 2026-01-05 15:30
tags:
  - permanent
  - cpp
  - poo
  - structure
---

# C++ - Classes (structure header-source)

> [!abstract] Concept
> Organisation du code C++ en fichiers séparés : déclaration dans le header (.hpp) et implémentation dans le source (.cpp).

## Explication

En C++, la bonne pratique consiste à séparer la **déclaration** de la **définition** d'une classe. Cette séparation améliore la lisibilité, facilite la compilation et respecte le principe d'encapsulation.

Le **fichier header** (.hpp ou .h) contient la déclaration de la classe : les attributs (membres de données) et les signatures des méthodes. Il définit l'interface publique de la classe.

Le **fichier source** (.cpp) contient l'implémentation des méthodes. C'est ici que le comportement réel de la classe est défini. Cette séparation permet de cacher les détails d'implémentation et de ne révéler que l'interface nécessaire aux utilisateurs de la classe.

## Exemples

### Exemple 1 : Fichier header (Personnage.hpp)

```cpp
class Personnage
{
    private:
    int m_vie;
    bool m_enVie;

    public:
    Personnage(); // Constructeur
    Personnage(Personnage const& persoACopier); // Constructeur de copie
    ~Personnage(); // Destructeur
    bool SuisJeEnVie() const;
};
```

### Exemple 2 : Fichier source (Personnage.cpp)

```cpp
#include "Personnage.hpp"

Personnage::Personnage() : m_vie(100), m_enVie(true) {}

Personnage::Personnage(Personnage const& persoACopier)
    : m_vie(persoACopier.m_vie), m_enVie(persoACopier.m_enVie) {}

Personnage::~Personnage() {}

bool Personnage::SuisJeEnVie() const {
    return m_enVie;
}
```

## Cas d'usage

- **Bibliothèques** : Distribuer uniquement les headers pour cacher l'implémentation
- **Projets volumineux** : Réduire le temps de compilation en séparant déclaration et définition
- **Travail en équipe** : Permettre à plusieurs développeurs de travailler sur différentes parties

## Avantages et inconvénients

✅ **Avantages** :
- Réduction du temps de compilation (seuls les fichiers modifiés sont recompilés)
- Encapsulation forte : l'implémentation peut changer sans affecter les utilisateurs
- Meilleure organisation du code
- Facilite la distribution de bibliothèques (headers + binaires)

❌ **Inconvénients** / Limites :
- Duplication apparente : déclaration dans .hpp, définition dans .cpp
- Légère complexité supplémentaire pour les débutants
- Nécessite une gestion rigoureuse des dépendances (include guards)

## Connexions

### Notes liées
- [[C++ - Constructeur par défaut]] - Déclaré dans le header, défini dans le source
- [[C++ - Modificateur protected]] - Utilisé dans la déclaration de classe
- [[C - organisation multi-fichiers (headers)]] - Même principe appliqué au C

### Dans le contexte de
- [[C - compilation et linkage]] - La séparation header/source facilite le linkage
- [[MOC - C++ POO]] - Fait partie des fondamentaux de la POO en C++

## Commandes / Syntaxe

```bash
# Compilation typique
g++ -c Personnage.cpp -o Personnage.o
g++ main.cpp Personnage.o -o programme
```

## Ressources

- Source : [[C++ programmation orientée objet]]
- Documentation : https://openclassrooms.com/fr/courses/7137751-programmez-en-oriente-objet-avec-c

---

**Tags thématiques** : `#cpp` `#poo` `#structure` `#organisation-code`
