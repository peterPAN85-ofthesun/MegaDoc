---
type: permanent
created: 2026-01-05 15:31
tags:
  - permanent
  - cpp
  - poo
  - constructeur
---

# C++ - Constructeur par défaut

> [!abstract] Concept
> Méthode spéciale appelée automatiquement lors de la création d'un objet, permettant d'initialiser ses attributs avec des valeurs par défaut.

## Explication

Le **constructeur par défaut** est une méthode qui porte le même nom que la classe et qui ne prend aucun paramètre (ou uniquement des paramètres avec valeurs par défaut). Il est automatiquement appelé lors de l'instanciation d'un objet.

Son rôle principal est d'initialiser les attributs de l'objet dans un état cohérent et sûr. En C++, si aucun constructeur n'est défini, le compilateur génère automatiquement un constructeur par défaut qui initialise les attributs de manière basique (souvent à des valeurs indéterminées pour les types primitifs).

La syntaxe moderne utilise une **liste d'initialisation** (après le `:`) qui est plus efficace que l'assignation dans le corps du constructeur. Cette liste permet d'initialiser directement les membres au moment de leur construction.

## Exemples

### Exemple 1 : Constructeur avec liste d'initialisation

```cpp
class Personnage
{
    private:
    int m_vie;
    bool m_enVie;

    public:
    Personnage(); // Déclaration dans .hpp
};

// Définition dans .cpp
Personnage::Personnage() : m_vie(100), m_enVie(true)
{
    // Corps vide : tout est initialisé dans la liste
}
```

### Exemple 2 : Constructeur avec valeurs par défaut

```cpp
class Voiture
{
    private:
    std::string m_marque;
    int m_annee;

    public:
    Voiture() : m_marque("Inconnue"), m_annee(2020) {}
};
```

## Cas d'usage

- **Initialisation sécurisée** : Garantir que tous les objets sont dans un état valide dès leur création
- **Valeurs par défaut** : Créer des objets sans paramètres avec des valeurs sensées
- **Tableaux d'objets** : Nécessaire pour créer un tableau d'objets (`Personnage joueurs[10];`)

## Avantages et inconvénients

✅ **Avantages** :
- Garantit l'initialisation correcte des attributs
- Évite les bugs liés aux variables non initialisées
- Permet la création d'objets sans paramètres
- Liste d'initialisation plus performante que l'assignation

❌ **Inconvénients** / Limites :
- Peut masquer la nécessité de paramètres (objet créé dans un état potentiellement non-significatif)
- Si valeurs par défaut non pertinentes, peut créer des objets invalides

## Connexions

### Notes liées
- [[C++ - Constructeur de copie]] - Autre type de constructeur spécialisé
- [[C++ - Destructeur]] - Méthode symétrique appelée à la destruction
- [[C++ - Classes (structure header-source)]] - Organisation de la déclaration et définition

### Dans le contexte de
- [[C - structures (struct)]] - Le C n'a pas de constructeurs, d'où leur importance en C++
- [[MOC - C++ POO]] - Concept fondamental de la POO

## Commandes / Syntaxe

```cpp
// Utilisation
int main() {
    Personnage hero;  // Appel automatique du constructeur
    Personnage* ptr = new Personnage();  // Avec allocation dynamique
    delete ptr;
    return 0;
}
```

## Ressources

- Source : [[C++ programmation orientée objet]]
- Documentation : https://openclassrooms.com/fr/courses/7137751-programmez-en-oriente-objet-avec-c

---

**Tags thématiques** : `#cpp` `#poo` `#constructeur` `#initialisation`
