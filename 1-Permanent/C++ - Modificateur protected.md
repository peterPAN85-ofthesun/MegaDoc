---
type: permanent
created: 2026-01-05 15:39
tags:
  - permanent
  - cpp
  - poo
  - visibilite
---

# C++ - Modificateur protected

> [!abstract] Concept
> Niveau d'accès intermédiaire entre public et private, permettant aux classes dérivées d'accéder aux membres tout en les cachant du reste du monde.

## Explication

Le modificateur **protected** définit un niveau de visibilité spécifique à l'héritage. Les membres marqués `protected` sont :
- **Inaccessibles** depuis l'extérieur de la classe (comme `private`)
- **Accessibles** depuis les classes dérivées (contrairement à `private`)

Ce modificateur est crucial pour l'héritage : il permet de partager des données avec les classes filles sans exposer ces données au monde extérieur. C'est un compromis entre l'encapsulation stricte (`private`) et l'exposition complète (`public`).

En l'absence d'héritage, `protected` se comporte exactement comme `private`. Son utilité n'apparaît que dans les hiérarchies de classes.

## Exemples

### Exemple 1 : Utilisation basique

```cpp
class Personnage
{
    protected:
    int m_vie;           // Accessible aux classes filles
    std::string m_nom;

    private:
    int m_secret;        // Inaccessible aux classes filles

    public:
    void sePresenter() const;
};

class Guerrier : public Personnage
{
    public:
    void augmenterVie() {
        m_vie += 10;      // OK : m_vie est protected
        // m_secret++;    // ERREUR : m_secret est private
    }
};
```

### Exemple 2 : Accès externe

```cpp
int main() {
    Guerrier conan;
    // conan.m_vie = 100;  // ERREUR : protected inaccessible de l'extérieur
    // Même les membres protected ne sont pas accessibles hors de la hiérarchie

    return 0;
}
```

### Exemple 3 : Méthodes protected

```cpp
class Vehicule
{
    protected:
    void demarrerMoteur() {  // Méthode protected
        // Logique interne
    }

    public:
    void demarrer() {
        demarrerMoteur();  // Utilisé en interne
    }
};

class Voiture : public Vehicule
{
    public:
    void demarrerEnDouceur() {
        demarrerMoteur();  // OK depuis classe fille
    }
};
```

## Cas d'usage

- **Héritage** : Partager des membres avec classes dérivées
- **API interne** : Fournir des outils aux classes filles
- **Attributs communs** : Données utilisées dans toute la hiérarchie
- **Méthodes utilitaires** : Fonctions communes aux classes dérivées

## Avantages et inconvénients

✅ **Avantages** :
- Équilibre entre encapsulation et accessibilité
- Permet le partage contrôlé avec les classes filles
- Facilite l'extension de la classe
- Maintient l'encapsulation vis-à-vis de l'extérieur

❌ **Inconvénients** / Limites :
- Crée un couplage entre classe mère et filles
- Moins strict que `private` (peut mener à des abus)
- Complique la maintenance si mal utilisé
- Peut violer l'encapsulation dans les hiérarchies complexes

## Connexions

### Notes liées
- [[C++ - Héritage]] - Le protected n'a de sens qu'avec l'héritage
- [[C++ - Classes (structure header-source)]] - Défini dans la déclaration
- [[C++ - Masquage de méthodes]] - Les méthodes protected peuvent être masquées

### Dans le contexte de
- [[C - structures (struct)]] - Le C n'a pas de niveaux de visibilité
- [[MOC - C++ POO]] - Concept important pour l'héritage

## Commandes / Syntaxe

```cpp
class Classe
{
    public:
    // Accessible partout

    protected:
    // Accessible dans la classe et ses dérivées
    int m_attributProtege;
    void methodeProtegee();

    private:
    // Accessible uniquement dans la classe
};

// Ordre de visibilité (du plus au moins permissif)
// public > protected > private
```

## Ressources

- Source : [[C++ programmation orientée objet]]
- Documentation : https://openclassrooms.com/fr/courses/7137751-programmez-en-oriente-objet-avec-c
- Guideline : Préférer `private` par défaut, utiliser `protected` seulement si nécessaire

---

**Tags thématiques** : `#cpp` `#poo` `#visibilite` `#protected` `#heritage`
