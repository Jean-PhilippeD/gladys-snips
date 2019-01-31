(function () {
    'use strict';

    angular
        .module('gladys')
        .factory('snipsService', SnipsService);

    SnipsService.$inject = ['$http', 'Notification', '$translate'];

    function SnipsService($http, Notification, $translate) {
        
        var service = {
            getSatellites: getSatellites,
            getCachesSlots: getCachesSlots,
            inject: inject,
            addSlotValue: addSlotValue,
            deleteSlotValue: deleteSlotValue
        };

        return service;

        function getSatellites() {
            return $http({method: 'GET', url: '/snips/satellites'});
        }

        function getCachesSlots() {
            return $http({method: 'GET', url: '/snips/known/slots'});
        }

        function inject() {
            return $http({method: 'PUT', url: '/snips/inject'});
        }

        function addSlotValue(slot, value) {
            return $http({method: 'PUT', url: '/snips/slot/' + slot + '/add/value', data: [value]});
        }

        function deleteSlotValue(slot, value) {
            return $http({method: 'DELETE', url: '/snips/slot/' + slot + '/delete/value', data: value});
        }

    }
})();
