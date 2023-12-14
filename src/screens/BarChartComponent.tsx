import React from 'react';
import {View, Text} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import {ProcessedRecord} from './StatsData';
import { Dimensions } from 'react-native';

interface ChartProps {
    data: ProcessedRecord[];
    title: string;
}

const BarChartComponent: React.FC<ChartProps> = ({data, title}) => {
    const hourFrequencyMap = new Map<number, number>();
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
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
        case 'all':
            keyExtractor = record => record.date.getMonth(); // 0-indexed, Sunday as 0
            labelFormatter = item => {
                // Define an array of day names as per your locale
                const dayNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
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
                width={windowWidth}
                height={220}
                yAxisSuffix=" min"
                yAxisLabel=''
                yAxisInterval={25} // Adjust as needed based on your requirement
                chartConfig={{
            backgroundGradientFrom: 'rgb(17, 17, 27)',
            backgroundGradientTo: 'rgb(17, 17, 27)',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(116, 199, 236, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(205, 214, 244, ${opacity})`,
                    paddingRight: 10,
                }}
            />
        </View>
    );
};

export default BarChartComponent;
