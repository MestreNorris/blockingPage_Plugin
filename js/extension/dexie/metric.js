var METRIC = class Metric {

    constructor(id, qntDevices, lastUpdateDB, qntBlockedLinks, listPages, performanceBlock, performanceUpdate) {
        this.id = id;
        this.qntDevices = [qntDevices];
        this.lastUpdateDB = lastUpdateDB;
        this.qntBlockedLinks = qntBlockedLinks;
        this.listPages = [listPages];
        this.performanceBlock = performanceBlock;
        this.performanceUpdate = performanceUpdate;
    }

    init() {
        db.metric.count().then(count => {
            if (count == 0) {
                db.metric.add({
                    id: 1,
                    qntDevices: [],
                    lastUpdateDB: 0,
                    qntBlockedLinks: 0,
                    listPages: [],
                    performanceBlock: 0,
                    performanceUpdate: 0
                });
            }
        });
    }

    getAll() { return db.metric.toArray() }

    async update(name, value) {
        const dataMetric = await db.metric.where({ id: 1 }).first();

        const listFunctions = {
            qntDevices: function () { db.metric.update(1, { qntDevices: value }) },
            listPages: function () { db.metric.update(1, { listPages: value }) },
            lastUpdateDB: function () { db.metric.update(1, { lastUpdateDB: value }) },
            qntBlockedLinks: function () { const qnt = Number(dataMetric.qntBlockedLinks); db.metric.update(1, { qntBlockedLinks: qnt + value }); },
            performanceBlock: function () { if (value > dataMetric.performanceBlock) { db.metric.update(1, { performanceBlock: value }) } },
            performanceUpdate: function () { if (value > dataMetric.performanceUpdate) { db.metric.update(1, { performanceUpdate: value }) } }
        }
        listFunctions[name](value);
    }
}