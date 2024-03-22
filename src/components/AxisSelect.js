import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

export const AxisSelect = ({ availableAxes, selectedAxes, onAxisChange }) => {
    return (
        <div style={{ marginBottom: 16 }}>
            <Select
                value={selectedAxes.x}
                onChange={(value) => onAxisChange('x', value)}
                style={{ width: 300, marginRight: 8 }}
            >
                {availableAxes.map((axis) => (
                    <Option key={axis} value={axis}>{axis}</Option>
                ))}
            </Select>
            <Select
                value={selectedAxes.y}
                onChange={(value) => onAxisChange('y', value)}
                style={{ width: 300 }}
            >
                {availableAxes.map((axis) => (
                    <Option key={axis} value={axis}>{axis}</Option>
                ))}
            </Select>
        </div>
    );
};
