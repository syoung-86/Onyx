import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {TextInput} from 'react-native-paper';
import {createTodoTable} from '../database';

const TodoNew: React.FC = () => {
    const [newTodo, setNewTodo] = useState('');
    const [selected, setSelected] = useState('');
    const createTodo = async () => {
        createTodoTable(newTodo, selected);
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
