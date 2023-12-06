import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import StatsToday from './StatsToday';
import StatsWeek from './StatsWeek';
import StatsMonth from './StatsMonth';
import StatsAll from './StatsAll';
import React from 'react';

const Tab = createMaterialBottomTabNavigator();

function StatsNavigator() {
    return (
        <Tab.Navigator initialRouteName="StatsToday">
            <Tab.Screen
                name="StatsToday"
                component={StatsToday}
                options={{tabBarLabel: 'Today'}}
            />
            <Tab.Screen
                name="StatsWeek"
                component={StatsWeek}
                options={{tabBarLabel: 'Week'}}
            />
            <Tab.Screen
                name="StatsMonth"
                component={StatsMonth}
                options={{tabBarLabel: 'Month'}}
            />

            <Tab.Screen
                name="StatsAll"
                component={StatsAll}
                options={{tabBarLabel: 'All'}}
            />
        </Tab.Navigator>
    );
}

export default StatsNavigator;
