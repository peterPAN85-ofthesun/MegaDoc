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

<svg viewBox="0 0 440 250" width="100%" style="max-width:440px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Router on a stick : un lien trunk unique entre switch et routeur, avec une sous-interface par VLAN">
<rect x="250" y="40" width="170" height="130" rx="6" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="290" y="60" font-size="12" fill="currentColor">ROUTEUR — Gi0/0</text>
<rect x="266" y="72" width="140" height="26" rx="4" fill="#4c9aff" fill-opacity="0.12" stroke="#4c9aff" stroke-width="1.2"/>
<text x="274" y="89" font-size="10.5" fill="#4c9aff">Gi0/0.10 — 192.168.10.254</text>
<rect x="266" y="104" width="140" height="26" rx="4" fill="#f2994a" fill-opacity="0.12" stroke="#f2994a" stroke-width="1.2"/>
<text x="274" y="121" font-size="10.5" fill="#f2994a">Gi0/0.20 — 192.168.20.254</text>
<rect x="266" y="136" width="140" height="26" rx="4" fill="#27ae60" fill-opacity="0.12" stroke="#27ae60" stroke-width="1.2"/>
<text x="274" y="153" font-size="10.5" fill="#27ae60">Gi0/0.30 — 192.168.30.254</text>
<text x="258" y="184" font-size="10" fill="currentColor" opacity="0.75">sous-interfaces logiques = passerelles</text>
<rect x="30" y="86" width="120" height="38" rx="5" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="46" y="110" font-size="12" fill="currentColor">SWITCH L2</text>
<line x1="150" y1="105" x2="250" y2="105" stroke="currentColor" stroke-width="4"/>
<text x="158" y="96" font-size="11" fill="currentColor">un seul câble</text>
<text x="158" y="122" font-size="10" fill="#27ae60">trunk 802.1Q — VLAN 10, 20, 30</text>
<line x1="52" y1="124" x2="52" y2="168" stroke="#4c9aff" stroke-width="1.6"/>
<line x1="90" y1="124" x2="90" y2="168" stroke="#f2994a" stroke-width="1.6"/>
<line x1="128" y1="124" x2="128" y2="168" stroke="#27ae60" stroke-width="1.6"/>
<text x="34" y="182" font-size="10" fill="#4c9aff">v10</text>
<text x="76" y="182" font-size="10" fill="#f2994a">v20</text>
<text x="114" y="182" font-size="10" fill="#27ae60">v30</text>
<path d="M 200 200 C 240 214 300 214 340 200" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.7"/>
<text x="176" y="228" font-size="11" fill="currentColor" opacity="0.8">le trafic inter-VLAN monte au routeur et redescend par le même câble</text>
<text x="16" y="22" font-size="12" fill="currentColor">« routeur sur un bâton » : une interface physique, N sous-interfaces</text>
</svg>

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
