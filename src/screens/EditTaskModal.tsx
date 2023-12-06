import React, {useState} from 'react';
import {View, Text, TouchableOpacity, TextInput, Button} from 'react-native';
import {updatePomodoro, updateRecord} from '../database';

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
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Edit Task</Text>
            <TextInput
                value={editedTaskName}
                onChangeText={text => setEditedTaskName(text)}
                placeholder="Enter task name"
            />
            <TextInput
                value={editedGoal}
                onChangeText={text => setEditedGoal(text)}
                placeholder="Enter task goal"
                keyboardType="numeric"
            />
            <Button title="Save Changes" onPress={saveChanges} />
            <Button title="Cancel" onPress={closeModal} />
        </View>
    );
};

export default EditTask;
