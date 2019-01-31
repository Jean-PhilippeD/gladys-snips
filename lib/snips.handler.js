var shared = require('./snips.shared.js');

module.exports = function(topic, message){
    var room = message.siteId.toLowerCase()
    try{
      if(topic.indexOf('hotword') >= 0){
        return findUserPerWakeword(message['modelId'])
        .then((userId) => {
          // If user not set, choose the first one
          userId = userId || 1;
          try {
            shared.sessions[room]['user'] = userId;
          } catch(e) {
            shared.sessions[room] = {user: userId, session: false};
          }
        })
      }

      if(topic.indexOf('intent') >= 0 && topic.indexOf('pushToGladysBrain')){
        shared.sessions[room]['session'] = message.sessionId;
        message.user = shared.sessions[room]['user'];
        return classify(message);
      }
    } catch(e){
        sails.log.warn(`MQTT : snips handler : fail to handle incoming message on topic ${topic}`);
        sails.log.warn(e);
    };
};

function classify(message) {

  message.roomOrigin = message.siteId.replace(/_/g, ' ');
  message.text = message.input;
  message.session = message.siteId;

  for(var i = 0; i < message.slots.length; i++) {
    message[message.slots[i].slotName] = message.slots[i].value.value.toLowerCase();
  }
 
  return gladys.user.getById({id: message.user})
  .then((user) => {
    return gladys.brain.classify(user, message);
  });
}

/*
* Find user Id for a given wakeword
*/
function findUserPerWakeword(model) {
  return gladys.param.getValue('SNIPS_WAKEWORDS')
  .then((wakewords) => {
    wakewords = wakewords.split(';');
    for(var i = 0; i < wakewords.length; i++) {
      var res = wakewords[i].split(':');
      if(res[0].split('&').indexOf(model) >= 0) {
        return res[1];
      }
    }
    return false;
  });
}
