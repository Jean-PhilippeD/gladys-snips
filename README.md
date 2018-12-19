# Gladys Snips

This module connect Gladys to a MQTT broker, in order to support [Snips](https://snips.ai/).

Need Gladys version >= 3.11.7

## Documentation

To make this module work in Gladys, you need to :

- First, have a Snips system working properly
- Install the module
- Without rebooting, just set these global parameter in "Param" view in the dashboard : 
 - SNIPS_MQTT_URL => The URL of the MQTT broker used by Snips, for example : "mqtt://localhost:1883"
 - SNIPS_WAKEWORDS => A list of <assistant name:gladys user id> seperated by semi colon, for example: "gladys_1:1;gladys_2:2" (Usefull for detecting who is speaking)
- Reboot Gladys. In the logs you should see "Successfully connected to MQTT : YOUR_SERVER_URL" 

## Snips

### Setup system

* I recommand to install Snips with a Master and multiple Satellites in your room [multi device setup](https://docs.snips.ai/guides/raspberry-pi-guides/multi-device-setup-satellites)
* I also recommand to use [sam](https://docs.snips.ai/ressources/sam_reference) to manage your snips system.
* Do not forget to install [snips-injection](https://docs.snips.ai/guides/advanced-configuration/dynamic-vocabulary) so Gladys will be able to teach your rooms, devices...etc to snips.

The mosquitto instance hosted by your master device will be the one Gladys will connect onto.

### Setup your assistant

Once you get a working Snips configuration, you need to create an account on [Snips console](https://console.snips.ai/) and you have to create your own assistant.

Then, add Gladys application to your assistant.

An application is like a Gladys module in Snips system. You can add application for meteo and it will be totally independant.

In fact, eah application should handle a set of sentences for the application's purpose. 

For Gladys app, I've decided to put in a signle app, all the sentences Gladys knows, it's like the Gladys brain.

>  Gladys application is built with French sentences

The application does nothing alone, it just let Snips publish the parsed message on mosquitto and this Gladys module will consume it and push it to the brain classifier.

Once you get an assistant with Gladys app installed, you need to install this assistant to your master device so that your snips system will become autonomous.

Use sam on your management server (can be the Gladys RPI):
* `sam connect <your master device | I think it can be a satellite>`
* `sam login (login / password of your snips console account)`
* `sam update-assistant`

`Each time you will update your assistant, you'll need to run the configure action on this module because it lost the previous dynamic injection.

### Setup your hotword / wakeword

You can create your own hotword (or as many as you want, usefull if you have multiple user)

https://docs.snips.ai/guides/advanced-configuration/wakeword/personal-wakeword

If you use multiple wakewords, add them to the config array in /etc/snips.toml


Be carefull, due to a known bug on Snips, you have to re-create a directory each time you update your assistant:
`mkdir /usr/share/snips/assistant/custom_hotword`

## Support

For english support, just fork Gladys application in Snips console and create your own english sentences and don't forget to set your language assistant.

Be carefull when forking Gladys application because, as Jeedom did, we could have a lot of Gladys application in the console and I think it's not good for understanding
