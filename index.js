const nconf = require('nconf');
const helper = require('./lib/helper.js');
const hjson = require('hjson');
const GitHubClient = require('github');
const Promise = require('bluebird');
const Trello = require('node-trello');

// init config
// use hjson for JSON comment parsing
const config = nconf.file({
  file: '../config/config.json',
  formatter: hjson,
}).file({
  file: '../config/mappings.json',
  formatter: hjson,
});

const Client = module.exports = function (config) {
  if (!(this instanceof Client)) {
    return new Client(config);
  }

  if (!(config instanceof nconf)) {
    throw new Error('Invalid configuration. Unexpected error has occurred');
  }

  this.config = config;
  this.debug = config.get('global:debug');
  this.helper = helper;
};

// validate config
helper.validateConfig(config);
helper.validateMappings(config);

/**
 * Instantiates and authenticates GitHub API Client
 * @param {Object} config Global config object
 * @return {g} GitHub client
 */
function getHub(config) {
  // init client
  const authMethod = config.get('github:config:authMethod');
  const github = new GitHubClient({
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
}

/**
 * Instantiates and authenticates Trello API Client
 * @param {Object} config Global config object
 * @return {t} Trello client
 */
function getTrello(config) {
  const authMethod = config.get('trello:config:authMethod');
  const trello = {};

  switch (authMethod) {
  case 'basic':
    return new Trello(config.get('trello:auth:basic'));
  default:
    throw new Error('Invlaid authentication method [Trello]');
  }
}

getHub(config);
getTrello(config);
