var mqtt = require('mqtt');
var handler = require('./snips.handler.js');
var shared = require('./snips.shared.js');

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
              checkIfDeviceExist(message.siteId);
              handler(topic, message);
            });

            shared.setClient(client);

            return client;
      });
};

function checkIfDeviceExist(site) {

   var param = {
       device: {
           name: 'Snips satellite',
           protocol: 'mqtt',
           service: 'snips',
           identifier: 'snips-' + site
       },
       types:[
           {
               name: 'Feedback',
               type: 'binary',
               identifier: 'feedback',
               tag: '',
               sensor: false,
               display: false,
               min: 0,
               max: 1,
               lastValue: 1
           }
       ]
    }

    return gladys.room.getAll()
       .then((rooms) => {
         for(var i = 0; i < rooms.length; i++) {
           if(rooms[i].name.toLowerCase() === site) {
               param.device.room = rooms[i].id;
               return gladys.device.create(param);
           }
         }
    });
}
