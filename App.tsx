import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Pomodoro from './src/screens/Pomodoro';
import TodoNavigator from './src/screens/TodoNavigator';
import StatsNavigator from './src/screens/StatsNavigator';
import {initDatabase} from './src/database';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
    scheduleNotification,
    setupNotificationChannel,
} from './src/LocalNotifaction';
import {PermissionStatus} from 'expo-modules-core';
import * as Notifications from 'expo-notifications';
import {Notification} from 'expo-notifications';
import React, {useEffect, useState} from 'react';

const App = () => {
    React.useEffect(() => {
        const setupChannels = async () => {
            await setupNotificationChannel(
                'default',
                'Default',
                'General notifications',
            );
            await setupNotificationChannel(
                'pomodoroChannel',
                'Pomodoro',
                'Pomodoro notifications',
            );
            await setupNotificationChannel(
                'pomodoroReminder',
                'Pomodoro Reminder',
                'Pomodoro Reminder',
            );
            await setupNotificationChannel(
                'todoChannel',
                'Todo',
                'Todo notifications',
            );
        };
(async () => {
      try {
        console.log('Setting up channels and scheduling notification...');
        await setupChannels();
        scheduleNotification('todoChannel', 'todo title', 'todo body');
        console.log('Notification scheduled successfully!');
      } catch (error) {
        console.error('Error setting up channels and scheduling notification:', error);
      }
    })();
        initDatabase();
    }, []);
    const [notificationPermissions, setNotificationPermissions] =
        useState<PermissionStatus>(PermissionStatus.UNDETERMINED);

    const handleNotification = (notification: Notification) => {
        const {title} = notification.request.content;
        console.warn(title);
    };

    const requestNotificationPermissions = async () => {
        const {status} = await Notifications.requestPermissionsAsync();
        setNotificationPermissions(status);
        return status;
    };

    useEffect(() => {
        requestNotificationPermissions();
    }, []);

    useEffect(() => {
        if (notificationPermissions !== PermissionStatus.GRANTED) return;
        const listener =
            Notifications.addNotificationReceivedListener(handleNotification);
        return () => listener.remove();
    }, [notificationPermissions]);
    const Tab = createMaterialTopTabNavigator();
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Tab.Navigator initialRouteName="Pomodoro">
                    <Tab.Screen name="Pomodoro" component={Pomodoro} />

                    <Tab.Screen
                        name="TodoNavigator"
                        component={TodoNavigator}
                        options={{tabBarLabel: 'Todo'}}
                    />
                    <Tab.Screen name="Stats" component={StatsNavigator} />
                </Tab.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
};

export default App;
