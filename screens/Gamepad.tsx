import { Text, View, useWindowDimensions } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types';
import Joystick from '../components/joystick';
import { getWebsocketManager } from '../lib/ws';

const CURSOR_SIDE_SIZE = 75;
const CURSOR_HALF_SIDE_SIZE = CURSOR_SIDE_SIZE / 2;

type GamepadScreenProps = NativeStackScreenProps<RootStackParamList, 'Gamepad'>;

export default function Gamepad({ navigation, route }: GamepadScreenProps) {
  const dimensions = useWindowDimensions();
  const defaultStickY = dimensions.height - (dimensions.height / 2.5);
  const defaultLStickX = dimensions.width / 5;
  const defaultRStickX = dimensions.width - (dimensions.width / 5)

  const wsMan = getWebsocketManager(`ws://${route.params.hostname}:81`);
  const ws = wsMan.subscribeReact();

  const [lStick, setLStick] = useState({x: 0, y: 0});
  const [rStick, setRStick] = useState({x: 0, y: 0});

  useEffect(() => {
    const cmd = {
      "type": "gamepad",
      "x": lStick.x,
      "y": lStick.y,
      "z": rStick.x,
      "rx": rStick.y,
    }
    ws.send(JSON.stringify(cmd));
  }, [lStick, rStick])

  return (
    <View>
      <View style={{position: "absolute", margin: 20}}>
        <Text>Websocket state: {ws.state}</Text>
        <Text>{`Left: X ${lStick.x} Y: ${lStick.y}`}</Text>
        <Text>{`Right: X ${rStick.x} Y: ${rStick.y}`}</Text>
      </View>
      <Joystick styles={{top: defaultStickY, left: defaultLStickX}} valCb={setLStick}></Joystick>
      <Joystick styles={{top: defaultStickY, left: defaultRStickX}} valCb={setRStick}></Joystick>
    </View>
  )
}