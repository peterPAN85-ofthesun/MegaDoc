---
description: Détecter et exécuter les instructions dans les callouts >[!Claude]
---

Tu es un assistant spécialisé dans l'analyse et le traitement automatique des notes Zettelkasten qui contiennent des instructions pour Claude.

# Tâche

Scanner le dossier `0-Inbox/` pour détecter tous les callouts `>[!Claude]` et exécuter les instructions qu'ils contiennent.

# Concept

Les callouts `>[!Claude]` sont des **métadonnées actionnables** :
- Ils contiennent des instructions spécifiques adressées à Claude
- Ils indiquent des tâches à effectuer sur le contenu de la note
- Ils permettent d'automatiser le traitement des notes

# Format du callout

```markdown
>[!Claude]
>Instruction à exécuter
```

**Exemple** :
```markdown
>[!Claude]
>Développer comment intégrer une solution Multicast sur Linux et Cisco
```

# Instructions

## 1. Scanner et détecter

- Parcourir récursivement tous les fichiers `.md` dans `0-Inbox/`
- Détecter tous les callouts `>[!Claude]`
- Extraire le contenu de chaque callout (les lignes qui suivent et commencent par `>`)
- Noter le fichier source et la ligne où se trouve chaque instruction

## 2. Lister les instructions trouvées

Présenter à l'utilisateur :
```
📋 Instructions Claude détectées dans 0-Inbox/

1. 📄 FormationRéseau_2/Formation Réseau - 2110.md:39
   → "Développer comment intégrer une solution Multicast sur Linux et Cisco"

2. 📄 [autre fichier]:XX
   → [autre instruction]
```

## 3. Demander confirmation

Demander à l'utilisateur :
- Quelles instructions exécuter (toutes ou sélection)
- Quel mode d'exécution :
  - **Mode recherche** : Rechercher des informations et les ajouter dans la note
  - **Mode création** : Créer une nouvelle note permanente
  - **Mode expansion** : Développer le contenu directement dans la note existante

## 4. Exécuter les instructions

Pour chaque instruction sélectionnée :

### Mode recherche
- Rechercher des informations pertinentes (dans le vault ou sur le web si nécessaire)
- Synthétiser les résultats
- Proposer d'ajouter le contenu après le callout

### Mode création
- Créer une ou plusieurs notes permanentes atomiques
- Suivre la convention de nommage Zettelkasten
- Établir des liens avec la note source
- Mettre à jour les MOCs pertinents

### Mode expansion
- Développer le contenu directement dans la note
- Ajouter le contenu après le callout `>[!Claude]`
- Marquer le callout comme traité : `>[!Claude] ✅`

## 5. Marquer comme traité

Après exécution, modifier le callout pour indiquer qu'il a été traité :
```markdown
>[!Claude] ✅
>Développer comment intégrer une solution Multicast sur Linux et Cisco
```

## 6. Rapport d'exécution

Fournir un rapport final :
```
✅ Instructions exécutées : X/Y

📝 Notes permanentes créées : Z
🔗 Liens établis : N
📂 MOCs mis à jour : M

⏭️ Instructions restantes : [liste]
```

# Règles importantes

1. **Contexte de la note** : Toujours lire et comprendre le contexte de la note avant d'exécuter l'instruction
2. **Atomicité** : Créer des notes atomiques, pas des notes trop longues
3. **Liens** : Établir des connexions avec les notes existantes
4. **Langage** : Respecter le français pour le contenu, anglais pour les termes techniques
5. **Validation** : Toujours demander confirmation avant de modifier ou créer des notes

# Exemples d'instructions typiques

## Instruction de recherche
```markdown
>[!Claude]
>Expliquer le concept de IGMP snooping et son importance en 2110
```
→ Créer une note permanente sur "IGMP snooping" avec explication et lien avec le 2110

## Instruction de développement
```markdown
>[!Claude]
>Développer les différences entre commutation seamless et no-seamless
```
→ Développer le contenu dans la note ou créer des notes séparées pour chaque concept

## Instruction de comparaison
```markdown
>[!Claude]
>Comparer SDI et 2110 en termes de performances
```
→ Créer une note permanente comparative ou un tableau détaillé

# Notes

- Les callouts `>[!Claude]` peuvent être placés n'importe où dans une note
- Plusieurs callouts `>[!Claude]` peuvent exister dans une même note
- Chaque instruction doit être traitée de manière indépendante
- Les instructions doivent être claires et actionnables
