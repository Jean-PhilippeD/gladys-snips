var translationsEN = {
    CONFIGURE_SATELLITE: 'Configure satellites',
    CONFIGURE_WAKEWORDS: 'Configure wakewords',
    SITEID: 'Site Id',
    FEEDBACK: 'Feedback state',
    WAKEWORD: 'Wakeword',
    WAKEWORD_TOOLTIP: 'Wakeword label defined in Snips',
    ACTION: 'Action',
    USER: 'User',
    WAKEWORD_TOOLTIP: 'Wakewords can be generic, or specific for each user, this way, snips can recognize users',
    CONFIGURE_MQTT_URL: 'MQTT Broker address',
    DEFAULT_MQTT_URL: 'mqtt://localhost:1883'
}

var translationsFR = {
    CONFIGURE_SATELLITE: 'Configurer les satellites',
    CONFIGURE_WAKEWORDS: 'Configurer les mots de déclenchement de l\'écoute',
    SITEID: 'Pièce ou est situé le satellite',
    FEEDBACK: 'Etat du feedback',
    WAKEWORD: 'Mot',
    WAKEWORD_TOOLTIP: 'Le nom donné au Wakeword dans Snips',
    ACTION: 'Action',
    USER: 'Utilisateur',
    WAKEWORD_TOOLTIP: 'Les mots de déclenchements peuvent être propre à chaque utilisateur, permettant ainsi la reconnaissance d\'utilisateur',
    CONFIGURE_MQTT_URL: 'Addresse du broker MQTT',
    DEFAULT_MQTT_URL: 'mqtt://localhost:1883'
}

angular
    .module('gladys')
    .config(['$translateProvider', function($translateProvider) {
        // add translation table
        $translateProvider
            .translations('en', translationsEN)
            .translations('fr', translationsFR);
}]);
