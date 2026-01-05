---
type: permanent
created: 2026-01-05 15:38
tags:
  - permanent
  - cpp
  - poo
  - heritage
---

# C++ - Héritage

> [!abstract] Concept
> Mécanisme permettant à une classe (fille) de récupérer les attributs et méthodes d'une autre classe (mère), créant une relation "est-un".

## Explication

L'**héritage** est un des piliers de la programmation orientée objet. Il permet de créer une nouvelle classe basée sur une classe existante, réutilisant et étendant ses fonctionnalités. La classe dérivée (ou fille) **hérite** des membres de la classe de base (ou mère).

La syntaxe utilise le symbole `:` suivi du type d'héritage (`public`, `protected`, ou `private`) et du nom de la classe mère. L'héritage public est le plus courant : il maintient les niveaux d'accès de la classe mère.

L'héritage exprime une relation **"est-un"** : un Guerrier **est-un** Personnage, une Voiture **est-un** Véhicule. Cette relation doit être logique et naturelle pour éviter les mauvaises conceptions.

## Exemples

### Exemple 1 : Héritage basique

```cpp
// Classe mère (fichier Personnage.hpp)
class Personnage
{
    protected:
    int m_vie;
    std::string m_nom;

    public:
    void sePresenter() const;
};

// Classe fille (fichier Guerrier.hpp)
#include "Personnage.hpp"

class Guerrier : public Personnage
{
    public:
    void frapperAvecUnMarteau() const;
    // Hérite automatiquement de sePresenter()
};
```

### Exemple 2 : Utilisation

```cpp
int main() {
    Guerrier conan;
    conan.sePresenter();           // Hérité de Personnage
    conan.frapperAvecUnMarteau();  // Spécifique à Guerrier

    return 0;
}
```

### Exemple 3 : Hiérarchie de véhicules

```cpp
class Vehicule
{
    protected:
    int m_prix;

    public:
    void affiche() const;
};

class Voiture : public Vehicule
{
    private:
    int m_portes;

    public:
    void affiche() const;  // Peut redéfinir la méthode
};

class Moto : public Vehicule
{
    private:
    double m_vitesse;

    public:
    void affiche() const;
};
```

## Cas d'usage

- **Réutilisation de code** : Éviter la duplication en partageant du code commun
- **Spécialisation** : Créer des versions spécialisées d'une classe générale
- **Hiérarchies** : Modéliser des relations naturelles (Animal → Chien, Chat)
- **Polymorphisme** : Base pour l'utilisation du polymorphisme

## Avantages et inconvénients

✅ **Avantages** :
- Réutilisation du code existant
- Organisation logique et hiérarchique
- Facilite la maintenance (modification dans la classe mère)
- Permet le polymorphisme

❌ **Inconvénients** / Limites :
- Couplage fort entre classes mère et fille
- Hiérarchies complexes difficiles à maintenir
- Peut être mal utilisé (préférer la composition dans certains cas)
- Héritage multiple complexe en C++

## Connexions

### Notes liées
- [[C++ - Modificateur protected]] - Visibilité spéciale pour l'héritage
- [[C++ - Masquage de méthodes]] - Redéfinition dans la classe fille
- [[C++ - Polymorphisme dynamique]] - Utilise l'héritage avec méthodes virtuelles

### Dans le contexte de
- [[C - structures (struct)]] - Le C n'a pas d'héritage natif
- [[MOC - C++ POO]] - Pilier fondamental de la POO

## Commandes / Syntaxe

```cpp
// Syntaxe de base
class ClasseFille : public ClasseMere {
    // Membres additionnels
};

// Types d'héritage
class A : public B    { };  // Héritage public (le plus courant)
class A : protected B { };  // Héritage protégé
class A : private B   { };  // Héritage privé

// Héritage multiple (avancé, à éviter si possible)
class A : public B, public C { };
```

## Ressources

- Source : [[C++ programmation orientée objet]]
- Documentation : https://openclassrooms.com/fr/courses/7137751-programmez-en-oriente-objet-avec-c
- Principe : Relation "est-un" (is-a relationship)

---

**Tags thématiques** : `#cpp` `#poo` `#heritage` `#hierarchie` `#reutilisation`
