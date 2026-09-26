---
type: permanent
created: 2026-09-26 10:30
tags:
  - permanent
  - mathematiques
  - geometrie
  - 3d
---

# MATH - matrices de rotation autour des axes

> [!abstract] Concept
> Toute rotation 3D se décompose en rotations élémentaires autour des trois axes du repère $O(\vec{i}, \vec{j}, \vec{k})$, chacune décrite par une matrice $3 \times 3$ qui laisse son axe invariant et fait tourner le plan perpendiculaire.

## Explication

Une rotation élémentaire fixe un axe et agit comme une rotation plane sur les deux autres coordonnées. La structure est donc toujours la même : une ligne et une colonne d'identité pour l'axe conservé, et un bloc $\begin{pmatrix} \cos & -\sin \\ \sin & \cos \end{pmatrix}$ pour le plan qui tourne. Dans un repère direct, avec les angles mesurés dans le sens trigonométrique vu depuis l'extrémité positive de l'axe :

$$R_{\vec{i}}(\alpha) = \begin{pmatrix} 1 & 0 & 0 \\ 0 & \cos\alpha & -\sin\alpha \\ 0 & \sin\alpha & \cos\alpha \end{pmatrix} \quad R_{\vec{j}}(\beta) = \begin{pmatrix} \cos\beta & 0 & \sin\beta \\ 0 & 1 & 0 \\ -\sin\beta & 0 & \cos\beta \end{pmatrix} \quad R_{\vec{k}}(\gamma) = \begin{pmatrix} \cos\gamma & -\sin\gamma & 0 \\ \sin\gamma & \cos\gamma & 0 \\ 0 & 0 & 1 \end{pmatrix}$$

Le signe inversé de $R_{\vec{j}}$ n'est pas une erreur : il vient de l'ordre cyclique des axes $\vec{i} \to \vec{j} \to \vec{k} \to \vec{i}$. La rotation autour de $\vec{j}$ agit sur le plan $(\vec{k}, \vec{i})$ **dans cet ordre**, et l'écrire dans l'ordre habituel $(\vec{i}, \vec{k})$ retourne les signes.

Ces matrices s'insèrent telles quelles comme bloc $R_{3\times 3}$ d'une matrice homogène $4 \times 4$, ce qui permet de les composer avec des translations. Leur produit n'est **pas commutatif** : $R_{\vec{i}}(\alpha) R_{\vec{k}}(\gamma) \neq R_{\vec{k}}(\gamma) R_{\vec{i}}(\alpha)$. Une orientation 3D n'est donc jamais définie par trois angles seuls — il faut aussi préciser l'ordre dans lequel on les applique, ce qui est tout l'objet des conventions d'angles d'Euler.

Propriétés communes : $\det R = 1$, colonnes orthonormées, et surtout $R^{-1} = R^{T}$. Une rotation conserve les longueurs, les angles et l'orientation — c'est une isométrie directe, élément du groupe $SO(3)$.

<svg viewBox="0 0 420 250" width="100%" style="max-width:420px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Rotations élémentaires autour des trois axes du repère">
<defs>
<marker id="rtF" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker>
<marker id="rtA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#4c9aff"/></marker>
<marker id="rtB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#f2994a"/></marker>
<marker id="rtC" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#27ae60"/></marker>
</defs>
<line x1="200" y1="160" x2="200" y2="52" stroke="currentColor" stroke-width="1.8" marker-end="url(#rtF)"/>
<text x="206" y="50" font-size="13" fill="currentColor" font-style="italic">k</text>
<line x1="200" y1="160" x2="352" y2="182" stroke="currentColor" stroke-width="1.8" marker-end="url(#rtF)"/>
<text x="358" y="188" font-size="13" fill="currentColor" font-style="italic">j</text>
<line x1="200" y1="160" x2="86" y2="222" stroke="currentColor" stroke-width="1.8" marker-end="url(#rtF)"/>
<text x="70" y="234" font-size="13" fill="currentColor" font-style="italic">i</text>
<circle cx="200" cy="160" r="3" fill="currentColor"/>
<text x="206" y="176" font-size="12" fill="currentColor" font-style="italic">O</text>
<path d="M 158 74 A 44 16 0 1 1 238 80" fill="none" stroke="#27ae60" stroke-width="1.8" marker-end="url(#rtC)"/>
<text x="246" y="80" font-size="13" fill="#27ae60" font-style="italic">γ</text>
<text x="256" y="94" font-size="10" fill="#27ae60" opacity="0.9">autour de k</text>
<path d="M 318 210 A 40 16 0 1 1 340 156" fill="none" stroke="#f2994a" stroke-width="1.8" marker-end="url(#rtB)"/>
<text x="346" y="150" font-size="13" fill="#f2994a" font-style="italic">β</text>
<text x="330" y="232" font-size="10" fill="#f2994a" opacity="0.9">autour de j</text>
<path d="M 128 248 A 40 16 0 1 1 78 200" fill="none" stroke="#4c9aff" stroke-width="1.8" marker-end="url(#rtA)"/>
<text x="56" y="196" font-size="13" fill="#4c9aff" font-style="italic">α</text>
<text x="28" y="180" font-size="10" fill="#4c9aff" opacity="0.9">autour de i</text>
<text x="16" y="26" font-size="12" fill="currentColor">chaque rotation laisse son axe fixe et fait tourner le plan perpendiculaire</text>
</svg>

## Exemples

### Exemple 1 — quart de tour autour de $\vec{k}$
Avec $\gamma = \frac{\pi}{2}$, on a $\cos\gamma = 0$ et $\sin\gamma = 1$ :

$$R_{\vec{k}}\left( \frac{\pi}{2} \right) \begin{pmatrix} 1 \\ 0 \\ 0 \end{pmatrix} = \begin{pmatrix} 0 \\ 1 \\ 0 \end{pmatrix}$$

Le vecteur $\vec{i}$ est bien envoyé sur $\vec{j}$.

### Exemple 2 — la non-commutativité en pratique
Poser un livre à plat, le tourner de $90°$ autour de la verticale puis le basculer de $90°$ vers l'avant ne donne pas la même orientation finale que l'inverse. C'est la manifestation directe de $AB \neq BA$.

## Cas d'usage

- **Orienter un objet ou une caméra** dans une scène 3D à partir d'angles lisibles par un humain.
- **Décomposer une orientation mesurée** (centrale inertielle, gyroscope) selon les trois axes.
- **Construire une matrice d'Euler** par produit de trois rotations élémentaires.

## Avantages et limites

✅ **Avantages** :
- Paramètres directement interprétables (un angle par axe)
- Inversion gratuite par transposition
- S'intègrent sans adaptation dans une matrice homogène $4 \times 4$

❌ **Limites** :
- Non-commutativité : l'ordre de composition doit être documenté
- Blocage de cardan quand deux axes s'alignent
- $9$ coefficients pour $3$ degrés de liberté, et dérive numérique à l'accumulation

## Connexions

### Notes liées
- [[MATH - matrice orthogonale (inverse par transposition)]] - la propriété qui rend l'inversion triviale
- [[MATH - matrice de transformation affine 4x4]] - où ce bloc $3 \times 3$ vient se loger
- [[MATH - angles d'Euler]] - la composition ordonnée de ces trois rotations
- [[MATH - rotation par conjugaison de quaternion]] - l'autre représentation des rotations, sans blocage de cardan

### Dans le contexte de
- [[MOC - Mathématiques]] - fait partie de ce domaine
- [[Godot Csharp - Rotation caméra FPS]] - mise en œuvre concrète dans un moteur

## Ressources

- Source : [[Projecteur (Mathématiques)]]

---

**Tags thématiques** : `#mathematiques` `#geometrie` `#3d`
