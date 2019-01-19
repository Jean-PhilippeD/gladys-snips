const shared = require('./snips.shared.js');
const Promise = require('bluebird');
const config = require('./snips.config.js');
const fs = require('fs');
const cacheFile = config.cacheSlotsFile


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
        return injection({slot: "room", value: slots});
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
        return injection({slot: "house", value: slots});
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
        return injection({slot: "deviceType", value: slots});
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
        return injection({slot: "user", value: slots});
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
        return injection({slot: "area", value: slots});
    });
  },

  knownSlots: function() {
    return injection(shared.getCachedSlots());
  }

}

function injection(data) {

  if(!isArray(data)) {
    data = [data];
  }

  shared.cacheSlots(data); //async cache

  return shared.getClient()
    .then((client) => {
      var slots = {};

      data.forEach(function(slot) {
        slots['snips/default--' + slot.slot] = slot.value;
      });

      var injection = {"operations": 
        [
          [
            "add",
            slots
          ]
        ]
      }
      return client.publish(config.topic.injection, JSON.stringify(injection));
  });
}
