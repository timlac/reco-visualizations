export function getUniqueInstances(csvData) {
    const allInstances = csvData.map(row => row.filterColumn);
    return Array.from(new Set(allInstances));
}
