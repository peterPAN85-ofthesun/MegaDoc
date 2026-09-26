---
type: permanent
created: 2026-09-26 10:35
tags:
  - permanent
  - mathematiques
  - algebre-lineaire
  - 3d
---

# MATH - matrice orthogonale (inverse par transposition)

> [!abstract] Concept
> Une matrice $A$ est orthogonale quand $A \cdot A^{T} = I_{n}$ ; son inverse est donc sa transposée, ce qui rend l'annulation d'une rotation gratuite en calcul.

## Explication

La **transposée** $A^{T}$ s'obtient en échangeant lignes et colonnes : le coefficient en position $(i, j)$ devient celui en position $(j, i)$. C'est une opération purement combinatoire, sans aucune arithmétique — de simples lectures mémoire. La définition d'une matrice orthogonale exploite cela :

$$A \cdot A^{T} = I_{n} \iff A^{-1} = A^{T}$$

où $I_{n}$ est la matrice unité. Géométriquement, cette égalité dit que les colonnes de $A$ forment une **base orthonormée** : chacune est de norme $1$ et orthogonale aux autres. Une telle matrice conserve donc les produits scalaires, donc les longueurs et les angles : c'est une isométrie. Son déterminant vaut nécessairement $\pm 1$ — $+1$ pour les rotations (isométries directes, groupe $SO(n)$), $-1$ quand une réflexion est en jeu.

L'intérêt pratique est considérable. L'inversion d'une matrice quelconque $3 \times 3$ demande un déterminant, une comatrice et une division, avec les instabilités numériques qui vont avec ; pour une matrice orthogonale, il suffit de relire les coefficients dans l'autre sens, **sans une seule opération flottante**. C'est pourquoi on revient dans le repère d'origine, après une transformation, en multipliant par $R_{3\times 3}^{T}$.

Le revers est la fragilité de la propriété : après des dizaines de produits en virgule flottante, les colonnes cessent d'être exactement orthonormées, $A A^{T}$ s'éloigne de $I_{n}$, et la transposée n'est plus l'inverse. Il faut alors **réorthonormaliser** périodiquement la matrice (procédé de Gram-Schmidt ou renormalisation par quaternion).

<svg viewBox="0 0 420 220" width="100%" style="max-width:420px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Matrice orthogonale : base orthonormée conservée">
<defs>
<marker id="ooF" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker>
<marker id="ooA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#4c9aff"/></marker>
</defs>
<text x="16" y="26" font-size="12" fill="currentColor">les colonnes de A forment une base orthonormée : longueurs et angles droits préservés</text>
<line x1="120" y1="150" x2="120" y2="66" stroke="currentColor" stroke-width="2" marker-end="url(#ooF)"/>
<line x1="120" y1="150" x2="206" y2="166" stroke="currentColor" stroke-width="2" marker-end="url(#ooF)"/>
<line x1="120" y1="150" x2="66" y2="192" stroke="currentColor" stroke-width="2" marker-end="url(#ooF)"/>
<path d="M 120 132 L 138 135 L 135 152" fill="none" stroke="currentColor" stroke-width="1" opacity="0.7"/>
<path d="M 120 150 L 104 162 L 114 172" fill="none" stroke="currentColor" stroke-width="1" opacity="0.7"/>
<text x="126" y="62" font-size="12" fill="currentColor">‖c₃‖ = 1</text>
<text x="212" y="172" font-size="12" fill="currentColor">‖c₂‖ = 1</text>
<text x="30" y="206" font-size="12" fill="currentColor">‖c₁‖ = 1</text>
<line x1="250" y1="130" x2="300" y2="130" stroke="#4c9aff" stroke-width="1.6" marker-end="url(#ooA)"/>
<text x="252" y="120" font-size="12" fill="#4c9aff">A</text>
<line x1="300" y1="160" x2="250" y2="160" stroke="#4c9aff" stroke-width="1.6" marker-end="url(#ooA)"/>
<text x="286" y="180" font-size="12" fill="#4c9aff">Aᵀ</text>
<text x="308" y="150" font-size="13" fill="currentColor">A · Aᵀ = Iₙ</text>
<text x="308" y="170" font-size="12" fill="currentColor" opacity="0.8">donc A⁻¹ = Aᵀ</text>
</svg>

## Exemples

### Exemple 1 — vérification sur une rotation
$$R = \begin{pmatrix} \cos\gamma & -\sin\gamma \\ \sin\gamma & \cos\gamma \end{pmatrix}, \quad R \cdot R^{T} = \begin{pmatrix} \cos^{2}\gamma + \sin^{2}\gamma & 0 \\ 0 & \sin^{2}\gamma + \cos^{2}\gamma \end{pmatrix} = I_{2}$$

L'identité $\cos^{2} + \sin^{2} = 1$ est exactement ce qui fait fonctionner la propriété.

### Exemple 2 — défaire un changement de repère
Après avoir amené un objet dans le repère caméra par $R$, on revient dans le repère monde par $R^{T}$ — au lieu d'inverser une matrice $3 \times 3$ générale.

## Cas d'usage

- **Inverser une rotation** sans calcul, dans une boucle de rendu ou de physique.
- **Changer de repère dans les deux sens** (monde ↔ objet, monde ↔ caméra).
- **Tester la validité d'une matrice de rotation** : vérifier que $A A^{T}$ reste proche de $I_{n}$.

## Avantages et limites

✅ **Avantages** :
- Inversion en coût nul, sans division ni risque de matrice singulière
- Conserve longueurs et angles, donc pas de déformation parasite

❌ **Limites** :
- Propriété perdue progressivement par accumulation d'erreurs flottantes
- Ne s'applique qu'aux isométries : dès qu'il y a homothétie ou cisaillement, $A^{T} \neq A^{-1}$
- Ne concerne que le bloc linéaire : la translation d'une matrice homogène s'inverse à part, en $-R^{T} \vec{t}$

## Connexions

### Notes liées
- [[MATH - matrices de rotation autour des axes]] - la famille de matrices orthogonales la plus utilisée
- [[MATH - matrice de transformation affine 4x4]] - où cette inversion s'applique au bloc $R_{3\times 3}$
- [[MATH - rotation par conjugaison de quaternion]] - la conversion quaternion → matrice produit une matrice orthogonale
- [[MATH - produit scalaire]] - la notion que ces matrices conservent

### Dans le contexte de
- [[MOC - Mathématiques]] - fait partie de ce domaine
- [[IEEE-754 - simple précision 32 bits]] - pourquoi la propriété se dégrade en pratique

## Ressources

- Source : [[Projecteur (Mathématiques)]]

---

**Tags thématiques** : `#mathematiques` `#algebre-lineaire` `#3d`
