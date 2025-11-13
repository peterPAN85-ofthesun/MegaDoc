---
date: 2025-10-07
tags:
  - Jours1
  - Informatique
  - Réseau
---
__
# Commande Windows

>[!NOTE]
>Sur Windows :
```dos
ipconfig         #Informations normales
ipconfig /all    #informations supplémentaires
ipconfig /release  #libère les interfaces
ipconfig /
arp -a           #Table ARP (ip/mac)
arp -d           #vider le cache de la table arp
route print      #affiche le routage
tracert 192.168.1.55 #trouver la route la plus courte
netstat -a       #regarder l'état des ports
netstat -ab      #regarder l'états des ports suivant l'executable qui les utilises
```


# Commandes CLI Cisco
```
en -> privilégié
end -> à la racine
exit -> quitter
show mac-address-table
show ip
show interfaces
show ? -> montre tous les arguments

conf t
ip route IPdest mask IPnextJump -> ajouter un point de routage

IPdest : réseau de destination (ex :192.168.1.0)
IPnextJump : interface de la machine qui doit traiter le signal
```

# Ping
```bash
PING google.com (2a00:1450:4007:806::200e) 56 octets de données
64 octets de par21s18-in-x0e.1e100.net (2a00:1450:4007:806::200e) : icmp_seq=4 ttl=112 temps=52.7 ms
64 octets de par21s18-in-x0e.1e100.net (2a00:1450:4007:806::200e) : icmp_seq=5 ttl=112 temps=80.3 ms
64 octets de par21s18-in-x0e.1e100.net (2a00:1450:4007:806::200e) : icmp_seq=6 ttl=112 temps=64.5 ms
```

>[!NOTE]
>TTL Time To Live: 
>- Temps qu'il faut avant que le réseau ne kill le pacquet
>
>ICMP :
>- protocole de ping-pong

Dans un ping se cache un tram Arp, qui permet de mettre en relation l'adresse Mac (L2) avec l'adresse IP (L3)
Arp est un protocole Broadcast (envoie la requête sur tout le réseau) : 255.255.255.255

# IP

| adresses                      | descriptions                            |
| ---------------------------- | -------------------------------------- |
| 192.168.1.0                  | adresse du réseau                      |
| 192.168.1.1 ou 192.168.1.254 | adresse de la passerelle (CONVENTION!) |
| 192.168.1.255                | adresse broadcast                      |
|                              |                                        |
|                              |                                        |

Dans un réseau c'est le routeur qui a le control sur les paquet de niveau 3

Le switch quant à lui travail essentiellement sur les adresses MAC (L2)


**RIP**  : Protocole de routage à *vecteur de distance* (calcul avec le moins de saut)
**OSPF** : Protocole de routage en fonction de la rapidité des liaisons

![[Assets/Reseau/Ex1.canvas]]

Dans cet exemple le routage static pour que chaque PC puisse communique l'un avec l'autre
router 1 :
- 192.168.10.0/24 via 192.168.20.2
- 192.168.40.0/24 via 192.168.30.2
router 2:
- 192.168.40.0/24 via 192.168.20.1
- 192.168.30.0/24 via 192.168.20.1
router 3:
- 192.168.10.0/24 via 192.168.30.1
- 192.168.20.0/24 via 192.168.30.1

# Multicast

Le multicast est compris entre 224.0.0.0 et 239.0.0.0

émetteur -----> switch --------> nb x abonnés

Multicast possible grâce à IGMP : protocole d'intéraction entre les hosts de notre LAN et l'interface du router qui va gérer les démarches d'abonnements aux flux multicasts. 

Dans les switchs L3 : IGMP natif
Dans les switchs L2 : IGMP sm


2 Modes :
- Spase Mode (on dissocie la machine qui gère l'abonnement IGMP et la machine qui lance les flux multicast)


Logiciel : GNS