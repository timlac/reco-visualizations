export function getUniqueEmotions(csvData) {
    console.log("in get uniqueEmotions")
    console.log(csvData)

    const allEmotions = csvData.map(row => row.emotion_1);
    return Array.from(new Set(allEmotions));
}