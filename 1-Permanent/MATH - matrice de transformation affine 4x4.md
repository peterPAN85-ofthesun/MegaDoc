---
type: permanent
created: 2026-09-26 10:20
tags:
  - permanent
  - mathematiques
  - geometrie-projective
  - 3d
---

# MATH - matrice de transformation affine 4x4

> [!abstract] Concept
> En coordonnées homogènes, toute transformation affine de l'espace s'écrit comme une matrice 4×4 dont le bloc 3×3 supérieur gauche porte la partie linéaire, la dernière colonne la translation, et la dernière ligne vaut toujours $(0 0 0 1)$.

## Explication

Une transformation affine est une application linéaire suivie d'une translation. Le bloc de structure est toujours le même :

$$M = \begin{pmatrix} R_{3\times3} & t \\ 0\ 0\ 0 & 1 \end{pmatrix}$$

Le bloc $R_{3\times 3}$ encode la partie linéaire — rotation, homothétie, réflexion, transvection (cisaillement), ou n'importe quelle combinaison. La dernière colonne $t$ encode la translation, **quels que soient les autres composants** : c'est une règle de lecture universelle, qui permet d'extraire d'un coup d'œil le déplacement d'une matrice quelconque. La dernière ligne $(0 0 0 1)$ est la signature de l'affine : elle laisse $w$ inchangé, donc ne provoque aucune division. Dès qu'elle n'est plus $(0 0 0 1)$, la transformation devient **projective** et non plus affine — c'est exactement ce que fait la projection gnomonique.

La famille couverte est large : translations, rotations, réflexions, homothéties, transvections, et par composition tous les changements de repère. Une transformation affine préserve l'alignement, le parallélisme et les rapports de longueurs sur une droite ; elle ne préserve ni les angles ni les distances en général (seules les **isométries**, dont les rotations, le font).

L'intérêt majeur de cette écriture est la **composition** : enchaîner deux transformations revient à multiplier leurs matrices, et le résultat garde la même forme. On cumule ainsi rotation et translation dans une seule matrice appliquée en une passe, ce qui est précisément le calcul qu'exécute un pipeline graphique pour chaque sommet. Le produit matriciel n'étant pas commutatif, l'ordre est significatif : tourner puis translater n'est pas translater puis tourner.

<svg viewBox="0 0 430 215" width="100%" style="max-width:430px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Structure en blocs d'une matrice de transformation affine 4x4">
<rect x="60" y="44" width="150" height="114" fill="#4c9aff" fill-opacity="0.16" stroke="#4c9aff" stroke-width="1.4"/>
<rect x="210" y="44" width="50" height="114" fill="#27ae60" fill-opacity="0.16" stroke="#27ae60" stroke-width="1.4"/>
<rect x="60" y="158" width="200" height="38" fill="#f2994a" fill-opacity="0.16" stroke="#f2994a" stroke-width="1.4"/>
<path d="M 52 40 L 44 40 L 44 200 L 52 200" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M 268 40 L 276 40 L 276 200 L 268 200" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="98" y="96" font-size="14" fill="#4c9aff">R</text>
<text x="108" y="100" font-size="10" fill="#4c9aff">3×3</text>
<text x="86" y="124" font-size="10" fill="#4c9aff">rotation, homothétie,</text>
<text x="92" y="138" font-size="10" fill="#4c9aff">réflexion, cisaillement</text>
<text x="228" y="96" font-size="14" fill="#27ae60">t</text>
<text x="290" y="100" font-size="11" fill="#27ae60">dernière colonne :</text>
<text x="290" y="114" font-size="11" fill="#27ae60">la translation</text>
<text x="104" y="182" font-size="13" fill="#f2994a">0    0    0    1</text>
<text x="290" y="180" font-size="11" fill="#f2994a">signature de l'affine :</text>
<text x="290" y="194" font-size="11" fill="#f2994a">w inchangé, pas de division</text>
<text x="16" y="26" font-size="12" fill="currentColor">toute transformation affine 3D tient dans ce découpage en blocs</text>
</svg>

## Exemples

### Exemple 1 — rotation puis translation cumulées
$$M = T \cdot R = \begin{pmatrix} R_{3\times3} & t \\ 0\ 0\ 0 & 1 \end{pmatrix}$$
Appliquée à $(x, y, z, 1)$, elle donne $R \cdot (x, y, z) + \vec{t}$ : le point est d'abord tourné autour de l'origine, puis déplacé.

### Exemple 2 — défaire la transformation
Quand le bloc linéaire est une rotation, l'inverse se calcule sans algorithme général : $R^{-1} = R^{T}$, et la translation inverse devient $-R^{T} \cdot \vec{t}$. C'est pour cela qu'on multiplie le résultat par la transposée $R_{3\times 3}^{T}$ pour revenir dans le repère d'origine.

## Cas d'usage

- **Changement de repère** : passer du repère objet au repère monde puis au repère caméra par produits successifs.
- **Hiérarchie de scène** : la matrice d'un objet enfant est le produit de sa matrice locale par celle de son parent.
- **Animation** : interpoler ou accumuler des transformations sans jamais sortir du formalisme matriciel.

## Avantages et limites

✅ **Avantages** :
- Un format unique pour toute la chaîne de transformations, composable par simple produit
- Lecture directe de la translation (dernière colonne) et de la partie linéaire (bloc 3×3)

❌ **Limites** :
- 16 nombres pour une transformation qui en demande souvent 6 ou 7 de fait
- Accumulation d'erreurs en virgule flottante : le bloc rotation dérive et doit être réorthonormalisé
- L'ordre des produits est une source d'erreurs classique

## Connexions

### Notes liées
- [[MATH - coordonnées homogènes et plan à l'infini]] - le cadre qui rend cette matrice possible
- [[MATH - matrice de translation homogène]] - le cas où le bloc linéaire est l'identité
- [[MATH - matrices de rotation autour des axes]] - ce qui remplit le bloc $R_{3\times 3}$
- [[MATH - matrice orthogonale (inverse par transposition)]] - comment inverser ce bloc à moindre coût

### Dans le contexte de
- [[MOC - Mathématiques]] - fait partie de ce domaine
- [[PS2 - EE Emotion Engine et coprocesseurs vectoriels]] - le matériel conçu pour enchaîner ces produits 4×4

## Ressources

- Source : [[Projecteur (Mathématiques)]]

---

**Tags thématiques** : `#mathematiques` `#geometrie-projective` `#3d`
