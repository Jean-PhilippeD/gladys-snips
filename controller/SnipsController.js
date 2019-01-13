const config = require('../lib/snips.config.js');
const shared = require('../lib/snips.shared.js');
const injection = require('../lib/snips.inject.js');

module.exports = {

  getSatellites: function(req, res, next){
    gladys.device
      .getByService({service: config.service.name})
      .then(function(satellites){
         return res.json(satellites);
      })
  },
  
  getCachedSlots: function(req, res, next) {
    shared.getCachedSlots()
      .then((slots) => {
        return res.json(slots);
    });
  },

  inject: function(req, res,next) {
    injection.randomSlot({key: req.params.slot, values: req.body})
      .then((result) => {
        return res.json();
    });
  }
};
