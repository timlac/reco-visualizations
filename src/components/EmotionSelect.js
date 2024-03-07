import React from 'react';
import {Select} from 'antd';

export const EmotionSelect = ({emotions, onEmotionChange}) => {

    const options = [];
    for (const emotion of emotions) {
        options.push({
            value: emotion,
            label: emotion
        });
    }

    const handleChange = (value) => {
        console.log(value);
        onEmotionChange(value)
    };
    return (
        <Select
            mode="tags"
            style={{
                width: '100%',
            }}
            onChange={handleChange}
            tokenSeparators={[',']}
            options={options}
        />
    );
}