---
type: permanent
created: 2026-01-05 15:36
tags:
  - permanent
  - cpp
  - poo
  - operateurs
---

# C++ - Surcharge opérateurs composés

> [!abstract] Concept
> Redéfinition des opérateurs d'assignation composée (+=, -=, *=, /=, %=) qui modifient directement l'objet sur lequel ils sont appelés.

## Explication

Les **opérateurs composés** combinent une opération arithmétique et une assignation. Contrairement aux opérateurs arithmétiques simples, ils modifient l'objet de gauche directement au lieu de créer un nouveau résultat.

Ces opérateurs doivent être implémentés comme des **méthodes membres** (non-static) de la classe, car ils modifient l'objet courant (`this`). Ils prennent un seul paramètre (l'opérande de droite) et retournent généralement une référence à `*this` pour permettre le chaînage.

L'implémentation doit être cohérente avec l'opérateur arithmétique correspondant : `a += b` devrait donner le même résultat que `a = a + b`, mais de manière plus efficace.

## Exemples

### Exemple 1 : Opérateur += pour une durée

```cpp
class Duree
{
    private:
    int m_heures;
    int m_minutes;
    int m_secondes;

    public:
    void operator+=(const Duree& a);
};

// Implémentation
void Duree::operator+=(const Duree& a)
{
    // 1 : ajout des secondes
    m_secondes += a.m_secondes;
    m_minutes += m_secondes / 60;  // Report
    m_secondes %= 60;

    // 2 : ajout des minutes
    m_minutes += a.m_minutes;
    m_heures += m_minutes / 60;  // Report
    m_minutes %= 60;

    // 3 : ajout des heures
    m_heures += a.m_heures;
}
```

### Exemple 2 : Utilisation et chaînage

```cpp
int main() {
    Duree total(1, 0, 0);   // 1h
    Duree d1(0, 30, 0);     // 30min
    Duree d2(0, 15, 30);    // 15min30s

    total += d1;  // total devient 1h30
    total += d2;  // total devient 1h45m30s

    return 0;
}
```

### Exemple 3 : Retour de référence pour chaînage

```cpp
class Compteur
{
    private:
    int m_valeur;

    public:
    Compteur& operator+=(int n) {
        m_valeur += n;
        return *this;  // Permet le chaînage
    }
};

int main() {
    Compteur c(10);
    c += 5 += 3;  // Équivaut à c += (5 + 3) conceptuellement
    return 0;
}
```

## Cas d'usage

- **Accumulation** : Ajouter progressivement des valeurs (totaux, sommes)
- **Modifications incrémentales** : Modifier un objet étape par étape
- **Performance** : Plus efficace que créer un nouvel objet à chaque fois
- **Compteurs** : Incrémenter/décrémenter des valeurs

## Avantages et inconvénients

✅ **Avantages** :
- Plus efficace que l'opérateur simple (pas de copie)
- Syntaxe concise et familière
- Modification en place de l'objet
- Permet le chaînage d'opérations

❌ **Inconvénients** / Limites :
- Modifie l'objet (effet de bord)
- Doit être implémenté comme méthode membre
- Nécessite une gestion correcte pour éviter les bugs
- Peut être source de confusion si mal utilisé

## Connexions

### Notes liées
- [[C++ - Surcharge opérateurs arithmétiques]] - Version non-modifiante
- [[C++ - Classes (structure header-source)]] - Déclaration dans le header
- [[C++ - Méthodes const]] - Les opérateurs composés ne sont PAS const

### Dans le contexte de
- [[C - opérateurs arithmétiques]] - Extension du concept C
- [[MOC - C++ POO]] - Fonctionnalité avancée de la POO

## Commandes / Syntaxe

```cpp
// Déclaration (dans la classe)
class Type {
    public:
    void operator+=(Type const& autre);
    void operator-=(Type const& autre);
    void operator*=(Type const& autre);
    void operator/=(Type const& autre);
    void operator%=(Type const& autre);
};

// Version avec retour de référence (recommandé)
Type& operator+=(Type const& autre) {
    // Modification de l'objet
    return *this;
}
```

## Ressources

- Source : [[C++ programmation orientée objet]]
- Documentation : https://openclassrooms.com/fr/courses/7137751-programmez-en-oriente-objet-avec-c
- Note : Doit être cohérent avec l'opérateur arithmétique simple

---

**Tags thématiques** : `#cpp` `#poo` `#operateurs` `#surcharge` `#mutation`
