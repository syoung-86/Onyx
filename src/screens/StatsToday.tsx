import {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {processTodayData, ProcessedRecord} from './StatsData';
import PieChart from './PieChart';
import BarChartComponent from './BarChartComponent';
import ProgressChartComponent from './ProgressRingComponent';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';
import React from 'react';

const StatsToday = () => {
    const [data, setData] = useState<ProcessedRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const todayData = await processTodayData();
                setData(todayData);
            } catch (error) {
                console.error('Error fetching stats data:', error);
                setError('Error fetching data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <Text>Loading...</Text>; // You can customize the loading indicator
    }

    if (error) {
        return <Text>Error: {error}</Text>;
    }

    // Render your component with the fetched data
    return (
        <GestureHandlerRootView>
            <ScrollView>
                <ProgressChartComponent />
                <PieChart data={data} title="Today" />
                <BarChartComponent data={data} title="Today" />
            </ScrollView>
        </GestureHandlerRootView>
    );
};

export default StatsToday;
