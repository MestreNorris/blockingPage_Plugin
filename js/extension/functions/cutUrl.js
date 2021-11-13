/**
 * Formata URL com protocolo e hostname.
 * @param {String} str - URL à formatar.
 * @returns - URL formatado.
 */
function getUrl1(str) {
    try {
        const url = new URL(str);
        return (url.protocol + "//" + url.hostname + '/*');
    }
    catch (error) { return null; }
}

/**
 * Formata URL com protocolo, hostname e path.
 * @param {String} str - URL à formatar.
 * @returns - URL formatado.
 */
function getUrl(str) {
    try {
        const url = new URL(str);
        let path = '';

        if ((url.pathname == '') || (url.pathname == '/')) { path = '/*' }
        else { path = "/" + (str.replace(/^(?:https?:\/\/)?(?:http:\.)?(?:www\.)?/i, "").split('/')[1]); }
        return (url.protocol + "//" + url.hostname + path);
    }
    catch (error) { return null; }
}