---
type: permanent
created: 2026-01-05 15:47
tags:
  - permanent
  - cpp
  - poo
  - static
---

# C++ - Attributs statiques

> [!abstract] Concept
> Variables membres partagées par toutes les instances d'une classe, appartenant à la classe elle-même plutôt qu'aux objets individuels.

## Explication

Un **attribut statique** (ou membre de donnée statique) est une variable qui existe une seule fois pour toute la classe, indépendamment du nombre d'instances créées. Tous les objets de la classe partagent la même variable statique.

L'attribut statique doit être **déclaré** dans le header de la classe avec le mot-clé `static`, puis **défini et initialisé** dans le fichier source (.cpp) dans l'espace global, en dehors de toute fonction (y compris `main`).

Les attributs statiques sont utiles pour stocker des données communes à tous les objets, comme des compteurs d'instances, des configurations globales, ou des caches partagés.

## Exemples

### Exemple 1 : Déclaration et initialisation

```cpp
// Dans MaClasse.hpp
class MaClasse
{
    private:
    static int m_compteur;  // Déclaration

    public:
    MaClasse() {
        m_compteur++;
    }

    static int getCompteur() {
        return m_compteur;
    }
};

// Dans MaClasse.cpp (OBLIGATOIRE !)
int MaClasse::m_compteur = 0;  // Définition et initialisation
```

### Exemple 2 : Compteur d'instances

```cpp
class Joueur
{
    private:
    static int m_nombreJoueurs;
    std::string m_nom;

    public:
    Joueur(std::string nom) : m_nom(nom) {
        m_nombreJoueurs++;
        std::cout << "Joueur créé. Total : " << m_nombreJoueurs << std::endl;
    }

    ~Joueur() {
        m_nombreJoueurs--;
        std::cout << "Joueur détruit. Restant : " << m_nombreJoueurs << std::endl;
    }

    static int getNombreJoueurs() {
        return m_nombreJoueurs;
    }
};

// Initialisation
int Joueur::m_nombreJoueurs = 0;

int main() {
    Joueur j1("Alice");  // "Joueur créé. Total : 1"
    Joueur j2("Bob");    // "Joueur créé. Total : 2"

    std::cout << Joueur::getNombreJoueurs() << std::endl;  // 2

    return 0;
}  // Destructeurs appelés, compteur décrémenté
```

### Exemple 3 : Configuration partagée

```cpp
class Configuration
{
    private:
    static std::string m_langue;
    static bool m_modeDebug;

    public:
    static void setLangue(std::string langue) {
        m_langue = langue;
    }

    static std::string getLangue() {
        return m_langue;
    }
};

// Initialisation
std::string Configuration::m_langue = "fr";
bool Configuration::m_modeDebug = false;
```

## Cas d'usage

- **Compteurs d'instances** : Suivre combien d'objets existent
- **Configuration globale** : Paramètres partagés par tous les objets
- **Caches** : Données partagées pour optimisation
- **ID unique** : Générer des identifiants uniques pour chaque instance

## Avantages et inconvénients

✅ **Avantages** :
- Partagé par toutes les instances (économie mémoire)
- Accessible via méthodes statiques sans créer d'objet
- Utile pour les données communes à la classe
- Permet de suivre l'état global de la classe

❌ **Inconvénients** / Limites :
- Doit être initialisé dans le .cpp (syntaxe supplémentaire)
- Peut créer du couplage global
- Problèmes potentiels en multi-threading (nécessite synchronisation)
- Peut compliquer les tests unitaires

## Connexions

### Notes liées
- [[C++ - Méthodes statiques]] - Accèdent souvent aux attributs statiques
- [[C++ - Classes (structure header-source)]] - Déclaration dans header, définition dans source
- [[C++ - Constructeur par défaut]] - Peut modifier les attributs statiques

### Dans le contexte de
- [[C - variables (déclaration et portée)]] - Extension du concept de variables globales
- [[MOC - C++ POO]] - Concept utilitaire de la POO

## Commandes / Syntaxe

```cpp
// Dans le header (.hpp)
class Classe {
    private:
    static int m_attributStatique;  // Déclaration

    public:
    static void methode();
};

// Dans le source (.cpp) - OBLIGATOIRE !
// En dehors de toute fonction, dans l'espace global
int Classe::m_attributStatique = valeurInitiale;

// Accès depuis méthode statique
void Classe::methode() {
    m_attributStatique++;  // OK
}

// Accès depuis méthode non-statique
void Classe::autreMethode() {
    m_attributStatique++;  // OK aussi
}
```

## Ressources

- Source : [[C++ programmation orientée objet]]
- Documentation : https://openclassrooms.com/fr/courses/7137751-programmez-en-oriente-objet-avec-c
- **Important** : Toujours initialiser dans le .cpp !

---

**Tags thématiques** : `#cpp` `#poo` `#static` `#attributs` `#classe`
