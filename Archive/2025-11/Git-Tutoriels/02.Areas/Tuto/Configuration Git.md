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
Sources: https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository
cssclasses:
  - show_properties
---
Créé : `=this.file.ctime`
Dernière modification : `=this.file.mtime`

## Configurer les coordonnées de l'utilsateur

```bash
$ git config --global user.name "John Doe"
$ git config --global user.email johndoe@example.com
```

## Configurer l'éditeur par défault

```bash
$ git config --global core.editor emacs
```

>[!Note]
>Sur Windows, il faut inscrire le chemin complet vers l'éditeur

Ex :

```bash
$ git config --global core.editor "'C:/Program Files/Notepad++/notepad++.exe' -multiInst -notabbar -nosession -noPlugin"
```

## Configurer le nom de la branche par défaut

```bash
$ git config --global init.defaultBranch main
```

## Vérifier la configuration

```bash
$ git config --list
```

>[!Note]
>Pour vérifier un champ spécifique de la configuration : `git config <key>`
>

Ex :

```bash
$ git config user.name
John Doe
```

## Pour enregistrer les ID Github

D'abord :
```bash
git config --global credential.helper store
```

Puis entrer une commande qui demande les login
```bash
git pull
```

