---
type: permanent
created: 2026-09-26 10:05
tags:
  - permanent
  - mathematiques
  - algebre-lineaire
---

# MATH - idempotence

> [!abstract] Concept
> Une opération est idempotente quand l'appliquer plusieurs fois donne le même résultat que l'appliquer une seule fois : $f \circ f = f$.

## Explication

L'idempotence dit qu'après le premier passage, le résultat est déjà dans son état final : le second passage ne trouve plus rien à faire. Formellement, pour une application $f : E \to E$, l'idempotence s'écrit $f(f(x)) = f(x)$ pour tout $x$. Cela signifie que tout élément de l'image est un **point fixe** : $f$ restreinte à $\operatorname{Im} f$ est l'identité.

En algèbre linéaire, l'idempotence est la signature exacte des projections : un endomorphisme vérifie $p^{2} = p$ si et seulement s'il projette sur $\operatorname{Im} p$ parallèlement à $\operatorname{Ker} p$. C'est une caractérisation très économique — on reconnaît une projection en élevant sa matrice au carré, sans avoir à identifier les sous-espaces.

Il ne faut pas confondre idempotence et **involution**. Une involution vérifie $f \circ f = \mathrm{id}$ : elle revient au point de départ (le changement de signe, la conjugaison, la transposition). L'idempotence, elle, ne revient nulle part : elle reste sur place. La première est bijective, la seconde ne l'est généralement pas.

## Exemples

### Exemple 1 — en mathématiques
- La valeur absolue : $\lvert \lvert a \rvert \rvert = \lvert a \rvert$, appliquer une deuxième fois ne change plus rien.
- La partie entière, le $\max(x, 0)$, l'adhérence d'un ensemble topologique.
- Toute matrice de projection : $P^{2} = P$.

### Exemple 2 — en informatique
La notion se transporte telle quelle aux opérations sur un système :
```bash
mkdir -p /tmp/data   # 1ère fois : crée ; 2ᵉ fois : ne fait rien, pas d'erreur
```
C'est le critère qui rend une opération rejouable sans risque — précieux pour un script d'installation, une requête HTTP `PUT`/`DELETE` ou un acquittement réseau perdu puis renvoyé.

## Cas d'usage

- **Reconnaître une projection** : tester $P^{2} = P$ plutôt que chercher noyau et image.
- **Concevoir des opérations rejouables** : un traitement idempotent peut être relancé après un échec partiel sans effet de bord cumulatif.
- **Simplifier des expressions** : toute puissance $p^{n}$ d'un opérateur idempotent se réduit à $p$.

## Connexions

### Notes liées
- [[MATH - projection (application linéaire idempotente)]] - l'idempotence y est la définition même
- [[MATH - conjugué, norme et inverse d'un quaternion]] - la conjugaison est une involution, le contre-modèle utile
- [[MATH - matrice orthogonale (inverse par transposition)]] - autre propriété algébrique qui caractérise une famille de matrices

### Dans le contexte de
- [[MOC - Mathématiques]] - fait partie de ce domaine

## Ressources

- Source : [[Projecteur (Mathématiques)]]

---

**Tags thématiques** : `#mathematiques` `#algebre-lineaire`
