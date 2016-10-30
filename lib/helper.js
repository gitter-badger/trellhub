/**
 * @summary   Helper functions for the node app
 */
const _ = require('lodash');
const Github = require('github');
const Trello = require('node-trello');
const Promise = require('bluebird');

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
  if (!(mappings instanceof nconf)) {
    throw new Error('Invalid configuration object');
  }

  return true;
};

/**
 * Instantiates and authenticates GitHub API Client
 * @param {Object} config Global config object
 * @return {g} GitHub client
 */
helpers.getGithubClient = function getGithubClient(config) {
  if (!(config instanceof nconf)) {
    throw new Error('Invalid configuration object');
  }

  // init client
  const authMethod = config.get('github:config:authMethod');
  const github = new Github({
    debug: config.get('github:config:debug'),
    protocol: config.get('github:config:protocol'),
    host: config.get('github:config:host'),
    pathPrefix: config.get('github:config:pathPrefix'),
    headers: config.get('github:config:headers'),
    Promise,
    followRedirects: false,
    timeout: config.get('github:config:timeout'),
  });

  // authenticate
  switch (authMethod) {
  case 'basic':
    github.authenticate(config.get('github:auth:basic'));
    break;
  case 'oauth':
    github.authenticate(config.get('github:auth:oauth'));
    break;
  case 'token':
    github.authenticate(config.get('github:auth:token'));
    break;
  default:
    throw new Error('Invalid authentication method [GitHub]');
  }

  return github;
};

/**
 * Instantiates and authenticates Trello API Client
 * @param {Object} config Global config object
 * @return {t} Trello client
 */
helpers.getTrelloClient = function getTrelloClient(config) {
  if (!(config instanceof nconf)) {
    throw new Error('Invalid configuration object.');
  }

  const authMethod = config.get('trello:config:authMethod');
  const trello = {};

  switch (authMethod) {
  case 'basic':
    return new Trello(config.get('trello:auth:basic'));
  default:
    throw new Error('Invlaid authentication method [Trello]');
  }
}

// Ship `em!
exports.helpers = helpers;