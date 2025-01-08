const unixToDate = (unixdate) => {
    const date = new Date(unixdate * 1000);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

const DBToDate = (date) => {
    date = new Date(date);
    date.toLocaleDateString();
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Sumar 1 porque los meses son indexados desde 0
    let year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

module.exports = { unixToDate, DBToDate }