# Zettelkasten Claude Assistant - Plugin Obsidian

Plugin Obsidian qui intègre les workflows Zettelkasten avec Claude Code directement dans l'interface Obsidian.

## 🎯 Fonctionnalités

Ce plugin ajoute 7 commandes accessibles via `Ctrl-P` (palette de commandes) :

| Commande | Raccourci | Description |
|----------|-----------|-------------|
| **Créer une note permanente** | Ctrl-P → "Créer" | Créer une note atomique avec Claude |
| **Atomiser une note** | Ctrl-P → "Atomiser" | Extraire concepts d'un fichier en plusieurs notes |
| **Trouver des liens** | Ctrl-P → "Trouver" | Enrichir les connexions de la note active |
| **Traiter l'Inbox** | Ctrl-P → "Traiter" | Analyser et traiter 0-Inbox/ |
| **Mettre à jour un MOC** | Ctrl-P → "MOC" | Créer/mettre à jour un Map of Content |
| **Auditer une note** | Ctrl-P → "Auditer" | Vérifier la qualité de la note active |
| **Ouvrir le guide** | Ctrl-P → "Workflow" | Ouvrir WORKFLOW-QUICKSTART.md |

## 📦 Installation

### Le plugin est déjà installé !

Le plugin est déjà présent dans votre vault à l'emplacement :
```
.obsidian/plugins/zettelkasten-claude-assistant/
```

### Activer le plugin

1. Ouvrir Obsidian
2. Aller dans **Paramètres** (⚙️)
3. Aller dans **Plugins communautaires**
4. Désactiver **Mode restreint** si nécessaire
5. Cliquer sur **Actualiser la liste**
6. Chercher **Zettelkasten Claude Assistant**
7. **Activer** le plugin

## 🚀 Utilisation

### Méthode 1 : Via la palette de commandes (Ctrl-P)

1. Appuyez sur `Ctrl-P` (ou `Cmd-P` sur Mac)
2. Tapez le nom de la commande (ex: "Créer une note")
3. Appuyez sur `Entrée`
4. Remplissez le formulaire dans la modal
5. Le plugin génère un prompt formaté et le copie dans votre presse-papiers
6. Collez le prompt dans Claude Code pour exécuter la commande

### Méthode 2 : Assigner des raccourcis clavier

Vous pouvez assigner des raccourcis clavier personnalisés :

1. **Paramètres** → **Raccourcis clavier**
2. Chercher "Zettelkasten Claude Assistant"
3. Cliquer sur l'icône "+" à côté de chaque commande
4. Assigner votre raccourci (ex: `Ctrl-Alt-N` pour "Créer une note")

### Exemples de raccourcis suggérés

| Commande | Raccourci suggéré |
|----------|-------------------|
| Créer une note permanente | `Ctrl-Alt-N` |
| Atomiser une note | `Ctrl-Alt-A` |
| Trouver des liens | `Ctrl-Alt-L` |
| Traiter l'Inbox | `Ctrl-Alt-I` |
| Mettre à jour un MOC | `Ctrl-Alt-M` |
| Auditer une note | `Ctrl-Alt-Q` |

## 🔄 Workflow typique

### Scénario 1 : Créer une note après lecture

1. Vous lisez un article et prenez des notes brutes
2. `Ctrl-P` → "Créer une note permanente"
3. Entrez le concept (ex: "NAT - Network Address Translation")
4. Collez vos notes brutes dans le champ contexte
5. Cliquez sur "Créer avec Claude"
6. Le prompt est copié → Collez-le dans Claude Code
7. Claude crée la note dans `1-Permanent/`

### Scénario 2 : Traiter vos notes de formation

1. Vous avez des notes brutes dans `0-Inbox/`
2. `Ctrl-P` → "Atomiser une note"
3. Sélectionnez le fichier à atomiser
4. Cliquez sur "Atomiser avec Claude"
5. Claude extrait tous les concepts et crée les notes permanentes

### Scénario 3 : Enrichir une note existante

1. Ouvrez une note dans `1-Permanent/`
2. `Ctrl-P` → "Trouver des liens pour la note active"
3. Cliquez sur "Trouver avec Claude"
4. Claude analyse votre vault et suggère des connexions

### Scénario 4 : Vider l'Inbox hebdomadairement

1. Vendredi soir : `Ctrl-P` → "Traiter l'Inbox"
2. Claude liste tous les fichiers dans `0-Inbox/`
3. Il propose un plan de traitement
4. Vous traitez fichier par fichier avec `/atomize`

## 🔧 Configuration

### Mode de fonctionnement

Le plugin fonctionne en deux modes :

#### Mode 1 : Presse-papiers (actuel)
- Le plugin génère un prompt formaté
- Le copie dans le presse-papiers
- Vous le collez manuellement dans Claude Code

#### Mode 2 : CLI directe (futur)
- Nécessite une configuration de Claude CLI
- Le plugin exécute directement les commandes
- Résultats intégrés dans Obsidian

### Prérequis pour Mode CLI (optionnel)

Pour utiliser le mode CLI direct (à venir) :

1. Installer Claude CLI
2. Configurer l'accès à l'API
3. Définir le chemin dans les paramètres du plugin

## 📝 Détails des commandes

### 1. Créer une note permanente

**Entrées** :
- Concept à créer (obligatoire)
- Contenu/contexte (optionnel)

**Sortie** :
- Prompt formaté pour `/create-note`
- Claude crée la note dans `1-Permanent/`

**Exemple** :
```
Concept : TCP Three-Way Handshake
Contexte : Processus SYN, SYN-ACK, ACK pour établir connexion
→ Claude crée : 1-Permanent/TCP Three-Way Handshake.md
```

### 2. Atomiser une note

**Entrées** :
- Fichier source dans `0-Inbox/`

**Sortie** :
- Prompt formaté pour `/atomize`
- Claude identifie tous les concepts
- Crée une note permanente par concept

**Exemple** :
```
Fichier : 0-Inbox/FormationRéseau/J1.md
→ Claude extrait : NAT, VLAN, Routage, DHCP
→ Crée 4 notes permanentes distinctes
```

### 3. Trouver des liens

**Entrées** :
- Note active (automatique)

**Sortie** :
- Prompt formaté pour `/find-links`
- Claude analyse le vault
- Suggère 3-7 liens pertinents

**Exemple** :
```
Note : NAT - Network Address Translation
→ Claude suggère liens vers :
  - Adressage IP privé RFC 1918
  - PAT - Port Address Translation
  - Port forwarding
```

### 4. Traiter l'Inbox

**Entrées** :
- Aucune (scanne automatiquement `0-Inbox/`)

**Sortie** :
- Prompt formaté pour `/process-inbox`
- Claude liste tous les fichiers
- Propose un plan de traitement

**Exemple** :
```
Inbox : 3 fichiers
→ Claude propose :
  1. Atomiser FormationRéseau/J1.md (5 concepts)
  2. Archiver day-planner.md (obsolète)
  3. Créer note de Certif-Linux.md (1 concept)
```

### 5. Mettre à jour un MOC

**Entrées** :
- MOC existant (sélection)
- OU nouveau MOC (nom à entrer)

**Sortie** :
- Prompt formaté pour `/update-moc`
- Claude recherche toutes les notes liées
- Organise par sous-catégories
- Met à jour le fichier MOC

**Exemple** :
```
MOC : MOC - Réseau
→ Claude trouve 47 notes
→ Organise en 5 catégories
→ Met à jour 2-Maps/MOC - Réseau.md
```

### 6. Auditer une note

**Entrées** :
- Note active (automatique)

**Sortie** :
- Prompt formaté pour `/audit`
- Claude évalue selon 5 critères :
  - Atomicité (30%)
  - Clarté (25%)
  - Connexions (25%)
  - Autonomie (10%)
  - Concision (10%)
- Score /100 + recommandations

**Exemple** :
```
Note : Subnetting
→ Score : 72/100
→ Problèmes : Seulement 1 lien, manque exemples
→ Recommandations : Ajouter 3 liens, ajouter exemple calcul
```

## 🐛 Dépannage

### Le plugin n'apparaît pas dans la liste

1. Vérifier que les fichiers sont bien dans `.obsidian/plugins/zettelkasten-claude-assistant/`
2. Redémarrer Obsidian (Ctrl-R ou Cmd-R)
3. Vérifier que le mode restreint est désactivé

### Les commandes ne s'affichent pas dans Ctrl-P

1. Vérifier que le plugin est bien activé (⚙️ → Plugins communautaires)
2. Actualiser la palette : Fermer et rouvrir Obsidian

### Le prompt n'est pas copié dans le presse-papiers

1. Vérifier les permissions du navigateur/Obsidian
2. Copier manuellement le prompt affiché dans la modal

### Claude ne trouve pas les fichiers

1. Vérifier que vous êtes dans le bon répertoire dans Claude Code
2. Vérifier que les chemins de fichiers sont corrects

## 🔮 Fonctionnalités futures

### Version 1.1
- [ ] Affichage des résultats Claude directement dans Obsidian
- [ ] Historique des commandes exécutées
- [ ] Templates personnalisables

### Version 1.2
- [ ] Intégration CLI directe (sans presse-papiers)
- [ ] Exécution en arrière-plan
- [ ] Notifications de progression

### Version 2.0
- [ ] Interface de chat avec Claude intégrée
- [ ] Aperçu des notes avant création
- [ ] Suggestions automatiques de liens en temps réel

## 🤝 Contribution

Ce plugin fait partie du système Zettelkasten avec Claude Code.

**Fichiers du projet** :
- `manifest.json` - Métadonnées du plugin
- `main.js` - Code principal
- `styles.css` - Styles CSS
- `README.md` - Ce fichier

## 📚 Ressources

- [WORKFLOW.md](../../../WORKFLOW.md) - Guide complet des workflows
- [WORKFLOW-QUICKSTART.md](../../../WORKFLOW-QUICKSTART.md) - Démarrage rapide
- [CLAUDE.md](../../../CLAUDE.md) - Documentation du vault
- [Obsidian Plugin API](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin)

## 📄 Licence

Ce plugin est fourni "tel quel" pour un usage personnel dans votre vault Zettelkasten.

---

**Version** : 1.0.0
**Dernière mise à jour** : 2025-11-11
**Auteur** : Zettelkasten Team
