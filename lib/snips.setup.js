const Promise = require('bluebird');
const fs = require('fs');
const config = require('./snips.config.js');
const inject = require('./snips.inject.js');
const cacheFile = sails.config.appPath + '/' + config.cacheSlotsFile

module.exports = function setup(data) {
  /*
  * Inect Gladys entity in Snips slots so Snips will understand when user speack about those dntities
  */

  // Create the cache file
  fs.writeFile(cacheFile, "{}", function(err) {
    if(err) {
        return sails.log.error(err);
    }
  });

  inject.rooms()
    .then(() => {
      return inject.houses();
  })
    .then(() => {
      return inject.deviceTypes();
  })
    .then(() => {
      return inject.users();
  })
    .then(() => {
      return inject.areas;
  })
  .catch((err) => {
    sails.log.warn(err);
    sails.log.warn('Snips :: Automatic injection failed !');
  });

  var type = {
    name: 'Snips',
    service: 'snips'
  };

  return gladys.notification.install(type);
}
