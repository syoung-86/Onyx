import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Pomodoro from './src/screens/Pomodoro';
import TodoNavigator from './src/screens/TodoNavigator';
import StatsNavigator from './src/screens/StatsNavigator';
import { initDatabase } from './src/database';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    scheduleNotification,
    setupNotificationChannel,
} from './src/LocalNotifaction';
import { PermissionStatus } from 'expo-modules-core';
import * as Notifications from 'expo-notifications';
import { Notification } from 'expo-notifications';
import { View, StatusBar } from 'react-native';
import { MyTheme, NavigationTheme, styles, themeColors } from './src/styles';
import { Text } from 'react-native';
import Toast, {BaseToast} from 'react-native-toast-message';
import { toastConfig } from './src/ToastHelper';

const Main = () => {
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
                console.log('Notification channels setup  successfully!');
            } catch (error) {
                console.error('Error setting up channels:', error);
            }
        })();
        initDatabase();
    }, []);
    const [notificationPermissions, setNotificationPermissions] =
        useState<PermissionStatus>(PermissionStatus.UNDETERMINED);

    const handleNotification = (notification: Notification) => {
        const { title } = notification.request.content;
        console.warn(title);
    };

    const requestNotificationPermissions = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
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
    const insets = useSafeAreaInsets();
    return (
        <View
            style={{
                flex: 1,
                paddingTop: insets.top,
            }}
        >
 <View style={{ backgroundColor: themeColors.Mantle}}>
      <StatusBar hidden={false} backgroundColor={themeColors.Mantle} translucent={true} />
    </View>
            <NavigationContainer theme={NavigationTheme}>
                <Tab.Navigator initialRouteName="Pomodoro">
                    <Tab.Screen name="Pomodoro" component={Pomodoro} />

                    <Tab.Screen
                        name="TodoNavigator"
                        component={TodoNavigator}
                        options={{ tabBarLabel: 'Todo' }}
                    />
                    <Tab.Screen name="Stats" component={StatsNavigator} />
                </Tab.Navigator>
            </NavigationContainer>
        <Toast config={toastConfig}/>
        </View>
    );
};

const App = () => {
    return (
        <SafeAreaProvider>
            <Main />
        </SafeAreaProvider>
    )
}
export default App;
