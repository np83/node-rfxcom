// Type definitions for rfxcom.js v???
// Project: https://github.com/bigkevmcd/node-rfxcom
// Definitions by: Microsoft TypeScript <http://typescriptlang.org>, DefinitelyTyped <https://github.com/borisyankov/DefinitelyTyped>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/************************************************
*                                               *
*               Node.js v0.10.1 API             *
*                                               *
************************************************/

/************************************************
*                                               *
*                   GLOBAL                      *
*                                               *
************************************************/

declare module RfxCom {
    export interface IRfxComRequire {
    }

    export var lighting2: {
        AC : number,
    }

    export interface ILighting2 {
        switchOn(deviceId: string, callback?);
        switchOff(deviceId: string, callback?);
    }

    export interface IRfxCom {
        new (port: string, options: any);
    }
}