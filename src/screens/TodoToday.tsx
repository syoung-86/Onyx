import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {View, FlatList, TouchableOpacity, Text, Alert, Button} from 'react-native';
import {List, Checkbox} from 'react-native-paper';
import {CalendarTheme, styles} from '../styles';
import {
    GestureHandlerRootView,
    LongPressGestureHandler,
    State,
    TextInput,
} from 'react-native-gesture-handler';
import {
    createRecord,
    createTodoSelectedDate,
    deleteRecord,
    readRecords,
    readSelectedDateTodo,
    updateRecord,
} from '../database';
import {Calendar} from 'react-native-calendars';
import showSuccessToast from '../ToastHelper';

function parseDateString() {
    const dateObject = new Date();

    if (isNaN(dateObject.getTime())) {
        console.error('todo today: Invalid date format');
        return '2023-11-27';
    }

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate || '2023-11-27';
}

const TodoToday: React.FC = () => {
    const [newTodo, setNewTodo] = useState('');
    const [allTodos, setAllTodos] = useState<
        {id: number; name: string; completed: boolean; date: string}[]
    >([]);
    const todayFormatted = parseDateString();
    const [selected, setSelected] = useState<string>(todayFormatted);
  const [isCalendarVisible, setCalendarVisibility] = useState(false);
const toggleCalendarVisibility = () => {
    setCalendarVisibility(!isCalendarVisible);
  };
    const addTodo = () => {
        console.log('New todo:', newTodo);
        const originalSelected = selected; // Save the original value

        // Temporarily change the selected value to trigger a re-render
        setSelected('2000-01-01');

        createTodoSelectedDate({
            name: newTodo,
            completed: false,
            date: originalSelected,
        })
            .then(() => {
                // Change the selected value back to its original value
                setSelected(originalSelected);
                setNewTodo('');
                showSuccessToast("Todo Added Successfully!");
            })
            .catch(error => console.error('Error creating todo:', error));
    };

    const toggleTodo = (id: number) => {
        const updatedTodos = allTodos.map(todo => {
            if (todo.id === id) {
                const updatedTodo = {...todo, completed: !todo.completed};
                updatedTodo.date = new Date().toLocaleString();
                return updatedTodo;
            } else {
                return todo;
            }
        });
        setAllTodos(updatedTodos);

        updateRecord('todotoday', id, {
            completed: !allTodos.find(todo => todo.id === id)?.completed,
            date: updatedTodos.find(todo => todo.id === id)?.date ?? '',
        });
    };

    const showTodoContextMenu = (todo: {id: number; name: string}) => {
        Alert.alert('Todo Options', 'Select an action for this todo:', [
            {
                text: 'Delete Todo',
                onPress: () => {
                    // Add your logic to delete the todo here
                    deleteTodo(todo);
                },
                style: 'destructive', // This will show the option in red
            },
            {
                text: 'Cancel',
                style: 'cancel',
            },
        ]);
    };

    const deleteTodo = (todo: {id: number; name: string}) => {
        setAllTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));

        // Delete the todo from the database
        deleteRecord('todotoday', todo.id).catch(error =>
            console.error('Error deleting todo:', error),
        );
    };
    useEffect(() => {
        readSelectedDateTodo(selected)
            .then(todos =>
                setAllTodos(
                    todos as {
                        id: number;
                        name: string;
                        completed: boolean;
                        date: string;
                    }[],
                ),
            )
            .catch(error => console.error('Error fetching task names:', error));
    }, [selected]);

    return (
        <GestureHandlerRootView>
            <View style={styles.contentContainer}>
                    <View style={styles.container}> 
                    <TextInput
                        style={styles.input}
                        onChangeText={text => setNewTodo(text)}
                        value={newTodo}
                        returnKeyType='done'
                        onSubmitEditing={addTodo}
                    />
                    <TouchableOpacity onPress={addTodo}>
                    <Icon name="plus" size={20} color={styles.buttonText.color}/>
                    </TouchableOpacity>
                </View>
<TouchableOpacity onPress={toggleCalendarVisibility} style={styles.button}
>
        <Text style={styles.buttonText}>{isCalendarVisible ? 'Hide Calendar' : 'Show Calendar'}</Text>
            </TouchableOpacity>
            {isCalendarVisible  && (
                <Calendar
                    theme={CalendarTheme}
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
                    onDayLongPress={day => {
                        console.log('selected day', day);
                    }}
                    onMonthChange={month => {
                        console.log('month changed', month);
                    }}
                />)}

    </View>
                <FlatList
                    data={allTodos}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({item}) => (
                        <List.Item
                        titleStyle={styles.list}
                        
                            title={item.name}
                            
                            left={() => (
                                <Checkbox
                                color={styles.success.color}
                                uncheckedColor={styles.subtle.color}
                                    status={
                                        item.completed ? 'checked' : 'unchecked'
                                    }
                                    onPress={() => toggleTodo(item.id)}
                                />
                            )}
                            onLongPress={() => showTodoContextMenu(item)}
                        />
                    )}
                />
        </GestureHandlerRootView>
    );
};

export default TodoToday;
