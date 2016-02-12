\"use strict\";

exports.endpoint = function() {
  var $JS_CONTROLLER_CLASSNAME = require('./../c/$JS_CONTROLLER_NAME');
  var endpoint = {
    method: '$JS_HTTP_METHOD', 
    path: '$JS_HTTP_PATH', 
    config: $JS_CONTROLLER_CLASSNAME.$JS_CONTROLLER_METHOD
  };
  return endpoint;
};