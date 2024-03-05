import {useEffect, useState} from "react";
import Papa from "papaparse";
import ViolinPlot from "./ViolinPlot";

export const Visualize = () => {


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


    return data.length > 0 && <ViolinPlot data={data}></ViolinPlot>
}
