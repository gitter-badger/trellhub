/**
 * @summary   Helper functions for the node app
 */
const helpers = {};

/**
 * Verify config:
 *  - GitHub/Trello auth credentials exist
 *  - No conflicting auth method/credential pairs
 *  - Proper mappings are in place for (n+1) sync jobs
 *
 * @param {string} str The string to repeat.
 * @param {number} [times=1] How many times to repeat the string.
 * @returns {string}
*/
helpers.validateConfig = function validateConfig(config) {
  // check credentials
  let githubAuthMethod = config.get('github:config:authMethod');
  let trelloAuthMethod = config.get('trello:config:authMethod');

  if (_.isUndefined(githubAuthMethod)) throw "Undefined authentication method [GitHub]";
  if (_.isUndefined(trelloAuthMethod)) throw "Undefined authentication method [Trello]";

  var validateGithub = function (type) {
    switch (type) {
      case 'basic':
        return !(_.isUndefined(config.get('github:auth:basic:username') ||
                _.isUndefined(config.get('github:auth:basic:password'))));
      case 'oauth':
        return !(_.isUndefined(config.get('github:auth:oauth:key')) ||
                _.isUndefined(config.get('github:auth:oauth:secret')));
      case 'token':
        return !(_.isUndefined(config.get('github:auth:token:token')));
      default:
        throw "Invalid authentication method [GitHub]";
    }
  }.bind(config);

  var validateTrello = function (type) {
    switch (type) {
      case 'basic':
        return !(_.isUndefined(config.get('trello:auth:key')) ||
                _.isUndefined(config.get('trello:auth:token')));
      default:
        throw "Invalid authentication method [Trello]";
    }
  }.bind(config);

  if (!validateGithub(githubAuthMethod) || !validateTrello(trelloAuthMethod)) {
    throw "Invalid authentication config. Please verify you have filled out all values for your selected auth method in config.json";
  }

  // check mappings

exports.helpers = helpers;
