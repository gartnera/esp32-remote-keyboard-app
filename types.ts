export type RootStackParamList = {
    Devices: undefined;
    Details: {
        hostname: string,
    };
    KeyboardMouse: {
        hostname: string,
    }
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}