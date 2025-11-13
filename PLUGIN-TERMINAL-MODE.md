# 🖥️ Mode Terminal Automatique - Plugin v1.1.0

Le plugin Zettelkasten Claude Assistant peut maintenant **lancer automatiquement un terminal** avec Claude Code !

## 🎯 Qu'est-ce que c'est ?

Au lieu de copier le prompt dans le presse-papiers et de le coller manuellement, le plugin peut :

1. ✅ **Détecter** votre terminal (gnome-terminal, konsole, alacritty, etc.)
2. ✅ **Lancer** automatiquement ce terminal
3. ✅ **Naviguer** vers votre vault
4. ✅ **Préparer** la commande Claude
5. ✅ **Tout faire automatiquement !**

---

## 🚀 Workflow ultra-rapide

### Avant (mode presse-papiers)
```
1. Ctrl-P → Commande dans Obsidian
2. Prompt copié
3. Ouvrir terminal manuellement
4. cd ~/Documents/ObsidianZettle
5. Coller le prompt
6. Exécuter
```
**Temps : ~30 secondes**

### Maintenant (mode terminal automatique)
```
1. Ctrl-P → Commande dans Obsidian
2. Terminal s'ouvre automatiquement
3. Tout est prêt !
```
**Temps : ~5 secondes** ⚡

---

## ⚙️ Configuration

### Étape 1 : Activer le mode terminal

1. Ouvrir **Obsidian**
2. **Paramètres** (⚙️) → **Zettelkasten Claude Assistant**
3. **Mode d'exécution** : Choisir **"Terminal (automatique)"**
4. ✅ Enregistré automatiquement

### Étape 2 : Choisir votre terminal (optionnel)

Par défaut, le plugin **détecte automatiquement** votre terminal.

Si vous voulez forcer un terminal spécifique :
1. **Terminal préféré** : Choisir dans la liste
   - Auto-détection (recommandé)
   - GNOME Terminal
   - Konsole (KDE)
   - XFCE Terminal
   - Alacritty
   - Kitty
   - Terminator
   - XTerm

### Étape 3 : Tester

1. Dans les paramètres du plugin
2. Section **"Test"**
3. Cliquer sur **"Tester"**
4. Un terminal devrait s'ouvrir ✅

---

## 🎮 Utilisation

C'est exactement **pareil qu'avant**, mais maintenant un terminal s'ouvre automatiquement :

### Exemple : Créer une note

```
1. Ctrl-P
2. Taper "Créer une note permanente"
3. Remplir le formulaire
4. Cliquer "Créer avec Claude"
5. 🎉 Terminal s'ouvre automatiquement !
6. Prompt déjà affiché et copié
7. Juste appuyer sur Ctrl-Shift-V pour coller dans Claude
```

### Exemple : Traiter note courante

```
1. Ouvrir une note dans 0-Inbox/
2. Ctrl-P → "Traiter la note courante"
3. Choisir option MOC
4. Cliquer "Traiter avec Claude"
5. 🎉 Terminal s'ouvre, prompt prêt !
```

---

## 🔧 Terminaux supportés

Le plugin supporte **7 terminaux** populaires sur Linux :

| Terminal | Auto-détection | Notes |
|----------|---------------|-------|
| **GNOME Terminal** | ✅ | Par défaut sur Ubuntu/Fedora |
| **Konsole** | ✅ | Par défaut sur KDE/Kubuntu |
| **XFCE Terminal** | ✅ | Par défaut sur Xubuntu |
| **Alacritty** | ✅ | Terminal moderne et rapide |
| **Kitty** | ✅ | Terminal GPU-accéléré |
| **Terminator** | ✅ | Terminal avec split screen |
| **XTerm** | ✅ | Terminal classique (fallback) |

---

## 🛠️ Fonctionnement technique

### Script de lancement

Le plugin utilise un script bash :
```
.claude/launch-claude.sh
```

Ce script :
1. ✅ Vérifie que le vault existe
2. ✅ Navigate vers le vault
3. ✅ Affiche la commande à exécuter
4. ✅ Copie dans le presse-papiers (xclip/xsel)
5. ✅ Lance Claude CLI si disponible

### Commandes de terminal

Exemples de commandes lancées :

**GNOME Terminal :**
```bash
gnome-terminal --working-directory="/path/to/vault" -- bash -c '.claude/launch-claude.sh ...'
```

**Konsole :**
```bash
konsole --workdir "/path/to/vault" -e bash -c '.claude/launch-claude.sh ...'
```

**Alacritty :**
```bash
alacritty --working-directory "/path/to/vault" -e bash -c '.claude/launch-claude.sh ...'
```

---

## 🐛 Dépannage

### Le terminal ne s'ouvre pas

**Solution 1 : Vérifier le terminal installé**
```bash
which gnome-terminal
which konsole
which alacritty
# Au moins un doit retourner un chemin
```

**Solution 2 : Forcer un terminal spécifique**
1. Paramètres → Zettelkasten Claude Assistant
2. Terminal préféré → Choisir votre terminal
3. Tester

**Solution 3 : Revenir au mode presse-papiers**
1. Paramètres → Zettelkasten Claude Assistant
2. Mode d'exécution → "Presse-papiers (manuel)"

### Le terminal s'ouvre mais rien ne se passe

**Vérifier que le script est exécutable :**
```bash
chmod +x ~/.../ObsidianZettle/.claude/launch-claude.sh
```

**Vérifier le contenu du script :**
```bash
cat ~/.../ObsidianZettle/.claude/launch-claude.sh
```

### Erreur "Aucun terminal trouvé"

**Installer un terminal :**

**Arch Linux :**
```bash
sudo pacman -S gnome-terminal
# ou
sudo pacman -S alacritty
```

**Ubuntu/Debian :**
```bash
sudo apt install gnome-terminal
```

**Fedora :**
```bash
sudo dnf install gnome-terminal
```

---

## 🔄 Basculer entre les modes

Vous pouvez **changer à tout moment** entre les deux modes :

### Mode Terminal (recommandé)
✅ Ultra-rapide
✅ Automatique
✅ Gain de temps énorme

**Quand l'utiliser :** Workflow quotidien normal

### Mode Presse-papiers
✅ Compatible tous systèmes
✅ Fonctionne toujours
✅ Contrôle manuel

**Quand l'utiliser :**
- Terminal préféré non supporté
- Problèmes de lancement
- Préférence personnelle

---

## 📊 Comparaison des modes

| Critère | Terminal | Presse-papiers |
|---------|----------|----------------|
| **Vitesse** | ⚡⚡⚡ | ⚡ |
| **Automatisme** | ✅ 100% | ❌ Manuel |
| **Compatibilité** | Linux seulement | Tous systèmes |
| **Setup** | Auto-détection | Aucun |
| **Workflow** | 1 clic | 3+ étapes |

---

## 🎓 Conseils d'utilisation

### 1. Assigner des raccourcis clavier

Pour un workflow encore plus rapide :

```
Ctrl-Alt-N → Créer note
Ctrl-Alt-P → Traiter note courante
Ctrl-Alt-I → Traiter Inbox
```

Avec le mode terminal, c'est **instantané** !

### 2. Garder le terminal ouvert

Le script garde le terminal ouvert après l'exécution.
Vous pouvez :
- Relancer des commandes
- Vérifier les résultats
- Naviguer dans le vault

### 3. Utiliser avec /process-current-note

La commande **tout-en-un** combinée au mode terminal = **workflow parfait** :

```
1. Ctrl-P → "Traiter note courante"
2. Terminal s'ouvre
3. Claude traite tout automatiquement
4. Notes créées en 30 secondes !
```

---

## 🆕 Nouveautés v1.1.0

### Ajouté
- ✅ Mode terminal automatique
- ✅ Auto-détection de 7 terminaux
- ✅ Script de lancement `.claude/launch-claude.sh`
- ✅ Interface de configuration
- ✅ Bouton de test
- ✅ Support de tous les terminaux Linux courants

### Amélioré
- ✅ Workflow 6x plus rapide
- ✅ Moins d'étapes manuelles
- ✅ Meilleure expérience utilisateur

### Maintenu
- ✅ Mode presse-papiers toujours disponible
- ✅ Compatibilité arrière complète
- ✅ Toutes les commandes fonctionnent

---

## 🚀 Mise à jour depuis v1.0.0

Si vous utilisez déjà le plugin v1.0.0 :

1. **Redémarrer Obsidian** (Ctrl-R)
2. Le plugin se met à jour automatiquement
3. **Configurer** : Paramètres → Zettelkasten Claude Assistant
4. Choisir **"Mode terminal"**
5. **Tester** avec le bouton de test
6. ✅ Profiter du nouveau workflow !

---

## 📚 Ressources

- [[PLUGIN-INSTALLATION]] - Guide d'installation initial
- [[WORKFLOW-QUICKSTART]] - Workflows complets
- [[INDEX]] - Documentation générale

---

## 💡 Astuce Pro

**Workflow optimal** avec mode terminal :

```
Matin (1 minute) :
→ Ctrl-P → "Traiter Inbox"
→ Terminal s'ouvre
→ Claude propose plan
→ Accepter

Midi (30 secondes) :
→ Ouvrir note brute
→ Ctrl-P → "Traiter note courante"
→ Terminal s'ouvre
→ Notes créées automatiquement

Soir (20 secondes) :
→ Ouvrir note permanente
→ Ctrl-P → "Trouver liens"
→ Terminal s'ouvre
→ Liens ajoutés

Total : 2 minutes par jour pour un Zettelkasten complet !
```

---

**Version** : 1.1.0
**Date** : 2025-11-11
**Nouveauté** : Mode Terminal Automatique 🖥️⚡

---

Profitez du **workflow le plus rapide** pour construire votre Zettelkasten ! 🚀
