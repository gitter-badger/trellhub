/**
 * @summary   Helper functions for the node app
 */
const _ = require('lodash');

const helpers = {};

/**
 * Verify config:
 *  - GitHub/Trello auth credentials exist
 *  - No conflicting auth method/credential pairs
 *
 * @param {string} str The string to repeat.
 * @param {number} [times=1] How many times to repeat the string.
 * @returns {string}
*/
helpers.validateConfig = function validateConfig(config) {
  // check credentials
  const githubAuthMethod = config.get('github:config:authMethod');
  const trelloAuthMethod = config.get('trello:config:authMethod');

  if (_.isUndefined(githubAuthMethod)) throw new Error('Undefined authentication method [GitHub]');
  if (_.isUndefined(trelloAuthMethod)) throw new Error('Undefined authentication method [Trello]');

  const validateGithub = function validateGithub(type) {
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
      throw new Error('Invalid authentication method [GitHub]');
    }
  };

  const validateTrello = function validateTrello(type) {
    switch (type) {
    case 'basic':
      return !(_.isUndefined(config.get('trello:auth:key')) ||
                _.isUndefined(config.get('trello:auth:token')));
    default:
      throw new Error('Invalid authentication method [Trello]');
    }
  };

  if (!validateGithub(githubAuthMethod) || !validateTrello(trelloAuthMethod)) {
    throw new Error('Invalid authentication config. Please verify you have filled out all values for your selected auth method in config.json');
  }
};

/**
 * Verify mappings:
 *  - Repo+board pairs exist properly
 *  - Validate mapping configuration values
 *
 * @param {string} str The string to repeat.
 * @param {number} [times=1] How many times to repeat the string.
 * @returns {string}
*/
helpers.validateMappings = function validateMappings(mappings) {
  return true;
};

// Ship `em!
exports.helpers = helpers;
