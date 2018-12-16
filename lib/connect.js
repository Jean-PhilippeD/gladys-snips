var mqtt = require('mqtt');
var handler = require('./handler.js');
var shared = require('./shared.js');

module.exports = function(){

    return gladys.param.getValue('SNIPS_MQTT_URL')
      .then(function(url){
             
            var client = mqtt.connect(url);

            client.on('connect', function () {
              //client.subscribe('gladys/brain/#');
              client.subscribe('hermes/intent/#');
              client.subscribe('hermes/hotword/default/detected');
              sails.log.info(`Successfully connected to MQTT : ${url}`);
            });

            client.on('error', function(err){
                sails.log.warn(`Error on MQTT : ${url} : ${err}`);
            });

            client.on('message', function (topic, message) {
              sails.log.info(`Snips : New message in topic ${topic}`);
              message = JSON.parse(message.toString());
              handler(topic, message);
            });

            shared.setClient(client);

            return client;
      });

    
};
