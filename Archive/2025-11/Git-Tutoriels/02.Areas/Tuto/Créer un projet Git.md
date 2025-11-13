---
banner: "![[GitLogo.png]]"
Software: Git
Version: 
Type: Tuto
Auteur: PeterPan
DateCreation: 2024-12-09
WorkInProgress: true
tags:
  - Setup
  - Project
Sources: https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup
cssclasses:
  - show_properties
---
Créé : `=this.file.ctime`
Dernière modification : `=this.file.mtime`

## Ouvrir le dossier projet

```bash
$ cd /home/user/my_project
```

## Initialiser la structure du projet git

Création du dossier `.git` :

```bash
$ git init
```

## Pour ajouter des fichiers déjà existants dans le projet

```bash
$ git add *.c
$ git add LICENSE
$ git commit -m 'Initial project version'
```

On configure un dépôt remote :

```bash
git remote add origin https://github.com/user/MonProjetTest
```


## Pour cloner le répertoire git en ligne

```bash
$ git clone https://github.com/libgit2/libgit2
```

>[!Note]
>On peut donner un nom personnalisé au nouveau projet cloné :


```bash
$ git clone https://github.com/libgit2/libgit2 mylibgit
```


