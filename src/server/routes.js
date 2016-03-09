"use strict";

var EntitiesController = require("./controllers/entities");

exports.endpoints = [
  
  // flex as3 patch/post
  { method: "POST", path: "/v1/auth/charity", config: require("./handlers/individuals/auth/charity/update") },
  
  // individuals
  { method: "POST", path: "/v1/individuals/login", config: require("./handlers/individuals/login") },
  { method: "POST", path: "/v1/individuals/register", config: require("./handlers/individuals/register") },
  { method: "POST", path: "/v1/individual/campaign/assign/{token}", config: require("./handlers/campaigns/assign") },
  { method: "GET", path: "/v1/auth/global/informations", config: require("./handlers/individuals/auth/globalInformations") },
  { method: "PATCH", path: "/v1/auth/charity", config: require("./handlers/individuals/auth/charity/update") },
  { method: "GET", path: "/v1/auth/surveys/{urn}", config: require("./handlers/individuals/auth/surveys/read") },
  { method: "POST", path: "/v1/auth/surveys/{urn}/answers", config: require("./handlers/individuals/auth/surveys/answer") },
  
  // administrators
  { method: "POST", path: "/v1/administrators/login", config: require("./handlers/administrators/login") },
  { method: "POST", path: "/v1/administrators/register", config: require("./handlers/administrators/register") },
  
  // entities
  { method: "GET", path: "/v1/entities/charity", config: require("./handlers/entities/charity") },
  { method: "GET", path: "/v1/entities", config: require("./handlers/entities/list") },
  { method: "POST", path: "/v1/entities", config: require("./handlers/entities/create") },
  { method: "GET", path: "/v1/entities/{urn}", config: require("./handlers/entities/read") },
  { method: "PATCH", path: "/v1/entities/{urn}", config: require("./handlers/entities/update") },
  { method: "GET", path: "/v1/entities/{urn}/campaigns", config: EntitiesController.campaigns_list },
  
  // campaigns
  { method: "GET", path: "/v1/campaigns", config: require("./handlers/campaigns/list") },
  { method: "POST", path: "/v1/campaigns", config: require("./handlers/campaigns/create") },
  { method: "GET", path: "/v1/campaigns/{urn}", config: require("./handlers/campaigns/read") },
  { method: "POST", path: "/v1/campaigns/{urn}/publish", config: require("./handlers/campaigns/publish") },
  
  // constants
  { method: "POST", path: "/v1/constants", config: require("./handlers/campaigns/constants/create") },
  
  // components
  { method: "POST", path: "/v1/campaigns/items/short-text", config: require("./handlers/campaigns/items/componentShortText/create") },
  { method: "POST", path: "/v1/campaigns/items/long-text", config: require("./handlers/campaigns/items/componentLongText/create") },
  { method: "POST", path: "/v1/campaigns/items/multiple-choice", config: require("./handlers/campaigns/items/componentMultipleChoice/create") },
  
];