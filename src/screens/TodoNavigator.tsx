import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import TodoToday from './TodoToday';
import TodoNew from './TodoNew';
import {readRecords} from '../database';
import CustomTodo from './CustomTodo';
import {createDrawerNavigator} from '@react-navigation/drawer';
import { styles, themeColors } from '../styles';

const Drawer = createDrawerNavigator();

function TodoNavigator() {
    const [tableNames, setTableNames] = useState([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        // Fetch the available table names from the database (todoDueDates)
        readRecords('customTodo').then(result => {
            const names = result.map(row => row.name); // Assuming 'name' is the property you want
            setTableNames(names);
        });
    }, [refresh]);
    const handleRefresh = () => {
        // Trigger a refresh by updating the state variable
        setRefresh(prev => !prev);
    };
    return (
        <Drawer.Navigator initialRouteName="Daily" 
        screenOptions={{headerTintColor: styles.bodyCopy.color}}
        >
            <Drawer.Screen name="New">
                {() => <TodoNew onRefresh={handleRefresh} />}
            </Drawer.Screen>
            <Drawer.Screen name="Daily" component={TodoToday} />

            {tableNames.map(tableName => (
                <Drawer.Screen key={tableName} name={tableName}>
                    {() => (
                        <CustomTodo
                            tableName={tableName}
                            onRefresh={handleRefresh}
                        />
                    )}
                </Drawer.Screen>
            ))}
        </Drawer.Navigator>
    );
}

export default TodoNavigator;
