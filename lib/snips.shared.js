var client = null;
var sessions =  {};

const Promise = require('bluebird');
const fs = require('fs');
const connect = require('./snips.connect.js');
const config = require('./snips.config.js');
const cacheFile = sails.config.appPath + '/' + config.cacheSlotsFile;

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

    sessions: {
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
    },

    getCachedSlots: function(){
      return Promise.resolve(JSON.parse(fs.readFileSync(cacheFile, 'utf8')));
    }
};

function getSession(room) {
  return Promise.resolve(sessions[room.toLowerCase()]);
}

