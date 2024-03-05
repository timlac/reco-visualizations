import React from 'react';
import {Bubble} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
);

const BubbleChart = ({data}) => {
    const options = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Dimension 1',
                },
                ticks: {
                    stepSize: 1,
                    callback: function (value) {
                        if (value % 1 === 0) {
                            return value;
                        }
                    }

                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Dimension 2',
                },
                ticks: {
                    stepSize: 1,
                    callback: function (value) {
                        if (value % 1 === 0) {
                            return value;
                        }
                    }

                }
            },
        },
    };

    return <Bubble data={data} options={options}/>;
};

export default BubbleChart;
