import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {PieChart} from 'react-native-chart-kit';
import {readPomodoro} from '../database'; // Replace with the actual path
import {useFocusEffect} from '@react-navigation/native';

interface PomodoroRecord {
    id: number;
    name: string;
    date: string;
}

const ChartExample = () => {
    const [pomodoroData, setPomodoroData] = useState<PomodoroRecord[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            readPomodoro()
                .then(data => setPomodoroData(data))
                .catch(error =>
                    console.error('Error fetching pomodoro data:', error),
                );
        }, []),
    );

    // Check if pomodoroData is empty before rendering the chart
    if (pomodoroData.length === 0) {
        return (
            <View>
                <Text>No data available</Text>
            </View>
        );
    }

    // Preprocess data to calculate total time spent for each task name
    const groupedData = pomodoroData.reduce(
        (acc, record) => {
            if (!acc[record.name]) {
                acc[record.name] = 25; // Assuming each record represents 25 minutes
            } else {
                acc[record.name] += 25;
            }
            return acc;
        },
        {} as {[name: string]: number},
    );

    // Convert grouped data to an array of { name, totalTime } objects
    const chartData = Object.keys(groupedData).map(name => ({
        name,
        totalTime: groupedData[name],
    }));

    return (
        <View>
            <PieChart
                data={chartData.map(dataPoint => ({
                    name: dataPoint.name,
                    minutes: dataPoint.totalTime,
                    color: `#${Math.floor(Math.random() * 16777215).toString(
                        16,
                    )}`, // Random color for each task
                }))}
                width={400}
                height={200}
                chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="minutes"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
            />
        </View>
    );
};

export default ChartExample;
