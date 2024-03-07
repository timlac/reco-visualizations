import { useEffect, useState } from "react";
import { EmotionScatterPlot } from "./ScatterDisplay";
import { getEmotionFromId } from "nexa-js-sentimotion-mapper";
import {parseCSV} from "../services/parseCsv";
import {EmotionSelect} from "./EmotionSelect";
import {getUniqueEmotions} from "../services/getUniqueEmotions";
import {AxisSelect} from "./AxisSelect";

export const Visualize = () => {
    const [rawData, setRawdata] = useState([])
    const [filteredData, setFilteredData] = useState([])

    const [processedData, setProcessedData] = useState([]);
    const [uniqueEmotions, setUniqueEmotions] = useState([])
    const [selectedEmotions, setSelectedEmotions] = useState([]); // New state for selected emotions


    const [selectedAxes, setSelectedAxes] = useState({ x: 'novelty', y: 'pleasantness' }); // Default axes


    useEffect(() => {
        const fetchData = async () => {
            const rawData = await parseCSV('/export_appraisal.csv');
            const transformedData = transformData(rawData);
            setRawdata(transformedData)
            setFilteredData(transformedData)

            const allEmotions = getUniqueEmotions(transformedData)
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

    const transformData = (rawData) => rawData.map(row => ({
        ...row,
        emotion: getEmotionFromId(row.emotion_1_id)
    }));

    // Handler function to update selectedEmotions
    const handleEmotionChange = (newSelectedEmotions) => {
        console.log("rawdata", rawData)
        console.log("selected emotions", newSelectedEmotions)
        setSelectedEmotions(newSelectedEmotions);
        setFilteredData(filterDataByEmotions(rawData, newSelectedEmotions))
    };

    const filterDataByEmotions = (data, emotionsToInclude) => {
        console.log(emotionsToInclude)
        console.log(data)
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
