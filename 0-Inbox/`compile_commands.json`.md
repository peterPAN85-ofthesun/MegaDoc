
Le fichier `compile_commands.json` permet de donner un contexte de la compilation d'un fichier : 

Un exemple de ce qu'on peut retrouver dans ce fichier 
```json
[
 {
  "directory": "/home/grepinea/Documents/CommonCore/01_libft",
  "arguments": [
   "cc",
   "-O2",
   "-Werror",
   "-Wall",
   "-Wextra",
   "-I",
   "./",
   "-MMD",
   "-MP",
   "-c",
   "test.c",
   "-o",
   "test.o"
  ],
  "file": "test.c"
 }
]
```

pour le gererer a partir de la commande make, on peut utiliser `bear make`ou `compiledb make`

