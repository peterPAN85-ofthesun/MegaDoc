---
type: permanent
created: 2026-01-05 15:37
tags:
  - permanent
  - cpp
  - poo
  - operateurs
  - io
---

# C++ - Surcharge opérateurs de flux

> [!abstract] Concept
> Redéfinition des opérateurs << (insertion) et >> (extraction) pour permettre l'affichage et la lecture d'objets personnalisés avec cout/cin.

## Explication

Les **opérateurs de flux** `<<` (insertion dans un flux de sortie) et `>>` (extraction depuis un flux d'entrée) permettent d'utiliser vos objets directement avec `cout`, `cin`, et autres flux standards.

L'opérateur `<<` est implémenté comme une **fonction externe** qui prend un `ostream&` (flux de sortie) et un objet const en paramètres, et retourne le flux pour permettre le chaînage. Elle nécessite souvent l'accès aux membres privés via `friend`.

La fonction délègue généralement le travail à une méthode membre privée `afficher()` qui écrit dans le flux. Cette séparation améliore l'organisation du code et respecte le principe de responsabilité unique.

## Exemples

### Exemple 1 : Opérateur << basique

```cpp
class Duree
{
    private:
    int m_heures;
    int m_minutes;
    int m_secondes;

    void afficher(ostream& flux) const;

    friend std::ostream& operator<<(std::ostream& flux, Duree const& duree);
};

// Implémentation de l'opérateur
std::ostream& operator<<(std::ostream& flux, Duree const& duree)
{
    duree.afficher(flux);
    return flux;
}

// Méthode d'affichage privée
void Duree::afficher(ostream& flux) const
{
    flux << m_heures << "h" << m_minutes << "m" << m_secondes << "s";
}
```

### Exemple 2 : Utilisation avec cout

```cpp
int main() {
    Duree trajet(2, 30, 45);

    std::cout << "Durée du trajet : " << trajet << std::endl;
    // Affiche : Durée du trajet : 2h30m45s

    return 0;
}
```

### Exemple 3 : Chaînage d'affichages

```cpp
int main() {
    Duree d1(1, 30, 0);
    Duree d2(0, 45, 30);

    std::cout << d1 << " + " << d2 << " = " << (d1 + d2) << std::endl;
    // Le retour de flux& permet ce chaînage

    return 0;
}
```

## Cas d'usage

- **Débogage** : Afficher rapidement l'état d'un objet
- **Logging** : Écrire dans des fichiers de log
- **Interface utilisateur** : Affichage formaté à l'utilisateur
- **Sérialisation simple** : Écrire/lire depuis des fichiers texte

## Avantages et inconvénients

✅ **Avantages** :
- Syntaxe naturelle et familière (comme les types primitifs)
- Permet le chaînage d'opérations
- Compatible avec tous les flux (fichiers, stringstream, etc.)
- Facilite le débogage et les tests

❌ **Inconvénients** / Limites :
- Nécessite l'accès aux membres privés (friend)
- Format d'affichage fixe (peu flexible)
- Peut être source de confusion pour l'extraction (>>)
- Ne gère pas nativement les erreurs de format

## Connexions

### Notes liées
- [[C++ - Mot-clé friend]] - Nécessaire pour accéder aux membres privés
- [[C++ - Méthodes const]] - La méthode afficher() doit être const
- [[C++ - Surcharge opérateurs arithmétiques]] - Autre type de surcharge

### Dans le contexte de
- [[C - entrées-sorties console (stdio.h)]] - Équivalent C avec printf/scanf
- [[MOC - C++ POO]] - Fonctionnalité pratique de la POO

## Commandes / Syntaxe

```cpp
// Opérateur d'insertion (<<)
std::ostream& operator<<(std::ostream& flux, Type const& objet) {
    // Écrire dans flux
    return flux;
}

// Opérateur d'extraction (>>)
std::istream& operator>>(std::istream& flux, Type& objet) {
    // Lire depuis flux
    return flux;
}

// Déclaration dans la classe
friend std::ostream& operator<<(std::ostream&, Type const&);
```

## Ressources

- Source : [[C++ programmation orientée objet]]
- Documentation : https://openclassrooms.com/fr/courses/7137751-programmez-en-oriente-objet-avec-c
- Bibliothèque : `<iostream>`

---

**Tags thématiques** : `#cpp` `#poo` `#operateurs` `#flux` `#io` `#affichage`
