
source : [[https://www.codequoi.com/manipuler-un-fichier-a-laide-de-son-descripteur-en-c/]]

# Files Descriptor par défaut

3 files descripitor initialement ouvert (define dans `unistd.h) :
- `STDIN_FILENO` : Entrée standard
- `STDOUT_FILENO` : Sortie standard
- `STDERR_FILENO` : Erreur standard

# Tables de structure

Il existe trois types structures de données :

**Table de descripteur de fichier :**
>Chaque processus possède sa propre table qui contient une suite d'indexes, chacun faisant référence à une entrée dans le table des fichiers ouverts.

**Table des fichiers ouverts :**
>Commune à tous les processus. Contient entre autres le mode d'accès, la tête de lecture du fichier et un pointeur vers l'entrée correspondante dans la table *inode*. Garde aussi un compte du nombre de références à ce fichier dans toutes les tables de descripteurs de tous les processus.

**Table inode (index node):**
>Commune à tous les processus. Décris les détails du fichier : le chemin où il se trouve sur le disque, sa taille, ses permissions, etc...

![[Pasted image 20261107090950.png]]

# `Open` : ouvrir ou créer un fichier en C

`#include <fnctl.h>`

```C
int open(const char *pathname, int flags);
int open(const char *pathname, int flags, mode_t mode);
```

le paramètre `mode` est optionnel

## Options pour le paramètre `flags`


| Constante symbolique | Description                                                                                                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `O_RDONLY`           | lecture seule                                                                                                                                                                                                       |
| `O_WRONLY`           | Écriture seule                                                                                                                                                                                                      |
| `O_RDWR`             | Lecture et Écriture                                                                                                                                                                                                 |
| `O_TRUNC`            | Ouverture du fichier en mode tronqué. Si le fichier existe et le mode d’accès permet d’y écrire ( `O_WRONLY` ou `O_RDWR`), tronque son contenu à une taille de 0 à l’ouverture, avec l’effet d’écraser son contenu. |
| `O_APPEND`           | Ouverture du fichier en mode ajout. La tête d’écriture est positionnée à la fin du ficher à chaque écriture avec pour effet d’ajouter du texte à la fin du ficher au lieu de l’écraser.                             |
| `O_CREAT`            | Créé le fichier s’il n’existe pas. Il faut alors indiquer ses permissions dans le paramètre _mode_ de `open`.                                                                                                       |

```c
open("chemin/vers/fichier", O_RDONLY);
open("chemin/vers/fichier", O_WRONLY | O_TRUNC); // Pour cumuler les modes d'accès
```

### `0_CREAT` : modes

`0_CREAT` doit obligatoirement être appelé avec un mode qui doit correspondre aux permissions du nouveau fichier créé


| Constante symbolique | Décimal | Description                                                           |
| -------------------- | ------- | --------------------------------------------------------------------- |
| `S_IRWXU`            | 700     | Le user a les permissions de lecture, écriture et exécution           |
| `S_IRUSR`            | 400     | Le user a la permission de lecture                                    |
| `S_IWUSR`            | 200     | Le user a la permission d'écriture                                    |
| `S_IXUSR`            | 100     | Le propriétaire a la permission d'éxecution                           |
| `S_IRWXG`            | 070     | Le groupe a les permissions de lecture, écriture et exécution         |
| `S_IRGRP`            | 040     | Le groupe a la permission de lecture                                  |
| `S_IWGRP`            | 020     | Le groupe a la permission d'écriture                                  |
| `S_IXGRP`            | 010     | Le groupe a la permission d'exécution                                 |
| `S_IRWXO`            | 007     | Le autres users ont les permissions de lecture, écriture et exécution |
| `S_IROTH`            | 004     | Les autres users ont la permission de lecture                         |
| `S_IWOTH`            | 002     | Les autres users ont la permission d'écriture                         |
| `S_IXOTH`            | 001     | Les autres users ont la permission d'exécution                        |

Les décimales correspondent à celles de la commande `chmod`

On peut cumuler les modes de la même manière que les flags
```c
open("chemin/vers/fichier", O_WRONLY | O_APPEND | O_CREAT, S_IRUSR | S_IWUSR | S_IRGRP);
```

On peut aussi, pour raccourcir, mettre les permissions sous forme décimal en préfixant le code par un `0`

```c
open("chemin/vers/fichier", O_WRONLY | O_APPEND | O_CREAT, 0640);
```

# `close` : fermer un file descriptor

`#include <unistd.h>`

```c
int close(int fd);
```

Ferme le fichier, met à jour la table de fichiers ouvert et inode si besoin.
Renvoie :
- `0` si tout est OK
- `-1` si erreur, et met `erno` à jour

>[!Important]
>close ferme le descripteur mais ne le supprime pas. Le supprimer : c'est la prérogative de `unlink`

# `unlink` : supprimer un fichier du disque dur

`#include <unistd.h>`

```c
int unlink(const char *pathname);
```
Renvoie :
- `0` si tout est OK
- `-1` si erreur, et met `erno` à jour

# `write` : écrire vers un file descriptor

`#include <unistd.h>`

```c
ssize_t write(int fd, const void *buf, size_t count);
```

Renvoie :
- le nb d'octets écris si tout est OK
- `-1` si erreur, et met `erno` à jour

# `read` : lire un file descriptor

`#include <unistd.h>`

```c
ssize_t read(int fd, void *buf, size_t count);
```

Renvoie :
- le nb d'octets lus si tout est OK
- `0` si arrivé à la fin du fichier (caractère EOF ou *end of file)
- `-1` si erreur, et met `erno` à jour

À chaque appel, `read` reprend la lecture là où il s'est arrêté prédamment.

>[!Note]
>Concernant la **tête de lecture** (qui est aussi la tête d'écriture) ou `offset` . À chaque fois qu'on utilise `write` ou `read`, on déplace la tête de lecture. On peut ré-ouvrir un le fichier dans un autre *fd* pour replacer la tête de lecture au début. Mais pour arriver au milieu du fichier, on utilisera `lseek`

# `lseek` : repositionner la tête de lecture

`#include <unistd.h>`

```c
off_t lseek(int fd, off_t offset, int whence);
```

Paramètres :
- `fd` : file descriptor id
- `offset` : décalage en octet souhaité pour la tête de lecture
- `whence` par rapport à quel endroit effectuer le décalage. Options possibles :
	- `SEEK_SET` : par rapport au début du fichier
	- `SEEK_CUR`: par rapport à la position actuelle
	- `SEEK_END`: par rapport à la fin du fichie

Renvoie :
- le nb d'octets décalés depuis le début du fichier si tout est OK
- `-1` si erreur, et met `erno` à jour

# `dup` et `dup2` : dupliquer des files descriptor

`#include <unistd.h>`

```c
int dup(int oldfd);
int dup2(int oldfd, int newfd);
```

>[!Note]
>`dup2` va tenter de fermer `newfd` s'il existe avant de le recréer

Dupliquer un fd et le ré-ouvrir une deuxième fois n'est pas la même chose !

![[Pasted image 20261107101807.png]]