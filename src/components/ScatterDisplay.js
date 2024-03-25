import {Scatter} from 'react-chartjs-2';
import 'chart.js/auto';
import {useEffect, useState} from "react";
import {generateEmotionColors} from "../services/generateEmotionColors";

export const ScatterDisplay = ({ data, instances, selectAxes }) => {

    const [chartData, setChartData] = useState({ datasets: [] });
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const emotionColors = generateEmotionColors(instances)

        // Find the maximum count value in the dataset
        const maxCount = Math.max(...data.map(d => d.count));

        // Normalize point radius based on the maximum count
        const normalizePointRadius = (count) => {
            const maxRadius = 30; // Maximum radius size
            return Math.sqrt(count / maxCount) * maxRadius;
        };


        // This function now updates the internal state
        const updateChartData = () => {
            const groupedData = data.reduce((acc, d) => {
                let group = acc.find(item => item.label === d.filterColumn);
                if (!group) {
                    group = { label: d.filterColumn, data: [], pointRadius: [], backgroundColor: emotionColors[d.filterColumn] };
                    acc.push(group);
                }
                group.data.push({ x: d.x, y: d.y });
                group.pointRadius.push(normalizePointRadius(d.count));
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

    }, [data, instances, selectAxes]);

    return <Scatter data={chartData} options={chartOptions} />;
};
