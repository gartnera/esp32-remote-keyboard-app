import { StyleSheet, Text, View, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData, Button } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

import React, { useRef } from 'react';
import {
  Animated,
  useWindowDimensions,
} from 'react-native';
import Joystick from '../components/joystick';

const CURSOR_SIDE_SIZE = 75;
const CURSOR_HALF_SIDE_SIZE = CURSOR_SIDE_SIZE / 2;

type GamepadScreenProps = NativeStackScreenProps<RootStackParamList, 'Gamepad'>;

export default function Gamepad({ navigation, route }: GamepadScreenProps) {
  const dimensions = useWindowDimensions();
  const defaultStickY = dimensions.height - (dimensions.height / 2.5);
  const defaultLStickX = dimensions.width / 5;
  const defaultRStickX = dimensions.width - (dimensions.width / 5)

  const [lStick, setLStick] = useState({x: 0, y: 0});
  const [rStick, setRStick] = useState({x: 0, y: 0});

  return (
    <View>
      <View style={{position: "absolute", margin: 20}}>
        <Text>{`Left: X ${lStick.x} Y: ${lStick.y}`}</Text>
        <Text>{`Right: X ${rStick.x} Y: ${rStick.y}`}</Text>
      </View>
      <Joystick styles={{top: defaultStickY, left: defaultLStickX}} valCb={setLStick}></Joystick>
      <Joystick styles={{top: defaultStickY, left: defaultRStickX}} valCb={setRStick}></Joystick>
    </View>
  )
}