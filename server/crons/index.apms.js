const {google} = require('googleapis');
const { getAPMS } = require('./apms');

const auth = new google.auth.GoogleAuth({
    keyFile: './google.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const writeToSheet =async (values, previouslyChargedIndex)=>{
    const sheets = google.sheets({version: 'v4', auth});
    const spreadsheetId = '1s0jCqYQjM8PVp6d4g8zHNBBHZ12b6JlPtjNAMP8ks-M';
    const range = `Página1!A${previouslyChargedIndex}:Z1000000`;
    const valueInputOption = "USER_ENTERED";

    const resource = {values};



    try {
        const res = await sheets.spreadsheets.values.update({
            spreadsheetId, range, valueInputOption, resource
        })
        
    } catch(error)  {
        console.log(error)
    }
}

const readFromSheet =async(minimunDate)=>{
    if(minimunDate){
        const sheets = google.sheets({version: 'v4', auth});
        const spreadsheetId = '1s0jCqYQjM8PVp6d4g8zHNBBHZ12b6JlPtjNAMP8ks-M';
        const range = `Página1!A1:E1000000`;
        try {
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId, range
            })
            const rows = response.data.values;
            const isThisPeriodPreviouslyCharged = rows.findIndex((x)=>x[0] === minimunDate);
            return isThisPeriodPreviouslyCharged > 0 ? isThisPeriodPreviouslyCharged + 1 : rows.length + 1
        } catch (error) {
            console.log(error)
        }
    }
 
}

const getApmsFinal = async()=>{
    const info = await getAPMS()
    const previouslyChargedIndex = await readFromSheet(info[0][0]);
    console.log(previouslyChargedIndex)
    const writer = await writeToSheet(info, previouslyChargedIndex)
    console.log(`Visitas ${new Date().getMonth()+1} metidas`)
}
getApmsFinal()

module.exports = {
    getApmsFinal
}