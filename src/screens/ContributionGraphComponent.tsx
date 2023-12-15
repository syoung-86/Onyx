import React from 'react';
import {View, Text, Dimensions, Appearance} from 'react-native';
import {ContributionGraph} from 'react-native-chart-kit';
import {ProcessedRecord} from './StatsData';
import { themeColors } from '../styles';

interface ContributionGraphProps {
    data: ProcessedRecord[];
    title: string;
}

const ContributionGraphComponent: React.FC<ContributionGraphProps> = ({
    data,
    title,
}) => {
    const dateFrequencyMap = new Map<string, number>();
    const windowWidth = Dimensions.get('window').width;
    // Aggregate data based on the title
    let keyExtractor: (record: ProcessedRecord) => string;
    let numDays = 60;

    switch (title.toLowerCase()) {
        case 'month':
            keyExtractor = record => record.date.toISOString().split('T')[0]; // Extract YYYY-MM-DD
            break;
        // Add more cases for other titles if needed
        default:
            // Default to using the full date for unknown titles
            keyExtractor = record => record.date.toISOString().split('T')[0];
            numDays = 100;
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
    console.log(commitsData);
const colorScheme = Appearance.getColorScheme();

    var labelColor = "rgba(205,214,244,1)";
if (colorScheme === 'dark'){
    labelColor = "rgba(205,214,244,1)";
} else {
    labelColor = "rgba(76, 79, 105,1)";
}

    // Custom chart configuration
    const chartConfig = {
            backgroundGradientFrom: themeColors.Mantle,
            backgroundGradientTo: themeColors.Mantle,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(137, 180, 250, ${opacity})`,
        labelColor: () => labelColor,
    };
  const tooltipDataAttrs = {
    stroke: 'rgba(137, 180, 250, 1)',
    strokeWidth: 2,
  };
    return (
        <View>
<ContributionGraph
  values={commitsData}
  endDate={new Date()}
  numDays={numDays}
  width={windowWidth}
  height={220}
  chartConfig={chartConfig}
/>
        </View>
    );
};

export default ContributionGraphComponent;
