---
type: permanent
created: 2026-08-11 00:00
tags:
  - permanent
  - réseau
  - routage
  - ip
---

# Table de routage

> [!abstract] Concept
> La table de routage est la structure de données interne d'un routeur (ou d'un hôte) qui associe des réseaux de destination à un prochain saut (next-hop) ou une interface de sortie.

## Explication

Chaque équipement capable de router (routeur, mais aussi un PC ou serveur) maintient une table de routage. Pour chaque paquet à envoyer, le système compare l'IP de destination aux entrées de la table et sélectionne la route **la plus spécifique** (masque le plus long, principe du *longest prefix match*).

Les entrées peuvent être ajoutées de plusieurs façons : manuellement ([[ROUTAGE - statique|routage statique]]), automatiquement via un protocole de routage dynamique (RIP, OSPF), ou directement liées aux réseaux connectés à une interface active du routeur.

## Exemples

```
Destination        Masque           Next-hop         Interface
192.168.1.0        255.255.255.0    Connecté         eth0
10.0.0.0           255.0.0.0        192.168.1.254    eth0
0.0.0.0            0.0.0.0          192.168.1.254    eth0    (route par défaut)
```

Commande pour consulter la table de routage :
```
ip route show      # Linux
route print         # Windows
show ip route       # Cisco IOS
```

## Cas d'usage

- Diagnostic de problèmes de connectivité réseau (route manquante ou incorrecte)
- Vérification qu'une route statique a bien été appliquée
- Compréhension du chemin emprunté par un paquet avant d'utiliser `traceroute`

## Connexions

### Notes liées
- [[ROUTAGE - statique]] - Méthode pour peupler manuellement cette table
- [[Route par défaut]] - Entrée particulière de la table de routage
- [[RIP - Routing Information Protocol]] - Peuple la table dynamiquement
- [[OSPF - Open Shortest Path First]] - Peuple la table dynamiquement

### Contexte
Concept central du routage IP : comprendre la table de routage est un préalable à toute configuration de routage statique ou dynamique.

## Sources
- [[ROUTAGE - statique]]
- [[J1 - Formation Réseau|Formation Réseau - Jour 1]]

---
**Tags thématiques** : #réseau #routage #ip
