function changeDateToFirstMonthDay(date) {
    // Separar el mes y el día de la fecha recibida
    const [year, month] = date.split('-');

    // Crear una nueva fecha en formato 'dd/mm/yyyy'
    const fechaFormateada = `01/${month}/${year}`;

    return fechaFormateada;
}


module.exports = {
    changeDateToFirstMonthDay
}