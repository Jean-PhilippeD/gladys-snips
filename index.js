
module.exports = function(sails){

	var connect = require('./lib/connect.js');
        var notify = require('./lib/notify.js');
        var inject = require('./lib/inject.js');
        var setup = require('./lib/setup.js');
	
	gladys.on('ready', function(){
		connect();
	});
	
	return {
		inject: inject,
                notify: notify,
                setup: setup
	};

};
