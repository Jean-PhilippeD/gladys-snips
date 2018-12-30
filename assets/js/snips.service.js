(function () {
    'use strict';

    angular
        .module('gladys')
        .factory('snipsService', SnipsService);

    SnipsService.$inject = ['$http', 'Notification', '$translate'];

    function SnipsService($http, Notification, $translate) {
        
        var service = {
            getSatellites: getSatellites
        };

        return service;

        function getSatellites() {
            return $http({method: 'GET', url: '/snips/satellites'});
        }
    }
})();
