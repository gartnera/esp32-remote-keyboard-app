import * as React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import KeyboardMouse from './screens/KeyboardMouse';
import Devices from './screens/Devices';
import { RootStackParamList } from './types';


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
        <Stack.Screen name="KeyboardMouse" component={KeyboardMouse}  options={({ route }) => ({ title: route.params.hostname })}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;