import { StyleSheet, Text, View, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData, Button } from 'react-native';
import { useCallback, useEffect, useState } from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

import { mapKey } from '../lib/hid';

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
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [wsReconnectCtr, setWsReconnectCtr] = useState(0);
  const [wsConnectCtr, setWsConnectCtr] = useState(0);
  const [wsState, setWsState] = useState("UNINITIALIZED");
  const handleKeyPress = useCallback((ev: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    console.log(ws)
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
    ws.send(JSON.stringify({type: "keyboard", ...command}));
  }, [ws])

  useEffect(() => {
    const newWebSocket = new WebSocket(`ws://${route.params.hostname}:81`);
    setWsState(getWebSocketStateString(newWebSocket.readyState));

    newWebSocket.onopen = () => {
      console.log('WebSocket connected');
      setWsState(getWebSocketStateString(newWebSocket.readyState));
      setWs(newWebSocket);
      setWsConnectCtr(wsConnectCtr + 1);
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
      // tolerate connect/disconnect race
      if (ws !== newWebSocket) {
        return
      }
      setWs(null);
      setWsState(getWebSocketStateString(newWebSocket.readyState));
      // Handle the WebSocket closing
    };

    // Clean up WebSocket connection on unmount
    return () => {
      newWebSocket.close();
    };
  }, [wsReconnectCtr]);
  const stateString = wsState;
  return (
    <View style={styles.container}>
      <Text>Websocket state: {stateString}</Text>
      <TextInput style={styles.input} value={val} onChangeText={setVal} keyboardType={'ascii-capable'} autoCorrect={false} onKeyPress={handleKeyPress} multiline numberOfLines={4}></TextInput>
      <Button title="Clear" onPress={() => setVal("")}></Button>
      <Button title={`Force Reconnect (${wsConnectCtr})`} onPress={() => setWsReconnectCtr(wsReconnectCtr + 1)}></Button>
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
