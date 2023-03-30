# In progress

## Homebridge plugin for DSP w115

Takes advantage of thunderbird/homebridge-1215

### Features
* Includes ability to turn on and off 1215 smart switches

### Install
Setup is straight forward:
````bash
npm install -g homebridge-w215
````
#### Configuration:
Add the following accessory to your config.json.

````javascript
{
	"accessories": [{
		"accessory": "w215",
		"name": "Your device name",
		"host": "hostname of plug or ip address",
		"username": "admin", //default is always admin
		"password": "your device pin"
	}],
	...
}
````
#### Issues
Add a github issue and I will look into it. It's early days yet and I just got this working for my own w215 switches.

