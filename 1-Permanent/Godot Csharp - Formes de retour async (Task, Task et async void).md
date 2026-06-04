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

# Godot Csharp - Formes de retour async (Task, Task<T>, async void)

> [!abstract] Concept
> Une méthode `async` peut retourner `Task<T>` (valeur), `Task` (sans valeur mais awaitable) ou `async void` — ce dernier étant réservé aux handlers de signaux/événements car ses exceptions sont silencieuses.

## Explication

Le type de retour d'une méthode `async` détermine si on peut l'attendre (`await`) et récupérer un résultat. Il y a trois formes, et le choix entre elles n'est pas cosmétique : il conditionne la **gestion des erreurs**.

- **`Task<T>`** : la méthode produit une valeur de type `T`. L'appelant fait `T x = await MaMethode();` pour la récupérer. À privilégier dès qu'il y a un résultat.
- **`Task`** : opération sans valeur de retour, mais **awaitable**. L'appelant peut attendre sa fin et — surtout — les exceptions remontent normalement vers lui. C'est le défaut sain pour toute coroutine.
- **`async void`** : ne peut **pas** être awaité. À réserver **exclusivement** aux gestionnaires d'événements/signaux, où la signature impose `void`. Partout ailleurs c'est un piège : une exception levée dans une `async void` n'est attrapable par personne, devient silencieuse et **crashe le jeu** sans message clair.

Règle pratique : par défaut, retourner `Task` (ou `Task<T>`). N'utiliser `async void` que lorsque la signature d'un handler l'exige.

## Exemples

### Task<T> — retourner une valeur

```csharp
public async Task<Texture2D> CaptureFrame()
{
    await ToSignal(RenderingServer.Singleton,
                   RenderingServer.SignalName.FramePostDraw);
    return ImageTexture.CreateFromImage(_viewport.GetTexture().GetImage());
}

// Appel
Texture2D tex = await CaptureFrame();
```

### Task — awaitable sans valeur

```csharp
public async Task PlayIntro()
{
    await ToSignal(_anim, AnimationPlayer.SignalName.AnimationFinished);
    // Les exceptions d'ici remontent vers l'appelant
}

await PlayIntro();
```

### async void — uniquement pour un handler

```csharp
// OK : c'est un gestionnaire de signal, sa signature impose void
private async void OnButtonPressed()
{
    await ToSignal(GetTree().CreateTimer(0.5f), Timer.SignalName.Timeout);
    GD.Print("Action différée");
}
```

## Cas d'usage

- **`Task<T>`** : charger une ressource, capturer une frame, calculer puis renvoyer
- **`Task`** : jouer une cinématique, séquencer des étapes, attendre une animation
- **`async void`** : `OnPressed`, `OnTimeout`, `OnBodyEntered` et autres callbacks de signaux

## Avantages et inconvénients

✅ **Avantages** :
- `Task`/`Task<T>` rendent les erreurs observables et la fin attendable
- Choix explicite qui documente l'intention de la méthode

❌ **Inconvénients** / Limites :
- `async void` avale les exceptions → crash silencieux si mal employé
- On ne peut pas `await` une `async void` ni savoir quand elle se termine

## Connexions

### Notes liées
- [[Godot Csharp - async-await et Task]] - Mécanisme général dont ces formes sont le type de retour
- [[Godot Csharp - Signaux et événements]] - Les handlers de signaux justifient `async void`
- [[Csharp - Méthodes de casting]] - Typage générique `Task<T>`

### Dans le contexte de
- [[MOC - Godot]] - Programmation asynchrone

## Ressources

- Source : [[CSharp-Godot task et await]]

---

**Tags thématiques** : `#godot` `#csharp` `#gamedev` `#async` `#task`
