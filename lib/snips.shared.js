var client = null;
var sessions =  {};

const Promise = require('bluebird');
const fs = require('fs');
const connect = require('./snips.connect.js');
const config = require('./snips.config.js');
const cacheFile = config.cacheSlotsFile;

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
    },
   
    cacheSlots: function(data){
sails.log.info(data)
      var cachedSlots = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
sails.log.info(cachedSlots)
      data.forEach(function(slot) {
sails.log.info(slot);
        var slotExist = false;
        for(var i = 0; i < cachedSlots.length; i++) {
          if(cachedSlots[i].slot === slot.slot) {
            // key slot exist, look for value inside
            slotExist = true;
            for(var j = 0; j < slot.value.length; j++) {
              if(cachedSlots[i].value.indexOf(slot.value[j]) === -1) {
sails.log.info('create');
                cachedSlot[i].value.push(slot.value[j]);
              }
            }
          }
        }
        if(!slotExist) {
          cachedSlots.push({slot: slot.slot, value: slot.value});
        }
      });

      return fs.writeFile(cacheFile, JSON.stringify(cachedSlots), function(err) {
        if(err) {
          sails.log.error(err);
        }
      });
    },

    uncacheSlotEntity: function(data) {
      var cachedSlots = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));

      for(var i = 0; i < cachedSlots.length; i++) {
        if(cachedSlots[i].slot === data.slot) {
          var pos = cachedSlots[i].value.indexOf(data.value);
          cachedSlots[i].value.splice(pos, 1);
        } 
      }

      return fs.writeFile(cacheFile, JSON.stringify(cachedSlots), function(err) {
        if(err) {
          sails.log.error(err);
        }
      });
    }
};

function getSession(room) {
  return Promise.resolve(sessions[room.toLowerCase()]);
}

