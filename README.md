# API-GATEWAY

### Comment effectuer un commit

```bash
sh git-commit master "Voici mon super commentaire..."
```

A la place de "master" on peut mettre une autre branche bien entendu.

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

Ces mêmes tests seront également refait au moment du déploiment par le CI.

### Descriptions

- L'api c'est la vie ! Tout converge vers le gateway.
 
### Listes des variables système ABIBAO

- ABIBAO_API_GATEWAY_EXPOSE_IP
- ABIBAO_API_GATEWAY_EXPOSE_PORT
- ABIBAO_API_GATEWAY_SERVER_AUTH_BASIC_USERNAME
- ABIBAO_API_GATEWAY_SERVER_AUTH_BASIC_PASSWORD
- ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY
- ABIBAO_API_GATEWAY_SERVER_RETHINK_HOST
- ABIBAO_API_GATEWAY_SERVER_RETHINK_PORT
- ABIBAO_API_GATEWAY_SERVER_RETHINK_DB
- ABIBAO_API_GATEWAY_SERVER_RETHINK_AUTH_KEY
- ABIBAO_NEWRELIC_ENABLE
- ABIBAO_PRODUCTION
- ABIBAO_TEST

### Versions

- node (4.1.2)
- npm (3.3.5)
- node-gyp (3.0.3)
- python (2.7.6)

### GIT commands

- git config --global user.name "myname"
- git config --global user.email "email"