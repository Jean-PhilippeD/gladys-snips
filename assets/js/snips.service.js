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
            inject: inject
        };

        return service;

        function getSatellites() {
            return $http({method: 'GET', url: '/snips/satellites'});
        }

        function getCachesSlots() {
            return $http({method: 'GET', url: '/snips/known/slots'});
        }

        function inject(key, data) {
            return $http({method: 'PUT', url: '/snips/inject/' + key, data: data});
        }

    }
})();
