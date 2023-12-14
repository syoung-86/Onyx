import React, { useState } from 'react';
import { View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { ProcessedRecord } from './StatsData';
import { styles } from '../styles';
import { getRandomColor, randomizeArray } from './StatsHelper';
import { useFocusEffect } from '@react-navigation/native';

interface ChartProps {
  data: ProcessedRecord[];
  title: string;
}

const ChartComponent: React.FC<ChartProps> = ({ data, title }) => {
  const taskFrequencyMap = new Map<string, number>();
  const [chartData, setChartData] = useState([]);
  const [colorIndex, setColorIndex] = useState(0);

  const seed = '7';
  const randomColors = randomizeArray(seed);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = () => {
        try {
          const updatedChartData = [];
          data.forEach((record) => {
            const task = record.name;
            const frequency = taskFrequencyMap.get(task) || 0;

            // Check if the task is already in the chart data
            const existingIndex = updatedChartData.findIndex((item) => item.name === task);

            if (existingIndex !== -1) {
              // If it exists, update the frequency
              updatedChartData[existingIndex].frequency += 25; // Assuming each task took 25 minutes
            } else {
              // If it doesn't exist, add a new entry
              const colorIndex = updatedChartData.length % randomColors.length;
              updatedChartData.push({
                name: task,
                frequency: 25, // Assuming each task took 25 minutes
                color: randomColors[colorIndex],
                legendFontColor: styles.bodyCopy.color,
              });
            }

            taskFrequencyMap.set(task, frequency + 1);
          });

          // Update the state variable
          setChartData(updatedChartData);
        } catch (error) {
          console.error('Error fetching progress data:', error);
        }
      };

      fetchData();
    }, [data]),
  );

  return (
    <View>
      <PieChart
        data={chartData}
        width={420}
        height={300}
        chartConfig={{
            backgroundGradientFrom: 'rgb(17, 17, 27)',
            backgroundGradientTo: 'rgb(17, 17, 27)',

          decimalPlaces: 2,
          color: getRandomColor,
          labelColor: getRandomColor,
        }}
        accessor="frequency"
        backgroundColor="rgb(17, 17, 27)"
        paddingLeft="15"
        absolute
      />
    </View>
  );
};

export default ChartComponent;
