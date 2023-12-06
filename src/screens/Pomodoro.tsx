import * as React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import PomodoroStart from './PomodoroStart';
import PomodoroNew from './PomodoroNew';
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createMaterialBottomTabNavigator();

const Pomodoro = () => {
    return (
        <Tab.Navigator initialRouteName="PomodoroStart">
            <Tab.Screen
                name="PomodoroStart"
                component={PomodoroStart}
                options={{
                    tabBarLabel: 'Start',
                    tabBarIcon: ({focused, color}) => (
                        <Icon name="clock-o" size={20} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="PomodoroNew"
                component={PomodoroNew}
                options={{
                    tabBarLabel: 'New',
                    tabBarIcon: ({focused, color}) => (
                        <Icon name="plus-square-o" size={20} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default Pomodoro;
