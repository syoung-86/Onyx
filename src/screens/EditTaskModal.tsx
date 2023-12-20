import React, {useState} from 'react';
import {View, Text, TouchableOpacity, TextInput, Button} from 'react-native';
import {updatePomodoro, updateRecord} from '../database';
import { markdownStyles, styles } from '../styles';

const EditTask: React.FC<{
    task: {
        id: number;
        name: string;
        goal: number;
    };
    closeModal: () => void;
    onEditComplete: () => void;
}> = ({task, closeModal, onEditComplete}) => {
    const [editedTaskName, setEditedTaskName] = useState(task ? task.name : '');
    const [editedGoal, setEditedGoal] = useState(
        task ? task.goal.toString() : '',
    );

    const saveChanges = async () => {
        try {
            const goalValue = parseInt(editedGoal, 10); // Convert goal to number

            await updateRecord('taskName', task.id, {
                name: editedTaskName,
                goal: goalValue,
            });
            await updatePomodoro(task.name, editedTaskName);

            closeModal();
            onEditComplete();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    return (
        <View style={styles.contentContainer}>
            <Text style={markdownStyles.heading1}>Edit Task</Text>
            <TextInput
                value={editedTaskName}
                style={styles.subtle}
                onChangeText={text => setEditedTaskName(text)}
                placeholder="Enter task name"
                placeholderTextColor={styles.subtle.color}
            />
            <TextInput
                value={editedGoal}
                style={styles.subtle}
                onChangeText={text => setEditedGoal(text)}
                placeholder="Enter task goal"
                keyboardType="numeric"
                placeholderTextColor={styles.subtle.color}
            />
            <TouchableOpacity onPress={saveChanges}>
            <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeModal}>
            <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );
};

export default EditTask;
