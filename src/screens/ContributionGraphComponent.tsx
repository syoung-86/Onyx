import React from 'react';
import {View, Text} from 'react-native';
import {ContributionGraph} from 'react-native-chart-kit';
import {ProcessedRecord} from './StatsData';

interface ContributionGraphProps {
    data: ProcessedRecord[];
    title: string;
}

const ContributionGraphComponent: React.FC<ContributionGraphProps> = ({
    data,
    title,
}) => {
    const dateFrequencyMap = new Map<string, number>();

    // Aggregate data based on the title
    let keyExtractor: (record: ProcessedRecord) => string;

    switch (title.toLowerCase()) {
        case 'month':
            keyExtractor = record => record.date.toISOString().split('T')[0]; // Extract YYYY-MM-DD
            break;
        // Add more cases for other titles if needed
        default:
            // Default to using the full date for unknown titles
            keyExtractor = record => record.date.toISOString().split('T')[0];
    }

    // Aggregate data based on the keyExtractor
    data.forEach(record => {
        const key = keyExtractor(record);
        dateFrequencyMap.set(key, (dateFrequencyMap.get(key) || 0) + 1);
    });

    // Prepare data for the ContributionGraph
    const commitsData = Array.from(dateFrequencyMap.entries()).map(
        ([date, count]) => ({
            date,
            count,
        }),
    );

    // Custom chart configuration
    const chartConfig = {
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    };

    return (
        <View>
            <ContributionGraph
                values={commitsData}
                endDate={new Date()} // Use the current date as the end date
                numDays={30} // Number of days to display
                width={500}
                height={220}
                chartConfig={chartConfig}
            />
        </View>
    );
};

export default ContributionGraphComponent;
