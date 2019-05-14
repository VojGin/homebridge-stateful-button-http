'use strict'

var Service, Characteristic

module.exports = function (homebridge) {

  Service = homebridge.hap.Service
  Characteristic = homebridge.hap.Characteristic

  homebridge.registerAccessory('homebridge-stateful-button-http', 'StatefulHttpButton', HttpButton)
}

function StatefulHttpButton(log, config) {
  this.log = log
  this.name = config.name
  this.port = config.port
  this.onStatus = false
  this._service = new Service.StatefulProgrammableSwitch(this.name)

  var that = this

  var express = require('express')
  var app = express()


  app.get('/set/0', function (req, res, next) {
    if (!that.onStatus) {
      that.onStatus = true
      that.log(that.name + ': SINGLE_PRESS')
      that._service.setCharacteristic(Characteristic.ProgrammableSwitchEvent, Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS)
    } else {
      that.onStatus = false
      that.log(that.name + ': LONG_PRESS')
      that._service.setCharacteristic(Characteristic.ProgrammableSwitchEvent, Characteristic.ProgrammableSwitchEvent.LONG_PRESS)
    }
    res.sendStatus(200)
  })

  app.get('/set/1', function (req, res, next) {
    that.log(that.name + ': DOUBLE_PRESS')
    that._service.setCharacteristic(Characteristic.ProgrammableSwitchEvent, Characteristic.ProgrammableSwitchEvent.DOUBLE_PRESS)
    res.sendStatus(200)
  })

  app.get('/set/2', function (req, res, next) {
    that.log(that.name + ': LONG_PRESS')
    that._service.setCharacteristic(Characteristic.ProgrammableSwitchEvent, Characteristic.ProgrammableSwitchEvent.LONG_PRESS)
    res.sendStatus(200)
  })

  var server = app.listen(this.port, function () {
    var host = server.address().address
    var port = server.address().port
    that.log('app listening at', host, port)
  })
}

StatefulHttpButton.prototype.getServices = function () {
  return [this._service]
}