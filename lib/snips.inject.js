var shared = require('./snips.shared.js');
var Promise = require('bluebird');
var config = require('./snips.config.js');

/*
Perform injection in snips modelling
data hasto be an object identified by the key which corresponds to a snips slot
for exemple:
                "films" : [
                    "The Wolf of Wall Street",
                    "The Lord of the Rings"
                ]

*/
module.exports = function(data){
    var slots = {}
    for (var key in data) {
      slots['snips/default--' + key] = data[key];
    }
    return shared.getClient()
    .then((client) => {
      var injection = {"operations": 
        [
          [
            "add",
            slots
          ]
        ]
      };

      return client.publish(config.topic.inection, JSON.stringify(injection));
    });
}
