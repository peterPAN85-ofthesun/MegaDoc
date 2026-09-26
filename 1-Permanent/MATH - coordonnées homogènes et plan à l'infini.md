---
type: permanent
created: 2026-09-26 10:15
tags:
  - permanent
  - mathematiques
  - geometrie-projective
  - 3d
---

# MATH - coordonnées homogènes et plan à l'infini

> [!abstract] Concept
> Ajouter une quatrième coordonnée $w$ à un point 3D plonge l'espace affine dans l'espace projectif : les points ordinaires se lisent $(x/w, y/w, z/w)$, et les coordonnées avec $w = 0$ décrivent le plan à l'infini, c'est-à-dire les directions.

## Explication

En coordonnées homogènes, un point de l'espace de dimension 3 s'écrit avec **quatre** nombres $(x, y, z, w)$. Ces quadruplets ne sont pas des adresses uniques : $(x, y, z, w)$ et $(\lambda x, \lambda y, \lambda z, \lambda w)$ désignent le même point pour tout $\lambda \neq 0$. Un point projectif est donc une **classe d'équivalence**, une droite vectorielle de $\mathbb{R}^{4}$ — d'où la notation à deux-points $(x : y : z : w)$.

Tant que $w \neq 0$, on retrouve un point cartésien ordinaire en **déshomogénéisant** : on divise par $w$ pour obtenir $(x/w, y/w, z/w)$. Par convention on travaille le plus souvent avec $w = 1$, ce qui rend la lecture immédiate. L'espace affine familier est ainsi coordonné par une base correspondant à $(1 : 0 : 0 : 1)$, $(0 : 1 : 0 : 1)$, $(0 : 0 : 1 : 1)$.

Le cas $w = 0$ est celui qui justifie toute la construction : la division devient impossible, ces coordonnées ne correspondent à aucun point affine. Elles forment le **plan à l'infini**, sur lequel l'espace projectif se « replie », et s'interprètent comme des **directions** — $(x : y : z : 0)$ est le point où vont se rencontrer toutes les droites de vecteur directeur $(x, y, z)$. Deux droites parallèles cessent alors d'être un cas particulier : elles se coupent, à l'infini. C'est ce qui donne à la géométrie projective ses énoncés sans exception, et au rendu 3D ses points de fuite.

Bénéfice pratique décisif : dans ce cadre, la translation — qui n'est pas linéaire en cartésien — devient une simple multiplication matricielle, et toutes les transformations affines et projectives se composent par produit de matrices 4×4.

<svg viewBox="0 0 430 250" width="100%" style="max-width:430px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Coordonnées homogènes : droites vectorielles, plan w=1 et point à l'infini">
<defs>
<marker id="hgF" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker>
<marker id="hgA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#4c9aff"/></marker>
<marker id="hgB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#f2994a"/></marker>
</defs>
<line x1="60" y1="210" x2="410" y2="210" stroke="currentColor" stroke-width="1.2" marker-end="url(#hgF)" opacity="0.7"/>
<line x1="60" y1="230" x2="60" y2="45" stroke="currentColor" stroke-width="1.2" marker-end="url(#hgF)" opacity="0.7"/>
<text x="46" y="42" font-size="13" fill="currentColor" font-style="italic">w</text>
<line x1="60" y1="110" x2="400" y2="110" stroke="#4c9aff" stroke-width="1.6"/>
<text x="300" y="102" font-size="12" fill="#4c9aff">w = 1 : espace affine</text>
<line x1="60" y1="210" x2="230" y2="88" stroke="currentColor" stroke-width="1.5" marker-end="url(#hgF)" opacity="0.85"/>
<line x1="60" y1="210" x2="360" y2="130" stroke="currentColor" stroke-width="1.5" marker-end="url(#hgF)" opacity="0.85"/>
<circle cx="200" cy="110" r="4" fill="#4c9aff"/>
<text x="188" y="134" font-size="12" fill="#4c9aff">(x, 1)</text>
<circle cx="230" cy="88" r="3" fill="currentColor" opacity="0.7"/>
<text x="238" y="80" font-size="11" fill="currentColor" opacity="0.8">(λx, λ) — même point</text>
<circle cx="285" cy="110" r="4" fill="#4c9aff"/>
<line x1="60" y1="210" x2="390" y2="210" stroke="#f2994a" stroke-width="2" marker-end="url(#hgB)"/>
<text x="210" y="228" font-size="12" fill="#f2994a">w = 0 : parallèle au plan affine — point à l'infini (direction)</text>
<circle cx="60" cy="210" r="3.5" fill="currentColor"/>
<text x="42" y="226" font-size="13" fill="currentColor" font-style="italic">O</text>
<text x="16" y="28" font-size="12" fill="currentColor">un point projectif = une droite vectorielle ; on le lit en divisant par w</text>
</svg>

## Exemples

### Exemple 1 — le même point, plusieurs écritures
$(2, 4, 6, 2)$, $(1, 2, 3, 1)$ et $(-3, -6, -9, -3)$ désignent tous le point cartésien $(1, 2, 3)$.

### Exemple 2 — point contre direction
| Écriture | Nature | Effet d'une translation |
|---|---|---|
| $(1, 2, 3, 1)$ | point affine | déplacé |
| $(1, 2, 3, 0)$ | direction / point à l'infini | **invariant** |

Cette distinction est la raison pour laquelle un moteur 3D stocke $w = 1$ pour les positions et $w = 0$ pour les vecteurs : une normale ou une direction de lumière ne doit pas subir la translation.

## Cas d'usage

- **Pipeline graphique** : unifier translation, rotation, mise à l'échelle et perspective dans une seule matrice 4×4.
- **Perspective** : la division par $w$ réalise la division par la profondeur, qui rapetisse les objets lointains.
- **Géométrie projective** : traiter le parallélisme comme un cas d'intersection, sans distinguer de cas dégénéré.

## Avantages et limites

✅ **Avantages** :
- Une seule algèbre (produit matriciel) pour toutes les transformations, translation comprise
- Les points de fuite et les directions deviennent des objets calculables

❌ **Limites** :
- Représentation redondante : 4 nombres pour 3 degrés de liberté
- La déshomogénéisation impose une division, coûteuse et instable quand $w$ approche 0

## Connexions

### Notes liées
- [[MATH - matrice de transformation affine 4x4]] - la structure matricielle que ces coordonnées autorisent
- [[MATH - matrice de translation homogène]] - l'exemple canonique de ce que la 4ᵉ coordonnée débloque
- [[MATH - projection gnomonique (perspective conique)]] - une projection qui exploite directement la division par $w$
- [[MATH - somme directe et sous-espaces supplémentaires]] - autre façon de découper l'espace, entre points et directions

### Dans le contexte de
- [[MOC - Mathématiques]] - fait partie de ce domaine
- [[PS2SDK - pipeline de rendu bas niveau]] - application concrète côté matériel

## Ressources

- Source : [[Projecteur (Mathématiques)]]

---

**Tags thématiques** : `#mathematiques` `#geometrie-projective` `#3d`
