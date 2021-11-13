var BLACKLIST = class Blacklist {
    constructor(id, link, creatAt, statusLink, updateLink) {
        this.id = id;
        this.link = link;
        this.creatAt = creatAt;
        this.statusLink = statusLink;
        this.updateLink = updateLink;
    }

    save(obj) { db.blacklist.add(obj) }
    saveAll(objs) { db.blacklist.bulkAdd(objs) }
    remove(id) { return db.blacklist.delete(id); }
    removeAll(ids) { db.blacklist.bulkDelete(ids) }
    count() { return db.blacklist.count(); }
    getAll() { return db.blacklist.toArray(); }
    getbyId(id) { return db.blacklist.where({ id: id }).first(); }
    update(obj) { db.blacklist.put(obj); }
}