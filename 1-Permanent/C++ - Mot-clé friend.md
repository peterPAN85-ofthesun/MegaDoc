---
type: permanent
created: 2026-01-05 15:48
tags:
  - permanent
  - cpp
  - poo
  - friend
---

# C++ - Mot-clé friend

> [!abstract] Concept
> Mécanisme permettant à une fonction ou classe externe d'accéder aux membres privés et protégés d'une classe, brisant temporairement l'encapsulation.

## Explication

Le mot-clé **friend** accorde à une fonction ou une classe externe un accès privilégié aux membres privés et protégés d'une classe. C'est une exception au principe d'encapsulation, à utiliser avec parcimonie.

Une fonction amie (`friend function`) est déclarée dans la classe mais n'est pas une méthode membre. Elle est définie en dehors de la classe comme une fonction normale, mais peut accéder aux membres privés de la classe.

L'amitié est **non réciproque** (si A est ami de B, B n'est pas automatiquement ami de A) et **non transitive** (si A est ami de B et B ami de C, A n'est pas ami de C). L'amitié doit être explicitement accordée.

## Exemples

### Exemple 1 : Fonction amie basique

```cpp
class MaClasse
{
    private:
    int m_secret;

    public:
    MaClasse(int val) : m_secret(val) {}

    friend void afficherSecret(MaClasse const& obj);
};

// Définition de la fonction amie (en dehors de la classe)
void afficherSecret(MaClasse const& obj)
{
    // Peut accéder au membre privé m_secret !
    std::cout << "Secret : " << obj.m_secret << std::endl;
}
```

### Exemple 2 : Opérateur de flux (cas pratique)

```cpp
class Duree
{
    private:
    int m_heures;
    int m_minutes;
    int m_secondes;

    void afficher(ostream& flux) const {
        flux << m_heures << "h" << m_minutes << "m" << m_secondes << "s";
    }

    // Déclaration de l'ami
    friend std::ostream& operator<<(std::ostream& flux, Duree const& duree);
};

// Implémentation
std::ostream& operator<<(std::ostream& flux, Duree const& duree)
{
    duree.afficher(flux);  // Accède à la méthode privée
    return flux;
}
```

### Exemple 3 : Classe amie

```cpp
class Coffre
{
    private:
    int m_tresor;

    public:
    Coffre(int tresor) : m_tresor(tresor) {}

    friend class Voleur;  // Classe entière amie
};

class Voleur
{
    public:
    void voler(Coffre& coffre) {
        // Peut accéder aux membres privés de Coffre
        int butin = coffre.m_tresor;
        coffre.m_tresor = 0;
        std::cout << "Volé : " << butin << std::endl;
    }
};
```

## Cas d'usage

- **Opérateurs de flux** : `operator<<` et `operator>>` nécessitent l'accès aux membres privés
- **Opérateurs binaires** : `operator+`, `operator==` implémentés comme fonctions externes
- **Classes étroitement liées** : Deux classes qui travaillent ensemble intimement
- **Tests unitaires** : Accorder l'amitié aux classes de test (controversé)

## Avantages et inconvénients

✅ **Avantages** :
- Permet une syntaxe naturelle pour les opérateurs
- Évite de créer trop de getters/setters
- Utile pour les classes étroitement couplées
- Plus flexible que les méthodes membres pour certains opérateurs

❌ **Inconvénients** / Limites :
- Brise l'encapsulation (principale critique)
- Peut créer un couplage fort entre classes
- Facile à abuser, rendant le code difficile à maintenir
- Rend les dépendances moins évidentes

## Connexions

### Notes liées
- [[C++ - Surcharge opérateurs de flux]] - Utilise massivement friend
- [[C++ - Surcharge opérateurs arithmétiques]] - Souvent implémentés comme amis
- [[C++ - Classes (structure header-source)]] - friend déclaré dans le header

### Dans le contexte de
- [[MOC - C++ POO]] - Exception au principe d'encapsulation

## Commandes / Syntaxe

```cpp
// Fonction amie
class Classe {
    private:
    int m_prive;

    public:
    friend void fonctionAmie(Classe const& obj);
    friend Type fonctionAmie2(params);
};

// Classe amie
class A {
    friend class B;  // Toute la classe B est amie
};

// Méthode d'une autre classe amie
class A {
    friend void B::methode(A const& a);
};

// Opérateur ami (pattern courant)
class Type {
    friend std::ostream& operator<<(std::ostream&, Type const&);
    friend Type operator+(Type const&, Type const&);
};
```

## Ressources

- Source : [[C++ programmation orientée objet]]
- Documentation : https://openclassrooms.com/fr/courses/7137751-programmez-en-oriente-objet-avec-c
- **Guideline** : À utiliser avec modération !

---

**Tags thématiques** : `#cpp` `#poo` `#friend` `#encapsulation` `#acces`
