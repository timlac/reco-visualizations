import React, {useState, useEffect} from 'react';
import Papa from 'papaparse';
import {ConfusionMatrix} from 'ml-confusion-matrix';
import {getEmotionFromId} from "nexa-js-sentimotion-mapper";
import {ConfusionMatrixComponent} from "./CMDisplay";


const MyComponent = () => {
    const [data, setData] = useState([]);
    const [matrix, setMatrix] = useState(null);

    useEffect(() => {
        // Function to fetch and parse CSV data
        // Assuming 'data.csv' is in the public directory of your React app
        Papa.parse('/fmri_audio_export.csv', {
            download: true,
            header: true,  // Set to true if your CSV has a header row
            complete: (result) => {
                console.log('Parsed CSV data: ', result.data);
                setData(result.data);
            }
        });

    }, []);  // The empty array ensures this effect runs only once on mount


    useEffect(() => {
        if (data.length > 0) {
            const yTrue = data.map(row => row.emotion_1_id);
            const yTrueLabels = getEmotionFromId(yTrue)


            const yPred = data.map(row => row.reply);
            const yPredLabels = getEmotionFromId(yPred)


            console.log(yPred)
            const CM2 = ConfusionMatrix.fromLabels(yTrueLabels, yPredLabels);
            console.log(CM2)

            setMatrix(CM2);
        }
    }, [data])


    return (
        matrix &&
        <ConfusionMatrixComponent data={matrix.matrix} labels={matrix.labels}></ConfusionMatrixComponent>
    );
};

export default MyComponent;
