# Workflow Zettelkasten avec Claude Code

Ce document décrit comment utiliser Claude Code efficacement pour construire et maintenir votre Zettelkasten.

## Vue d'ensemble du workflow

```
┌─────────────────────────────────────────────────────────┐
│                    CYCLE ZETTELKASTEN                    │
└─────────────────────────────────────────────────────────┘

1. CAPTURE
   └─> 0-Inbox/ (notes brutes, idées rapides)

2. TRAITEMENT (avec Claude)
   └─> Extraction de concepts atomiques
   └─> Création de notes permanentes

3. CONNEXION (avec Claude)
   └─> Identification de liens entre notes
   └─> Enrichissement du graphe de connaissances

4. ORGANISATION
   └─> Mise à jour des MOCs
   └─> Consolidation de la structure
```

---

## 🎯 Workflows par tâche

### 1. Créer une note permanente depuis une source

**Quand ?** Après lecture d'un article, visionnage d'une vidéo, ou étude d'une documentation.

**Processus avec Claude :**

```markdown
Vous → Claude : "J'ai lu un article sur [SUJET]. Voici mes notes brutes :
[Coller vos notes]

Aide-moi à créer une note permanente atomique sur [CONCEPT PRINCIPAL]"

Claude → Vous :
1. Analyse les notes
2. Identifie le concept atomique principal
3. Propose un titre descriptif
4. Rédige la note en suivant le template
5. Suggère des liens avec notes existantes
6. Propose des tags appropriés
```

**Commande rapide :** `/create-note [concept]`

**Exemple concret :**
```
Vous : "J'ai suivi un tuto sur le NAT. Voici ce que j'ai noté :
- NAT = traduction IP privée → publique
- Permet de partager une IP publique
- Types : SNAT, DNAT, PAT
- Économise les IPs
- Problèmes avec certains protocoles

Crée une note permanente sur le NAT"

Claude : [Crée le fichier 1-Permanent/NAT - Network Address Translation.md]
```

---

### 2. Extraire plusieurs concepts d'une source complexe

**Quand ?** Une source contient plusieurs idées distinctes qu'il faut atomiser.

**Processus avec Claude :**

```markdown
Vous → Claude : "J'ai mes notes sur [FORMATION/LIVRE]. Extrais les concepts atomiques
et crée une note permanente pour chaque concept distinct."

Claude → Vous :
1. Lit vos notes brutes
2. Identifie tous les concepts atomiques
3. Crée une note permanente par concept
4. Établit les liens entre ces notes
5. Propose un MOC pour structurer l'ensemble
```

**Commande rapide :** `/atomize [fichier-source]`

**Exemple concret :**
```
Vous : "Atomise mes notes de 0-Inbox/FormationRéseau/Days/Jours2/J2 - Formation Réseau.md"

Claude :
→ Extrait : NAT, PAT, Ports réseaux, Classes IP
→ Crée 4 notes permanentes distinctes
→ Ajoute les liens croisés
→ Met à jour le MOC - Réseau
```

---

### 3. Trouver des connexions entre notes existantes

**Quand ?** Régulièrement (1x/semaine) pour enrichir le graphe de connaissances.

**Processus avec Claude :**

```markdown
Vous → Claude : "Analyse ma note [[Note A]] et trouve des connexions
avec d'autres notes de mon vault"

Claude → Vous :
1. Lit la note spécifiée
2. Analyse le contenu du vault
3. Identifie les notes connexes
4. Suggère des liens pertinents avec justification
5. Propose des ajouts de liens bidirectionnels
```

**Commande rapide :** `/find-links [nom-note]`

**Exemple concret :**
```
Vous : "/find-links NAT - Network Address Translation"

Claude :
"J'ai trouvé ces connexions pertinentes :

1. [[VLAN - Virtual LAN]]
   → Raison : NAT souvent utilisé pour router entre VLANs

2. [[Adressage IP privé RFC 1918]]
   → Raison : NAT traduit les IPs privées définies dans RFC 1918

3. [[Port forwarding]]
   → Raison : Technique liée au DNAT

Dois-je ajouter ces liens ?"
```

---

### 4. Créer ou mettre à jour un MOC

**Quand ?** Quand vous avez 5+ notes sur un sujet, ou hebdomadairement.

**Processus avec Claude :**

```markdown
Vous → Claude : "Crée un MOC pour le thème [THÈME]"
OU
"Mets à jour le MOC - [THÈME] avec mes notes récentes"

Claude → Vous :
1. Recherche toutes les notes liées au thème
2. Organise par sous-catégories
3. Crée/met à jour le fichier MOC
4. Ajoute une structure logique
5. Identifie les trous (concepts manquants)
```

**Commande rapide :** `/update-moc [nom-moc]`

**Exemple concret :**
```
Vous : "/update-moc MOC - Réseau"

Claude :
"J'ai trouvé 47 notes permanentes sur le réseau.
Je les ai organisées en :
- Protocoles (12 notes)
- Routage (8 notes)
- Configuration Cisco (15 notes)
- Configuration Linux (12 notes)

Voici la structure proposée : [...]
Dois-je mettre à jour le MOC ?"
```

---

### 5. Migrer du contenu depuis l'Inbox

**Quand ?** Hebdomadaire - traiter les notes de 0-Inbox/.

**Processus avec Claude :**

```markdown
Vous → Claude : "Aide-moi à traiter le contenu de 0-Inbox/"

Claude → Vous :
1. Liste les fichiers dans 0-Inbox/
2. Pour chaque fichier :
   - Identifie le type (formation, article, notes brutes)
   - Propose une stratégie (atomiser, archiver, ou transformer)
3. Crée les notes permanentes
4. Archive ou supprime le fichier source
```

**Commande rapide :** `/process-inbox`

**Exemple concret :**
```
Vous : "/process-inbox"

Claude :
"Contenu de 0-Inbox/ :
1. FormationRéseau/ (9 fichiers)
   → Stratégie : Extraire concepts réseau en notes permanentes

2. Certif Linux - 101.1.md
   → Stratégie : Atomiser en concepts Linux

Commencer par FormationRéseau/ ?"
```

---

### 6. Recherche sémantique dans le vault

**Quand ?** Quand vous cherchez des informations sans connaître le titre exact.

**Processus avec Claude :**

```markdown
Vous → Claude : "Trouve toutes mes notes qui parlent de [CONCEPT]"
OU
"Qu'est-ce que j'ai écrit sur [SUJET] ?"

Claude → Vous :
1. Recherche dans tout le vault
2. Analyse le contenu (pas seulement les titres)
3. Présente les résultats pertinents
4. Suggère des notes à créer si manquantes
```

**Exemple concret :**
```
Vous : "Qu'est-ce que j'ai sur le routage dynamique ?"

Claude :
"J'ai trouvé 3 notes permanentes :
- RIP - Routing Information Protocol (1-Permanent/)
- OSPF - Open Shortest Path First (1-Permanent/)
- EIGRP - Enhanced Interior Gateway Routing Protocol (1-Permanent/)

Elles sont toutes liées dans le MOC - Réseau.
Tu n'as pas encore de note sur BGP, c'est prévu ?"
```

---

### 7. Vérifier la qualité des notes

**Quand ?** Mensuellement, ou après création de plusieurs notes.

**Processus avec Claude :**

```markdown
Vous → Claude : "Vérifie la qualité de ma note [[Nom de la note]]"
OU
"Audit de qualité de mon vault"

Claude → Vous :
1. Vérifie l'atomicité (une seule idée ?)
2. Vérifie les liens (au moins 2 ?)
3. Vérifie la clarté
4. Suggère des améliorations
5. Identifie les notes orphelines
```

**Commande rapide :** `/audit [nom-note]` ou `/audit-vault`

**Exemple concret :**
```
Vous : "/audit NAT - Network Address Translation"

Claude :
"✅ Atomicité : OK (concept unique et focalisé)
✅ Liens : OK (5 liens vers d'autres notes)
✅ Clarté : OK (bien structuré)
⚠️  Suggestion : Ajouter un exemple concret de configuration
⚠️  Suggestion : Lien manquant vers [[DMZ]]"
```

---

### 8. Générer des idées de notes à créer

**Quand ?** Quand vous voulez développer un domaine de connaissance.

**Processus avec Claude :**

```markdown
Vous → Claude : "Quelles notes devrais-je créer pour compléter mon MOC - [THÈME] ?"

Claude → Vous :
1. Analyse le MOC existant
2. Identifie les trous de connaissance
3. Suggère des notes manquantes
4. Priorise par importance/pertinence
```

**Commande rapide :** `/suggest-notes [moc-name]`

**Exemple concret :**
```
Vous : "/suggest-notes MOC - Réseau"

Claude :
"Notes manquantes suggérées (par priorité) :

🔴 Haute priorité :
1. ARP - Address Resolution Protocol (référencé mais manquant)
2. DNS - Domain Name System (souvent utilisé avec réseau)

🟡 Moyenne priorité :
3. QoS - Quality of Service
4. Spanning Tree Protocol

🟢 Basse priorité :
5. MPLS - MultiProtocol Label Switching"
```

---

### 9. Refactoring d'une note trop longue

**Quand ?** Une note dépasse 2-3 paragraphes ou contient plusieurs idées.

**Processus avec Claude :**

```markdown
Vous → Claude : "Cette note [[Nom]] est trop longue, aide-moi à la splitter"

Claude → Vous :
1. Analyse la note
2. Identifie les concepts distincts
3. Propose un découpage en notes atomiques
4. Crée les nouvelles notes
5. Établit les liens entre elles
6. Met à jour la note originale ou la transforme en MOC
```

**Commande rapide :** `/split-note [nom-note]`

**Exemple concret :**
```
Vous : "/split-note Routage IP"

Claude :
"Cette note contient 4 concepts distincts :
1. Routage statique → Note séparée
2. Routage dynamique → Note séparée
3. Table de routage → Note séparée
4. Métrique de routage → Note séparée

Je transforme 'Routage IP' en MOC qui lie ces 4 notes ?"
```

---

### 10. Préparer une session d'étude

**Quand ?** Avant de réviser un sujet ou préparer un examen.

**Processus avec Claude :**

```markdown
Vous → Claude : "Prépare-moi une session d'étude sur [SUJET]"

Claude → Vous :
1. Rassemble toutes les notes liées
2. Crée un parcours d'apprentissage logique
3. Identifie les dépendances (prérequis)
4. Génère des questions de révision
5. Suggère un ordre de lecture
```

**Commande rapide :** `/study-session [sujet]`

**Exemple concret :**
```
Vous : "/study-session NAT et routage"

Claude :
"Parcours d'apprentissage suggéré :

📚 Fondamentaux (lire d'abord) :
1. [[Adressage IP privé RFC 1918]]
2. [[Subnetting]]
3. [[Routage statique]]

🎯 Concepts principaux :
4. [[NAT - Network Address Translation]]
5. [[PAT - Port Address Translation]]
6. [[DNAT - Destination NAT]]

🔧 Configuration pratique :
7. [[NAT Cisco - Configuration interfaces]]
8. [[NAT Linux - iptables et NAT]]

⏱️ Durée estimée : 2h30
💡 Concepts liés à explorer ensuite : VLAN, Firewall"
```

---

## 🛠️ Commandes slash disponibles

Créez ces commandes dans `.claude/commands/` pour un accès rapide :

| Commande | Description | Usage |
|----------|-------------|-------|
| `/create-note` | Créer une note permanente | `/create-note TCP handshake` |
| `/atomize` | Atomiser une source en plusieurs notes | `/atomize 0-Inbox/cours.md` |
| `/find-links` | Trouver connexions pour une note | `/find-links NAT` |
| `/update-moc` | Mettre à jour un MOC | `/update-moc Réseau` |
| `/process-inbox` | Traiter le contenu de 0-Inbox/ | `/process-inbox` |
| `/audit` | Vérifier qualité d'une note | `/audit NAT` |
| `/audit-vault` | Audit complet du vault | `/audit-vault` |
| `/suggest-notes` | Suggérer notes manquantes | `/suggest-notes MOC - Réseau` |
| `/split-note` | Diviser note trop longue | `/split-note Routage` |
| `/study-session` | Préparer session d'étude | `/study-session NAT` |

---

## 📋 Bonnes pratiques pour communiquer avec Claude

### ✅ Faire

1. **Être explicite sur vos attentes**
   ```
   ✅ "Crée une note permanente sur le TCP handshake avec :
       - Explication du processus SYN/SYN-ACK/ACK
       - Schéma textuel
       - Liens vers IP, Port, et État de connexion"
   ```

2. **Fournir du contexte**
   ```
   ✅ "J'ai suivi une formation réseau. Voici mes notes brutes : [...]
       Extrais le concept de NAT en une note atomique"
   ```

3. **Demander des suggestions de liens**
   ```
   ✅ "Quelles notes de mon vault devraient être liées à cette nouvelle note sur VLAN ?"
   ```

4. **Valider avant création massive**
   ```
   ✅ "Liste d'abord les notes que tu vas créer, je validerai avant"
   ```

5. **Itérer sur la qualité**
   ```
   ✅ "Cette note est trop technique, reformule de manière plus accessible"
   ```

### ❌ Éviter

1. **Être trop vague**
   ```
   ❌ "Crée des notes sur le réseau"
   → Trop large, Claude ne sait pas quoi créer
   ```

2. **Oublier de préciser le format**
   ```
   ❌ "Explique-moi le NAT"
   → Claude explique mais ne crée pas de note
   ```

3. **Demander de copier-coller sans reformulation**
   ```
   ❌ "Copie ce texte dans une note"
   → Viole le principe Zettelkasten (reformuler avec ses mots)
   ```

4. **Créer des notes non atomiques**
   ```
   ❌ "Crée une note avec tout sur le réseau TCP/IP"
   → Trop large, doit être atomisé
   ```

---

## 🔄 Workflow hebdomadaire recommandé

### Lundi : Capture et planification
```
1. Vider 0-Inbox/ avec Claude : /process-inbox
2. Planifier les notes de la semaine : /suggest-notes
```

### Mardi-Jeudi : Création de contenu
```
3. Créer 2-3 notes permanentes par session d'étude
4. Utiliser /create-note et /atomize
```

### Vendredi : Connexion et organisation
```
5. Enrichir les liens : /find-links sur notes récentes
6. Mettre à jour les MOCs : /update-moc
7. Audit qualité : /audit sur 3-5 notes
```

### Dimanche : Révision et consolidation
```
8. Parcourir le graphe Obsidian
9. Identifier les zones à développer
10. Préparer la capture de la semaine suivante
```

---

## 🎯 Métriques de succès

Suivez ces indicateurs pour évaluer la qualité de votre Zettelkasten :

1. **Atomicité** : Chaque note = 1 seul concept
2. **Connexions** : Moyenne de 3-5 liens par note permanente
3. **Orphelins** : Moins de 5% de notes orphelines
4. **Croissance** : 5-10 notes permanentes par semaine
5. **MOCs** : 1 MOC pour 15-20 notes sur un sujet
6. **Inbox** : 0-Inbox/ vidé chaque semaine

---

## 📚 Ressources complémentaires

- [[CLAUDE.md]] - Conventions et structure du vault
- [[GUIDE-MIGRATION.md]] - Migrer vos anciens contenus
- [[README]] - Vue d'ensemble du système
- [[INDEX]] - Point d'entrée du Zettelkasten

---

## 💡 Conseils avancés

### Utiliser Claude pour la recherche sémantique
Claude peut lire et analyser tout votre vault. Utilisez cela :
```
"Trouve toutes mes notes qui mentionnent des protocoles de routage dynamique"
"Quel est le concept le plus lié dans mon vault ?"
"Quelles notes n'ont pas de liens ?"
```

### Générer des questions de révision
```
"Génère 5 questions de révision basées sur ma note [[NAT]]"
"Crée un quiz sur mes notes de réseau"
```

### Détecter les incohérences
```
"Y a-t-il des contradictions entre mes notes [[NAT]] et [[PAT]] ?"
"Mes notes sur OSPF sont-elles cohérentes avec celle sur routage dynamique ?"
```

### Reformuler pour clarifier
```
"Reformule cette note de manière plus concise"
"Explique ce concept comme si j'avais 10 ans"
"Ajoute un exemple concret à cette note"
```

---

**Dernière mise à jour** : 2025-11-11
