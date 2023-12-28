import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , TextInput, NativeSyntheticEvent, TextInputKeyPressEventData, Button} from 'react-native';
import { useEffect, useState } from 'react';

import {NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

const keyMap: { [key: string]: string } = {
    "AltLeft": "0xe2",
    "AltRight": "0xe6",
    "ArrowDown": "0x51",
    "ArrowLeft": "0x50",
    "ArrowRight": "0x4f",
    "ArrowUp": "0x52",
    "Backquote": "0x35",
    "\\": "0x31",
    "/": "0x38",
    "Backspace": "0x2a",
    "[": "0x2f",
    "]": "0x30",
    "CapsLock": "0x39",
    ",": "0x36",
    "ControlLeft": "0xe0",
    "Delete": "0x4c",
    "0": "0x27",
    "1": "0x1e",
    "2": "0x1f",
    "3": "0x20",
    "4": "0x21",
    "5": "0x22",
    "6": "0x23",
    "7": "0x24",
    "8": "0x25",
    "9": "0x26",
    "End": "0x4d",
    "Enter": "0x28",
    "Equal": "0x2e",
    "Escape": "0x29",
    "F1": "0x3a",
    "F2": "0x3b",
    "F3": "0x3c",
    "F4": "0x3d",
    "F5": "0x3e",
    "F6": "0x3f",
    "F7": "0x40",
    "F8": "0x41",
    "F9": "0x42",
    "F10": "0x43",
    "F11": "0x44",
    "F12": "0x45",
    "Home": "0x4a",
    "IntlBackslash": "0x31",
    "A": "0x04",
    "MetaLeft": "0xe3",
    "MetaRight": "0xe7",
    "-": "0x2d",
    "NumpadEnter": "0x58",
    "PageDown": "0x4e",
    "PageUp": "0x4b",
    ".": "0x37",
    "\"": "0x34",
    ";": "0x33",
    "ShiftLeft": "0xe1",
    "ShiftRight": "0xe5",
    " ": "0x2c",
    "Tab": "0x2b"
  }

interface WsCommand {
  keyCode: Number,
  modifiers?: Number[],
}

function mapKey(key: string): WsCommand | null {
  let jsCode = -1;
  if (key.length == 1 ) {
    jsCode = key.charCodeAt(0);
  }
  console.log(`in: ${key} jsCode: ${jsCode}`)
  // A-Z
  if (jsCode >= 65 && jsCode <= 90) {
    return {keyCode:Number(keyMap["A"]) + (jsCode - 65), modifiers: [Number(keyMap.ShiftLeft)]}
  }
  // a-z
  if (jsCode >= 97 && jsCode <= 122) {
    return {keyCode:Number(keyMap["A"]) + (jsCode - 97)}
  }
  const keyMapRes = keyMap[key];
  if (!keyMapRes) {
    return null;
  }
  return {keyCode:Number(keyMapRes), modifiers: []}
}

function getWebSocketStateString(readyState: Number) {
  switch (readyState) {
    case WebSocket.CONNECTING:
      return 'CONNECTING';
    case WebSocket.OPEN:
      return 'OPEN';
    case WebSocket.CLOSING:
      return 'CLOSING';
    case WebSocket.CLOSED:
      return 'CLOSED';
    default:
      return 'UNKNOWN';
  }
}

function keyPressToWs(ws: WebSocket, ev: NativeSyntheticEvent<TextInputKeyPressEventData>){
  console.log(ev.nativeEvent);
  if (!ws || ws.readyState != WebSocket.OPEN) {
    console.log("not connected");
    return
  }
  const command = mapKey(ev.nativeEvent.key);
  if (!command) {
    console.log(`no mapping for: ${ev.nativeEvent.key}`);
    return;
  }
  console.log(command)
  ws.send(JSON.stringify(command));
}

type KeyboardMouseScreenProps = NativeStackScreenProps<RootStackParamList, 'KeyboardMouse'>;

export default function KeyboardMouse({navigation, route}: KeyboardMouseScreenProps) {
  const [val, setVal] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [wsCtr, setWsCtr] = useState(0);
  const [wsState, setWsState] = useState("UNINITIALIZED");

  const handleKeyPress = (ws: WebSocket, ev: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    console.log(ev.nativeEvent);
    if (!ws || ws.readyState != WebSocket.OPEN) {
      console.log("not connected");
      return
    }
    const command = mapKey(ev.nativeEvent.key);
    if (!command) {
      console.log(`no mapping for: ${ev.nativeEvent.key}`);
      return;
    }
    console.log(command)
    ws.send(JSON.stringify(command));
  }

  useEffect(() => {
    const newWebSocket = new WebSocket(`ws://${route.params.hostname}:81`);

    newWebSocket.onopen = () => {
      console.log('WebSocket connected');
      setWsState(getWebSocketStateString(newWebSocket.readyState));
    };

    newWebSocket.onmessage = (e) => {
      console.log('Received message:', e.data);
      // Handle received messages from the server
    };

    newWebSocket.onerror = (e) => {
      console.error('WebSocket error');
      setWs(null);
      setWsState(getWebSocketStateString(newWebSocket.readyState));
      // Handle errors
    };

    newWebSocket.onclose = () => {
      console.log('WebSocket disconnected');
      setWs(null);
      setWsState(getWebSocketStateString(newWebSocket.readyState));
      // Handle the WebSocket closing
    };

    setWs(newWebSocket);

    // Clean up WebSocket connection on unmount
    return () => {
      newWebSocket.close();
    };
  }, [wsCtr]);
  const stateString = wsState;
  return (
    <View style={styles.container}>
      <Text>Websocket state: {stateString}</Text>
      <TextInput style={styles.input} onChangeText={setVal} onKeyPress={(ev) => keyPressToWs(ws!, ev)} multiline numberOfLines={4}></TextInput>
      <Button title="Reconnect" onPress={()=>setWsCtr(wsCtr+1)}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    width: "90%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
