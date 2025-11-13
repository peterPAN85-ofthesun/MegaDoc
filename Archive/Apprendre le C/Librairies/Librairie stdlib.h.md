CF : [[Les Bases#16 - tableau dynamique]]
# Fonctions


| Fonctions                                                                                                                                                   | Descriptions                                                                                                                                                                                                                                                                    |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| malloc(size_t nombreOctetsNecessaires)                                                                                                                      | demande la permission d'utiliser de la mémoire, une adresse pointant sur du vide (un pointeur universel)                                                                                                                                                                        |
| free (<span style="color:#00b0f0">void</span>* pointeur)                                                                                                    | demande à libérer de la mémoire                                                                                                                                                                                                                                                 |
| strtol (const <span style="color:#7030a0">char</span>[ ] start, <span style="color:#7030a0">char</span> **end, <span style="color:#ffc000">int</span> base) | converti en <span style="color:#00b0f0">long</span> une chaine de caractère `start`, suivant une certaine `base` (base 10, base 2, base 16...). `end` est un pointeur de pointeur où est renvoyé le premier caractère qui n'était pas un nombre/ Mettre `NULL` si pas d'utilité |
| strtod (const <span style="color:#7030a0">char</span>[ ] start, <span style="color:#7030a0">char</span> **end)                                              | converti en <span style="color:#00b0f0">double</span> une chaine de caractère `start`. `end` est un pointeur de pointeur où est renvoyé le premier caractère qui n'était pas un nombre/ Mettre `NULL` si pas d'utilité                                                          |

## malloc (size_t nombreOctetsNecessaires)

Demande la permission d'utiliser de la mémoire, une adresse pointant sur du vide (un pointeur universel). On peut y mettre n'importe quelle valeur/variable du moment ou la taille mémoire coïncide.
```C
int main(int argc, char *argv[])
{
    int* memoireAllouee = NULL; //On crée un pointeur sur int

    memoireAllouee = malloc(sizeof(int)); //La fonction malloc inscrit dans notre pointeur l'adresse qui a été réservée
    if (memoireAllouee == NULL) // Si l'allocation a échoué
    {
        exit(0); // On arrête immédiatement le programme
    }

    // On peut continuer le programme normalement sinon

    return 0;
}
```

## free (void* pointeur)

demande à libérer de la mémoire

## strtol (const <span style="color:#7030a0">char</span>[ ] start, <span style="color:#7030a0">char</span> **end, <span style="color:#ffc000">int</span> base)

Converti en <span style="color:#00b0f0">long</span> une chaine de caractère `start`, suivant une certaine `base` (base 10, base 2, base 16...). `end` est un pointeur de pointeur où est renvoyé le premier caractère qui n'était pas un nombre/ Mettre `NULL` si pas d'utilité.

```C
long i;
 
i = strtol( "148", NULL, 10 ); // i = 148
i = strtol( "148.215", NULL, 10 ); // i = 148
i = strtol( "   148.215", NULL, 10 ); // i = 148
i = strtol( "   148+34", NULL, 10 ); // i = 148
i = strtol( "   148 feuilles mortes", NULL, 10 ); // i = 148
i = strtol( "   Il y a 148 feuilles mortes", NULL, 10 ); // i = 0 (erreur : la chaîne ne commence pas par un nombre)
```

## strtod (const <span style="color:#7030a0">char</span>[ ] start, <span style="color:#7030a0">char</span> **end)

Converti en <span style="color:#00b0f0">double</span> une chaine de caractère `start`. `end` est un pointeur de pointeur où est renvoyé le premier caractère qui n'était pas un nombre/ Mettre `NULL` si pas d'utilité.

```C
long i;
 
i = strtol( "148", NULL, 10 ); // i = 148.0000000
i = strtol( "148.215", NULL, 10 ); // i = 148.215000
i = strtol( "   148.215", NULL, 10 ); // i = 148.215000
i = strtol( "   148+34", NULL, 10 ); // i = 148.000000
i = strtol( "   148 feuilles mortes", NULL, 10 ); // i = 148.000000
i = strtol( "   Il y a 148 feuilles mortes", NULL, 10 ); // i = 0 (erreur : la chaîne ne commence pas par un nombre)
```