const config = require('./config');     // App config
const appConst = require('./appConst');  // App constants
const helpers = require('./helpers');   // App helpers

/**
 * Instantiates and authenticates GitHub API Client
 * @param {Object} config Global config object
 * @return {g} GitHub client
 */
function getHub(config) {
    // init client
  let g = require('github'),
    authConfig = {},
    github = new g({
      debug: config.github.debug,
      protocol: config.github.protocol,
      host: config.github.host,
      pathPrefix: config.github.pathPrefix,
      headers: config.github.headers,
      Promise: require('bluebird'),
      followRedirects: false,
      timeout: config.github.timeout,
    });

    // authenticate
  authConfig.type = config.github.authType;
  switch (authConfig.type) {
  case GITHUB_AUTH_BASIC:
    authConfig.username = config.github.username;
    authConfig.password = config.github.password;
    break;
  case GITHUB_AUTH_OAUTH && !authConfig.key:
    authConfig.token = config.github.token;
    break;
  case GITHUB_AUTH_OAUTH:
    authConfig.key = config.github.key;
    authConfig.secret = config.github.secret;
    break;
  case GITHUB_AUTH_TOKEN:
    authConfig.token = config.github.token;
    break;
  default:
    throw `Invalid Github authType ${config.github.authType}`;
  }

  github.authenticate(authConfig);
  return github;
}

/**
 * Instantiates and authenticates Trello API Client
 * @param {Object} config Global config object
 * @return {t} Trello client
 */
function getTrello(config) {
  let t = require('node-trello'),
    trello = new t(
            config.trello.key,
            config.trello.token
        );

  return trello;
}

getHub(config);
getTrello(config);
