import * as React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import KeyboardMouse from './screens/KeyboardMouse';
import Devices from './screens/Devices';
import { RootStackParamList } from './types';
import Macros from './screens/Macros';
import AddMacroScreen from './screens/AddMacro';
import Gamepad from './screens/Gamepad';


type DetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'Details'>;

function DetailsScreen({ navigation, route }: DetailsScreenProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Text>{route.params.hostname}</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Devices">
        <Stack.Screen name="Devices" component={Devices} />
        <Stack.Screen name="Details" component={DetailsScreen} options={({ route }) => ({ title: route.params.hostname })} />
        <Stack.Screen name="KeyboardMouse" component={KeyboardMouse} options={({ route }) => ({ title: route.params.hostname })} />
        <Stack.Screen name="Macros" component={Macros} options={({ route }) => ({ title: route.params.hostname })} />
        <Stack.Screen name="Gamepad" component={Gamepad} options={({ route }) => ({ title: route.params.hostname })} />
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name="AddMacro" options={{title: "Add Macro"}} component={AddMacroScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;