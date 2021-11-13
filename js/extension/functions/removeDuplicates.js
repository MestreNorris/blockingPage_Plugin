/**
 * Remove itens duplicados em array de strings
 * @param {Array<String>} array - Array de string a ser varrido.
 * @returns - Array com itens únicos.
 */
const removeDuplicatesList = (array) => {
    return [...new Map(array.map(item => [item, item])).values()]
}

/**
 * Remove itens duplicados em array de objetos.
 * @param {Array<Object>} array - Array de objetos a ser varrido.
 * @returns - Array com itens únicos.
 */
const removeDuplicatesArray = (array) => {
    const key = 'link';
    return [...new Map(array.map(item => [item[key], item])).values()]
}