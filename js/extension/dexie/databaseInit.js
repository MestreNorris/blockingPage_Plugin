const startDB = (dbname, table) => {
  const db = new Dexie(dbname);
  db.version(1).stores(table);
  db.open()
    .then(function () { console.log("Banco de dados iniciado com sucesso."); })
    .catch(function (error) { console.error("Erro ao iniciar o banco de dados: " + error); });
  return db;
};

var db = startDB("BlockingPage", {
  whitelist: `id,link, creatAt, statusLink, updateLink`,
  blacklist: `id, link, creatAt, statusLink, updateLink`,
  metric: `id,qntDevices, lastUpdateDB, qntBlockedLinks, listPages, performanceBlock, performanceUpdate`,
  config: `id, sounds, notification, cleaner, help`
});