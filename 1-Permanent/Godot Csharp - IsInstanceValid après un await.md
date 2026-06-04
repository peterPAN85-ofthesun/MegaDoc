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

# Godot Csharp - IsInstanceValid après un await

> [!abstract] Concept
> Pendant un `await`, l'objet courant peut être libéré (`Free()`/`QueueFree()`) ; vérifier `IsInstanceValid(this)` après l'attente évite d'accéder à un objet Godot détruit.

## Explication

Un `await` suspend la méthode et rend la main au moteur. Pendant cette suspension, **le monde continue** : le noeud sur lequel tourne la méthode peut être détruit (changement de scène, `QueueFree`, mort de l'entité…). Quand la méthode reprend après l'`await`, `this` peut donc pointer vers un objet Godot **déjà libéré** côté moteur.

Accéder à un tel objet (lire une propriété, appeler une méthode) déclenche une erreur — typiquement une `ObjectDisposedException` ou un message « instance is null/freed ». Le garde-fou est `IsInstanceValid(node)` : il renvoie `false` si l'instance native Godot a été libérée. On l'appelle **juste après l'`await`**, avant de retoucher à l'objet ou à la scène.

Ce contrôle est spécifique au modèle mémoire de Godot : les noeuds dérivent d'objets natifs C++ dont la durée de vie est gérée par le moteur, indépendamment du ramasse-miettes .NET. Un wrapper C# peut donc « survivre » à l'objet natif qu'il enveloppe — d'où la nécessité de valider.

## Exemples

### Garde-fou après attente

```csharp
public async Task<Texture2D> CaptureFrame()
{
    await ToSignal(RenderingServer.Singleton,
                   RenderingServer.SignalName.FramePostDraw);

    // Objet potentiellement libéré pendant l'attente
    if (!IsInstanceValid(this)) return null;

    return ImageTexture.CreateFromImage(_viewport.GetTexture().GetImage());
}
```

### Valider une cible externe

```csharp
public async void TirerSur(Node3D cible)
{
    await ToSignal(GetTree().CreateTimer(0.3f), Timer.SignalName.Timeout);

    // La cible a pu mourir pendant le délai
    if (!IsInstanceValid(cible)) return;

    AppliquerDegats(cible);
}
```

## Cas d'usage

- **Méthode async sur un noeud destructible** : valider `this` après chaque `await`
- **Action différée sur une cible** : valider la cible après le délai (ennemi mort entre-temps)
- **Changement de scène pendant une coroutine** : éviter de manipuler une scène déchargée

## Avantages et inconvénients

✅ **Avantages** :
- Évite les crashs `ObjectDisposedException` après suspension
- Simple : une ligne après l'`await`

❌ **Limites** :
- Facile à oublier → bug intermittent et difficile à reproduire
- Ne protège pas des références capturées en variable locale qui deviennent invalides plus loin

## Connexions

### Notes liées
- [[Godot Csharp - async-await et Task]] - C'est l'`await` qui ouvre la fenêtre de libération
- [[Csharp vs C++ - Gestion mémoire (new et GC)]] - Objet natif C++ vs wrapper C#/GC
- [[Godot Csharp - Signaux et événements]] - `QueueFree()` après réception d'un signal

### Dans le contexte de
- [[MOC - Godot]] - Programmation asynchrone et durée de vie des noeuds

## Ressources

- Source : [[CSharp-Godot task et await]]

---

**Tags thématiques** : `#godot` `#csharp` `#gamedev` `#async` `#memory`
