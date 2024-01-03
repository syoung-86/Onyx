import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Alert, TextInput} from 'react-native';
import {
    LongPressGestureHandler,
    GestureHandlerRootView,
    State,
} from 'react-native-gesture-handler';
import {markdownStyles, styles} from '../styles';
import {createRecord, readRecords, deleteRecord} from '../database';
import {useFocusEffect} from '@react-navigation/native';

function PomodoroNew() {
    const [newTaskName, setNewTaskName] = useState('');
    const [goal, setGoal] = useState(''); // State for the goal
    const [selectedTask, setSelectedTask] = useState('');
    const [taskNames, setTaskNames] = useState<{id: number; name: string}[]>(
        [],
    );

    useFocusEffect(
        React.useCallback(() => {
            readRecords('taskName')
                .then(names =>
                    setTaskNames(names as {id: number; name: string}[]),
                )
                .catch(error =>
                    console.error('Error fetching task names:', error),
                );
        }, []),
    );

    const addTaskName = () => {
        console.log('New Task Name:', newTaskName, 'Goal:', goal);
        try {
            createRecord('taskName', {
                name: newTaskName,
                goal: parseInt(goal, 10) || 0,
            })
                .then(() => {
                    // After inserting the task name, fetch all task names again and update the state
                    readRecords('taskName')
                        .then(names => {
                            setTaskNames(names as {id: number; name: string}[]);
                        })
                        .catch(readError => {
                            console.error(
                                'Error fetching task names:',
                                readError,
                            );
                        });
                })
                .catch(createError => {
                    console.error('Error creating record:', createError);
                    Alert.alert('Error, task names must be unique');
                });
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };

    const showContextMenu = (task: {id: number; name: string}) => {
        Alert.alert('Task Options', 'Select an action for this task:', [
            {
                text: 'Delete Task',
                onPress: () => {
                    // Add your logic to delete the task here
                    deleteTask(task);
                },
                style: 'destructive', // This will show the option in red
            },
            {
                text: 'Cancel',
                style: 'cancel',
            },
        ]);
    };

    const deleteTask = (task: {id: number; name: string}) => {
        setTaskNames(prevTaskNames =>
            prevTaskNames.filter(taskName => taskName.id !== task.id),
        );

        // Clear the selected task if it matches the one being deleted
        if (selectedTask === task.name) {
            setSelectedTask('');
        }

        // Delete the task from the database
        deleteRecord('taskName', task.id).catch(error =>
            console.error('Error deleting task:', error),
        );
    };

    const TaskList = ({taskNames, onLongPress, onPress}) => {
        return (
            <View>
                {taskNames.map(taskName => (
                    <LongPressGestureHandler
                        key={`${taskName.id}-${taskName.name}`}
                        onHandlerStateChange={({nativeEvent}) => {
                            if (nativeEvent.state === State.ACTIVE) {
                                // Show a context menu for the task
                                onLongPress(taskName);
                            }
                        }}>
                        <View>
                            <TouchableOpacity
                                onPress={() => onPress(taskName.name)}>
                                <Text style={styles.bodyCopy}>{taskName.name}</Text>
                            </TouchableOpacity>
                        </View>
                    </LongPressGestureHandler>
                ))}
            </View>
        );
    };

    // Function to handle the increase/decrease of the goal
    const handleGoalChange = (amount: number) => {
        const currentGoal = parseInt(goal, 10) || 0;
        setGoal((currentGoal + amount).toString());
    };

    return (
        <GestureHandlerRootView>
            {/* Top navigation menu */}
            <View style={styles.container}></View>

            <View style={styles.contentContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Task Name"
                    placeholderTextColor={styles.subtle.color}
                    onChangeText={text => setNewTaskName(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Goal"
                    placeholderTextColor={styles.subtle.color}
                    keyboardType="numeric"
                    value={goal}
                    onChangeText={text => setGoal(text)}
                />
                <View>
                    <TouchableOpacity onPress={() => handleGoalChange(1)}>
                        <Text style={styles.bodyCopy}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleGoalChange(-1)}>
                        <Text style={styles.bodyCopy}>-</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity onPress={addTaskName}>
                <Text style={styles.buttonText}>Add Task Name</Text>
            </TouchableOpacity>

            <View>
                <Text style={markdownStyles.heading3}>Tasks:</Text>
                <TaskList
                    taskNames={taskNames}
                    onLongPress={showContextMenu}
                    onPress={setSelectedTask}
                />
            </View>
        </GestureHandlerRootView>
    );
}

export default PomodoroNew;
