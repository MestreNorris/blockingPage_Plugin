var WHITELIST = class Whitelist {

    constructor(id, link, creatAt, statusLink, updateLink) {
        this.id = id;
        this.link = link;
        this.creatAt = creatAt;
        this.statusLink = statusLink;
        this.updateLink = updateLink;
    }

    save(obj) { db.whitelist.add(obj); }
    saveAll(objs) { db.whitelist.bulkAdd(objs) }
    count() { return db.whitelist.count(); }
    remove(id) { return db.whitelist.delete(id); }
    removeAll(ids) { db.whitelist.bulkDelete(ids) }
    getAll() { return db.whitelist.toArray(); }
    getbyId(id) { return db.whitelist.where({ id: id }).first(); }
    update(obj) { db.whitelist.put(obj); }
}