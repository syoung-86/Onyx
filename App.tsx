import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TopTabsNavigation from './src/TopTabNavigator';
import { View, Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Pomodoro from './src/screens/Pomodoro';
import TodoNavigator from './src/screens/TodoNavigator';
import StatsNavigator from './src/screens/StatsNavigator';


const App = ()=> {
    React.useEffect(() => {
    }, []);
    console.log("test");

    const Tab = createMaterialTopTabNavigator();
  return (

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
  );
};

export default App;

