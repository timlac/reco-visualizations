export const AxisSelect = ({ availableAxes, selectedAxes, onAxisChange }) => {
    return (
        <div>
            <select value={selectedAxes.x} onChange={(e) => onAxisChange({ ...selectedAxes, x: e.target.value })}>
                {Object.entries(availableAxes).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                ))}
            </select>
            <select value={selectedAxes.y} onChange={(e) => onAxisChange({ ...selectedAxes, y: e.target.value })}>
                {Object.entries(availableAxes).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                ))}
            </select>
        </div>
    );
};
