import React, {useEffect, useState} from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import TodoToday from './TodoToday';
import TodoNew from './TodoNew';
import {readRecords} from '../database'; // Import your database functions
import CustomTodo from './CustomTodo';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();


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
        <Drawer.Navigator initialRouteName="TodoToday">
        <Drawer.Screen
        name="Create a new Todo"
        component={TodoNew}
        />
            <Drawer.Screen
                name="TodoToday"
                component={TodoToday}
            />


            {tableNames.map(tableName => (
                <Drawer.Screen
                    key={tableName}
                    name={tableName}
                    >
                    {() => <CustomTodo tableName={tableName} />}
                </Drawer.Screen>
            ))}
        </Drawer.Navigator>
    );
}

export default TodoNavigator;
