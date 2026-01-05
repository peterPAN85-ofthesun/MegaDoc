---
type: permanent
created: 2026-01-05 15:43
tags:
  - permanent
  - cpp
  - poo
  - virtual
---

# C++ - Méthodes virtuelles

> [!abstract] Concept
> Méthodes marquées avec le mot-clé `virtual` qui permettent le polymorphisme dynamique en autorisant leur redéfinition dans les classes dérivées.

## Explication

Une **méthode virtuelle** est une méthode déclarée avec le mot-clé `virtual` dans la classe de base. Cette déclaration indique au compilateur que cette méthode peut être redéfinie dans les classes dérivées et que l'appel doit être résolu dynamiquement (à l'exécution).

Lorsqu'une méthode est virtuelle, le compilateur crée une **table virtuelle** (vtable) pour la classe, contenant les adresses des méthodes virtuelles. Chaque objet contient un pointeur vers cette table, permettant de trouver la bonne méthode à appeler selon le type réel de l'objet.

Il est recommandé (mais pas obligatoire) de répéter le mot-clé `virtual` dans les classes dérivées pour la clarté du code, bien que la virtualité soit automatiquement héritée.

## Exemples

### Exemple 1 : Déclaration de méthode virtuelle

```cpp
class Vehicule
{
    public:
    virtual void affiche() const;  // Méthode virtuelle
    virtual int nbrRoues() const;  // Autre méthode virtuelle
    virtual ~Vehicule();           // Destructeur virtuel
};

class Moto : public Vehicule
{
    public:
    virtual void affiche() const;  // Redéfinition (virtual optionnel)
    virtual int nbrRoues() const;  // Redéfinition
};
```

### Exemple 2 : Polymorphisme en action

```cpp
class Vehicule
{
    public:
    virtual void affiche() const {
        std::cout << "Véhicule générique" << std::endl;
    }
};

class Voiture : public Vehicule
{
    public:
    virtual void affiche() const {
        std::cout << "Voiture à 4 roues" << std::endl;
    }
};

int main() {
    Vehicule* v = new Voiture();
    v->affiche();  // Affiche : "Voiture à 4 roues"
    // Grâce à virtual, la méthode de Voiture est appelée

    delete v;
    return 0;
}
```

### Exemple 3 : Hiérarchie avec plusieurs niveaux

```cpp
class Animal
{
    public:
    virtual void parler() const {
        std::cout << "..." << std::endl;
    }
};

class Mammifere : public Animal
{
    public:
    virtual void parler() const {
        std::cout << "Son de mammifère" << std::endl;
    }
};

class Chien : public Mammifere
{
    public:
    virtual void parler() const {
        std::cout << "Wouaf !" << std::endl;
    }
};
```

## Cas d'usage

- **Polymorphisme** : Base du polymorphisme dynamique en C++
- **Interfaces** : Définir des contrats dans des classes de base
- **Extensibilité** : Permettre aux classes dérivées de spécialiser le comportement
- **Frameworks** : Créer des points d'extension pour les utilisateurs

## Avantages et inconvénients

✅ **Avantages** :
- Permet le polymorphisme dynamique
- Flexibilité et extensibilité du code
- Permet le design pattern Template Method
- Essentiel pour les architectures orientées objet

❌ **Inconvénients** / Limites :
- Surcoût mémoire (pointeur vtable par objet)
- Surcoût performance (indirection via vtable)
- Ne peut pas être inline (résolution dynamique)
- Augmente légèrement la complexité

## Connexions

### Notes liées
- [[C++ - Polymorphisme dynamique]] - Utilise les méthodes virtuelles
- [[C++ - Destructeur virtuel]] - Cas spécial crucial
- [[C++ - Classes abstraites]] - Utilisent des méthodes virtuelles pures

### Dans le contexte de
- [[C++ - Héritage]] - Les méthodes virtuelles nécessitent l'héritage
- [[MOC - C++ POO]] - Mécanisme central de la POO

## Commandes / Syntaxe

```cpp
// Déclaration
class Base {
    public:
    virtual void methode();        // Méthode virtuelle
    virtual void autre() const;    // Méthode virtuelle const
};

// Redéfinition dans classe dérivée
class Derivee : public Base {
    public:
    virtual void methode();        // virtual optionnel mais recommandé
    // OU en C++11+
    void methode() override;       // override explicite (recommandé)
};

// C++11 : mot-clé override
virtual void methode() override;   // Vérifie que la méthode surcharge bien

// C++11 : mot-clé final
virtual void methode() final;      // Empêche toute redéfinition ultérieure
```

## Ressources

- Source : [[C++ programmation orientée objet]]
- Documentation : https://openclassrooms.com/fr/courses/7137751-programmez-en-oriente-objet-avec-c
- Mécanisme : Virtual table (vtable) + Virtual pointer (vptr)

---

**Tags thématiques** : `#cpp` `#poo` `#virtual` `#polymorphisme` `#vtable`
