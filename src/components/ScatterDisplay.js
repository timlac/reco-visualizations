import React, {useMemo} from 'react';
import {Scatter} from 'react-chartjs-2';
import 'chart.js/auto';

export const EmotionScatterPlot = ({ data }) => {
    const chartData = useMemo(() => {
        // Group data points by emotion
        const groupedData = data.reduce((acc, d) => {
            // Find the existing group for this emotion or create a new one
            let group = acc.find(item => item.label === d.emotion);
            if (!group) {
                group = { label: d.emotion, data: [], pointRadius: [] }
                    // backgroundColor: /* logic to assign color based on emotion */, };
                acc.push(group);
            }

            // Apply jitter here or assume it's already applied in 'x' and 'y'
            group.data.push({ x: d.x, y: d.y });
            group.pointRadius.push(Math.sqrt(d.count) * 10);  // Use scaled count for point size

            return acc;
        }, []);

        return { datasets: groupedData };
    }, [data]);

    return <Scatter data={chartData} />;
};
