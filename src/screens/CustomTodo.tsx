import React, { useEffect, useState, useRef } from 'react';
import { Linking, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, FlatList, Text, Alert, KeyboardAvoidingView } from 'react-native';
import { List, Checkbox } from 'react-native-paper';
import { markdownStyles, styles } from '../styles';
import {
    GestureHandlerRootView,
    ScrollView,
    TextInput,
    TouchableOpacity,
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
import showSuccessToast from '../ToastHelper';
import { themeColors } from '../styles';


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
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const inputRef = useRef(null);



const MarkdownToolbar = ({ onInsert }) => (
  <View style={styles.markdownToolbar}>
    <TouchableOpacity onPress={() => onInsert('**', '**')}>
      <View style={styles.toolbarItem}>
        <Icon name="bold" size={15} color={styles.buttonText.color}/>
      </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => onInsert('*', '*')}>
      <View style={styles.toolbarItem}>
        <Icon name="italic" size={15} color={styles.buttonText.color}/>
      </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => onInsert('# ', '')}>
      <View style={styles.toolbarItem}>
        <Text style={styles.toolbarButton}>H1</Text>
      </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => onInsert('## ', '')}>
      <View style={styles.toolbarItem}>
        <Text style={styles.toolbarButton}>H2</Text>
      </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => onInsert('\n---\n', '')}>
      <View style={styles.toolbarItem}>
        <Icon name="minus" size={15} color={styles.buttonText.color}/>
      </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => onInsert('~~', '~~')}>
      <View style={styles.toolbarItem}>
        <Text style={styles.strikethrough}>S</Text>
      </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => onInsert('> ', '')}>
      <View style={styles.toolbarItem}>
        <Icon name="indent" size={15} color={styles.buttonText.color}/>
      </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => onInsert('+ ', '')}>
      <View style={styles.toolbarItem}>
        <Icon name="list-ul" size={15} color={styles.buttonText.color}/>
      </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => onInsert('1. ', '')}>
      <View style={styles.toolbarItem}>
        <Icon name="list-ol" size={15} color={styles.buttonText.color}/>
      </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => onInsert('```\n', '\n```')}>
      <View style={styles.toolbarItem}>
        <Icon name="code" size={15} color={styles.buttonText.color}/>
      </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => onInsert('[Link Text](https://www.google.com)', '')}>
      <View style={styles.toolbarItem}>
        <Icon name="link" size={15} color={styles.buttonText.color}/>
      </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => onInsert('![Image](https://octodex.github.com/images/minion.png)', '')}>
      <View style={styles.toolbarItem}>
        <Icon name="image" size={15} color={styles.buttonText.color}/>
      </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={saveNotes} style={styles.toolbarItem}>
      <Icon name="save" size={15} color={themeColors.Green}/>
    </TouchableOpacity>
  </View>
);
    useEffect(() => {
        if (isEditingNotes) {
        navigation.setOptions({
          headerTitle: () => <MarkdownToolbar onInsert={insertMarkdownSyntax} />,
        });
        } else {
            navigation.setOptions({
          headerTitle: () => <Text style={markdownStyles.heading1}>{tableName}</Text>,
            });
        }
    }, [isEditingNotes]);
    useEffect(() => {
      const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
        setKeyboardVisible(true);
      });
      const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardVisible(false);
      });

      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }, []);
    const handleSelectionChange = (event) => {
      setSelection(event.nativeEvent.selection);
    };

    const insertMarkdownSyntax = (prefix, suffix) => {
      const { start, end } = selection;
      let wordStart = start;
      let wordEnd = end;

      // Find the start of the word or line
      while (wordStart > 0 && notes[wordStart - 1] !== ' ' && notes[wordStart - 1] !== '\n') {
        wordStart--;
      }

      // Find the end of the word or line
      while (wordEnd < notes.length && notes[wordEnd] !== ' ' && notes[wordEnd] !== '\n') {
        wordEnd++;
      }

      // Insert the Markdown syntax
      const updatedText = notes.substring(0, wordStart) + prefix + notes.substring(wordStart, wordEnd) + suffix + notes.substring(wordEnd);
      setNotes(updatedText);

      // Update the selection to be after the inserted suffix
      setSelection({ start: wordEnd + suffix.length, end: wordEnd + suffix.length });
    };

    const addTodo = async () => {
        console.log('New todo:', newTodo);
        await createRecord(todoTable, { name: newTodo, completed: false });
        const updatedTodos = await readRecords(todoTable);
        setAllTodos(
            updatedTodos as { id: number; name: string; completed: boolean }[],
        );
        setNewTodo('');
        showSuccessToast("Todo Added Successfully!");
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
    const onLinkPress = (url: string) => {
    if (url) {
        return true
     } else {
         return false
     }

    }
    return (
        <GestureHandlerRootView>
            <ScrollView>
            <View> 

        <View style={styles.contentContainer}>
                    <Text style={styles.bodyCopy}>{dueDate}</Text>
                    <View style={styles.container}> 
                        <TextInput
                            style={styles.textInput}
                            onChangeText={text => setNewTodo(text)}
                            value={newTodo}
                            returnKeyType='done'
                            onSubmitEditing={addTodo}
                        />
                        <TouchableOpacity onPress={addTodo} style={styles.button}>
                            <Icon name="plus" size={15} color={styles.buttonText.color}/>
                        </TouchableOpacity>
                    </View>

                    </View>
                    <FlatList
                        scrollEnabled={false}
                        data={allTodos}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.contentContainer}>
                            <List.Item
                                titleStyle={styles.list}
                                title={item.name}
                                left={() => (
                                    <Checkbox
                                color={styles.success.color}
                                uncheckedColor={styles.subtle.color}
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
                            </View>
                        )}
                    />
                <View>
                    <View>
                        {isEditingNotes ? (
                                <View>
                            <View style={styles.contentContainer}>
                            <TextInput
                                multiline
                                numberOfLines={50}
                                onChangeText={text => setNotes(text)}
                                value={notes}
                                style={styles.markdownInput}
                                ref={inputRef}
                                onSelectionChange={handleSelectionChange}
                            />
                            </View>
                            <KeyboardAvoidingView>
                            </KeyboardAvoidingView>
                            </View>
                        ) : (
                            <View>
                                <TouchableOpacity onPress={startEditingNotes} style={styles.contentContainer}>
                                    <Text style={styles.buttonText}>
                                        Edit Notes
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={showNotesContextMenu} style={styles.contentContainer}>
                                <Text style={styles.buttonText}>Delete</Text>
                                </TouchableOpacity>
                                <Markdown onLinkPress={onLinkPress}style={markdownStyles}>{notes}</Markdown>
                            </View>
                        )}
                    </View>
                </View>
                </View>
            </ScrollView>
        </GestureHandlerRootView>
    );
};

export default TodoScreen;
