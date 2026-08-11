---
type: permanent
created: 2026-08-11 00:00
tags:
  - permanent
  - réseau
  - dns
  - protocole
---

# DNS inversé - PTR

> [!abstract] Concept
> Le DNS inversé (reverse DNS) résout une adresse IP vers un nom de domaine, l'opération inverse de la résolution DNS classique, via des enregistrements de type PTR.

## Explication

Le DNS classique répond à la question « quelle IP correspond à ce nom ? » (enregistrement A/AAAA). Le DNS inversé répond à la question opposée : « quel nom correspond à cette IP ? ». Il s'appuie sur un enregistrement de type **PTR** (Pointer), stocké dans une zone spéciale appelée `in-addr.arpa` pour l'IPv4 (ou `ip6.arpa` pour l'IPv6).

L'adresse IP est inversée octet par octet et ajoutée à ce domaine spécial. Par exemple, pour interroger le nom associé à `142.250.185.46`, le résolveur DNS interroge la zone `46.185.250.142.in-addr.arpa`.

## Exemples

```
$ dig -x 142.250.185.46

;; ANSWER SECTION:
46.185.250.142.in-addr.arpa. 300 IN PTR par10s34-in-f14.1e100.net.
```

Sous Windows :
```
nslookup 142.250.185.46
```

## Cas d'usage

- **Serveurs mail** : de nombreux serveurs SMTP vérifient le PTR de l'IP source pour lutter contre le spam (mismatch PTR ↔ nom = suspect)
- **Logs et diagnostics** : afficher un nom lisible plutôt qu'une IP brute dans les journaux réseau
- **Certificats et audit de sécurité** : vérifier la cohérence entre DNS direct et inversé

## Connexions

### Notes liées
- [[DNS - Domain Name System]] - Système global dont le DNS inversé est un cas particulier

### Contexte
Souvent négligé par rapport à la résolution DNS classique, le DNS inversé est pourtant critique pour la délivrabilité des emails et le diagnostic réseau.

## Sources
- [[DNS - Domain Name System]]
- [[J1 - Formation Réseau|Formation Réseau - Jour 1]]

---
**Tags thématiques** : #réseau #dns #ptr
