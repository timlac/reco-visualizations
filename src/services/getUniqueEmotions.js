export function getUniqueEmotions(csvData) {
    console.log("in get uniqueEmotions")
    console.log(csvData)

    const allEmotions = csvData.map(row => row.emotion); // Assuming 'emotion' is the column name
    return Array.from(new Set(allEmotions));
}