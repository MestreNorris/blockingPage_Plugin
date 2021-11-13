/**
 * Procura por elemento no array.
 * @param {Array<String>} arr - Array de strings a ser varrido.
 * @param {String} x - Elemento a ser encontrado no array.
 * @returns - true == encontrado, false == não encontrado.
 */
const searchBinaryList = (arr, x) => {
    let start = 0, end = arr.length - 1;
    while (start <= end) {
        let mid = Math.floor((start + end) / 2);
        if (arr[mid] === x) { return true; }
        else if (arr[mid] < x) { start = mid + 1; }
        else { end = mid - 1; }
    }
    return false;
}

/**
 * Procura por elemento no array.
 * @param {Array<Object>} arr - Array de objetos a ser varrido.
 * @param {String} x - Elemento a ser encontrado no array dentro do objeto.
 * @returns - true == encontrado, false == não encontrado.
 */
const searchBinaryArray = (arr, x) => {
    let start = 0, end = arr.length - 1;
    while (start <= end) {
        let mid = Math.floor((start + end) / 2);
        if (arr[mid].link === x) { return arr[mid]; }
        else if (arr[mid].link < x) { start = mid + 1; }
        else { end = mid - 1; }
    }
    return false;
}

/**
 * Procura por elemento no array.
 * @param {Array<Object>} arr - Array de objetos a ser varrido.
 * @param {String} x - Elemento a ser encontrado no array dentro do objeto
 * @returns - Retorna posição do elemento no array se encontrado ou false se não encontrado
 */
const searchBinaryArrayTopSites = (arr, x) => {
    let start = 0, end = arr.length - 1;
    while (start <= end) {
        let mid = Math.floor((start + end) / 2);
        if (arr[mid].link === x) { return mid; }
        else if (arr[mid].link < x) { start = mid + 1; }
        else { end = mid - 1; }
    }
    return false;
}



