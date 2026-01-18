

# 1 - Premier script C# sur Godot

exemple d'un script pour faire tourner une caméra façon FPS

```cs
public partial class Player : CharacterBody3D
{
	//Mouse
	float m_lookAngle = 90.0f;
	[Export]
	float m_mouseSens = 0.3f;
	Vector2 m_mouseDelta = new Vector2();

	Camera3D camera;

	public override void _Ready()
	{

		//On récupère le noeud camera
		base._Ready();
		camera = GetNode("Camera3D") as Camera3D; //catch

	}

	public override void _Input(InputEvent ev)
	{
		if (ev is InputEventMouseMotion eventMouse)
		{
			//On récupère les mouvements de la souris
			m_mouseDelta = eventMouse.Relative;
		}
	}

	public override void _Process(double delta)
	{
		base._Process(delta);


		//Rotation de la cam Axe X et Y
		camera.RotationDegrees -= new Vector3(Mathf.RadToDeg(m_mouseDelta.Y), 0, 0) * m_mouseSens * (float)delta;
		camera.RotationDegrees = new Vector3(Mathf.Clamp(camera.RotationDegrees.X, -m_lookAngle, m_lookAngle), camera.RotationDegrees.Y, camera.RotationDegrees.Z);


		RotationDegrees -= new Vector3(0, Mathf.RadToDeg(m_mouseDelta.X), 0) * m_mouseSens * (float)delta;

		//Réinitialisation de la variable m_mouseDelta
		m_mouseDelta = new Vector2();

	}
};
```

Détails :
- ligne 4 : `partial` signifie qu'on complète une classe déjà existante dans un autre fichier.
- ligne 10 : `[Export]` permet d'éditer la variable directement depuis l'interface Godot
- fonction `_Ready()` : se lance dès que l'objet est créé
- fonction `_Input(InputEvent)` : se met à jour dès l'intervention d'un input. Dans le cas présent, on vérifie si l'input est un mouvement de souris. Si oui on récupère son vecteur de déplacement.
- fonction `_Process(double delta)` : boucle de jeu, on tourne la caméra sur tous les axe à chaque frame.

>[!NOTE]
>Différence dans la manière d'allouer la mémoire en C, C++ et CSharp
>- En c on utilise `malloc` et on libère avec `free`
>- en C++ et C# on utilise `new` mais ils n'ont pas la même utilité 
>
>En C++ : `new` permet de réserver de la mémoire pour un objet (ex : `new obj`) ou pour un groupe d'objet (ex : `new[] obj`). Il renvoie l'adresse de l'objet. Il doit être explicitement détruit comme pour le C avec `delete obj` ou `delete[] obj`
>En CSharp : `new` créé un nouvel objet et fait directement référence à cet l'objet.  Grâce au Grabage Collector, il sera détruit automatiquement.


# 2 - Créer un événement personnalisé à partir de plusieurs input

Aller dans `Projet -> Paramètre du Projet -> Contrôles`

D'ici on peu créer des événements ou en ajouter des personnalisé. On y associe les entrées que l'on souhaite.
Par exemple `avancer : [flèche de droite] - [D] - [joystick gauche]`


Ensuite dans le code, on peut venir questionner l'état de l'Input

```cs
if (Input.IsActionPressed("avancer")) 
{
	//avance
}
if (Input.IsActionReleased("avancer"))
{
	//avance
}
```

# 3 - Déplacer un CharacterBody3D

```cs
using Godot;
using System;

public partial class Player : CharacterBody3D
{
    //Mouse
    float m_lookAngle = 90.0f;
    [Export]
    float m_mouseSens = 0.3f;
    Vector2 m_mouseDelta = new Vector2();

    //Clavier
    float moveSpeed = 7.0f;
    float gravity = 10.0f;
    float jumpForce = 8.0f;

    Camera3D camera;

    public override void _Ready()
    {
        //On récupère le noeud camera

        base._Ready();
        camera = GetNode("Camera3D") as Camera3D; //catch
    }

    public override void _Input(InputEvent ev)
    {
        if (ev is InputEventMouseMotion eventMouse)
        {
            //On récupère les mouvements de la souris
            m_mouseDelta = eventMouse.Relative;
        }
    }

    public override void _Process(double delta)
    {
        base._Process(delta);


        //Rotation de la cam Axe X et Y 
        camera.RotationDegrees -= new Vector3(Mathf.RadToDeg(m_mouseDelta.Y), 0, 0) * m_mouseSens * (float)delta;
        camera.RotationDegrees = new Vector3(Mathf.Clamp(camera.RotationDegrees.X, -m_lookAngle, m_lookAngle), camera.RotationDegrees.Y, camera.RotationDegrees.Z);


        RotationDegrees -= new Vector3(0, Mathf.RadToDeg(m_mouseDelta.X), 0) * m_mouseSens * (float)delta;


        //Réinitialisation de la variable m_mouseDelta
        m_mouseDelta = Vector2.Zero;

    }


    public override void _PhysicsProcess(double delta)
    {
        base._PhysicsProcess(delta);
        var velocity = Velocity;

        velocity.X = 0;
        velocity.Z = 0;


        var direction = new Vector2();
        if (Input.IsActionPressed("ui_up"))
        {
            direction.Y -= 1;
        }
        if (Input.IsActionPressed("ui_down"))
        {
            direction.Y += 1;
        }
        if (Input.IsActionPressed("ui_left"))
        {
            direction.X -= 1;
        }
        if (Input.IsActionPressed("ui_right"))
        {
            direction.X += 1;
        }


        direction = direction.Normalized();

        var forward = GlobalTransform.Basis.Z;
        var right = GlobalTransform.Basis.X;

        velocity.Z = (forward * direction.Y + right * direction.X).Z * moveSpeed;
        velocity.X = (forward * direction.Y + right * direction.X).X * moveSpeed;

        velocity.Y -= gravity * (float)delta;

        Velocity = velocity;
        MoveAndSlide();

    }
};
```

Pour gérer les éléments liés à la physique de l'objet, il faut être placé dans la méthode `_PhysicsProcess(double delta)`

Pour obtenir l'orientation de l'objet en global : `GlobalTransform.Basis` (Vector3 ou Vector2 suivant le contexte)

Pour un déplacement, 2 possibilités :
- `MoveAndSlide()` (simple)
- `MoveAndCollide()` (complexe)

>[!CLAUDE]
>Approfondir `MoveAndCollide()`

Pour `MoveAndSlide()`, il faut auparavant renseigner la propriété `Velocity`qui correspond au vecteur de déplacement en Local.

>[!IMPORTANT]
>On ne peut pas éditer directement les composantes X et Y de `Velocity`, il faut passer préalablement par une variable de type `Vector2` ou `Vector3` suivant le contexte

3 méthodes pour caster :
- `(type)MaFonction()`
- `MaFonction<type>()`
- `MaFonction() as type`


# 4 - Instancier un objet

### a) trouver la scène ou se trouve l'objet à instancier

2 méthodes :
- statique
- dynamique

Statique :
```cs
public partial class Player : CharacterBody3D
{
	PackedScene MaScene;
	
	public override void _Ready()
	{
		MaScene = ResourceLoader.load("res://Ma/Scene.tscn") as PackedScene;
	}
};
```

Dynamique: (On peu remplir directement dans l'interface de GODOT)
```cs
public partial class Player : CharacterBody3D
{
	[Export]
	PackedScene MaScene {get; set;}
};
```

### b) On ajoute l'instance dans le monde

```cs
public void Affiche()
{
	Node3D objet = MaScene.Instantiate<Node3D>(); //En supposant que l'objet à afficher est un Node3D, on créé une instance qui n'est nulle part pour l'instant
	
	objet.GlobalTransform = new Vector3(0, 0, 0); //On donne une position à l'objet avant de l'afficher
	
	GetTree().Root.AddChild(objet);  //On affiche l'objet, on le met à al racine de la scène en jeu  
}
```

### c) On détruit l'instance

```cs
objet.QueueFree(); //Destroy
```

# 5 - Signaux

Prenons l'exemple d'un timer qui détruirai m'objet après un certain temps:
- ajouter le *Timer* dans la scène
- activer `autostart`
- dans `Noeud` faire *ClicDroit* sur le signal `Timeout()`
- Dans la fenêtre qui vient de s'ouvrir, renommer le signal en `MonTimeOut` et le connecter au noeud à la racine.
- Dans un script attacher au noeud à la racine, ajouter la méthode :
```cs
public void MonTimeOut()
{
	GD.Print("Destruction Bullet");
	QueueFree();
}
```

L'objet disparaîtra après un certain temps après son apparition une fois le jeu lancé.

# 6 - Paramètre de la souris

Pour Éditer le comportement du curseur de la souris :
```cs
DisplayServer.MouseSetMode(DisplayServer.MouseMode.Mode);
```

Plusieurs modes possibles :
- Visible
- Hidden
- Captured
- Confined
- ConfinedHidden
- Max

# 7 - lancer une animation

```css
AnimationPlayer monAnim = getNode("AnimationPlayer") as AnimationPlayer;
monAnim.Play("Walk");
```


