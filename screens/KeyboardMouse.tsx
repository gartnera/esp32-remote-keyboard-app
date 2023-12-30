import { StyleSheet, Text, View, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData, Button } from 'react-native';
import { useCallback, useEffect, useState } from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

import { mapKey } from '../lib/hid';
import { getWebsocketManager } from '../lib/ws';

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

type KeyboardMouseScreenProps = NativeStackScreenProps<RootStackParamList, 'KeyboardMouse'>;

export default function KeyboardMouse({ navigation, route }: KeyboardMouseScreenProps) {
  const [val, setVal] = useState("");

  const wsMan = getWebsocketManager(`ws://${route.params.hostname}:81`);
  const ws = wsMan.subscribeReact();

  const handleKeyPress = (ev: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (!ws || ws.readyState() != WebSocket.OPEN) {
      console.log("not connected");
      return
    }
    const command = mapKey(ev.nativeEvent.key);
    if (!command) {
      console.log(`no mapping for: ${ev.nativeEvent.key}`);
      return;
    }
    console.log(command)
    ws.send(JSON.stringify({type: "keyboard", ...command}));
  }

  return (
    <View style={styles.container}>
      <Text>Websocket state: {ws.state}</Text>
      <TextInput style={styles.input} value={val} onChangeText={setVal} keyboardType={'ascii-capable'} autoCorrect={false} onKeyPress={handleKeyPress} multiline numberOfLines={4}></TextInput>
      <Button title="Clear" onPress={() => setVal("")}></Button>
      <Button title={`Force Reconnect (${ws.connectionCtr})`} onPress={() => ws.reconnect()}></Button>
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
