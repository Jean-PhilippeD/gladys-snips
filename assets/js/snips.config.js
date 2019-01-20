var translationsEN = {
    INJECT: 'Inject into snips model',
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
    DEFAULT_MQTT_URL: 'mqtt://localhost:1883',
    MANAGE_SLOTS: 'Manage known slots values',
    DESC_MQTT_URL: '',
    DESC_SATELLITE: '',
    DESC_WAKEWORDS: '',
    DESC_SLOTS: ''
}

var translationsFR = {
    INJECT: 'Injecter dans le model Snips',
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
    DEFAULT_MQTT_URL: 'mqtt://localhost:1883',
    MANAGE_SLOTS: 'Gérer les données connues par entités',
    DESC_MQTT_URL: 'Il s\'agit de l\'adresse du broker MQTT qu\'utilise Snips pour communiquer.',
    DESC_SATELLITE: 'Vous pouvez désactiver le feedback (il s\'agit du son produit par Snips pour notifier le début d\'écoute et la fin d\'écoute) pour chaque satellite. Attention, cela reste temporaire, pour le faire définitivement, veuillez mettre la valeur sound_feedback_enabled_default à false dans le fichier de configuration /etc/snips.toml',
    DESC_WAKEWORDS: 'Vous pouvez définir pour chaque utilisateur, le wakeword personnalisé que vous avez défini dans snips, ceci afin de faire de la reconnaissance de personne. Par défaut, c\'est le premier utilisateur qui est choisi.',
    DESC_SLOTS: 'Chaque slot correspond à un emplacement dans une phrase qui peut être rempli par les valeurs associées, ceci afin d\'améliorer la taille du dictionnaire local.'
}

angular
    .module('gladys')
    .config(['$translateProvider', function($translateProvider) {
        // add translation table
        $translateProvider
            .translations('en', translationsEN)
            .translations('fr', translationsFR);
}]);
