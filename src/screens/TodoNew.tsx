import React, {useState} from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {TextInput} from 'react-native-paper';
import {createTodoTable} from '../database';
import {RouteProp} from '@react-navigation/native';

interface TodoNewProps {
    onRefresh?: () => void;
}

const TodoNew: React.FC<TodoNewProps> = ({onRefresh}) => {
    const [newTodo, setNewTodo] = useState('');
    const [selected, setSelected] = useState('');
    const createTodo = async () => {
        try {
            if (newTodo.trim().length > 0) {
                await createTodoTable(newTodo, selected).then(
                    () => onRefresh && onRefresh(),
                );
            } else {
                Alert.alert(
                    'Validation Error',
                    'Todo title must be at least one character.',
                );
            }
        } catch (error) {
            Alert.alert('Todo Already exists');
            // Handle the error here, e.g., show an alert
        }
    };
    return (
        <GestureHandlerRootView>
            <Calendar
                onDayPress={day => {
                    console.log('selected day', day);
                    setSelected(day.dateString);
                }}
                markedDates={{
                    [selected]: {
                        selected: true,
                        disableTouchEvent: true,
                    },
                }}
            />
            <View>
                <TextInput
                    placeholder="Title"
                    onChangeText={text => setNewTodo(text)}
                />
            </View>
            <TouchableOpacity onPress={createTodo}>
                <Text>Create</Text>
            </TouchableOpacity>
        </GestureHandlerRootView>
    );
};
export default TodoNew;
