const shared = require('./snips.shared.js');
const Promise = require('bluebird');
const config = require('./snips.config.js');
const fs = require('fs');
const cacheFile = config.cacheSlotsFile


/*
Perform shared.cacheSlots in snips modelling
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
        return shared.cacheSlots({"room": slots})
          .then(() => {
            return inject(data);
        });
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
        return shared.cacheSlots({"house": slots})
          .then(() => {
            return inject(data);
        });
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
        return shared.cacheSlots({"deviceType": slots})
          .then(() => {
            return inject(data);
        });
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
        return shared.cacheSlots({"user": slots})
          .then(() => {
            return inject(data);
        });
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
        return shared.cacheSlots({"area": slots})
         .then(() => {
           return inject(data);
        });
    });
  },

  knownSlots: function() {
    return shared.getCachedSlots()
      .then((data) => {
        return inject(data);
    });
  },

  inject: function(data) {
    return inject(data);
  }
}

function inject(data) {
  return shared.getClient()
    .then((client) => {
      var slots = {};

      for(var slot in data) {
        slots['snips/default--' + slot] = data[slot];
      };

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
