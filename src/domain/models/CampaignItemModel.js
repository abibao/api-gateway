"use strict";

module.exports = function(thinky) {
  
  var type = thinky.type;
  var r = thinky.r;
  
  var CampaignItemModel = thinky.createModel("campaigns_items", {
    // fields
    optional: type.boolean().required().default(false),
    title: type.string().required(),
    description: type.string(),
    component: type.object().required(),
    data: type.any(),
    label: type.string().required(),
    // linked
    campaign: type.string().required(),
    // automatic
    createdAt: type.date().required().default(r.now()),
    modifiedAt: type.date().required().default(r.now())
  }); 
  
  CampaignItemModel.pre('save', function(next) {
    var data = this;
    data.modifiedAt = r.now();
    next();
  });
  
  return CampaignItemModel;
  
};