import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from "expo-task-manager";


TaskManager.defineTask('test-app-location', ({ data, error }) => {
  console.log('Hello - task received execution');
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.error('Unable to start location task.');
    console.error(error);
    return;
  }

  if (data) {
    console.log(Date.now());
    console.log(data);
  }
}
);

export default class App extends Component {
  async startTracking() {
    console.log('Is task defined', TaskManager.isTaskDefined('test-app-location'));
    Location.startLocationUpdatesAsync('test-app-location', {
      accuracy: Location.Accuracy.BestForNavigation,
      showsBackgroundLocationIndicator: true,
      deferredUpdatesInterval: 1000,
      timeInterval: 1000,
      foregroundService: { notificationTitle: 'GPS', notificationBody: 'Tracking in progress', notificationColor: '#029a9a' }
    }).then(() => {
      console.log('Location updates started');
    }).catch((err) => {
      console.error('Unable to start tracking')
      console.error(err);
    });

  }

  async stopTracking() {
    console.log('Is task defined', TaskManager.isTaskDefined('test-app-location'));
    Location.hasStartedLocationUpdatesAsync('test-app-location').then((result) => {
      if (result) {
        Location.stopLocationUpdatesAsync('test-app-location').then(() => {
          console.log('Location updates stopped');
        });
      }
    }).catch((err) => {
      console.log('stopTracking', err);
    })
  }

  async componentDidMount() {
    await Location.requestForegroundPermissionsAsync()
    await Location.requestBackgroundPermissionsAsync()

    Location.hasStartedLocationUpdatesAsync('test-app-location').then((result) => {
      if (result) {
        Location.stopLocationUpdatesAsync('test-app-location').then(() => {
          console.log('Location updates stopped');
        });
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={{ backgroundColor: '#004470', borderRadius: 5, padding: 20 }}
          onPress={() => { this.startTracking() }}
        >
          <Text style={{ color: '#fff' }}>Start</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ backgroundColor: '#ff0000', borderRadius: 5, padding: 20, marginTop: 20 }}
          onPress={() => { this.stopTracking() }}
        >
          <Text style={{ color: '#fff' }}>Stop</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});