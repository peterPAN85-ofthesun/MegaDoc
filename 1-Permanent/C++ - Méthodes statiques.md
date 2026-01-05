---
type: permanent
created: 2026-01-05 15:46
tags:
  - permanent
  - cpp
  - poo
  - static
---

# C++ - Méthodes statiques

> [!abstract] Concept
> Méthodes appartenant à la classe elle-même plutôt qu'aux instances, appelables sans créer d'objet et n'ayant pas accès aux attributs d'instance.

## Explication

Les **méthodes statiques** sont des fonctions membres de la classe qui n'opèrent pas sur une instance particulière. Elles appartiennent à la **classe** elle-même et peuvent être appelées directement via `NomClasse::methode()` sans créer d'objet.

Ces méthodes n'ont **pas accès** aux attributs non-statiques (membres d'instance) ni au pointeur `this`, car elles ne sont pas liées à un objet spécifique. Elles peuvent uniquement accéder aux membres statiques de la classe.

Les méthodes statiques sont essentiellement des fonctions rangées dans l'espace de noms de la classe, utiles pour des opérations liées à la classe mais indépendantes des instances particulières.

## Exemples

### Exemple 1 : Méthode statique basique

```cpp
class MaClasse
{
    public:
    MaClasse();
    static void maMethode();  // Déclaration
};

// Implémentation (PAS de 'static' ici)
void MaClasse::maMethode()
{
    std::cout << "Bonjour !" << std::endl;
}

int main() {
    MaClasse::maMethode();  // Appel sans instance
    // Pas besoin de créer un objet !

    return 0;
}
```

### Exemple 2 : Compteur d'instances

```cpp
class Compteur
{
    private:
    static int m_nombreInstances;  // Attribut statique

    public:
    Compteur() {
        m_nombreInstances++;
    }

    ~Compteur() {
        m_nombreInstances--;
    }

    static int getNombreInstances() {  // Méthode statique
        return m_nombreInstances;
    }
};

// Initialisation de l'attribut statique (dans .cpp)
int Compteur::m_nombreInstances = 0;

int main() {
    std::cout << Compteur::getNombreInstances() << std::endl;  // 0

    Compteur c1;
    std::cout << Compteur::getNombreInstances() << std::endl;  // 1

    {
        Compteur c2;
        std::cout << Compteur::getNombreInstances() << std::endl;  // 2
    }

    std::cout << Compteur::getNombreInstances() << std::endl;  // 1

    return 0;
}
```

### Exemple 3 : Méthode utilitaire

```cpp
class Mathematiques
{
    public:
    static double carre(double x) {
        return x * x;
    }

    static double puissance(double base, int exposant) {
        double resultat = 1;
        for (int i = 0; i < exposant; i++) {
            resultat *= base;
        }
        return resultat;
    }
};

int main() {
    double x = Mathematiques::carre(5.0);         // 25.0
    double y = Mathematiques::puissance(2, 10);   // 1024.0

    return 0;
}
```

## Cas d'usage

- **Compteurs** : Compter le nombre d'instances d'une classe
- **Méthodes utilitaires** : Fonctions liées à la classe mais indépendantes des objets
- **Factory methods** : Créer des objets de manière contrôlée
- **Constantes** : Fournir des valeurs constantes liées à la classe

## Avantages et inconvénients

✅ **Avantages** :
- Pas besoin de créer un objet pour les appeler
- Organisent les fonctions utilitaires dans l'espace de noms de la classe
- Utiles pour les compteurs et statistiques de classe
- Peuvent accéder aux membres privés statiques

❌ **Inconvénients** / Limites :
- N'ont pas accès aux attributs d'instance
- Pas de `this` disponible
- Ne peuvent pas être virtuelles
- Peuvent créer du couplage si mal utilisées

## Connexions

### Notes liées
- [[C++ - Attributs statiques]] - Souvent utilisés ensemble
- [[C++ - Classes (structure header-source)]] - Déclaration dans le header
- [[C++ - Méthodes const]] - Différentes : const opère sur instance

### Dans le contexte de
- [[C - fonctions (déclaration et appel)]] - Similaires à des fonctions libres
- [[MOC - C++ POO]] - Concept utilitaire de la POO

## Commandes / Syntaxe

```cpp
// Déclaration dans la classe
class Classe {
    private:
    static int m_statique;  // Attribut statique

    public:
    static void methodeStatique();
};

// Implémentation (PAS de 'static')
void Classe::methodeStatique() {
    // Accès uniquement aux membres statiques
    m_statique++;  // OK
    // m_nonStatique++;  // ERREUR !
}

// Initialisation de l'attribut statique (dans .cpp, hors de toute fonction)
int Classe::m_statique = 0;

// Appel
Classe::methodeStatique();  // Via la classe
```

## Ressources

- Source : [[C++ programmation orientée objet]]
- Documentation : https://openclassrooms.com/fr/courses/7137751-programmez-en-oriente-objet-avec-c

---

**Tags thématiques** : `#cpp` `#poo` `#static` `#classe` `#methode`
