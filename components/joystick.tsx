import { StyleSheet, Text, View, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData, Button, StyleProp, ViewStyle } from 'react-native';
import { useCallback, useEffect, useState, } from 'react';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

import React, { useRef } from 'react';
import {
  Animated,
  useWindowDimensions,
} from 'react-native';

const CURSOR_SIDE_SIZE = 75;
const CONTAINER_SIDE_SIZE = CURSOR_SIDE_SIZE * 2.5;
const CURSOR_HALF_SIDE_SIZE = CURSOR_SIDE_SIZE / 2;
const CONTAINER_HALF_SIDE_SIZE = CONTAINER_SIDE_SIZE / 2;

interface JoystickParamsT {
  styles: {
    top: number,
    left: number,
  },
  valCb: (coords: {x: number, y: number}) => void,
}

function throttle(func: any, delay: number) {
  let lastCalled = 0;
  return function (...args: any) {
    const now = new Date().getTime();
    if (now - lastCalled >= delay) {
      func(...args)
      lastCalled = now;
    }
  };
}

export default function Joystick(props: JoystickParamsT) {
  const stickCenter = {x: CONTAINER_HALF_SIDE_SIZE, y: CONTAINER_HALF_SIDE_SIZE}
  const touch = useRef(
    new Animated.ValueXY(stickCenter)
  ).current;
  const tCb = throttle(props.valCb, 50);
  const pan = Gesture.Pan()
    .onUpdate((e) => {
      let newX = stickCenter.x + e.translationX;
      let newY = stickCenter.y + e.translationY;
      // primitive clamping, not circle aware
      newX = Math.min(newX, CONTAINER_SIDE_SIZE - CURSOR_HALF_SIDE_SIZE);
      newX = Math.max(newX, 0 + CURSOR_HALF_SIDE_SIZE);
      newY = Math.min(newY, CONTAINER_SIDE_SIZE - CURSOR_HALF_SIDE_SIZE);
      newY = Math.max(newY, 0 + CURSOR_HALF_SIDE_SIZE);
      touch.setValue({
        x: newX,
        y: newY,
      })
      const bound = CONTAINER_HALF_SIDE_SIZE - CURSOR_HALF_SIDE_SIZE;
      const xRelCenter = -1 * (CONTAINER_HALF_SIDE_SIZE - newX);
      const yRelCenter = CONTAINER_HALF_SIDE_SIZE - newY;
      const xRanged = Math.round(xRelCenter / bound * 127);
      const yRanged = Math.round(yRelCenter / bound * 127);
      tCb({x: xRanged, y: yRanged})
    })
    .onEnd(() => {
      touch.setValue(stickCenter);
      props.valCb({x: 0, y: 0})
    })
  return (
    <GestureHandlerRootView>
      <View style={{
        top: props.styles.top - CONTAINER_HALF_SIDE_SIZE,
        left: props.styles.left - CONTAINER_HALF_SIDE_SIZE,
        ...styles.stickContainer,
      }}>
        <GestureDetector gesture={pan}>
          <Animated.View
            style={{
              left: Animated.subtract(touch.x, CURSOR_HALF_SIDE_SIZE),
              top: Animated.subtract(touch.y, CURSOR_HALF_SIDE_SIZE),
              ...styles.stick,
            }}
          />
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  stickContainer: {
    position: 'absolute',
    backgroundColor: "#A9A9A9",
    height: CONTAINER_SIDE_SIZE,
    width: CONTAINER_SIDE_SIZE,
    borderRadius: CONTAINER_HALF_SIDE_SIZE,
  },
  stick: {
    position: 'relative',
    height: CURSOR_SIDE_SIZE,
    width: CURSOR_SIDE_SIZE,
    borderRadius: CURSOR_HALF_SIDE_SIZE,
    backgroundColor: 'orange',
  }
});