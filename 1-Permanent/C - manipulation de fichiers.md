---
type: permanent
created: 2025-11-13 00:27
tags:
  - permanent
  - programmation
  - c
  - fichiers
  - fopen
  - fclose
---

# C - manipulation de fichiers

> [!abstract] Concept
> Le C permet de lire et écrire des fichiers via des fonctions de la librairie stdio.h : fopen, fclose, fread, fwrite, fprintf, fscanf.

## Explication

**Workflow** :
1. Ouvrir : `fopen()`
2. Lire/Écrire : `fgetc`, `fputs`, `fprintf`, etc.
3. Fermer : `fclose()`

**Modes d'ouverture** :

| Mode | Description |
|------|-------------|
| `"r"` | Lecture seule |
| `"w"` | Écriture (écrase) |
| `"a"` | Ajout (append) |
| `"r+"` | Lecture + écriture |
| `"w+"` | Lecture + écriture (écrase) |

## Exemples

### Écriture simple

```c
#include <stdio.h>

int main() {
    FILE *fichier = fopen("test.txt", "w");

    if (fichier == NULL) {
        printf("Erreur ouverture\n");
        return 1;
    }

    fprintf(fichier, "Bonjour\n");
    fprintf(fichier, "Monde\n");

    fclose(fichier);
    return 0;
}
```

### Lecture simple

```c
FILE *fichier = fopen("test.txt", "r");
char ligne[100];

if (fichier != NULL) {
    while (fgets(ligne, 100, fichier) != NULL) {
        printf("%s", ligne);
    }
    fclose(fichier);
}
```

### Autres fonctions

```c
fputc('A', fichier);  // Écrire un caractère
int c = fgetc(fichier);  // Lire un caractère
fputs("texte", fichier);  // Écrire une chaîne
fseek(fichier, 0, SEEK_SET);  // Déplacer curseur
```

## Connexions

- [[C - entrées-sorties console (stdio.h)]] - printf/scanf
- [[C - pointeurs (concepts de base)]] - FILE*

## Sources
- Fichier source : `0-Inbox/Apprendre le C/Les Bases/Les Bases.md` (section 15)

---
**Tags thématiques** : #c #fichiers #fopen #fclose #io
