// Inicia classes.
const config = new CONFIG();
const whitelist = new WHITELIST();
const blacklist = new BLACKLIST();
const metric = new METRIC();

var statusNotification = false, listBlacklist = [];

/**
 * Atualiza banco de dados de links inseguros
 */
updateList().then(res => { listBlacklist = res; }).then(() => { blockingPage(); });

/* ------------------------------------------------------------------------------------------------------------------- */

/**
 * Realiza bloqueio de links inseguros
 */
const blockingPage = () => {
    if (listBlacklist.length > 0) {
        chrome.webRequest.onBeforeRequest.addListener(() => {
            console.log('bloqueou')
            return { cancel: true }
        }, { urls: listBlacklist }, ['blocking']);
    }
}

/* ------------------------------------------------------------------------------------------------------------------- */

/**
 * Abre popup em nova janela
 */
chrome.browserAction.onClicked.addListener(() => {
    chrome.tabs.create({ 'url': chrome.runtime.getURL("pages/home.html") });
});

/* ------------------------------------------------------------------------------------------------------------------- */

/**
 * Escuta mensagens vindo do popup.
 */
chrome.runtime.onMessage.addListener(handleMessage);

/* ------------------------------------------------------------------------------------------------------------------- */

/**
 * Executa função de acordo com ação realizada em popup.
 * @param {String} request - Mensagem de popup
 * @param {*} sender 
 * @param {} sendResponse - Resposta de ação realizada por popup.
 * @returns - true == Método síncrono.
 */
function handleMessage(request, sender, sendResponse) {
    if (request.msg == 'config') { config.init(); config.getAll().then(res => { sendResponse(res); }); }
    else if (request.msg == 'metric') { metric.init(); metric.getAll().then(res => { sendResponse(res); }); }
    else if (request.msg == 'updateConfig') { config.update(request.obj.name, request.obj.value); sendResponse(true); }
    else if ((request.msg == 'updateTableBlacklist') || (request.msg == 'searchLinkBlacklist')
        || (request.msg == 'qntBlacklist')) { blacklist.getAll().then(res => { sendResponse(res); }); }
    else if ((request.msg == 'updateTableWhitelist') || (request.msg == 'searchLinkWhitelist')
        || (request.msg == 'qntWhitelist')) { whitelist.getAll().then(res => { sendResponse(res); }); }
    else if (request.msg == 'addBlacklist') {
        blacklist.getAll().then(res => {
            let duplicate = false;
            for (let index = 0; index < res.length; index++) {
                if (res[index].link == request.obj.link) { duplicate = true; break; }
            }
            if (duplicate == false) {
                const addBlacklist = new BLACKLIST(uid(), request.obj.link, dateNow(), true, false);
                blacklist.save(addBlacklist);
            }
        }).then(() => { blacklist.getAll().then(res => { sendResponse(res); reloadExtension(); }); });
    }
    else if (request.msg == 'addWhitelist') {
        whitelist.getAll().then(res => {
            let duplicate = false;
            for (let index = 0; index < res.length; index++) {
                if (res[index].link == request.obj.link) { duplicate = true; break; }
            }
            if (duplicate == false) {
                const addWhitelist = new WHITELIST(uid(), request.obj.link, dateNow(), true, false);
                whitelist.save(addWhitelist);
            }
        }).then(() => { whitelist.getAll().then(res => { sendResponse(res); reloadExtension(); }); });
    }
    else if (request.msg == 'modifyLink') {
        const selectOp = request.obj.value;
        if (request.obj.type == 'whitelist') {
            if ((selectOp == 0) || (selectOp == 1)) {
                whitelist.getbyId(request.obj.id).then(updateData => {
                    if (selectOp == 0) updateData.statusLink = true;
                    else if (selectOp == 1) updateData.statusLink = false;
                    whitelist.update(updateData).then(res => { sendResponse(res); });
                })
            }
            else if (selectOp == 2) {
                whitelist.remove(request.obj.id).then(res => {
                    whitelist.getAll().then(result => { sendResponse(result); reloadExtension(); })
                });
            }
        } else if (request.obj.type == 'blacklist') {
            if ((selectOp == 0) || (selectOp == 1)) {
                blacklist.getbyId(request.obj.id).then(updateData => {
                    if (selectOp == 0) updateData.statusLink = true;
                    else if (selectOp == 1) updateData.statusLink = false;
                    blacklist.update(updateData).then(res => { sendResponse(res); });
                })
            }
            else if (selectOp == 2) {
                blacklist.remove(request.obj.id).then(res => {
                    blacklist.getAll().then(result => { sendResponse(result); reloadExtension(); })
                });
            }
        }
        reloadExtension();
    }
    return true;
}

/* ------------------------------------------------------------------------------------------------------------------- */

/**
 * Função para limpar o navegador com base nos itens selecionados.
 * @param {Object} config - Configurações informando as opções que estão ou não habilitadas. 
 */
async function clearChrome(config) {
    chrome.downloads.search({}, (items) => {
        let inProgress = false;

        for (var i = 0; i < items.length; ++i) {
            if (items[i].state == "in_progress") { inProgress = true; }
        }

        if (inProgress) { config.cleaner.passwords = false; config.cleaner.cookies = false; config.cleaner.downloads = false; }

        chrome.browsingData.remove({
            "since": 0
        }, {
            "appcache": config.cleaner.appCache,
            "cache": config.cleaner.cache,
            "cookies": config.cleaner.cookies,
            "downloads": config.cleaner.downloads,
            "fileSystems": config.cleaner.fileSystems,
            "formData": config.cleaner.formData,
            "history": config.cleaner.history,
            "indexedDB": config.cleaner.indexDB,
            "localStorage": config.cleaner.localstorage,
            "pluginData": config.cleaner.pluginData,
            "passwords": config.cleaner.passwords,
            "webSQL": config.cleaner.webSQL,
        }, executeAudio(config));
    });
}

/* ------------------------------------------------------------------------------------------------------------------- */

/**
 * Chama método toda vez que uma tab é fechada.
 * Se a qnt de páginas fechadas for igual ao numero fornecido, realiza a limpeza no chrome.
 */
chrome.tabs.onRemoved.addListener(() => {
    updateDatabase();
    config.getAll().then(result => {
        if (result[0].cleaner.enable) {
            if (result[0].cleaner.cleanBrowserIn >= result[0].cleaner.qntCloseTabs) {
                config.update("qntCloseTabs", result[0].cleaner.qntCloseTabs + 1);

            } else {
                config.update("qntCloseTabs", 1);
                clearChrome(result[0]);
            }
        }
    });
});

/* ------------------------------------------------------------------------------------------------------------------- */

/**
 * 
 * @param {Number} tabId - Página insegura a ser removida
 * @param {*} info 
 * @param {String} tab - URl da página carragada
 * @param {Number} timeStart - Performace da função.
 */
const removePage = (tabId, info, tab, timeStart) => {
    const link = tab.url, link1 = getUrl1(tab.url);

    const exist1 = searchBinaryList(listBlacklist, link);
    const exist2 = searchBinaryList(listBlacklist, link1);

    if ((exist1) || (exist2)) {
        metric.update('qntBlockedLinks', Number(1));
        notifyBrowser(statusNotification);
        chrome.tabs.remove(tabId);
        const timeEnd = new Date().getTime();
        metric.update('performanceBlock', (timeEnd - timeStart));
    }
}

/* ------------------------------------------------------------------------------------------------------------------- */

/**
 * Para o caso de abrir alguma página que deveria ser bloqueada, realiza sua remoção.
 * @param {number} tabID - Id da página que poderá ser removida, caso esteje na lista de bloqueio.
 * @param {string} info - Recupera informações da página apenas quando estiver totalmente carregada.
 * @param {string} tab - Url a ser comparado na lista de bloqueio.
 */
chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
    const timeStart = new Date().getTime();
    config.getAll().then(result => { statusNotification = result[0].notification; })

    if (info.status == "complete") {
        removePage(tabId, info, tab, timeStart);

        if ((!tab.url.startsWith("chrome")) && (tab.url != "") && (tab.url !== "about:blank")) {
            topSites(tab.url);
        }

        whitelist.count().then(res => {
            if (res == 0) { sendMessage(tabId, { msg: 'block' }); }
            else {
                let link_whitelist, tab_url = getUrl1(tab.url), blockPage = true;
                whitelist.getAll().then(res => {

                    for (let index = 0; index < res.length; index++) {
                        link_whitelist = getUrl1(res[index].link);
                        if ((link_whitelist == tab_url) && (res[index].statusLink)) { blockPage = false; }
                    }
                    if (blockPage) { sendMessage(tabId, { msg: 'block' }); }
                })
            }
        })
    }
});

/* ------------------------------------------------------------------------------------------------------------------- */

/**
 * Envia mensagem para content, para bloquear entrada de dados.
 * Para liberar acesso inserir link da página na ferramenta.
 * @param {Number} tabId - Página a ser liberada ou bloqueada.
 * @param {*} msg - Mensagem para bloquear.
 */
function sendMessage(tabId, msg) { chrome.tabs.sendMessage(tabId, msg); }

/* ------------------------------------------------------------------------------------------------------------------- */

/**
 * Notifica o usuário caso seja realizado bloqueio e remoção de página insegura.
 * @param {Boolean} notify - True == Realiza notificação de página bloqueada, false não realiza notificação.
 */
function notifyBrowser(notify) {
    if (notify) {
        new Notification("Página removida.",
            { icon: 'images/icons/128.png', body: 'Cuidado ao acessar páginas desconhecidas.' });
    }
}

/* ------------------------------------------------------------------------------------------------------------------- */

/**
 * Realiza atualização de lista de bloqueio de página e liberação de acesso
 */
function updateDatabase() {
    metric.getAll().then(res => {
        const dataMetric = res[0];

        if (dataMetric.lastUpdateDB != dateNow()) {
            const timeStart1 = new Date().getTime();
            metric.update('lastUpdateDB', dateNow());

            fetchData()
                .then(() => {
                    const timeEnd1 = new Date().getTime();
                    metric.update('performanceUpdate', ((timeEnd1 - timeStart1) / 1000));
                }).then(() => { reloadExtension(); });
        }
    });
}

/* ------------------------------------------------------------------------------------------------------------------- */

/**
 * Atualiza lista de sites mais utilizado pelo usuário
 * @param {String} site - Site utilizado pelo usuário
 */
const topSites = (site) => {
    metric.getAll().then(res => {
        let topPages = res[0].listPages;
        const link = getUrl1(site);

        if (topPages.length == 0) { topPages.push({ link, count: 1 }) }
        else {
            const isExist = searchBinaryArrayTopSites(sortArray(topPages), link);
            if (isExist == false) { topPages.push({ link, count: 1 }); }
            else {
                const site = topPages[isExist];
                topPages[isExist] = { link: site.link, count: (site.count + 1) }
            }
        }
        topPages = removeDuplicatesArray(topPages);
        metric.update('listPages', topPages);
    })
}

/* ------------------------------------------------------------------------------------------------------------------- */

/**
 * Captura links inseguros para bloquear (Blacklist).
 * Captura links seguros para liberar acesso.
 */
const fetchData = async () => {
    const url = 'https://blockingpage.vercel.app/api/blocking_page';
    const myHeaders = new Headers(
        {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Accept': 'application/json',
            'accept-encoding': 'gzip',
            'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'cache-control': 'max-age=0',
            'dnt': '1',
            'sec-ch-ua-mobile': '?0',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'none',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'Access-Control-Allow-Origin': '*',
        }
    );

    const data = await fetch(url, { method: 'POST', headers: myHeaders })
        .then(response => { return response.json(); });

    if (data) {
        await blacklist.getAll().then((res) => {
            let deleteAll = [];

            if (res.length > 0) {
                for (let index = 0; index < res.length; index++) {
                    if (res[index].updateLink == true) { deleteAll.push(res[index].id) }
                }
                if (deleteAll.length > 0) { blacklist.removeAll(deleteAll); }
            }
        });

        await blacklist.getAll().then((res) => {
            let array = [];
            const fetchBlacklist = removeDuplicatesArray(data.blacklist);

            for (let index = 0; index < fetchBlacklist.length; index++) {
                const isExist = searchBinaryArray(sortArray(res), fetchBlacklist[index].link);
                if (!isExist) {
                    const dataBlacklist = new BLACKLIST(uid(), fetchBlacklist[index].link, fetchBlacklist[index].creatAt, true, true);
                    array.push(dataBlacklist);
                }
            }
            return array;
        }).then((array) => { if (array.length > 0) { blacklist.saveAll(array) } });

        await whitelist.getAll()
            .then((res) => {
                let deleteAll = [];

                if (res.length > 0) {
                    for (let index = 0; index < res.length; index++) {
                        if (res[index].updateLink == true) { deleteAll.push(res[index].id) }
                    }
                    if (deleteAll.length > 0) { whitelist.removeAll(deleteAll); }
                }
            });

        await whitelist.getAll()
            .then((res) => {
                let addAll = [];
                const fetchWhitelist = removeDuplicatesArray(data.whitelist);

                for (let index = 0; index < fetchWhitelist.length; index++) {
                    const isExist = searchBinaryArray(sortArray(res), fetchWhitelist[index].link);
                    if (!isExist) {
                        const dataWhitelist = new WHITELIST(uid(), fetchWhitelist[index].link, fetchWhitelist[index].creatAt, true, true);
                        addAll.push(dataWhitelist);
                    }
                }
                return addAll;
            }).then((addAll) => { if (addAll.length > 0) { whitelist.saveAll(addAll) } });

        await metric.update('qntDevices', data.metric[0].qntRequest);
    }
}

const addAcess = () => { alert('Acesso Liberado') }
const addBlock = () => { alert('Bloqueio realizado') }


chrome.contextMenus.removeAll(function () {
    chrome.contextMenus.create({ title: 'Bloquear página', id: 'block', contexts: ["page"], type: 'normal', documentUrlPatterns: ["http://*/*", "https://*/*"] });
    chrome.contextMenus.create({ title: 'Liberar Acesso', id: 'acess', contexts: ["page"], type: 'normal', documentUrlPatterns: ["http://*/*", "https://*/*"] });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId == 'block') {
        alert('A seguinte página foi bloqueada: ' + info.pageUrl)
    } else if (info.menuItemId == 'acess') {
        alert('Acesso Liberado á pagina: ' + info.pageUrl)
    }
})