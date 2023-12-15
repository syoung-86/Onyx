import {useFocusEffect} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {ProgressChart} from 'react-native-chart-kit';
import {processGoalData} from './StatsData';
import {getRandomColor, randomizeArray} from './StatsHelper';
import {styles, themeColors} from '../styles';
import { graphColors } from '../themes/catppuchin-mocha';

const ProgressChartComponent = () => {

const [progressData, setProgressData] = useState({ labels: [], data: [] });


    const seed = '27';
    let randomColors = randomizeArray(seed);
    randomColors = randomColors.map(rgbColor => `rgba(${rgbColor.slice(4, -1)}, 1)`);
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
            backgroundGradientFrom: themeColors.Mantle,
            backgroundGradientTo: themeColors.Mantle,
        decimalPlaces: 2,
    color: (opacity = 1) => `rgba(137, 180, 250, ${opacity})`,
        propsForLabels: {
fontSize: 12,
    fill: styles.bodyCopy.color,
    fillOpacity: 1,
        }
    };

    return (
        <View>
            <ProgressChart
                data={progressData}
                width={420}
                height={250}
                chartConfig={chartConfig}
            />
        </View>
    );
};

export default ProgressChartComponent;
