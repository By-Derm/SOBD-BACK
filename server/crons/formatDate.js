function formatDate(date) {
    // Separar el mes y el día de la fecha recibida
    const [month, day] = date.split('/');

    // Crear una nueva fecha en formato 'dd/mm/yyyy'
    const fechaFormateada = `${day}/${month}`;

    return fechaFormateada;
}
module.exports = {
    formatDate
}