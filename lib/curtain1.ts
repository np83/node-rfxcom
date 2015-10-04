/// <reference path="_references.ts" />
module.exports = Curtain1;
/*jshint -W104 */ // Bitwise
const definesCurtain: IDefineExport = require("./defines");

/*
 * This is a class for controlling Harrison curtain controllers..
 */
function Curtain1(rfxcom: IRfxCom) {
    var self: ICurtain1 = this;
    self.rfxcom = rfxcom;
}

/*
 * Splits the device id x/y and returns the components, the deviceId will be
 * returned as the component bytes, ready for sending.
 *
 * Throws an Error if the format is invalid.
 */
Curtain1.prototype._splitDeviceId = function(deviceId : string) {
  var parts = deviceId.split("/");
  if (parts.length !== 2) {
      throw new Error("Invalid deviceId format.");
  }
  return {
      houseCode: parseInt(parts[0], 16),
      unitCode: parseInt(parts[1], 16)
  };
};

(<ICurtain1>Curtain1.prototype)._sendCommand = function(deviceId, command, callback) {
    var self: ICurtain1 = this;
    var device = self._splitDeviceId(deviceId);
    var cmdId = self.rfxcom.getCmdNumber();
    var buffer : number[] = [0x07, defines.CURTAIN1, 0x00, cmdId, device.houseCode, device.unitCode, command, 0];

  if (self.rfxcom.options.debug) {
      console.log("Sending %j", self.rfxcom.dumpHex(buffer));
  }
  self.rfxcom.serialport.write(buffer, function(err, response) {
      if (typeof callback === "function") {
          callback(err, response, cmdId);
      }
  });
  return cmdId;
};


/*
 * Open deviceId.
 */
Curtain1.prototype.open = function(deviceId, callback) {
    return (<ICurtain1>this)._sendCommand(deviceId, definesCurtain.CURTAIN_OPEN, callback);
};

/*
 * Close deviceId.
 */
Curtain1.prototype.close = function(deviceId, callback) {
    return (<ICurtain1>this)._sendCommand(deviceId, definesCurtain.CURTAIN_CLOSE, callback);
};

/*
 * Stop deviceId.
 */
Curtain1.prototype.stop = function(deviceId, callback) {
    return (<ICurtain1>this)._sendCommand(deviceId, definesCurtain.CURTAIN_STOP, callback);
};

/*
 * Open deviceId.
 */
Curtain1.prototype.program = function(deviceId, callback) {
    return (<ICurtain1>this)._sendCommand(deviceId, definesCurtain.CURTAIN_PROGRAM, callback);
};

