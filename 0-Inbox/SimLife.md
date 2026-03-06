# SimLife — Concepts

> Créé le : 2026-03-06
> Dernière mise à jour : 2026-03-06

## Concepts

### Capture via SubViewport dans Godot

- **Date** : 2026-03-06
- **Contexte** : Génération de thumbnails de tuiles au lancement du jeu SimLife, pour alimenter un panneau d'édition d'environnement
- **Explication** :
  - Un `SubViewport` est un render target offscreen : une scène 3D s'y rend sans être visible à l'écran
  - Pipeline complet : `PackedScene` instanciée → ajoutée au `SubViewport` → rendu d'une frame → `GetTexture().GetImage()`
  - Structure de nœuds : `SubViewport` > `Camera3D` + `DirectionalLight3D` + [scène instanciée dynamiquement]
  - `GetTexture()` retourne une `ViewportTexture` — objet vivant tant que le viewport existe, lié à la VRAM
  - `GetImage()` effectue un readback GPU→CPU : opération coûteuse, à exécuter une seule fois au chargement
  - `ImageTexture.CreateFromImage()` renvoie la donnée sur le GPU sous forme de texture statique réutilisable
  - Il faut impérativement attendre le signal `RenderingServer.SignalName.FramePostDraw` avant de lire les pixels, sinon la frame n'est pas encore rendue
- **Liens** : Concept 2 (chargement dynamique dans SubViewport), Concept 3 (cache d'images)

---

### Chargement dynamique de scènes dans un SubViewport

- **Date** : 2026-03-06
- **Contexte** : Itération sur les scènes de tuiles dans `Scènes/Tiles/` pour générer leurs vignettes au démarrage de SimLife
- **Explication** :
  - `ResourceLoader.Load<PackedScene>(path)` charge une scène depuis le disque (retourne le cache si déjà chargé)
  - Pour générer plusieurs thumbnails en séquence : charger → instancier → `AddChild` au viewport → attendre frame → capturer → `QueueFree()`
  - `QueueFree()` est différé (fin de frame) : il faut attendre `SceneTree.SignalName.ProcessFrame` avant d'ajouter la scène suivante pour éviter les conflits de nœuds
  - La caméra du SubViewport doit être positionnée pour voir les tuiles plates, typiquement en vue isométrique ou 3/4
  - Exemple de positionnement caméra : `Position = new Vector3(0, 8, 5)` suivi de `LookAt(Vector3.Zero)`
- **Liens** : Concept 1 (capture via SubViewport), `Scènes/Tiles/`

---

### Gestion du cache d'images générées in-game (Godot)

- **Date** : 2026-03-06
- **Contexte** : Optimisation du panneau d'édition d'environnement dans SimLife — stocker les vignettes sans surcharger la mémoire
- **Explication** :
  - Hiérarchie mémoire des types Godot :
    - `Image` → RAM (CPU), pixel data brut, portable, idéal pour la manipulation
    - `ImageTexture` → VRAM (GPU), texture statique affichable, légère à conserver
    - `ViewportTexture` → VRAM (GPU), liée au Viewport vivant, lourde et non persistable
  - Pour un cache de thumbnails : stocker des `ImageTexture`, jamais des `Image` brutes (gaspillage CPU) ni des `ViewportTexture` (dépendance au viewport)
  - Structure recommandée en C# : `Dictionary<string, ImageTexture> ThumbnailCache`
  - Attention GC C# : les objets Godot héritant de `Resource` ou `Object` ne libèrent PAS la VRAM automatiquement via le garbage collector C# → appeler `.Free()` explicitement sur les textures inutilisées
  - Stratégie pour SimLife : générer au chargement, stocker dans le cache, lire en jeu, appeler `Free()` à la fin de session ou lors du changement de contexte
- **Liens** : Concept 1 (SubViewport), Concept 2 (chargement dynamique), `Scripts/`

---
