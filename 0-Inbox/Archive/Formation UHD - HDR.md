
# Base HD 50i

doc : EBU scaling and interlacing 1080

sRGB : 8 bits
rec709 : 10bits

Encodage de la couleur :
- RGB (synthèse additive)
- Composante YUV ou YCrCb (Cr = R-Y et Cb = B-Y et Y = 0.6 V + 0.3 R + 0.1 B )

>[!Note]
>Le système d'échantillonnage 4:2:2 ou 4:4:4 permet d'encoder la répartition des données Cr et Cb dans l'image

Gris 18% -> gis moyen (avec autant de noir que de blanc) 50%

Gamma Des écrans à tube : 2.2
Pour équilibrer, les caméras devaient enregistrer en gamma 1/2.2

La valeur de gamma actuelle des écrans est de 2.4

EOTF et OETF -> application de la courbe gamma

EOTF: REC. ITU-R BT1886
OETF : REC 709

>[!Warning]
>EOTF et OETF ne sont pas parfaitement "symétrique" mais permette de "presque" s'annuler

sensor -> OETF(Optical to Electronics Transfert Funtction) -> EOTF(Electronnic to Optic Transfert Funtction) -> screen

Narrow Range vs Full Range
Narrow Range en SDR : 64 - 940


![[20260407_105948.jpg]]


# UHD

- HD(1920 x 1080) -> UHD(3840 x 2160)
- 50i -> 50p
- 8bits -> 10 bits
- Rec709 -> Rec2020


Résolution :  on voit la différence de résolution entre HD et HUD à partir du moment où on se situe à une distance inférieur à 3fois la hauteur de l'écran

| Résolution | Ballayage | Débits |
| ---------- | --------- | ------ |
| 1080       | 50i       | 1.5G   |
| 1080       | 25p       | 1.5G   |
| 1080       | 50p       | 3G     |
| UHD        | 25p       | 6G     |
| UHD        | 50p       | 12G    |


3G A -> 2 cable en 1.5G
3G B - > 1 cable en 3G (2 signaux 1.5G dans un cable)

![[20260407_115641.jpg]] [IMAGE]
Formats FTV

![[20260407_115904.jpg]][IMAGE]
Codecs Compatible UHD-HDR
La plupart des formats sur 10bits sont compatibles


Pour le transport
- SQD (Quad), simple mais si un signal lâche on perd un quart de l'image 
- 2SI (2 Sample Interleave)
Transportable sur 4 cables 3G ou 1 cable 12G

>[!Warning]
>Attention à ne pas croiser les câbles ! Pour le test, passer en SQD pour voir comment sort l'image. Refaire le câblage en fonction
>Sur les cams Sony, une petite mark 2Si permet de monitorer si le cablage du signal en 2SI est bien fait.


![[20260407_121800.jpg]]
[IMAGE]

Dans le Byte 2, il n'y a  que 4 possibilité pour le "type de HDR"
- SDR
- HLG
- PQ
- Unspecified
Ce qui veut dire, qu'il y a certain nombre de possibilité qui ne sont pas prévu (S-log par exemple)

Attention : on ne peut pas se fier systématiquement aux tags du VPID, car ce sont des informations qui peuvent êtres changés par tous les utilisateurs du signal indépendamment de la nature du signal.

>[!Note]
>La dynamique est le rapport entre le signal le plus élevé et le signal le plus bas
>Pour parler de dynamique en image : stops
>Quand on double le signa (x2) on ajoute 1 stop
>On peut parler aussi de nit (1cd/m²) soit la luminosité produite pas une bougie


HDR, c'est deux choses :
- une dynamique augmenté
- un espace colorimétrique augmenté
Il ne faut pas oublier d'adapter ces deux paramètres sur l'ensemble de la chaîne de production
![[20260407_164944.jpg]]
[IMAGE]

>[!Claude] ✅
>Je n'ai pas compris pourquoi ces deux paramètres ne sont pas liés de manière automatique. Quels sont les cas où on a besoin d'une dynamique SDR et d'un espace colo HDR? Inversement ?
>
>**Réponse :** Dynamique et espace colorimétrique sont deux propriétés physiques **indépendantes** du signal. Cas réels :
>- **Dynamique HDR + espace SDR (Rec.709)** : les caméras Sony HLG "Live" encodent en HLG (dynamique étendue) mais restent dans l'espace Rec.709. Cas d'usage : régie HDR live avec moniteurs Rec.709, ou diffuseur qui adopte le HDR progressivement sans changer l'espace couleur.
>- **Dynamique SDR + espace HDR (Rec.2020)** : production UHD qui filme en Rec.2020 pour la couverture chromatique maximale, mais garde un gamma SDR car la chaîne de diffusion n'est pas encore HDR. Permet de "future-proof" le master sans migrer toute l'infra.


En HDR HLG, 203 nits (75%) correspond à 100% du signal en SDR (100 nit)
HLG  -> SDR =  -10 dB

Courbe PQ:
- fait pour être le plus proche du fonctionnement de l'oeuil humain
- diffusion adaptée pour le Cinéma, France2 en continu

Courbe HLG(Hybrid Log Gamma):
- Rétro compatibilité avec le SDR

Dans ces courbes (statiques), on retrouve les valeurs suivantes :
- espace colo
- max fall
- max cll

![[20260407_161145.jpg]]

![[20260407_162008.jpg]]
[IMAGE]

![[20260407_164851.jpg]]
[IMAGE]

Chez Sony, il y a plusieurs types de courbes HLG:
- Live (aligné sur Rec709)
- Natural (aligné sur les standard 2100)

Métadata statiques/dynamique
- dynamique : intéressant pour adapter sa colo en fonction du téléviseur sur lequel on diffuse le produit
- dynamique (HDR10+, DolbyVision, HDRviVID, )

Dolby Vision = PQ2084


# TP

Sur les OCP Sony, pour régler le format de sortie de la caméra
`Config/MultiFormat`

