---
type: permanent
created: 2026-01-27
tags:
  - permanent
  - csharp
  - poo
  - visibilite
---

# Csharp - Modificateurs d'accès

> [!abstract] Concept
> Les modificateurs d'accès en Csharp contrôlent la visibilité des membres d'une classe. Csharp offre plus de niveaux que C++ avec notamment `internal` et des combinaisons spéciales.

## Explication

Csharp propose **4 modificateurs de base** et **2 combinaisons** :

| Modificateur | Visibilité |
|--------------|------------|
| `public` | Accessible partout (le moins restrictif) |
| `protected` | Accessible dans la classe et ses classes dérivées |
| `internal` | Accessible uniquement dans le même assembly (projet) |
| `private` | Accessible uniquement dans la classe (le plus restrictif) |

### Combinaisons spéciales

- **`protected internal`** : Accessible dans le même assembly OU dans les classes dérivées (même d'un autre assembly)
- **`private protected`** : Accessible uniquement dans les classes dérivées du même assembly

## Exemples

### Exemple 1 : Modificateurs de base

```csharp
public class MaClasse
{
    public int champPublic;        // Accessible partout
    protected int champProtected;  // Accessible aux classes filles
    internal int champInternal;    // Accessible dans le même projet
    private int champPrivate;      // Accessible uniquement ici
}
```

### Exemple 2 : Combinaisons

```csharp
public class ClasseBase
{
    // Accessible dans le même assembly OU classes dérivées
    protected internal void MethodeProtectedInternal() { }

    // Accessible UNIQUEMENT aux classes dérivées du même assembly
    private protected void MethodePrivateProtected() { }
}
```

## Comparaison avec C++

| Aspect | Csharp | C++ |
|--------|-----|-----|
| Modificateurs de base | 4 | 3 (pas de `internal`) |
| Notion d'assembly | Oui (`internal`) | Non |
| Combinaisons | 2 | Aucune |
| Défaut dans classe | `private` | `private` |
| Défaut dans struct | `private` | `public` |

## Cas d'usage

- **`public`** : API publique, membres accessibles de l'extérieur
- **`protected`** : Membres destinés à l'héritage
- **`internal`** : Implémentation interne d'une bibliothèque
- **`private`** : Détails d'implémentation cachés
- **`protected internal`** : API extensible d'une bibliothèque
- **`private protected`** : Héritage contrôlé dans une bibliothèque

## Connexions

### Notes liées
- [[C++ - Modificateur protected]] - Équivalent C++
- [[Csharp vs C++ - Gestion mémoire (new et GC)]] - Autre différence majeure

### Dans le contexte de
- [[MOC - Godot]] - Utilisé dans les scripts Godot Csharp

## Ressources

- Documentation Microsoft : https://docs.microsoft.com/fr-fr/dotnet/csharp/programming-guide/classes-and-structs/access-modifiers

---

**Tags thématiques** : `#csharp` `#poo` `#visibilite` `#modificateurs`
