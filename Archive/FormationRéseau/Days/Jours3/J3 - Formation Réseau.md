---
date: 2025/10/09
tags:
  - Réseau
  - Informatique
  - Jours3
---

# VLAN

*Virtual Local Area Network*

Compartimenter un switch en plusieurs sous réseaux, pour réduire le domaine de diffusion.

```cli-cisco
conf t

vlan 10 name MonVlan             #créé le vlan10

interface fa0/10
switchport mode access vlan 10    #active le vlan10 pour le port fa0/10
```


La trame réseau, une fois entrée dans par le port VLAN, se voit assigner un flag (un PVID : Port Vlan ID). Se PVID ne suit la trame que part le port TRUNK du switch, pour permettre d'identifier au sein du réseau quels sont les appareils qui appartiennent au VLAN.


![[0-Inbox/FormationRéseau/Days/Jours3/TP2.canvas]]

```cli-cisco
enable

conf t
interfaces fa0/0
no ip address             #on supprime l'adresse ip existante
interfaces fa0/0.10       #on ajoute une sous interface au niveau L3 et on entre dedans
encapsulation dot1q 10    #on associe le flag 10 (PVID) à l'interface
ip address 192.168.10.254 255.255.255.0    #on ajoute l'adresse ip dans la sous interface

en  #on sort de l'environnement sous-interfaces

interfaces fa0/0.20
encapsulation dot1q 20
ip address 192.168.20.254 255.255.255.0

*etc...*

end
show interface fa0/0   #voir les détails de la sous interface (L2)
```

# ACL :
*Access Control List*

-> Condition d'accès (nommées ou numérotées)
2 Types :
- Standard (1 - 99)
- Extended (1 - 199)

Bloque (Deny) ou permet (Permit) le transfert de l'information

```cli-cisco
conf t

access-list 2(: ex acl type) deny host 192.168.10.1
access-list 2 permt
int f0/0
ip access-group 2 [in/out]

end

show access-list 
```

>[!IMPORTANT]
>Approfondir ACL !!!!



