# Démonstration du système d'actions Claude Client

Ce fichier montre comment utiliser le nouveau système d'actions avec boutons de confirmation dans le plugin Claude Client.

## Format pour créer/éditer un fichier

Lorsque Claude veut créer ou modifier une note, il doit utiliser ce format :

````markdown
```edit:1-Permanent/Ma Note.md
---
type: permanent
created: 2025-11-16 14:30
tags:
  - tag1
  - tag2
---

# Ma Note

Contenu de la note...
```
````

Le plugin détectera automatiquement ce bloc et affichera :
- 📝 **Édition de fichier** : `1-Permanent/Ma Note.md`
- Le contenu dans un bloc de code
- Boutons **✓ Confirmer et exécuter** et **✗ Ignorer**

## Format pour exécuter une commande

Pour exécuter une commande bash :

````markdown
```bash:execute
ls -la 1-Permanent/
```
````

Ou avec le mot-clé `command:` :

````markdown
```command:
git status
```
````

Le plugin affichera :
- ⚡ **Commande**
- Le code de la commande
- Boutons de confirmation

## Exemple de conversation complète

**Vous :** Peux-tu créer une note permanente sur le protocole DHCP ?

**Claude :** Bien sûr ! Voici une note atomique sur le protocole DHCP :

````markdown
```edit:1-Permanent/DHCP - Dynamic Host Configuration Protocol.md
---
type: permanent
created: 2025-11-16 14:50
tags:
  - réseau
  - dhcp
  - protocole
---

# DHCP - Dynamic Host Configuration Protocol

DHCP est un protocole réseau qui automatise l'attribution des adresses IP et des paramètres réseau aux machines d'un réseau.

## Processus DORA

1. **Discover** : Le client diffuse une requête pour trouver un serveur DHCP
2. **Offer** : Le serveur propose une configuration IP
3. **Request** : Le client demande formellement cette configuration
4. **Acknowledge** : Le serveur confirme l'attribution

## Avantages

- Gestion centralisée des adresses IP
- Évite les conflits d'adresses
- Configuration automatique des clients
- Facilite la mobilité des appareils

## Liens

Voir aussi [[IP Addressing]] et [[Subnetting]]
```
````

→ Un bloc d'action apparaît avec les boutons Confirmer/Ignorer

---

## Tester le système

1. **Recharger Obsidian** : `Ctrl+R` (ou `Cmd+R` sur Mac)
2. **Ouvrir le plugin** : Cliquer sur l'icône 💬 dans la sidebar
3. **Poser une question** qui nécessite une action :
   - "Peux-tu créer une note permanente sur TCP ?"
   - "Liste les fichiers dans 1-Permanent/"
   - "Crée une nouvelle note sur le subnetting"

4. **Vérifier** que les blocs d'action apparaissent avec les boutons

## Sécurité

✅ **Sécurisé** :
- Toutes les actions nécessitent une confirmation manuelle
- Aucune exécution automatique
- Feedback visuel sur le statut (en cours, succès, erreur)

⚠️ **Attention** :
- Les commandes bash s'exécutent dans le répertoire du vault
- Vérifiez toujours le contenu avant de confirmer
- Les modifications de fichiers sont permanentes

## Statuts possibles

- ⏳ **Exécution...** : L'action est en cours
- ✓ **Exécuté avec succès** : L'action s'est terminée correctement
- ✗ **Erreur : [message]** : Une erreur s'est produite
- ⊘ **Ignoré** : Vous avez choisi d'ignorer cette action

---

**Version** : 1.1.0
**Date** : 2025-11-16
