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

  inject: function(req, res, next) {
    injection.knownSlots()
      .then((result) => {
        return res.json();
    });
  },

  addSlotValue: function(req, res, next) {
    shared.cacheSlot({slot: req.params.slot, value: req.body })
      .then(() => {
        return res.json();
    });
  },

  deleteSlotValue: function(req, res, next) {
    shared.uncacheSlotEntity({slot: req.params.slot, value: req.body})
      .then(() => {
        return res.json();
    });
  }
};
