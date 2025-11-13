---
type: permanent
created: 2025-11-13 04:00
tags:
  - git
  - commande
  - gestion-fichiers
---

# GIT : [git mv] - renommer fichiers

La commande `git mv` renomme ou déplace un fichier tracké, enregistrant l'opération pour le prochain [[GIT : [git commit] - valider changements|commit]]. Elle est équivalente à renommer manuellement, puis supprimer l'ancien nom avec [[GIT : [git rm] - supprimer fichiers|git rm]] et ajouter le nouveau avec [[GIT : [git add] - ajouter fichiers staging|git add]], mais en une seule commande.

Git détecte automatiquement les renommages même si fait manuellement (via similarité de contenu), mais utiliser git mv est plus propre et explicite. L'historique du fichier est préservé à travers le renommage.

## Exemples

**Renommer un fichier** :
```bash
git mv old_name.txt new_name.txt
```

**Déplacer vers un autre dossier** :
```bash
git mv src/main.c src/core/main.c
```

**Renommer ET déplacer** :
```bash
git mv file.txt docs/new_file.txt
```

**Équivalence manuelle** :
```bash
# Ces trois commandes équivalent à : git mv old.txt new.txt
mv old.txt new.txt
git rm old.txt
git add new.txt
```

**Valider le renommage** :
```bash
git mv README README.md
git commit -m "Rename README to README.md"
```

## Liens connexes

- [[GIT : [git rm] - supprimer fichiers]] - Supprimer au lieu de renommer
- [[GIT : [git add] - ajouter fichiers staging]] - Alternative manuelle
- [[GIT : [git commit] - valider changements]] - Valider renommage
- [[MOC - Git & Versionning]] - Map of Content
