/**
 * Ordena array de objetos em ASC.
 * @param {Array<Object>} array - Array a ser ordenado.
 * @returns - Array ordenado.
 */
const sortArray = (array) => {
    return (array.sort(function (a, b) { return (a.link > b.link) ? 1 : ((b.link > a.link) ? -1 : 0); }));
}

/**
 * Ordena array de string em ASC.
 * @param {Array<String>} array - Array a ser ordenado.
 * @returns - Array ordenado.
 */
const sortList = (array) => {
    return (array.sort(function (a, b) { return (a > b) ? 1 : ((b > a) ? -1 : 0); }));
}