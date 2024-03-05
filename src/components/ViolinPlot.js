import React from 'react';
import Plot from 'react-plotly.js';

const ViolinPlot = ( {data} ) => {

    console.log(data)

    const trace1 = {
        type: 'violin',
        x: data.map(d => d.emotion_1_id),
        y: data.map(d => d.reply_dim_Novelty),
        points: 'none', // Customize as needed
        box: {visible: true},
        meanline: {visible: true},
        transforms: [{type: 'groupby', groups: data.map(d => d.emotion)}],
    };

    return (
        <Plot
            data={[trace1]}
            layout={{title: 'Distribution of Reply Dimension Novelty by Emotion'}}
        />
    );
};

export default ViolinPlot;