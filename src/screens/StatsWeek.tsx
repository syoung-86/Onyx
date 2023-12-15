import {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {ProcessedRecord, processWeekData} from './StatsData';
import PieChart from './PieChart';
import BarChartComponent from './BarChartComponent';
import React from 'react';
import { useFocusEffect } from '@react-navigation/native';

const StatsWeek = () => {
    const [data, setData] = useState<ProcessedRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useFocusEffect(
        React.useCallback(() => {
        const fetchData = async () => {
            try {
                const weekData = await processWeekData();
                setData(weekData);
            } catch (error) {
                console.error('Error fetching stats data:', error);
                setError('Error fetching data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        }, []),
    );

    if (loading) {
        return <Text>Loading...</Text>; // You can customize the loading indicator
    }

    if (error) {
        return <Text>Error: {error}</Text>;
    }

    // Render your component with the fetched data
    return (
        <View>
            <PieChart data={data} title="Week" />
            <BarChartComponent data={data} title="Week" />
        </View>
    );
};

export default StatsWeek;
