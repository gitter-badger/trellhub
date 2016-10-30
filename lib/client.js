const helper = require('./lib/helper.js');
const hjson = require('hjson');
const Promise = require('bluebird');

const TrellHubClient = module.exports = function (config) {
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


getHub(config);
getTrello(config);
