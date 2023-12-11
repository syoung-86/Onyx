import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Pomodoro from './screens/Pomodoro';
import TodoNavigator from './screens/TodoNavigator';
import StatsNavigator from './screens/StatsNavigator';
import { View } from 'react-native';
import React from 'react';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

const TopTabsNavigation = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',

        // Paddings to handle safe area
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
    <NavigationContainer>
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
    </NavigationContainer>
    </View>
  );
};

export default TopTabsNavigation;
