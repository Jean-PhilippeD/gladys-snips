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
      var cachedSlots = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));

      return new Promise(function(resolve, reject) {
        for(var slot in data) {
          var slotExist = false;
          for(var existingSlot in cachedSlots) {
            if(existingSlot === slot) {
              // key slot exist, look for value inside
              slotExist = true;
              for(var i = 0; i < data[slot].length; i++) {
                if(cachedSlots[slot].indexOf(data[slot][i]) === -1) {
                  cachedSlots[slot].push(data[slot][i]);
                }
              }
            }
          }
          if(!slotExist) {
            cachedSlots[slot.slot] = data[slot];
          }
        };
  
        fs.writeFile(cacheFile, JSON.stringify(cachedSlots), function(err) {
          if(err) {
            sails.log.error(err);
            return reject(err);
          }
          return resolve(cachedSlots);
        });
      });
    },

    uncacheSlotEntity: function(data) {
      var cachedSlots = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));

      return new Promise(function(resolve, reject) {
        for(var slot in cachedSlots) {
          if(slot === data.slot) {
            var pos = cachedSlots[slot].indexOf(data.value);
            cachedSlots[slot].splice(pos, 1);
          } 
        }

        fs.writeFile(cacheFile, JSON.stringify(cachedSlots), function(err) {
          if(err) {
            sails.log.error(err);
            return reject(err);
          }
          return resolve();
        });
      });
    }
};

function getSession(room) {
  return Promise.resolve(sessions[room.toLowerCase()]);
}

