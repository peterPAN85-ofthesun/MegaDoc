---
type: permanent
created: 2026-01-05 15:40
tags:
  - permanent
  - cpp
  - poo
  - heritage
---

# C++ - Masquage de méthodes

> [!abstract] Concept
> Redéfinition d'une méthode héritée dans une classe fille, qui prend alors le dessus sur la version de la classe mère.

## Explication

Le **masquage de méthodes** (ou *method hiding*) se produit lorsqu'une classe dérivée définit une méthode avec la même signature qu'une méthode de sa classe mère. La version de la classe fille "masque" alors la version héritée.

Par défaut (sans le mot-clé `virtual`), c'est une **résolution statique** : le compilateur choisit la méthode à appeler en fonction du type déclaré de la variable, pas de son type réel. C'est différent du polymorphisme dynamique.

Pour appeler explicitement la version de la classe mère depuis la classe fille, on utilise l'opérateur de résolution de portée `::` avec le nom de la classe mère.

## Exemples

### Exemple 1 : Masquage basique

```cpp
class Personnage
{
    public:
    void sePresenter() const {
        std::cout << "Je suis un personnage." << std::endl;
    }
};

class Guerrier : public Personnage
{
    public:
    void sePresenter() const {
        std::cout << "Je suis un Guerrier redoutable." << std::endl;
    }
    // Masque la méthode de Personnage
};
```

### Exemple 2 : Appel de la méthode masquée

```cpp
class Guerrier : public Personnage
{
    public:
    void sePresenter() const {
        Personnage::sePresenter();  // Appel explicite de la version parent
        std::cout << "Je suis un Guerrier redoutable." << std::endl;
    }
};

int main() {
    Guerrier conan;
    conan.sePresenter();
    // Affiche :
    // Je suis un personnage.
    // Je suis un Guerrier redoutable.

    return 0;
}
```

### Exemple 3 : Résolution statique

```cpp
int main() {
    Guerrier g;
    Personnage p = g;  // Copie, pas polymorphisme !

    g.sePresenter();  // Affiche : "Je suis un Guerrier redoutable."
    p.sePresenter();  // Affiche : "Je suis un personnage."
    // Type statique = Personnage

    return 0;
}
```

## Cas d'usage

- **Spécialisation** : Adapter le comportement d'une méthode pour une classe fille
- **Extension** : Ajouter des fonctionnalités en plus de celles de la classe mère
- **Réimplémentation** : Changer complètement le comportement hérité
- **Débogage** : Ajouter des logs dans les classes dérivées

## Avantages et inconvénients

✅ **Avantages** :
- Permet d'adapter le comportement aux classes dérivées
- Possibilité de réutiliser la méthode mère via `::`
- Simple à comprendre (résolution statique)
- Contrôle fin sur le comportement

❌ **Inconvénients** / Limites :
- Pas de polymorphisme dynamique (utiliser `virtual` pour cela)
- Peut créer de la confusion avec le polymorphisme
- Risque d'oublier d'appeler la version parent si nécessaire
- Résolution au moment de la compilation seulement

## Connexions

### Notes liées
- [[C++ - Héritage]] - Base du masquage de méthodes
- [[C++ - Polymorphisme dynamique]] - Alternative avec résolution dynamique
- [[C++ - Méthodes virtuelles]] - Évite le masquage, active le polymorphisme

### Dans le contexte de
- [[C - fonctions (déclaration et appel)]] - Le C n'a pas de masquage
- [[MOC - C++ POO]] - Concept lié à l'héritage

## Commandes / Syntaxe

```cpp
// Masquage simple
class Fille : public Mere {
    void methode() {  // Masque Mere::methode()
        // Nouvelle implémentation
    }
};

// Appel explicite de la version parent
void Fille::methode() {
    Mere::methode();  // Appel de la version mère
    // Code additionnel
}

// Résolution de portée
objet.Classe::methode();  // Force l'appel d'une version spécifique
```

## Ressources

- Source : [[C++ programmation orientée objet]]
- Documentation : https://openclassrooms.com/fr/courses/7137751-programmez-en-oriente-objet-avec-c
- Attention : Ne pas confondre avec le polymorphisme (virtual)

---

**Tags thématiques** : `#cpp` `#poo` `#heritage` `#masquage` `#methodes`
