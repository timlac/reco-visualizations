import { useEffect, useState } from "react";
import { EmotionScatterPlot } from "./ScatterDisplay";
import { getEmotionFromId } from "nexa-js-sentimotion-mapper";
import {getCsvData, parseCSV} from "../services/parseCsv";
import {EmotionSelect} from "./EmotionSelect";
import {getUniqueEmotions} from "../services/getUniqueEmotions";
import {AxisSelect} from "./AxisSelect";

export const Visualize = () => {
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])

    const [processedData, setProcessedData] = useState([]);
    const [uniqueEmotions, setUniqueEmotions] = useState([])
    const [selectedEmotions, setSelectedEmotions] = useState([]); // New state for selected emotions

    const [selectedAxes, setSelectedAxes] = useState({ x: 'novelty', y: 'pleasantness' }); // Default axes


    useEffect(() => {
        const fetchData = async () => {
            const csvData = await getCsvData('/export_appraisal.csv');

            console.log(csvData)
            setData(csvData)
            setFilteredData(csvData)

            const allEmotions = getUniqueEmotions(csvData)
            setUniqueEmotions(allEmotions)

            setSelectedEmotions(allEmotions)
        };
        fetchData();
    }, []);

    useEffect(() => {
        const countedData = countEmotions(filteredData)
        const jitteredData = applyJitter(countedData);
        setProcessedData(jitteredData);
    }, [filteredData]);


    // Handler function to update selectedEmotions
    const handleEmotionChange = (newSelectedEmotions) => {
        setSelectedEmotions(newSelectedEmotions);
        setFilteredData(filterDataByEmotions(data, newSelectedEmotions))
    };

    const filterDataByEmotions = (data, emotionsToInclude) => {
        return data.filter(row => emotionsToInclude.includes(row.emotion));
    }

    const countEmotions = (filteredData) => {
        const countsMap = filteredData.reduce((acc, row) => {
            const key = `${row.emotion}-${row.reply_dim_Novelty}-${row.reply_dim_Pleasantness}`;
            acc.set(key, (acc.get(key) || 0) + 1);
            return acc;
        }, new Map());

        return Array.from(countsMap, ([key, count]) => {
            const [emotion, reply_dim_Novelty, reply_dim_Pleasantness] = key.split('-');
            return {
                emotion,
                reply_dim_Novelty: parseFloat(reply_dim_Novelty),
                reply_dim_Pleasantness: parseFloat(reply_dim_Pleasantness),
                count
            };
        });
    };

    const applyJitter = (countedData) => countedData.map(d => ({
        ...d,
        x: d.reply_dim_Novelty + Math.random() * 0.3 - 0.15,
        y: d.reply_dim_Pleasantness + Math.random() * 0.3 - 0.15,
    }));

    return (
        <div>
            {uniqueEmotions.length > 0 && <EmotionSelect
                emotions={uniqueEmotions}
                onEmotionChange={handleEmotionChange}>
            </EmotionSelect> }

            {/*<AxisSelect selectedAxes={selectedAxes} availableAxes={} onAxisChange={}></AxisSelect>*/}

            {processedData.length > 0 && <EmotionScatterPlot data={processedData} emotions={selectedEmotions} />}
        </div>
    );
};
