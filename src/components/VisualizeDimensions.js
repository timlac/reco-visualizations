import { useEffect, useState, useMemo } from "react";
import Papa from "papaparse";
import BubbleChart from "./ScatterDisplay";

export const VisualizeDimensions = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Fetch and parse CSV data
        Papa.parse('/export_appraisal.csv', {
            download: true,
            header: true,
            complete: (result) => {
                setData(result.data);
            }
        });
    }, []);

    const chartData = useMemo(() => {
        if (data.length === 0) return null;

        const counts = data.reduce((acc, row) => {
            const key = `${row.reply_dim_Novelty}-${row.reply_dim_Pleasantness}`;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        console.log("counts ", counts)

        const formattedData = Object.entries(counts).map(([key, count]) => {
            const [x, y] = key.split('-').map(Number);
            return {
                x,
                y,
                r: Math.sqrt(count) * 10 // Adjust the size scaling as needed
            };
        });

        return {
            datasets: [
                {
                    label: 'Survey Results',
                    data: formattedData,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)'
                }
            ]
        };
    }, [data]);

    return chartData && <BubbleChart data={chartData} />;
};
