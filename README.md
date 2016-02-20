# API-GATEWAY

### Description

L'api c'est la vie ! Tout converge vers le gateway.

### Scripts NPM 

Scripts | Descriptions
------------ | -------------
```npm test``` | Débute les tests TDD, BDD, etc.
```npm start``` | Lance l'application node avec Bunyan.
```npm run domain-create-all``` | Crée le model, le listener, les 3 events, les 2 queries et les 2 commands du Lcrud
```npm run domain-create-command``` | ...
```npm run domain-create-query``` | ...

### Listes des variables système ABIBAO

Noms | Descriptions
------------ | -------------
ABIBAO_API_GATEWAY_EXPOSE_IP | ...
ABIBAO_API_GATEWAY_EXPOSE_PORT | ...
ABIBAO_API_GATEWAY_LOGS_FILE | ...
ABIBAO_API_GATEWAY_SERVER_AUTH_BASIC_USERNAME | ...
ABIBAO_API_GATEWAY_SERVER_AUTH_BASIC_PASSWORD | ...
ABIBAO_API_GATEWAY_SERVER_AUTH_JWT_KEY | ...
ABIBAO_API_GATEWAY_SERVER_RETHINK_HOST | ...
ABIBAO_API_GATEWAY_SERVER_RETHINK_PORT | ...
ABIBAO_API_GATEWAY_SERVER_RETHINK_DB | ...
ABIBAO_API_GATEWAY_SERVER_RETHINK_AUTH_KEY | ...
ABIBAO_API_GATEWAY_SERVER_MAILER_USERNAME | ...
ABIBAO_API_GATEWAY_SERVER_MAILER_PASSWORD | ...
ABIBAO_API_GATEWAY_SERVER_MAILER_FROM_NAME | ...
ABIBAO_API_GATEWAY_SERVER_MAILER_FROM_EMAIL | ...
ABIBAO_API_GATEWAY_NEWRELIC_ENABLE | Utilise newrelic
ABIBAO_API_GATEWAY_CLOUD9_ENABLE | Utilise le fichier cloud9.json conmme configuration
ABIBAO_API_GATEWAY_PRODUCTION_ENABLE | Utilise un environnement de production

### Packages quality

[![Dependency Status](https://david-dm.org/abibao/api-gateway.svg?style=flat-square)](https://david-dm.org/abibao/api-gateway)
[![devDependency Status](https://david-dm.org/abibao/dev-status.svg?style=flat-square)](https://david-dm.org/abibao/#info=devDependencies)