var Promise = require('bluebird');
var inject = require('./snips.inject.js');

var slots = [];

module.exports = function setup(data) {
    return gladys.room.getAll()
      .then((rooms) => {
        for(var i = 0; i < rooms.length; i++){
          slots.push(rooms[i].name);
        };
        return [inject({"room": slots}), gladys.house.getAll()];
      })
      .spread((injected, houses) => {
        slots = [];
        for(var i = 0; i < houses.length; i++){
          slots.push(houses[i].name);
        };
        return [inject({"house": slots}), gladys.deviceType.getAll()];
      })
      .spread((injected, deviceTypes) => {
        slots = [];
        for(var i = 0; i < deviceTypes.length; i++){
          slots.push(deviceTypes[i].tag);
        };
        return [inject({"deviceType": slots}), gladys.area.getAll()];
      })
      .spread((injected, areas) => {
        slots = [];
        for(var i = 0; i < areas.length; i++){
          slots.push(areas[i].tag);
        };
        return [inject({"area": slots}), gladys.user.get()];
      })
      .spread((injected, users) => {
        slots = [];
        for(var i = 0; i < users.length; i++){
          slots.push(users[i].tag);
        };
        return inject({"user": slots});
      })
      .then(() => {
        var type = {
          name: 'Snips',
          service: 'snips'
        };

        return gladys.notification.install(type);
      });
        
}
