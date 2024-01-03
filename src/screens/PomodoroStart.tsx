import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Alert, Modal} from 'react-native';
import {
    LongPressGestureHandler,
    GestureHandlerRootView,
    State,
    ScrollView,
} from 'react-native-gesture-handler';
import {styles} from '../styles';
import {
    createRecord,
    readRecords,
    deleteRecord,
    readTodayPomodoro,
    deletePomodoro,
} from '../database';
import {RadioButton} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import EditTask from './EditTaskModal';
import scheduleNotification, {cancelNotification} from '../LocalNotifaction';

function PomodoroStart() {
    const WORK_LENGTH = 5;
    const BREAK_LENGTH = 3;
    const [showStart, setShowStart] = useState(true);
    const [pomoNotifId, setPomoNotifId] = useState('');
    const [breakNotifId, setBreakNotifId] = useState('');
    const [isReset, setIsReset] = useState(false);
    const [timer, setTimer] = useState(WORK_LENGTH); // Initial time in seconds (25 minutes)
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
    const [currentTask, setCurrentTask] = useState<{
        id: number;
        name: string;
        date: string;
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
            readRecords('taskName')
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

    const parseDateStringToDate = (dateString: string): Date => {
        const dateComponents = dateString.split(/[\s,/:]+/);

        let hours = parseInt(dateComponents[3]);
        if (dateComponents[6] && dateComponents[6].toUpperCase() === 'PM') {
            hours = (hours % 12) + 12;
        }

        return new Date(
            Date.UTC(
                parseInt(dateComponents[2]), // Year
                parseInt(dateComponents[0]) - 1, // Month (0-based)
                parseInt(dateComponents[1]), // Day
                hours, // Adjusted hours
                parseInt(dateComponents[4]), // Minutes
                parseInt(dateComponents[5]) || 0, // Seconds
                parseInt(dateComponents[6]) || 0, // Milliseconds
            ),
        );
    };
    const calculateRemainingTime = (startTime: Date, duration: number) => {
        const currentTime = parseDateStringToDate(new Date().toLocaleString());
        const elapsedTime = Math.floor(
            (currentTime.getTime() - startTime.getTime()) / 1000,
        );
        const remainingTime = Math.max(duration - elapsedTime, 0);
        return remainingTime;
    };
    useEffect(() => {
        const latestPomodoro = pomodorosData[pomodorosData.length - 1];
        if (latestPomodoro && !isReset) {
            const startTime = parseDateStringToDate(latestPomodoro.date);
            const remainingWorkTime = calculateRemainingTime(
                startTime,
                WORK_LENGTH,
            );
            const remainingBreakTime = calculateRemainingTime(
                startTime,
                WORK_LENGTH + BREAK_LENGTH,
            );
            if (remainingWorkTime > 0) {
                setCurrentTask(latestPomodoro);
                setIsBreak(false);
                setTimer(remainingWorkTime);
                setIsRunning(true);
                setShowStart(false);
            } else if (remainingBreakTime > 0) {
                setIsBreak(true);
                setTimer(remainingBreakTime);
            } else {
                setIsRunning(false);
                setIsBreak(false);
                setTimer(WORK_LENGTH);
            }
        }
    }, [pomodorosData, timer]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning && timer > 0) {
            interval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        }

        return () => clearInterval(interval); // Cleanup interval on component unmount or dependency change
    }, [isRunning, timer]);

    const formatTime = (timeInSeconds: number): string => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`;
    };

    const startTimer = async () => {
        setIsRunning(true);
        setIsReset(false);
        setPomoNotifId(
            await scheduleNotification(
                'pomodoroChannel',
                'Start Break',
                'pomodoro expired',
                timer,
            ),
        );
        setBreakNotifId(
            await scheduleNotification(
                'pomodoroChannel',
                'Start Work',
                'Break expired',
                timer + BREAK_LENGTH,
            ),
        );
        const date = new Date().toLocaleString();
        createRecord('pomodoro', {name: selectedTask, date: date});
        fetchData();
    };

    const resetTimer = () => {
        const latestPomodoro = pomodorosData[pomodorosData.length - 1];
        if (latestPomodoro) {
            console.log('latest in reset timer', latestPomodoro);
            deleteRecord('pomodoro', latestPomodoro.id);
        }
        setIsRunning(false);
        setIsBreak(false);
        setTimer(WORK_LENGTH); // Reset to the initial time (25 minutes)
        setIsReset(true);
        cancelNotification(breakNotifId);
        cancelNotification(pomoNotifId);
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

            <View>
                <Text style={styles.linksURLs}>
                    Current:{' '}
                    {isRunning && currentTask && !isBreak
                        ? currentTask.name
                        : isBreak
                          ? 'Break'
                          : 'None'}
                </Text>
            </View>

            <View style={styles.contentContainer}>
                <Text style={styles.success}>{formatTime(timer)}</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={!isRunning ? startTimer : resetTimer}
                    disabled={selectedTask.length === 0}>
                    <Text style={styles.button}>
                        {!isRunning ? 'Start' : 'Reset'}
                    </Text>
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
                                labelStyle={styles.bodyCopy}
                                uncheckedColor={styles.tagsPills.color}
                                color={styles.success.color}
                                label={taskName.name}
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
