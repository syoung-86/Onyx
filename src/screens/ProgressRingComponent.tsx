import {useFocusEffect} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {ProgressChart} from 'react-native-chart-kit';
import {processGoalData} from './StatsData';

const ProgressChartComponent = () => {
    const [progressData, setProgressData] = useState(new Map());

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    const data = await processGoalData();
                    setProgressData(data);
                } catch (error) {
                    console.error('Error fetching progress data:', error);
                }
            };

            fetchData();
        }, []),
    );

    const chartConfig = {
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 2,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    };

    return (
        <View>
            <ProgressChart
                data={{
                    labels: Array.from(progressData.keys()),
                    data: Array.from(progressData.values()),
                }}
                width={420}
                height={250}
                chartConfig={chartConfig}
            />
        </View>
    );
};

export default ProgressChartComponent;
