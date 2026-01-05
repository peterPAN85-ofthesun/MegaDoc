---
type: permanent
created: 2026-01-05 15:33
tags:
  - permanent
  - cpp
  - poo
  - destructeur
---

# C++ - Destructeur

> [!abstract] Concept
> Méthode spéciale appelée automatiquement lors de la destruction d'un objet, permettant de libérer les ressources allouées.

## Explication

Le **destructeur** est une méthode qui porte le nom de la classe précédé du symbole `~`. Il est automatiquement appelé lorsqu'un objet est détruit : en fin de portée pour un objet local, ou lors d'un `delete` pour un objet alloué dynamiquement.

Le destructeur ne prend aucun paramètre et n'a pas de type de retour. Son rôle principal est de **libérer les ressources** acquises durant la vie de l'objet : mémoire allouée, fichiers ouverts, connexions réseau, etc.

Un destructeur bien conçu garantit qu'il n'y a pas de fuite de ressources (memory leak). Il est essentiel pour une gestion robuste de la mémoire et suit le principe **RAII** (Resource Acquisition Is Initialization).

## Exemples

### Exemple 1 : Destructeur basique

```cpp
class Personnage
{
    public:
    ~Personnage(); // Déclaration
};

// Implémentation
Personnage::~Personnage()
{
    // Nettoyage si nécessaire
    // Si aucune ressource dynamique, peut rester vide
}
```

### Exemple 2 : Destructeur avec libération mémoire

```cpp
class Tableau
{
    private:
    int* m_donnees;

    public:
    Tableau(int taille) {
        m_donnees = new int[taille];
    }

    ~Tableau() {
        delete[] m_donnees;  // Libération obligatoire !
    }
};
```

### Exemple 3 : Ordre d'appel

```cpp
int main() {
    Personnage hero;  // Construction
    {
        Personnage ennemi;  // Construction
    }  // Destruction de ennemi (fin de portée)

    return 0;  // Destruction de hero (fin de main)
}
```

## Cas d'usage

- **Libération mémoire** : Supprimer les allocations dynamiques (new/delete)
- **Fermeture fichiers** : Fermer les fichiers ouverts
- **Libération ressources** : Fermer connexions réseau, mutex, etc.
- **Logging** : Tracer la destruction pour le débogage

## Avantages et inconvénients

✅ **Avantages** :
- Automatique : pas besoin d'appeler manuellement
- Garantit le nettoyage même en cas d'exception
- Implémente le principe RAII
- Prévient les fuites de mémoire

❌ **Inconvénients** / Limites :
- Ne doit jamais lever d'exception
- L'ordre de destruction peut être critique dans les hiérarchies
- Oubli fréquent pour les ressources non-mémoire

## Connexions

### Notes liées
- [[C++ - Constructeur par défaut]] - Méthode symétrique à la construction
- [[C++ - Constructeur de copie]] - Forme la "Rule of Three" avec destructeur
- [[C++ - Destructeur virtuel]] - Version polymorphe du destructeur

### Dans le contexte de
- [[C - allocation dynamique (malloc free)]] - Équivalent du free en C
- [[MOC - C++ POO]] - Concept fondamental de la POO

## Commandes / Syntaxe

```cpp
// Déclaration standard
~NomClasse();

// Règle des 3 (Rule of Three)
// Si vous définissez l'un, définissez les 3 :
// - Constructeur de copie
// - Opérateur d'affectation (operator=)
// - Destructeur
```

## Ressources

- Source : [[C++ programmation orientée objet]]
- Documentation : https://openclassrooms.com/fr/courses/7137751-programmez-en-oriente-objet-avec-c
- Principe : RAII (Resource Acquisition Is Initialization)

---

**Tags thématiques** : `#cpp` `#poo` `#destructeur` `#mémoire` `#RAII`
