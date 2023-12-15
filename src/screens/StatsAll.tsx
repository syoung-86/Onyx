import {useState} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {ProcessedRecord, processAllData} from './StatsData';
import PieChart from './PieChart';
import React from 'react';
import BarChartComponent from './BarChartComponent';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';

const StatsAll = () => {
    const [data, setData] = useState<ProcessedRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useFocusEffect(
        React.useCallback(() => {
        const fetchData = async () => {
            try {
                const allData = await processAllData();
                setData(allData);
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

        <GestureHandlerRootView>
            <ScrollView>
            <PieChart data={data} title="All" />
            <BarChartComponent data={data} title="All" />
            </ScrollView>
            </GestureHandlerRootView>
        </View>
    );
};

export default StatsAll;
