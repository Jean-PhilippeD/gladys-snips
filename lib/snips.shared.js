var client = null;
var sessions =  {};
var Promise = require('bluebird');
var connect = require('./snips.connect.js');

module.exports = {
    
    getClient: function(){

      if(client === null) {
        return connect();
      }

      return Promise.resolve(client);
    },

    setClient: function(newClient){
      client = newClient;
    },

    setSessionUser: function(userId, room){
      if(sessions[room.toLowerCase()]) {
        sessions[room.toLowerCase()]['user'] = userId;
      } else {
        sessions[room.toLowerCase()] = {user: userId, session: false};
      }
      return getSession(room);
    },

    setSessionId: function(sessionId, room){
      sessions[room.toLowerCase()]['session'] = sessionId;
      return getSession(room);
    },

    releaseSession: function(room){
      sessions[room.toLowerCase()] = {user: false, session:false};
    },

    getSession: function(room){
      return getSession(room);
    }
};

function getSession(room) {
  return Promise.resolve(sessions[room.toLowerCase()]);
}

