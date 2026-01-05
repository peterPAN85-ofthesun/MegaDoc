---
type: permanent
created: 2026-01-05 15:45
tags:
  - permanent
  - cpp
  - poo
  - abstraction
---

# C++ - Classes abstraites

> [!abstract] Concept
> Classe contenant au moins une méthode virtuelle pure (= 0), servant de modèle et ne pouvant pas être instanciée directement.

## Explication

Une **classe abstraite** est une classe qui contient au moins une **méthode virtuelle pure**, marquée par `= 0` après sa déclaration. Cette classe sert de **modèle** ou d'**interface** et ne peut pas être utilisée pour créer des objets directement.

Les classes abstraites définissent un **contrat** : les classes dérivées doivent implémenter toutes les méthodes virtuelles pures pour devenir concrètes (instanciables). Si une classe dérivée n'implémente pas toutes les méthodes pures, elle reste abstraite.

Les classes abstraites sont essentielles pour définir des interfaces communes dans les architectures orientées objet et garantir qu'une certaine fonctionnalité sera présente dans toutes les classes dérivées.

## Exemples

### Exemple 1 : Classe abstraite basique

```cpp
class Vehicule
{
    protected:
    int m_prix;

    public:
    Vehicule(int prix) : m_prix(prix) {}

    virtual void affiche() const;
    virtual int nbrRoues() const = 0;  // Méthode virtuelle PURE
    virtual ~Vehicule();
};
// Vehicule est abstraite : on ne peut pas faire "new Vehicule()"
```

### Exemple 2 : Implémentation concrète

```cpp
class Voiture : public Vehicule
{
    private:
    int m_portes;

    public:
    Voiture(int prix, int portes)
        : Vehicule(prix), m_portes(portes) {}

    virtual int nbrRoues() const {  // Implémentation obligatoire
        return 4;
    }

    virtual void affiche() const {
        std::cout << "Voiture à " << nbrRoues() << " roues" << std::endl;
    }
};
// Voiture est concrète : on peut faire "new Voiture()"
```

### Exemple 3 : Utilisation polymorphe

```cpp
int main() {
    // Vehicule v(1000);  // ERREUR : classe abstraite !

    Vehicule* v1 = new Voiture(15000, 5);
    Vehicule* v2 = new Moto(8000);

    std::cout << v1->nbrRoues() << std::endl;  // 4
    std::cout << v2->nbrRoues() << std::endl;  // 2

    delete v1;
    delete v2;

    return 0;
}
```

### Exemple 4 : Interface pure

```cpp
class IDessinable  // Convention : 'I' pour Interface
{
    public:
    virtual void dessiner() const = 0;
    virtual void effacer() const = 0;
    virtual ~IDessinable() {}
};
// Toutes les méthodes sont pures : interface pure
```

## Cas d'usage

- **Interfaces** : Définir des contrats que les classes doivent respecter
- **Frameworks** : Fournir des points d'extension obligatoires
- **Architecture** : Organiser le code avec des abstractions claires
- **Polymorphisme** : Base commune pour des classes hétérogènes

## Avantages et inconvénients

✅ **Avantages** :
- Force l'implémentation de méthodes critiques
- Définit des interfaces claires et explicites
- Permet le polymorphisme avec garanties
- Améliore la conception orientée objet

❌ **Inconvénients** / Limites :
- Ne peut pas être instanciée directement
- Peut compliquer la hiérarchie des classes
- Nécessite des pointeurs/références pour l'utilisation
- Surcoût de la virtualité

## Connexions

### Notes liées
- [[C++ - Méthodes virtuelles]] - Les classes abstraites utilisent des méthodes virtuelles pures
- [[C++ - Polymorphisme dynamique]] - Les classes abstraites sont utilisées polymorphiquement
- [[C++ - Destructeur virtuel]] - Toujours virtuel dans les classes abstraites

### Dans le contexte de
- [[C++ - Héritage]] - Base de l'utilisation des classes abstraites
- [[MOC - C++ POO]] - Concept avancé de la POO

## Commandes / Syntaxe

```cpp
// Déclaration de méthode virtuelle pure
class Abstraite {
    public:
    virtual void methode() = 0;  // = 0 : méthode pure
    virtual ~Abstraite() {}      // Destructeur virtuel obligatoire
};

// Classe dérivée concrète
class Concrete : public Abstraite {
    public:
    virtual void methode() {     // Implémentation obligatoire
        // Code
    }
};

// Utilisation
// Abstraite a;              // ERREUR : classe abstraite
Abstraite* ptr = new Concrete();  // OK : pointeur vers classe concrète
```

## Ressources

- Source : [[C++ programmation orientée objet]]
- Documentation : https://openclassrooms.com/fr/courses/7137751-programmez-en-oriente-objet-avec-c
- Design : Similar to Java interfaces / C# abstract classes

---

**Tags thématiques** : `#cpp` `#poo` `#abstraction` `#interface` `#virtual-pure`
