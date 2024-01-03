import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import StatsToday from './StatsToday';
import StatsWeek from './StatsWeek';
import StatsMonth from './StatsMonth';
import StatsAll from './StatsAll';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {graphColors} from '../themes/catppuchin-mocha';

const Tab = createBottomTabNavigator();

function StatsNavigator() {
    return (
        <Tab.Navigator initialRouteName="StatsToday">
            <Tab.Screen
                name="Today"
                component={StatsToday}
                options={{
                    tabBarLabel: 'day',
                    tabBarIcon: ({focused, color}) => (
                        <Icon name="hourglass-half" size={20} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Week"
                component={StatsWeek}
                options={{
                    tabBarLabel: 'Week',
                    tabBarIcon: ({focused, color}) => (
                        <Icon name="table" size={20} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Month"
                component={StatsMonth}
                options={{
                    tabBarLabel: 'Month',
                    tabBarIcon: ({focused, color}) => (
                        <Icon name="calendar-check-o" size={20} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="All"
                component={StatsAll}
                options={{
                    tabBarLabel: 'All',
                    tabBarIcon: ({focused, color}) => (
                        <Icon name="globe" size={20} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default StatsNavigator;
