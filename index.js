var config = require('config'),
    trello = require('node-trello'),
    t = new trello(config.key, config.token);
