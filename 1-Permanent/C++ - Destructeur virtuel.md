---
type: permanent
created: 2026-01-05 15:44
tags:
  - permanent
  - cpp
  - poo
  - virtual
  - destructeur
---

# C++ - Destructeur virtuel

> [!abstract] Concept
> Destructeur marqué `virtual` dans la classe de base pour garantir que le destructeur approprié est appelé lors de la destruction d'un objet via un pointeur de base.

## Explication

Un **destructeur virtuel** est crucial dans les hiérarchies de classes utilisant le polymorphisme. Sans destructeur virtuel, détruire un objet dérivé via un pointeur vers la classe de base n'appelle que le destructeur de la base, causant des **fuites de mémoire**.

Lorsque le destructeur de la classe de base est marqué `virtual`, le destructeur de la classe dérivée est automatiquement appelé en premier, puis celui de la classe de base. Cela garantit une destruction complète et correcte.

**Règle d'or** : Si une classe a au moins une méthode virtuelle, son destructeur doit être virtuel. Si une classe est destinée à être héritée et utilisée de manière polymorphe, son destructeur doit être virtuel.

## Exemples

### Exemple 1 : Problème sans destructeur virtuel

```cpp
class Vehicule
{
    public:
    ~Vehicule() {  // NON virtuel (DANGER !)
        std::cout << "Destruction Vehicule" << std::endl;
    }
};

class Voiture : public Vehicule
{
    private:
    int* m_donnees;

    public:
    Voiture() {
        m_donnees = new int[1000];  // Allocation
    }

    ~Voiture() {
        delete[] m_donnees;  // Libération
        std::cout << "Destruction Voiture" << std::endl;
    }
};

int main() {
    Vehicule* v = new Voiture();
    delete v;
    // Affiche seulement : "Destruction Vehicule"
    // Le destructeur de Voiture n'est PAS appelé !
    // FUITE MÉMOIRE : m_donnees n'est jamais libéré !

    return 0;
}
```

### Exemple 2 : Solution avec destructeur virtuel

```cpp
class Vehicule
{
    public:
    virtual ~Vehicule() {  // Destructeur VIRTUEL
        std::cout << "Destruction Vehicule" << std::endl;
    }
};

class Voiture : public Vehicule
{
    private:
    int* m_donnees;

    public:
    Voiture() {
        m_donnees = new int[1000];
    }

    virtual ~Voiture() {  // virtual hérité automatiquement
        delete[] m_donnees;
        std::cout << "Destruction Voiture" << std::endl;
    }
};

int main() {
    Vehicule* v = new Voiture();
    delete v;
    // Affiche :
    // "Destruction Voiture"
    // "Destruction Vehicule"
    // Ordre correct ! Pas de fuite !

    return 0;
}
```

### Exemple 3 : Destructeur virtuel même si vide

```cpp
class Animal
{
    public:
    virtual void parler() const = 0;  // Méthode virtuelle pure
    virtual ~Animal() {}  // Destructeur virtuel OBLIGATOIRE
    // Même s'il est vide, il doit être virtuel !
};
```

## Cas d'usage

- **Hiérarchies polymorphes** : Toujours avec polymorphisme dynamique
- **Classes abstraites** : Obligatoire pour les classes de base abstraites
- **Gestion mémoire** : Éviter les fuites lors de la destruction
- **Frameworks** : Classes de base extensibles

## Avantages et inconvénients

✅ **Avantages** :
- Évite les fuites mémoire critiques
- Garantit la destruction complète des objets
- Destruction dans le bon ordre (dérivée puis base)
- Essentiel pour la correction du code polymorphe

❌ **Inconvénients** / Limites :
- Léger surcoût (vtable)
- Augmente la taille de l'objet (vptr)
- Peut être oublié par les débutants
- Nécessaire même si le destructeur est vide

## Connexions

### Notes liées
- [[C++ - Destructeur]] - Concept de base du destructeur
- [[C++ - Méthodes virtuelles]] - Même mécanisme que les autres méthodes virtuelles
- [[C++ - Polymorphisme dynamique]] - Contexte d'utilisation

### Dans le contexte de
- [[C - allocation dynamique (malloc free)]] - Libération mémoire
- [[MOC - C++ POO]] - Bonne pratique critique en POO

## Commandes / Syntaxe

```cpp
// Déclaration dans classe de base
class Base {
    public:
    virtual ~Base();  // Destructeur virtuel
};

// Dans classe dérivée (virtual automatique)
class Derivee : public Base {
    public:
    ~Derivee();  // Automatiquement virtuel
    // OU explicitement
    virtual ~Derivee();
};

// Règle : Si méthode virtuelle existe, destructeur doit être virtuel
class Classe {
    public:
    virtual void methode();
    virtual ~Classe();  // OBLIGATOIRE !
};
```

## Ressources

- Source : [[C++ programmation orientée objet]]
- Documentation : https://openclassrooms.com/fr/courses/7137751-programmez-en-oriente-objet-avec-c
- **IMPORTANT** : Règle de base de la POO en C++

---

**Tags thématiques** : `#cpp` `#poo` `#virtual` `#destructeur` `#mémoire` `#critique`
