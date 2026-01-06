import React from 'react';
import {StatusBar} from 'react-native';
import 'react-native-gesture-handler';
import AppNavigator from './navigation/AppNavigator';

const App = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <AppNavigator />
    </>
  );
};

export default App;

