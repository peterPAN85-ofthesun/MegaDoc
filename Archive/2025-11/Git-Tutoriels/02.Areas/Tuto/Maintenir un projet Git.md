---
banner: "![[GitLogo.png]]"
Software: Git
Version:
Type: Tuto
Auteur: PeterPan
DateCreation: 2024-12-09
WorkInProgress: true
tags:
Sources: https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository
cssclasses:
  - show_properties
---
Créé : `=this.file.ctime`
Dernière modification : `=this.file.mtime`

## Cycle de vie des fichiers d'un projet Git

![[lifecycle.png]]
Il existe deux types de fichiers dans un projet git :
- Les fichiers `Tracked`, qui sont présent dans la snapshot du projet : donc les fichiers `Unmodified`,`Modified` ou `Staged`
- Les fichiers `Untacked` qui correspond au reste, à savoir les fichiers créer localement sur la machine ou bien les fichiers qui ont été enlevés du projet

Pour connaître le status de chaque fichier dans ce cycle :

```bash
$ git status
```

Pour voir les différences entre la version `Staged` et la version `Modified` :

```bash
$ git diff
```

Pour supprimer un fichier 

```bash
$ git rm PROJECTS.md
```

Pour modifier le nom d'un fichier

```bash
$ git mv file_from file_to
```

Pour ajouter un fichier

```bash
$ git add README
```

Pour créer un commit

```bash
$ git commit -m "Story 182: fix benchmarks for speed"
```

Les branchs 
```bash
git branch MaBranch         #créer une branche
git push -u origin MaBranch #pousser la branche sur le dépot distant
git checkout MaBranch       #passer sur la branch

git checkout -d MaBranch    #supprime la branch partout
git push -d origin MaBranch #supprime la branch sur le dépot distant
```

Merge :
```css
A---B---C-------M   (feature)
         \     /
          D---E
```
```bash
git merge MaBranch
git merge --ff MaBranch
```
Rebase :
```mathematica
A---B---C---D'---E'   (feature)
```
```bash
git rebase MaBranch
```
>[!IMPORTANT]
>Ne jamais rebase une branche déjà partagée/poussée.
>Le Rebase réécrit l'historique, risque accrue de conflict d'historique de commit

`git pull` :
 ```css
A---B---C-------M    (origin)
     \         /
      D---E           (local)
 ```

`git pull --rebase` :
```css
A---B---C---D'---E'    (origin)
```

>[!NOTE]
>`git pull --rabase` fait en vérité :
>-`git fetch origin`
>-`git rebase origin/main`


Reset :
```bash
git reset --soft        #garde les fichiers et index
git reset --mixed       #garde les fichiers mais désindex
git reset --hard        #applique les changements (ne garde ni index ni fichiers)
git reset = git reset --mixed = git restore --staged .
```

Restore :
```bash
git restore .            #restore tout les fichiers en fonction de head
git restore --staged .   #restore uniquement le fichiers indexés mais pas validés 
```

Clean :
```bash
git clean -n       #simule le clean
git clean -fd      #supprime les fichiers non-indéxés
```