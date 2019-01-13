
module.exports = function(sails){

	var connect = require('./lib/snips.connect.js');
        var notify = require('./lib/snips.notify.js');
        var inject = require('./lib/snips.inject.js');
        var setup = require('./lib/snips.setup.js');
        var exec = require('./lib/snips.exec.js');
        var SnipsController = require('./controller/SnipsController.js');
	
	gladys.on('ready', function(){
		connect();
	});
	
	return {
		inject: inject,
                notify: notify,
                setup: setup,
                exec: exec,
                routes: {
                    before: {
                        'get /snips/satellites': (req, res, next) => sails.hooks.policies.middleware.checktoken(req, res, next),
                        'get /snips/known/slots': (req, res, next) => sails.hooks.policies.middleware.checktoken(req, res, next),
                        'put /snips/inject/:slot': (req, res, next) => sails.hooks.policies.middleware.checktoken(req, res, next)
                    },
                    after: {
                       'get /snips/satellites': SnipsController.getSatellites,
                       'get /snips/known/slots': SnipsController.getCachedSlots,
                       'put /snips/inject/:slot': SnipsController.inject
                    }
                }
	};

};
