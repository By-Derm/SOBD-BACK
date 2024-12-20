const {google} = require('googleapis');
const { getAPMS } = require('./apms');
const { getRecipes } = require('./recetas');
const { getVisitsAndComments } = require('./visitsAndComents');
const { filterLastTreeMonthsVisitsAndComments } = require('./filterLastTreeMonthsRecipes');

const auth = new google.auth.GoogleAuth({
    keyFile: './google.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const writeToSheet =async (values, previouslyChargedIndex)=>{
    const sheets = google.sheets({version: 'v4', auth});
    const spreadsheetId = '1PswZjwCNVlORz671QPmk_y5ApmCXPj6bW4qIixc7ZSY';
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
        const spreadsheetId = '1PswZjwCNVlORz671QPmk_y5ApmCXPj6bW4qIixc7ZSY';
        const range = `Página1!A1:Z1000000`;
        const lastTreeMonthsSpreadsheetId = '1e05Kr5jNMqQm_FqPDZ8LM5WNKhb4PyN19QokHL2UiTQ';
        const lastTreeMonthsRange = 'Página1!A2:Z1000000';
        const valueInputOption = "USER_ENTERED";

        
        try {

            const cleanLastTreeMonthsTable = await sheets.spreadsheets.values.clear({
                spreadsheetId: lastTreeMonthsSpreadsheetId, range:lastTreeMonthsRange
            })

            const response = await sheets.spreadsheets.values.get({
                spreadsheetId, range
            })

            const recipesOnLastTreeMonths = filterLastTreeMonthsVisitsAndComments(response.data.values);
            console.log(recipesOnLastTreeMonths[0], recipesOnLastTreeMonths[1])
            console.log( response.data.values[0],  response.data.values[1])

            await sheets.spreadsheets.values.update({
                spreadsheetId: lastTreeMonthsSpreadsheetId, range: lastTreeMonthsRange, valueInputOption, resource:{values: recipesOnLastTreeMonths}
            })
            
            const rows = response.data.values;
            const isThisPeriodPreviouslyCharged = rows.findIndex((x)=>x[4] === minimunDate);
            return isThisPeriodPreviouslyCharged > 0 ? isThisPeriodPreviouslyCharged + 1 : rows.length + 1
        } catch (error) {
            console.log(error)
        }
    }
 
}

const getRecipesAndCommentsFinal = async()=>{
        const info = await getVisitsAndComments(new Date().getMonth()+1, new Date().getFullYear())
        const previouslyChargedIndex = await readFromSheet(info[0][4]);

        const writer = await writeToSheet(info, previouslyChargedIndex)
        console.log(`${new Date().getDate()}/${new Date().getMonth()+1} metido`)
  
}

getRecipesAndCommentsFinal()
module.exports = {
    getRecipesAndCommentsFinal
}