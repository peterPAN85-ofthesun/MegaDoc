---
type: permanent
created: 2026-09-26 10:50
tags:
  - permanent
  - mathematiques
  - geometrie
  - vecteurs
---

# MATH - produit scalaire

> [!abstract] Concept
> Le produit scalaire $\vec{u} \cdot \vec{v}$ associe à deux vecteurs un **nombre** qui mesure leur alignement : $\|\vec{u}\| \|\vec{v}\| \cos\theta$, nul exactement quand les vecteurs sont orthogonaux.

## Explication

Deux écritures équivalentes coexistent, et c'est leur équivalence qui fait la puissance de l'outil. L'écriture **analytique** se calcule à partir des coordonnées, l'écriture **géométrique** donne le sens :

$$\vec{u} \cdot \vec{v} = u_x v_x + u_y v_y + u_z v_z = \|\vec{u}\| \|\vec{v}\| \cos\theta$$

Le résultat est un **scalaire**, pas un vecteur — d'où le nom. Son signe se lit directement : positif si les vecteurs pointent grossièrement dans la même direction ($\theta < 90°$), négatif s'ils s'opposent, **nul si et seulement s'ils sont orthogonaux** ($\cos 90° = 0$). Attention au piège fréquent : un produit scalaire nul signifie perpendiculaire, et non « opposé » — pour deux vecteurs strictement opposés, le produit scalaire est au contraire **minimal**, égal à $-\|\vec{u}\| \|\vec{v}\|$.

L'interprétation physique canonique est le **travail d'une force** : $W = \vec{F} \cdot \vec{d}$. Seule la part de la force alignée avec le déplacement travaille ; une force perpendiculaire au mouvement ne produit aucun travail. C'est la même idée que la projection : $\vec{u} \cdot \vec{v}$ vaut la longueur de la projection de $\vec{u}$ sur la direction de $\vec{v}$, multipliée par $\|\vec{v}\|$.

Le produit scalaire est **commutatif** ($\vec{u} \cdot \vec{v} = \vec{v} \cdot \vec{u}$), bilinéaire, et fournit la norme : $\|\vec{u}\|^{2} = \vec{u} \cdot \vec{u}$. C'est ce que conservent les matrices orthogonales, et c'est le terme scalaire qui apparaît dans le produit de deux quaternions.

<svg viewBox="0 0 420 210" width="100%" style="max-width:420px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Produit scalaire : projection de u sur v et angle theta">
<defs>
<marker id="psA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#4c9aff"/></marker>
<marker id="psB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#f2994a"/></marker>
</defs>
<line x1="80" y1="160" x2="340" y2="160" stroke="#f2994a" stroke-width="2.2" marker-end="url(#psB)"/>
<text x="346" y="164" font-size="14" fill="#f2994a" font-style="italic">v</text>
<line x1="80" y1="160" x2="238" y2="62" stroke="#4c9aff" stroke-width="2.2" marker-end="url(#psA)"/>
<text x="244" y="56" font-size="14" fill="#4c9aff" font-style="italic">u</text>
<line x1="244" y1="66" x2="244" y2="160" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 4" opacity="0.8"/>
<path d="M 232 148 L 232 160 L 244 160" fill="none" stroke="currentColor" stroke-width="1" opacity="0.7"/>
<path d="M 128 160 A 48 48 0 0 0 110 130" fill="none" stroke="currentColor" stroke-width="1.4"/>
<text x="118" y="140" font-size="13" fill="currentColor" font-style="italic">θ</text>
<line x1="80" y1="182" x2="244" y2="182" stroke="#27ae60" stroke-width="2"/>
<line x1="80" y1="176" x2="80" y2="188" stroke="#27ae60" stroke-width="1.4"/>
<line x1="244" y1="176" x2="244" y2="188" stroke="#27ae60" stroke-width="1.4"/>
<text x="120" y="200" font-size="12" fill="#27ae60">‖u‖ cos θ  (projection de u sur v)</text>
<circle cx="80" cy="160" r="3" fill="currentColor"/>
<text x="16" y="28" font-size="12" fill="currentColor">u · v = ‖u‖ ‖v‖ cos θ  —  un nombre, pas un vecteur</text>
<text x="16" y="46" font-size="11" fill="currentColor" opacity="0.75">nul ⟺ vecteurs perpendiculaires ; minimal (négatif) ⟺ vecteurs opposés</text>
</svg>

## Exemples

### Exemple 1 — test d'orthogonalité
$\vec{u}(1, 2, 0)$ et $\vec{v}(-2, 1, 5)$ : $1 \times (-2) + 2 \times 1 + 0 \times 5 = 0$, donc $\vec{u} \perp \vec{v}$ — sans calculer un seul angle.

### Exemple 2 — éclairage diffus
Un moteur 3D calcule l'intensité d'une surface par $\max(\vec{n} \cdot \vec{l}, 0)$, avec $\vec{n}$ la normale et $\vec{l}$ la direction de la lumière, tous deux unitaires. Face à la lumière : $1$. De profil : $0$. Dos à la lumière : négatif, écrêté à $0$.

## Cas d'usage

- **Mesurer un angle** entre deux directions : $\theta = \arccos \frac{\vec{u} \cdot \vec{v}}{\|\vec{u}\| \|\vec{v}\|}$.
- **Éclairage et visibilité** : loi de Lambert, test de face avant / face arrière d'un triangle.
- **Projeter un vecteur** sur une direction, base des moindres carrés et de la décomposition en composantes.

## Connexions

### Notes liées
- [[MATH - produit vectoriel]] - l'autre produit, qui mesure l'orthogonalité plutôt que l'alignement
- [[MATH - produit de Hamilton]] - le produit scalaire y fournit la partie réelle
- [[MATH - matrice orthogonale (inverse par transposition)]] - les matrices qui conservent ce produit
- [[MATH - projection (application linéaire idempotente)]] - la projection orthogonale s'exprime par produit scalaire

### Dans le contexte de
- [[MOC - Mathématiques]] - fait partie de ce domaine

## Ressources

- Source : [[Projecteur (Mathématiques)]]

---

**Tags thématiques** : `#mathematiques` `#geometrie` `#vecteurs`
