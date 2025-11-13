
On connaît la fonction scanf dans la librairie [[Librairie stdio.h|stdio.h]]. Cependant cette méthode pose un certain nombre de problème dans l'entrée de texte :
- scanf arrête l'entrée de texte à partir du moment où on entre un espace
- risque de **buffer overlapping**!!! C'est à dire décrire dans une mémoire qui n'était pas attribué au préalable et donc d'écrire par dessus une autre variable

[[Librairie stdio.h#fgets (<span style="color 7030a0">char</span> chaine [ ], <span style="color ffc000">int</span> nbCharRead, FILE* pointeurSurFichier)|fgets]] dans la librairie [[Librairie stdio.h|stdio.h]] est une alternative :

```C
#include <stdio.h>
#include <stdlib.h>
 
int main(int argc, char *argv[])
{
    char nom[10];
 
	printf("Quel est votre nom ? ");

	fgets(nom, 10, stdin);   //fonction fgets

	printf("Ah ! Vous vous appelez donc %s !\n\n", nom);
 
    return 0;
}
```

Ici,`fgets (nom, 10, stdin)` se décompose de la manière suivante:
- `nom` est une chaîne caractères
- `10` est le nombre de caractères max à ne pas dépasser
- `stdin` le *"fichiers"*, ou plutôt le *"stream"* dans lequel s'inscrit les entrées du clavier

ATTENTION : il faut penser à vider le buffer `stdin` après chaque utilisation de fgets :

```C
void viderBuffer()
{
    int c = 0;
    while (c != '\n' && c != EOF)
    {
        c = getchar();
    }
}
```

à chaque appel de `getchar()`, un nouveau caractère de stdin va être lu puis initialiser. La fonction s'arrête lorsque le dernier caractère appelé est`"\n"` ou `EOF` 