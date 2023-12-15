import React from 'react';
import {View, Text, Appearance} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import {ProcessedRecord} from './StatsData';
import { Dimensions } from 'react-native';
import { themeColors } from '../styles';

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

    const colorScheme = Appearance.getColorScheme();

        var labelColor = "rgba(205,214,244,1)";
        var chartColor = "rgba(203, 166, 247,1)";
    if (colorScheme === 'dark'){
        labelColor = "rgba(205,214,244,1)";
        chartColor = "rgba(136, 57, 239,1)";
    } else {
        labelColor = "rgba(76, 79, 105,1)";
        chartColor = "rgba(203, 166, 247,1)";
    }
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
            backgroundGradientFrom: themeColors.Mantle,
            backgroundGradientTo: themeColors.Mantle,
                    decimalPlaces: 2,
                    color: (opacity = 1) => themeColors.Blue,
                    labelColor: (opacity = 1) => labelColor,
                    paddingRight: 10,
                }}
            />
        </View>
    );
};

export default BarChartComponent;
