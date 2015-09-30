# API-GATEWAY

### Comment effectuer un commit

```bash
sh git-commit master "Voici mon super commentaire..."
```

A la place de "master" vous pouvez mettre une autre branche bien entendu.

### Que fait ce script

```bash
#!/bin/bash

# run tests
npm test

# if tests are not 100% ok, then no need to commit...
if [ $? -eq 0 ]
  then
    git add -i
    git commit -m "$2"
    git push origin $1
fi
```

Avant de commit effectivement les modifications apportées au code, des tests pré-définis vont être executés.

Au moindre problème durant les test, un rapport d'erreurs sera affiché via la console et le commit sera annulé.

### Descriptions

- Rest API
- Stream API

### Listes des variables système ABIBAO

- ABIBAO_API_REST__EXPOSE_IP
- ABIBAO_API_REST__EXPOSE_PORT
- ABIBAO_MONGODB__DATABASE_CONNECTION
- ABIBAO_MONGODB__USERS_COLLECTION

### Versions

- node (4.1.0)
- npm (3.3.4)
- python (2.7.6)