---
type: permanent
created: 2026-01-27
tags:
  - permanent
  - godot
  - csharp
  - gamedev
  - signaux
---

# Godot Csharp - Signaux et événements

> [!abstract] Concept
> Les signaux sont le système d'événements de Godot, permettant une communication découplée entre noeuds. Csharp utilise la syntaxe des événements .NET pour s'y connecter.

## Explication

Les signaux suivent le pattern Observer :
- Un noeud **émet** un signal quand quelque chose se produit
- D'autres noeuds **s'abonnent** pour réagir

### Signaux intégrés vs Custom

- **Intégrés** : `Timeout`, `body_entered`, `pressed`, etc.
- **Custom** : Définis par le développeur avec `[Signal]`

## Exemples

### Connexion via l'éditeur (Timer)

1. Ajouter un noeud `Timer` dans la scène
2. Activer `Autostart` si besoin
3. Dans l'onglet `Noeud` → `Signaux`, double-clic sur `timeout()`
4. Connecter au script avec un nom de méthode

```csharp
// Méthode appelée quand le timer expire
public void OnTimerTimeout()
{
    GD.Print("Temps écoulé !");
    QueueFree();  // Auto-destruction
}
```

### Connexion par code

```csharp
public override void _Ready()
{
    var timer = GetNode<Timer>("Timer");
    timer.Timeout += OnTimerTimeout;
}

private void OnTimerTimeout()
{
    GD.Print("Timer expiré !");
}
```

### Créer un signal custom

```csharp
public partial class Player : CharacterBody3D
{
    // Déclaration du signal (le nom doit finir par EventHandler)
    [Signal]
    public delegate void HealthChangedEventHandler(int newHealth);

    [Signal]
    public delegate void DiedEventHandler();

    private int health = 100;

    public void TakeDamage(int amount)
    {
        health -= amount;
        EmitSignal(SignalName.HealthChanged, health);

        if (health <= 0)
        {
            EmitSignal(SignalName.Died);
        }
    }
}
```

### S'abonner à un signal custom

```csharp
public override void _Ready()
{
    var player = GetNode<Player>("Player");

    // Méthode 1 : Lambda
    player.HealthChanged += (newHealth) => GD.Print($"Vie: {newHealth}");

    // Méthode 2 : Référence de méthode
    player.Died += OnPlayerDied;
}

private void OnPlayerDied()
{
    GD.Print("Game Over !");
}
```

### Attendre un signal (await)

```csharp
public async void SpawnEnnemi()
{
    // Attendre la fin de la frame courante
    await ToSignal(GetTree(), SceneTree.SignalName.ProcessFrame);

    // Le code continue après le signal
    GD.Print("Frame terminée, spawn de l'ennemi");
}
```

## Conventions de nommage

| Élément | Convention |
|---------|------------|
| Delegate | `NomDuSignalEventHandler` |
| Méthode connectée | `OnEmetteur_NomSignal` ou `OnNomSignal` |
| SignalName | `SignalName.NomDuSignal` |

## Cas d'usage

- **Timer** : Cooldowns, délais, spawn périodique
- **Collision** : Dégâts, ramassage d'objets
- **UI** : Boutons, sliders, changements d'état
- **Gameplay** : Score, mort, victoire, événements de jeu

## Connexions

### Notes liées
- [[Godot Csharp - Cycle de vie (_Ready, _Process, _PhysicsProcess)]] - Connexion dans `_Ready()`
- [[Godot Csharp - Instanciation de scènes]] - Signaux sur objets instanciés

### Dans le contexte de
- [[MOC - Godot]] - Communication entre noeuds

---

**Tags thématiques** : `#godot` `#csharp` `#gamedev` `#signaux` `#events`
