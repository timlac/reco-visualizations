
export function getAxes(csvData){

   // Assuming the first row contains headers
    const headers = csvData.length > 0 ? Object.keys(csvData[0]) : [];

    // Filter headers that start with "reply_dim"
    const replyDimColumns = headers.filter(header => header.startsWith("reply_dim"));

    return replyDimColumns

}