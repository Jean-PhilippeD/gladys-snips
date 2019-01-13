const shared = require('./snips.shared.js');
const Promise = require('bluebird');
const config = require('./snips.config.js');
const fs = require('fs');
const cacheFile = sails.config.appPath + '/' + config.cacheSlotsFile
var cachedSlots = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));


/*
Perform injection in snips modelling
data hasto be an object identified by the key which corresponds to a snips slot
for exemple:
                "films" : [
                    "The Wolf of Wall Street",
                    "The Lord of the Rings"
                ]

*/
module.exports = {
  rooms: function() {
    var slots = [];

    return gladys.room.getAll()
      .then((rooms) => {
        rooms.forEach(function(room) {
          if(slots.indexOf(room.name) === -1) {
            slots.push(room.name);
          }
        });
        return injection({"room": slots});
    });
  },

  houses: function() {
    var slots = [];
    return gladys.house.getAll()
      .then((houses) => {
        houses.forEach(function(house) {
          if(slots.indexOf(house.name) === -1) {
            slots.push(house.name);
          }
        });
        return injection({"house": slots});
    });
  },

  deviceTypes: function() {
    var slots = [];

    return gladys.deviceType.getAll()
      .then((deviceTypes) => {
        deviceTypes.forEach(function(deviceType) {
          if(deviceType.tag && slots.indexOf(deviceType.tag) === -1) {
            slots.push(deviceType.tag);
          }
          if(deviceType.name && slots.indexOf(deviceType.name) === -1) {
            slots.push(deviceType.name);
          }
        });
        return injection({"deviceType": slots});
    });
  },

  users: function() {
    var slots = [];
    
    return gladys.user.get()
      .then((users) => {
        users.forEach(function(user) {
          if(slots.indexOf(user.firstname) === -1) {
            slots.push(user.firstname);
          }
          if(slots.indexOf(user.lastname) === -1) {
            slots.push(user.lastname);
          }
        });
        return injection({"user": slots});
    });
  },

  areas: function() {
    var slots = [];
  
    return gladys.area.getAll()
      .then((areas) => {
        areas.forEach(function(area) {
          if(slots.indexOf(area) == -1) {
            slots.push(area.name);
          }
        });
        return injection({"area": slots});
    });
  },

  knownSlots: function() {
    return injection(shared.getCachedSlots());
  },

  randomSlot: function(data) {
    var slots = {};
    slots[data['key']] = data['values'];

    return injection(slots);
  }
}

function injection(data) {

  cacheSlots(data); //async cache

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
      
    return client.publish(config.topic.injection, JSON.stringify(injection));
  });
}

function cacheSlots(data){

  for(var key in data) {
    if(cachedSlots.hasOwnProperty(key)) {
      // key slot exist, look for value inside
      for(var i = 0; i < data[key].length; i++) {
        if(cachedSlots[key].indexOf(data[key][i]) === -1) {
          cachedSlots[key].push(data[key][i]);
        }
      }
    } else {
      cachedSlots[key] = data[key];
    }
  }

  return fs.writeFile(cacheFile, JSON.stringify(cachedSlots), function(err) {
    if(err) {
      sails.log.error(err);
    }
  });
}

