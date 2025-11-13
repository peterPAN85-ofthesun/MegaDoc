# 🔌 Installation du Plugin Zettelkasten Claude Assistant

Guide d'installation rapide du plugin Obsidian pour utiliser les workflows Claude directement dans Obsidian.

---

## ✅ Le plugin est déjà installé !

Le plugin a été créé et est présent dans votre vault :
```
.obsidian/plugins/zettelkasten-claude-assistant/
```

Il vous suffit maintenant de l'**activer**.

---

## 📝 Activation du plugin (2 minutes)

### Étape 1 : Ouvrir Obsidian

Ouvrez votre vault `ObsidianZettle` dans Obsidian.

### Étape 2 : Accéder aux paramètres

1. Cliquer sur l'icône **⚙️ Paramètres** (en bas à gauche)
2. Ou appuyer sur `Ctrl-,` (Windows/Linux) ou `Cmd-,` (Mac)

### Étape 3 : Désactiver le mode restreint

1. Dans la barre latérale, cliquer sur **Plugins communautaires**
2. Si vous voyez "Mode restreint activé", cliquer sur **Désactiver le mode restreint**
3. Confirmer en cliquant sur **Désactiver**

> **Note** : Le mode restreint empêche l'utilisation de plugins communautaires. Le désactiver est sans danger pour votre système.

### Étape 4 : Actualiser la liste des plugins

1. Toujours dans **Plugins communautaires**
2. Chercher la section **Plugins installés**
3. Vous devriez voir **Zettelkasten Claude Assistant**

### Étape 5 : Activer le plugin

1. Trouver **Zettelkasten Claude Assistant** dans la liste
2. Cliquer sur le bouton de toggle pour l'**activer** ✅

### Étape 6 : Vérifier l'installation

1. Appuyer sur `Ctrl-P` (ou `Cmd-P` sur Mac)
2. Taper "Zettelkasten" ou "Créer"
3. Vous devriez voir apparaître les commandes :
   - ✅ **Créer une note permanente**
   - ✅ **Atomiser une note (extraire concepts)**
   - ✅ **Trouver des liens pour la note active**
   - ✅ **Traiter l'Inbox (0-Inbox/)**
   - ✅ **Mettre à jour un Map of Content (MOC)**
   - ✅ **Auditer la qualité de la note active**
   - ✅ **Ouvrir le guide des workflows**

---

## ⚙️ Configuration du mode terminal (recommandé)

Le plugin peut maintenant **lancer automatiquement un terminal** avec Claude Code !

### Activer le mode terminal

1. **Paramètres** (⚙️) → **Zettelkasten Claude Assistant**
2. **Mode d'exécution** : Choisir **"🖥️ Terminal (automatique)"**
3. **Terminal préféré** : Laisser sur "Auto-détection" (recommandé)
4. Cliquer sur **"Tester"** pour vérifier que ça fonctionne

**Avantages du mode terminal** :
- ✅ **6x plus rapide** qu'avec le mode presse-papiers
- ✅ Terminal s'ouvre automatiquement avec la commande prête
- ✅ Plus besoin de copier-coller manuellement

➜ **Voir [[PLUGIN-TERMINAL-MODE]] pour le guide complet**

Si vous préférez le mode manuel (presse-papiers), vous pouvez le garder activé.

---

## 🎯 Première utilisation (5 minutes)

### Test 1 : Créer une note permanente

**Avec le mode terminal (recommandé)** :
1. Appuyez sur `Ctrl-P`
2. Tapez "Créer une note" et sélectionnez la commande
3. Entrez un concept (ex: "Test Plugin")
4. Entrez un contenu optionnel
5. Cliquez sur "Créer avec Claude"
6. 🎉 Un terminal s'ouvre automatiquement avec la commande prête !
7. Collez la commande dans Claude avec `Ctrl-Shift-V`
8. Claude crée la note !

**Avec le mode presse-papiers** :
1. Appuyez sur `Ctrl-P`
2. Tapez "Créer une note" et sélectionnez la commande
3. Entrez un concept (ex: "Test Plugin")
4. Entrez un contenu optionnel
5. Cliquez sur "Créer avec Claude"
6. Le prompt est copié dans votre presse-papiers ✅
7. Ouvrez Claude Code et collez le prompt
8. Claude crée la note !

### Test 2 : Traiter l'Inbox

**Avec le mode terminal** :
1. Appuyez sur `Ctrl-P`
2. Tapez "Traiter" et sélectionnez "Traiter l'Inbox"
3. Le plugin affiche le nombre de fichiers dans `0-Inbox/`
4. Cliquez sur "Traiter avec Claude"
5. 🎉 Terminal s'ouvre automatiquement !
6. Collez et Claude traite vos notes

**Avec le mode presse-papiers** :
1. Appuyez sur `Ctrl-P`
2. Tapez "Traiter" et sélectionnez "Traiter l'Inbox"
3. Le plugin affiche le nombre de fichiers dans `0-Inbox/`
4. Cliquez sur "Traiter avec Claude"
5. Le prompt est copié ✅
6. Collez dans Claude Code pour traiter vos notes

### Test 3 : Enrichir une note

1. Ouvrez une note dans `1-Permanent/` (ex: Subnetting)
2. Appuyez sur `Ctrl-P`
3. Tapez "Trouver" et sélectionnez "Trouver des liens"
4. Cliquez sur "Trouver avec Claude"
5. En mode terminal : Terminal s'ouvre automatiquement 🎉
6. En mode presse-papiers : Le prompt est copié ✅
7. Claude suggère des liens pertinents !

---

## ⌨️ Assigner des raccourcis clavier (optionnel)

Pour un accès encore plus rapide, assignez des raccourcis :

### Étape 1 : Ouvrir les raccourcis

1. **Paramètres** (⚙️)
2. **Raccourcis clavier**

### Étape 2 : Chercher les commandes

Dans la barre de recherche, tapez "Zettelkasten"

### Étape 3 : Assigner les raccourcis

Cliquez sur l'icône **+** à côté de chaque commande et définissez votre raccourci.

**Suggestions** :

| Commande | Raccourci suggéré |
|----------|-------------------|
| Créer une note permanente | `Ctrl-Alt-N` |
| Atomiser une note | `Ctrl-Alt-A` |
| Trouver des liens | `Ctrl-Alt-L` |
| Traiter l'Inbox | `Ctrl-Alt-I` |
| Mettre à jour un MOC | `Ctrl-Alt-M` |
| Auditer une note | `Ctrl-Alt-Q` |

> **Astuce** : Choisissez des raccourcis faciles à mémoriser et qui ne sont pas déjà utilisés !

---

## 🔄 Workflow complet

Voici comment intégrer le plugin dans votre workflow quotidien :

### Matin (5 min)
```
1. Ouvrir Obsidian
2. Capturer idées rapides dans 0-Inbox/
   (directement dans Obsidian)
```

### Midi (10 min)
```
3. Ctrl-P → "Créer une note permanente"
   Créer 1-2 notes sur concepts que vous avez appris
4. Coller dans Claude Code
5. Claude crée les notes dans 1-Permanent/
```

### Soir (5 min)
```
6. Ouvrir une note récente dans 1-Permanent/
7. Ctrl-P → "Trouver des liens"
8. Claude enrichit les connexions
```

### Vendredi (30 min)
```
9. Ctrl-P → "Traiter l'Inbox"
10. Claude propose un plan
11. Atomiser les fichiers un par un
12. Ctrl-P → "Mettre à jour un MOC"
13. Claude met à jour vos MOCs
```

---

## 🐛 Dépannage

### Problème : Le plugin n'apparaît pas

**Solution 1** : Redémarrer Obsidian
- Fermer complètement Obsidian
- Rouvrir le vault

**Solution 2** : Vérifier les fichiers
```bash
ls .obsidian/plugins/zettelkasten-claude-assistant/
# Doit afficher : manifest.json, main.js, styles.css, README.md
```

**Solution 3** : Vérifier le mode restreint
- Paramètres → Plugins communautaires
- Mode restreint doit être **désactivé**

### Problème : Les commandes ne s'affichent pas dans Ctrl-P

**Solution** : Vérifier que le plugin est activé
- Paramètres → Plugins communautaires → Plugins installés
- Chercher "Zettelkasten Claude Assistant"
- Le toggle doit être **vert** ✅

### Problème : Le prompt n'est pas copié

**Solution 1** : Vérifier les permissions
- Le navigateur peut bloquer l'accès au presse-papiers
- Autoriser dans les paramètres du navigateur

**Solution 2** : Copier manuellement
- Sélectionner le texte dans la modal
- `Ctrl-C` pour copier

### Problème : Claude ne trouve pas les fichiers

**Solution** : Vérifier le répertoire de Claude Code
```bash
# Dans le terminal où Claude Code tourne
pwd
# Doit afficher : /home/gregoire/Documents/ObsidianZettle

# Si différent, naviguer vers le bon dossier
cd ~/Documents/ObsidianZettle
```

---

## 📚 Documentation complète

Pour plus d'informations :

- [README du plugin](.obsidian/plugins/zettelkasten-claude-assistant/README.md) - Documentation détaillée
- [[PLUGIN-TERMINAL-MODE]] - 🆕 Guide du mode terminal automatique
- [[WORKFLOW]] - Guide complet des workflows
- [[WORKFLOW-QUICKSTART]] - Démarrage rapide
- [[INDEX]] - Point d'entrée du Zettelkasten

---

## 🎓 Tutoriel vidéo (à venir)

Un tutoriel vidéo sera créé pour montrer :
1. L'activation du plugin
2. Les 7 commandes en action
3. Un workflow complet de A à Z
4. Astuces et bonnes pratiques

---

## 🆘 Besoin d'aide ?

Si vous rencontrez des problèmes :

1. Vérifier ce guide de dépannage
2. Lire le [README du plugin](.obsidian/plugins/zettelkasten-claude-assistant/README.md)
3. Consulter la [documentation Obsidian](https://help.obsidian.md/)

---

## 🚀 Commencer maintenant !

**Action immédiate** :

1. Ouvrir Obsidian
2. Paramètres → Plugins communautaires
3. Désactiver mode restreint
4. Activer "Zettelkasten Claude Assistant"
5. `Ctrl-P` → "Créer une note permanente"
6. Tester votre première commande !

---

**Installation terminée ?** Passez à [[WORKFLOW-QUICKSTART]] pour maîtriser les workflows ! 🎉

---

**Dernière mise à jour** : 2025-11-11
**Version du plugin** : 1.1.0
**🆕 Nouveauté v1.1.0** : Mode terminal automatique - 6x plus rapide !
