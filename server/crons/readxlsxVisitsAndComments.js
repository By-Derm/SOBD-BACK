const { changeDateToFirstMonthDay } = require('./changeDateToFirstMonthDay');

const readXLXSVisitsAndComments = (filePath) =>{
    const xlsx = require('xlsx');
    const path = require('path');
        
    // Leer el archivo .xlsx
    const workbook = xlsx.readFile(filePath);
    
    // Obtener la primera hoja de trabajo (worksheet)
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convertir la hoja de trabajo a un objeto JSON
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    


    const keys = Object.keys(jsonData[2]);
    const info = jsonData.slice(1,-1).map((row, index) => {
        return [row[keys[0]], row[keys[1]], row[keys[2]],row[keys[3]], row[keys[4]], row[keys[5]], row[keys[6]], row[keys[7]], row[keys[8]], row[keys[9]],row[keys[10]] ,row[keys[11]] ,row[keys[12]] ,row[keys[13]],row[keys[14]], row[keys[15]] ];
       
    });
    
    return info

}

module.exports = {
    readXLXSVisitsAndComments
}