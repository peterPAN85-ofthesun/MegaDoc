---
type: permanent
created: 2026-09-26 11:25
tags:
  - permanent
  - mathematiques
  - quaternions
  - 3d
---

# MATH - rotation par conjugaison de quaternion

> [!abstract] Concept
> Un quaternion unitaire $q = \cos\frac{\alpha}{2} + \vec{u} \sin\frac{\alpha}{2}$ encode la rotation d'angle $\alpha$ autour de l'axe unitaire $\vec{u}$, et l'applique à un vecteur par l'opération de conjugaison $\vec{v'} = q \vec{v} q^{-1}$.

## Explication

Un quaternion **unitaire** (de norme $1$) porte exactement l'information d'une rotation. Sa partie réelle code l'angle, sa partie imaginaire l'axe :

$$q = w + xi + yj + zk = \cos\left( \frac{\alpha}{2} \right) + \vec{u} \sin\left( \frac{\alpha}{2} \right), \qquad \|\vec{u}\| = 1$$

L'angle se relit dans les deux sens à partir des composantes : $\alpha = 2\arccos w = 2\arcsin \sqrt{ x^{2} + y^{2} + z^{2} }$. Le facteur $2$ et le **demi-angle** ne sont pas une convention arbitraire : ils viennent du fait que le quaternion intervient **deux fois** dans la conjugaison, une fois à gauche et une fois à droite, et que chaque passage fait tourner de $\frac{\alpha}{2}$.

Appliquer la rotation à un vecteur $\vec{v}$ (vu comme quaternion imaginaire pur) se fait par l'**action de conjugaison** :

$$\vec{v'} = q \vec{v} q^{-1} = \left( \cos\frac{\alpha}{2} + \vec{u}\sin\frac{\alpha}{2} \right) \vec{v} \left( \cos\frac{\alpha}{2} - \vec{u}\sin\frac{\alpha}{2} \right)$$

Le facteur de droite est bien $q^{-1}$ : pour un quaternion unitaire, l'inverse est le conjugué, qui change le signe de la partie vectorielle. Cet encadrement garantit que le résultat reste un imaginaire pur — donc un vecteur — et que sa norme est préservée.

<svg viewBox="0 0 420 250" width="100%" style="max-width:420px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Rotation d'un vecteur autour d'un axe u par un angle alpha">
<defs>
<marker id="qFg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker>
<marker id="qA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#4c9aff"/></marker>
<marker id="qB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#f2994a"/></marker>
<marker id="qC" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#27ae60"/></marker>
</defs>
<ellipse cx="150" cy="150" rx="120" ry="30" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" opacity="0.45"/>
<line x1="150" y1="190" x2="150" y2="58" stroke="#4c9aff" stroke-width="2" marker-end="url(#qA)"/>
<text x="158" y="60" font-size="14" fill="#4c9aff" font-style="italic">u</text>
<text x="158" y="76" font-size="11" fill="#4c9aff">axe de rotation</text>
<line x1="150" y1="190" x2="264" y2="152" stroke="#f2994a" stroke-width="2" marker-end="url(#qB)"/>
<text x="272" y="154" font-size="14" fill="#f2994a" font-style="italic">v</text>
<line x1="150" y1="190" x2="207" y2="128" stroke="#27ae60" stroke-width="2" marker-end="url(#qC)"/>
<text x="196" y="118" font-size="14" fill="#27ae60" font-style="italic">v'</text>
<path d="M 270 150 A 120 30 0 0 0 210 124" fill="none" stroke="currentColor" stroke-width="1.5"/>
<text x="238" y="120" font-size="14" fill="currentColor" font-style="italic">α</text>
<circle cx="150" cy="190" r="3" fill="currentColor"/>
<text x="130" y="206" font-size="13" fill="currentColor" font-style="italic">O</text>
<line x1="150" y1="150" x2="264" y2="152" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3" opacity="0.5"/>
<text x="20" y="228" font-size="12" fill="currentColor" opacity="0.8">La pointe de v décrit un cercle autour de u : v' = q v q⁻¹ conserve la norme et l'angle à l'axe.</text>
</svg>

Deux conséquences importantes. D'abord, $q$ et $-q$ décrivent **la même rotation** : le signe s'annule entre les deux facteurs de la conjugaison. La correspondance quaternions unitaires → rotations est donc un revêtement double. Ensuite, composer deux rotations revient à multiplier les quaternions, $q_2 q_1$, sans jamais repasser par des angles.

En pratique, cette action de conjugaison revient à convertir le quaternion en une **matrice orthogonale** $R$ par la formule de conversion, puis à multiplier cette matrice par la colonne du vecteur — plus efficace dès qu'il y a plusieurs vecteurs à traiter :

$$R = \begin{pmatrix} a^{2}+b^{2}-c^{2}-d^{2} & 2bc-2ad & 2ac+2bd \\ 2ad+2bc & a^{2}-b^{2}+c^{2}-d^{2} & 2cd-2ab \\ 2bd-2ac & 2ab+2cd & a^{2}-b^{2}-c^{2}+d^{2} \end{pmatrix} \quad \text{pour } q = a + bi + cj + dk, \ \|q\| = 1$$

> [!info] Démonstration — pourquoi $q^{-1} = \cos\frac{\alpha}{2} - \vec{u}\sin\frac{\alpha}{2}$
> On part de la formule générale de l'inverse, avec $\vec{v} = \vec{u}\sin\left( \frac{\alpha}{2} \right)$ :
> $$\left( \cos\frac{\alpha}{2} + \vec{u}\sin\frac{\alpha}{2} \right)^{-1} = \frac{\cos\frac{\alpha}{2} - \vec{u}\sin\frac{\alpha}{2}}{\cos^{2}\frac{\alpha}{2} + \|\vec{u}\|^{2} \sin^{2}\frac{\alpha}{2}}$$
> Or $\vec{u}$ est unitaire, donc $\|\vec{u}\| = 1$ : il ne reste au dénominateur que $\cos^{2}\frac{\alpha}{2} + \sin^{2}\frac{\alpha}{2} = 1$.
> **Conclusion** : $q^{-1} = \cos\frac{\alpha}{2} - \vec{u}\sin\frac{\alpha}{2} = q^{*}$.

## Exemples

### Exemple 1 — un quart de tour autour de $\vec{k}$
Pour $\alpha = 90°$ : $\frac{\alpha}{2} = 45°$, donc $q = \frac{\sqrt{2}}{2} + \frac{\sqrt{2}}{2} k$. Sa partie réelle $w = \frac{\sqrt{2}}{2}$ redonne bien $\alpha = 2\arccos\frac{\sqrt{2}}{2} = 90°$.

### Exemple 2 — l'identité et son opposé
$q = 1$ (soit $\alpha = 0$) ne fait rien. $q = -1$ correspond à $\alpha = 360°$ : la même rotation, atteinte par l'autre côté du revêtement double.

## Cas d'usage

- **Orienter une caméra ou un objet** sans blocage de cardan.
- **Interpoler entre deux orientations** par slerp, le long du plus court chemin sur la sphère unité.
- **Fusionner des mesures inertielles** (gyroscope, accéléromètre) dans un filtre d'attitude.

## Avantages et limites

✅ **Avantages** :
- Pas de blocage de cardan, contrairement aux angles d'Euler
- Composition et inversion très peu coûteuses
- Renormalisation simple quand les erreurs s'accumulent

❌ **Limites** :
- Le demi-angle et la double couverture ($q$ et $-q$) déroutent
- Appliquer directement la conjugaison à un seul vecteur coûte plus cher qu'une matrice
- Aucune lecture intuitive des composantes, à la différence d'un angle d'Euler

## Connexions

### Notes liées
- [[MATH - quaternion (définition et structure)]] - la structure $q = a + \vec{v}$ exploitée ici
- [[MATH - conjugué, norme et inverse d'un quaternion]] - pourquoi $q^{-1} = q^{*}$ dans le cas unitaire
- [[MATH - produit de Hamilton]] - le produit utilisé deux fois dans la conjugaison
- [[MATH - matrice orthogonale (inverse par transposition)]] - la matrice produite par la conversion
- [[MATH - angles d'Euler]] - la représentation concurrente, sujette au blocage de cardan
- [[MATH - quaternion vs matrice de rotation (coûts)]] - quand préférer l'une ou l'autre

### Dans le contexte de
- [[MOC - Mathématiques]] - fait partie de ce domaine

## Ressources

- Source : [[Projecteur (Mathématiques)]]

---

**Tags thématiques** : `#mathematiques` `#quaternions` `#3d`
