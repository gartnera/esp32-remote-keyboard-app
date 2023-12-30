import { StyleSheet, Text, View, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData, Button } from 'react-native';
import { useCallback, useEffect, useState } from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

import { mapKey } from '../lib/hid';
import { Macro, deleteMacro, getMacros } from '../lib/macros';
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

type MacrosScreenProps = NativeStackScreenProps<RootStackParamList, 'Macros'>;

export default function Macros({ navigation, route }: MacrosScreenProps) {
  const [macros, setMacros] = useState<Macro[]>([]);

  const wsMan = getWebsocketManager(`ws://${route.params.hostname}:81`);
  const ws = wsMan.subscribeReact();

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
      <Text>Websocket state: {ws.state}</Text>
      {macrosSection}
      <Button title={`Force Reconnect (${ws.connectionCtr})`} onPress={() => ws.reconnect()}></Button>
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
