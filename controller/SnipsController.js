
config = require('../lib/snips.config.js');

module.exports = {

  getSatellites: function(req, res, next){
    gladys.device
      .getByService({service: config.service.name})
      .then(function(satellites){
         return res.json(satellites);
      })
  }
};
