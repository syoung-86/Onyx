import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, FlatList, TouchableOpacity, Text, Alert } from 'react-native';
import { List, Checkbox } from 'react-native-paper';
import { styles } from '../styles';
import {
    GestureHandlerRootView,
    ScrollView,
    TextInput,
} from 'react-native-gesture-handler';
import {
    createRecord,
    deleteCutomTodo,
    deleteRecord,
    readCustomTodo,
    readRecords,
    updateCustomTodo,
    updateRecord,
} from '../database';
import Markdown from '@ronradtke/react-native-markdown-display';
import { useNavigation } from '@react-navigation/native';


interface TodoScreenProps {
    tableName: string;
    onRefresh?: () => void;
}

const TodoScreen: React.FC<TodoScreenProps> = ({ tableName, onRefresh }) => {
    const [newTodo, setNewTodo] = useState('');
    const [allTodos, setAllTodos] = useState<
        { id: number; name: string; completed: boolean }[]
    >([]);
    const [notes, setNotes] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [iD, setId] = useState(0);
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const todoTable = tableName + 'Todos';
    const navigation = useNavigation();

    const addTodo = async () => {
        console.log('New todo:', newTodo);
        await createRecord(todoTable, { name: newTodo, completed: false });
        const updatedTodos = await readRecords(todoTable);
        setAllTodos(
            updatedTodos as { id: number; name: string; completed: boolean }[],
        );
        setNewTodo('');
    };
    const startEditingNotes = () => {
        setIsEditingNotes(true);
        setNotes(notes); // Set the edited notes to the current notes
    };

    const saveNotes = async () => {
        await updateCustomTodo(iD, notes);
        setNotes(notes);
        setIsEditingNotes(false);
    };

    const toggleTodo = (id: number) => {
        const updatedTodos = allTodos.map(todo => {
            if (todo.id === id) {
                const updatedTodo = { ...todo, completed: !todo.completed };
                return updatedTodo;
            } else {
                return todo;
            }
        });
        setAllTodos(updatedTodos);

        updateRecord(todoTable, id, {
            completed: !allTodos.find(todo => todo.id === id)?.completed,
        });
    };

    const deleteTodoPage = async () => {
        deleteCutomTodo(tableName)
            .then(() => onRefresh && onRefresh())
            .catch(error => console.error('Error deleting todo page: ', error));
        navigation.goBack();
    };

    const showNotesContextMenu = () => {
        Alert.alert(
            'Todo Options',
            'Are you sure you wish to delete this page? ',
            [
                {
                    text: 'Delete',
                    onPress: () => {
                        // Add your logic to delete the todo here
                        deleteTodoPage();
                    },
                    style: 'destructive', // This will show the option in red
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ],
        );
    };
    const showTodoContextMenu = (todo: { id: number; name: string }) => {
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

    const deleteTodo = (todo: { id: number; name: string }) => {
        setAllTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));

        // Delete the todo from the database
        deleteRecord(todoTable, todo.id).catch(error =>
            console.error('Error deleting todo:', error),
        );
    };
    useEffect(() => {
        readRecords(todoTable)
            .then(todos =>
                setAllTodos(
                    todos as {
                        id: number;
                        name: string;
                        completed: boolean;
                    }[],
                ),
            )
            .catch(error => console.error('Error fetching task names:', error));
        readCustomTodo(tableName)
            .then(customTodos => {
                if (customTodos.length > 0) {
                    const customTodo = customTodos[0];
                    setNotes(customTodo.notes);
                    setDueDate(customTodo.date);
                    setId(customTodo.id);
                } else {
                    console.warn(
                        'No custom todo found for the given table name',
                    );
                }
            })
            .catch(error =>
                console.error('Error fetching custom todo:', error),
            );
    }, []);

    return (
        <GestureHandlerRootView>
            <ScrollView >
            <View style={styles.contentContainer}> 
                    <Text style={styles.bodyCopy}>{dueDate}</Text>
                <View>
                    <View style={styles.container}> 
                        <TextInput
                            style={styles.input}
                            onChangeText={text => setNewTodo(text)}
                            value={newTodo}
                        />
                        <TouchableOpacity onPress={addTodo} style={styles.button}>
                            <Icon name="plus" size={20} color={styles.buttonText.color}/>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        scrollEnabled={false}
                        data={allTodos}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <List.Item
                                title={item.name}
                                left={() => (
                                    <Checkbox
                                        status={
                                            item.completed
                                                ? 'checked'
                                                : 'unchecked'
                                        }
                                        onPress={() => toggleTodo(item.id)}
                                    />
                                )}
                                onLongPress={() => showTodoContextMenu(item)}
                            />
                        )}
                    />
                </View>
                <View>
                    <View>
                        {isEditingNotes ? (
                            <TextInput
                                multiline
                                numberOfLines={10}
                                onChangeText={text => setNotes(text)}
                                value={notes}
                            />
                        ) : (
                            <View>
                                <TouchableOpacity onPress={startEditingNotes}>
                                    <Text style={styles.buttonText}>
                                        Edit Notes
                                    </Text>
                                </TouchableOpacity>
                                <Markdown>{notes}</Markdown>
                            </View>
                        )}

                        {isEditingNotes && (
                            <TouchableOpacity onPress={saveNotes}>
                                <Text style={styles.buttonText}>
                                    Save Notes
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity onPress={showNotesContextMenu}>
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </ScrollView>
        </GestureHandlerRootView>
    );
};

export default TodoScreen;
