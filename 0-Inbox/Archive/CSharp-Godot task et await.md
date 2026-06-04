---
type: note
created: 2026-06-05
tags:
  - godot
  - csharp
  - async
  - task
  - gamedev
---

# Godot Csharp - async/await et Task

`async/await` en Godot C# est le **mécanisme .NET standard** (pas
spécifique à Godot) permettant de suspendre l'exécution d'une méthode
pour attendre un événement futur, sans bloquer le thread principal.
Le pont avec Godot se fait via `ToSignal(emitter, signalName)`, qui
retourne un objet awaitable converti depuis un signal Godot.

Trois formes de retour : `Task<T>` pour retourner une valeur,
`Task` pour une opération sans valeur mais awaitable, et `async void`
réservé aux handlers d'événements/signaux (jamais ailleurs : les
exceptions y sont silencieuses et crashent le jeu). `await` n'est
**pas** du multithreading : tout reste sur le thread principal, donc
l'arbre de scène est safe à manipuler après un await — contrairement
à `Task.Run` qui exigerait `CallDeferred`.

## Exemple

​```csharp
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
​```

## Pièges

- `await Task.Delay()` ignore `Engine.TimeScale` → préférer 
  `ToSignal(GetTree().CreateTimer(t), "timeout")` pour respecter la pause
- `async void` non-handler : exceptions invisibles → toujours `Task`
- Objet `Free()`'d pendant l'await : vérifier `IsInstanceValid()`