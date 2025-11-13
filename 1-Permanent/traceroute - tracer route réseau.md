---
type: permanent
created: 2025-01-08 19:45
tags:
  - permanent
  - réseau
  - diagnostic
  - icmp
  - ttl
---

# Traceroute

> [!abstract] Concept
> Traceroute affiche le chemin complet (tous les routeurs) emprunté par les paquets entre la source et la destination.

## Explication

Traceroute utilise le champ **TTL** (Time To Live) pour découvrir chaque routeur sur le chemin :

**Principe** :
1. Envoie paquet avec TTL=1 → 1er routeur répond "Time exceeded"
2. Envoie paquet avec TTL=2 → 2e routeur répond "Time exceeded"
3. Envoie paquet avec TTL=3 → 3e routeur répond "Time exceeded"
4. Continue jusqu'à atteindre destination

**Résultat** : Liste complète des routeurs traversés avec leur latence.

## Utilisation

**Linux** :
```bash
traceroute 8.8.8.8
traceroute -n 8.8.8.8           # Sans résolution DNS (plus rapide)
traceroute -m 20 8.8.8.8        # Max 20 hops
traceroute -I 8.8.8.8           # Utiliser ICMP au lieu d'UDP
```

**Windows** :
```cmd
tracert 8.8.8.8                 # Équivalent traceroute
tracert -d 8.8.8.8              # Sans résolution DNS
tracert -h 20 8.8.8.8           # Max 20 hops
```

**Cisco** :
```cisco
traceroute 8.8.8.8
traceroute ip 8.8.8.8
```

## Exemple de sortie

```
traceroute to 8.8.8.8 (8.8.8.8), 30 hops max, 60 byte packets
 1  192.168.1.1 (192.168.1.1)      1.234 ms  1.189 ms  1.156 ms
 2  10.0.0.1 (10.0.0.1)            5.678 ms  5.543 ms  5.421 ms
 3  203.0.113.1 (203.0.113.1)     12.345 ms 12.234 ms 12.123 ms
 4  * * *
 5  8.8.8.8 (8.8.8.8)             15.234 ms 15.123 ms 15.012 ms
```

**Interprétation** :
- Ligne 1 : 1er routeur (gateway locale)
- Ligne 2 : 2e routeur
- Ligne 3 : 3e routeur
- Ligne 4 : `* * *` = Timeout (routeur ne répond pas ou firewall)
- Ligne 5 : Destination atteinte

**3 mesures par hop** : 3 paquets envoyés pour statistiques

## Diagnostics courants

### Timeout (`* * *`)
Plusieurs causes possibles :
- Routeur configuré pour ne pas répondre aux ICMP
- Firewall bloque les réponses
- ❌ Ne signifie PAS forcément un problème

### Latence élevée soudaine
```
 5  router5.example.com          50.123 ms 49.876 ms 50.234 ms
 6  router6.example.com         150.456 ms 149.987 ms 150.123 ms  ← +100ms
```
→ Problème de performance entre hop 5 et 6

### Boucle de routage
```
 5  router5.example.com          10.123 ms
 6  router6.example.com          15.234 ms
 7  router5.example.com          20.345 ms  ← Déjà vu au hop 5
 8  router6.example.com          25.456 ms
```
→ Boucle entre router5 et router6

### Destination unreachable
```
 5  router5.example.com          10.123 ms
 6  * * *
 7  * * *
...
30  * * *
```
→ Pas de route après hop 5

## Variations

**Traceroute TCP** (utile si UDP/ICMP bloqués) :
```bash
tcptraceroute 8.8.8.8 80        # Via port TCP 80
```

**MTR** (My Traceroute - traceroute continu) :
```bash
mtr 8.8.8.8                     # Traceroute temps réel avec stats
```

**Paris Traceroute** (multipath) :
```bash
paris-traceroute 8.8.8.8        # Détecte load balancing
```

## Protocoles utilisés

**Linux** : UDP (ports hauts) par défaut
- Peut utiliser ICMP avec `-I`
- Peut utiliser TCP avec `tcptraceroute`

**Windows** : ICMP Echo Request

**Cisco** : UDP par défaut

## Limitations

❌ **Firewalls** : Bloquent souvent ICMP/UDP
❌ **Load balancing** : Peut montrer chemins différents à chaque paquet
❌ **Asymétrie** : Chemin aller ≠ chemin retour
❌ **Lenteur** : Timeout par hop (peut prendre 30+ secondes)

## Connexions

- [[TTL - Time To Live]] - Mécanisme exploité
- [[ICMP - Internet Control Message Protocol]] - Messages "Time exceeded"
- [[ping - tester connectivité réseau]] - Outil complémentaire (test connectivité)
- [[ROUTAGE - statique]] - Comprendre les routes
- [[Routage Cisco - Vérification et dépannage]] - Diagnostic routage

---
**Sources** : RFC 792 (ICMP), man traceroute, Cisco IOS Documentation
