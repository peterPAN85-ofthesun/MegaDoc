 
CF : [[Les Bases#11 - Chaîne de caractères]], [[String et caractères]]
# Fonctions

*<span style="font-style:italic; color:#00b0f0">string</span>* = <span style="color:#7030a0">char</span>*

| Fonctions                                                                                          | Descriptions                                                                                                                                                                 |
| -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| strlen(*<span style="color:#00b0f0">string</span>*)                                                | pour calculer la longueur d'une chaîne.                                                                                                                                      |
| strcpy(*<span style="color:#00b0f0">string1</span>*,*<span style="color:#00b0f0">string2</span>*)  | pour copier une chaîne dans une autre.                                                                                                                                       |
| strcat(*<span style="color:#00b0f0">string1</span>*,*<span style="color:#00b0f0">string2</span>*)  | pour concaténer 2 chaînes.                                                                                                                                                   |
| strcmp(*<span style="color:#00b0f0">string1</span>*,*<span style="color:#00b0f0">string2</span>*)  | pour comparer 2 chaînes, renvoie 1 si les deux chaînes sont identiques                                                                                                       |
| strchr(*<span style="color:#00b0f0">string</span>*,*<span style="color:#ffc000">int</span>*)       | pour rechercher un caractère sous la forme *<span style="color:#ffc000">int</span>*, Renvoie *NULL* si rien est trouvé, sinon le pointeur du caractère trouvé                |
| strpbrk(*<span style="color:#00b0f0">string1</span>*,*<span style="color:#00b0f0">string2</span>*) | pour rechercher le premier caractère de *<span style="font-style:italic; color:#00b0f0">string2</span>* dans *<span style="font-style:italic; color:#00b0f0">string1</span>* |
| strstr(*<span style="color:#00b0f0">string1</span>*,*<span style="color:#00b0f0">string2</span>*)  | pour rechercher une chaîne dans une autre.                                                                                                                                   |
| sprintf(*<span style="font-style:italic; color:#00b0f0">string</span>* ,  "MonTexte")              | pour écrire dans une chaîne.                                                                                                                                                 |

## strlen(*<span style="color:#00b0f0">string</span>*)

Pour calculer la longueur d'une chaîne :
```C
size_t strlen(const char* chaine);
//size_t est un type spécial qui renvoie à une taille de chaîne caractère

int strlen(const char* chaine);
//Ça fonctionne aussi avec int
```

## strcpy(*<span style="color:#00b0f0">string1</span>*,*<span style="color:#00b0f0">string2</span>*)

pour copier une chaîne dans une autre.


## strcat(*<span style="color:#00b0f0">string1</span>*,*<span style="color:#00b0f0">string2</span>*)

pour concaténer 2 chaînes.


## strcmp(*<span style="color:#00b0f0">string1</span>*,*<span style="color:#00b0f0">string2</span>*)

pour comparer 2 chaînes, renvoie 1 si les deux chaînes sont identiques


## strchr(*<span style="color:#00b0f0">string</span>*,*<span style="color:#ffc000">int</span>*)

pour rechercher un caractère sous la forme *<span style="color:#ffc000">int</span>*, Renvoie *NULL* si rien est trouvé, sinon le pointeur du caractère trouvé

## strpbrk(*<span style="color:#00b0f0">string1</span>*,*<span style="color:#00b0f0">string2</span>*)

pour rechercher le premier caractère de *<span style="font-style:italic; color:#00b0f0">string2</span>* dans *<span style="font-style:italic; color:#00b0f0">string1</span>


## strstr(*<span style="color:#00b0f0">string1</span>*,*<span style="color:#00b0f0">string2</span>*)

pour rechercher une chaîne dans une autre.

## sprintf(*<span style="font-style:italic; color:#00b0f0">string</span>* ,  "MonTexte")

pour écrire dans une chaîne