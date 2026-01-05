
source : https://openclassrooms.com/fr/courses/7137751-programmez-en-oriente-objet-avec-c

# 1 - créer une classe

Le fichier header ftype MaFonction ();(.hpp)
```cpp
class Personnage
{
	private:
	
	int m_vie;
	bool m_enVie;
	
	public
	Personnage(); //constructeur
	Personnage(Personnage const& persoACopier); //constructeur de copie
	~Personnage(); //destructeur
	bool SuisJeEnVie() const;
};
```

Le fichier source (.cpp)
```cpp
#include personnage.hpp

Personnage::Personnage() : m_vie(100), m_envie(true) {}
Personnage::Personnage(Personnage const& persoACopier) : m_vie(persoACopier(m_vie), m_enVie(persoACopier.m_enVie) {}
Personnage::~Personnage() {}

Personnage::SuisJeEnVie() const{
	if (m_enVie > 0){
		return true;
	}
}
```

# 2 - Opérateurs


```cpp
bool operator==(Duree const& a, Duree const& b)
{
    //Teste si a.m_heure == b.m_heure etc.  
    if (a.m_heures == b.m_heures && a.m_minutes == b.m_minutes && a.m_secondes == b.m_secondes)
        return true;
    else
        return false;
}
```

Ça marche avec toutes sortes d'opérateurs :
- L'addition : `+`  .
- La soustraction :`-`  .
- La multiplication : `*`  .
- La division :  `/`  .
- Et le modulo :  `%`

>[!NOTE]
>Pour les opérateurs `+=` ou `-=`, il faut les implémenter dans la classe associée, car on changer une valeur à l'intérieur de l'objet
>

```cpp

void Duree::operator+=(const Duree& a)
{
    //1 : ajout des secondes
    m_secondes += a.m_secondes;
    //Si le nombre de secondes dépasse 60, on rajoute des minutes
    //Et on met un nombre de secondes inférieur à 60
    m_minutes += m_secondes / 60;
    m_secondes %= 60;

    //2 : ajout des minutes
    m_minutes += a.m_minutes;
    //Si le nombre de minutes dépasse 60, on rajoute des heures
    //Et on met un nombre de minutes inférieur à 60
    m_heures += m_minutes / 60;
    m_minutes %= 60;

    //3 : ajout des heures
    m_heures += a.m_heures;
}
```

Pour les opérateurs de flux comme `cout` ou `cin`

```cpp
ostream& operator<<( ostream &flux, Duree const& duree )
{
	duree.afficher(flux);
    return flux;Affiche le nombre de roues du véhicule
}

void Duree::afficher(ostream &flux) const
{
    flux << m_heures << "h" << m_minutes << "m" << m_secondes << "s";
}
```

# 3 - Héritage

Fichier header (.hpp)
```cpp
#ifndef DEF_GUERRIER
#define DEF_GUERRIER
 
#include <iostream>
#include <string>
#include "Personnage.hpp"
 
class Guerrier : public Personnage
{
    public:
        void frapperAvecUnMarteau() const;
        //Méthode qui ne concerne que les guerriers
};
 
#endif
```

>[!NOTE]
>La portée `protected` est un autre type de droit d'accès que je classerais entre `public`(le plus permissif) et `private`  (le plus restrictif). Il n'a de sens que pour les classes qui se font hériter (les classes mères), mais on peut l'utiliser sur toutes les classes, même quand il n'y a pas d'héritage.
Les éléments qui suivent `protected` ne sont pas accessibles depuis l'extérieur de la classe, sauf si c'est une classe fille.

Lorsqu'une classe fille a une méthode identique à sa classe parente, il ya masquage : la méthode de la classe fille prend le dessus :
Pour démasquage : (dans cette situation, `Guerrier` hérite de `personnage`)

```cpp
void Guerrier::sePresenter() const
{
   Personnage::sePresenter(); //constructeur de la classe parent
    cout << "Je suis un Guerrier redoutable." << endl;
}
```

# 4 - Polymorphisme

### Exemple de résolution statique des liens
Imaginons 3 classes :
- Véhicule
- Moto (qui hérite de véhicule)
- Voiture (qui hérite de véhicule)

Dans chaque classe on défini une méthode `affiche()` spécifique à chaque véhicule

```cpp
class Vehicule
{
    public:
    void affiche() const;  //Affiche une description du Vehicule

    protected:
    int m_prix;  //Chaque véhicule a un prix
};

class Voiture : public Vehicule //Une Voiture EST UN Vehicule
{
    public:
    void affiche() const;

    private:
    int m_portes;  //Le nombre de portes de la voiture
};

class Moto : public Vehicule  //Une Moto EST UN Vehicule
{
    public:
    void affiche() const;
 
    private:
    double m_vitesse;  //La vitesse maximale de la moto
};
```

Dans le programme qui suit :
```cpp
void presenter(Vehicule v)  //Présente le véhicule passé en argument
{
    v.affiche();
}

int main()
{
    Vehicule v;
    presenter(v);

    Moto m;
    presenter(m);

    return 0;
}
```

On obtiendrait :

```
Ceci est un véhicule
Ceci est un véhicule
```

### Exemple de résolution dynamique des liens

 1 - Dans la classe parent on fait une méthode *virtuelle*

```cpp
class Vehicule
{
    public:
    virtual void affiche() const;  //Affiche une description du Vehicule

    protected:
    int m_prix;  //Chaque véhicule a un prix
};

class Voiture: public Vehicule  //Une Voiture EST UN Vehicule
{
    public:
    virtual void affiche() const;

    private:
    int m_portes;  //Le nombre de portes de la voiture
};

class Moto : public Vehicule  //Une Moto EST UN Vehicule
{
    public:
    virtual void affiche() const;
 
    private:
    double m_vitesse;  //La vitesse maximale de la moto
};
```

2 - Faire une référence à l'appel de la méthode

```cpp
void presenter(Vehicule const& v)  //Présente le véhicule passé en argument
{
    v.affiche();
}

int main()  //Rien n'a changé dans le main()
{
    Vehicule v;
    presenter(v);

    Moto m;
    presenter(m);

    return 0;
}
```

Résultat :
```
Ceci est un véhicule
Ceci est une moto
```

### La cas du destructeur 

Un constructeur ne peut pas être virtuel. Par contre c'est le cas du destructeur. 
ex :
```cpp
int main()
{
    Vehicule *v(0);
    v = new Voiture;
    //On crée une Voiture et on met son adresse dans un pointeur de Vehicule

    v->affiche();  //On affiche "Ceci est une voiture."

    delete v;      //Et on détruit la voiture

    return 0;
}
```

dans ce cas là on a détruit un véhicule et pas une voiture. On aurait très bien pu imaginer que `voiture` avait une règle spéciale à spécifier lors de sa destruction, comme libérer de l'espace mémoire qu'il a lui même assigné à sa construction. Ce destructeur spéciale n'ayant jamais appelé, on risque a terme de saturer la mémoire

# 5 - Classes Abstraites

Une classe abstraite est une classe possédant au moins une méthode *virtuelle pure* 
C'est une classe qui sert de modèle, on ne peut pas faire d'objet directement avec une classe abstraite.

```cpp
class Vehicule
{
    public:
    Vehicule(int prix);           
    virtual void affiche() const;
    virtual int nbrRoues() const = 0;  //méthode virtuelle pure
    virtual ~Vehicule();         

    protected:
    int m_prix;
};
```

# 6 - Méthodes statiques

>[!NOTE]
>Les méthodes statiques sont des méthodes qui appartiennent à la classe, mais pas aux objets instanciés à partir de la classe. En fait, ce sont des "fonctions" rangées dans des classes qui n'ont pas accès aux attributs de la classe.

ex : fichier header (.hpp)
```cpp
class MaClasse
{
    public:
    MaClasse();
    static void maMethode();
};
```

fichier source (.cpp) 
```cpp
void MaClasse::maMethode() //Ne pas remettre 'static' dans l'implémentation
{
    cout << "Bonjour !" << endl;
}
```

Dans la fonction main :
```cpp
int main()
{
    MaClasse::maMethode();
 
    return 0;
}
```

Les fonctions statiques peuvent être utiles pour faire le décompte d'objet instancié à partir de cette classe.
Pour ce faire :
- déclarer un attribut statique dans la classe
- assigner cet attribut dans l'espace global, en dehors de toute fonction (main comprise) dans le fichier .cpp par exemple

ex :
(.hpp)
```cpp
class MaClasse
{
	private :
	static bool m_ok;
	
	public :
	static bool TuEsOk(); 
};
```

(.cpp)
```cpp
bool MaClasse::m_ok = true;

bool MaClasse::TuEsOk()
{
	return m_ok;
}
```

# 7 - Amitié

On peut permettre à une classe A qui n'a aucun lien de parenté avec la classe B d'accéder à ses attributs privé. ATTENTION À NE PAS EN ABUSER.

Pour déclarer une fonction amie d'une classe :

```cpp
bool MaClasse::TuEsOk()
{
	friend type MaFonction ();
}
```

Cas pratique : opérateur `<<`

```cpp
class Duree
{
    public:
 
    Duree(int heures = 0, int minutes = 0, int secondes = 0);

    private:

    void affiche(ostream& out) const;  //Permet d'écrire la durée dans un flux
 
    int m_heures;
    int m_minutes;https://openclassrooms.com/fr/courses/7137751-programmez-en-oriente-objet-avec-c
    int m_secondes;

    friend std::ostream& operator<< (std::ostream& flux, Duree const& duree);
};
```

