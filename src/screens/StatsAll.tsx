import {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {ProcessedRecord, processAllData} from './StatsData';
import PieChart from './PieChart';
import ContributionGraphComponent from './ContributionGraphComponent';
import React from 'react';

const StatsAll = () => {
    const [data, setData] = useState<ProcessedRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
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
    }, []);

    if (loading) {
        return <Text>Loading...</Text>; // You can customize the loading indicator
    }

    if (error) {
        return <Text>Error: {error}</Text>;
    }

    // Render your component with the fetched data
    return (
        <View>
            <PieChart data={data} title="All" />
            <ContributionGraphComponent data={data} title="All" />
        </View>
    );
};

export default StatsAll;
