import {Scatter} from 'react-chartjs-2';
import 'chart.js/auto';
import {useEffect, useState} from "react";
import {generateEmotionColors} from "../services/generateEmotionColors";

export const EmotionScatterPlot = ({ data, emotions, selectAxes }) => {

    const [chartData, setChartData] = useState({ datasets: [] });
    const [chartOptions, setChartOptions] = useState({});

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

                // Set chart options, including scales and labels
        const updateChartOptions = () => {
            setChartOptions({
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: selectAxes.x, // Customize it as needed
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: selectAxes.y, // Customize it as needed
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true, // Set to false if you don't want to display legend
                        position: 'top', // Position of the legend
                    },
                    tooltip: {
                        enabled: true, // Enable/disable tooltips
                    },
                },
            });
        };

        updateChartData();
        updateChartOptions();

    }, [data, emotions, selectAxes]);

    return <Scatter data={chartData} options={chartOptions} />;
};
