var nconf = require("nconf");
nconf.argv().env();

var confName = nconf.get("ABIBAO_API_GATEWAY_SERVER_RETHINK_DB") || process.env.ABIBAO_API_GATEWAY_SERVER_RETHINK_DB;

/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name: ["api.abibao.com-"+confName],
  /**
   * Your New Relic license key.
   */
  license_key: "06d749121c1e4356b0ee9a6c265dd48642acaeec",
  logging: {
    /**
     * Level at which to log. "trace" is most useful to New Relic when diagnosing
     * issues with the agent, "info" and higher will impose the least overhead on
     * production applications.
     */
    level: "info"
  }
};
