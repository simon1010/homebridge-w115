'use strict';

var inherits = require('util').inherits;
const requireUncached = require('require-uncached');

var Characteristic, Service;

module.exports = function(homebridge) {
    console.log("homebridge API version: " + homebridge.version);
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory('homebridge-w115', 'w115', W115Accessory, false);
};

function W115Accessory(log, config, api) {

    this.log = log;
    this.config = config;
    this.dsp = requireUncached('hnap/js/soapclient');
    this.name = config.name || 'DSP W115 Smart Plug';
    this.url = "http://" + config.host + "/HNAP1";
    this.username = config.username || 'admin';
    this.password = config.password;
    this.legacy = config.legacy || false;

    this.power = false;
    
    this.model = 'DSP W115';
    this.serialNumber = '12345';
    this.manufacturer = 'D-Link';
    var self = this;
    this.login(function(loginStatus) {
        if (!loginStatus) {
            return;
        }
        self.getState(function(deviceStatus) {
            if (!deviceStatus) {
                return;
            }
            self.power = deviceStatus.power;
        });
    });
}

W115Accessory.prototype.login = function(callback) {
    this.dsp.login(this.username, this.password, this.url).done(callback);
};

W115Accessory.prototype.getPowerState = function(callback) {
    this.getState(function(settings){
        callback(null, settings.power);
    });
}

W115Accessory.prototype.setPowerState = function(state, callback) {
    var self = this;
    console.log(state);
    if (state) {
        this.dsp.on().done(function(res) {
            console.log(res);
            self.power = res;
            callback();
        });
    } else {
        this.dsp.off().done(function(res) {
            console.log(res);
            self.power = res;
            callback();
        });
    }
};

W115Accessory.prototype.getState = function(callback) {
    var self = this;
    this.retries = 0;
    this.dsp.state().done(function(state) {
        // Chances are of state is error we need to login again....
        if (state == 'ERROR') {
            if (self.retries >= 5) {
                return;
            }
            self.retries += 1;
            self.login(function(loginStatus) {
                self.getState(callback);
            });
            return;
        }

        self.dsp.temperature().done(function(temperature) {
            var settings = {
                power: state == 'true',
                consumption: parseInt(consumption),
                totalConsumption: parseFloat(totalConsumption),
                temperature: parseFloat(temperature)
            }
            console.log("Values");
            console.log(settings);
            self.retries = 0;
            callback(settings);
        });
    });
};

W115Accessory.prototype.identify = function(callback) {
    callback();
};

W115Accessory.prototype.getServices = function() {
    this.informationService = new Service.AccessoryInformation();

    this.informationService.setCharacteristic(Characteristic.Manufacturer, 'D-Link');
    this.informationService.setCharacteristic(Characteristic.Model, 'DSP W115');
    this.informationService.setCharacteristic(Characteristic.SerialNumber, '123456789');

    // Setup Switch Characteristics
    //================================
    this.switchService = new Service.Switch(this.name);
    // Power
    this.switchService.getCharacteristic(Characteristic.On).on('get', this.getPowerState.bind(this))
        .on('set', this.setPowerState.bind(this));

    return [this.switchService];
};
