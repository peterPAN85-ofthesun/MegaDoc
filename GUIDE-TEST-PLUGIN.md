# Guide de test - Claude Client Plugin v2.0.0

Ce guide vous permet de tester que le plugin suit bien la philosophie Zettelkasten.

## 🔄 Étape 1 : Recharger Obsidian

**Action requise** : Rechargez Obsidian
- Windows/Linux : `Ctrl+R`
- macOS : `Cmd+R`

✅ Le plugin devrait se recharger avec la nouvelle version 2.0.0

---

## 📝 Scénario 1 : Question sur concept existant

### Test : Recherche dans le vault d'abord

**Vous tapez** :
```
Comment fonctionne le protocole DHCP ?
```

### ✅ Réponse attendue (comportement correct)

```
🔍 Recherche dans vos notes permanentes...

D'après votre note [[DHCP - Dynamic Host Configuration]], DHCP est un
protocole qui automatise l'attribution des adresses IP et des paramètres
réseau aux machines d'un réseau.

Votre note [[DHCP Relay Agent]] explique comment un relay DHCP permet de
transmettre les requêtes DHCP entre différents sous-réseaux.

Pour la configuration pratique :
- Sur Cisco : [[DHCP Cisco - Configuration de base]]
- Sur Linux : [[DHCP Linux - Installation et configuration]]

📚 Notes connexes à consulter :
- [[DHCP Cisco - Multi-VLAN]]
- [[DHCP - snooping protection]]
- [[DHCP Cisco - Relay Agent]]

💡 Votre vault contient 11 notes sur DHCP, couvrant concepts,
configuration Cisco et Linux. Y a-t-il un aspect spécifique que
vous souhaitez approfondir ?
```

### ❌ Réponse incorrecte (ancien comportement)

```
DHCP (Dynamic Host Configuration Protocol) est un protocole réseau
qui permet d'attribuer automatiquement des adresses IP...
[réponse générique sans citation de vos notes]
```

**Critères de validation** :
- ✅ Commence par "🔍 Recherche dans vos notes..."
- ✅ Cite explicitement les notes avec [[Wiki-links]]
- ✅ Fait le lien entre plusieurs notes du vault
- ✅ Suggère des notes connexes
- ✅ Distingue connaissance du vault vs générale

---

## 📝 Scénario 2 : Demande de création de note

### Test : Scanner avant créer

**Vous tapez** :
```
Peux-tu créer une note permanente sur le protocole SSH ?
```

### ✅ Réponse attendue (comportement correct)

```
🔍 Vérification dans 1-Permanent/...

J'ai scanné votre dossier de notes permanentes et je n'ai pas trouvé
de note existante sur SSH (Secure Shell).

Voici une proposition de note permanente atomique sur SSH :

---

**Titre proposé** : `SSH - Secure Shell.md`
**Emplacement** : `1-Permanent/`

**Contenu suggéré** :

```markdown
---
type: permanent
created: 2025-11-16 16:00
tags:
  - réseau
  - sécurité
  - protocole
---

# SSH - Secure Shell

SSH est un protocole réseau cryptographique permettant de se connecter
de manière sécurisée à une machine distante pour exécuter des commandes
ou transférer des fichiers.

## Caractéristiques principales

- **Chiffrement** : Communication cryptée de bout en bout
- **Authentification** : Par mot de passe ou clé publique/privée
- **Port par défaut** : 22
- **Remplacement de Telnet** : Élimine les transmissions en clair

## Exemple d'utilisation

```bash
ssh user@hostname
ssh -i ~/.ssh/my_key user@hostname
```

## Connexions

- [[Port Forwarding]] → SSH permet le tunneling sécurisé
- [[DMZ - Zone démilitarisée]] → Accès sécurisé depuis DMZ
- Voir aussi votre [[MOC - Réseau]] pour contexte
```
---

**Suggestions de tags** : `#réseau`, `#sécurité`, `#protocole`

**Vérification atomicité** : ✅ Un seul concept (SSH)
**Connexions suggérées** : 2 liens vers notes existantes
**Concision** : ✅ 3 paragraphes

📝 **Action requise** :
1. Créez manuellement le fichier `1-Permanent/SSH - Secure Shell.md`
2. Copiez le contenu suggéré ci-dessus
3. Ajoutez cette note à votre [[MOC - Réseau]] si pertinent

Souhaitez-vous que je vérifie s'il existe d'autres notes connexes ?
```

### ❌ Réponse incorrecte

```
```edit:1-Permanent/SSH - Secure Shell.md
[création automatique du fichier sans vérification ni validation]
```
```

**Critères de validation** :
- ✅ Scanner 1-Permanent/ d'abord
- ✅ Indiquer résultat de la recherche
- ✅ Proposer contenu en markdown simple (pas `edit:`)
- ✅ Frontmatter correct
- ✅ Suggestions de connexions avec notes existantes
- ✅ Demander validation / action manuelle

---

## 📝 Scénario 3 : Enrichissement de note existante

### Test : Enrichir plutôt que créer

**Vous tapez** :
```
Peux-tu créer une note sur le Port Forwarding ?
```

### ✅ Réponse attendue (comportement correct)

```
🔍 Vérification dans 1-Permanent/...

✅ **Note existante trouvée** : [[Port Forwarding]]

J'ai trouvé que vous avez déjà une note permanente sur le Port Forwarding
dans votre vault. Plutôt que créer un doublon, je vous suggère de l'enrichir.

**Contenu actuel de votre note** :
- ✅ Principe du port forwarding
- ✅ Exemple concret
- ✅ Cas d'usage
- ✅ Lien avec NAT
- ✅ Section sécurité

**Suggestions d'enrichissement** :

Vous pourriez ajouter à votre note existante :

### Exemples de configuration

**Sur routeur Cisco** :
```
ip nat inside source static tcp 192.168.1.100 8080 interface GigabitEthernet0/0 80
```

**Sur Linux (iptables)** :
```bash
iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 192.168.1.100:8080
```

### Connexions supplémentaires suggérées

- [[NAT Cisco - Port forwarding]] → Configuration Cisco détaillée
- [[NAT Linux - Port forwarding]] → Configuration Linux détaillée
- [[DMZ - Zone démilitarisée]] → Utilisation en DMZ

💡 **Recommandation** :
Votre note actuelle est déjà bien structurée et atomique. Les exemples
de configuration ci-dessus enrichiraient la section pratique.

Voulez-vous que j'examine d'autres aspects du port forwarding non
couverts dans votre note ?
```

### ❌ Réponse incorrecte

```
Je vais créer une nouvelle note sur le port forwarding...
[ignore la note existante]
```

**Critères de validation** :
- ✅ Détecte note existante
- ✅ Suggère enrichissement au lieu de création
- ✅ Analyse le contenu actuel
- ✅ Propose ajouts complémentaires
- ✅ Suggère connexions pertinentes

---

## 📝 Scénario 4 : Question sur concept non couvert

### Test : Transparence sur l'absence d'information

**Vous tapez** :
```
Comment fonctionne le protocole QUIC ?
```

### ✅ Réponse attendue (comportement correct)

```
🔍 Recherche dans vos notes permanentes...

❌ Je n'ai pas trouvé de notes permanentes sur le protocole QUIC dans
votre vault.

J'ai vérifié dans :
- 1-Permanent/ : Aucune note sur QUIC
- 2-Maps/MOC - Réseau.md : Pas de référence à QUIC
- Tags #réseau, #protocole : Aucune correspondance

**Information générale** (hors vault) :

QUIC (Quick UDP Internet Connections) est un protocole de transport
développé par Google, utilisé notamment par HTTP/3. Il combine les
avantages de TCP (fiabilité) et UDP (rapidité).

💡 **Suggestion** :

Souhaitez-vous créer une note permanente sur QUIC ? Je peux vous
proposer un contenu atomique qui s'intégrerait à votre [[MOC - Réseau]].

Cette note pourrait être liée à :
- [[TCP - Transmission Control Protocol]] (comparaison)
- [[UDP]] (protocole sous-jacent)
- Votre MOC réseau pour indexation

Voulez-vous que je génère une proposition de note ?
```

**Critères de validation** :
- ✅ Indique clairement l'absence dans le vault
- ✅ Mentionne où la recherche a été effectuée
- ✅ Distingue info générale vs vault
- ✅ Propose de créer note pour capturer connaissance
- ✅ Suggère connexions avec notes existantes

---

## 📝 Scénario 5 : Audit de note

### Test : Analyse selon critères Zettelkasten

**Action** :
1. Ouvrir une note permanente (ex: `DHCP - Dynamic Host Configuration.md`)
2. Cliquer sur le bouton "📝 Analyser note"

### ✅ Réponse attendue

```
🔍 AUDIT DE QUALITÉ ZETTELKASTEN

Note auditée : DHCP - Dynamic Host Configuration
Emplacement : 1-Permanent/

## Score global : 78/100

┌────────────────────────────────────────┐
│ ███████████████░░░░░ 78/100            │
└────────────────────────────────────────┘

## Détail par critère

### ✅ Atomicité : 28/30
**Évaluation** : Excellent
**Commentaire** : Note bien focalisée sur le protocole DHCP uniquement.
Un seul concept atomique clairement défini.

### ✅ Clarté : 22/25
**Évaluation** : Très bien
**Commentaire** : Explication claire du processus DORA. Bons exemples.
Quelques termes techniques pourraient être explicités.

### ⚠️ Connexions : 15/25
**Évaluation** : Moyen
**Commentaire** : Seulement 2 liens directs détectés.

**Connexions existantes** :
- [[IP Addressing]]
- [[Subnetting]]

**Connexions manquantes suggérées** :
- [[DHCP Relay Agent]] (vous avez cette note !)
- [[DHCP Cisco - Configuration de base]] (configuration pratique)
- [[DHCP - snooping protection]] (sécurité)
- [[DNS - Domain Name System]] (protocole complémentaire)

### ✅ Autonomie : 9/10
**Évaluation** : Excellent
**Commentaire** : Note compréhensible indépendamment.

### ⚠️ Concision : 4/10
**Évaluation** : À améliorer
**Commentaire** : ~400 mots, un peu long pour une note atomique.
Pourrait être plus dense.

## Problèmes identifiés

🟡 **Important** :
- Manque de connexions avec autres notes DHCP du vault
- Note un peu trop longue (devrait être ~200 mots)

🟢 **Mineur** :
- Quelques termes pourraient être explicités

## Actions recommandées

**Priorité 1** (faire maintenant) :
1. Ajouter liens vers vos notes connexes :
   - [[DHCP Relay Agent]]
   - [[DHCP Cisco - Configuration de base]]
   - [[DHCP - snooping protection]]

**Priorité 2** (prochaine révision) :
2. Condenser le contenu (cible : 250 mots max)
3. Vérifier présence dans [[MOC - Réseau]]

**Priorité 3** (optionnel) :
4. Ajouter schéma du processus DORA

## Comparaison vault

- **Moyenne de vos notes réseau** : 74/100
- **Cette note** : 78/100 ✅ Au-dessus de la moyenne

## Conclusion

Cette note est **bonne** mais pourrait être excellente avec plus
de connexions vers vos autres notes DHCP.

**Temps estimé pour améliorations prioritaires** : 10 minutes

Voulez-vous que je vous aide à identifier toutes les notes DHCP
de votre vault pour enrichir les connexions ?
```

**Critères de validation** :
- ✅ Score /100 avec détail par critère
- ✅ Pondération correcte (30+25+25+10+10)
- ✅ Suggestions basées sur notes existantes du vault
- ✅ Actions priorisées concrètes
- ✅ Comparaison avec moyenne vault

---

## 📝 Scénario 6 : Commande bash

### Test : Boutons de confirmation

**Vous tapez** :
```
Liste toutes mes notes sur VLAN
```

### ✅ Réponse attendue

```
Pour lister vos notes VLAN, je vais utiliser une commande :

[BLOC D'ACTION APPARAÎT]

⚡ Commande

ls -1 1-Permanent/ | grep -i vlan

[Boutons : ✓ Confirmer et exécuter | ✗ Ignorer]
```

**Après avoir cliqué "Confirmer"** :

```
[Statut : ⏳ Exécution...]

[Puis : ✓ Exécuté avec succès]

Résultat :

802.1Q - tagging VLAN.md
VLAN Cisco - Configuration switch.md
VLAN Cisco - Port trunk et 802.1Q.md
VLAN Cisco - Router on a stick.md
VLAN Cisco - Sécurisation.md
VLAN Cisco - Switch Layer 3.md
VLAN Cisco - Vérification et dépannage.md
VLAN Linux - Configuration interfaces.md
VLAN Linux - Routage inter-VLAN.md
VLAN - mode access vs trunk.md
VLAN - natif untagged.md
VLAN - router on a stick.md
VLAN - Virtual LAN.md
Types d'Encapsulation VLAN.md

📊 Vous avez **13 notes permanentes** sur les VLANs dans votre vault.

Ces notes couvrent :
- Concepts de base (VLAN, modes, encapsulation)
- Configuration Cisco (7 notes)
- Configuration Linux (2 notes)
- Techniques (router on a stick, tagging 802.1Q)

Toutes ces notes sont indexées dans votre [[MOC - Réseau]].

Voulez-vous que j'analyse la qualité de ces notes ou que je suggère
des connexions manquantes ?
```

**Critères de validation** :
- ✅ Bloc d'action avec boutons
- ✅ Statut visuel (⏳ → ✓)
- ✅ Résultat de la commande affiché
- ✅ Synthèse intelligente du résultat
- ✅ Suggestions de suivi

---

## ✅ Checklist de validation complète

### Philosophie Zettelkasten

- [ ] Le plugin cherche TOUJOURS dans 1-Permanent/ avant de répondre
- [ ] Les notes existantes sont citées avec [[Wiki-links]]
- [ ] Enrichissement proposé avant création de doublon
- [ ] Aucune création automatique de fichiers
- [ ] Demande de validation utilisateur systématique

### Qualité des réponses

- [ ] Distinction claire vault vs connaissance générale
- [ ] Format "🔍 Recherche dans vos notes..." présent
- [ ] Suggestions de connexions basées sur notes existantes
- [ ] Respect atomicité dans suggestions (1 concept = 1 note)
- [ ] Frontmatter correct dans suggestions

### Actions et commandes

- [ ] Boutons "Confirmer" / "Ignorer" fonctionnels
- [ ] Statut visuel des actions (⏳ → ✓ → ✗)
- [ ] Pas de format `edit:fichier.md` dans réponses
- [ ] Format `bash:execute` et `command:` fonctionne

### Audit de notes

- [ ] Score /100 calculé correctement
- [ ] 5 critères évalués (Atomicité, Clarté, Connexions, Autonomie, Concision)
- [ ] Suggestions basées sur notes existantes
- [ ] Actions prioritaires concrètes

---

## 🐛 Si un test échoue

### Le plugin ne cite pas les notes existantes

**Cause probable** : Contexte du vault non chargé

**Solution** :
1. Cliquer sur "📚 Charger vault"
2. Attendre confirmation "Contexte chargé"
3. Réessayer la question

### Le plugin suggère de créer un doublon

**Cause probable** : Nom de note différent

**Vérification** :
```bash
ls -1 1-Permanent/ | grep -i "terme_recherché"
```

### Les boutons d'action ne s'affichent pas

**Cause probable** : Format incorrect dans réponse

**Vérification** : La réponse doit contenir :
````
```bash:execute
commande
```
````

---

## 📊 Résultats attendus

Après avoir effectué tous les tests, le plugin devrait :

✅ Respecter strictement la philosophie "Enrichir avant créer"
✅ Toujours chercher dans le vault d'abord
✅ Citer les notes existantes explicitement
✅ Ne jamais créer de fichiers automatiquement
✅ Demander validation pour toutes actions
✅ Suivre les principes Zettelkasten (atomicité, connexions, concision)

---

**Date** : 2025-11-16
**Version testée** : 2.0.0
**Statut** : ✅ Prêt pour test
