---
type: permanent
created: 2025-01-08 01:57
tags:
  - permanent
  - réseau
  - vlan
  - routage
---

# Router on a stick

> [!abstract] Concept
> Architecture où un routeur route entre plusieurs VLANs via une seule interface physique avec des sous-interfaces logiques.

## Explication

"Routeur sur un bâton" : une seule connexion (le bâton) entre le switch et le routeur pour gérer tous les VLANs.

**Architecture** :
```
[Switch L2] ─(trunk)─ [Routeur]
VLANs 10,20,30         Gi0/0 (physique)
                        ├─ Gi0/0.10 (192.168.10.254)
                        ├─ Gi0/0.20 (192.168.20.254)
                        └─ Gi0/0.30 (192.168.30.254)
```

## Principe

**Côté Switch** :
- Port trunk transportant tous les VLANs
- Tagging 802.1Q

**Côté Routeur** :
- Une interface physique
- Une sous-interface par VLAN
- Chaque sous-interface = passerelle du VLAN

## Sous-interfaces

Format : `InterfacePhysique.NuméroVLAN`

Exemples :
- `GigabitEthernet0/0.10` → VLAN 10
- `GigabitEthernet0/0.20` → VLAN 20

Chaque sous-interface a :
- Encapsulation dot1Q (tagging)
- Adresse IP (passerelle du VLAN)

## Flux inter-VLAN

PC VLAN 10 → PC VLAN 20 :
1. PC envoie à sa passerelle (sous-interface .10)
2. Paquet arrive sur routeur
3. Routeur route vers sous-interface .20
4. Paquet repart vers switch
5. Switch transmet au PC VLAN 20

## Avantages

✅ Économique (1 seule interface routeur)
✅ Simple à configurer
✅ Adapté petits réseaux

## Inconvénients

❌ Goulot d'étranglement (1 seul lien)
❌ Performance limitée
❌ Si lien tombe, plus de routage

## Alternative

**Switch Layer 3** :
- Routage directement dans le switch
- Plus performant (ASIC matériel)
- Pas de goulot d'étranglement

## Connexions

- [[VLAN - Virtual LAN]] - Concept de base
- [[802.1Q - tagging VLAN]] - Protocole utilisé
- [[VLAN - mode access vs trunk]] - Port trunk nécessaire
- [[CISCO - sous-interfaces]] - Configuration

**Configuration** :
- [[MOC - Réseau]]

---
**Sources** : Fiche VLANs, [[J2 - Formation Réseau|Formation Réseau - Jour 2]]
