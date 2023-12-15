import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {TextInput} from 'react-native-paper';
import {createTodoTable} from '../database';
import {RouteProp} from '@react-navigation/native';
import { CalendarTheme, styles } from '../styles';

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

  const [isCalendarVisible, setCalendarVisibility] = useState(false);
const toggleCalendarVisibility = () => {
    setCalendarVisibility(!isCalendarVisible);
  };
    return (
        <GestureHandlerRootView>
        <View style={styles.contentContainer}>
            <View style={styles.container}>
                <TextInput
                    placeholder="Title*"
                    onChangeText={text => setNewTodo(text)}
                    style={styles.input}
                />
                <TouchableOpacity onPress={createTodo} style={styles.button}>
                  <Icon name="plus" size={20} color={styles.buttonText.color}/>
                </TouchableOpacity>
            </View>

<TouchableOpacity onPress={toggleCalendarVisibility} style={styles.button}
>
        <Text style={styles.buttonText}>{isCalendarVisible ? 'Hide Calendar' : 'Select A Due Date (Optional)'}</Text>
            </TouchableOpacity>
            {isCalendarVisible  && (
                    <View>
                    <Text style={styles.bodyCopy}>(Optional) Select a due date:</Text>
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
                style={styles.calendar}
theme={CalendarTheme}
            /></View>)}
            </View>
        </GestureHandlerRootView>
    );
};
export default TodoNew;
