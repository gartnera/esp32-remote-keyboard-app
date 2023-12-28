import * as React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type DevicesScreenProps = NativeStackScreenProps<RootStackParamList, 'Devices'>;

export default function DevicesScreen({ navigation, route }: DevicesScreenProps) {
  const devices = [
    "asdf.local",
    "esp32.local",
  ]
  const deviceButtons = devices.map((hostname) => {
    return <View style={styles.row} key={hostname}>
      <Text>{hostname}</Text>
      <View style={styles.spacer}></View>
      <Button
        title={`Keyboard`}
        onPress={() => navigation.navigate("KeyboardMouse", { hostname: hostname })}
      />
      <Button
        title={`Details`}
        onPress={() => navigation.navigate("Details", { hostname: hostname })}
      />
    </View>
  });
  return (
    <View style={styles.screen}>
      {deviceButtons}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,

    backgroundColor: "#fff"
  },
  spacer: {
    flex: 1,
  }
});