import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Pomodoro from './screens/Pomodoro';
import TodoNavigator from './screens/TodoNavigator';
import StatsNavigator from './screens/StatsNavigator';
import { View } from 'react-native';
import React from 'react';

const Tab = createMaterialTopTabNavigator();

const TopTabsNavigation = () => {
  return (
    <View>
    <Tab.Navigator
      initialRouteName="Pomodoro"
    >
      <Tab.Screen
        name="Pomodoro"
        component={Pomodoro}
      />

      <Tab.Screen
        name="TodoNavigator"
        component={TodoNavigator}
        options={{ tabBarLabel: 'Todo' }}
      />
      <Tab.Screen
      name="Stats"
      component={StatsNavigator}
        />
    </Tab.Navigator>
    </View>
  );
};

export default TopTabsNavigation;
