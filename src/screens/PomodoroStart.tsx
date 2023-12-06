import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    FlatList,
    Modal,
} from 'react-native';
import {
    LongPressGestureHandler,
    GestureHandlerRootView,
    TextInput,
    State,
    ScrollView,
} from 'react-native-gesture-handler';
import {styles} from '../styles';
import {
    createRecord,
    readRecords,
    updateRecord,
    deleteRecord,
    readTodayPomodoro,
    deletePomodoro,
} from '../database';
import {RadioButton} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import EditTask from './EditTaskModal';
import ProgressRing from './ProgressRingComponent';

function PomodoroStart() {
    const [timer, setTimer] = useState(60 * 25); // Initial time in seconds (25 minutes)
    const [isRunning, setIsRunning] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [selectedTask, setSelectedTask] = useState('');
    const [taskNames, setTaskNames] = useState<
        {id: number; name: string; goal: number}[]
    >([]);
    const [pomodorosData, setPomodoros] = useState<
        {id: number; name: string; date: string}[]
    >([]);
    const [taskProgress, setTaskProgress] = useState<Map<string, number>>(
        new Map(),
    );
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [editingTask, setEditingTask] = useState<{
        id: number;
        name: string;
        goal: number;
    }>();

    const fetchData = async () => {
        try {
            const pomodorosData = await readTodayPomodoro();
            setPomodoros(pomodorosData);
        } catch {
            console.log('Error reading from Pomodoro table:', Error);
        }
    };
    useFocusEffect(
        React.useCallback(() => {
            readRecords('taskname')
                .then(names =>
                    setTaskNames(
                        names as {id: number; name: string; goal: number}[],
                    ),
                )
                .catch(error =>
                    console.error('Error fetching task names:', error),
                );
        }, [isEditModalVisible]),
    );

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [selectedTask]),
    );
    //useEffect(() => {
    //fetchData();
    //}, []);
    //
    useEffect(() => {
        const updatedTaskProgress = new Map<string, number>();
        const today = new Date();
        const todayDateString = `${
            today.getMonth() + 1
        }/${today.getDate()}/${today.getFullYear()}`;

        const pomodorosDataToday = pomodorosData.filter(data => {
            // Extract the date portion from data.date (assuming the date is in "MM/DD/YYYY" format)
            const dataDate = data.date.split(',')[0];
            return dataDate === todayDateString;
        });
        pomodorosDataToday.forEach(data => {
            const currentProgress = updatedTaskProgress.get(data.name) || 0;
            updatedTaskProgress.set(data.name, currentProgress + 1);
        });
        setTaskProgress(updatedTaskProgress);
    }, [pomodorosData]);
    console.log(taskProgress);
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning && timer > 0) {
            interval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsBreak(prevIsBreak => !prevIsBreak);
            setTimer(isBreak ? 60 * 25 : 300); // Switch between work and break (25 minutes or 5 minutes)
        }

        return () => clearInterval(interval);
    }, [isRunning, timer, isBreak]);

    const formatTime = (timeInSeconds: number): string => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`;
    };

    const startTimer = () => {
        setIsRunning(true);
        const date = new Date().toLocaleString();
        createRecord('pomodoro', {name: selectedTask, date: date});
        fetchData();
    };

    const pauseTimer = () => {
        setIsRunning(false);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setIsBreak(false);
        setTimer(60 * 25); // Reset to the initial time (25 minutes)
    };

    const showContextMenu = (task: {
        id: number;
        name: string;
        goal: number;
    }) => {
        Alert.alert('Task Options', 'Select an action for this task:', [
            {
                text: 'Edit Task',
                onPress: () => {
                    // Add your logic to delete the task here
                    openEditModal(task);
                },
            }, // <-- Add a closing bracket here
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
        // BUG: pomdoro list will not update if no task is selected when a task is deleted
        deleteRecord('taskName', task.id).catch(error =>
            console.error('Error deleting task:', error),
        );
        deletePomodoro(task.name);
    };
    const openEditModal = (task: {id: number; name: string; goal: number}) => {
        setEditingTask(task);
        setEditModalVisible(true);
    };

    return (
        <GestureHandlerRootView>
            {/* Render the Modal */}
            <Modal visible={isEditModalVisible} animationType="slide">
                {/* Integrate EditTask component */}
                <EditTask
                    task={editingTask}
                    closeModal={() => setEditModalVisible(false)}
                    onEditComplete={() => {
                        // Logic after editing is complete
                        fetchData();
                    }}
                />
            </Modal>

            {/* ... (existing code) */}
            <View style={styles.container}></View>

            <View style={styles.contentContainer}>
                <Text style={styles.timerText}>{formatTime(timer)}</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={isRunning ? pauseTimer : startTimer}
                    disabled={selectedTask.length === 0}>
                    <Text style={styles.buttonText}>
                        {isRunning ? 'Pause' : 'Start'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={resetTimer}>
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
            </View>
            <View></View>

            <ScrollView>
                {taskNames.map(taskName => (
                    <LongPressGestureHandler
                        onHandlerStateChange={({nativeEvent}) => {
                            if (nativeEvent.state === State.ACTIVE) {
                                showContextMenu(taskName);
                            }
                        }}
                        key={`${taskName.id}-${taskName.name}`}>
                        <View>
                            <RadioButton.Item
                                label={`${taskName.name} - Goal: ${
                                    taskName.goal
                                } - Progress: ${
                                    taskProgress.get(taskName.name) || 0
                                }`}
                                value={taskName.name}
                                status={
                                    selectedTask === taskName.name
                                        ? 'checked'
                                        : 'unchecked'
                                }
                                onPress={() => setSelectedTask(taskName.name)}
                            />
                        </View>
                    </LongPressGestureHandler>
                ))}
            </ScrollView>
        </GestureHandlerRootView>
    );
}

export default PomodoroStart;
