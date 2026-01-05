---
type: permanent
created: 2026-01-05 15:41
tags:
  - permanent
  - cpp
  - poo
  - polymorphisme
---

# C++ - Polymorphisme statique

> [!abstract] Concept
> Résolution à la compilation du type et de la méthode à appeler, basée sur le type déclaré (statique) de la variable, non son type réel.

## Explication

Le **polymorphisme statique** (ou *early binding*) est le comportement par défaut en C++ lorsque les méthodes ne sont pas virtuelles. Le compilateur détermine **à la compilation** quelle version d'une méthode appeler, en se basant sur le type déclaré de la variable.

Avec le polymorphisme statique, si on passe un objet dérivé via une référence ou pointeur vers la classe de base, c'est la méthode de la **classe de base** qui sera appelée, même si l'objet est en réalité d'une classe dérivée.

Ce comportement est efficace (pas de surcoût à l'exécution) mais ne permet pas le polymorphisme véritable. Pour obtenir un comportement polymorphe, il faut utiliser des méthodes virtuelles.

## Exemples

### Exemple 1 : Résolution statique

```cpp
class Vehicule
{
    public:
    void affiche() const {
        std::cout << "Ceci est un véhicule" << std::endl;
    }
};

class Moto : public Vehicule
{
    public:
    void affiche() const {
        std::cout << "Ceci est une moto" << std::endl;
    }
};

void presenter(Vehicule v) {  // Passage par VALEUR
    v.affiche();
}

int main() {
    Vehicule v;
    presenter(v);  // Affiche : "Ceci est un véhicule"

    Moto m;
    presenter(m);  // Affiche : "Ceci est un véhicule" (!)
    // m est copié comme Vehicule (slicing)

    return 0;
}
```

### Exemple 2 : Slicing (découpage d'objet)

```cpp
int main() {
    Moto m;
    Vehicule v = m;  // Copie ! Seule la partie Vehicule est copiée

    v.affiche();  // Affiche : "Ceci est un véhicule"
    // Les données spécifiques à Moto sont perdues

    return 0;
}
```

### Exemple 3 : Type déclaré vs type réel

```cpp
void afficherType(Vehicule v) {
    v.affiche();  // Toujours la version Vehicule
}

int main() {
    Moto honda;
    Voiture toyota;

    afficherType(honda);    // "Ceci est un véhicule"
    afficherType(toyota);   // "Ceci est un véhicule"
    // Aucun polymorphisme, tout est vu comme Vehicule

    return 0;
}
```

## Cas d'usage

- **Performance** : Pas de surcoût à l'exécution
- **Fonctions template** : Résolution à la compilation
- **Types connus** : Quand le type exact est toujours connu
- **Optimisation** : Le compilateur peut optimiser agressivement

## Avantages et inconvénients

✅ **Avantages** :
- Très performant (aucun surcoût à l'exécution)
- Résolution déterministe et prévisible
- Permet les optimisations du compilateur (inlining)
- Simple à comprendre

❌ **Inconvénients** / Limites :
- Pas de véritable polymorphisme
- Slicing lors de la copie d'objets dérivés
- Ne permet pas le traitement uniforme d'objets hétérogènes
- Comportement souvent contre-intuitif pour les débutants

## Connexions

### Notes liées
- [[C++ - Polymorphisme dynamique]] - Alternative avec résolution à l'exécution
- [[C++ - Méthodes virtuelles]] - Permettent le polymorphisme dynamique
- [[C++ - Masquage de méthodes]] - Lié au polymorphisme statique

### Dans le contexte de
- [[C - fonctions (déclaration et appel)]] - Le C a seulement du statique
- [[MOC - C++ POO]] - Concept fondamental du polymorphisme

## Commandes / Syntaxe

```cpp
// Polymorphisme statique (comportement par défaut)
class Base {
    public:
    void methode() { }  // NON virtuelle
};

class Derivee : public Base {
    public:
    void methode() { }  // Masque Base::methode
};

// Résolution basée sur le type statique
Base* ptr = new Derivee();
ptr->methode();  // Appelle Base::methode (type déclaré = Base*)
```

## Ressources

- Source : [[C++ programmation orientée objet]]
- Documentation : https://openclassrooms.com/fr/courses/7137751-programmez-en-oriente-objet-avec-c
- Concept : Early binding / Static dispatch

---

**Tags thématiques** : `#cpp` `#poo` `#polymorphisme` `#statique` `#compilation`
