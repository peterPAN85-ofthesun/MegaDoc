# Guide de Migration vers Zettelkasten

Ce guide vous aide à migrer progressivement vos coffres existants vers la structure Zettelkasten.

## 🎯 Stratégie de Migration

### Principe : Un coffre à la fois
Ne migrez **qu'un seul coffre** à la fois pour :
- Garder le contrôle du processus
- Apprendre la méthode progressivement
- Éviter la surcharge
- Tester ce qui fonctionne pour vous

### Ordre de migration recommandé

1. **Formation_Reseau** (le mieux structuré, bon pour apprendre)
2. **Git** (petit, concepts atomiques naturels)
3. **Cmake** ou **Apprendre le C** (techniques, bien définis)
4. **Format de Fichier** (référence)
5. **Unreal Engine** / **SonyMLS_X1** (projets spécifiques)

## 📋 Processus de Migration (Étape par Étape)

### Étape 1 : Préparation (15 min)
```bash
# 1. Créer une branche de backup du coffre source
cd "Obsidian Vault/Formation_Reseau"
git checkout -b backup-formation-reseau

# 2. Créer un dossier temporaire de travail
mkdir ~/temp-migration
```

### Étape 2 : Inventaire (30 min - 1h)
Créez un fichier `INVENTAIRE.md` dans le coffre source :

```markdown
# Inventaire Formation_Reseau

## Notes de cours (Inbox)
- [ ] J1 - Formation Réseau.md
- [ ] J2 - Formation Réseau.md
- [ ] J3 - Formation Réseau.md

## Concepts techniques (Permanent)
- [ ] NAT et PAT.md
- [ ] VLANs.md
- [ ] Routage IP.md
- [ ] DHCP.md
- [ ] Filtrage Firewall.md
- [ ] Bridge.md

## Index (MOC)
- [ ] Glossaire.md → MOC - Glossaire Réseau.md
- [ ] HomePage.md → Intégrer dans MOC

## Autres
- [ ] Day Planners/ → Archiver
- [ ] Templates/ → Copier dans Templates/
- [ ] Fichiers canvas (.canvas) → Garder dans Assets/
```

### Étape 3 : Migration des Notes vers Inbox
**Exemple : J1 - Formation Réseau.md**

**AVANT** (structure actuelle) :
```markdown
---
date: 10/10/2025
tags:
  - Jours1
  - Réseau
---

# J1 - Formation Réseau

## Commandes Windows
ipconfig /all
arp -a

## Routage
RIP vs OSPF...
```

**APRÈS** (Note dans Inbox) :
1. Copier dans `0-Inbox/Formation Réseau - Jour 1.md`
2. Ajouter les métadonnées :
   ```yaml
   ---
   created: 2025-10-10
   source: "Formation Réseau - Jour 1"
   tags:
     - réseau
     - formation
   ---
   ```
3. **Important** : Identifier les concepts à extraire en Permanent notes

### Étape 4 : Extraction des Permanent Notes
**À partir des notes dans Inbox, extraire les concepts atomiques**

**Exemple 1 : Commande ipconfig**
```markdown
---
type: permanent
created: 2025-01-08
tags:
  - permanent
  - réseau
  - windows
  - diagnostic
---

# ipconfig - Configuration IP Windows

## Concept
`ipconfig` est la commande Windows pour afficher la configuration réseau de la machine (adresse IP, masque, passerelle, DNS).

## Utilisation
```bash
ipconfig /all    # Configuration complète
ipconfig /release # Libérer l'IP DHCP
ipconfig /renew   # Renouveler l'IP DHCP
```

## Contexte
Équivalent de `ifconfig` sous Linux. Première étape du diagnostic réseau.

## Connexions
- [[ARP - Address Resolution Protocol]]
- [[DHCP - Attribution dynamique IP]]
- [[Diagnostic réseau Windows]]

## Sources
- [[Formation Réseau - Jour 1]]
```

**Exemple 2 : Concept NAT**
```markdown
---
type: permanent
created: 2025-01-08
tags:
  - permanent
  - réseau
  - nat
  - protocole
---

# NAT - Network Address Translation

## Concept
Le NAT permet de traduire des adresses IP privées en adresse(s) IP publique(s) pour accéder à Internet. Une seule IP publique peut être partagée par plusieurs machines.

## Principe
1. Machine privée (192.168.1.10) envoie une requête
2. Routeur NAT remplace l'IP source par son IP publique
3. Réponse revient au routeur
4. Routeur retransmet à la machine privée

## Types
- **SNAT** (Source NAT) : modification de l'IP source
- **DNAT** (Destination NAT) : modification de l'IP destination
- **PAT** (Port Address Translation) : NAT + ports différents

## Avantages
- Économise les adresses IP publiques
- Sécurité par masquage des IPs internes

## Inconvénients
- Casse le principe end-to-end
- Problèmes avec certains protocoles (FTP, VoIP)

## Connexions
- [[PAT - Port Address Translation]]
- [[Adressage IP privé]]
- [[Routage IP]]
- Voir canvas : ![[Ex NAT.canvas]]

## Sources
- [[Formation Réseau - Jour 2]]
```

### Étape 5 : Création des MOCs
**Exemple : MOC - Réseau**

```markdown
---
type: moc
created: 2025-01-08
tags:
  - moc
  - index
  - réseau
---

# 🗺️ MOC - Fondamentaux Réseau

> [!note] Vue d'ensemble
> Cette carte rassemble les concepts fondamentaux du réseau informatique.

## 📚 Notes de cours
- [[Formation Réseau - Jour 1]]
- [[Formation Réseau - Jour 2]]
- [[Formation Réseau - Jour 3]]

## 🔧 Diagnostic et Commandes
### Windows
- [[ipconfig - Configuration IP Windows]]
- [[arp - Table ARP Windows]]
- [[tracert - Trace de route]]
- [[netstat - Statistiques réseau]]

### Cisco
- [[show mac-address-table]]
- [[show ip route]]

## 🌐 Protocoles
### Couche 3 (Réseau)
- [[IP - Internet Protocol]]
- [[ICMP - Messages de contrôle]]
- [[ARP - Address Resolution Protocol]]

### Routage
- [[Routage statique]]
- [[RIP - Routing Information Protocol]]
- [[OSPF - Open Shortest Path First]]

## 🔀 Traduction d'adresses
- [[NAT - Network Address Translation]]
- [[PAT - Port Address Translation]]

## 🏢 Segmentation réseau
- [[VLAN - Virtual LAN]]
- [[Bridge - Pont réseau]]
- [[Subnet - Sous-réseau]]

## 🛡️ Sécurité
- [[Filtrage Firewall]]
- [[ACL - Access Control Lists]]

## 📊 Services réseau
- [[DHCP - Attribution dynamique IP]]
- [[DNS - Domain Name System]]

## 📖 Glossaire
Voir [[Glossaire Réseau]] pour les définitions rapides.

---
**Dernière mise à jour** : 2025-01-08
```

### Étape 6 : Migration des Assets
```bash
# Copier les images et canvas
cp -r "Obsidian Vault/Formation_Reseau/04.Files/"* "../ObsidianZettle/Assets/"

# Vérifier que les liens d'images fonctionnent
# Les ![[image.png]] devraient s'afficher automatiquement
```

### Étape 7 : Vérification et Ajustement
1. **Ouvrir le nouveau coffre dans Obsidian**
2. **Vérifier dans Graph View** :
   - Les notes Permanent sont-elles liées ?
   - Y a-t-il des notes orphelines ?
3. **Tester les liens** :
   - Cliquer sur quelques liens pour vérifier
   - Les images/canvas s'affichent-ils ?
4. **Relire quelques notes** :
   - Sont-elles atomiques ?
   - Sont-elles compréhensibles seules ?

## 🎓 Exemples par Type de Coffre

### Formation_Reseau
- **J1, J2, J3** → Inbox
- **NAT, VLAN, DHCP** → Permanent Notes (concepts)
- **Commandes** → Permanent Notes (référence)
- **Glossaire** → MOC
- **Canvas** → Assets (liés dans notes)

### Git
- **Commits, Branches, Merge** → Permanent Notes
- **Commandes git** → Permanent Notes (référence)
- **Workflow** → Permanent Note
- **HomePage** → MOC - Git & Versioning

### Apprendre le C / Cmake
- **Concepts C** (pointeurs, malloc, etc.) → Permanent Notes
- **Syntaxe** → Permanent Notes (référence)
- **Librairies** → Inbox
- **Tips** → Permanent Notes ou Inbox

## ⚠️ Pièges à Éviter

1. **Ne pas tout migrer d'un coup** - Progressif !
2. **Ne pas copier-coller sans transformer** - Atomiser et réécrire
3. **Ne pas créer trop de tags** - Privilégier les liens
4. **Ne pas oublier de lier** - Chaque note doit avoir 2+ liens
5. **Ne pas garder la structure de dossiers** - Flat structure

## ✅ Checklist par Coffre

```markdown
## Migration de [NOM_COFFRE]

### Préparation
- [ ] Backup du coffre source (git branch)
- [ ] Inventaire créé
- [ ] Priorités définies

### Migration
- [ ] Literature notes créées
- [ ] Concepts extraits en Permanent notes
- [ ] Liens créés entre notes
- [ ] MOC créé pour le domaine
- [ ] Assets copiés
- [ ] Canvas intégrés

### Vérification
- [ ] Graph view vérifié (pas d'orphelins)
- [ ] Liens testés
- [ ] Images/canvas affichés
- [ ] Notes relues (atomicité)

### Finalisation
- [ ] Commit dans ObsidianZettle
- [ ] Coffre source archivé ou supprimé
- [ ] Notes sur ce qui a marché/pas marché
```

## 🚀 Commencer Maintenant

**Action immédiate** :
1. Choisissez le premier coffre (recommandé : Formation_Reseau)
2. Créez l'inventaire dans ce guide
3. Commencez par UNE note Literature
4. Extrayez 2-3 Permanent notes
5. Créez le MOC

**Durée estimée par coffre** :
- Petit coffre (Git) : 2-4h
- Moyen coffre (Formation_Reseau) : 6-10h
- Gros coffre : 10-20h

**Ne pas sous-estimer** : L'extraction et l'atomisation prennent du temps, mais c'est là que la valeur se crée !

---

**Besoin d'aide ?** Consultez `CLAUDE.md` pour les conventions et bonnes pratiques.
