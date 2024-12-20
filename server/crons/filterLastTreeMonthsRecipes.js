 function filterLastTreeMonthsRecipes(dataArray) {
    const endDate = new Date(); // fecha actual
    const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 3, 1); // primer día del mes, tres meses antes

    return dataArray.filter(item => {
        const itemDate = parseDate(item[0]);
        return itemDate >= startDate && itemDate <= endDate;
    });
}

function parseDate(dateString) {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
}



function filterLastTreeMonthsVisitsAndComments(dataArray) {
    const endDate = new Date(); // fecha actual
    const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 3, 1); // primer día del mes, tres meses antes

    return dataArray.filter(item => {
        const itemDate = parseDate(item[4]);
        return itemDate >= startDate && itemDate <= endDate;
    });
}

function parseDate(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}


module.exports = {
    filterLastTreeMonthsRecipes,
    filterLastTreeMonthsVisitsAndComments
}