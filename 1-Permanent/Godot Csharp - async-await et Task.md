---
type: permanent
created: 2026-06-05 01:49
tags:
  - permanent
  - godot
  - csharp
  - gamedev
  - async
---

# Godot Csharp - async/await et Task

> [!abstract] Concept
> `async/await` en Godot C# est le mécanisme .NET standard (pas spécifique à Godot) permettant de suspendre une méthode pour attendre un événement futur sans bloquer le thread principal ; le pont avec Godot se fait via `ToSignal`.

## Explication

`async/await` n'est **pas** une fonctionnalité de Godot mais du langage C#/.NET. Une méthode marquée `async` peut être **suspendue** à un point `await` : elle rend la main à l'appelant (donc à la boucle de jeu de Godot), puis **reprend** exactement là où elle s'était arrêtée quand l'événement attendu se produit. Le jeu continue de tourner pendant l'attente, sans gel de l'image.

Le **pont avec Godot** se fait via `ToSignal(emitter, signalName)`, qui convertit un signal Godot en objet *awaitable*. Attendre `ToSignal` revient donc à dire « suspends-moi jusqu'à ce que ce signal soit émis ». C'est ainsi qu'on attend la fin d'une frame, l'expiration d'un timer, ou la fin d'une animation.

Point crucial : `await` **n'est pas du multithreading**. Tout reste sur le thread principal ; il n'y a pas de parallélisme réel, seulement une mise en pause coopérative. Conséquence pratique : l'arbre de scène reste **safe à manipuler** après un `await` (contrairement à `Task.Run`, qui exécute sur un thread séparé et exigerait `CallDeferred` pour toucher la scène).

## Exemples

### Attendre la fin du rendu d'une frame

```csharp
public async Task<Texture2D> CaptureFrame()
{
    _viewport.RenderTargetUpdateMode = SubViewport.UpdateMode.Once;

    // Suspend la méthode, rend la main à Godot, reprend après le rendu
    await ToSignal(RenderingServer.Singleton,
                   RenderingServer.SignalName.FramePostDraw);

    // Garde-fou : objet potentiellement libéré pendant l'attente
    if (!IsInstanceValid(this)) return null;

    return ImageTexture.CreateFromImage(_viewport.GetTexture().GetImage());
}
```

### Attendre la fin de la frame courante

```csharp
public async void SpawnEnnemi()
{
    await ToSignal(GetTree(), SceneTree.SignalName.ProcessFrame);
    GD.Print("Frame terminée, spawn de l'ennemi");
}
```

## Cas d'usage

- **Séquençage** : enchaîner des étapes qui dépendent d'un événement (rendu, animation, timer) sans machine à états complexe
- **Capture / post-traitement** : attendre `FramePostDraw` avant de lire un viewport
- **Délais de gameplay** : cooldowns, temporisations, cinématiques scriptées

## Avantages et inconvénients

✅ **Avantages** :
- Code séquentiel lisible au lieu de callbacks imbriqués
- Pas de gel de l'image pendant l'attente
- Scène manipulable après l'`await` (pas de `CallDeferred`)

❌ **Inconvénients** / Limites :
- Mono-thread : `await` ne parallélise rien, n'accélère pas un calcul lourd
- Un objet peut être libéré pendant l'attente → risque de `ObjectDisposedException`
- `async void` masque les exceptions (voir note dédiée)

## Connexions

### Notes liées
- [[Godot Csharp - Formes de retour async (Task, Task et async void)]] - Que renvoie une méthode `async`
- [[Godot Csharp - IsInstanceValid après un await]] - Garde-fou contre l'objet libéré
- [[Godot Csharp - Timer avec ToSignal vs Task.Delay]] - Attendre un délai qui respecte la pause
- [[Godot Csharp - Signaux et événements]] - `ToSignal` convertit un signal en awaitable
- [[Godot Csharp - Cycle de vie (_Ready, _Process, _PhysicsProcess)]] - L'`await` rend la main à la boucle de jeu

### Dans le contexte de
- [[MOC - Godot]] - Programmation asynchrone

## Ressources

- Source : [[CSharp-Godot task et await]]
- [Godot C# - Async/await](https://docs.godotengine.org/en/stable/tutorials/scripting/c_sharp/index.html)

---

**Tags thématiques** : `#godot` `#csharp` `#gamedev` `#async` `#await`
