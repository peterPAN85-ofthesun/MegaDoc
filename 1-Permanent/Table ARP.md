---
type: permanent
created: 2026-08-11 00:00
tags:
  - permanent
  - réseau
  - arp
  - protocole
---

# Table ARP

> [!abstract] Concept
> La table ARP (ou cache ARP) est une mémoire temporaire stockant les associations entre adresses IP et adresses MAC découvertes sur le réseau local.

## Explication

Chaque machine maintient sa propre table ARP en mémoire vive. Lorsqu'une résolution ARP aboutit (requête + réponse), l'association IP ↔ MAC est stockée localement pour éviter de répéter un broadcast à chaque paquet envoyé vers la même destination.

Les entrées de la table ARP ont une **durée de vie limitée** (typiquement quelques minutes selon l'OS), après quoi elles expirent et doivent être renouvelées par une nouvelle requête ARP. Ce mécanisme de cache est ce qui rend ARP efficace au quotidien, mais aussi ce qui le rend vulnérable : une entrée peut être écrasée par une fausse réponse ARP (voir [[ARP spoofing]]).

## Exemples

```
IP Address        MAC Address          Type
192.168.1.1       00:11:22:33:44:55    dynamic
192.168.1.10      AA:BB:CC:DD:EE:FF    dynamic
```

### Consulter la table ARP sous Linux

```bash
arp -a           # Commande historique (paquet net-tools)
ip neigh show    # Commande moderne (paquet iproute2)
```

Sortie type avec `ip neigh show` :
```
192.168.1.1 dev eth0 lladdr 00:11:22:33:44:55 REACHABLE
192.168.1.10 dev eth0 lladdr aa:bb:cc:dd:ee:ff STALE
```

Le champ d'état (`REACHABLE`, `STALE`, `DELAY`, `FAILED`…) indique la fraîcheur de l'entrée dans le cache.

Vider ou supprimer une entrée :
```bash
ip neigh flush all              # Vide tout le cache
ip neigh del 192.168.1.10 dev eth0   # Supprime une entrée précise
```

### Consulter la table ARP sous Cisco IOS

```
Router# show ip arp
```

Sortie type :
```
Protocol  Address          Age (min)  Hardware Addr   Type   Interface
Internet  192.168.1.1             -   0011.2233.4455  ARPA   GigabitEthernet0/0
Internet  192.168.1.10           12   aabb.ccdd.eeff  ARPA   GigabitEthernet0/1
```

L'âge `-` signifie une entrée statique ou l'IP du routeur lui-même ; un âge en minutes indique une entrée dynamique apprise récemment.

Vider le cache ARP sur Cisco :
```
Router# clear ip arp
```

Ajouter une entrée statique (protection contre le spoofing) :
```
Router(config)# arp 192.168.1.10 aabb.ccdd.eeff arpa
```

## Cas d'usage

- Diagnostic réseau : vérifier qu'une machine a bien résolu l'IP d'un voisin
- Détection d'anomalies : une IP associée à deux MAC différentes en peu de temps peut signaler une attaque
- Base de la protection **Dynamic ARP Inspection (DAI)** sur switch Cisco

## Connexions

### Notes liées
- [[ARP - Address Resolution Protocol]] - Protocole qui alimente cette table
- [[ARP spoofing]] - Attaque qui corrompt le contenu de cette table
- [[DHCP - snooping protection]] - DAI s'appuie sur une table de binding similaire

### Contexte
Comprendre la table ARP séparément du protocole ARP permet d'isoler le concept de cache/mémoire de celui du mécanisme de requête/réponse, utile pour raisonner sur les attaques de type spoofing.

## Sources
- [[ARP - Address Resolution Protocol]]
- [[J1 - Formation Réseau|Formation Réseau - Jour 1]]

---
**Tags thématiques** : #réseau #arp #cache
