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

# Godot Csharp - Timer avec ToSignal vs Task.Delay

> [!abstract] Concept
> Pour temporiser en Godot, `ToSignal(GetTree().CreateTimer(t), "timeout")` respecte `Engine.TimeScale` (pause, ralenti) alors que `await Task.Delay()` l'ignore et continue en temps réel.

## Explication

Attendre un délai dans une méthode `async` peut se faire de deux façons, qui n'ont **pas** le même comportement vis-à-vis du temps de jeu.

`Task.Delay()` est un timer .NET pur : il mesure le temps **réel (mur)**, indépendamment du moteur. Si le jeu est en pause ou en ralenti via `Engine.TimeScale`, `Task.Delay` continue de s'écouler comme si de rien n'était. Résultat : une attente censée durer « 2 secondes de jeu » se déclenche pendant la pause.

`GetTree().CreateTimer(t)` crée au contraire un **SceneTreeTimer** géré par le moteur, qui est affecté par `Engine.TimeScale`. En l'attendant via `ToSignal(..., "timeout")`, le délai se met en pause avec le jeu, ralentit avec le ralenti, etc. C'est donc la forme à privilégier pour toute temporisation **liée au gameplay** (cooldowns, durées d'effets, vagues d'ennemis).

Règle : `CreateTimer` + `ToSignal` pour le temps de jeu ; `Task.Delay` seulement pour du temps réel indépendant de la simulation (timeout réseau, par exemple).

## Exemples

### Bon : délai qui respecte la pause

```csharp
// Se met en pause si Engine.TimeScale = 0
await ToSignal(GetTree().CreateTimer(2.0f), Timer.SignalName.Timeout);
GD.Print("2 secondes de JEU écoulées");
```

### Piège : délai en temps réel

```csharp
// Ignore TimeScale : s'écoule même jeu en pause
await Task.Delay(2000);
GD.Print("2 secondes RÉELLES écoulées");
```

## Cas d'usage

- **Cooldowns d'aptitudes** : doivent geler quand le jeu est en pause → `CreateTimer`
- **Durée d'un effet (buff, invincibilité)** : suit le `TimeScale` → `CreateTimer`
- **Timeout réseau / I/O** : indépendant de la simulation → `Task.Delay` acceptable

## Avantages et inconvénients

✅ **Avantages de `CreateTimer` + `ToSignal`** :
- Respecte la pause et le ralenti automatiquement
- Cohérent avec la boucle de jeu Godot

❌ **Limites** :
- `Task.Delay` reste pratique pour du temps réel pur, mais piège pour le gameplay
- `CreateTimer` crée un timer à usage unique (one-shot)

## Connexions

### Notes liées
- [[Godot Csharp - async-await et Task]] - Le `ToSignal` attendu ici est un awaitable
- [[Godot Csharp - Signaux et événements]] - Le signal `Timeout` du timer
- [[Godot Csharp - Cycle de vie (_Ready, _Process, _PhysicsProcess)]] - `delta` et temps de jeu

### Dans le contexte de
- [[MOC - Godot]] - Programmation asynchrone et temporisation

## Ressources

- Source : [[CSharp-Godot task et await]]

---

**Tags thématiques** : `#godot` `#csharp` `#gamedev` `#async` `#timer`
