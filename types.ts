import {KeyCommand} from './lib/hid'

export type RootStackParamList = {
    Devices: undefined;
    Details: {
        hostname: string,
    };
    KeyboardMouse: {
        hostname: string,
    }
    Macros: {
        hostname: string,
    }
    AddMacro: undefined;
}

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}