# Changelog - Claude Client Plugin

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

## [2.0.1] - 2025-11-16

### 🐛 Corrections

**Liens wiki non cliquables** :
- Les liens `[[Note Title]]` dans les réponses de Claude sont maintenant correctement rendus et cliquables
- Ajout de la fonction `getSourcePath()` pour fournir un contexte de fichier au MarkdownRenderer
- Les liens pointent maintenant vers les notes correspondantes du vault

**Détails techniques** :
- Le `MarkdownRenderer.renderMarkdown()` reçoit maintenant un `sourcePath` valide au lieu d'une chaîne vide
- Utilise le fichier actif comme contexte, ou le premier fichier markdown du vault
- Affecte les fonctions `addAssistantMessage()` et `renderMessageWithActions()`

---

## [2.0.0] - 2025-11-16

### 🎯 Changements majeurs - Alignement Zettelkasten

Cette version majeure aligne complètement le plugin avec la philosophie Zettelkasten du projet et les règles des agents existants.

#### ✨ Nouveau système prompt

**Philosophie "Enrichir avant créer"** :
- Le plugin scanne TOUJOURS `1-Permanent/` avant de suggérer une nouvelle note
- Propose d'enrichir une note existante plutôt que créer un doublon
- Respecte strictement l'atomicité : une note = un concept

**Priorité au vault** :
- Cherche d'abord dans vos notes permanentes pour répondre aux questions
- Cite explicitement les notes utilisées : "D'après votre note [[Note]]..."
- Distingue clairement connaissance du vault vs information générale

**Workflow avec validation** :
- ❌ Ne crée PLUS de fichiers automatiquement (suppression de `executeEditAction`)
- ✅ Suggère du contenu que vous créez manuellement
- ✅ Demande confirmation pour commandes bash

**Critères de qualité Zettelkasten** :
- Atomicité : Une seule idée par note
- Autonomie : Notes compréhensibles seules
- Connexions : Minimum 2 liens bidirectionnels
- Concision : 1-3 paragraphes maximum

#### 🔄 Modifications techniques

**Système de parsing des actions** :
- ✅ Conservé : Parsing des commandes `bash:execute` et `command:`
- ❌ Retiré : Format `edit:fichier.md` (création/modification automatique)
- ✅ À la place : Suggestions de contenu en markdown simple

**Prompt d'analyse amélioré** :
- Critères d'audit détaillés (Atomicité, Clarté, Connexions, Autonomie, Concision)
- Score /100 avec pondération
- Suggestions de connexions basées sur notes existantes
- Identification de concepts à extraire

#### 📚 Documentation mise à jour

**README enrichi** :
- Section "Principes Zettelkasten intégrés" complète
- Tableau de comparaison avec agents et slash commands
- Exemples d'utilisation alignés avec la philosophie
- Workflow intelligent documenté

**Exemples de bonnes réponses** :
- Citation de notes existantes
- Vérification systématique dans 1-Permanent/
- Suggestions d'enrichissement vs création
- Propositions de connexions pertinentes

#### 🔗 Intégration avec l'écosystème

Le plugin complète maintenant harmonieusement :
- `/audit` : Audit complet avec score
- `/create-note` : Création guidée
- `/process-inbox` : Traitement batch
- `zettelkasten-knowledge-responder` : Recherche approfondie

### 🐛 Corrections

- Suppression de la capacité de créer/modifier fichiers sans validation
- Alignement du ton et du style avec les agents existants
- Harmonisation des exemples et instructions

### ⚠️ Breaking Changes

**Pour les utilisateurs de v1.x** :

1. **Plus de création automatique de fichiers**
   - Avant : Claude créait des fichiers directement
   - Maintenant : Claude suggère le contenu, vous créez manuellement

2. **Nouveau workflow de réponse**
   - Avant : Réponses génériques
   - Maintenant : Cherche d'abord dans vos notes permanentes

3. **Format des actions**
   - Retiré : ````edit:fichier.md`
   - Conservé : ````bash:execute` et ````command:`

### 📝 Migration depuis v1.x

**Aucune action requise** - Mise à jour transparente.

Le plugin fonctionne toujours, mais avec un comportement plus aligné avec la philosophie Zettelkasten :
- Vos conversations existantes restent fonctionnelles
- Les boutons d'action pour bash fonctionnent toujours
- Le plugin suggère maintenant au lieu de créer automatiquement

---

## [1.1.0] - 2025-11-16

### ✨ Nouveau

- Système de boutons d'actions avec confirmation
- Parsing intelligent des réponses de Claude
- Support des commandes `bash:execute` et `command:`
- Support des éditions de fichiers `edit:path/file.md`
- Feedback visuel des actions (en cours, succès, erreur)
- Styles CSS pour les blocs d'action

### 📚 Documentation

- Guide complet d'utilisation des actions
- Exemples de formats attendus
- Section sécurité

---

## [1.0.0] - 2025-11-15

### ✨ Version initiale

- Interface de chat intégrée à Obsidian
- Utilisation de Claude Code CLI
- Barre de progression d'usage (5h rolling window)
- Support de plusieurs plans (Pro, Max 5, Max 20)
- Bouton "Analyser note" pour auditer la note courante
- Bouton "Charger vault" pour contexte
- Calcul d'usage depuis fichiers JSONL de Claude Code
- Support drag & drop d'images (préparation future)
- Historique de conversation (6 derniers messages)
- Prompt système spécialisé Zettelkasten

### 🎨 Interface

- En-tête avec actions rapides
- Zone de messages avec rendu markdown
- Zone de saisie avec support Ctrl+Entrée
- Barre de progression colorée (vert/orange/rouge)

### ⚙️ Configuration

- Commande Claude CLI personnalisable
- Activation/désactivation contexte vault
- Limite de notes dans contexte (défaut: 50)
- Sélection du plan d'abonnement

---

**Légende** :
- ✨ Nouveau
- 🔄 Modifié
- 🐛 Correction
- ⚠️ Breaking change
- 📚 Documentation
- 🎨 Interface
- ⚙️ Configuration
