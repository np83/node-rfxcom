/// <reference path="../Scripts/typings/node/node.d.ts" />

interface ISerialport {
    write(buffer: number[], callback: (err, response) => any);
    on: (ev: string, dataCallBack: (data: number[]) => any) => any;
    flush(callBack: () => void);
};

interface IOptions {
    debug: boolean;
    port: ISerialport;
}

interface IRfxComDevice {
}

interface IRfxCom extends NodeJS.EventEmitter {
    _cmd: number;
    device: any;
    handlers: string[];

    options: IOptions;

    serialport: ISerialport;

    getCmdNumber(): number;

    rfxtrxParser: () => (emmiter: any, buffer: number[]) => any;

    dumpHex(value: number[], prefix? : string | boolean) : string[];
    stringToBytes: (value: string) => number[];
    bytesToUint32: (value: number[]) => number;
    bytesToUint48: (value: number[]) => number;

    messageHandler: (data: number[]) => void;
    statusHandler: (data: number[]) => void;

    elec23Handler: (data: number[]) => void;
    security1Handler: (data: number[]) => void;
    temp19Handler: (data: number[]) => void;
    temphumidity19Handler: (data: number[]) => void;
    lighting1Handler: (data: number[]) => void;
    lighting2Handler: (data: number[]) => void;
    lighting5Handler: (data: number[]) => void;
    rfxmeterHandler: (data: number[]) => void;
    weightHandler: (data: number[]) => void;
    rfxsensorHandler: (data: number[]) => void;
    tempbaro12Handler: (data: number[]) => void;

    open: () => void;
    initialise: (callBack) => void;
    reset: (callBack : (err, response, cmdId: number) => void) => number;
    delay: (nrOfMiliSeconds: number) => void;
    flush: (callBack: () => void) => void;

    getStatus: (callBack: (err, response, cmdId: number) => void) => void; // same as call back signature of initialize.
    enable: (protocols: IExportProtocolDefinition[], callBack: (err, response, cmdId: number) => void) => void;
    save: (callBack: (err, response, cmdId: number) => void) => void;

    sendMessage: (type: number, subtype: number, cmd: number, extra: number[],
    callBack: (err, response, cmdId: number) => void)
    => number;
}

interface IBasicEvent { // Can't add rssi Elec23 does not have it.
    subtype: number;
    id: string;
}

interface IElec23Event extends IBasicEvent {
    count: number;
    currentWatts: number;
    totalWatts: number;
};

interface ISecurity1Event extends IBasicEvent {
    deviceStatus: number;
    batteryLevel: number;
    rssi: number;
    tampered: number;
};

interface ITemp19Event extends IBasicEvent {
    seqnbr: number;
    temperature: number;
    batteryLevel: number;
    rssi: number;
};

interface ITemphumidity19Event extends IBasicEvent {
    seqnbr: number;
    temperature: number;
    humidity: number;
    humidityStatus: number;
    batteryLevel: number;
    rssi: number;
};

interface ILighting1Event /*extends IBasicEvent*/ { // Can't use basic type, substype has type string.
    id: string;
    subtype: string;
    seqnbr: number;
    housecode: string;
    unitcode: number;
    command: string;
    rssi: number;
};

interface ILighting2Event extends IBasicEvent {
    seqnbr: number;
    unitcode: number;
    command: string;
    level: number;
    rssi: number;
} ;

interface ILighting5Event extends IBasicEvent { // rssi also missing.
    unitcode: number;
    command: string;
    seqnbr: number;
};

interface IRfxMeterEvent {
    subtype: number;
    id: string;
    seqnbr: number;
    counter: number;
};

interface IWeightEvent extends IBasicEvent {
    seqnbr: number;
    weight: number;
    rssi: number;
    batteryLevel: number;
};

interface IRfxComSensorEvent extends IBasicEvent {
    seqnbr: number;
    rssi: number;
    message: number;
}

interface ITempbaro12Event extends IBasicEvent {
    temperature: number;
    humidity: number;
    humidityStatus: number;
    barometer: number;
    forecast: number;
    batteryLevel: number;
    rssi: number;
};

interface IBasicDeviceAddress {
    houseCode: number;
    unitCode: number;
};

interface IRfxComBaseItem<TAddress> {
    rfxcom: IRfxCom;
    subtype: number;

    _splitDeviceId: (deviceId: string) => TAddress;
};

// Curtain1

interface ICurtain1 extends IRfxComBaseItem<IBasicDeviceAddress> {
    open: (deviceId, callback) => any;
    close: (deviceId, callback) => any;
    stop: (deviceId, callback) => any;
    program: (deviceId, callback) => any;

    _sendCommand(deviceId: string, value: number, callback: (error, response, cmdId: number) => any);
}

//interface ICurtainAdress {
//    houseCode: number;
//    unitCode: number;
//}

// Lighting 1

interface ILighting1 extends IRfxComBaseItem<IBasicDeviceAddress> {
    chime: (deviceId, callBack) => any;

    _sendCommand(deviceId: string, value: number, callback: (error, response, cmdId: number) => any);
}

// Lighting 2
interface ILighting2 extends IRfxComBaseItem<ILightingAddress2And5> {
    _sendCommand(deviceId: string, command: number, somethingForLighting2: any, callback: (error, response, cmdId: number) => any);

    switchOn: (deviceId: string, callback: (error, response, cmdId: number) => any) => any;
    switchOff: (deviceId: string, callback: (error, response, cmdId: number) => any) => any;
    setLevel: (deviceId: string, level : number, callback: (error, response, cmdId: number) => any) => any;
}

interface ILightingAddress2And5 {
    idBytes: number[];
    unitCode: string;
};

// Lighting 5
interface ILighting5CommandOptions {
    mood: number;
    level: number;
};

interface ILighting5 extends IRfxComBaseItem<ILightingAddress2And5> {
    _sendCommand(deviceId: string, command: number, somethingForLighting2: any, callback: (error, response, cmdId: number) => any);

    switchOn: (deviceId: string, options: ILighting5CommandOptions, callback: (error, response, cmdId: number) => any) => any;
    switchOff: (deviceId: string, callback: (error, response, cmdId: number) => any) => any;
};

// Exports
interface IExportProtocolDefinition {
    bit: number;
    msg: number;
}

interface IExportProtocols {
    BLYSS: IExportProtocolDefinition;
    RUBICSON: IExportProtocolDefinition;
    FINEOFFSET: IExportProtocolDefinition;
    LIGHTING4: IExportProtocolDefinition;
    RSL: IExportProtocolDefinition;
    BYRONSX: IExportProtocolDefinition;
    RFU6: IExportProtocolDefinition;
    MERTIK: IExportProtocolDefinition;
    LIGHTWAVERF: IExportProtocolDefinition;
    HIDEKI: IExportProtocolDefinition;
    LACROSSE: IExportProtocolDefinition;
    FS20: IExportProtocolDefinition;
    PROGUARD: IExportProtocolDefinition;
    ROLLERTROL: IExportProtocolDefinition;
    BLINDST14: IExportProtocolDefinition;
    X10: IExportProtocolDefinition;
    ARC: IExportProtocolDefinition;
    AC: IExportProtocolDefinition;
    HOMEEASY: IExportProtocolDefinition;
    MEIANTECH: IExportProtocolDefinition;
    OREGON: IExportProtocolDefinition;
    ATI: IExportProtocolDefinition;
    VISONIC: IExportProtocolDefinition;
}

interface IExportsSecurity {
    NORMAL: number;
    NORMAL_DELAYED: number;
    ALARM: number;
    ALARM_DELAYED: number;
    MOTION: number;
    NO_MOTION: number;
    X10_DOOR_WINDOW_SENSOR: number;
    X10_MOTION_SENSOR: number;
    X10_SECURITY_REMOTE: number;
}

interface IExportsHumidity {
    NORMAL: number;
    COMFORT: number;
    DRY: number;
    WET: number;
}

interface IExportsLighting2 {
    AC: number;
    HOMEEASY_EU: number;
    ANSLUT: number;
};

interface IExportsElec23 {
    CM119_160: number;
    CM180: number;
}

interface IExportsLighting5 {
    LIGHTWAVERF: number;
    EMW100: number;
    BBSB: number;
};

interface IExportsLighting1 {
    X10: number;
    ARC: number;
    ELRO: number;
    WAVEMAN: number;
    CHACON: number;
    IMPULS: number;
    RISING_SUN: number;
    PHILIPS_SBC: number;
    ENERGENIE: number;
};

interface IExportsForecast {
    NO_FORECAST: number;
    SUNNY: number;
    PARTLY_CLOUDY: number;
    CLOUDY: number;
    RAIN: number;
}

interface IExportsRfxSensor {
    TEMP: number;
    AD: number;
    VOLTAGE: number;
    MESSAGE: number;
};

interface IExports {
    RfxCom: any;
    Lighting1;
    Lighting2;
    Lighting5;
    Curtain1;
    protocols: IExportProtocols;
    security: IExportsSecurity;
    humidity: IExportsHumidity;
    lighting2: IExportsLighting2;
    elec23: IExportsElec23;
    lighting5: IExportsLighting5;
    lighting1: IExportsLighting1;
    forecast: IExportsForecast;
    rfxsensor: IExportsRfxSensor;
}

interface IDefineExport {
    INTERFACE_CONTROL: number;
    INTERFACE_MESSAGE: number;
    TRANSCEIVER_MESSAGE: number;
    ELEC2: number;
    LIGHTING1: number;
    LIGHTING2: number;
    LIGHTING5: number;
    CURTAIN1: number;
    SECURITY1: number;
    CURTAIN_OPEN: number;
    CURTAIN_CLOSE: number;
    CURTAIN_STOP: number;
    CURTAIN_PROGRAM: number;
}