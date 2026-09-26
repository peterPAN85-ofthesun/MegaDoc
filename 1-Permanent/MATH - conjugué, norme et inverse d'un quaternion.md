---
type: permanent
created: 2026-09-26 11:15
tags:
  - permanent
  - mathematiques
  - quaternions
  - algebre
---

# MATH - conjugué, norme et inverse d'un quaternion

> [!abstract] Concept
> Le conjugué $q^{*}$ retourne la partie vectorielle ($q^{*} = \operatorname{Re}(q) - \operatorname{Im}(q)$) ; il donne la norme par $\|q\|^{2} = q q^{*}$ et l'inverse par $q^{-1} = \frac{q^{*}}{\|q\|^{2}}$, qui se réduit à $q^{*}$ pour un quaternion unitaire.

## Explication

La **conjugaison quaternionique** $q \mapsto q^{*}$ garde la partie réelle et change le signe de la partie imaginaire :

$$q = a + bi + cj + dk \quad \Longrightarrow \quad q^{*} = a - bi - cj - dk = \operatorname{Re}(q) - \operatorname{Im}(q)$$

C'est un **antiautomorphisme involutif** de $\mathbb{H}$ — trois mots qui se lisent séparément. *Antiautomorphisme* : elle renverse l'ordre des produits, $(pq)^{*} = q^{*} p^{*}$, l'inversion étant indispensable puisque la multiplication n'est pas commutative. *Involutif* : l'appliquer deux fois redonne le point de départ, $(q^{*})^{*} = q$. Elle est de plus $\mathbb{R}$-linéaire.

La **norme** s'en déduit directement, car le produit $q q^{*}$ annule toutes les parties imaginaires :

$$\|q\|^{2} = q q^{*} = a^{2} + b^{2} + c^{2} + d^{2}$$

Les propriétés de la conjugaison rendent cette norme **multiplicative** : $\|q_1 q_2\| = \|q_1\| \|q_2\|$. C'est ce qui garantit qu'un produit de quaternions unitaires reste unitaire — donc qu'une composition de rotations reste une rotation.

L'**inverse** d'un quaternion non nul suit immédiatement : puisque $q q^{*} = \|q\|^{2}$, il suffit de diviser par ce réel.

$$q^{-1} = \frac{q^{*}}{\|q\|^{2}}, \qquad \text{et si } \|q\| = 1 : \quad q^{-1} = q^{*}$$

Ce dernier cas est le pendant exact du $R^{-1} = R^{T}$ des matrices orthogonales : pour un quaternion unitaire, inverser une rotation coûte trois changements de signe.

> [!warning] Notation de division à proscrire
> La division par un quaternion peut se faire **à gauche** ($q_2^{-1} q_1$) ou **à droite** ($q_1 q_2^{-1}$), et les deux résultats diffèrent. L'écriture $\frac{q_1}{q_2}$ est donc ambiguë et ne doit pas être employée.

<svg viewBox="0 0 420 215" width="100%" style="max-width:420px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Conjugaison quaternionique : la partie vectorielle change de signe">
<defs>
<marker id="cjA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#4c9aff"/></marker>
<marker id="cjB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#f2994a"/></marker>
<marker id="cjF" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker>
</defs>
<line x1="40" y1="120" x2="380" y2="120" stroke="currentColor" stroke-width="1.2" marker-end="url(#cjF)" opacity="0.7"/>
<text x="384" y="124" font-size="12" fill="currentColor">Re</text>
<line x1="190" y1="200" x2="190" y2="44" stroke="currentColor" stroke-width="1.2" marker-end="url(#cjF)" opacity="0.7"/>
<text x="196" y="44" font-size="12" fill="currentColor">Im</text>
<line x1="190" y1="120" x2="296" y2="64" stroke="#4c9aff" stroke-width="2.2" marker-end="url(#cjA)"/>
<text x="302" y="60" font-size="14" fill="#4c9aff" font-style="italic">q</text>
<line x1="190" y1="120" x2="296" y2="176" stroke="#f2994a" stroke-width="2.2" marker-end="url(#cjB)"/>
<text x="302" y="184" font-size="14" fill="#f2994a" font-style="italic">q*</text>
<line x1="190" y1="120" x2="300" y2="120" stroke="#27ae60" stroke-width="2.6"/>
<text x="246" y="136" font-size="12" fill="#27ae60">Re(q) = a</text>
<line x1="300" y1="120" x2="300" y2="66" stroke="#4c9aff" stroke-width="1.4" stroke-dasharray="4 3"/>
<line x1="300" y1="120" x2="300" y2="174" stroke="#f2994a" stroke-width="1.4" stroke-dasharray="4 3"/>
<text x="308" y="100" font-size="11" fill="#4c9aff">+Im(q)</text>
<text x="308" y="150" font-size="11" fill="#f2994a">−Im(q)</text>
<circle cx="190" cy="120" r="3" fill="currentColor"/>
<text x="16" y="26" font-size="12" fill="currentColor">q* = Re(q) − Im(q) : la partie vectorielle est retournée, la partie réelle conservée</text>
<text x="16" y="208" font-size="11" fill="currentColor" opacity="0.75">‖q‖² = q q* = a² + b² + c² + d²  ·  involution : (q*)* = q</text>
</svg>

## Exemples

### Exemple 1 — un calcul complet
Pour $q = 1 + 2i$ : $q^{*} = 1 - 2i$, $\|q\|^{2} = 1 + 4 = 5$, donc $q^{-1} = \frac{1 - 2i}{5}$. Vérification : $q q^{-1} = \frac{(1 + 2i)(1 - 2i)}{5} = \frac{1 + 4}{5} = 1$.

### Exemple 2 — la forme scalaire-vecteur
$$(s + \vec{v})^{-1} = \frac{s - \vec{v}}{s^{2} + \|\vec{v}\|^{2}}$$
avec les deux relations toujours vraies, à gauche comme à droite : $q^{-1} q = 1$ et $q q^{-1} = 1$.

## Cas d'usage

- **Inverser une rotation** : pour un quaternion unitaire, prendre le conjugué suffit.
- **Normaliser une orientation** après accumulation d'erreurs flottantes : $q \leftarrow \frac{q}{\|q\|}$.
- **Appliquer une rotation** : la conjugaison $q \vec{v} q^{-1}$ repose entièrement sur ces opérations.

## Avantages et limites

✅ **Avantages** :
- Inverse quasi gratuit dans le cas unitaire (trois changements de signe)
- Norme multiplicative : la composition de rotations ne dégrade pas la structure
- Toutes les opérations restent internes à $\mathbb{H}$

❌ **Limites** :
- La division est ambiguë (gauche ou droite) et sa notation fractionnaire est à bannir
- L'ordre s'inverse dans $(pq)^{*} = q^{*} p^{*}$, piège classique d'implémentation
- La propriété $q^{-1} = q^{*}$ n'est valable que si la norme vaut exactement $1$

## Connexions

### Notes liées
- [[MATH - quaternion (définition et structure)]] - les parties réelle et imaginaire manipulées ici
- [[MATH - produit de Hamilton]] - le produit dont ces opérations sont dérivées
- [[MATH - rotation par conjugaison de quaternion]] - l'usage direct de $q^{-1}$
- [[MATH - matrice orthogonale (inverse par transposition)]] - le parallèle exact côté matrices
- [[MATH - idempotence]] - à distinguer de l'involution que réalise la conjugaison

### Dans le contexte de
- [[MOC - Mathématiques]] - fait partie de ce domaine

## Ressources

- Source : [[Projecteur (Mathématiques)]]

---

**Tags thématiques** : `#mathematiques` `#quaternions` `#algebre`
