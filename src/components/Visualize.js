import {useEffect, useState} from "react";
import {ScatterDisplay} from "./ScatterDisplay";
import {parseCSV} from "../services/parseCsv";
import {MultipleSelect} from "./MultipleSelect";
import {getUniqueInstances} from "../services/getUniqueInstances";
import {AxisSelect} from "./AxisSelect";
import {getHeaders, getAxes} from "../services/getHeaders";
import {aggregateData} from "../services/aggregateData";

export const Visualize = () => {

    const [filterOn, setFilterOn] = useState(["emotion_1", "emotion_2"])

    const [headers, setHeaders] = useState([])

    const [data, setData] = useState([])
    const [dataWithFilterOn, setDataWithFilterOn] = useState([])
    const [filteredData, setFilteredData] = useState([])

    const [processedData, setProcessedData] = useState([]);
    const [uniqueInstances, setUniqueInstances] = useState([])
    const [selectedInstances, setSelectedInstances] = useState([]); // New state for selected emotions
    const [availableAxes, setAvailableAxes] = useState([]);

    const [selectedAxes, setSelectedAxes] = useState({}); // Default axes


    useEffect(() => {
        const fetchData = async () => {
            const csvData = await parseCSV('/export_mixed.csv');
            setData(csvData)
            setHeaders(getHeaders(csvData))
            setAvailableAxes(getAxes(csvData))
        };
        fetchData();
    }, []);


    useEffect(() => {
        const newData = data.map(row => ({
            ...row,
            filterColumn: filterOn.map(key => row[key]).join('-')
        }))
        setDataWithFilterOn(newData)
        setFilteredData(newData)

        let uniqueInstances = getUniqueInstances(newData)
        setUniqueInstances(uniqueInstances)
        setSelectedInstances(uniqueInstances)
    }, [data, filterOn])


    useEffect(() => {
        setProcessedData(aggregateData(filteredData, selectedAxes, true))
    }, [selectedAxes, filteredData]);

    useEffect(() => {
        if (availableAxes.length > 0 && (!selectedAxes.x || !selectedAxes.y)) {
            setSelectedAxes({x: availableAxes[0], y: availableAxes[1]});
        }
    }, [availableAxes]);

    const onAxisChange = (axisType, value) => {
        setSelectedAxes(prevAxes => {
            if (prevAxes[axisType] === value) {
                // If the value isn't changing, return the previous state to avoid triggering an update
                return prevAxes;
            }

            // Only update the state if there's a change
            return {
                ...prevAxes,
                [axisType]: value
            };
        });
    };

    // Handler function to update selectedEmotions
    const handleInstanceChange = (newSelectedInstances) => {
        setSelectedInstances(newSelectedInstances);
        setFilteredData(filterDataByInstances(dataWithFilterOn, newSelectedInstances))
    };

    const handleFilterOnChange = (newSelectedHeaders) => {
        setFilterOn(newSelectedHeaders)
    }

    const filterDataByInstances = (data, instancesToInclude) => {
        return data.filter(row => instancesToInclude.includes(row.filterColumn));
    }

    return (
        <div style={{width: '80%', height: '80%', margin: 'auto'}}>

            <p>Select columns to aggregate by</p>

            {headers.length > 0 && <MultipleSelect
                selectionOptions={headers}
                onChange={handleFilterOnChange}
                defaultValue={filterOn}>
            </MultipleSelect>}

            <p>Select categories to display</p>

            {uniqueInstances.length > 0 && <MultipleSelect
                selectionOptions={uniqueInstances}
                onChange={handleInstanceChange}
                defaultValue={selectedInstances}>
            </MultipleSelect>}

            {processedData.length > 0 && <ScatterDisplay data={processedData} instances={selectedInstances}
                                                         selectAxes={selectedAxes}/>}

            <p>Select Axes to display</p>

            <AxisSelect selectedAxes={selectedAxes} availableAxes={availableAxes}
                        onAxisChange={onAxisChange}></AxisSelect>

        </div>
    );
};
