/* --------------------------------------------- Variáveis --------------------------------------------- */
const cbxNotification = $('#cbxNotification');
const cbxHelp = $('#cbxHelp');
const cbxCleaner = $('#cbxCleaner');
const cbxSounds = $('#cbxSounds');
const cbxWebSQL = $('#cbxWebSQL');
const cbxHistory = $('#cbxHistory');
const cbxPluginData = $('#cbxPluginData');
const cbxCookies = $('#cbxCookies');
const cbxCache = $('#cbxCache');
const cbxFileSystems = $('#cbxFileSystems');
const cbxPasswords = $('#cbxPasswords');
const cbxDownloads = $('#cbxDownloads');
const cbxFormData = $('#cbxFormData');
const cbxAppCache = $('#cbxAppCache');
const cbxIndexDB = $('#cbxIndexDB');
const cbxLocalstorage = $('#cbxLocalstorage');
const menuSelect = $('#selectCleaner');
const linkMalicious = $('#linkMalicious');
const linkSecure = $('#linkSecure');
const saveButtonMalicious = $('#saveButtonMalicious');
const saveButtonSecure = $('#saveButtonSecure');
const modal_whitelist = $('#modal_whitelist');
const modal_blacklist = $('#modal_blacklist');
const pagination_blacklist = $('#pagination_blacklist');
const pagination_whitelist = $('#pagination_whitelist');
const tbody_blacklist = $('#tbody_blacklist');
const tbody_whitelist = $('#tbody_whitelist');
const selectQntBlacklist = $('#selectQntBlacklist');
const selectQntWhitelist = $('#selectQntWhitelist');
let notfound_whitelist = $('#notfound_whitelist');
let notfound_blacklist = $('#notfound_blacklist');
const blockLink = $('#blockLink');
const removeLinks = $('#removeLinks');
const lastUpdate = $('#lastUpdate');
const updateDb = $('#updateDb');
const visit_overt_time = $("#visit-over-time");
const flot = $(".flot-chart");
const flot_tooltip = $(".flot-tooltip");
const btnSearchBlacklist = $('#btnSearchBlacklist');
const inputSearchBlacklist = $('#inputSearchBlacklist');
const clearInputBlacklist = $('#clearInputBlacklist');
const btnSearchWhitelist = $('#btnSearchWhitelist');
const inputSearchWhitelist = $('#inputSearchWhitelist');
const clearInputWhitelist = $('#clearInputWhitelist');
const topSites = $('#topSites');
const qntBlacklistAPI = $('#qntBlacklistAPI');
const qntBlacklistUser = $('#qntBlacklistUser');
const qntWhitelistAPI = $('#qntWhitelistAPI');
const qntWhitelistUser = $('#qntWhitelistUser');
const selectLinksBlacklist = $('#selectLinksBlacklist');
const selectLinksWhitelist = $('#selectLinksWhitelist');


var rows = 10, btnTable = 5, page_whitelist = 1, page_blacklist = 1, group_blacklist = 'all', group_whitelist = 'all';

/* -------------------------------------- Agrupamento de checkbox -------------------------------------- */

const checkbox = [
	cbxHelp, cbxNotification, cbxSounds, cbxCleaner, cbxWebSQL, cbxHistory, cbxPluginData, cbxCookies,
	cbxCache, cbxFileSystems, cbxPasswords, cbxDownloads, cbxFormData, cbxAppCache, cbxIndexDB, cbxLocalstorage
];

(function ($) {
	"use strict";
	/* Inicia Configurações */		notifyBackgroundPage("config");
	/* Inicia Métricas */			notifyBackgroundPage("metric");
	/* Inicia dados whitelist */	notifyBackgroundPage('qntWhitelist');
	/* Inicia dados blacklist */	notifyBackgroundPage('qntBlacklist');
	/* Atualiza tabela whitelist */	notifyBackgroundPage("updateTableWhitelist", { page: page_whitelist, rows: rows });
	/* Atualiza tabela blacklist */	notifyBackgroundPage("updateTableBlacklist", { page: page_blacklist, rows: rows });
	/* Adiciona link blacklist */	saveButtonMalicious.on('click', () => { saveLink(linkMalicious.val(), modal_blacklist); });
	/* Adiciona link whitelist */	saveButtonSecure.on('click', () => { saveLink(linkSecure.val(), modal_whitelist); });
	/* Limpa input de modal */		$(window).on('hidden.bs.modal', function () { linkMalicious.val(''); linkSecure.val(''); });
	/* Procura Blacklist */			btnSearchBlacklist.on("click", () => { searchLinkInBlacklistDB($(inputSearchBlacklist).val(), page_blacklist, rows); });
	/* Limpa input */				clearInputBlacklist.on("click", () => { inputSearchBlacklist.val(''); searchLinkInBlacklistDB($(inputSearchBlacklist).val(), page_blacklist, rows); });
	/* Procura Whitelist */			btnSearchWhitelist.on("click", () => { searchLinkInWhitelistDB($(inputSearchWhitelist).val(), page_whitelist, rows); });
	/* Limpa input */				clearInputWhitelist.on("click", () => { inputSearchWhitelist.val(''); searchLinkInWhitelistDB($(inputSearchWhitelist).val(), page_whitelist, rows); });

	/* ------------------------------------------------------------------------------------------------- */

	/**
	 * Função para salvar link no banco de dados. 
	 * @param {String} link - Link a ser salvado 
	 * @param {Modal} closeModal - Modal a ser fechado. 
	 */
	function saveLink(link, closeModal) {
		if ((link != null) && (link != "")) {
			const test = isValidUrl(link);
			if (test) {
				const type = closeModal.attr('name');
				let num_page;
				if (type == "addWhitelist") { num_page = page_whitelist }
				else if (type == "addBlacklist") { num_page = page_blacklist }
				notifyBackgroundPage(type, { link: test, page: num_page, rows: rows });
				closeModal.modal('hide');
			}
		}
	}

	/* -------------------------------------------------------------------------------------------------- */

	/**
	 * @param {String} str - Corta a url de forma a receber apenas o "path" deste.
	 */

	function isValidUrl(string) {
		let url;
		try {
			url = new URL(string);
			return (url.protocol + "//" + url.host);
		}
		catch (_) { return false }
	}

	/* -------------------------------------------------------------------------------------------------- */

	// Capturando a alteração dos estados dos checkbox 
	$('input[type=checkbox]').on('change', function () {
		notifyBackgroundPage("updateConfig", { name: $(this).prop("name"), value: $(this).is(":checked") });
	});

	/* -------------------------------------------------------------------------------------------------- */

	// Capturando a alteração do menu de seleção. 
	menuSelect.on('change', () => {
		notifyBackgroundPage("updateConfig", { name: menuSelect.prop("name"), value: parseInt(menuSelect.val()) });
	});

	/* -------------------------------------------------------------------------------------------------- */

	/**
	 * Iniciando configurações de checkbox e popover.
	 * @param {Object} config - Configurações 
	 */
	function initConfig(config) {
		if (config != null) {
			for (let index = 0; index < checkbox.length; index++) {
				const name = $(checkbox[index]).prop("name");
				if ((name == 'sounds') || (name == 'notification')) {
					checkbox[index].prop("checked", config[name]);
				} else if (name == 'cleaner') { checkbox[index].prop("checked", config.cleaner.enable); }
				else { checkbox[index].prop("checked", config.cleaner[name]); }
			}
			menuSelect.val(config.cleaner.cleanBrowserIn);
			disableEnableCheckbox(config.cleaner.enable);
			enablePopover();
		}
	}

	/* -------------------------------------------------------------------------------------------------- */

	/**
	 * Habilitar ou desabilitar checkbox de limpeza.
	 * @param {Boolean} status - True para ativar ou false para desativar.
	 */
	function disableEnableCheckbox(status) {
		for (let index = 2; index < checkbox.length; index++) {
			if (index != 3) {
				if (status == true) { $(checkbox[index]).prop('disabled', false); $(menuSelect).prop('disabled', false); }
				else { $(checkbox[index]).prop('checked', false); $(checkbox[index]).prop('disabled', true); $(menuSelect).prop('disabled', true); }
			}
		}
	}

	/* -------------------------------------------------------------------------------------------------- */

	/**
	 * Habilita ou desabilita ajuda com mensagens.
	 * @param {Boolean} status - True para ativar ou false para desativar popover.
	 */
	function enablePopover() {
		var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
		var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
			return new bootstrap.Popover(popoverTriggerEl)
		})
	}

	/* -------------------------------------------------------------------------------------------------- */

	/**
	 * Envia mensagem para background
	 * @param {*} msg - Mensagem a ser enviada
	 * @param {*} obj - Objeto da mensagem a ser enviada
	 */
	function notifyBackgroundPage(msg, obj) {
		chrome.runtime.sendMessage({ msg: msg, obj: obj }, (response) => {
			if (msg == "config") { initConfig(response[0]); }
			else if ((msg == "updateTableBlacklist") || (msg == "addBlacklist") ||
				((msg == 'modifyLink') && (obj.type == "blacklist") && (obj.value == 2))) {
				const data = selectGroup(response, group_blacklist)
				buildTable(tbody_blacklist, "blacklist", sortDatabase(data), obj.page, obj.rows);
			}
			else if ((msg == "updateTableWhitelist") || (msg == "addWhitelist") ||
				((msg == 'modifyLink') && (obj.type == "whitelist") && (obj.value == 2))) {
				const data = selectGroup(response, group_whitelist)
				buildTable(tbody_whitelist, "whitelist", sortDatabase(data), obj.page, obj.rows);
			}
			else if (msg == "qntWhitelist") { listQntWhitelist(response); }
			else if (msg == "qntBlacklist") { listQntBlacklist(response) }
			else if (msg == "metric") {
				if (response[0] != null) {
					lastUpdate.html(response[0].lastUpdateDB);
					blockLink.html(response[0].performanceBlock + ' ms');
					removeLinks.html(response[0].qntBlockedLinks);
					updateDb.html(response[0].performanceUpdate + ' s');
					flotSetData(response[0].qntDevices);
					setSites(response[0].listPages);
				}
			}
			else if (msg == "searchLinkBlacklist") {
				const data = selectGroup(response, group_blacklist)
				const databaseFiltred = data.filter((itens) => { return (itens.link.includes(obj.value)); });
				buildTable(tbody_blacklist, "blacklist", sortDatabase(databaseFiltred), obj.page, obj.rows);
			}
			else if (msg == "searchLinkWhitelist") {
				const data = selectGroup(response, group_whitelist)
				const databaseFiltred = data.filter((itens) => { return (itens.link.includes(obj.value)); });
				buildTable(tbody_whitelist, "whitelist", sortDatabase(databaseFiltred), obj.page, obj.rows);
			}
			else if ((msg == "updateConfig") && (obj.name == "cleaner")) { if (response) { window.location.reload(); } }
		});
	}
	/* -------------------------------------------------------------------------------------------------- */

	const selectGroup = (data, group) => {
		const allLinks = data;
		let user = [], api = [], table = [];

		for (let index = 0; index < allLinks.length; index++) {
			if (allLinks[index].updateLink == true) { api.push(allLinks[index]) }
			else { user.push(allLinks[index]) }
		}

		if (group == 'all') { table = allLinks }
		else if (group == 'user') { table = user }
		else if (group == 'api') { table = api }

		return table;
	}

	const listQntBlacklist = (list) => {
		let blacklistUser = 0, blacklistApi = 0;
		for (let index = 0; index < list.length; index++) { list[index].updateLink == true ? blacklistApi++ : blacklistUser++; }
		qntBlacklistAPI.html(blacklistApi);
		qntBlacklistUser.html(blacklistUser);
	}

	const listQntWhitelist = (list) => {
		let whitelistUser = 0, whitelistApi = 0;
		for (let index = 0; index < list.length; index++) { list[index].updateLink == true ? whitelistApi++ : whitelistUser++; }
		qntWhitelistAPI.html(whitelistApi)
		qntWhitelistUser.html(whitelistUser)
	}

	selectLinksBlacklist.on('change', () => {
		inputSearchBlacklist.val('');
		group_blacklist = selectLinksBlacklist.val();
		notifyBackgroundPage("updateTableBlacklist", { page: page_blacklist, rows: rows });
	});

	selectLinksWhitelist.on('change', () => {
		inputSearchWhitelist.val('');
		group_whitelist = selectLinksWhitelist.val();
		notifyBackgroundPage("updateTableWhitelist", { page: page_whitelist, rows: rows });
	});

	/**
	 * Ordena array de numeros em DESC.
	 * @param {Array<Object>} array - Array a ser ordenado.
	 * @returns - Array ordenado.
	 */
	const sortTopSites = (array) => {
		return (array.sort(function (a, b) { return (a.count < b.count) ? 1 : ((b.count < a.count) ? -1 : 0); }));
	}

	const formatNumber = (number) => { return (String(number).replace(/(.)(?=(\d{3})+$)/g, '$1.')) }

	const setSites = (listSites) => {
		if (listSites.length > 0) {
			const listTopSites = sortTopSites(listSites);
			let site;
			topSites.html('');

			for (let index = 0; index < 10; index++) {
				if (index < listTopSites.length) {
					site = `
					<tr class="hg-38">
						<td>${listTopSites[index].link.slice(0, -2)}</td>
						<td class="text-right">
							<h4>${formatNumber(listTopSites[index].count)}</h4>
							</td>
					</tr>`;
				} else {
					site = `
					<tr class="hg-38">
						<td></td>
						<td class="text-right"><h4></h4></td>
					</tr>`;
				}
				topSites.append(site);
			}
		}
	}

	const sortDatabase = (database) => {
		return (database.sort(function (a, b) { return (a.link > b.link) ? 1 : ((b.link > a.link) ? -1 : 0); }));
	}

	/* -------------------------------------------------------------------------------------------------- */

	/**
	 * Função para alterar estado dos selects da tabela ou excluí-los 
	 * @param {Object} event -  (Id, Value, Type)
	 * Id - Id do elemento alterado da tabela
	 * Value - 0 para true (Habilitar link), 1 para false (Desabilitar link), 2 - remover link
	 * Type - Whitelist ou Blacklist
	 */
	function changeSelect(id, val, type) {
		let num_page;
		if (type == "whitelist") { num_page = page_whitelist }
		else if (type == "blacklist") { num_page = page_blacklist }
		notifyBackgroundPage('modifyLink', { id: id, type: type, value: val, page: num_page, rows: rows });
	}


	/* -------------------------------------------------------------------------------------------------- */

	function pagination(querySet, page, rows) {
		const trimStart = (page - 1) * rows;
		const trimEnd = trimStart + rows;
		const trimmedData = querySet.slice(trimStart, trimEnd);
		const pages = Math.ceil(querySet.length / rows);
		return { 'querySet': trimmedData, 'pages': pages, }
	}

	/* -------------------------------------------------------------------------------------------------- */

	function pageButtons(pages, page, pagination_buttons, type) {
		pagination_buttons.empty();
		let maxLeft = (page - Math.floor(btnTable / 2))
		let maxRight = (page + Math.floor(btnTable / 2))

		if (maxLeft < 1) { maxLeft = 1; maxRight = btnTable }
		if (maxRight > pages) { maxLeft = pages - (btnTable - 1); if (maxLeft < 1) { maxLeft = 1 }; maxRight = pages; }
		if (page != 1) { pagination_buttons.append(`<button value=${1} class="page btn btn-sm btn-secondary">&#171; Primeiro</button>`); }
		for (let page = maxLeft; page <= maxRight; page++) { pagination_buttons.append(`<button value=${page} class="page btn btn-sm btn-secondary">${page}</button>`); }
		if (pages != page) { pagination_buttons.append(`<button value=${pages} class="page btn btn-sm btn-secondary">Último &#187;</button>`); }

		$('.page').on('click', function () {
			pagination_buttons.empty();
			page = Number($(this).val());

			if (type == "whitelist") { searchLinkInWhitelistDB($(inputSearchWhitelist).val(), page, rows) }
			else if (type == "blacklist") { searchLinkInBlacklistDB($(inputSearchBlacklist).val(), page, rows) }
		})
	}

	/* ------------------------------------------------------------------------------------------------- */

	function buildTable(tbody, type, tableData, page, rows) {
		let opt1, opt2, pagination_buttons;

		tbody.empty();
		if (tableData.length > 0) {
			if (type == "whitelist") { opt1 = 'Liberado'; opt2 = 'Restrito'; pagination_buttons = pagination_whitelist; notfound_whitelist.html(''); }
			else if (type == "blacklist") { opt1 = 'Ativado'; opt2 = 'Desativado'; pagination_buttons = pagination_blacklist; notfound_blacklist.html(''); }

			const data = pagination(tableData, page, rows);
			const myList = data.querySet;

			for (let i = 0; i < myList.length; i++) {
				let row;

				row = `
					<tr>
						<td>${myList[i].id}</td>
						<td>${myList[i].link}</td>
						<td>${myList[i].creatAt}</td>
						<td>
							<select class="form-select selectOption" data-type="${type}" data-id="${myList[i].id}">
								<option value="0">${opt1}</option>
								<option value="1">${opt2}</option>
								<option value="2">Remover Link</option>
							</select>
						</td>
					</tr>`;
				tbody.append(row);
			}

			const select = tbody.find('select');
			for (let index = 0; index < select.length; index++) {
				const id = $(select[index]).attr('data-id');
				for (let i = 0; i < myList.length; i++) {
					if (id == myList[i].id) {
						const selected = myList[i].statusLink;
						if (selected == true) { $(select[index]).val(0); }
						else if (selected == false) { $(select[index]).val(1); }
						break;
					}
				}
			}

			$('.selectOption').on('change', function () {
				changeSelect($(this).attr('data-id'), Number($(this).val()), $(this).attr('data-type'));
			})
			pageButtons(data.pages, page, pagination_buttons, type)
		} else {
			if (type == "whitelist") { notfound_whitelist.html("Nenhum registro encontrado"); pagination_whitelist.empty(); }
			else if (type == "blacklist") { notfound_blacklist.html("Nenhum registro encontrado"); pagination_blacklist.empty(); }
		}
	}

	/* ------------------------------------------------------------------------------------------------- */

	selectQntBlacklist.on('change', () => {
		rows = Number(selectQntBlacklist.val());
		searchLinkInBlacklistDB($(inputSearchBlacklist).val(), page_blacklist, rows);
	});

	/* ------------------------------------------------------------------------------------------------- */

	selectQntWhitelist.on('change', () => {
		rows = Number(selectQntWhitelist.val());
		searchLinkInWhitelistDB($(inputSearchWhitelist).val(), page_whitelist, rows);
	});

	function gd(year, month, day) { return new Date(year, month - 1, day).getTime() }

	function flotSetData(qntRequest) {
		let data = [];

		for (let index = 0; index < qntRequest.length; index++) {
			const date = qntRequest[index].date.split('/');
			data.push([gd(date[2], date[1], date[0]), qntRequest[index].numberRequest])
		}

		const dataset = [{ label: "Requisições realizadas", data, color: "#03A9F4", points: { fillColor: "#03A9F4", show: !0, radius: 2 }, lines: { show: !0, lineWidth: 1 } }],
			options = {
				series: { shadowSize: 0 },
				grid: { borderWidth: 1, borderColor: "#f3f3f3", show: !0, clickable: !0, hoverable: !0, mouseActiveRadius: 20, labelMargin: 10 },
				xaxes: [{ color: "#f3f3f3", mode: "time", timeformat: "%d/%m", font: { lineHeight: 13, style: "normal", color: "#9f9f9f" } }],
				yaxis: { ticks: 2, color: "#f3f3f3", tickDecimals: 0, font: { lineHeight: 13, style: "normal", color: "#9f9f9f" } },
				legend: { container: ".flc-visits", backgroundOpacity: .5, noColumns: 0, font: { lineHeight: 13, style: "normal", color: "#9f9f9f" } }
			};

		visit_overt_time[0] && $.plot(visit_overt_time, dataset, options);

		flot[0] && (flot.on("plothover", function (event, pos, item) {
			if (item) {
				var x = item.datapoint[0].toFixed(2), y = item.datapoint[1].toFixed(2);
				$(".flot-tooltip").html(item.series.label + ": " + parseInt(y)).css({ top: item.pageY + 5, left: item.pageX + 5 }).show()
			} else $(".flot-tooltip").hide()
		}), $("<div class='flot-tooltip' class='chart-tooltip'></div>").appendTo("body"))
	}

	function searchLinkInBlacklistDB(value, page, rows) {
		if (value != "") {
			notifyBackgroundPage("searchLinkBlacklist", { page, rows, value });
		} else {
			notifyBackgroundPage("updateTableBlacklist", { page, rows });
		}
	}

	function searchLinkInWhitelistDB(value, page, rows) {
		if (value != "") {
			notifyBackgroundPage("searchLinkWhitelist", { page, rows, value });
		} else {
			notifyBackgroundPage("updateTableWhitelist", { page, rows });
		}
	}
})(jQuery);