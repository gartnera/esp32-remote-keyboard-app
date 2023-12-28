import { StyleSheet, Text, View, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData, Button } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { KeyCommand, mapKey } from '../lib/hid';
import { saveMacro } from '../lib/macros';
import Checkbox from 'expo-checkbox';

type AddMacroScreenProps = NativeStackScreenProps<RootStackParamList, 'AddMacro'>;

export default function AddMacroScreen({ navigation }: AddMacroScreenProps) {
  const [name, setName] = useState('');
  const [keyCommands, setKeyCommands] = useState<KeyCommand[]>([]);
  const [stepCtr, setStepCtr] = useState(0);
  const [isSecret, setIsSecret] = useState(false);

  const handleKeyPress = useCallback((ev: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const keyCommand = mapKey(ev.nativeEvent.key);
    if (!keyCommand) {
      return
    }
    setKeyCommands([
      ...keyCommands,
      keyCommand,
    ])
    setStepCtr(stepCtr + 1);
  }, [stepCtr, keyCommands])

  return (
    <View style={styles.container}>
      <Text>Name:</Text>
      <TextInput editable style={styles.input} onChangeText={setName}></TextInput>
      <Text>Training Area:</Text>
      <TextInput editable style={styles.input} keyboardType={'ascii-capable'} autoCorrect={false} multiline numberOfLines={4} onKeyPress={handleKeyPress}></TextInput>
      <Text>{`Step Count: ${stepCtr}`}</Text>
      <View style={styles.checkWrapper}>
        <Checkbox style={styles.checkbox} value={isSecret} onValueChange={setIsSecret} />
        <Text>Secret?</Text>
      </View>
      <View style={styles.buttonBox}>
        <Button title='Reset' onPress={() => {setKeyCommands([]); setStepCtr(0)}}></Button>
        <Button title='Save' onPress={async () => {await saveMacro({name: name, isSecret: isSecret, keyCommands: keyCommands}); navigation.goBack()}}></Button>
        <Button title='Cancel' onPress={() => navigation.goBack()}></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 10,
  },
  checkWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    margin: 8,
  },
  input: {
    width: "90%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  buttonBox: {
    flexDirection: 'row',
  }
});
