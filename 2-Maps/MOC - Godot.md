---
type: moc
created: 2026-01-27
tags:
  - moc
  - godot
  - csharp
  - gamedev
---

# 🗺️ MOC - Godot

> [!note] Vue d'ensemble
> Ce MOC organise les concepts de développement de jeux avec Godot Engine en utilisant C#. Il couvre le cycle de vie, les contrôles, la physique, et les systèmes de jeu.

## Introduction

Godot est un moteur de jeu open-source supportant GDScript et C#. Ce MOC se concentre sur le développement en C#, offrant une transition naturelle pour les développeurs venant de Unity ou ayant une expérience .NET.

## Structure thématique

### 🎮 Fondamentaux C# dans Godot

Les bases pour écrire des scripts Godot en C# :

- [[Godot Csharp - Cycle de vie (_Ready, _Process, _PhysicsProcess)]]
- [[Csharp - Méthodes de casting]]
- [[Csharp - Modificateurs d'accès]]
- [[Csharp vs C++ - Gestion mémoire (new et GC)]]

### 🕹️ Système d'Input

Gestion des entrées utilisateur (clavier, souris, manette) :

- [[Godot Csharp - Input mapping personnalisé]]
- [[Godot Csharp - Gestion du curseur souris]]
- [[Godot Csharp - Rotation caméra FPS]]

### 🚶 Physique et Déplacement

Faire bouger les personnages et objets :

- [[Godot Csharp - Déplacement CharacterBody3D]]

### 📦 Instanciation et Scènes

Créer et gérer des objets dynamiquement :

- [[Godot Csharp - Instanciation de scènes]]

### 📡 Communication entre noeuds

Signaux et événements pour un code découplé :

- [[Godot Csharp - Signaux et événements]]

### 🎬 Animation

Animer les éléments du jeu :

- [[Godot Csharp - AnimationPlayer]]

### 📊 Structures de données

Collections et données de jeu :

- [[Godot Csharp - Collections (Array, Dictionary)]]

## Notes principales

Les concepts essentiels à maîtriser en priorité :

1. **[[Godot Csharp - Cycle de vie (_Ready, _Process, _PhysicsProcess)]]** - Comprendre quand le code s'exécute
2. **[[Godot Csharp - Déplacement CharacterBody3D]]** - Faire bouger un personnage
3. **[[Godot Csharp - Signaux et événements]]** - Communication entre objets
4. **[[Godot Csharp - Input mapping personnalisé]]** - Gérer les contrôles multi-plateforme
5. **[[Godot Csharp - Instanciation de scènes]]** - Créer des objets à l'exécution

## Ressources externes

- [Documentation officielle Godot](https://docs.godotengine.org/en/stable/)
- [Godot C# API](https://docs.godotengine.org/en/stable/tutorials/scripting/c_sharp/index.html)
- [GDQuest - Tutoriels Godot](https://www.gdquest.com/)

## 🚧 Concepts à développer

Sujets identifiés mais pas encore couverts :

- [ ] RigidBody3D et physique réaliste
- [ ] Area3D et zones de détection
- [ ] Navigation et pathfinding (NavigationAgent)
- [ ] Audio (AudioStreamPlayer)
- [ ] UI avec Control nodes
- [ ] Shaders et effets visuels
- [ ] Sauvegarde et chargement
- [ ] Multijoueur et réseau
- [ ] Optimisation et profiling
- [ ] Export et déploiement

---
**Dernière mise à jour** : 2026-01-27
**Nombre de notes** : 12
