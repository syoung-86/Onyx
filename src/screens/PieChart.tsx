import React from 'react';
import {View, Text} from 'react-native';
import {PieChart} from 'react-native-chart-kit';
import {ProcessedRecord} from './StatsData'; // Adjust the import path

interface ChartProps {
    data: ProcessedRecord[];
    title: string;
}

const ChartComponent: React.FC<ChartProps> = ({data, title}) => {
    const taskFrequencyMap = new Map<string, number>();

    // Count the frequency of each task
    data.forEach(record => {
        const task = record.name;
        taskFrequencyMap.set(task, (taskFrequencyMap.get(task) || 0) + 1);
    });

    // Prepare data for the pie chart
    const chartData = Array.from(taskFrequencyMap.entries()).map(
        ([task, frequency]) => ({
            name: task,
            frequency: frequency * 25, // Assuming each task took 25 minutes
        }),
    );

    return (
        <View>
            <PieChart
                data={chartData}
                width={300}
                height={300}
                chartConfig={{
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="frequency"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute // Renders the chart as percentages instead of absolute values
            />
        </View>
    );
};

export default ChartComponent;
