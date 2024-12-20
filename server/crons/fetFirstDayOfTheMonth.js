function getFirstDayOfMonth(year, month) {
    // Ajustar el mes para que sea 0-indexado (enero = 0, febrero = 1, etc.)
    month = month - 1;

    // Crear una nueva fecha con el año y mes especificados
    const date = new Date(year, month, 1);

    // Obtener el año, mes y día en formato 'yyyy-mm-dd'
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Añadir 1 porque los meses son 0-indexados
    const dd = '01'; // Siempre será el primer día del mes

    // Devolver la fecha en formato 'yyyy-mm-dd'
    return `${yyyy}-${mm}-${dd}`;
}

module.exports = {
    getFirstDayOfMonth
}