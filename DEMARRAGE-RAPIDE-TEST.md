# 🚀 Démarrage rapide - Test Plugin v2.0.0

**Temps estimé** : 10 minutes
**Objectif** : Vérifier que le plugin suit la philosophie Zettelkasten

---

## ⚡ 3 étapes pour démarrer

### 1️⃣ Recharger Obsidian

```
Windows/Linux : Ctrl+R
macOS : Cmd+R
```

✅ Obsidian devrait se recharger avec le plugin v2.0.0

### 2️⃣ Ouvrir le plugin

**Option A** : Cliquer sur l'icône 💬 dans la sidebar gauche

**Option B** : Palette de commandes
- `Ctrl/Cmd+P`
- Taper "Ouvrir Claude Client"
- Entrée

✅ La fenêtre du plugin devrait s'ouvrir

### 3️⃣ Charger le contexte

- Cliquer sur le bouton "📚 Charger vault"
- Attendre le message de confirmation

✅ Le plugin connait maintenant vos notes

---

## 🧪 Tests rapides (5 minutes)

### Test 1 : Recherche dans le vault (30 sec)

**Tapez** :
```
Comment fonctionne DHCP ?
```

**✅ Attendu** :
- Commence par "🔍 Recherche dans vos notes..."
- Cite `[[DHCP - Dynamic Host Configuration]]`
- Suggère notes connexes

**❌ Problème** :
- Réponse générique sans citer vos notes
→ Cliquez sur "📚 Charger vault" et réessayez

---

### Test 2 : Détection de doublon (1 min)

**Tapez** :
```
Peux-tu créer une note sur Port Forwarding ?
```

**✅ Attendu** :
- "🔍 Vérification dans 1-Permanent/..."
- "✅ Note existante trouvée : [[Port Forwarding]]"
- Propose enrichissement (pas création)

**❌ Problème** :
- Propose de créer une nouvelle note
→ Bug - Le plugin devrait détecter le doublon

---

### Test 3 : Commande avec confirmation (30 sec)

**Tapez** :
```
Liste mes notes VLAN
```

**✅ Attendu** :
- Bloc d'action s'affiche
- Boutons "✓ Confirmer" et "✗ Ignorer"
- Après clic : statut "⏳ Exécution..." puis "✓ Exécuté"

**❌ Problème** :
- Pas de bloc d'action
→ Le plugin devrait créer un bloc avec boutons

---

### Test 4 : Audit de note (1 min)

**Actions** :
1. Ouvrir une note permanente (ex: `DHCP - Dynamic Host Configuration.md`)
2. Cliquer sur "📝 Analyser note" dans le plugin

**✅ Attendu** :
- Rapport avec score /100
- 5 critères évalués
- Suggestions de connexions

**❌ Problème** :
- Pas de score ou analyse superficielle
→ Le plugin devrait générer un rapport détaillé

---

### Test 5 : Suggestion de création (2 min)

**Tapez** :
```
Peux-tu créer une note sur le protocole SSH ?
```

**✅ Attendu** :
- "🔍 Vérification dans 1-Permanent/..."
- "Je n'ai pas trouvé de note existante sur SSH"
- Propose contenu en markdown
- Frontmatter correct (type, created, tags)
- Connexions suggérées
- "📝 Action requise : Créez manuellement..."

**❌ Problème** :
- Tente de créer automatiquement
- Pas de vérification préalable
→ Le plugin ne devrait JAMAIS créer automatiquement

---

## ✅ Checklist finale

Après les 5 tests :

- [ ] Le plugin cite vos notes avec [[Links]]
- [ ] Le plugin détecte les doublons
- [ ] Les boutons de confirmation fonctionnent
- [ ] L'audit affiche un score /100
- [ ] Aucune création automatique de fichier

**Si tout est coché** : ✅ Le plugin est conforme v2.0.0

**Si des cases non cochées** : Consultez `GUIDE-TEST-PLUGIN.md` pour diagnostic

---

## 📚 Documentation complète

| Fichier | Contenu |
|---------|---------|
| `GUIDE-TEST-PLUGIN.md` | Tests détaillés avec exemples |
| `SIMULATION-INTERFACE-PLUGIN.md` | Captures d'écran simulées |
| `RESUME-MIGRATION-V2.md` | Résumé complet des changements |
| `.obsidian/plugins/claude-client/CHANGELOG.md` | Historique versions |
| `.obsidian/plugins/claude-client/README.md` | Documentation plugin |

---

## 🐛 Dépannage rapide

### Le plugin ne démarre pas

1. Vérifier que le plugin est activé :
   - Paramètres → Plugins communautaires
   - "Claude Client" doit être ✅

2. Vérifier Claude Code CLI :
   ```bash
   claude --version
   ```

3. Recharger Obsidian : `Ctrl+R` / `Cmd+R`

---

### Le plugin ne cite pas les notes

1. Cliquer sur "📚 Charger vault"
2. Attendre confirmation
3. Réessayer la question

---

### Les boutons ne s'affichent pas

Vérifier que la réponse contient :
````
```bash:execute
commande
```
````

Si pas de bloc → Le plugin n'a pas généré le bon format

---

### Le plugin crée des fichiers automatiquement

🚨 **BUG** : Ce ne devrait PAS arriver en v2.0.0

Vérifier la version :
- Ouvrir `.obsidian/plugins/claude-client/manifest.json`
- Ligne "version" doit être "2.0.0"

Si version < 2.0.0 → Recharger Obsidian

---

## 📊 Résultats attendus

Après ce test rapide, vous devriez constater :

1. **Recherche vault prioritaire**
   - Claude cite toujours vos notes d'abord
   - Format `[[Note Title]]` présent
   - Synthèse multi-notes fonctionnelle

2. **Pas de création automatique**
   - Suggestions en markdown uniquement
   - Demande de validation systématique
   - Instructions manuelles claires

3. **Détection doublons**
   - Scanner 1-Permanent/ avant suggestion
   - Proposition enrichissement vs création
   - Analyse contenu existant

4. **Qualité Zettelkasten**
   - Suggestions atomiques (1 concept)
   - Min 2 connexions suggérées
   - Frontmatter correct
   - Concision respectée

---

## 🎯 Prochaines étapes

Une fois les tests rapides validés :

1. **Utilisation quotidienne**
   - Poser vos questions réelles
   - Analyser vos notes avec "📝 Analyser"
   - Construire progressivement votre vault

2. **Compléter avec agents**
   - `/audit` pour rapports détaillés
   - `/create-note` pour création guidée
   - `/process-inbox` pour traiter en masse

3. **Feedback**
   - Noter les comportements inattendus
   - Identifier améliorations possibles

---

**Version testée** : 2.0.0
**Date** : 2025-11-16
**Temps test** : ~10 minutes
**Statut** : ✅ Prêt

Bon test ! 🚀
