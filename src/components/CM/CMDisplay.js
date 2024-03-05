import React, { useState } from 'react';
import "./CMDisplay.css";


export const ConfusionMatrixComponent = ({ data, labels }) => {
    const [activeCell, setActiveCell] = useState({ row: null, col: null });

    const handleMouseEnter = (row, col) => {
        setActiveCell({ row, col });
    };

    const handleMouseLeave = () => {
        setActiveCell({ row: null, col: null });
    };

    return (
        <div className="matrix">
            <div className="header-row">
                <div className="header-cell"></div> {/* Empty top-left corner cell */}
                {labels.map((label, index) => (
                    <div key={`header-${index}`} className="header-cell">{label}</div>
                ))}
            </div>
            {data.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                    <div className="header-cell">{labels[rowIndex]}</div> {/* Row header */}
                    {row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`cell ${
                                activeCell.row === rowIndex || activeCell.col === colIndex ? 'highlight' : ''
                            }`}
                            onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                            onMouseLeave={handleMouseLeave}
                        >
                            {cell}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

// Usage example
const matrixData = [
    [5, 2, 0],
    [3, 3, 1],
    [0, 1, 4],
];
const labels = ['Class 1', 'Class 2', 'Class 3'];

const CMDisplay = () => (
    <ConfusionMatrixComponent data={matrixData} labels={labels} />
);

export default CMDisplay;
