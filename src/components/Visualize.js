import { useEffect, useState } from "react";
import Papa from "papaparse";
import { EmotionScatterPlot } from "./ScatterDisplay";
import { getEmotionFromId } from "nexa-js-sentimotion-mapper";

export const Visualize = () => {
    const [data, setData] = useState([]);
    const [processedData, setProcessedData] = useState([]);

    useEffect(() => {
        // Fetch and parse CSV data
        Papa.parse('/export_appraisal.csv', {
            download: true,
            header: true,
            complete: (result) => {
                const transformedData = result.data.map(row => ({
                    ...row,
                    emotion: getEmotionFromId(row.emotion_1_id)
                }));
                setData(transformedData);
            }
        });
    }, []);

    // "peacefulness_serenity"

    // Separate useEffect for counting and applying jitter
    useEffect(() => {
        const emotionsToInclude = ['positive_surprise',
 'relief',
 'anger',
 'guilt',
 'negative_surprise',
];

        // Aggregate data to count occurrences and filter by emotions
        const countsMap = new Map();
        data.filter(row => emotionsToInclude.includes(row.emotion)).forEach(row => {
            const key = `${row.emotion}-${row.reply_dim_Novelty}-${row.reply_dim_Pleasantness}`;
            countsMap.set(key, (countsMap.get(key) || 0) + 1);
        });

        // Convert countsMap to array and include count in each object
        const withCounts = Array.from(countsMap, ([key, count]) => {
            const [emotion, reply_dim_Novelty, reply_dim_Pleasantness] = key.split('-');
            return {
                emotion,
                reply_dim_Novelty: parseFloat(reply_dim_Novelty),
                reply_dim_Pleasantness: parseFloat(reply_dim_Pleasantness),
                count
            };
        });

        console.log(withCounts)

        // Apply jitter here if you want to keep it separate from the count logic
        const withJitter = withCounts.map(d => ({
            ...d,
            x: d.reply_dim_Novelty + Math.random() * 0.3 - 0.15,
            y: d.reply_dim_Pleasantness + Math.random() * 0.3 - 0.15,
        }));

        setProcessedData(withJitter);
    }, [data]); // This effect runs when `data` changes

    return (
        <div>
            {processedData.length > 0 && <EmotionScatterPlot data={processedData}/>}
        </div>
    );
};
