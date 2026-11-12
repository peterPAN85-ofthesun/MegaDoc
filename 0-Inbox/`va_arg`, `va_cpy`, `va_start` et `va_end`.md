

**Le But :**
> Surcharger les paramètres d'une fonction
> ex : `printf(const char *restrict format, ... )`

# Les fondamentaux :

Une **librairie** :
> `#include <stdarg.h>`

Un **type** :
> `va_list parametersInfos`

Quatre **Macros** :
> `va_arg()`
> `va_start()`
> `va_end()`
> `va_cpy()`
# Les Macros

>[!Note]
>On pare de **Macros** et pas de fonctions car ces process fonctionnes sans attendre de type precis, ce qui n'est pas possible avec des fonctions

## `va_start()`

`void va_start(va_list ap, ...);`
> - Initialise une variable de type `va_list`
> - Doit etre utilise avant tout appel de `va_arg()`
> - Appel usuel : `va_start( arguments, lastNamedParameter )`

Exemple :

```C
int maximum( int counter, ... ) {

    va_list arguments;
    va_start( arguments, counter );
}
```

## `va_arg()`

`va_arg(va_list ap, parameterType)`
 > - Extrait la valeur du paramètre suivant a partir du type passer a la place de `parameterType`
 
 >[!Note]
 >A partir du type, `va_arg` va processer la taile de la variable `ap` a laide de `sizeof(parameterType)`
 
 >[!Warning]
 >A l'appel de `va_arg` on passe au parmetre suivant pour le prochain appel de a fonction

## `va_end()`

`va_end(va_list ap)`
> Libere les ressources acquises durant un parcours des parametres d'une fonction a un nombre variable de parametres.

## `va_copy()`

`va_cpy(va_list Dest, va_list Src)`
> - Duplique l'etat d'une variable de type `va_list`
> - Pratique pour parcourir plusieurs fois une liste de parametre

(null) -> str
(nil) -> ptr