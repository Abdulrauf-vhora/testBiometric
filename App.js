import React, {useEffect, useState} from 'react';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Switch,
} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TouchID from 'react-native-touch-id';

const App = () => {
  const checkBioMetricSupport = () => {
    ReactNativeBiometrics.isSensorAvailable().then(resultObject => {
      // console.log('resultObject');
      const {available, biometryType} = resultObject;

      if (available && biometryType === ReactNativeBiometrics.TouchID) {
        console.log('TouchID is supported');
        CaptureBioMetric();
      } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
        console.log('FaceID is supported');
      } else if (
        available &&
        biometryType === ReactNativeBiometrics.Biometrics
      ) {
        console.log('Biometrics is supported');
        CaptureBioMetric();
      } else {
        console.log('Biometrics not supported');
      }
    });
  };
  const optionalConfigObject = {
    title: 'Authentication Required', // Android
    imageColor: '#e00606', // Android
    imageErrorColor: '#ff0000', // Android
    sensorDescription: 'Touch sensor', // Android
    sensorErrorDescription: 'Failed', // Android
    cancelText: 'Cancel', // Android
    fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
    unifiedErrors: false, // use unified error messages (default false)
    passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
  };
  const TouchId = () => {
    //^^^^^ using react-native-touch-id package
    TouchID.isSupported()
      .then(biometryType => {
        console.log('biometryType>>', biometryType);
        // Success code
        if (biometryType) {
          console.log('FaceID is supported.');
          TouchID.authenticate(
            'to demo1 this react-native component',
            optionalConfigObject,
          )
            .then(success => {
              alert('Authenticated Successfully');
            })
            .catch(error => {
              alert('Authentication Failed');
            });
        } else {
          console.log('TouchID is supported.');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const CaptureBioMetric = async () => {
    const demoState = await AsyncStorage.getItem('Demo');
    setIsEnabled(demoState === 'true' ? true : false);
    console.log('switch Status', demoState);
    if (demoState === 'true') {
      ReactNativeBiometrics.simplePrompt({promptMessage: 'Confirm fingerprint'})
        .then(resultObject => {
          const {success} = resultObject;

          if (success) {
            console.log('successful biometrics provided');
            alert('successful biometrics provided');
          } else {
            console.log('user cancelled biometric prompt');
            alert('user cancelled biometric prompt');
            setIsEnabled(false);
          }
        })
        .catch(() => {
          console.log('biometrics failed');
        });
    }
  };
  useEffect(() => {
    checkBioMetricSupport();
  }, []);
  const isDarkMode = useColorScheme() === 'dark';

  // const biometryType = ReactNativeBiometrics.isSensorAvailable();
  const [isEnabled, setIsEnabled] = useState(false);
  // const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <SafeAreaView style={styles.full}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={async () => {
            setIsEnabled(!isEnabled);
            await AsyncStorage.setItem('Demo', isEnabled ? 'false' : 'true');
          }}
          // ^^^^^Using react-native-biometrics package

          // onValueChange={() => TouchId()}
          //^^^^^ using react-native-touch-id package
          value={isEnabled}
        />
        <Text style={styles.text}>Enable Switch To Use BioMetric</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f3f4',
  },
  full: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: 'red',
    marginTop: 20,
  },
});
export default App;
