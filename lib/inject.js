var shared = require('./shared.js');
var Promise = require('bluebird');

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
    var topic = 'hermes/injection/perform';
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

      return client.publish(topic, JSON.stringify(injection));
    });
}
