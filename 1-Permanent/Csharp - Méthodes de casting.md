---
type: permanent
created: 2026-01-27
tags:
  - permanent
  - csharp
  - casting
---

# Csharp - Méthodes de casting

> [!abstract] Concept
> Csharp offre trois syntaxes différentes pour convertir (caster) un objet vers un autre type, chacune avec ses particularités.

## Explication

### 1. Cast explicite : `(Type)`

```csharp
Camera3D camera = (Camera3D)GetNode("Camera3D");
```

- **Comportement** : Lance une `InvalidCastException` si le cast échoue
- **Usage** : Quand on est certain du type

### 2. Méthode générique : `<Type>()`

```csharp
Node3D objet = MaScene.Instantiate<Node3D>();
```

- **Comportement** : Retourne directement le bon type
- **Usage** : Méthodes qui supportent les génériques

### 3. Opérateur `as`

```csharp
Camera3D camera = GetNode("Camera3D") as Camera3D;
```

- **Comportement** : Retourne `null` si le cast échoue (pas d'exception)
- **Usage** : Quand on veut vérifier le type sans lever d'exception

## Comparaison

| Méthode | Syntaxe | Si échec | Performance |
|---------|---------|----------|-------------|
| Cast explicite | `(Type)obj` | Exception | Rapide |
| Générique | `Method<Type>()` | Dépend de la méthode | Rapide |
| `as` | `obj as Type` | `null` | Légèrement plus lent |

## Exemples pratiques Godot

### Récupérer un noeud avec vérification

```csharp
// Avec as (sécurisé)
Camera3D camera = GetNode("Camera3D") as Camera3D;
if (camera != null)
{
    camera.MakeCurrent();
}

// Avec cast explicite (si certain)
Camera3D camera = (Camera3D)GetNode("Camera3D");

// Avec générique
Camera3D camera = GetNode<Camera3D>("Camera3D");
```

### Pattern matching (Csharp moderne)

```csharp
if (GetNode("Camera3D") is Camera3D camera)
{
    // camera est déjà casté et non-null ici
    camera.MakeCurrent();
}
```

## Cas d'usage

- **Cast explicite** : Conversion garantie (ex: types numériques)
- **Générique** : API qui le supportent (Godot `GetNode<T>`, `Instantiate<T>`)
- **`as`** : Vérification de type sans exception
- **`is` + pattern** : Code moderne et lisible

## Connexions

### Notes liées
- [[Godot Csharp - Instanciation de scènes]] - Utilise `Instantiate<T>()`
- [[Godot Csharp - Cycle de vie (_Ready, _Process, _PhysicsProcess)]] - Utilise `GetNode<T>()`

### Dans le contexte de
- [[MOC - Godot]] - Fondamental pour les scripts Godot

---

**Tags thématiques** : `#csharp` `#casting` `#godot`
