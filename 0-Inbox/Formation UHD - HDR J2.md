
# Environnement de travail HDR

![[20260408_100604.jpg]]
[IMAGE]

# Guide des bonnes pratiques

>[!Claude]
>Se renseigner sur ITU-R BT.2408

![[20260408_100927.jpg]]
[IMAGE]

![[20260408_101125.jpg]]
[IMAGE]

![[20260408_101215.jpg]]
[IMAGE]
Les deux dernières images concernent les teintes de peaux dans le monde HDR

# Conversions
- upmaping/downmaping
- Tone Mapping : HDR -> SDR (down convert)
- Inverse Tone Mapping : SDR -> HDR (up convert)
- Direct maping : contenu SDR "encapsulé" dans HDR
- Hard cliping : HDR -> SDR en coupant toutes les informations

![[20260408_101401.jpg]]
[IMAGE]

Pour la conversion de SDR -> HDR, deux méthodes :
- Display Referred Mapping (=Display Light) (petit à petit abandonné car lourd à mettre en place)
- Scence Referred Mapping (=Referrred Light)

Pour HDR -> SDR, les deux méthodes existent mais on préferera "Dsiplay Light" car on maintient le look de l'image HDR

![[20260408_101949.jpg]]
[IMAGE]

![[20260408_102232.jpg]]
[IMAGE]
>[!Claude]
>Je coudrais que tu reproduise le schéma si dessus en expliquant la différence de rendu entre "Display" et "Scene"

![[20260408_102629.jpg]]
>[!Claude]
>Réutilise cette image comme illustration de la différence en "Display" et "Scene"

![[20260408_102839.jpg]]
>[!Claude]
>- Je voudrais que tu reproduise le schéma si dessus
>- Je voudrais que explique l'usage d'un EOTF dans ces cas ci et l'usage d'un OOTF

# Look-Up tables (LUT)

## Lut 1D

Conversion de chaque primaire sans tenir compte des deux autres couleurs primaire
Conversion très simple

ne permet pas de modifier la saturation indépendamment du contraste
À utiliser pour de l'affichage, lorsqu'on a pas besoin de précision
## Lut 3D

Plus adapté pour faire correspondre les espaces colorimétriques entre eux dans une matrice en 3 dimensions

Résolution différentes  :
- 33 x 33 x 33 (broadcast)
- 65 x 65 x 65 (post prod)

Différentes méthodes d'interpolations entre chaque coordonnées :
- Trilinear (monitoring)
- Tetrahedral (plus précis)

## Remarques


![[20260408_104540.jpg]]
[IMAGE]

Dans notre situation en régie pour de la diffusion, nous travaillions plutôt avec des LUT 3D, en 33x33x33, et Tetrahedral, et Type III, 10 bits


![[20260408_104946.jpg]]
[IMAGE]
>[!Claude]
>Je souhaite que tu reproduise le schéma ci-dessus

LUTs Recommandée par NBCU : https://github.com/digitaltvguy/NBCUniversal-UHD-HDR-SDR-Single-Master-Production-Workflow-Recommendation-LUTs

# Workflow

![[20260408_114132.jpg]]
[IMAGE]
>[!Claude]
>Je veux que tu reproduise les schéma.



Doc : https://cst.fr/glossaire-hdr/


