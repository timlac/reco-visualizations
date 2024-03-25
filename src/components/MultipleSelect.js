import React from 'react';
import {Select} from 'antd';

export const MultipleSelect = ({selectionOptions, onChange, defaultValue}) => {


    if (defaultValue.length === selectionOptions.length){
        defaultValue = []
    }

    const options = [];
    for (const instance of selectionOptions) {
        options.push({
            value: instance,
            label: instance
        });
    }

    const handleChange = (value) => {
        console.log(value);
        onChange(value)
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
            value={defaultValue}
        />
    );
}