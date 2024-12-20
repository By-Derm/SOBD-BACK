const {google} = require('googleapis');
const { getAPMS } = require('./apms');
const { getRecipes } = require('./recetas');
const { filterLastTreeMonthsRecipes } = require('./filterLastTreeMonthsRecipes');

const auth = new google.auth.GoogleAuth({
    keyFile: './google.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const writeToSheet =async (values, previouslyChargedIndex)=>{
    const sheets = google.sheets({version: 'v4', auth});
    const hystoricalSpreadsheetId = '19UukOZ02TqsblAuYJHFM40Ht44P9Ohii-pCKzACQfkE';
    const range = `Página1!A${previouslyChargedIndex}:Z1000000`;
    const valueInputOption = "USER_ENTERED";

    const resource = {values};


    try {
        const res = await sheets.spreadsheets.values.update({
            spreadsheetId: hystoricalSpreadsheetId, range, valueInputOption, resource
        })
        
    } catch(error)  {
        console.log(error)
    }
}

const readFromSheet =async(minimunDate)=>{
    if(minimunDate){
        const sheets = google.sheets({version: 'v4', auth});
        const spreadsheetId = '19UukOZ02TqsblAuYJHFM40Ht44P9Ohii-pCKzACQfkE';
        const range = `Página1!A1:Z1000000`;
        const lastTreeMonthsSpreadsheetId = '1lKcE1-EDYjhRvywBXwXRmkGxV1TPLAMER3wtQ-pAMF8';
        const lastTreeMonthsRange = 'Página1!A2:Z1000000';
        const valueInputOption = "USER_ENTERED";

    
        try {
            const cleanLastTreeMonthsTable = await sheets.spreadsheets.values.clear({
                spreadsheetId: lastTreeMonthsSpreadsheetId, range:lastTreeMonthsRange
            })



            const response = await sheets.spreadsheets.values.get({
                spreadsheetId, range
            })


            const recipesOnLastTreeMonths = filterLastTreeMonthsRecipes(response.data.values);


            await sheets.spreadsheets.values.update({
                spreadsheetId: lastTreeMonthsSpreadsheetId, range: lastTreeMonthsRange, valueInputOption, resource:{values: recipesOnLastTreeMonths}
            })
            
            const rows = response.data.values;
            const isThisPeriodPreviouslyCharged = rows.findIndex((x)=>x[0] === minimunDate);
            return isThisPeriodPreviouslyCharged > 0 ? isThisPeriodPreviouslyCharged + 1 : rows.length + 1
        } catch (error) {
            console.log(error)
        }
    }
 
}

const getRecipesFinal = async()=>{
        const info = await getRecipes(new Date().getMonth()+1, new Date().getFullYear())
        const previouslyChargedIndex = await readFromSheet(info[0][0]);
        console.log(previouslyChargedIndex)
        const writer = await writeToSheet(info, previouslyChargedIndex)
        console.log(`Recetas ${new Date().getMonth()+1} metidas`)

        
}
getRecipesFinal();
module.exports = {
    getRecipesFinal
}