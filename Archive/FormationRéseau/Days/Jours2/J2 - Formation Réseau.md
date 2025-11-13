---
date: 2025-10-08
tags:
  - Jours2
  - Réseau
  - Informatique
---
# Classification des Réseaux

Réseau | ID

xxxx | xxxx   xxxx   xxxx -> Classe A
xxxx   xxxx | xxxx   xxxx -> Classe B
xxxx   xxxx   xxxx | xxxx -> Classe C

classe D -> Multicast

 Spécificité:
- Classe A:
	- 0.0.0.0 route par défault
	- 127.0.0.0 loop
- Classe B :
	- Les deux bits les plus à gauche = 10xx xxxx
- Classe C:
	- Les trois bits les plus à gauche = 110x xxxx

Adresses privées :
- Classe A -> 10.0.0.1 à 10.255.255.254
- Classe B -> 172.16.0.1 à 172.31.255.254
- Classe C -> 192.168.0.1 à 192.168.255.254

Plus on augmente la partie réseau : Plus on réduit le domaine de collision de données

# Ports

- 1 -> 1023 : les ports connus (well known) RÉSERVÉS
- 1024 -> 49 150 : ports enregistrés (REGISTERED) distribués par l'IANA
- 49 152 -> 65 535 : ports dynamiques/privés/éphémères

Les ports sont utilisés dans la partie "application" du système OSI. 

Utile notamment pour le NAT (Network Address Translation)
![[0-Inbox/FormationRéseau/Days/Jours2/Ex NAT.canvas]]

# TP
![[0-Inbox/FormationRéseau/Days/Jours2/TP1.canvas]]
Parefeu : pfsense

>[!NOTE]
>Pour qu'un appareil depuis l'extérieur puisse accéder à la page web d'un pc, le router fait un PAT (Port Address Translation). PC1 <-> port8081, PC2 <-> port8082, PC3 <-> port8083...
>Les flux tcp entre le serveur web et le client extérieur au réseau sont encapsulés 

