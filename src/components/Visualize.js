import {useEffect, useState} from "react";
import {EmotionScatterPlot} from "./ScatterDisplay";
import {getEmotionFromId} from "nexa-js-sentimotion-mapper";
import {parseCSV} from "../services/parseCsv";
import {EmotionSelect} from "./EmotionSelect";
import {getUniqueEmotions} from "../services/getUniqueEmotions";
import {AxisSelect} from "./AxisSelect";
import {getAxes} from "../services/getAxes";

export const Visualize = () => {
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])

    const [processedData, setProcessedData] = useState([]);
    const [uniqueEmotions, setUniqueEmotions] = useState([])
    const [selectedEmotions, setSelectedEmotions] = useState([]); // New state for selected emotions
    const [availableAxes, setAvailableAxes] = useState([]);

    const [selectedAxes, setSelectedAxes] = useState({x: 'novelty', y: 'pleasantness'}); // Default axes


    useEffect(() => {
        const fetchData = async () => {
            const csvData = await parseCSV('/export_appraisal.csv');

            setData(csvData)
            setFilteredData(csvData)

            const allEmotions = getUniqueEmotions(csvData)
            setUniqueEmotions(allEmotions)

            setSelectedEmotions(allEmotions)

            setAvailableAxes(getAxes(csvData))
        };
        fetchData();
    }, []);

    useEffect(() => {
        const transformed = transformData(filteredData)
        const aggregated = aggregateData(transformed, {x: availableAxes[0], y: availableAxes[1]})
        console.log("aggregated: ", aggregated)

        const jittered = applyJitter(aggregated)
        console.log("jittered: ", jittered)

        setProcessedData(jittered)

    }, [availableAxes, filteredData]);

    // Handler function to update selectedEmotions
    const handleEmotionChange = (newSelectedEmotions) => {
        setSelectedEmotions(newSelectedEmotions);
        setFilteredData(filterDataByEmotions(data, newSelectedEmotions))
    };

    const filterDataByEmotions = (data, emotionsToInclude) => {
        return data.filter(row => emotionsToInclude.includes(row.emotion_1));
    }


    const transformData = (rawData) => {
        return rawData.map(row => ({
            ...row,
            dimensions: availableAxes.reduce((acc, axis) => {
                // Parse each dimension value as a float and add it to the 'dimensions' object
                acc[axis] = parseFloat(row[axis]);
                return acc;
            }, {})
        }));
    };

    const aggregateData = (data, selectedDimensions) => {

        console.log(selectedDimensions)

        const countsMap = new Map();

        data.forEach(item => {
            const emotion = item.emotion_1
            const dimensionX = item.dimensions[selectedDimensions.x];
            const dimensionY = item.dimensions[selectedDimensions.y];
            const key = `${emotion}-${dimensionX}-${dimensionY}`;

            if (!countsMap.has(key)) {
                countsMap.set(key, {emotion: emotion, count: 0, x: dimensionX, y: dimensionY});
            }

            countsMap.get(key).count += 1;
        });

        return Array.from(countsMap.values());
    };

    const applyJitter = (countedData) => countedData.map(d => ({
        ...d,
        x: d.x + Math.random() * 0.3 - 0.15,
        y: d.y + Math.random() * 0.3 - 0.15,
    }));

    return (
        <div>
            {uniqueEmotions.length > 0 && <EmotionSelect
                emotions={uniqueEmotions}
                onEmotionChange={handleEmotionChange}>
            </EmotionSelect>}

            {/*<AxisSelect selectedAxes={selectedAxes} availableAxes={} onAxisChange={}></AxisSelect>*/}

            {processedData.length > 0 && <EmotionScatterPlot data={processedData} emotions={selectedEmotions}/>}
        </div>
    );
};
