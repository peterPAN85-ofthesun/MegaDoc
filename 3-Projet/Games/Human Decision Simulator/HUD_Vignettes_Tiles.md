# Panneau HUD coulissant + vignettes de tiles générées au chargement

> Document de conception et d'apprentissage pour SimLife (Godot 4.5, C#).
> Objectif : un panneau HUD qui **slide depuis la gauche** et affiche en **vignettes**
> les tiles disponibles dans `Scènes/Tiles/`, ces vignettes étant **générées à chaque
> lancement** pendant un **écran de chargement**.

---

## 0. Ce que tu as déjà dans le projet (point de départ)

Avant de commencer, voici les briques existantes sur lesquelles on va s'appuyer :

| Élément | Fichier | Rôle actuel |
|---|---|---|
| Scène principale | `Scènes/MainScene.tscn` | Racine `Node3D` (Light, Floor, `Guird`, `Camera`, `Ui`) |
| HUD existant | `Scènes/UI.tscn` | `Control` "Ui" → `Background` (TextureRect) → `ScrollContainer` ancré à gauche |
| Caméra | `Scripts/Camera.cs` | `RigidBody3D` + raycast, émet le signal `OnAirSelected(Rid)` |
| Tuiles | `Scènes/Tiles/*.tscn` | `Tile_Base.tscn` (base), `ground_base.tscn`, `ground_brick.tscn` |
| Grille | `Scripts/Guird.cs` | Instancie `TileBase` sur une grille X×Z |
| Tuile | `Scripts/TileBase.cs` | `Node3D` + mesh + `Area3D`, highlight au survol |

Tu as donc **déjà** un `ScrollContainer` ancré à gauche dans `UI.tscn` : c'est exactement
là que les vignettes vont venir se ranger. Le panneau coulissant englobera ce conteneur.

---

## 1. Vue d'ensemble du workflow

L'idée générale, en 3 temps :

```
┌──────────────────────────────────────────────────────────────────────┐
│  1. ÉCRAN DE CHARGEMENT (scène de démarrage)                           │
│     - Scanne le dossier Scènes/Tiles/                                  │
│     - Pour chaque tile : rend une image dans un SubViewport            │
│       (mini-scène 3D hors écran) → récupère une Texture2D              │
│     - Stocke {nom_tile -> Texture2D} dans un singleton (Autoload)      │
│     - Affiche une barre de progression                                 │
│     - Quand tout est prêt -> change vers MainScene                     │
└──────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│  2. MAINSCENE                                                          │
│     - Le HUD (panneau gauche) lit le singleton                         │
│     - Crée une vignette cliquable (TextureButton) par tile             │
│     - Le panneau peut slider (Tween sur sa position X)                 │
└──────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│  3. INTERACTION                                                        │
│     - Clic sur une vignette -> "tile sélectionnée"                     │
│     - Le clic dans le monde 3D (déjà géré par Camera.cs) place /       │
│       remplace la tile sous le curseur                                 │
└──────────────────────────────────────────────────────────────────────┘
```

### Les 3 morceaux de code à créer

| Composant | Type | Responsabilité |
|---|---|---|
| `TileLibrary` | **Autoload** (singleton) | Liste des tiles + dictionnaire des vignettes en mémoire |
| `ThumbnailMaker` | classe/Node utilitaire | Génère une `Texture2D` à partir d'une `PackedScene` de tile |
| `LoadingScreen` | Scène + script | Pilote la génération, affiche la progression, charge MainScene |
| `TilePanel` | Scène + script | Le panneau coulissant + remplissage des vignettes + slide |

> **Pourquoi un Autoload ?** Parce que les vignettes générées au chargement doivent
> **survivre au changement de scène** (de `LoadingScreen` vers `MainScene`). Un Autoload
> est un nœud qui reste vivant pendant toute la durée du jeu : c'est le bon endroit pour
> un cache d'assets.

---

## 2. Concepts techniques Godot à maîtriser

Cette section explique **chaque notion** dont tu as besoin. Lis-la avant de coder.

### 2.1 Le système de HUD : `Control`, `CanvasLayer`, ancres et conteneurs

En Godot, **toute l'UI 2D** repose sur des nœuds qui héritent de `Control`.

- **`Control`** : nœud de base de l'UI. Il a une **taille** et une **position**, mais
  surtout un système d'**ancres** (`anchors`) qui dit comment il se positionne par rapport
  à son parent quand la fenêtre est redimensionnée.
- **Ancres (`anchors_preset`)** : tu as déjà `anchors_preset = 9` sur ton `ScrollContainer`
  (= "left wide", collé à gauche, étiré verticalement). C'est exactement ce qu'on veut pour
  un panneau latéral.
- **`CanvasLayer`** : une couche de dessin qui **ne bouge pas avec la caméra 3D** et se
  dessine **par-dessus** le monde. Pour un HUD, on met souvent l'UI dans un `CanvasLayer`
  pour être sûr qu'elle reste fixe à l'écran et au-dessus de tout. *(Dans ton projet, ton
  `Ui` est un `Control` enfant direct du `Node3D` racine ; ça marche parce que l'UI 2D se
  dessine de toute façon au-dessus de la 3D, mais un `CanvasLayer` est plus robuste si tu
  ajoutes plus tard des effets ou plusieurs couches.)*

#### Les conteneurs (le point clé pour ranger des vignettes)

Un **Container** est un `Control` qui **positionne automatiquement ses enfants**. Tu ne
places pas les vignettes à la main : tu les ajoutes comme enfants d'un conteneur et il
gère la disposition. Les plus utiles ici :

| Conteneur | Disposition |
|---|---|
| `VBoxContainer` | empile verticalement (une colonne) |
| `HBoxContainer` | aligne horizontalement (une ligne) |
| `GridContainer` | grille à N colonnes (`columns`) — idéal pour des vignettes |
| `ScrollContainer` | ajoute une barre de défilement si le contenu dépasse |
| `PanelContainer` | dessine un fond + marges autour de son unique enfant |

**Structure recommandée du panneau** (hiérarchie de nœuds) :

```
TilePanel (Control)              ← on anime SA position pour le slide
└── PanelContainer               ← fond visuel du panneau
    └── ScrollContainer          ← défilement si beaucoup de tiles
        └── GridContainer        ← grille de vignettes (columns = 1 ou 2)
            ├── (vignette 1)     ← créées par code au runtime
            ├── (vignette 2)
            └── ...
```

> Tu as déjà `Background` + `ScrollContainer` dans `UI.tscn`. Tu peux soit réutiliser ce
> `ScrollContainer` en y ajoutant un `GridContainer` dedans, soit créer une scène
> `TilePanel.tscn` dédiée. Je conseille une **scène dédiée** : c'est plus propre à animer
> et à réutiliser.

#### `mouse_filter` (piège classique)

Chaque `Control` a une propriété `mouse_filter` :
- `Stop` : capte le clic (les nœuds derrière ne le reçoivent pas).
- `Pass` : réagit mais laisse passer aux nœuds derrière.
- `Ignore` : invisible aux clics.

⚠️ Un grand `Control`/`TextureRect` de fond en `Stop` qui couvre l'écran **bloquera** les
clics destinés au monde 3D. Mets les zones "vides" du HUD en `Ignore`, et garde `Stop`
uniquement sur les vignettes et le fond réel du panneau.

---

### 2.2 Génération de vignettes : le rendu hors-écran avec `SubViewport`

C'est le cœur technique. On ne peut pas "prendre une photo" d'une scène 3D directement ;
il faut la **rendre dans un viewport** puis **lire le résultat sous forme d'image**.

#### Qu'est-ce qu'un `SubViewport` ?

Un **`Viewport`** est une surface de rendu. La fenêtre du jeu est un viewport. Un
**`SubViewport`** est un viewport "imbriqué" : tu peux y mettre une mini-scène 3D (une
caméra + une lumière + une tile) et il rend cette scène dans une **texture** que tu
récupères, **sans l'afficher à l'écran**.

C'est la technique standard pour : portraits de personnages, aperçus d'objets d'inventaire,
minimap… et donc nos vignettes de tiles.

#### Recette complète (C#)

```csharp
using Godot;

public partial class ThumbnailMaker : Node
{
    [Export] public Vector2I ThumbSize = new Vector2I(128, 128);

    private SubViewport _viewport;
    private Camera3D _cam;

    public override void _Ready()
    {
        // 1) Le SubViewport : surface de rendu hors écran
        _viewport = new SubViewport
        {
            Size = ThumbSize,
            TransparentBg = true,                          // fond transparent
            RenderTargetUpdateMode = SubViewport.UpdateMode.Always,
        };
        AddChild(_viewport);

        // 2) Une lumière pour ne pas avoir une tile toute noire
        var light = new DirectionalLight3D();
        light.RotationDegrees = new Vector3(-50, -40, 0);
        _viewport.AddChild(light);

        // 3) Une caméra qui regarde le centre, vue 3/4 (comme un jeu de gestion)
        _cam = new Camera3D();
        _cam.Position = new Vector3(8, 9, 8);
        _cam.LookAt(Vector3.Zero, Vector3.Up);
        _viewport.AddChild(_cam);
    }

    /// Rend UNE tile et retourne sa vignette en Texture2D.
    public async System.Threading.Tasks.Task<Texture2D> RenderThumbnail(PackedScene tileScene)
    {
        // a) instancier la tile dans le viewport
        Node3D tile = tileScene.Instantiate<Node3D>();
        _viewport.AddChild(tile);

        // b) attendre que le GPU ait dessiné au moins une image
        //    (sinon on lit une texture vide)
        await ToSignal(RenderingServer.Singleton, RenderingServer.SignalName.FramePostDraw);

        // c) lire le résultat GPU -> CPU
        Image img = _viewport.GetTexture().GetImage();
        Texture2D tex = ImageTexture.CreateFromImage(img);

        // d) nettoyer : libérer la tile pour la suivante
        tile.QueueFree();

        return tex;
    }
}
```

#### Points de vigilance (ce qui fait rater le rendu)

1. **Attendre une frame avant de lire.** Le rendu est asynchrone (GPU). Si tu appelles
   `GetTexture().GetImage()` tout de suite, l'image est vide/noire. D'où le
   `await ToSignal(RenderingServer.Singleton, FramePostDraw)`. Parfois il faut **2 frames**
   selon le moteur ; en cas d'image vide, attends deux fois.
2. **`GetImage()` copie la mémoire GPU vers le CPU.** C'est une opération **coûteuse**.
   On la fait **une seule fois par tile au chargement**, jamais dans `_Process`.
3. **Le cadrage de la caméra** dépend de la taille de ta tile (ici 10×10 unités, vu
   `Tile_Base.tscn`). Ajuste `_cam.Position` / `_cam.Fov` ou utilise une caméra
   `Orthogonal` (`Projection = Camera3D.ProjectionType.Orthogonal; Size = 14;`) pour un
   rendu type "icône" sans déformation de perspective.
4. **Les matériaux `resource_local_to_scene = true`** (comme dans `ground_base.tscn`) sont
   dupliqués par instance : parfait, chaque vignette aura son propre matériau et la
   génération n'altère pas les tiles du jeu.
5. **Réutilise le même `SubViewport`** pour toutes les tiles (ajoute/retire la tile). Créer
   un viewport par tile gaspille de la mémoire.

---

### 2.3 L'écran de chargement et l'asynchronisme (`await`)

#### Pourquoi un écran de chargement ?

Générer N vignettes = N rendus + N copies GPU→CPU. Si on faisait ça en bloquant le thread
principal, le jeu **figerait**. On veut donc :
- générer **une tile par frame** (laisser le moteur respirer entre chaque),
- afficher une **barre de progression**,
- basculer vers `MainScene` à la fin.

#### `await` en C# dans Godot

Godot expose `ToSignal(objet, "nom_du_signal")` qui renvoie un objet "awaitable". Combiné
à `await`, ça permet de **mettre en pause une méthode** jusqu'à ce qu'un signal soit émis,
**sans bloquer le jeu**.

```csharp
// "attends la prochaine frame de traitement, puis continue"
await ToSignal(GetTree(), SceneTree.SignalName.ProcessFrame);
```

#### Squelette du `LoadingScreen`

```csharp
using Godot;

public partial class LoadingScreen : Control
{
    [Export] private ProgressBar _progress;          // barre dans la scène
    [Export] private string _nextScene = "res://Scènes/MainScene.tscn";

    private ThumbnailMaker _maker;

    public override async void _Ready()
    {
        _maker = new ThumbnailMaker();
        AddChild(_maker);

        // 1) trouver toutes les tiles
        var tilePaths = TileLibrary.Instance.ScanTiles();   // voir §2.5
        _progress.MaxValue = tilePaths.Count;

        // 2) générer chaque vignette, une par frame
        int done = 0;
        foreach (string path in tilePaths)
        {
            var scene = GD.Load<PackedScene>(path);
            Texture2D thumb = await _maker.RenderThumbnail(scene);

            TileLibrary.Instance.Register(path, scene, thumb);  // stockage dans le cache

            done++;
            _progress.Value = done;

            // laisser une frame s'écouler -> l'UI se met à jour, pas de freeze
            await ToSignal(GetTree(), SceneTree.SignalName.ProcessFrame);
        }

        // 3) tout est prêt -> on change de scène
        GetTree().ChangeSceneToFile(_nextScene);
    }
}
```

> **Pense à définir cet écran comme scène principale** au lieu de `MainScene`
> (Projet → Paramètres du projet → Application → Run → Main Scene), sinon le chargement
> ne se déclenche jamais au lancement.

---

### 2.4 Le singleton de cache : `TileLibrary` (Autoload)

#### Qu'est-ce qu'un Autoload (singleton) ?

Un **Autoload** est un script/scène que Godot charge **automatiquement au démarrage** et
qui reste vivant **toute la partie**, accessible de partout. On le déclare dans
Projet → Paramètres du projet → **Autoload** (nom + chemin du script). En C#, on expose une
référence statique `Instance` pour y accéder facilement.

C'est l'endroit idéal pour stocker `{ tile -> vignette }` car ce cache doit survivre au
passage `LoadingScreen → MainScene`.

```csharp
using Godot;
using System.Collections.Generic;

public partial class TileLibrary : Node
{
    public static TileLibrary Instance { get; private set; }

    // une entrée par tile
    public class TileEntry
    {
        public string Path;
        public PackedScene Scene;   // pour instancier la tile dans le monde
        public Texture2D Thumb;     // la vignette pour le HUD
        public string DisplayName;
    }

    public readonly List<TileEntry> Tiles = new();

    public override void _Ready()
    {
        Instance = this;  // accessible via TileLibrary.Instance partout
    }

    // Scanne le dossier des tiles et renvoie les chemins .tscn
    public List<string> ScanTiles()
    {
        var paths = new List<string>();
        const string dir = "res://Scènes/Tiles/";
        using var d = DirAccess.Open(dir);
        if (d != null)
        {
            foreach (string f in d.GetFiles())
            {
                // .tscn en éditeur, .tscn.remap dans l'export -> on filtre large
                if (f.EndsWith(".tscn") || f.EndsWith(".tscn.remap"))
                    paths.Add(dir + f.TrimSuffix(".remap"));
            }
        }
        return paths;
    }

    public void Register(string path, PackedScene scene, Texture2D thumb)
    {
        Tiles.Add(new TileEntry
        {
            Path = path,
            Scene = scene,
            Thumb = thumb,
            DisplayName = path.GetFile().TrimSuffix(".tscn"),
        });
    }
}
```

> **Note "écran d'export"** : en jeu exporté, les fichiers `.tscn` deviennent `.tscn.remap`
> et `DirAccess` les voit ainsi. D'où le filtre ci-dessus. Tant que tu travailles dans
> l'éditeur, tu n'auras que des `.tscn`.

---

### 2.5 Le panneau coulissant : `Control` + `Tween` (animation du slide)

#### Comment "slider" un panneau ?

On anime sa **position X** entre deux états :
- **caché** : poussé à gauche hors écran (X négatif égal à sa largeur),
- **visible** : X = 0 (collé au bord gauche).

Le moyen le plus simple et moderne en Godot 4 est le **`Tween`** : un objet qui interpole
une propriété dans le temps avec une courbe d'accélération (`Tween.TransitionType`).

```csharp
using Godot;

public partial class TilePanel : Control
{
    [Export] private GridContainer _grid;        // le conteneur des vignettes
    [Export] private float _slideTime = 0.3f;

    private bool _open = true;
    private float _hiddenX;
    private float _shownX;

    public override void _Ready()
    {
        _shownX = 0f;
        _hiddenX = -Size.X;     // largeur du panneau vers la gauche

        BuildThumbnails();      // remplir depuis le cache
    }

    private void BuildThumbnails()
    {
        foreach (var entry in TileLibrary.Instance.Tiles)
        {
            var btn = new TextureButton
            {
                TextureNormal = entry.Thumb,
                IgnoreTextureSize = true,                       // forcer une taille fixe
                StretchMode = TextureButton.StretchModeEnum.KeepAspectCentered,
                CustomMinimumSize = new Vector2(96, 96),
            };
            // capture de l'entrée pour le clic
            var captured = entry;
            btn.Pressed += () => OnTileSelected(captured);
            _grid.AddChild(btn);
        }
    }

    private void OnTileSelected(TileLibrary.TileEntry entry)
    {
        GD.Print($"Tile choisie : {entry.DisplayName}");
        // -> mémoriser la sélection courante (voir §2.6)
    }

    public void Toggle()
    {
        _open = !_open;
        var tween = CreateTween();
        tween.SetTrans(Tween.TransitionType.Cubic).SetEase(Tween.EaseType.Out);
        tween.TweenProperty(this, "position:x", _open ? _shownX : _hiddenX, _slideTime);
    }
}
```

Points clés :
- **`CreateTween()`** crée un tween jetable qui s'auto-détruit à la fin.
- **`TweenProperty(this, "position:x", cible, durée)`** anime uniquement la composante X.
- **`TextureButton`** est un bouton dont l'apparence EST la texture → parfait pour une
  vignette cliquable. (Alternative : un `Button` avec une icône, ou un `Panel` + `TextureRect`.)
- Pour déclencher `Toggle()`, branche-le sur une touche (`_Input`) ou un petit bouton
  "onglet" toujours visible au bord de l'écran.

> **Alternative au Tween : `AnimationPlayer`.** Si tu préfères régler l'animation
> visuellement dans l'éditeur (clés, courbes), un `AnimationPlayer` avec deux animations
> `slide_in` / `slide_out` fait le même travail. Le Tween est plus simple en pur code.

---

### 2.6 Relier la sélection au placement dans le monde (interaction)

Tu as déjà toute la mécanique de désignation 3D dans `Camera.cs` :
`raycast.GetColliderRid()` + signal `OnAirSelected(Rid)` que `TileBase` écoute pour le
highlight. Pour **placer** une tile, l'idée est :

1. Le HUD mémorise la **tile sélectionnée** (`TileEntry` courant) — par ex. dans
   `TileLibrary.Instance.Selected`.
2. Au **clic gauche** dans le monde, on récupère la tile sous le curseur (via le raycast)
   et on **remplace** son mesh/scène par celui de la tile sélectionnée, ou on **instancie**
   une nouvelle tile à la position de la cellule.

Schéma minimal côté `Camera.cs` (à ajouter dans `_Input` ou `_Process`) :

```csharp
if (Input.IsActionJustPressed("ui_accept_or_click"))   // mappe un clic gauche
{
    Rid hit = raycast.GetColliderRid();
    // émettre un signal "OnTilePlaced(hit)" que la grille/tuiles écoutent,
    // ou appeler directement une méthode de Guird pour remplacer la cellule visée.
}
```

> C'est une étape "logique de jeu" qui dépend de comment tu veux gérer ta grille
> (remplacement de matériau, ou destruction/instanciation de la cellule). Le présent
> document se concentre sur le HUD et les vignettes ; je note juste le **point d'accroche**
> pour que tu saches où brancher la suite.

---

## 3. Gestion de la mémoire dans Godot (ce qu'il faut comprendre)

C'est un de tes points d'interrogation, voici les règles essentielles.

### 3.1 Deux familles d'objets

| Famille | Exemples | Libération |
|---|---|---|
| **`Node`** (dans l'arbre) | `Control`, `Camera3D`, `SubViewport`, tes tiles | **manuelle** via `QueueFree()` |
| **`RefCounted` / `Resource`** | `Texture2D`, `Image`, `PackedScene`, `ImageTexture` | **automatique** (comptage de références) |

- Un **`Node`** n'est PAS libéré tout seul. Tant qu'il est dans l'arbre (ou référencé), il
  vit. Tu dois appeler **`QueueFree()`** (libération différée, sûre) pour le détruire.
  → Dans `ThumbnailMaker`, on fait `tile.QueueFree()` après chaque rendu.
- Une **`Resource`** (dont `Texture2D`) est **comptée par référence** : tant qu'une
  variable la référence (ex. `TileEntry.Thumb` dans la liste du singleton), elle reste en
  mémoire. Dès que plus rien ne la référence, Godot la libère automatiquement.
  → Tes vignettes vivent **parce que** le singleton `TileLibrary` les garde dans sa liste.
  C'est exactement ce qu'on veut (cache persistant).

### 3.2 Conséquences pratiques pour ce projet

1. **Le `SubViewport` de génération** : une fois toutes les vignettes faites, tu peux le
   `QueueFree()` (dans `LoadingScreen`, ou laisse `ThumbnailMaker` se libérer). Inutile de
   garder une machine de rendu 3D ouverte tout le jeu.
2. **Les `Texture2D` des vignettes** : garde-les dans le singleton tant que le HUD en a
   besoin. Si un jour tu veux libérer la mémoire, vide la liste → elles disparaissent
   automatiquement.
3. **`GetImage()` = coût mémoire/CPU** : chaque vignette 128×128 RGBA ≈ 64 Ko en RAM. Pour
   quelques dizaines de tiles, c'est négligeable. Pour des centaines, envisage des
   vignettes plus petites (64×64) ou une génération à la demande.
4. **C# et `Dispose()`** : les objets Godot en C# ont un wrapper managé. En général
   `QueueFree()` suffit ; ne te complique pas avec `Dispose()` manuel sauf cas précis
   (objets `RefCounted` créés et jamais ajoutés à l'arbre que tu veux libérer tout de suite).
5. **`preload` vs `load`** :
   - `GD.Load<PackedScene>(path)` (= `load`) : chargé à l'exécution, dynamique → c'est ce
     qu'on utilise puisqu'on découvre les tiles au runtime.
   - `[Export] PackedScene x` ou `GD.Load` en constante : pour des assets connus à l'avance.
   - Dans notre cas (scan de dossier), `load` dynamique est obligatoire.

### 3.3 Faut-il régénérer à chaque lancement ?

Tu l'as demandé explicitement : **oui, génération à chaque lancement**. Avantages :
- toujours à jour si tu ajoutes/modifies une tile (pas de cache disque périmé),
- simple (pas de gestion de fichiers de cache).

Si un jour le chargement devient long, l'optimisation classique est de **sauvegarder les
vignettes sur disque** (`img.SavePng("user://thumbs/xxx.png")`) et de ne régénérer que si
le fichier de tile est plus récent. Mais commence **sans** : la régénération est largement
assez rapide pour 3–30 tiles.

---

## 4. Plan d'implémentation pas à pas (checklist)

Quand tu seras prêt à coder, voici l'ordre recommandé :

1. **Autoload `TileLibrary`**
   - [ ] Créer `Scripts/TileLibrary.cs` (cf. §2.4).
   - [ ] L'enregistrer dans Projet → Paramètres → Autoload (nom : `TileLibrary`).
2. **Générateur `ThumbnailMaker`**
   - [ ] Créer `Scripts/ThumbnailMaker.cs` (cf. §2.2).
   - [ ] Tester en générant UNE vignette et en l'affichant dans un `TextureRect`.
   - [ ] Régler la caméra (perspective 3/4 ou orthographique) jusqu'au cadrage voulu.
3. **Écran de chargement `LoadingScreen`**
   - [ ] Créer `Scènes/LoadingScreen.tscn` : `Control` + `ProgressBar` + un `Label`.
   - [ ] Créer `Scripts/LoadingScreen.cs` (cf. §2.3).
   - [ ] Définir cette scène comme **Main Scene** du projet.
   - [ ] Vérifier que la barre avance et qu'on bascule vers `MainScene`.
4. **Panneau `TilePanel`**
   - [ ] Créer `Scènes/TilePanel.tscn` : `Control > PanelContainer > ScrollContainer > GridContainer`.
   - [ ] Créer `Scripts/TilePanel.cs` (cf. §2.5).
   - [ ] L'ajouter dans `MainScene` (ou l'intégrer à `UI.tscn`).
   - [ ] Vérifier le remplissage des vignettes depuis `TileLibrary`.
5. **Slide**
   - [ ] Brancher `Toggle()` sur une touche ou un onglet cliquable.
   - [ ] Régler `_slideTime` et la courbe (`Cubic`, `Back`, etc.).
6. **Interaction (optionnel, étape suivante)**
   - [ ] Mémoriser la tile sélectionnée.
   - [ ] Brancher le clic monde → placement/remplacement de tile (cf. §2.6).

---

## 5. Pièges fréquents (récapitulatif)

- ❌ Lire `GetImage()` **sans attendre** une frame → vignette noire/vide.
  ✅ `await ToSignal(RenderingServer.Singleton, FramePostDraw)` avant de lire.
- ❌ Générer dans une boucle `for` **sans `await`** entre chaque → freeze + barre figée.
  ✅ `await ToSignal(GetTree(), ProcessFrame)` à chaque itération.
- ❌ Oublier de définir `LoadingScreen` comme Main Scene → rien ne se génère.
- ❌ Un `TextureRect`/fond en `mouse_filter = Stop` qui couvre l'écran → clics 3D bloqués.
  ✅ Zones vides en `Ignore`.
- ❌ Pas de lumière dans le `SubViewport` → tiles toutes noires.
- ❌ Stocker les vignettes dans la scène `LoadingScreen` (détruite au changement) au lieu
  du singleton → vignettes perdues dans `MainScene`.
- ❌ Capturer la variable de boucle directement dans le lambda du bouton (toutes les
  vignettes pointeraient sur la dernière tile). ✅ Copier dans une variable locale
  (`var captured = entry;`).

---

## 6. Références utiles (doc Godot 4)

- Viewports & rendu hors-écran : *Using Viewports* / `SubViewport`
- UI : *GUI containers*, classes `Control`, `GridContainer`, `ScrollContainer`, `TextureButton`
- Animation par code : classe `Tween`, `SceneTree.create_tween` / `Node.create_tween`
- Autoloads : *Singletons (Autoload)*
- Accès fichiers : classe `DirAccess`
- Changement de scène : `SceneTree.change_scene_to_file`

> Astuce : dans l'éditeur Godot, F1 ouvre la doc intégrée hors-ligne — cherche directement
> les noms de classes ci-dessus (`SubViewport`, `Tween`, `Control`…).
