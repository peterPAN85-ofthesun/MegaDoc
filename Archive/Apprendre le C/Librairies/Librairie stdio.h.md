CF : [[Les Bases#2 - Écrire son premier code]], [[Les Bases#15 - Manipuler des fichiers]]
# Fonctions

| Fonction                                                                                                                                                                                                   | Description                                                                                                                     |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| printf (*"MonTexte"*)                                                                                                                                                                                      | affiche *"MonTexte"*                                                                                                            |
| scanf ("<span style="color:#7030a0">%d</span>", <span style="color:#c00000">&</span>MaVariable)                                                                                                            | attend une entrée dans la console pour l'assigner à la référence de MaVariable                                                  |
| fopen(<span style="color:#c00000">const</span> <span style="color:#7030a0">char</span> nomDuFichier[ ], <span style="color:#c00000">const</span> <span style="color:#7030a0">char</span> modeOuverture[ ]) | Pour manipuler un fichier : renvoie un pointeur FILE                                                                            |
| fclose (FILE* pointeurSurFichier)                                                                                                                                                                          | fermer le fichier, renvoie 0 si tout à fonctionner ou EOF sinon                                                                 |
| fputc (<span style="color:#ffc000">int</span> caractere, FILE* pointeurSurFichier)                                                                                                                         | écrit UN caractère dans le fichier                                                                                              |
| fputs (<span style="color:#c00000">const</span> <span style="color:#7030a0">char</span> chaine[ ], FILE* pointeurSurFichier)                                                                               | écrit une chaîne de caractère dans le fichier                                                                                   |
| fprintf (FILE* pointeurSurFichier, <span style="font-style:italic; color:#c00000">const</span> <span style="color:#7030a0">char</span> chaine[ ])                                                          | écrit une chaîne de caractère formatée dans le fichier (pour inclure des variables)                                             |
| fgetc (FILE* pointeurSurFichier)                                                                                                                                                                           | lit un caractère                                                                                                                |
| fgets (<span style="color:#7030a0">char</span> chaine [ ], <span style="color:#ffc000">int</span> nbCharRead, FILE* pointeurSurFichier)                                                                    | lit une chaîne de caractère d'une certaine longueur                                                                             |
| ftell (FILE* pointeurSurFichier)                                                                                                                                                                           | renvoie la position du curseur dans le fichier (de type <span style="font-style:italic; color:#00b0f0">long</span>)             |
| fseek(FILE* pointeurSurFichier, <span style="color:#00b0f0">long</span> deplacement, <span style="color:#ffc000">int</span> origine)                                                                       | déplace le curseur d'un certain nombre de caractères (indiqué par `deplacement`) à partir de la position indiquée par `origine` |
| rewind (FILE* pointeurSurFichier)                                                                                                                                                                          | renvoie le curseur au début du fichier                                                                                          |
| rename (<span style="color:#7030a0">char</span> chaine [ ], FILE* pointeurSurFichier)                                                                                                                      | renomme le fichier                                                                                                              |
| remove (FILE* pointeurSurFichier)                                                                                                                                                                          | supprime le fichier                                                                                                             |

## printf(*"MonTexte"*)

On peut intégrer dans la chaîne de caractère une variable quelqu'en soit son type à l'aide de ces caractères spéciaux :

| "%d"  | int          |
| ----- | ------------ |
| "%u"  | unsigned int |
| "%ld" | long         |
| "%f"  | float        |
| "%f"  | double       |
| "%c"  | char         |
| "%p"  | pointeur     |
| "%s"  | string       |
```C title:Exemple
#include <stdio.h>

int PV = 5;     //On déclare une variable 
float PM = 10.62

printf("il me reste %d points de vie",PV);    //on affiche "Il me reste 5 points de vie"

printf("il me reste %d PV et %f PM",PV,PM);  // => "Il me reste 5 PV et 10.62 PM"
```

## scanf("<span style="color:#7030a0">%d</span>", <span style="color:#c00000">$</span>MaVariable)

Permet de rentrer une valeur et de l'assigner à la référence de *MaVariable*

```C title:Exemple
int age = 0;           //On pense à déclarer la variable
scanf("%d", &age);     //On entre la valeur
```


| "%d"  | int          |
| ----- | ------------ |
| "%u"  | unsigned int |
| "%ld" | long         |
| "%f"  | float        |
| "%lf" | double       |
| "%c"  | char         |
| "%s"  | string       |

## fopen(<span style="color:#c00000">const</span> <span style="color:#7030a0">char</span> nomDuFichier[ ], <span style="color:#c00000">const</span> <span style="color:#7030a0">char</span> modeOuverture[ ])


| Mode de lecture | Description                                                  |
| --------------- | ------------------------------------------------------------ |
| "r"             | lecture seule                                                |
| "w"             | écriture seule                                               |
| "a"             | mode ajout                                                   |
| "a+"            | ajout en lecture / écriture à la fin                         |
| "r+"            | lecture et écriture                                          |
| "w+"            | lecture et écriture avec suppression du contenu au préalable |


Procédure :
- Initialiser un pointeur FILE : `FILE* fichier = NULL;`
- assigner à `fichier` à ce que renvoie la commande `fopen` suivant les paramètres choisi

```C title:Exemple
FILE* fichier = NULL;
fichier = fopen("test.txt", "r+");
```

## fclose (FILE* pointeurSurFichier)

fermer le fichier, renvoie 0 si tout à fonctionner ou EOF sinon

## fputc (<span style="color:#ffc000">int</span> caractere, FILE* pointeurSurFichier)

écrit UN caractère dans le fichier

## fputs (<span style="color:#c00000">const</span> <span style="color:#7030a0">char</span> chaine[ ], FILE* pointeurSurFichier)

écrit une chaîne de caractère dans le fichier


## fprintf (FILE* pointeurSurFichier, <span style="font-style:italic; color:#c00000">const</span> <span style="color:#7030a0">char</span> chaine[ ])

écrit une chaîne de caractère formatée dans le fichier (pour inclure des variables)

## fgetc (FILE* pointeurSurFichier)

Pour lire les caractères les uns à la suite des autres :

```C
int main(int argc, char *argv[])
{
    FILE* fichier = NULL;
    int caractereActuel = 0;
 
    fichier = fopen("test.txt", "r");
 
    if (fichier != NULL)
    {
        // Boucle de lecture des caractères un à un
        do
        {
            caractereActuel = fgetc(fichier); // On lit le caractère
            printf("%c", caractereActuel); // On l'affiche
        } while (caractereActuel != EOF); // On continue tant que fgetc n'a pas retourné EOF (fin de fichier)
 
        fclose(fichier);
    }
 
    return 0;
}
```

## fgets (<span style="color:#7030a0">char</span> chaine [ ], <span style="color:#ffc000">int</span> nbCharRead, FILE* pointeurSurFichier)

Cette fonction va lire un maximum de chaîne de caractère jusqu'à arriver jusqu'à `"\n"` ou alors jusqu'à atteindre un nombre de caractère de *nbCharRead*.

```C
#define TAILLE_MAX 1000 // Tableau de taille 1000
 
int main(int argc, char *argv[])
{
    FILE* fichier = NULL;
    char chaine[TAILLE_MAX] = ""; // Chaîne vide de taille TAILLE_MAX
 
    fichier = fopen("test.txt", "r");
 
    if (fichier != NULL)
    {
       while (fgets(chaine, TAILLE_MAX, fichier) != NULL) // On lit le fichier tant qu'on ne reçoit pas d'erreur (NULL)
        {
            printf("%s", chaine); // On affiche la chaîne qu'on vient de lire
        }
 
        fclose(fichier);
    }
 
    return 0;
}
```


## ftell (FILE* pointeurSurFichier)

renvoie la position du curseur dans le fichier (de type <span style="font-style:italic; color:#00b0f0">long</span>)


## fseek(FILE* pointeurSurFichier, <span style="color:#00b0f0">long</span> deplacement, <span style="color:#ffc000">int</span> origine)

déplace le curseur d'un certain nombre de caractères (indiqué par `deplacement`) à partir de la position indiquée par `origine`

- Le nombre de `deplacement` peut être un nombre positif (pour se déplacer en avant), nul ou négatif (pour se placer en arrière)
- Quant au nombre `origine`, vous pouvez mettre comme valeur l'une des trois constantes (des *define*) listée ci-dessous:
	- SEEK_SET : indique le début du fichier
	- SEEK_CUR : indique la position actuelle du curseur
	- SEEK_END : indique la fin du fichier

```C
//Le code suivant place le curseur deux caractères _après_ le début
fseek(fichier, 2, SEEK_SET);

//Le code suivant place le curseur quatre caractères _avant_ la position courante
fseek(fichier, -4, SEEK_CUR);

//Le code suivant place le curseur à la fin du fichier
fseek(fichier, 0, SEEK_END);
```

>[!WARNING]
>Cette fonction peut se comporter bizarrement sur un fichier en mode *texte*. À préférer sur un fichier ouvert en mode *binaire*


## rewind (FILE* pointeurSurFichier)

renvoie le curseur au début du fichier

## rename (<span style="color:#7030a0">char</span> chaine [ ], FILE* pointeurSurFichier)

renomme le fichier


## remove (FILE* pointeurSurFichier)

supprime le fichier


# Structures

| Structures | Description                                                                                                                                                                                                                                                                              |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FILE       | Structure pour décrire un fichier. À utiliser avec [[Librairie stdio.h#fopen(<span style="color c00000">const</span> <span style="color 7030a0">char</span> nomDuFichier[ ], <span style="color c00000">const</span> <span style="color 7030a0">char</span> modeOuverture[ ])\|fopen()]] |
|            |                                                                                                                                                                                                                                                                                          |
