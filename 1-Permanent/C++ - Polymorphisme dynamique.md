---
type: permanent
created: 2026-01-05 15:42
tags:
  - permanent
  - cpp
  - poo
  - polymorphisme
---

# C++ - Polymorphisme dynamique

> [!abstract] Concept
> Résolution à l'exécution du type et de la méthode à appeler, basée sur le type réel de l'objet, grâce aux méthodes virtuelles et références/pointeurs.

## Explication

Le **polymorphisme dynamique** (ou *late binding*) permet d'appeler la méthode correspondant au **type réel** de l'objet, pas son type déclaré. C'est le véritable polymorphisme de la POO : traiter uniformément des objets de types différents.

Pour activer le polymorphisme dynamique, **deux conditions** sont nécessaires :
1. La méthode doit être déclarée **virtuelle** dans la classe de base
2. L'objet doit être manipulé via une **référence** ou un **pointeur** (pas par valeur)

Le mécanisme utilise une table virtuelle (vtable) maintenue par le compilateur, avec un léger surcoût à l'exécution mais permettant un comportement polymorphe puissant.

## Exemples

### Exemple 1 : Activation du polymorphisme

```cpp
class Vehicule
{
    public:
    virtual void affiche() const {  // Méthode VIRTUELLE
        std::cout << "Ceci est un véhicule" << std::endl;
    }
};

class Moto : public Vehicule
{
    public:
    virtual void affiche() const {  // virtual optionnel mais recommandé
        std::cout << "Ceci est une moto" << std::endl;
    }
};

void presenter(Vehicule const& v) {  // Référence !
    v.affiche();
}

int main() {
    Vehicule v;
    presenter(v);  // Affiche : "Ceci est un véhicule"

    Moto m;
    presenter(m);  // Affiche : "Ceci est une moto" (!)
    // Polymorphisme dynamique !

    return 0;
}
```

### Exemple 2 : Avec pointeurs

```cpp
int main() {
    Vehicule* v1 = new Vehicule();
    Vehicule* v2 = new Moto();     // Pointeur Vehicule, objet Moto
    Vehicule* v3 = new Voiture();  // Pointeur Vehicule, objet Voiture

    v1->affiche();  // "Ceci est un véhicule"
    v2->affiche();  // "Ceci est une moto"
    v3->affiche();  // "Ceci est une voiture"
    // La bonne méthode est appelée selon le type RÉEL

    delete v1;
    delete v2;
    delete v3;

    return 0;
}
```

### Exemple 3 : Collection hétérogène

```cpp
int main() {
    std::vector<Vehicule*> garage;
    garage.push_back(new Voiture());
    garage.push_back(new Moto());
    garage.push_back(new Vehicule());

    for (Vehicule* v : garage) {
        v->affiche();  // Chaque objet s'affiche correctement !
    }

    // Nettoyage
    for (Vehicule* v : garage) {
        delete v;
    }

    return 0;
}
```

## Cas d'usage

- **Collections hétérogènes** : Stocker des objets de types dérivés différents
- **Interfaces** : Définir des contrats via classes abstraites
- **Extensibilité** : Ajouter de nouveaux types sans modifier le code existant
- **Frameworks** : Base du design pattern Strategy, Factory, etc.

## Avantages et inconvénients

✅ **Avantages** :
- Véritable polymorphisme orienté objet
- Permet le traitement uniforme d'objets hétérogènes
- Code plus flexible et extensible
- Respect du principe ouvert/fermé (SOLID)

❌ **Inconvénients** / Limites :
- Léger surcoût en performance (vtable lookup)
- Nécessite des pointeurs/références (gestion mémoire)
- Augmente la taille des objets (pointeur vtable)
- Complexité accrue pour les débutants

## Connexions

### Notes liées
- [[C++ - Polymorphisme statique]] - Alternative sans virtual
- [[C++ - Méthodes virtuelles]] - Mécanisme fondamental
- [[C++ - Destructeur virtuel]] - Crucial pour le polymorphisme

### Dans le contexte de
- [[C++ - Classes abstraites]] - Utilisent le polymorphisme
- [[MOC - C++ POO]] - Pilier central de la POO

## Commandes / Syntaxe

```cpp
// Déclaration de méthode virtuelle
class Base {
    public:
    virtual void methode() { }
};

// Utilisation polymorphe
Base* ptr = new Derivee();
ptr->methode();  // Appelle Derivee::methode (type réel)

// Avec référence
void fonction(Base& obj) {
    obj.methode();  // Polymorphisme dynamique
}
```

## Ressources

- Source : [[C++ programmation orientée objet]]
- Documentation : https://openclassrooms.com/fr/courses/7137751-programmez-en-oriente-objet-avec-c
- Concept : Late binding / Dynamic dispatch / Virtual table

---

**Tags thématiques** : `#cpp` `#poo` `#polymorphisme` `#dynamique` `#virtual`
