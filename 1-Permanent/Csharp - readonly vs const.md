---
type: permanent
created: 2026-06-07 23:26
tags:
  - permanent
  - csharp
  - poo
  - immuabilite
---

# Csharp - readonly vs const

> [!abstract] Concept
> `const` est une constante figée à la compilation (implicitement statique, types simples uniquement), tandis que `readonly` est une constante évaluée à l'exécution, assignable au déclaratif ou dans le constructeur, et valable pour n'importe quel type — y compris les objets.

## Explication

`const` et `readonly` rendent tous deux une valeur **non réassignable**, mais à des moments
et avec des règles différents.

**`const`** définit une **constante de compilation** : sa valeur doit être connue et
assignée **à la déclaration**, et le compilateur la **remplace directement dans le code**
(inlining). Elle est **implicitement `static`** (partagée, pas d'instance) et limitée aux
**types simples** : nombres, `bool`, `char`, `string`, ou `null` pour une référence. On ne
peut donc pas faire `const List<int> x = new()`.

**`readonly`** définit une **constante d'exécution** : le champ peut être assigné **à la
déclaration ou dans le constructeur**, et seulement là. Sa valeur est **calculée au
runtime**, ce qui autorise **n'importe quel type** (objets, collections, valeurs dépendant
de paramètres). Par défaut elle est **liée à l'instance** (chaque objet peut avoir sa
propre valeur fixée au constructeur) ; on peut la combiner en `static readonly` pour une
constante partagée évaluée à l'exécution.

### Le piège clé : `readonly` sur un type référence

`readonly` empêche de **réassigner la référence**, mais **pas de modifier le contenu** de
l'objet pointé. C'est exactement le cas dans SimLife :

```csharp
public readonly List<TileEntry> Tiles = new();

Tiles.Add(entry);    // ✅ autorisé : on modifie le contenu de la liste
Tiles = new();       // ❌ interdit : on réassignerait la référence readonly
```

C'est précisément ce qu'on veut pour un cache : la liste reste **la même instance**
(personne ne peut la remplacer), mais on peut la **remplir**.

## Exemples

### Comparaison directe

```csharp
public class Config
{
    public const double Pi = 3.14159;          // figée à la compilation, static
    public static readonly DateTime Lancement = DateTime.Now;  // runtime, partagée
    public readonly string Id;                 // fixée par instance dans le ctor

    public Config(string id)
    {
        Id = id;          // ✅ readonly assignable dans le constructeur
        // Pi = 3.0;      // ❌ const non assignable hors déclaration
    }
}
```

### Tiré du projet (Autoload `TileLibrary`)

```csharp
public const string Dir = "res://Scènes/Tiles/";  // chemin connu à la compilation
public readonly List<TileEntry> Tiles = new();     // collection remplie au runtime
```

## Tableau récapitulatif

| Aspect | `const` | `readonly` |
|--------|---------|------------|
| Moment d'évaluation | Compilation | Exécution (runtime) |
| Assignation possible | Déclaration uniquement | Déclaration **ou** constructeur |
| Statique ? | Implicitement `static` | Instance (ou `static readonly`) |
| Types autorisés | Simples (`int`, `string`, `bool`…) | **N'importe quel** type |
| Contenu d'un objet modifiable ? | — | Oui (seule la référence est figée) |

## Cas d'usage

- **`const`** : valeurs universelles connues à l'écriture du code (Pi, version, chemins
  fixes, clés constantes).
- **`readonly`** : valeurs fixées par instance via le constructeur (Id, dépendances
  injectées) ou collections/objets immuables en référence mais remplis au runtime (caches).

## Connexions

### Notes liées
- [[Csharp - Modificateurs d'accès]] - Autre famille de modificateurs de membres
- [[C++ - Méthodes const]] - `const` en C++ a une portée bien plus large (méthodes, paramètres)
- [[Godot Csharp - Autoload (Singleton)]] - Le cache `readonly List` d'un Autoload illustre le piège référence/contenu

### Dans le contexte de
- [[MOC - Godot]] - Fondamentaux C# dans Godot

## Sources

- Projet SimLife — [[HUD_Vignettes_Tiles]] (§2.4 : `const string dir` et `readonly List<TileEntry> Tiles`)
- Documentation Microsoft : `const` et `readonly`

---

**Tags thématiques** : `#csharp` `#poo` `#immuabilite` `#const` `#readonly`
