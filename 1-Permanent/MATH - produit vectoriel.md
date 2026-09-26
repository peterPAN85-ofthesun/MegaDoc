---
type: permanent
created: 2026-09-26 10:55
tags:
  - permanent
  - mathematiques
  - geometrie
  - vecteurs
---

# MATH - produit vectoriel

> [!abstract] Concept
> Le produit vectoriel $\vec{u} \wedge \vec{v}$ produit un **vecteur** orthogonal aux deux opérandes, de norme égale à l'aire du parallélogramme qu'ils déterminent, et nul exactement quand ils sont colinéaires.

## Explication

Le produit vectoriel de $\vec{u}(u_x, u_y, u_z)$ et $\vec{v}(v_x, v_y, v_z)$ se calcule en coordonnées par :

$$\vec{w} = \vec{u} \wedge \vec{v} = \begin{pmatrix} u_y v_z - u_z v_y \\ u_z v_x - u_x v_z \\ u_x v_y - u_y v_x \end{pmatrix}, \qquad \|\vec{u} \wedge \vec{v}\| = \|\vec{u}\| \|\vec{v}\| \sin\theta$$

Trois propriétés définissent son comportement. Le vecteur $\vec{w}$ est **toujours orthogonal** aux deux vecteurs de départ ; son sens est donné par la règle de la main droite, ce qui fait du produit vectoriel une notion propre aux repères orientés. Sa **norme vaut l'aire** du parallélogramme construit sur $\vec{u}$ et $\vec{v}$ — d'où son apparition partout où une surface ou un moment intervient. Enfin, le produit de deux vecteurs **colinéaires est nul** par définition, puisque le parallélogramme est alors aplati.

Le comportement est en miroir de celui du produit scalaire : ce dernier est maximal quand les vecteurs sont alignés et nul quand ils sont perpendiculaires ; le produit vectoriel est nul quand ils sont alignés et maximal quand ils sont perpendiculaires. De là le critère : deux vecteurs sont orthogonaux si et seulement si $\|\vec{u} \wedge \vec{v}\| = \|\vec{u}\| \|\vec{v}\|$.

Point crucial pour la suite : le produit vectoriel est **anticommutatif**, $\vec{u} \wedge \vec{v} = - \vec{v} \wedge \vec{u}$. C'est précisément ce terme qui, dans le produit de deux quaternions, brise la commutativité — et c'est cette non-commutativité qui permet aux quaternions de représenter des rotations, dont la composition dépend elle aussi de l'ordre.

<svg viewBox="0 0 420 250" width="100%" style="max-width:420px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Produit vectoriel : vecteur orthogonal et aire du parallélogramme">
<defs>
<marker id="pvA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#4c9aff"/></marker>
<marker id="pvB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#f2994a"/></marker>
<marker id="pvC" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#27ae60"/></marker>
</defs>
<polygon points="150,185 290,205 350,170 210,150" fill="#f2994a" fill-opacity="0.18" stroke="#f2994a" stroke-width="1" stroke-dasharray="4 3"/>
<text x="244" y="196" font-size="11" fill="#f2994a">aire = ‖u ∧ v‖</text>
<line x1="150" y1="185" x2="284" y2="204" stroke="#4c9aff" stroke-width="2.2" marker-end="url(#pvA)"/>
<text x="290" y="220" font-size="14" fill="#4c9aff" font-style="italic">u</text>
<line x1="150" y1="185" x2="204" y2="153" stroke="#f2994a" stroke-width="2.2" marker-end="url(#pvB)"/>
<text x="206" y="146" font-size="14" fill="#f2994a" font-style="italic">v</text>
<line x1="150" y1="185" x2="150" y2="60" stroke="#27ae60" stroke-width="2.4" marker-end="url(#pvC)"/>
<text x="158" y="62" font-size="14" fill="#27ae60" font-style="italic">w = u ∧ v</text>
<path d="M 150 170 L 164 172 L 162 186" fill="none" stroke="currentColor" stroke-width="1" opacity="0.7"/>
<path d="M 150 170 L 138 176 L 142 188" fill="none" stroke="currentColor" stroke-width="1" opacity="0.7"/>
<text x="16" y="26" font-size="12" fill="currentColor">w est orthogonal à u et à v ; sa norme vaut l'aire du parallélogramme</text>
<text x="16" y="44" font-size="11" fill="currentColor" opacity="0.75">nul ⟺ vecteurs colinéaires  ·  anticommutatif : v ∧ u = −w</text>
<text x="16" y="232" font-size="11" fill="currentColor" opacity="0.75">sens donné par la règle de la main droite : la notion dépend de l'orientation du repère</text>
</svg>

## Exemples

### Exemple 1 — la base canonique
$$\vec{i} \wedge \vec{j} = \vec{k}, \qquad \vec{j} \wedge \vec{k} = \vec{i}, \qquad \vec{k} \wedge \vec{i} = \vec{j}, \qquad \vec{j} \wedge \vec{i} = -\vec{k}$$
Ce cycle est exactement la table de multiplication des imaginaires purs d'un quaternion.

### Exemple 2 — normale d'un triangle
Pour un triangle de sommets $A$, $B$, $C$, le vecteur $\vec{AB} \wedge \vec{AC}$ donne la normale à sa surface, et sa norme le double de l'aire du triangle. C'est le calcul de base de l'éclairage et du tri des faces en rendu 3D.

## Cas d'usage

- **Calculer une normale** de surface à partir de deux arêtes.
- **Construire un repère orthonormé** : à partir de deux directions, le produit vectoriel fournit le troisième axe.
- **Mécanique** : moment d'une force $\vec{M} = \vec{r} \wedge \vec{F}$, force de Lorentz, vitesse d'un point en rotation.

## Avantages et limites

✅ **Avantages** :
- Fournit d'un coup une direction orthogonale et une aire
- Test de colinéarité immédiat (résultat nul)

❌ **Limites** :
- Spécifique à la dimension $3$ (et $7$) : pas d'équivalent direct en dimension quelconque
- Anticommutatif et non associatif : l'ordre et le parenthésage comptent
- Dépend de l'orientation du repère : change de sens en repère indirect

## Connexions

### Notes liées
- [[MATH - produit scalaire]] - le produit complémentaire, maximal là où celui-ci s'annule
- [[MATH - produit de Hamilton]] - le produit vectoriel y fournit la partie imaginaire et la non-commutativité
- [[MATH - quaternion (définition et structure)]] - la table $ij = k$ est le cycle du produit vectoriel
- [[MATH - matrices de rotation autour des axes]] - l'ordre cyclique $\vec{i} \to \vec{j} \to \vec{k}$ y explique les signes

### Dans le contexte de
- [[MOC - Mathématiques]] - fait partie de ce domaine

## Ressources

- Source : [[Projecteur (Mathématiques)]]

---

**Tags thématiques** : `#mathematiques` `#geometrie` `#vecteurs`
