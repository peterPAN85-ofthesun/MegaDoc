---
type: permanent
created: 2026-01-05 15:32
tags:
  - permanent
  - cpp
  - poo
  - constructeur
---

# C++ - Constructeur de copie

> [!abstract] Concept
> Constructeur spécial qui crée un nouvel objet comme copie d'un objet existant de la même classe.

## Explication

Le **constructeur de copie** est appelé lors de la création d'un objet par copie d'un autre objet. Il prend en paramètre une **référence constante** vers l'objet à copier. La référence est utilisée pour éviter une copie récursive infinie, et `const` garantit que l'objet source n'est pas modifié.

Si aucun constructeur de copie n'est défini explicitement, le compilateur en génère un automatiquement qui effectue une **copie membre à membre** (shallow copy). Cela peut poser problème si la classe contient des pointeurs ou des ressources allouées dynamiquement.

Dans ce cas, il faut définir un constructeur de copie personnalisé pour effectuer une **copie profonde** (deep copy) et éviter que plusieurs objets ne partagent les mêmes ressources, ce qui causerait des bugs lors de la destruction.

## Exemples

### Exemple 1 : Constructeur de copie basique

```cpp
class Personnage
{
    private:
    int m_vie;
    bool m_enVie;

    public:
    Personnage(Personnage const& persoACopier);
};

// Implémentation
Personnage::Personnage(Personnage const& persoACopier)
    : m_vie(persoACopier.m_vie), m_enVie(persoACopier.m_enVie)
{
    // Copie des attributs via liste d'initialisation
}
```

### Exemple 2 : Utilisation implicite

```cpp
int main() {
    Personnage hero;
    Personnage copie(hero);  // Appel explicite
    Personnage autre = hero; // Appel implicite (syntaxe alternative)

    return 0;
}
```

### Exemple 3 : Copie profonde avec pointeurs

```cpp
class Tableau
{
    private:
    int* m_donnees;
    int m_taille;

    public:
    Tableau(Tableau const& autre) : m_taille(autre.m_taille) {
        m_donnees = new int[m_taille];  // Allocation nouvelle
        for(int i = 0; i < m_taille; i++) {
            m_donnees[i] = autre.m_donnees[i];  // Copie profonde
        }
    }
};
```

## Cas d'usage

- **Passage par valeur** : Quand un objet est passé par valeur à une fonction
- **Retour de fonction** : Quand une fonction retourne un objet par valeur
- **Initialisation** : Lors de la création d'un objet à partir d'un autre
- **Classes avec pointeurs** : Indispensable pour éviter les bugs de partage de ressources

## Avantages et inconvénients

✅ **Avantages** :
- Contrôle total sur la façon dont les objets sont copiés
- Évite les bugs liés au partage de ressources (double free, pointeurs pendants)
- Permet d'optimiser la copie selon les besoins
- Essentiel pour la gestion correcte de la mémoire

❌ **Inconvénients** / Limites :
- Peut être coûteux en performance si la copie profonde est lourde
- Doit être maintenu si la structure de la classe évolue
- Oubli fréquent chez les débutants, causant des bugs subtils

## Connexions

### Notes liées
- [[C++ - Constructeur par défaut]] - Autre type de constructeur
- [[C++ - Destructeur]] - Doit être cohérent avec le constructeur de copie
- [[C - allocation dynamique (malloc free)]] - Importance accrue avec allocation mémoire

### Dans le contexte de
- [[C - pointeurs (concepts de base)]] - Nécessité de copie profonde avec pointeurs
- [[MOC - C++ POO]] - Concept fondamental de la POO

## Commandes / Syntaxe

```cpp
// Signature standard
Classe(Classe const& autre);

// Règle des 3 (Rule of Three)
// Si vous définissez l'un, définissez les 3 :
// - Constructeur de copie
// - Opérateur d'affectation (operator=)
// - Destructeur
```

## Ressources

- Source : [[C++ programmation orientée objet]]
- Documentation : https://openclassrooms.com/fr/courses/7137751-programmez-en-oriente-objet-avec-c
- Concept avancé : Rule of Three/Five/Zero

---

**Tags thématiques** : `#cpp` `#poo` `#constructeur` `#copie` `#mémoire`
