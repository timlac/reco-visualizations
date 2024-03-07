import {Scatter} from 'react-chartjs-2';
import 'chart.js/auto';
import {useEffect, useState} from "react";
import {generateEmotionColors} from "../services/generateEmotionColors";

export const EmotionScatterPlot = ({ data, emotions }) => {

    const [chartData, setChartData] = useState({ datasets: [] });

    useEffect(() => {
        const emotionColors = generateEmotionColors(emotions)

        // This function now updates the internal state
        const updateChartData = () => {
            const groupedData = data.reduce((acc, d) => {
                let group = acc.find(item => item.label === d.emotion);
                if (!group) {
                    group = { label: d.emotion, data: [], pointRadius: [], backgroundColor: emotionColors[d.emotion] };
                    acc.push(group);
                }
                group.data.push({ x: d.x, y: d.y });
                group.pointRadius.push(Math.sqrt(d.count) * 10);
                return acc;
            }, []);
            setChartData({ datasets: groupedData });
        };

        updateChartData();
    }, [data, emotions]);

    return <Scatter data={chartData} />;
};
