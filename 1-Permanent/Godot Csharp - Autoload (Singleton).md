---
type: permanent
created: 2026-06-07 23:26
tags:
  - permanent
  - godot
  - csharp
  - gamedev
  - autoload
  - singleton
---

# Godot Csharp - Autoload (Singleton)

> [!abstract] Concept
> Un Autoload est un nœud que Godot charge automatiquement au démarrage et qui reste vivant pendant toute la partie, survivant aux changements de scène : c'est l'endroit idéal pour un état global ou un cache d'assets accessible de partout.

## Explication

Un **Autoload** (aussi appelé *singleton*) est un script ou une scène que Godot
**instancie automatiquement au lancement du jeu** et place à la racine de l'arbre, en
dehors de la scène courante. Conséquence essentielle : il **n'est pas détruit lors d'un
changement de scène** (`ChangeSceneToFile`). Là où une scène normale (et tous ses nœuds)
est libérée quand on en charge une autre, l'Autoload, lui, **persiste toute la durée du
jeu**.

On le déclare dans **Projet → Paramètres du projet → Autoload** : on donne un **nom** (par
lequel on y accède) et le **chemin du script/scène**. Le nom devient un point d'accès
global dans l'arbre (`/root/MonAutoload`).

En C#, le pattern idiomatique est d'exposer une **référence statique `Instance`** que l'on
affecte dans `_Ready()`. Cela permet d'accéder à l'Autoload depuis n'importe quel script
sans le chercher dans l'arbre :

```csharp
public static TileLibrary Instance { get; private set; }

public override void _Ready()
{
    Instance = this;  // accessible via TileLibrary.Instance partout
}
```

C'est exactement parce qu'il survit au changement de scène qu'un Autoload est le bon
endroit pour un **cache** : dans SimLife, les vignettes de tiles générées pendant l'écran
de chargement (`LoadingScreen`) sont stockées dans l'Autoload `TileLibrary`, puis lues par
le HUD une fois dans `MainScene`. Si on les stockait dans la scène `LoadingScreen`, elles
seraient perdues au changement de scène.

## Exemples

### Déclaration et accès global

```csharp
using Godot;
using System.Collections.Generic;

public partial class TileLibrary : Node
{
    public static TileLibrary Instance { get; private set; }

    // Le cache survit au passage LoadingScreen -> MainScene
    public readonly List<TileEntry> Tiles = new();

    public override void _Ready()
    {
        Instance = this;
    }
}
```

### Utilisation depuis n'importe quel script

```csharp
// Dans LoadingScreen : on remplit le cache
TileLibrary.Instance.Register(path, scene, thumb);

// Plus tard dans MainScene : le HUD lit le même cache
foreach (var entry in TileLibrary.Instance.Tiles) { /* créer une vignette */ }
```

## Cas d'usage

- **Cache d'assets** persistant entre scènes (vignettes, sons préchargés)
- **Gestionnaire d'état global** : score, sauvegarde, profil joueur, paramètres
- **Bus d'événements** global (signaux émis depuis n'importe où)
- **Services** : audio manager, gestionnaire de scènes, localisation

## Pièges fréquents

- ❌ **Oublier de l'enregistrer** dans Projet → Paramètres → Autoload : la classe existe
  mais n'est jamais instanciée, donc `Instance` reste `null`.
- ❌ **Stocker des données à conserver dans une scène ordinaire** : elles disparaissent au
  `ChangeSceneToFile`. Mettre dans l'Autoload ce qui doit survivre.
- ⚠️ Un Autoload reste en mémoire toute la partie : ne pas y accumuler de gros objets dont
  on n'a plus besoin (penser à vider les caches volumineux).

## Connexions

### Notes liées
- [[Godot Csharp - Cycle de vie (_Ready, _Process, _PhysicsProcess)]] - `Instance = this` se fait dans `_Ready()`
- [[Godot Csharp - Instanciation de scènes]] - L'Autoload stocke souvent des `PackedScene` à instancier
- [[Godot Csharp - Collections (Array, Dictionary)]] - Un cache d'Autoload est typiquement une `List`/`Dictionary`

### Dans le contexte de
- [[MOC - Godot]] - Singletons et état global

## Sources

- Projet SimLife — [[HUD_Vignettes_Tiles]] (§1 et §2.4 : `TileLibrary` comme cache persistant)
- Documentation Godot : *Singletons (Autoload)*

---

**Tags thématiques** : `#godot` `#csharp` `#gamedev` `#autoload` `#singleton`
