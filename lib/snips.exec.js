var shared = require('./snips.shared.js');
var config = require('./snips.config.js');
var Promise = require('bluebird');

module.exports = function exec(options){

  return shared.getClient()
  .then((client) => {

    var message = {siteId: options.deviceType.identifier.split('-')[1]};

    if(options.deviceType.deviceTypeIdentifier === 'feedback') {
      var topic = config.topic.feedback;
      if(options.state.value === 1) {
        topic += '/toggleOn';
      } else {
        topic += '/toggleOff';
      }
    }

    client.publish(topic, JSON.stringify(message));
  });
}

