---
type: permanent
created: 2026-01-05 15:34
tags:
  - permanent
  - cpp
  - poo
  - const
---

# C++ - Méthodes const

> [!abstract] Concept
> Méthodes qui garantissent de ne pas modifier l'état de l'objet sur lequel elles sont appelées, marquées par le mot-clé `const` après leur signature.

## Explication

Une **méthode const** est une méthode membre qui promet de ne pas modifier les attributs de l'objet. Le mot-clé `const` est placé après la liste des paramètres dans la déclaration et la définition de la méthode.

Cette garantie est vérifiée par le compilateur : une méthode const ne peut pas modifier les attributs non-mutable de l'objet, ni appeler d'autres méthodes non-const. C'est un contrat formel qui améliore la sûreté du code.

Les méthodes const sont essentielles pour travailler avec des objets constants ou des références constantes. Sans elles, il serait impossible d'appeler des méthodes sur un objet `const`, même pour simplement lire ses données.

## Exemples

### Exemple 1 : Méthode const basique

```cpp
class Personnage
{
    private:
    int m_vie;
    bool m_enVie;

    public:
    bool SuisJeEnVie() const;  // Déclaration
};

// Implémentation
bool Personnage::SuisJeEnVie() const {
    return m_enVie;  // Lecture seule, pas de modification
}
```

### Exemple 2 : Utilisation avec référence const

```cpp
void afficherVie(Personnage const& perso) {
    // Fonction qui reçoit une référence constante
    if (perso.SuisJeEnVie()) {  // OK : méthode const
        std::cout << "Vivant" << std::endl;
    }
    // perso.prendreDegats(10);  // ERREUR si prendreDegats n'est pas const
}
```

### Exemple 3 : Différenciation const/non-const

```cpp
class Vecteur
{
    private:
    int* m_data;

    public:
    // Version non-const : retourne référence modifiable
    int& operator[](int index) {
        return m_data[index];
    }

    // Version const : retourne référence constante
    int const& operator[](int index) const {
        return m_data[index];
    }
};
```

## Cas d'usage

- **Méthodes d'accès** (getters) : Lire des attributs sans les modifier
- **Méthodes d'affichage** : Afficher l'état de l'objet
- **Opérateurs de comparaison** : `operator==`, `operator<`, etc.
- **Garantie d'immuabilité** : Documenter qu'une méthode est sûre à appeler

## Avantages et inconvénients

✅ **Avantages** :
- Sûreté : le compilateur vérifie qu'il n'y a pas de modification
- Documentation : indique clairement l'intention de la méthode
- Permet de travailler avec des objets const
- Optimisations possibles par le compilateur

❌ **Inconvénients** / Limites :
- Nécessite de marquer correctement toutes les méthodes non-modifiantes
- Peut être contraignant si on veut modifier des attributs de cache
- Le mot-clé `mutable` peut contourner const (à utiliser avec précaution)

## Connexions

### Notes liées
- [[C++ - Classes (structure header-source)]] - Les méthodes const font partie de l'interface
- [[C++ - Constructeur de copie]] - Prend une référence const en paramètre
- [[C++ - Surcharge opérateurs de flux]] - Souvent implémentée en const

### Dans le contexte de
- [[C - variables (déclaration et portée)]] - Extension du concept de const du C
- [[MOC - C++ POO]] - Bonne pratique essentielle en POO

## Commandes / Syntaxe

```cpp
// Déclaration
type nomMethode(params) const;

// Implémentation
type Classe::nomMethode(params) const {
    // Code qui ne modifie pas l'objet
}

// Attribut mutable (exception)
mutable int m_compteur;  // Peut être modifié même dans méthode const
```

## Ressources

- Source : [[C++ programmation orientée objet]]
- Documentation : https://openclassrooms.com/fr/courses/7137751-programmez-en-oriente-objet-avec-c
- Concept avancé : const-correctness

---

**Tags thématiques** : `#cpp` `#poo` `#const` `#immutabilité` `#sûreté`
