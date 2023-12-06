import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import TodoSomeday from './TodoSomeday';
import TodoToday from './TodoToday';
import TodoEveryday from './TodoEveryday';

const Stack = createStackNavigator();

const TodoStack = () => {
    return (
        <Stack.Navigator initialRouteName="Todo">
            <Stack.Screen name="TodoSomeday" component={TodoSomeday} />
            <Stack.Screen name="TodoToday" component={TodoToday} />
            <Stack.Screen name="TodoEveryday" component={TodoEveryday} />
        </Stack.Navigator>
    );
};

export default TodoStack;
