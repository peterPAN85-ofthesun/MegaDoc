---
type: permanent
created: 2025-11-13 03:30
tags:
  - claude-code
  - outil
  - fichiers
---

# CLAUDE CODE : [Write] - écriture fichiers

L'outil Write de [[CLAUDE CODE - interface CLI|Claude Code]] crée un nouveau fichier ou écrase complètement un fichier existant avec le contenu fourni. Il requiert obligatoirement une lecture préalable du fichier via [[CLAUDE CODE : [Read] - lecture fichiers multimédia|Read]] si celui-ci existe déjà, garantissant que l'écrasement est intentionnel.

La philosophie de Claude Code privilégie l'édition sur la création : Write ne doit être utilisé que pour créer de nouveaux fichiers. Pour modifier un fichier existant, [[CLAUDE CODE : [Edit] - remplacement chaînes|Edit]] est toujours préféré car il préserve le contexte et évite les pertes de données accidentelles. Seuls les chemins absolus sont acceptés.

## Exemples

**Créer un nouveau fichier** :
```python
Write(
    file_path="/path/to/new_file.py",
    content="def hello():\n    print('Hello')"
)
```

**Règles importantes** :
- ✅ Write : Créer nouveaux fichiers uniquement
- ❌ Write : Ne pas utiliser pour modifier l'existant
- ✅ Edit : Toujours privilégier pour modifications

## Liens connexes

- [[CLAUDE CODE : [Read] - lecture fichiers multimédia]] - Lire fichiers
- [[CLAUDE CODE : [Edit] - remplacement chaînes]] - Modifier existant (préféré)
- [[CLAUDE CODE - interface CLI]] - Vue d'ensemble
