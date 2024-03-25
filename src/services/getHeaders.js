

export function getHeaders(csvData) {

    console.log("in getheaders ", csvData)
    console.log("length", csvData.length)
    return csvData.length > 0 ? Object.keys(csvData[0]) : [];
}

export function getAxes(csvData){
   // Assuming the first row contains headers
    const headers = getHeaders(csvData)
    // Filter headers that start with "reply_dim"
    return  headers.filter(header => header.startsWith("reply_dim"));
}


