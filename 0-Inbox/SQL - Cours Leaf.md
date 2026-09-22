

# 1 - Expression régulière

| Motifs | Descriptions | Ex sortie |
| ------ | ------------ | --------- |
|        |              |           |

# 2 - Hiérarchie

Data base
- table
	- column
		- Titres
# 3 - Commandes

## a) SELECT

```SQL
SELECT column1, column2
FROM table;
```

pour interroger toutes les colonnes

```SQL
SELECT *
FROM table;
```

## b) ORDER BY

```SQL
SELECT column1, column2
FROM table
ORDER BY colonne1;
```

>[!Note]
>`ORDER BY` tri par ordre croissant

Pour trier dans l'ordre décroissant :

```SQL
SELECT column1, column2
FROM table
ORDER BY colonne1 DESC;
```
## c) WHERE

```SQL
SELECT column1, column2
FROM table
WHERE column1 = 'Titre';
```

