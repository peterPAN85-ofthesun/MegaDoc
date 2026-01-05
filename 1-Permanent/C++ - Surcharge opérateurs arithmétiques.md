---
type: permanent
created: 2026-01-05 15:35
tags:
  - permanent
  - cpp
  - poo
  - operateurs
---

# C++ - Surcharge opérateurs arithmétiques

> [!abstract] Concept
> Redéfinition du comportement des opérateurs arithmétiques (+, -, *, /, %) pour qu'ils fonctionnent avec des types personnalisés.

## Explication

La **surcharge d'opérateurs** permet de définir comment les opérateurs standards comme `+`, `-`, `*`, `/` et `%` se comportent avec vos propres classes. Cela rend le code plus intuitif et naturel.

Les opérateurs arithmétiques sont généralement implémentés comme des **fonctions externes** (non-membres) qui prennent deux paramètres constants par référence et retournent un nouvel objet résultat. Cette approche respecte la symétrie des opérations (a + b devrait donner le même résultat que b + a).

Il est important de noter que la surcharge d'opérateurs doit respecter la sémantique attendue : `+` devrait faire une addition, pas une multiplication. Mal utilisée, elle peut rendre le code confus.

## Exemples

### Exemple 1 : Addition de durées

```cpp
class Duree
{
    private:
    int m_heures;
    int m_minutes;
    int m_secondes;

    friend Duree operator+(Duree const& a, Duree const& b);
};

// Implémentation
Duree operator+(Duree const& a, Duree const& b)
{
    Duree resultat;
    resultat.m_secondes = a.m_secondes + b.m_secondes;
    resultat.m_minutes = a.m_minutes + b.m_minutes + resultat.m_secondes / 60;
    resultat.m_secondes %= 60;
    resultat.m_heures = a.m_heures + b.m_heures + resultat.m_minutes / 60;
    resultat.m_minutes %= 60;
    return resultat;
}
```

### Exemple 2 : Utilisation intuitive

```cpp
int main() {
    Duree trajet1(2, 30, 0);  // 2h30
    Duree trajet2(1, 45, 30); // 1h45m30s

    Duree total = trajet1 + trajet2;  // Naturel !
    // Au lieu de : Duree total = trajet1.ajouter(trajet2);

    return 0;
}
```

### Exemple 3 : Opérateur d'égalité

```cpp
bool operator==(Duree const& a, Duree const& b)
{
    return (a.m_heures == b.m_heures &&
            a.m_minutes == b.m_minutes &&
            a.m_secondes == b.m_secondes);
}
```

## Cas d'usage

- **Classes mathématiques** : Vecteurs, matrices, nombres complexes
- **Classes de mesure** : Durées, distances, poids
- **Manipulation intuitive** : Rendre le code plus lisible
- **Compatibilité** : Utiliser vos types dans des algorithmes génériques (STL)

## Avantages et inconvénients

✅ **Avantages** :
- Syntaxe naturelle et intuitive
- Code plus concis et lisible
- Compatible avec les algorithmes génériques
- Respecte les conventions mathématiques

❌ **Inconvénients** / Limites :
- Peut être mal compris si la sémantique n'est pas claire
- Impossible de changer la priorité ou l'associativité des opérateurs
- Peut masquer des opérations coûteuses
- Nécessite souvent l'accès aux membres privés (via `friend`)

## Connexions

### Notes liées
- [[C++ - Surcharge opérateurs composés]] - Version modifiante (+=, -=)
- [[C++ - Surcharge opérateurs de flux]] - Opérateurs << et >>
- [[C++ - Mot-clé friend]] - Souvent nécessaire pour accéder aux membres

### Dans le contexte de
- [[C - opérateurs arithmétiques]] - Extension du concept C
- [[MOC - C++ POO]] - Fonctionnalité avancée de la POO

## Commandes / Syntaxe

```cpp
// Signature standard (fonction externe)
Type operator+(Type const& a, Type const& b);
Type operator-(Type const& a, Type const& b);
Type operator*(Type const& a, Type const& b);
Type operator/(Type const& a, Type const& b);
Type operator%(Type const& a, Type const& b);

// Opérateurs de comparaison
bool operator==(Type const& a, Type const& b);
bool operator!=(Type const& a, Type const& b);
bool operator<(Type const& a, Type const& b);
```

## Ressources

- Source : [[C++ programmation orientée objet]]
- Documentation : https://openclassrooms.com/fr/courses/7137751-programmez-en-oriente-objet-avec-c

---

**Tags thématiques** : `#cpp` `#poo` `#operateurs` `#surcharge` `#arithmétique`
