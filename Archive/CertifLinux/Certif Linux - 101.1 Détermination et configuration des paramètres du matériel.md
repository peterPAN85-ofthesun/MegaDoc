source : https://learning.lpi.org/fr/learning-materials/101-500/101/101.1/101.1_01/

```bash
lspci #liste les périfériques PCI
 -s [ID] -k   # avec les modules kernel associé
 -0 [ID] -v   # plus de détails
 
 lsusb #liste les périférques USB
  -v   #avec plus de détails
  -d [ID]  #périférique précis
  -t     #affiche l arborescence
  
lsmod #liste les modules de kernel

modprobe  # gestion des modules de kernel
 -r [MODULES]      #décharger module

modinfo -p [MODULE]  #affiche les information du modulen, sa conf dans /etc/modprobe.conf ou /etc/modprobe.d/ 
```

On peut renseigner le module dans `/etc/modprobe.d/blacklist.conf`


>[!Note]
>`/proc` `/sys` et `/dev` sont des pseudos système de fichier, qui n'existent que le que le système es en cours d'utilisation. Ils ne sont pas destinés au stockage

`/sys` -> informations sur les périfériques
`/proc` -> informations sur les structures de données du noyau

`/proc/cpuinfo` 
`/proc/interrupts` -> les des interruptions I/O pour chaque CPU
`/proc/ioports` -> Liste les plages I/O actuellement enregistrées et utilisées
`/proc/dma` -> les les canaux accès direct à la mémoire enregistrés en cours d'utilisation

`/dev` -> périfériques de stockage


`udev` :
module en charge de la détection à chaud et à froid des périphériques. S'appuie sur SysFS, un pseudo système de fichier pour les infos Hardware monté dans `/sys`

## Exercices Guidés

- Admettons qu’un système d’exploitation soit incapable de démarrer après l’ajout d’un deuxième disque SATA au système. Sachant que tous les composants ne sont pas défectueux, quelle pourrait être la cause possible de cette défaillance ?
    
Il y a certainement une partition d'amorçage qui pousse l'ordinateur à booter sur le deuxième disque dur


- Imaginons que vous vouliez vous assurer que la carte graphique externe connectée au bus PCI de votre nouvel ordinateur de bureau est bien celle annoncée par le fabricant, mais l’ouverture du boîtier du PC annulera la garantie. Quelle commande pourrait être utilisée pour lister les détails de la carte graphique tels qu’ils ont été détectés par le système d’exploitation ?

`lspci -s [ID] -v`
   
- La ligne suivante est un extrait de la sortie générée par la commande `lspci` :
    
    03:00.0 RAID bus controller: LSI Logic / Symbios Logic MegaRAID SAS 2208 [Thunderbolt] (rev 05)
    
    Quelle commande devez-vous exécuter pour identifier le module du noyau utilisé pour ce périphérique spécifique ?

`lspci -s 3:00.0 -k`
        
- Un administrateur système veut essayer différents paramètres pour le module de noyau `bluetooth` sans redémarrer le système. Cependant, toute tentative de déchargement du module avec `modprobe -r bluetooth` entraîne l’erreur suivante :
    
    modprobe: FATAL: Module bluetooth is in use.
    
    Quelle est la cause possible de cette erreur ?

Le bluetooth est en utilisation : couper les services qui utilisent le bluetooth

## Exercices Approfondissement


1. Il n’est pas rare de tomber sur des machines anciennes dans des environnements de production, comme certains équipements qui utilisent une connectique obsolète pour communiquer avec l’ordinateur de contrôle, d’où la nécessité d’accorder une attention particulière à certaines particularités de ces machines anciennes. Certains serveurs x86 avec un ancien firmware BIOS, par exemple, ne démarreront pas si le clavier n’est pas détecté. Comment éviter ce problème particulier ?
    
Paramétrer le BIOS
    
2. Les systèmes d’exploitation construits autour du noyau Linux sont également disponibles pour une grande variété d’architectures informatiques autres que x86, comme dans les ordinateurs monocartes basés sur l’architecture ARM. Un utilisateur attentif remarquera l’absence de la commande `lspci` sur de telles machines, comme le Raspberry Pi. Quelle différence avec les machines x86 justifie cette absence ?
    
pas de ports PCI ?
    
3. De nombreux routeurs disposent d’un port USB permettant la connexion d’un périphérique externe, comme un disque dur USB. Comme la plupart d’entre eux utilisent un système d’exploitation basé sur Linux, comment un disque dur USB externe sera-t-il nommé dans le répertoire `/dev/`, en supposant qu’aucun autre périphérique bloc conventionnel ne soit présent dans le routeur ?

/dev/sda1
    
4. En 2018, la vulnérabilité matérielle connue sous le nom de _Meltdown_ a été découverte. Elle concerne presque tous les processeurs des différentes architectures. Les versions récentes du noyau Linux peuvent indiquer si le système actuel est vulnérable. Comment obtenir ces informations ?
    
Depuis Linux kernel 4.15, problème patché
on peut vérifié dans `/proc/cpuinfo` :
```bash
grep -q "cpu_insecure\|cpu_meltdown\|kaiser" /proc/cpuinfo && echo "patched :)" \
|| echo "unpatched :("
```