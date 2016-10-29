// Constants
const GITHUB_AUTH_BASIC  = 'basic',
      GITHUB_AUTH_OAUTH  = 'oauth',
      GITHUB_AUTH_OAUTH2 = 'oauth',
      GITHUB_AUTH_TOKEN  = 'token';

// init config
var config = require('config');

// init Trello
var t      = require('node-trello'),
    trello = new t(
      config.key,
      config.token
    );


/**
 * Instantiates and authenticates GitHub API Client
 * @param {Object} config Global config object
 * @return {g} GitHub client
 */
function getHub(config) {
  // init client
  var g = require('github'),
      authConfig = {},
      github = new g({
        debug:            config.github.debug,
        protocol:         config.github.protocol,
        host:             config.github.host,
        pathPrefix:       config.github.pathPrefix,
        headers:          config.github.headers,
        Promise:          require('bluebird'),
        followRedirects:  false,
        timeout:          config.github.timeout
      });

  // authenticate
  authConfig.type = config.github.authType;
  switch (authConfig.type) {
    case GITHUB_AUTH_BASIC:
      authConfig.username = config.github.username;
      authConfig.password = config.github.password;
      break;
    case GITHUB_AUTH_OAUTH:
      authConfig.token = config.github.token;
      break;
    case GITHUB_AUTH_OAUTH2:
      authConfig.key = config.github.key;
      authConfig.secret = config.github.secret;
      break;
    case GITHUB_AUTH_TOKEN:
      authConfig.token = config.github.token;
      break;
    default:
      throw 'Invalid Github authType ' + config.github.authType;
  }

  github.authenticate(authConfig);
}
