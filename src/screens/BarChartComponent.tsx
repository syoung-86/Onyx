import React from 'react';
import {View, Text} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import {ProcessedRecord} from './StatsData';

interface ChartProps {
    data: ProcessedRecord[];
    title: string;
}

const BarChartComponent: React.FC<ChartProps> = ({data, title}) => {
    const hourFrequencyMap = new Map<number, number>();

    // Aggregate data based on the title
    let keyExtractor: (record: ProcessedRecord) => number;
    let labelFormatter: (item: {hour: number; frequency: number}) => string;

    switch (title.toLowerCase()) {
        case 'today':
            keyExtractor = record => record.date.getHours();
            labelFormatter = item => `${item.hour}:00`;
            break;
        case 'week':
            keyExtractor = record => record.date.getDay(); // 0-indexed, Sunday as 0
            labelFormatter = item => {
                // Define an array of day names as per your locale
                const dayNames = [
                    'Sun',
                    'Mon',
                    'Tue',
                    'Wed',
                    'Thu',
                    'Fri',
                    'Sat',
                ];
                return dayNames[item.hour];
            };
            break;
        // Add more cases for other titles if needed
        default:
            // Default to using the hour for unknown titles
            keyExtractor = record => record.date.getHours();
            labelFormatter = item => `${item.hour}:00`;
    }

    // Aggregate data based on the keyExtractor
    data.forEach(record => {
        const key = keyExtractor(record);
        hourFrequencyMap.set(key, (hourFrequencyMap.get(key) || 0) + 1);
    });

    // Prepare data for the bar chart
    const chartData = Array.from(hourFrequencyMap.entries()).map(
        ([hour, frequency]) => ({
            hour,
            frequency: frequency * 25, // Multiply by 25 or adjust as needed
        }),
    );

    return (
        <View>
            <BarChart
                data={{
                    labels: chartData.map(labelFormatter),
                    datasets: [
                        {
                            data: chartData.map(item => item.frequency),
                        },
                    ],
                }}
                width={500}
                height={220}
                yAxisSuffix=" min"
                yAxisInterval={25} // Adjust as needed based on your requirement
                chartConfig={{
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
            />
        </View>
    );
};

export default BarChartComponent;
