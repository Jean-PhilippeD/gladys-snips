(function () {
   'use strict';

    angular
        .module('gladys')
        .controller('SnipsCtrl', SnipsCtrl);

    SnipsCtrl.$inject = ['snipsService', 'paramService', 'moduleService', 'deviceService', 'roomService', 'userService', '$scope'];

    function SnipsCtrl(snipsService, paramService, moduleService, deviceService, roomService, userService, $scope) {
        var vm = this;
        vm.addSatellite = addSatellite;
        vm.deleteSatellite = deleteSatellite;
        vm.updateSatellite = updateSatellite;
        vm.toggleFeedback = toggleFeedback;
        vm.updateWakeword = updateWakeword;
        vm.updateBrokerUrl = updateBrokerUrl;
        vm.deleteSlotValue = deleteSlotValue;
        vm.addSlotValue = addSlotValue;
        vm.inject = inject;

        vm.satellites = [];
        vm.rooms = [];
        vm.wakewords = [];
        vm.newValue = {};

        var wakewords = [];

        vm.params = {
            'SNIPS_MQTT_URL': '',
            'SNIPS_WAKEWORDS': ''
        };

        activate()

        function activate() {
            getParams();
            getSatellites();
            getRooms();
            initNewSatellite();
            getCachedSlots();
        }

        function inject() {
          return snipsService.inject();
        }

        function deleteSlotValue(key, value) {
          snipsService.deleteSlotValue(key, value)
            .then(function() {
              vm.slots[key].splice(vm.slots[key].indexOf(value),1);
          });
        }

        function addSlotValue(key, value) {
          if(vm.slots[key].indexOf(value) === -1) {
            snipsService.addSlotValue(key, value)
              .then(function() {
                vm.slots[key].push(vm.newValue[key]);
                vm.newValue[key] = '';
            });
          }
        }

        function getCachedSlots() {
          return snipsService.getCachesSlots()
            .then(function(slots) {
              vm.slots = slots.data;
          });
        }

        function initNewSatellite() {
            vm.newSatellite = {
                name: 'Snips satellite',
                protocol: 'mqtt',
                service: 'snips',
                identifier: 'snips-'
            },
            vm.deviceTypes = [
                {
                    name: 'Feedback',
                    type: 'binary',
                    identifier: 'feedback',
                    tag: '',
                    sensor: false,
                    display: false,
                    min: 0,
                    max: 1,
                    lastValue: 1
                }
            ]
        }

        function updateBrokerUrl(){
            return paramService.update('SNIPS_MQTT_URL', {value: vm.params['SNIPS_MQTT_URL']});
        }

        function toggleFeedback(satellite) {
            if(satellite.feedback.value === 1) {
                satellite.feedback.value = 0;
            } else {
                satellite.feedback.value = 1;
            }
            return deviceService.exec({id: satellite.feedback.type}, satellite.feedback.value);
        }

        function updateWakeword(data) {
            var newWakewords = [];
            var userUpdated = false;

            angular.forEach(wakewords, function(wakeword) {
                var tmp = wakeword.split(':');
                if(data.user.id === parseInt(tmp[1])) {
                    tmp[0] = data.wakeword;
                    userUpdated = true;
                }
                newWakewords.push(tmp.join(':'));
            });
            if(!userUpdated) {
                newWakewords.push(data.wakeword + ':' + data.user.id);
            }
            return paramService.update('SNIPS_WAKEWORDS', {value: newWakewords.join(';')});
        }

        function getParams() {
            return moduleService.get()
                .then(function(modules) {
                    for(var i = 0; i < modules.data.length; i++) {
                        if(modules.data[i].name === 'Snips') {
                             vm.moduleId = modules.data[i].id;
                        }
                    }
                    return paramService.getByModule(vm.moduleId);
            })
                .then(function(params) {
                    for(var i = 0; i < params.data.length; i++) {
                        vm.params[params.data[i].name] = params.data[i].value;
                    }
                    return userService.get();
            })
                .then(function(users) {
                    wakewords = vm.params['SNIPS_WAKEWORDS'].split(';');
                    return angular.forEach(users.data, function(user) {
                        var wu = {
                           user: {
                               name: user.firstname + ' ' + user.lastname, 
                               id: user.id,
                           }
                        };

                        return angular.forEach(wakewords, function(wakeword) {
                            var tmp = wakeword.split(':');
                            if(wu.user.id === parseInt(tmp[1])) {
                                wu['wakeword'] = tmp[0];
                            }
                            if(vm.wakewords.indexOf(wu) === -1) {
                                vm.wakewords.push(wu);
                            }
                        });
                   });
            })
        }

        function getRooms() {
            return roomService.get({skip: 0, take: 1000})
                .then(function(rooms) {
                    vm.rooms = rooms.data;
            });
        }

        function getSatellites() {
            return snipsService.getSatellites()
                .then(function(satellites) {
                    return angular.forEach(satellites.data, (function(satellite) {
                         return deviceService.getDeviceTypesDevice(satellite.id)
                             .then(function(satelliteTypes) {
                                 var sat = {id: satellite.id};
                                 for(var i = 0; i < vm.rooms.length; i++) {
                                     if(vm.rooms[i].id === satellite.room) {
                                         sat['room'] = vm.rooms[i].name;
                                         break;
                                     }
                                 }

                                 for(var i = 0; i < satelliteTypes.data.length; i++) {
                                     sat[satelliteTypes.data[i].identifier] = {value: satelliteTypes.data[i].lastValue, type: satelliteTypes.data[i].id};
                                 }
                                 vm.satellites.push(sat);
                         });
                    }));
            })
        }

        function addSatellite(satellite) {
            satellite.identifier += satellite.room.name.toLowerCase();
            return deviceService.create(satellite, vm.deviceTypes)
                .then(function(satellite) {
                     var sat = {id: satellite.data.device.id};
                     for(var i = 0; i < vm.rooms.length; i++) {
                         if(vm.rooms[i].id === satellite.data.device.room) {
                             sat['room'] = vm.rooms[i].name;
                             break;
                         }
                     }
                     for(var i = 0; i < satellite.data.types.length; i++) {
                         sat[satellite.data.types[i].identifier] = satellite.data.types[i].lastValue;
                     }
                     vm.satellites.push(sat);
                     initNewSatellite();
                });
        }

        function deleteSatellite(id) {
            return deviceService.deleteDevice(id)
                .then(function() {
                    for(var i = 0; i < vm.satellites.length; i++) {
                        if(vm.satellites[i].id === id) {
                            vm.satellites.splice(i,1);
                        }
                    }
            });
        }

        function updateSatellite(satellite) {
        
        }
    }
})();
