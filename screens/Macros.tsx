import { StyleSheet, Text, View, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData, Button } from 'react-native';
import { useCallback, useEffect, useState } from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

import { mapKey } from '../lib/hid';
import { Macro, deleteMacro, getMacros } from '../lib/macros';

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

type MacrosScreenProps = NativeStackScreenProps<RootStackParamList, 'Macros'>;

export default function Macros({ navigation, route }: MacrosScreenProps) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [wsReconnectCtr, setWsReconnectCtr] = useState(0);
  const [wsConnectCtr, setWsConnectCtr] = useState(0);
  const [wsState, setWsState] = useState("UNINITIALIZED");
  const [macros, setMacros] = useState<Macro[]>([]);

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
  const loadMacros = async () => {
    const macros = await getMacros()
    setMacros(macros);
  }
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      console.log("macro screen focus")
      loadMacros()
    });

    return unsubscribe;
  }, [navigation]);

  const runMacro = useCallback((macro: Macro) => {
    macro.keyCommands.forEach((cmd) => ws!.send(JSON.stringify({type: "keyboard", ...cmd})))
  }, [ws])

  const stateString = wsState;
  const buildMacroView = () => {
    return <View>
      {
        macros!.map((m) => <View key={m.id} style={styles.row}>
          <Text>{m.name}</Text>
          <View style={styles.spacer}></View>
          <Button title="Run" onPress={() => runMacro(m)}></Button>
          <Button title="Delete" color="red" onPress={async () => {await deleteMacro(m); loadMacros()}}></Button>
        </View>)
      }
    </View>
  }
  let macrosSection = macros.length > 0 ? buildMacroView(): <Text>No Macros. Try adding one.</Text>
  return (
    <View style={styles.container}>
      <Text>Websocket state: {stateString}</Text>
      {macrosSection}
      <Button title={`Force Reconnect (${wsConnectCtr})`} onPress={() => setWsReconnectCtr(wsReconnectCtr + 1)}></Button>
      <Button title="Add" onPress={() => navigation.navigate('AddMacro')}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    width: "95%",

    backgroundColor: "#fff",
  },
  spacer: {
    flex: 1,
  },
  delete: {
    color: "red"
  }
});
