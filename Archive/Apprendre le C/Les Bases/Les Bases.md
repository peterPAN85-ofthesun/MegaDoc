 

**Lien utiles**:
- https://openclassrooms.com/fr/courses/19980-apprenez-a-programmer-en-c


# 1 - Présentation du C

Le C est un langage de bas niveau. Il est le grand frère de tout une série d'autres langages comme le C et le C#. Pour être utilisé il a besoin :
- **d'un éditeur de texte** pour écrire le code
- **d'un compilateur** pour transformer le code en fichier binaire exécutable 
- **d'un débogueur** pour "*monitorer*" le programme 

Certains logiciels embarquent ces 3 fonctionnalités en même temps : **IDE** (environnement de développement). Pour la programmation C voici quelques recommandations :
- Code::Blocks (Windows, Mac, Linux)
- Visual Studio (Windows, Linux)
- Kdevelop (Linux)
- Xcode (Mac)



# 2 - Écrire son premier code

```C  title:"Exemple"
#include <stdio.h>
#include <stdlib.h>

int main()
{
    printf("Hello, World!");
    return 0;
}
```

Le code se décompose de la manière suivante :
- `#include <stdio.h>` et `#include <stdlib.h>` renvoie au librairies [[Librairie stdio.h#printf(<span style="color 00b0f0">string</span>)|stdio.h]] et stdlib.h qui contienne quelques variables et fonctions utiles
- `int main()` déclare une fonction qui renverra un <span style="color:#ffc000">int</span>
- `{` qui ouvre le contenu de la fonction (à noter que `}` la referme)
- `printf("Hello, World!")` qui affiche la chaîne de caractère "Hello Wolrd"
- `return 0` qui conclue la fonction et donne le signal que celle-ci s'est déroulé sans aucunes erreurs

>[!INTERESSANT]
>La fonction [[Librairie stdio.h#printf(*"MonTexte"*)|printf]] est incluse dans la librairie [[Librairie stdio.h|stdio.h]]. 

>[!Tip]
>On peut commenter le code avec `//` sur une ligne ou bien avec `/*` et `*/` sur plusieurs lignes
>Exemple :
>
```C title:"Exemple de commentaire"
/*
Je vais commenter ce premier programme
Prenez note !
*/

#include <stdio.h>  //On appel les librairies
#include <stdlib.h>

int main()//On créé une fonction "main"
{
    printf("Hello, World!");// on affiche "Hello World"
    return 0;
}
```

>[!caution]
>Il est important après chaque ligne de code d'ajouter le `;`, sinon le code ne compilera pas du tout !



# 3 - Les Variables


Les variables sont des espaces de mémoire qui contienne une valeur. Pour déclarer une variable :

```C
int MaVariable;
```
Ici `MaVariable` est un *integer* (<span style="color:#ffc000">int</span>), soit un nombre entier, comme 0, 12, 50, 102, etc... 

Mais ça peut être d'autres types de variables :
- char
- int
- long
- float
- double 
- etc...

Vous pouvez choisir cette variable est signée (avec nombre négatif) ou non-signée (que des posItifs) de la manière suivante :

```C
signed int MaVariableSignee;
```

>[!Interessant]
>Un integer est codé sur 8 bits, soit par exemple `0000 0000`=0. **En non-signé**, le bit le plus à gauche (MSB) correspond à 2⁷=128. **En-signé**, ce bit indique si le chiffre est positif (=1) ou négatif (=0). Dans ce cas, l'étendue de la variable passe de **0 à 254** en **non-signé** à **-128 à 127** en **signé**.

>[!WARNING]
Quelques règles sont à respecter dans la déclaration de variable:
> - Les noms des variables respectent la casse, c'est à dire que `BoNJours` n'est pas égale à `boujours`
> - Les espaces et les caractères spéciaux ne sont pas autorisés : "é", "à", "ê",+, -, *, /, %, =, etc ...

Pour convertir une valeur dans un autre type :

```C
int a = 5;
double b = (double)a;  //(type)MaVariable interprète MaVariable suivant le type demandé
```

Pour assigner une valeur à une variable, 2 méthodes :

```C title:"1ère méthode"
int nbPointsDeVie;    //je déclare dans un premier temps ma variable

nbPointsDeVie = 5;    //j'édite ensuite ma variable
```

```C title:"2ème méthode"
int nbPointsDeVie = 5;    //j'affecte ma variable et je la déclare en même temps
```

Pour bloquer la valeur d'une variable pour être certain que rien ne pourra l'affecter :
```C
const int nbPointsDeVie = 5; //on déclare une variable constante
```

Pour des variables globales uniquement visible depuis le fichiers courant :
```C
static int MaVariable;
```

Appelé dans une fonction, cette variable est accessible depuis une autre fonction :

```C
#include <stdio.h>

int test1 ()
{
	static int a = 3;  //on assigne la variable a
	return 0;
}

//Fin de la fonction : a existe toujours !

void test2 ()
{
	printf(a);          //affiche la variable a : elle est accessible depuis une autre fonction
}
```

Pour entrer une valeur durant l’exécution du code, utiliser [[Librairie stdio.h#scanf("<span style="color 7030a0">%d</span>", <span style="color c00000">$</span>MaVariable)|scanf]] de la librairie [[Librairie stdio.h|stdio.h]]:
```C
int a;
scanf("%d",&a);
```

>[!NOTE]
>`&a` renvoie au pointeur qui cible a. CF : [[Les Bases#9 - Les pointeurs]]

>[!WARNING]
>[[Librairie stdio.h#scanf("<span style="color 7030a0">%d</span>", <span style="color c00000">$</span>MaVariable)|scanf]] présente un certains nombre de désavantages. Se référer à [[Entrée texte lors de l'exécution d'un programme]] pour plus de détail

Pour changer le type d'une variable :
```C
int i ;
float f=10.546 ;

i=(int)f ; /* converti le réel f en entier */
```
# 4 - Les Calculs

Quelques exemples :

```C
int resultat;

resultat = 5 + 3;   //addition

resultat = 5 - 3;   //soustraction

resultat = 5 * 3;   //multiplication

resultat = 5 % 3;   //modulo

resultat--;         //décrémente

resultat++;         //incrémente

double resultat;

resultat = 5 / 3;   //division

```

# 5 - Les conditions

2 méthodes

## If et Else

```C
int a = 5;

if (a==3)                          //si a est égal à a
{
printf("a est égal à 3");
}
else if (a>6)                      //sinon si a est suppérieur à 6
{
printf("a est égal à 6");
}
else                               //sinon
{
printf("a est peut-être égal à 5");
}
```

## Switch

```C
switch (age)
{
case 2:
  printf("Salut bebe !");
  break;
case 6:
  printf("Salut gamin !");
  break;
case 12:
  printf("Salut jeune !");
  break;
case 16:
  printf("Salut ado !");
  break;
case 18:
  printf("Salut adulte !");
  break;
case 68:
  printf("Salut papy !");
  break;
default:
  printf("Je n'ai aucune reponse pour ton age");
  break;
}
```

cf : les [[Fonctions Logique]]

# 6 - Les Boucles

3 méthodes

## While

```C
while (/* Condition */)
{
    // Instructions à répéter
}
```

## Do... While

```C
do
{
	//Instructions à répéter
}
while (/* Condition */);   // ne pas oublier les ";"
```

## For

```C
int index;
/*
for (initialisation, condition, pas)
Ici, la boucle affiche les chiffres de 0 à 9
*/

for (index = 0 ; compteur < 10 ; compteur++)
{
    printf("%d",index);
}
```

Dans la boule *for* :
- `break` permet d'arrêter l'exécution d'une boucle
- `continue` permet de passer directement à l'itération suivante

```C title:Exemple

// affiche 1 - 3 - 4 - 6 - 7 - 8 - 9 et pas le 5!

for (index = 0 ; compteur < 10 ; compteur++)
{
    if (index==5)
	{
		continue
	}
	printf("%d",index);
}

// affiche 1 - 3 - 4 - 5 et pas le reste!

for (index = 0 ; compteur < 10 ; compteur++)
{
    if (index==5)
	{
		break
	}
	printf("%d",index);
}

```

# 7 - Fonctions

```C
type nomFonction(parametres)
{
    // Insérez vos instructions ici
}

//Exemple d'une fonction retournant un int
int MaMultiplication(int a, int b) 
{
	return a*b;
}

//Exemple d'une fonction ne retournant aucune valeure
void bonjour()
{
    printf("Bonjour");
}

//appeler une fonction
int resultat = MaMultiplication(5,3);
bonjour();
```

Pour appeler une fonction dans la fonction main, **pensez à faire un prototype** :

```C
#include <stdio.h>
#include <stdlib.h>

// La ligne suivante est le prototype de la fonction aireRectangle :
double aireRectangle(double largeur, double hauteur);

int main(int argc, char *argv[])
{   
    printf("Rectangle de largeur 5 et hauteur 10. Aire = %f\n", aireRectangle(5, 10));
    printf("Rectangle de largeur 2.5 et hauteur 3.5. Aire = %f\n", aireRectangle(2.5, 3.5));
    printf("Rectangle de largeur 4.2 et hauteur 9.7. Aire = %f\n", aireRectangle(4.2, 9.7));
   
    return 0;
}

// Notre fonction aireRectangle peut maintenant être mise n'importe où dans le code source :
double aireRectangle(double largeur, double hauteur)
{
    return largeur * hauteur;
}
```

Pour créer une fonction inaccessible depuis un autre fichier :

```C
static in MaFonction()
{
/*
Cette fonction est inaccessible depuis un autre fichier
*/
}
```
# 8 - Gestion des headers

Les headers (*".h"*) sont des fichiers dans le même répupprimée à la fin de la fonction. La prochaine fois qu'on appellera la fonction, la variable aura conservé sa valeur.ertoire que les fichier *".c"*. Ils permettent d'importé les fonctions contenues dans un autre fichier c à l'aide d'un simple `#include`.

Exemple : *MathsPourLesNuls.h*, *MathsPourLesNuls.c* et *main.c* se situent dans le même dossier

```C title:MathsPourLesNuls.c
/*

Nouveau fichier .c

*/

#include <stdio.h>
#include <stdlib.h>
#include "MathsPourLesNuls.h"   //on inclue le headers

int addition (int a, int b)
{
    return a+b;
}
```

```C title:MathsPourLesNuls.h
/*

Header du fichier MathsPourLesNuls.c

*/

//prototype de la fonction addition
int addition (int a, int b);
```

```C title:main.c
#include <stdio.h>
#include <stdlib.h>
#include "MathsPourLesNuls.h" //On inclue le header ici aussi

int main()
{
    printf("le résultat de l'addition 1 + 2 est %d",addition(1,2));
    return 0;
}
```

>[!WARNING]
Si vous compile à la main pensez à ajouter le nouveau *".c"*  dans la liste de fichier à compiler

Exemple avec CMake :

```C title:CMakeFile.txt
cmake_minimum_required(VERSION 3.0)

project(testapplication LANGUAGES C)


add_executable(testapplication main.c Fichier.c)

install(TARGETS testapplication RUNTIME DESTINATION bin)

```

# 9 - Les pointeurs

Chaque variable est contenue dans une mémoire ciblée par un pointeur.

```C title:"Manipulation des pointeurs de variable"
int MaVariable;

int *MonPointeur = &MaVariable, *Pointeur2, *Pointeur3; //On peut innitialiser plusieurs pointeur avec cette méthode
int* MonPointeur = &MaVariable; //les deux alternatives sont justes

//int *MonPointeur => enregistre MonPointeur dans une une variable
//&MaVariable => renvoie l'adresse de la variable

return *MonPointeur;  //retourne la valeur ciblée par le pointeur 

//PENSEZ À INNITIALISER LES POINTEURS!!!!
int *MonDeuxiemePointeur = NULL; 
```

>[!WARNING]
>- Pensez à toujours initialiser  les pointeurs non-assigné pour détecter plus facilement les erreurs à la compilation
>- Le *"type"* du pointeur est le même que celui de la variable pointée. Par exemple si ont tient compte de ma variable `char MaVariable;`, sont pointeur devra être assigné de la manière suivante : `char *MonPointeur = &MaVariable;`

On peut aussi pointer vers une fonction :

```C
void Ecrire_fonction(void) 
{
  printf("Bonjour") ;
  return ;
}

void Traitement(void)
{

  /* ... */
  
  Ecrire = Ecrire_fonction; 
  /* ou */
  Ecrire = (void (*)(void))Ecrire_fonction; 
  /* caste Ecrire_fonction en un pointeur sur une fonction ne prenant pas de paramètres et ne retournant rien */
  
  /* ... */  
}
```

# 10 - Les Tableaux

Les tableaux sont des conteneur qui regroupent des **valeurs de même type**

```C title:"Exemple allocution statique"
int tableau[4];   //on défini un tableau à 4 cases

//on édite les cases
tableau[0] = 10;
tableau[1] = 23;
tableau[2] = 505;
tableau[3] = 8;

return tableau;  //retourne le POINTEUR du tableau
return *tableau; //la même chose

return tableau[0]; //retourne la première valeur du tableau
return *(tableau);  //la même chose

return tableau[1]; //retourne la deuxième valeur du tableau
return *(tableau + 1);  //la même chose

return tableau[2]; //retourne la troisième valeur du tableau
return *(tableau + 2);  //la même chose

int tableau[4] = {10, 23}; // Valeurs insérées : 10, 23, 0, 0
int tableau[4] = {0}; // Toutes les cases du tableau seront initialisées à 0
int tableau[] = {12, 19, 18, 2}; // Le compilateur dimmensionne automatiquement le tableau avec les valeurs données entre "{}"
```

>[!IMPORTANT]
> -On peu considérer `tableau` comme un pointeur qui cible un ensemble de variable. Ainsi, quand on veut mettre un tableau en paramètre on le fait sous la notation `type *tableau`
>-La deuxième méthode pour mettre un tableau comme paramètre d'une fonction es de l'écrire sous la forme `type tableau[]`

```C title:"Un tableau comme paramètre d'une fonction"
#include <stdio.h>

// Prototype de la fonction d'affichage
void affiche_methode_1(int *tableau, int tailleTableau);
void affiche_methode_2(int *tableau, int tailleTableau);
 
int main(int argc, char *argv[])
{
    int tableau[4] = {10, 15, 3};
 
    // On affiche le contenu du tableau
    affiche_methode_1(tableau, 4);
	affiche_methode_2(tableau, 4);
 
    return 0;
}
 
void affiche_methode_1(int *tableau, int tailleTableau)   //le paramètre "tableau" de la fonction est un pointeur renvoyant une variable de type int
{
    int i;
 
    for (i = 0 ; i < tailleTableau ; i++)
    {
        printf("%d\n", tableau[i]);
    }
}


void affiche_methode_2(int tableau[], int tailleTableau)   //le paramètre "tableau" peut aussi s'écrire de cette manière
    int i;
 
    for (i = 0 ; i < tailleTableau ; i++)
    {
        printf("%d\n", tableau[i]);
    }
}
```


# 11 - Chaîne de caractères

Une chaîne de caractère est un **tableau de caractère**, c'est à dire de type `char[]` ou `char*` où la dernière valeur du tableau est `'\0'` . Cette valeur est **indispensable** pour savoir quand est-ce que le chaîne de caractère se termine et donc calculer facilement la longueur du tableau.
Dans [[Librairie stdio.h#printf(*"MonTexte"*)|printf]], pour afficher une variable de type *string*, utiliser **"%s"**

```C title:Exemple
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[])
{
    char chaine[6]; // Tableau de 6 char pour stocker S-a-l-u-t + le \0

    // Initialisation de la chaîne (on écrit les caractères un à un en mémoire)
    chaine[0] = 'S';
    chaine[1] = 'a';
    chaine[2] = 'l';
    chaine[3] = 'u';
    chaine[4] = 't';
    chaine[5] = '\0';

char chaine_2[]="Salut";   //La taille du tableau chaîne est automatiquement calculée, possible qu'à l'innitialisation

// Affichage de la chaîne grâce au %s du printf
printf("%s", chaine);

return 0;
}
```

>[!NOTE]
>La libraire [[Librairie string.h|string.h]] contient un certain nombre de fonctions spécifiques aux string
>Pour d'autres précisions sur les chaines de caractères, cf : [[String et caractères]]


# 12 - Directive du Préprocesseur 

Avant la compilation, le **préprocesseur** exécute toutes les opération indiquées par le `#` comme `#include` qui importe une librairie dans le programme. En voici quelques autres :

## Les Macros 

Permet de remplacer une instance par une valeur ou une fonction : c'est une **Macro**

```C title:Exemple
//On peut define des valeurs

#define LARGEUR_FENETRE  800
#define HAUTEUR_FENETRE  600
#define NOMBRE_PIXELS    (LARGEUR_FENETRE * HAUTEUR_FENETRE)

#define CONSTANT

// Lorsque vous ferez appel à LARGEUR_FENETRE, la macro sera remplacé par 800 par exemple




#define COUCOU() printf("Coucou");
//On peut define des fonctions. Dans cet exemple, on à même inclus le ";" : plus besoin de le réécrire à l'appel de COUCOU()





#define RACONTER_SA_VIE()   printf("Coucou, je m'appelle Brice\n"); \
                            printf("J'habite a Nice\n"); \
                            printf("J'aime la glisse\n");
//On place un "\" pour avoir un define sur plusieurs lignes 





#define MAJEUR(age) if (age >= 18) \
                    printf("Vous etes majeur\n");
//Une macro qui prend des paramètres
```

Quelques macros préexistantes :
- `__LINE__` donne le numéro de la ligne actuelle.
- `__FILE__` donne le nom du fichier actuel.
- `__DATE__` donne la date de la compilation.
- `__TIME__` donne l'heure de la compilation.

Elles peuvent être utiles pour localiser les erreurs :
```C
printf("Erreur a la ligne %d du fichier %s\n", __LINE__, __FILE__);
printf("Ce fichier a ete compile le %s a %s\n", __DATE__, __TIME__);
```
## Conditions préprocesseur

Pour faire des compilations conditionnelles:
```C
#if condition
    /* Code source à compiler si la condition est vraie */
#elif condition2
    /* Sinon si la condition 2 est vraie compiler ce code source */
#endif
```

À l'aide de `#ifdef` et `ifndef`, on peut tester si la macro est définie :
- `ifdef` si la macro est définie
- `ifndef` si la macro n'est pas définie

```C
#define WINDOWS

#ifdef WINDOWS
    /* Code source pour Windows */
#endif

#ifdef LINUX
    /* Code source pour Linux */
#endif

#ifdef MAC
    /* Code source pour Mac */
#endif

//Dans ce cas, seules les instructions sous la condition WINDOWS s'exécuterons, car seule la macro WINDOWS existe
```

**Pour éviter les inclusions infinies !**

```C
#ifndef DEF_NOMDUFICHIER // Si la constante n'a pas été définie le fichier n'a jamais été inclus
#define DEF_NOMDUFICHIER // On définit la constante pour que la prochaine fois le fichier ne soit plus inclus

/* Contenu de votre fichier .h (autres include, prototypes, define...) */

#endif
```

# 13 - Définir une structure

Les structures sont des *"tableaux"* où l'on peut mélanger les types de variables :

```C title:main.h
struct Coordonnees
{
    int x; // Abscisses
    int y; // Ordonnées
};

struct Personne
{
    char nom[100]; // On peut même mettre des tableaux
    char prenom[100];
    char adresse[1000];
    
    int age;
    int etudiant; // Booléen : 1 = etudiant, 0 = non etudiant
};
```
>[!NOTE]
Les structures sont à définir dans un **header**

Pour rappeler et éditer une structure dans une fonction :

```C title:main.c
#include <stdio.h>
#include "main.h" // Inclusion du .h qui contient les prototypes et structures

int main(int argc, char *argv[])
{
    struct Coordonnees point; // Création d'une variable "point" de type Coordonnees

	point.x = 10;     //Pour éditer des éléments de la structure
    point.y = 20;

	struct Coordonees point_2 = {0,0}   //une autre méthode pour éditer à l'innitialisation seulement

	printf("%d",point.x);   //pour rappeler une composante de la structure
	printf("%d",point.y);

    return 0;
}
```

Ici, il faut rappeler **obligatoirement** le fait que *"Coordonnees"* est une structure. Pour se défaire de cette syntaxe lourde, on rajoute avant la déclaration de la structure dans `main.h`:
`typedef struct MaStructure MonAliasDeStructure`

```C title:main.h
typedef struct Coordonnees Coordonnees;
struct Coordonnees
{
    int x;
    int y;
};
```

Lorsqu'on rappellera la structure dans une fonction :

```C title:main.c
int main(int argc, char *argv[])
{
    Coordonnees point; // L'ordinateur comprend qu'il s'agit de "struct Coordonnees" grâce au typedef
    return 0;
}
```

Petite particularité lorsqu'on veut accéder à une composante d'une structure à partir de son pointeur :
- `(*MonPointeurDeStructure).MaComposante`
- `MonPointeurDeStructure->MaComposante`

Exemple :
```C
void initialiserCoordonnees(Coordonnees* point)
{
    (*point).x = 0;
    (*point).y = 0;
}

//ou encore

void initialiserCoordonnees(Coordonnees* point)
{
    point->x = 0;
    point->y = 0;
}
```

Les structures sont la base de la [[Programmation orientée objet]]
# 14 - Les Énumérations

Les énumérations sont des variables avec des *"Banques de valeurs"* ou des *"Banques d'état"*

```C
typedef enum Volume Volume;   //Comme pour les structures, on peut allèger la syntaxe avec "typedef"
enum Volume
{
    FAIBLE, MOYEN, FORT   //L'énumération de tous les états possible
};

int main()
{
	Volume musique = MOYEN;   //On innitialise une énumération suivant l'état "MOYEN"
	if (musqie == MOYEN)
	{
		// Jouer la musique au volume MOYEN
	}
	return 0;
}
```


Par défaut les état prennent pour valeur 0, 1, 2, 3, ... dans l'ordre où on les défini. Dans notre exemple, par défaut :
- FAIBLE = 0
- MOYEN = 1
- FORT = 2

Pour assigner d'autres valeurs :
```C
typedef enum Volume Volume;
enum Volume
{
    FAIBLE = 10, MOYEN = 50, FORT = 100, SUPERFORT //ajouté en dernier sans assignation de valeur, SUPERFORT = FORT+1 = 101
};
```

# 15 - Manipuler des fichiers

Ces fonctions se trouvent dans la librairie [[Librairie stdio.h|stdio.h]] :
- [[Librairie stdio.h#fopen(<span style="color c00000">const</span> <span style="color 7030a0">char</span> nomDuFichier[ ], <span style="color c00000">const</span> <span style="color 7030a0">char</span> modeOuverture[ ])|fopen]]
- [[Librairie stdio.h#fclose (FILE* pointeurSurFichier)|fclose]]
- [[Librairie stdio.h#fputc (<span style="color ffc000">int</span> caractere, FILE* pointeurSurFichier)|fputc]]
- [[Librairie stdio.h#fputs (<span style="color c00000">const</span> <span style="color 7030a0">char</span> chaine[ ], FILE* pointeurSurFichier)|fputs]]
- [[Librairie stdio.h#fprintf (FILE* pointeurSurFichier, <span style="font-style italic; color c00000">const</span> <span style="color 7030a0">char</span> chaine[ ])|fprintf]]
- [[Librairie stdio.h#fgetc (FILE* pointeurSurFichier)|fgetc]]
- [[Librairie stdio.h#fgets (<span style="color 7030a0">char</span> chaine [ ], <span style="color ffc000">int</span> nbCharRead, FILE* pointeurSurFichier)|fgets]]
- [[Librairie stdio.h#ftell (FILE* pointeurSurFichier)|ftell]]
- [[Librairie stdio.h#fseek(FILE* pointeurSurFichier, <span style="color 00b0f0">long</span> deplacement, <span style="color ffc000">int</span> origine)|fseek]]
- [[Librairie stdio.h#rewind (FILE* pointeurSurFichier)|rewind]]
- [[Librairie stdio.h#rename (<span style="color 7030a0">char</span> chaine [ ], FILE* pointeurSurFichier)|rename]]
- [[Librairie stdio.h#remove (FILE* pointeurSurFichier)|remove]]

```C title:"Pour travailler avec des fichiers"
#include <stdio.h>  On intègre les fonctions de stdio.h

//on innitialise "file" qui pointera sur le futur fichier
FILE* file = NULL;

//On ouvre le fichier avec fopen()
file = fopen("MonCheminDeFichier","Mode");

/*

Les instructions spécifiques aux fichiers suivant les cas

*/

//on ferme le fichier et on libère la mémoire
fclose(file);
```

# 16 - Tableau dynamique

Enregistrer une variable dans un tableau demande à connaître sa taille en mémoire. Pour cela on utilise `sizeof(Type)` pour connaître la taille du type de variable. 

Dans la [[Librairie stdlib.h]], on retrouve un certain nombre de fonctions utiles pour la gestion manuelle des mémoires telles que :
- [[Librairie stdlib.h#malloc (size_t nombreOctetsNecessaires)|malloc]]
- [[Librairie stdlib.h#free (void* pointeur)|free]]

Pour créer un tableau dynamique, il nous faut réserver autant d'espace nécessaire * la taille de chaque variable :

```C
#include <stdlib.h>
#include <sdtio.h>

int* amis = NULL;
intnombreDAmis = 10;
amis = malloc(nombreDAmis * sizeof(int));

//amis fonctionne maintenant comme un tableau
amis[2]=3;
printf("%d",amis[2])
```

