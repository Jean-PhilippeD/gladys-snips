
module.exports = {
  service: {
    name: 'snips' 
  },
  topic: {
    feedback: 'hermes/feedback/sound',
    injection: 'hermes/injection/perform',
    dialog: 'hermes/dialogueManager'
  },
  cacheSlotsFile: sails.config.appPath + '/api/hooks/snips/cache/snips.slots.js'
};
