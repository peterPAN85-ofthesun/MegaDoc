
```shell
r #run
show args  # montrer les arguments de la fonction

backtrace  #
where      # affiche la pile d'execution
bt         #

up <value>        #
down <value>      # se déplacer dans la pile d'appel

print <variable>     # affiche la variable
p
	/d     # decimal signé
	/x     # hexa
	/o     # octale
	/c     # caractère
	/f     # floatant
	/t     # binaire

show values # affiche les 10 derniers print

print list[0]@8 # affiche les 8 premières valeurs de la liste

nom_fonction::variable  # accéder à une variable extérieur du champ local
'nom_fichier'::variable

whatis <var> # affiche le type
ptype <var>  # affiche la description de la variable (utile pour un struct)

set [variable] = <value>          # set une variable dans le champ local
set variable [variable] = <value> # si conflit dans les noms, on peut indiquer sécifiquement "variable" pour dire qu'on va changer une variable

br
break
breakpoint   # ajoute un breakpoint
tbreak       # ajoute un breakpoint temporaire

br nom_fichier:n_ligne
br nom_fichier:nom_fonction

del br <num>
clear <nom_fonction>

next/n
step/s
continue/c  # continue jusqu'au prochain breackpoit
finish   # finie la fonction

# revenir en arrière dans le debuggage
target record-full # avant tout
reverse-step
reverse-next

display/undisplay
enable dips <n_disp>
disable disp <n_disp>

call (type)function(args)

detach # permet de finir le programme sans passer par gdb, pratique pour voir les sorties de gcc -fsanitize=leak
```