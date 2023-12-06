import React, {useEffect, useState} from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import TodoToday from './TodoToday';
import TodoNew from './TodoNew';
import {readRecords} from '../database'; // Import your database functions
import CustomTodo from './CustomTodo';

const Tab = createMaterialBottomTabNavigator();

function TodoNavigator() {
    const [tableNames, setTableNames] = useState([]);

    useEffect(() => {
        // Fetch the available table names from the database (todoDueDates)
        readRecords('customTodo').then(result => {
            const names = result.map(row => row.name); // Assuming 'name' is the property you want
            setTableNames(names);
        });
    }, []);

    return (
        <Tab.Navigator initialRouteName="TodoToday">
            <Tab.Screen
                name="TodoToday"
                component={TodoToday}
                options={{tabBarLabel: 'Todo Today'}}
            />

            <Tab.Screen
                name="TodoNew"
                component={TodoNew}
                options={{tabBarLabel: 'New Todo'}}
            />

            {tableNames.map(tableName => (
                <Tab.Screen
                    key={tableName}
                    name={tableName}
                    options={{tabBarLabel: tableName}}>
                    {() => <CustomTodo tableName={tableName} />}
                </Tab.Screen>
            ))}
        </Tab.Navigator>
    );
}

export default TodoNavigator;
