"use strict";

var normalize = require("path").normalize;
var resolve = require("path").resolve;

var AuthController = require("./controllers/auth");
var EntitiesController = require("./controllers/entities");

exports.endpoints = [
  
  // www - dashboard
  { method: "GET", path: "/dashboard/{param*}", handler: { directory: { defaultExtension: "html", path: normalize(resolve(__dirname,"..","www/dashboard")) } } },
  
  // individuals
  { method: "POST", path: "/v1/individuals/login", config: require("./handlers/individuals/login") },
  { method: "POST", path: "/v1/individuals/register", config: require("./handlers/individuals/register") },
  { method: "POST", path: "/v1/individual/campaign/assign/{token}", config: require("./handlers/campaigns/assign") },
  { method: "GET", path: "/v1/auth/global/informations", config: require("./handlers/individuals/auth/globalInformations") },
  
  // administrators
  { method: "POST", path: "/v1/administrators/login", config: require("./handlers/administrators/login") },
  { method: "POST", path: "/v1/administrators/register", config: require("./handlers/administrators/register") },
  
  // auth
  { method: "POST", path: "/v1/auth/surveys/{urn}/answers", config: AuthController.surveysAnswers },
  { method: "GET", path: "/v1/auth/surveys/{urn}", config: AuthController.surveysRead },
  
  // entities
  { method: "GET", path: "/v1/entities", config: require("./handlers/entities/list") },
  { method: "POST", path: "/v1/entities", config: require("./handlers/entities/create") },
  { method: "GET", path: "/v1/entities/{urn}", config: require("./handlers/entities/read") },
  { method: "PATCH", path: "/v1/entities/{urn}", config: require("./handlers/entities/update") },
  { method: "GET", path: "/v1/entities/{urn}/campaigns", config: EntitiesController.campaigns_list },
  
  // campaigns
  { method: "GET", path: "/v1/campaigns", config: require("./handlers/campaigns/list") },
  { method: "POST", path: "/v1/campaigns", config: require("./handlers/campaigns/create") },
  { method: "GET", path: "/v1/campaigns/{urn}", config: require("./handlers/campaigns/read") },
  //{ method: "POST", path: "/v1/campaigns/{urn}/publish", config: require("./handlers/campaigns/publish") },
  //{ method: "POST", path: "/v1/campaigns/{urn}/constants", config: require("./handlers/campaigns/constants/create") },
  //{ method: "PATCH", path: "/v1/campaigns/{urn}/constants", config: require("./handlers/campaigns/constants/update") },
  //{ method: "DELETE", path: "/v1/campaigns/{urn}/constants", config: require("./handlers/campaigns/constants/delete") },
  //{ method: "POST", path: "/v1/campaigns/{urn}/items", config: require("./handlers/campaigns/items/create") },
  
  // components
  { method: "POST", path: "/v1/campaigns/items/short-text", config: require("./handlers/campaigns/items/componentShortText/create") },
  { method: "POST", path: "/v1/campaigns/items/long-text", config: require("./handlers/campaigns/items/componentLongText/create") },
  { method: "POST", path: "/v1/campaigns/items/multiple-choice", config: require("./handlers/campaigns/items/componentMultipleChoice/create") },
  
];