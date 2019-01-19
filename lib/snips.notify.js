var shared = require('./snips.shared.js');
var config = require('./snips.config.js');
var Promise = require('bluebird');

module.exports = function(message, user){

  if(message.answerRoom) {
    var room = message.answerRoom.name.toLowerCase();
  } else {
    var room = 'entree'; 
  }

  return gladys.house.isUserAtHome({house: 1, user: user.id})
  .then((isAtHome) => {
    if(isAtHome) {
      return emit(message, room);
    } else {
      return Promise.reject({message: 'ko'});
    }
  })
  .catch(() => {return Promise.reject({message: 'ko'})}); // if ko we continue the notifcation chain
};

function emit(message, room) {
  var topic = config.topic.dialog;

  return shared.getClient()
  .then((client) => {
    return [client, shared.sessions[room]];
  })
  .spread((client, session) => {
    message['siteId'] = room;
    if(!session['session']) {
      topic += '/startSession'
      if(!message.needAnswer) {
        message['init'] = {type: 'notification', text: message['text']};
      } else {
        message['init'] = {type: 'action', text: message['text'], canBeEnqueued: true};
      }
    } else if(session['session']) {
      message['sessionId'] = session['session'];
      if(message.needAnswer) {
        topic += '/continueSession';
       } else {
        topic += '/endSession';
       }
    }

    client.publish(topic, JSON.stringify(message));
  });
}
