# Claude Client - Plugin Obsidian

Plugin Obsidian qui intègre **Claude Code CLI** pour analyser vos notes, générer du contenu et optimiser votre Zettelkasten.

## ✨ Avantages

✅ **Utilise votre abonnement Claude Code existant** - Pas de clé API supplémentaire
✅ **Aucun coût additionnel** - Inclus dans votre abonnement actuel
✅ **Interface intégrée** - Chat dans Obsidian sans changer d'application
✅ **Contexte du vault** - Claude connaît vos notes permanentes et MOCs
✅ **Philosophie Zettelkasten** - Suit les mêmes règles que vos agents et slash commands
✅ **Enrichissement prioritaire** - Cherche toujours dans vos notes existantes avant de suggérer du nouveau contenu

## Fonctionnalités

### 🗨️ Chat avec Claude
- Interface de conversation dans une vue dédiée Obsidian
- Historique de conversation maintenu
- Support du markdown dans les réponses
- **Alimenté par votre abonnement Claude Code**
- **Barre de progression d'usage** - Monitore en temps réel votre utilisation

### ⚡ Actions avec confirmation
- **Boutons d'actions intelligents** - Claude peut suggérer des modifications de fichiers et des commandes
- **Confirmation manuelle** - Chaque action nécessite votre approbation avant exécution
- **Édition de fichiers** - Créer ou modifier des notes directement depuis les suggestions
- **Exécution de commandes** - Lancer des commandes bash de manière sécurisée
- **Feedback visuel** - Suivi de l'état de chaque action (en cours, succès, erreur)

### 📝 Analyse de notes
- Analyser la note active en un clic
- Vérifier le respect des principes Zettelkasten
- Suggestions d'amélioration et de connexions

### 📚 Contexte du vault
- Claude peut charger la liste de vos notes permanentes et MOCs
- Suggestions de connexions basées sur le contenu de votre vault
- Aide à l'organisation de votre Zettelkasten

### ✍️ Génération de contenu
- Créer des notes permanentes atomiques
- Atomiser des notes trop longues
- Générer des résumés et extraits

## Installation

### Prérequis
1. **Obsidian** v0.15.0 ou supérieur
2. **Claude Code CLI** installé et authentifié

### Installation de Claude Code CLI

Si vous n'avez pas encore Claude Code CLI :

```bash
# Télécharger et installer depuis
# https://claude.ai/code

# Après installation, s'authentifier
claude auth login

# Vérifier l'installation
claude --version
```

### Activation du plugin

1. Le plugin est déjà dans `.obsidian/plugins/claude-client/`
2. Redémarrer Obsidian (Ctrl+R / Cmd+R)
3. Activer le plugin dans **Paramètres → Plugins communautaires**
4. Le plugin détectera automatiquement Claude Code CLI

## Configuration

Accédez aux paramètres : **Paramètres → Claude Client**

### Commande Claude CLI
La commande pour lancer Claude Code (par défaut: `claude`)

Si vous avez installé Claude Code dans un chemin personnalisé, modifiez cette valeur.

### Inclure le contexte du vault
Active/désactive l'envoi automatique de la liste des notes dans le système prompt.

### Notes max dans le contexte
Nombre maximum de notes permanentes à inclure (défaut: 50)

### Plan Claude
Sélectionnez votre plan d'abonnement pour un calcul précis de l'usage :
- **Pro** : ~44k tokens par fenêtre de 5 heures
- **Max 5** : ~88k tokens par fenêtre de 5 heures
- **Max 20** : ~220k tokens par fenêtre de 5 heures

Cette configuration permet à la barre de progression d'afficher votre usage réel en pourcentage.

## Utilisation

### Ouvrir Claude Client

**Méthode 1 :** Cliquer sur l'icône 💬 dans la barre latérale gauche

**Méthode 2 :** Palette de commandes (Ctrl/Cmd+P) → "Ouvrir Claude Client"

### Actions disponibles

#### 📝 Analyser note
Analyse la note actuellement ouverte :
- Vérification des principes Zettelkasten
- Suggestions d'amélioration
- Idées de notes liées
- Suggestions de connexions

#### 📚 Charger vault
Charge le contexte de votre vault (liste des notes permanentes et MOCs) pour permettre à Claude de suggérer des connexions pertinentes.

#### 🗑️ Effacer
Nettoie l'historique de conversation

### Raccourcis clavier

- **Ctrl+Entrée** (Cmd+Entrée sur Mac) : Envoyer le message

### ⚡ Utiliser les actions avec confirmation

Le plugin détecte automatiquement les actions suggérées par Claude dans ses réponses. Pour qu'une action soit détectée, Claude doit utiliser un format spécifique dans sa réponse :

#### Format pour éditer/créer un fichier :

````markdown
```edit:1-Permanent/Ma nouvelle note.md
---
type: permanent
created: 2025-11-16 14:30
tags:
  - réseau
---

# Ma nouvelle note

Contenu de la note...
```
````

#### Format pour exécuter une commande :

````markdown
```bash:execute
git status
```
````

ou

````markdown
```command:
ls -la 1-Permanent/
```
````

Lorsque Claude utilise ce format, le plugin affichera :
1. **Un bloc d'action** avec le type et le nom du fichier/commande
2. **Le contenu** de l'action dans un bloc de code
3. **Deux boutons** :
   - **✓ Confirmer et exécuter** : Lance l'action après votre confirmation
   - **✗ Ignorer** : Ignore cette action

**Statuts possibles** :
- ⏳ **Exécution...** : L'action est en cours
- ✓ **Exécuté avec succès** : L'action s'est terminée correctement
- ✗ **Erreur : [message]** : Une erreur s'est produite
- ⊘ **Ignoré** : Vous avez choisi d'ignorer cette action

**Exemple d'utilisation** :

```
Vous : Peux-tu créer une note permanente sur le protocole TCP ?

Claude : Bien sûr ! Voici une note atomique sur le protocole TCP :

```edit:1-Permanent/TCP - Transmission Control Protocol.md
---
type: permanent
created: 2025-11-16 14:30
tags:
  - réseau
  - protocole
---

# TCP - Transmission Control Protocol

TCP est un protocole de la couche transport...
```

[Un bloc d'action apparaît avec les boutons Confirmer/Ignorer]
```

**Sécurité** :
- Les actions nécessitent toujours votre confirmation manuelle
- Les commandes bash sont exécutées dans le répertoire du vault
- Les éditions de fichiers créent automatiquement les dossiers parents si nécessaire

### 📊 Barre de progression d'usage

Une barre de progression est affichée dans l'en-tête du plugin pour monitorer votre utilisation en temps réel :

- **Couleur verte** (< 70%) : Utilisation normale
- **Couleur orange** (70-85%) : Utilisation modérée
- **Couleur rouge** (> 85%) : Utilisation élevée

**Fonctionnement** :
- La barre lit les fichiers JSONL de Claude Code (`~/.claude/projects/`)
- Calcule l'usage total sur une fenêtre glissante de 5 heures
- Compare aux limites de votre plan (configurable dans les paramètres)
- Met à jour automatiquement après chaque message

**Limites selon le plan** :
- **Pro** : ~44 000 tokens / 5h
- **Max 5** : ~88 000 tokens / 5h
- **Max 20** : ~220 000 tokens / 5h

Configurez votre plan dans les paramètres pour un affichage précis de votre quota.

## Exemples d'utilisation

### Analyser une note

1. Ouvrir la note à analyser
2. Cliquer sur "📝 Analyser note"
3. Claude fournit son analyse et suggestions

### Trouver des connexions

```
Pouvez-vous suggérer des connexions entre ma note sur "TCP Three-Way Handshake"
et d'autres concepts de réseau dans mon vault ?
```

### Créer une note atomique

```
Peux-tu m'aider à créer une note permanente sur le concept de "VLAN tagging" ?
Je veux une note atomique qui explique le concept clairement.
```

### Atomiser une note longue

```
Cette note contient plusieurs concepts. Peux-tu identifier les concepts
atomiques et suggérer comment la diviser en notes séparées ?
```

### Générer du contenu pour une note existante

```
J'ai une note sur "DHCP" qui manque d'exemples. Peux-tu suggérer
des exemples concrets à ajouter ?
```

## Principes Zettelkasten intégrés

Le plugin suit **strictement** la même philosophie que vos agents et slash commands :

### Règles fondamentales

✅ **ENRICHIR AVANT CRÉER**
- Le plugin scanne toujours `1-Permanent/` avant de suggérer une nouvelle note
- Propose d'enrichir une note existante plutôt que créer un doublon
- Respecte l'atomicité : une note = un concept unique

✅ **PRIORITÉ AU VAULT**
- Répond aux questions en cherchant d'abord dans vos notes permanentes
- Cite explicitement les notes utilisées : "D'après votre note [[Note]]..."
- Distingue clairement entre connaissance du vault et information générale

✅ **VALIDATION UTILISATEUR**
- Ne crée JAMAIS de fichiers automatiquement
- Suggère du contenu que vous pouvez créer manuellement
- Demande confirmation pour les commandes bash

✅ **QUALITÉ ZETTELKASTEN**
- Atomicité : Une seule idée par note
- Autonomie : Notes compréhensibles seules
- Connexions : Minimum 2 liens bidirectionnels
- Concision : 1-3 paragraphes maximum

### Workflow intelligent

1. **Scanner** : Cherche dans `1-Permanent/` pour notes existantes
2. **Analyser** : Détermine si enrichir ou créer
3. **Proposer** : Suggère contenu avec frontmatter et connexions
4. **Valider** : Demande confirmation avant action

## Structure du prompt système

Claude comprend la structure de votre vault :

```
0-Inbox/      → Notes non traitées, cours, tutoriels
1-Permanent/  → Notes permanentes atomiques (cœur du système)
2-Maps/       → Maps of Content (index thématiques)
Templates/    → Modèles de notes
```

## Fonctionnement technique

Le plugin utilise **Claude Code CLI** en arrière-plan :

1. Votre message est envoyé au CLI via `child_process`
2. Le contexte du vault est ajouté au système prompt
3. Claude répond via votre abonnement Claude Code
4. La réponse est affichée dans l'interface Obsidian

**Avantage** : Pas besoin de clé API séparée, utilise votre abonnement existant.

## Dépannage

### Le plugin ne se charge pas
1. Vérifier qu'Obsidian est en version 0.15.0+
2. Redémarrer Obsidian (Ctrl/Cmd+R)
3. Vérifier que le plugin est activé dans les paramètres

### Erreur "Claude Code CLI non détecté"
1. Vérifier que Claude Code est installé : `claude --version`
2. Vérifier que `claude` est dans votre PATH
3. Si installé ailleurs, modifier le chemin dans les settings du plugin

### Erreur "not authenticated"
1. S'authentifier : `claude auth login`
2. Suivre les instructions dans le terminal
3. Relancer Obsidian

### Le message ne s'envoie pas
- Vérifier que le champ de saisie n'est pas vide
- Vérifier que Claude Code est authentifié
- Vérifier les erreurs dans la console (Ctrl/Cmd+Shift+I)

### Timeout ou réponse lente
- Le plugin attend jusqu'à 2 minutes par requête
- Les prompts très longs peuvent prendre du temps
- Essayer de simplifier la question

## Confidentialité et sécurité

- **Données locales** : L'historique de conversation reste dans Obsidian
- **Claude Code** : Les prompts sont envoyés via votre CLI authentifié
- **Aucun stockage tiers** : Pas de serveur intermédiaire
- Consultez la [politique de confidentialité d'Anthropic](https://www.anthropic.com/privacy)

## Différences avec l'API directe

| Caractéristique | Plugin CLI (actuel) | API directe |
|----------------|---------------------|-------------|
| **Coût** | Inclus dans abonnement Claude Code | Pay-as-you-go (facturation à l'usage) |
| **Setup** | Juste authentifier CLI | Besoin clé API + facturation |
| **Latence** | Légèrement plus lente (subprocess) | Plus rapide (HTTP direct) |
| **Flexibilité** | Paramètres limités | Contrôle total (température, tokens, etc.) |

## Limites connues

- Nécessite Claude Code CLI installé et authentifié
- Légèrement plus lent que l'API directe (subprocess)
- Historique de conversation limité (6 derniers messages)
- Pas de streaming en temps réel (pour l'instant)

## Intégration avec les agents Zettelkasten

Le plugin **complète** vos agents et slash commands existants :

| Outil | Usage | Force |
|-------|-------|-------|
| **Plugin Obsidian** | Questions rapides, analyse note active, suggestions | Interface intégrée, réponses immédiates |
| **`/audit`** | Audit complet avec score détaillé | Rapport structuré, métriques précises |
| **`/create-note`** | Création guidée de note permanente | Workflow complet avec validation |
| **`/process-inbox`** | Traitement batch de l'Inbox | Atomisation de contenu en masse |
| **`zettelkasten-knowledge-responder`** | Recherche approfondie dans le vault | Synthèse multi-notes avancée |

**Conseil** : Utilisez le plugin pour interactions rapides, les slash commands pour workflows structurés.

## Roadmap / Améliorations futures

- [x] Barre de progression d'usage dans l'en-tête (avec calcul réel depuis les logs)
- [x] Récupération réelle des stats d'usage depuis les fichiers JSONL de Claude Code
- [x] Configuration du type de plan (Pro/Max5/Max20)
- [x] **Boutons d'actions avec confirmation** - Exécuter commandes bash
- [x] **Philosophie Zettelkasten alignée** - Mêmes règles que les agents
- [ ] Support du streaming (affichage progressif)
- [ ] Export de conversations
- [ ] Templates de prompts personnalisables
- [ ] Raccourcis vers slash commands depuis l'interface
- [ ] Support multi-notes (analyser plusieurs notes)
- [ ] Historique des actions exécutées
- [ ] Suggestions de connexions avec graphique visuel

## Support

Pour des questions ou problèmes :
- Vérifier que Claude Code fonctionne : `claude "test"`
- Consulter la [documentation Obsidian](https://help.obsidian.md/)
- Consulter la [documentation Claude Code](https://claude.ai/code)

## Licence

Créé pour usage personnel dans le cadre du système Zettelkasten.

---

**Version** : 2.0.0 (Zettelkasten Edition)
**Auteur** : Grégoire
**Dernière mise à jour** : 2025-11-16
**Moteur** : Claude Code CLI (votre abonnement)
**Philosophie** : Alignée avec agents Zettelkasten

## Historique des versions

- **v2.0.0** (2025-11-16) : Alignement complet avec philosophie Zettelkasten
  - Enrichir avant créer
  - Priorité au vault
  - Validation utilisateur obligatoire
  - Suppression création automatique de fichiers

- **v1.1.0** (2025-11-16) : Boutons d'actions avec confirmation

- **v1.0.0** (2025-11-15) : Version initiale avec barre d'usage
