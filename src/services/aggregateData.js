export function aggregateData(data, axes) {
    const countsMap = mapToCounts(data, axes)
    return applyJitter(countsMap)
}

const mapToCounts = (data, axes) => {
    const countsMap = new Map();

    data.forEach(item => {
        const filterColumn = item.filterColumn
        const dimensionX = parseFloat(item[axes.x]);
        const dimensionY = parseFloat(item[axes.y]);
        const key = `${filterColumn}-${dimensionX}-${dimensionY}`;

        if (!countsMap.has(key)) {
            countsMap.set(key, {filterColumn: filterColumn, count: 0, x: dimensionX, y: dimensionY});
        }

        countsMap.get(key).count += 1;
    });

    return Array.from(countsMap.values());
};

const applyJitter = (countsMap) => countsMap.map(d => ({
    ...d,
    x: d.x + Math.random() * 0.3 - 0.15,
    y: d.y + Math.random() * 0.3 - 0.15,
}));
