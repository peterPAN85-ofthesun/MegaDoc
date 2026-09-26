---
type: permanent
created: 2026-09-26 11:30
tags:
  - permanent
  - mathematiques
  - geometrie
  - 3d
---

# MATH - angles d'Euler

> [!abstract] Concept
> Trois angles — précession $\psi$, nutation $\theta$, rotation propre $\varphi$ — suffisent à décrire n'importe quelle orientation d'un solide, en enchaînant trois rotations dont chacune ne fait varier qu'un angle.

## Explication

Les angles d'Euler paramètrent le passage du référentiel fixe $Oxyz$ au référentiel lié au solide $Ox'y'z'$ par trois rotations successives, chacune obtenue en gardant constants deux des trois angles :

1. **$\psi$ — précession**, autour de l'axe $z$ : elle amène $x \to u$ et $y \to v$.
2. **$\theta$ — nutation**, autour de l'axe $u$ : elle amène $v \to w$ et $z \to z'$.
3. **$\varphi$ — rotation propre**, autour de l'axe $z'$ : elle amène $u \to x'$ et $w \to y'$.

L'axe $Ou$, appelé **ligne des nœuds**, est porté par l'intersection des plans $Oxy$ et $Ox'y'$ — c'est la charnière commune aux deux référentiels, et c'est autour de lui que se fait le basculement.

<svg viewBox="0 0 440 265" width="100%" style="max-width:440px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Angles d'Euler : précession psi, nutation theta, rotation propre phi">
<defs>
<marker id="eFg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker>
<marker id="eA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#4c9aff"/></marker>
<marker id="eB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#f2994a"/></marker>
</defs>
<ellipse cx="180" cy="190" rx="130" ry="38" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" opacity="0.4"/>
<text x="42" y="222" font-size="11" fill="currentColor" opacity="0.7">plan Oxy</text>
<ellipse cx="180" cy="190" rx="130" ry="38" fill="none" stroke="#4c9aff" stroke-width="1" stroke-dasharray="4 4" opacity="0.6" transform="rotate(-28 180 190)"/>
<text x="300" y="120" font-size="11" fill="#4c9aff" opacity="0.9">plan Ox'y'</text>
<line x1="180" y1="190" x2="180" y2="48" stroke="currentColor" stroke-width="2" marker-end="url(#eFg)"/>
<text x="170" y="42" font-size="13" fill="currentColor" font-style="italic">z</text>
<line x1="180" y1="190" x2="92" y2="238" stroke="currentColor" stroke-width="1.6" marker-end="url(#eFg)"/>
<text x="76" y="252" font-size="13" fill="currentColor" font-style="italic">x</text>
<line x1="180" y1="190" x2="318" y2="205" stroke="currentColor" stroke-width="1.6" marker-end="url(#eFg)"/>
<text x="326" y="210" font-size="13" fill="currentColor" font-style="italic">y</text>
<line x1="180" y1="190" x2="248" y2="66" stroke="#4c9aff" stroke-width="2" marker-end="url(#eA)"/>
<text x="252" y="60" font-size="13" fill="#4c9aff" font-style="italic">z'</text>
<line x1="180" y1="190" x2="262" y2="243" stroke="#f2994a" stroke-width="2" marker-end="url(#eB)"/>
<text x="268" y="252" font-size="13" fill="#f2994a" font-style="italic">u</text>
<text x="252" y="234" font-size="10" fill="#f2994a" opacity="0.9">ligne des nœuds</text>
<path d="M 180 130 A 60 60 0 0 1 222 148" fill="none" stroke="currentColor" stroke-width="1.4"/>
<text x="206" y="128" font-size="13" fill="currentColor" font-style="italic">θ</text>
<path d="M 128 217 A 58 58 0 0 0 224 214" fill="none" stroke="#f2994a" stroke-width="1.4"/>
<text x="168" y="240" font-size="13" fill="#f2994a" font-style="italic">ψ</text>
<path d="M 232 102 A 55 55 0 0 1 258 140" fill="none" stroke="#4c9aff" stroke-width="1.4"/>
<text x="258" y="112" font-size="13" fill="#4c9aff" font-style="italic">φ</text>
<circle cx="180" cy="190" r="3" fill="currentColor"/>
<text x="162" y="206" font-size="13" fill="currentColor" font-style="italic">O</text>
</svg>

L'image classique est celle de la **toupie** : l'angle de nutation $\theta$ mesure l'obliquité de l'axe par rapport à la verticale, l'angle de précession $\psi$ mesure la rotation de cet axe autour de $Oz$, et l'angle de rotation propre $\varphi$ mesure la rotation de la toupie sur elle-même. Le vecteur rotation instantané du solide se décompose alors en une simple somme des trois contributions, portées respectivement par $\vec{z}$, $\vec{u}$ et $\vec{z'}$.

Le changement de référentiel s'exprime aussi par une **matrice de passage** $A$, produit des trois rotations élémentaires, telle que :

$$\begin{pmatrix} x \\ y \\ z \end{pmatrix} = A \begin{pmatrix} x' \\ y' \\ z' \end{pmatrix}$$

$$A = \begin{pmatrix} \cos\psi \cos\varphi - \sin\psi \cos\theta \sin\varphi & -\cos\psi \sin\varphi - \sin\psi \cos\theta \cos\varphi & \sin\psi \sin\theta \\ \sin\psi \cos\varphi + \cos\psi \cos\theta \sin\varphi & -\sin\psi \sin\varphi + \cos\psi \cos\theta \cos\varphi & -\cos\psi \sin\theta \\ \sin\theta \sin\varphi & \sin\theta \cos\varphi & \cos\theta \end{pmatrix}$$

Cette matrice est orthogonale : le passage inverse s'obtient par $A^{T}$. Sa dernière ligne et sa dernière colonne, les plus simples, portent toute l'information de nutation — ce qui en fait le bon point d'entrée pour extraire les angles d'une matrice donnée.

## Exemples

### Exemple 1 — la toupie
Une toupie lancée penchée : elle tourne vite sur son axe ($\varphi$ croît rapidement), son axe décrit lentement un cône autour de la verticale ($\psi$ croît lentement), et l'inclinaison de ce cône reste à peu près constante ($\theta$ fixe).

### Exemple 2 — le blocage de cardan
Lorsque $\theta = 0$, les axes $z$ et $z'$ se confondent : $\psi$ et $\varphi$ font alors tourner autour du **même** axe et deviennent indiscernables. Un degré de liberté est perdu, la matrice $A$ ne dépend plus que de $\psi + \varphi$ — c'est le *gimbal lock*, incident célèbre d'Apollo 11.

## Cas d'usage

- **Mécanique du solide** : équations du mouvement d'un gyroscope ou d'une toupie.
- **Aéronautique** : les angles de lacet, tangage et roulis sont une convention d'Euler ($z$-$y$-$x$).
- **Interfaces utilisateur** : exposer une orientation sous forme de trois angles lisibles, même si le moteur travaille en quaternions.

## Avantages et limites

✅ **Avantages** :
- Seulement trois paramètres, le minimum théorique pour une orientation
- Chaque angle a un sens physique immédiat et se règle indépendamment
- Correspond au vocabulaire des mécaniciens et des pilotes

❌ **Limites** :
- Blocage de cardan dès que deux axes s'alignent
- Une douzaine de conventions d'ordre incompatibles ($z$-$x$-$z$, $z$-$y$-$x$…) : préciser laquelle est impératif
- Interpolation entre deux orientations mal définie, contrairement au slerp des quaternions

## Connexions

### Notes liées
- [[MATH - matrices de rotation autour des axes]] - les trois rotations élémentaires composées ici
- [[MATH - rotation par conjugaison de quaternion]] - la représentation sans blocage de cardan
- [[MATH - matrice orthogonale (inverse par transposition)]] - pourquoi le passage inverse est $A^{T}$
- [[MATH - quaternion vs matrice de rotation (coûts)]] - le tableau comparatif où figure aussi l'axe-angle

### Dans le contexte de
- [[MOC - Mathématiques]] - fait partie de ce domaine
- [[Godot Csharp - Rotation caméra FPS]] - le blocage de cardan y est contourné en bornant le tangage

## Ressources

- Source : [[Projecteur (Mathématiques)]]

---

**Tags thématiques** : `#mathematiques` `#geometrie` `#3d`
