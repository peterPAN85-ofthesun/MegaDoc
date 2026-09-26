---
type: permanent
created: 2026-09-26 10:45
tags:
  - permanent
  - mathematiques
  - geometrie-projective
  - 3d
---

# MATH - projection gnomonique (perspective conique)

> [!abstract] Concept
> La projection gnomonique envoie chaque point sur le plan image le long de la droite qui le relie à l'origine ; en coordonnées homogènes, elle se réduit à placer $\frac{1}{f}$ dans la dernière ligne, et c'est la division par $w$ qui produit l'effet de perspective.

## Explication

On se place dans le cas d'une projection sur le plan $(\vec{i}, \vec{j})$ situé à la distance $f$ de l'origine suivant $\vec{k}$. Contrairement à la projection orthographique, les rayons ne sont pas parallèles : ils passent **tous par l'origine**, qui joue le rôle du centre optique (l'œil). Le projeté d'un point est l'intersection entre le plan image et la droite reliant ce point à l'origine.

$$P_{\text{gnom}} = \begin{pmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & \frac{1}{f} & 0 \end{pmatrix}, \qquad P_{\text{gnom}} \begin{pmatrix} x \\ y \\ z \\ 1 \end{pmatrix} = \begin{pmatrix} x \\ y \\ z \\ \frac{z}{f} \end{pmatrix}$$

Toute l'astuce tient dans la dernière ligne, qui n'est plus $(0\ 0\ 0\ 1)$ : la transformation n'est donc **pas affine**, elle est proprement projective. Elle copie la profondeur $z$ dans la coordonnée homogène $w$. Le résultat ne prend son sens qu'après déshomogénéisation, c'est-à-dire après division par $w = \frac{z}{f}$ :

$$\left( \frac{f x}{z}, \frac{f y}{z}, f \right)$$

On retrouve la formule classique de la perspective : les coordonnées à l'écran sont divisées par la profondeur. Un objet deux fois plus loin occupe une image deux fois plus petite, et les droites parallèles non contenues dans un plan frontal convergent vers un **point de fuite** — qui n'est rien d'autre que l'image du point à l'infini correspondant à leur direction.

Le prix à payer est la division, coûteuse et surtout dangereuse : quand $z \to 0$, $w \to 0$ et les coordonnées divergent. Tout moteur de rendu impose donc un **plan de clipping proche**, qui écarte les points trop près de l'œil — ils sont, littéralement, des points à l'infini de l'image.

<svg viewBox="0 0 430 245" width="100%" style="max-width:430px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Projection gnomonique : rayons concourants en O et rétrécissement avec la distance">
<defs>
<marker id="gnF" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker>
<marker id="gnB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#f2994a"/></marker>
</defs>
<polygon points="300,26 352,10 352,206 300,222" fill="#4c9aff" fill-opacity="0.12" stroke="#4c9aff" stroke-width="1.4"/>
<text x="306" y="238" font-size="12" fill="#4c9aff">plan image (z = f)</text>
<line x1="60" y1="150" x2="400" y2="150" stroke="currentColor" stroke-width="1.2" marker-end="url(#gnF)" opacity="0.7"/>
<text x="404" y="154" font-size="13" fill="currentColor" font-style="italic">k</text>
<circle cx="60" cy="150" r="4" fill="currentColor"/>
<text x="40" y="166" font-size="13" fill="currentColor" font-style="italic">O</text>
<text x="18" y="182" font-size="11" fill="currentColor" opacity="0.8">centre optique</text>
<line x1="60" y1="150" x2="330" y2="42" stroke="#f2994a" stroke-width="1.6" marker-end="url(#gnB)"/>
<line x1="60" y1="150" x2="330" y2="258" stroke="#f2994a" stroke-width="1.6" opacity="0.35"/>
<circle cx="160" cy="110" r="4" fill="#f2994a"/>
<text x="136" y="102" font-size="12" fill="#f2994a">A</text>
<circle cx="240" cy="78" r="4" fill="#f2994a"/>
<text x="232" y="70" font-size="12" fill="#f2994a">B</text>
<circle cx="316" cy="48" r="4.5" fill="#27ae60"/>
<text x="246" y="34" font-size="12" fill="#27ae60">même image : A et B sont alignés avec O</text>
<line x1="160" y1="110" x2="160" y2="150" stroke="#27ae60" stroke-width="2.6"/>
<line x1="240" y1="78" x2="240" y2="150" stroke="#27ae60" stroke-width="2.6" opacity="0.55"/>
<text x="16" y="26" font-size="12" fill="currentColor">tous les rayons passent par O : l'image vaut (f·x/z, f·y/z), d'où le rétrécissement en 1/z</text>
<text x="70" y="198" font-size="11" fill="currentColor" opacity="0.75">quand z → 0, w → 0 : divergence, d'où le plan de clipping proche</text>
</svg>

## Exemples

### Exemple 1 — le rétrécissement
Avec $f = 1$, le point $(2, 0, 2)$ se projette en $(1, 0, 1)$ ; le point $(2, 0, 4)$, deux fois plus loin, en $(0{,}5, 0, 1)$. Même hauteur réelle, image deux fois plus petite.

### Exemple 2 — comparaison des deux projections
| | Orthographique | Gnomonique |
|---|---|---|
| Rayons | parallèles à $\vec{k}$ | concourants en $O$ |
| Dernière ligne | $(0\ 0\ 0\ 1)$ | $(0\ 0\ \frac{1}{f}\ 0)$ |
| Division par $w$ | non | oui |
| Taille selon la distance | constante | en $\frac{1}{z}$ |
| Droites parallèles | restent parallèles | convergent (point de fuite) |

## Cas d'usage

- **Rendu 3D réaliste** : c'est la projection de toute caméra virtuelle en jeu vidéo ou en image de synthèse.
- **Modèle sténopé** en vision par ordinateur, base de la calibration de caméra.
- **Cartographie gnomonique** : projection d'une sphère depuis son centre, où tout grand cercle devient une droite — d'où son usage en navigation.

## Avantages et limites

✅ **Avantages** :
- Reproduit la vision humaine : profondeur perçue, points de fuite
- Tient toujours dans une matrice $4 \times 4$ composable avec le reste du pipeline

❌ **Limites** :
- Nécessite une division par $w$ pour chaque sommet
- Instable quand $z$ approche $0$, d'où l'obligation d'un plan de clipping proche
- Ne conserve ni les longueurs ni le parallélisme : l'image n'est pas mesurable directement

## Connexions

### Notes liées
- [[MATH - projection orthographique]] - l'alternative parallèle, affine et sans division
- [[MATH - coordonnées homogènes et plan à l'infini]] - la division par $w$ et les points de fuite
- [[MATH - projection (application linéaire idempotente)]] - la notion générale dont ceci est la version projective
- [[MATH - matrice de transformation affine 4x4]] - le contraste : ici la dernière ligne n'est plus $(0\ 0\ 0\ 1)$

### Dans le contexte de
- [[MOC - Mathématiques]] - fait partie de ce domaine
- [[PS2 - GS Graphics Synthesizer]] - le matériel qui consomme les coordonnées après division

## Ressources

- Source : [[Projecteur (Mathématiques)]]

---

**Tags thématiques** : `#mathematiques` `#geometrie-projective` `#3d`
