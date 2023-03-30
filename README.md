# In progress

## Homebridge plugin for DSP w115

Takes advantage of thunderbird/homebridge-1215

### Features
* Includes ability to turn on and off w115 smart switches

### Install
Setup is straight forward:
````bash
npm install -g homebridge-w115
````
#### Configuration:
Add the following accessory to your config.json.

````javascript
{
	"accessories": [{
		"accessory": "w115",
		"name": "Your device name",
		"host": "hostname of plug or ip address",
		"username": "admin", //default is always admin
		"password": "your device pin"
	}],
	...
}
````
