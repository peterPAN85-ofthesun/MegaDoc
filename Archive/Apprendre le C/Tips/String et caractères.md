---

---

CF : [[Les Bases#11 - Chaîne de caractères]]

# Librairies

[[Librairie string.h]]
[[Librairie stdlib.h]]
[[Librairie ctype.h]]

# Caractères Spéciaux

| Caractères spéciaux | Descriptions                  |
| ------------------- | ----------------------------- |
| \n                  | Retour à la ligne             |
| \t                  | Tabulation                    |
| \0                  | fin de la chaîne de caractère |

# Les nombres dans une chaîne de caractère

Dans [[Librairie stdlib.h]]:
- En long (sans virgule): [[Librairie stdlib.h#strtol (const <span style="color 7030a0">char</span>[ ] start, <span style="color 7030a0">char</span> **end, <span style="color ffc000">int</span> base)|strtol()]]
- En double (avec virgule): [[Librairie stdlib.h#strtod (const <span style="color 7030a0">char</span>[ ] start, <span style="color 7030a0">char</span> **end)|strtod()]] 

# Renvoyer le caractère en majuscule ou en minuscule

Dans [[Librairie ctype.h]]:
- [[Librairie ctype.h#toupper(<span style="color ffc000">int</span> charactere)|toupper]](<span style="color:#ffc000">int</span> caractere)
- [[Librairie ctype.h#tolower(<span style="color ffc000">int</span> charactere)|tolower]](<span style="color:#ffc000">int</span> caractere)