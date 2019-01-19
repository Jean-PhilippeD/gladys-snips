const Promise = require('bluebird');
const fs = require('fs');
const config = require('./snips.config.js');
const inject = require('./snips.inject.js');
const cacheFile = config.cacheSlotsFile

module.exports = function setup(data) {

  var type = {
    name: 'Snips',
    service: 'snips'
  };

  sails.log.info('Snips :: Installing module...');

  /*
  * Inect Gladys entity in Snips slots so Snips will understand when user speack about those dntities
  */

  // Create the cache file
  sails.log.info('Snips :: Creating Cache file fot snips slots...');

  fs.writeFile(cacheFile, "{}", function(err) {
    if(err) {
        sails.log.error(err);
    }

    sails.log.info('Snips :: Injecting rooms slots...');
    return inject.rooms()
    .then(() => {
      sails.log.info('Snips :: Injecting house slots...');
      return inject.houses();
    })
    .then(() => {
      sails.log.info('Snips :: Injecting devicetype slot...');
      return inject.deviceTypes();
    })
    .then(() => {
      sails.log.info('Snips :: Injecting user slots...');
      return inject.users();
    })
    .then(() => {
      sails.log.info('Snips :: Injecting area slots...');
      return inject.areas;
    })
    .then(() => {
      sails.log.info('Snips :: Creating notification type...');
      return gladys.notification.install(type);
    })
    .catch((err) => {
      sails.log.warn(err);
      sails.log.warn('Snips :: Installation failed !');
    });
  });
}
