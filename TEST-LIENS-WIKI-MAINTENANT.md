# 🧪 Test des liens wiki - Session guidée

**Version** : 2.0.1
**Objectif** : Vérifier que les liens `[[Note]]` fonctionnent

---

## ✅ Checklist de préparation

Avant de commencer, vérifions que tout est prêt :

- [ ] Obsidian est ouvert
- [ ] Le vault `ObsidianZettle` est chargé
- [ ] Vous êtes prêt à recharger Obsidian

---

## 📝 Étape 1 : Recharger Obsidian

### Action
Pressez **`Ctrl+R`** (ou `Cmd+R` sur Mac)

### Résultat attendu
- Obsidian se recharge
- Le vault réapparaît
- Barre latérale visible

✅ **Obsidian rechargé ?** → Passez à l'étape 2

---

## 📝 Étape 2 : Vérifier la version du plugin

### Action
Ouvrez un terminal et tapez :
```bash
cat /home/gregoire/Documents/ObsidianZettle/.obsidian/plugins/claude-client/manifest.json | grep version
```

### Résultat attendu
```
  "version": "2.0.1",
```

✅ **Version 2.0.1 affichée ?** → Passez à l'étape 3

❌ **Si version différente** :
- Vérifiez que vous avez bien sauvegardé les fichiers
- Rechargez Obsidian encore une fois

---

## 📝 Étape 3 : Ouvrir le plugin Claude Client

### Action
**Option A** : Cliquez sur l'icône 💬 dans la sidebar gauche

**Option B** :
1. Pressez `Ctrl+P` (ou `Cmd+P`)
2. Tapez "Claude"
3. Sélectionnez "Ouvrir Claude Client"
4. Pressez Entrée

### Résultat attendu
Une fenêtre s'ouvre sur la droite avec :
- Titre "Claude Assistant"
- Sous-titre "via Claude Code CLI"
- Barre d'usage
- 3 boutons : 📝 Analyser note | 📚 Charger vault | 🗑️ Effacer
- Zone de messages
- Zone de saisie en bas

✅ **Le plugin est ouvert ?** → Passez à l'étape 4

❌ **Si le plugin ne s'ouvre pas** :
- Vérifiez que le plugin est activé : Paramètres → Plugins communautaires → Claude Client (doit être ✅)
- Rechargez Obsidian

---

## 📝 Étape 4 : Charger le contexte du vault

### Action
Cliquez sur le bouton **"📚 Charger vault"**

### Résultat attendu
1. Message "Chargement du contexte du vault..." apparaît brièvement
2. Puis notification : "Contexte chargé: XX notes permanentes, XX MOCs"
3. Dans la zone de messages, un message système apparaît :
   ```
   ✅ Contexte vault chargé:
   - XX notes permanentes
   - XX MOCs
   - XX notes inbox
   ```

✅ **Contexte chargé ?** → Passez à l'étape 5

❌ **Si erreur** :
- Vérifiez que Claude Code CLI est installé : `claude --version`
- Vérifiez que vous êtes authentifié : `claude auth login`

---

## 📝 Étape 5 : Poser une question test

### Action
Dans la zone de saisie en bas, tapez exactement :
```
Comment fonctionne le protocole DHCP ?
```

Puis :
- **Option A** : Cliquez sur "Envoyer"
- **Option B** : Pressez `Ctrl+Entrée` (ou `Cmd+Entrée`)

### Résultat attendu

1. **Votre message apparaît** :
   ```
   Vous: Comment fonctionne le protocole DHCP ?
   ```

2. **Message de chargement** :
   ```
   Claude réfléchit...
   ```

3. **Réponse de Claude** (après quelques secondes) :
   ```
   🔍 Recherche dans vos notes permanentes...

   D'après votre note [[DHCP - Dynamic Host Configuration]], DHCP...
   ```

✅ **La réponse apparaît ?** → Passez à l'étape 6

❌ **Si erreur ou timeout** :
- Vérifiez votre connexion internet
- Vérifiez que Claude Code CLI fonctionne : `claude "test"`
- Attendez 1-2 minutes (première requête peut être lente)

---

## 📝 Étape 6 : VÉRIFIER LES LIENS (Point crucial !)

### Action

Dans la réponse de Claude, cherchez les liens entre crochets doubles `[[...]]`

### Test 1 : Apparence visuelle

**Examinez le lien** `[[DHCP - Dynamic Host Configuration]]`

✅ **Le lien doit être** :
- [ ] En **bleu** (couleur de lien Obsidian)
- [ ] Souligné ou stylisé différemment du texte normal
- [ ] Visuellement distinct

❌ **Si le lien est en texte brut noir** :
→ Le rendu markdown ne fonctionne pas correctement

### Test 2 : Survol du lien

**Passez la souris sur le lien** `[[DHCP - Dynamic Host Configuration]]`

✅ **Le curseur doit** :
- [ ] Changer en **icône de main** (pointeur)
- [ ] Afficher un **aperçu de la note** (preview) si activé dans Obsidian

❌ **Si le curseur reste en texte (I-beam)** :
→ Le lien n'est pas cliquable

### Test 3 : Clic sur le lien

**Cliquez sur le lien** `[[DHCP - Dynamic Host Configuration]]`

✅ **Résultat attendu** :
- [ ] La note **"DHCP - Dynamic Host Configuration.md"** s'ouvre dans l'éditeur
- [ ] Vous voyez le contenu de cette note
- [ ] Le titre "DHCP - Dynamic Host Configuration" est visible en haut

❌ **Si rien ne se passe** :
→ Les liens ne sont pas fonctionnels

---

## 📊 Résultat du test

### ✅ Si les 3 tests sont validés

**SUCCÈS !** 🎉

Les liens wiki fonctionnent parfaitement. Le bugfix v2.0.1 est effectif.

Vous pouvez maintenant :
1. Poser d'autres questions
2. Cliquer sur tous les liens `[[Note]]` dans les réponses
3. Naviguer facilement dans votre vault depuis le plugin

### ❌ Si au moins un test échoue

**Diagnostic nécessaire**

Notez quel test a échoué et consultez la section "Dépannage" ci-dessous.

---

## 🐛 Dépannage

### Problème 1 : Liens en texte brut (pas en bleu)

**Cause** : Le MarkdownRenderer ne fonctionne pas

**Solutions** :
1. Vérifiez que vous avez bien rechargé Obsidian (`Ctrl+R`)
2. Vérifiez la version : doit être 2.0.1
3. Redémarrez complètement Obsidian (Fermer + Rouvrir)

### Problème 2 : Liens en bleu mais pas cliquables

**Cause** : Le sourcePath n'est pas correctement fourni

**Solutions** :
1. Ouvrez n'importe quelle note markdown du vault
2. Rechargez le plugin (fermez et rouvrez la vue)
3. Réessayez la question

### Problème 3 : Clic ne fait rien

**Cause** : Le fichier lié n'existe pas ou chemin incorrect

**Solutions** :
1. Vérifiez que la note existe :
   ```bash
   ls -1 1-Permanent/ | grep -i "DHCP.*Dynamic"
   ```
2. Si elle existe, le lien devrait fonctionner
3. Si elle n'existe pas, c'est normal que le lien ne mène nulle part

### Problème 4 : Pas de réponse de Claude

**Cause** : Claude Code CLI ne fonctionne pas

**Solutions** :
1. Testez Claude CLI :
   ```bash
   claude "Hello, réponds en français"
   ```
2. Si erreur, reconnectez-vous :
   ```bash
   claude auth login
   ```
3. Rechargez Obsidian

---

## 📝 Test supplémentaire (optionnel)

Si le premier test fonctionne, essayez une autre question :

### Question 2
```
Peux-tu m'expliquer les VLANs ?
```

**Attendu** :
- Liens vers `[[VLAN - Virtual LAN]]`
- Liens vers `[[VLAN Cisco - Configuration switch]]`
- Tous les liens doivent être cliquables

### Question 3
```
Liste mes notes sur le NAT
```

**Attendu** :
- Commande bash dans un bloc d'action
- Boutons Confirmer/Ignorer
- Après confirmation : liste des notes NAT
- Réponse avec liens vers les notes listées

---

## ✅ Validation finale

Si vous avez réussi les tests 1 à 3 de l'étape 6 :

**Le plugin v2.0.1 fonctionne correctement !**

Les fonctionnalités validées :
- ✅ Recherche dans le vault
- ✅ Citations de notes avec [[Links]]
- ✅ Liens wiki cliquables et fonctionnels
- ✅ Navigation fluide dans le vault
- ✅ Philosophie Zettelkasten respectée

---

## 🎯 Prochaines étapes

Maintenant que les liens fonctionnent :

1. **Utilisez le plugin quotidiennement**
   - Posez vos vraies questions
   - Naviguez via les liens suggérés
   - Explorez votre vault

2. **Testez les autres fonctionnalités**
   - Bouton "📝 Analyser note" sur vos notes
   - Demandes de création de contenu
   - Commandes bash avec confirmation

3. **Combinez avec les autres outils**
   - `/audit` pour audits détaillés
   - `/create-note` pour création guidée
   - `/process-inbox` pour traiter en masse

---

**Version testée** : 2.0.1
**Date** : 2025-11-16
**Statut** : ✅ Liens wiki fonctionnels

Bon test ! 🚀
