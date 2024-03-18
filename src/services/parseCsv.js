import Papa from "papaparse";
import {getEmotionFromId} from "nexa-js-sentimotion-mapper";

export const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        Papa.parse(filePath, {
            download: true,
            header: true,
            complete: results => resolve(results.data),
            error: error => reject(error)
        });
    });
};

export async function getCsvData(filePath) {
    const data = await parseCSV(filePath)

    console.log("data in get csv", data)

    data.map(row => ({
        ...row,
        emotion: getEmotionFromId(row.emotion_1_id)
    }))
    return data
}