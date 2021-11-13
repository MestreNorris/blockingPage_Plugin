var CONFIG = class Config {

    constructor(id, sounds, notification, cleaner) {
        this.id = id;
        this.sounds = sounds;
        this.notification = notification;
        this.cleaner = cleaner;
    }

    init() {
        db.config.count().then(count => {
            if (count == 0) {
                db.config.add({
                    id: 1,
                    sounds: false,
                    notification: false,
                    cleaner: {
                        enable: false,
                        webSQL: false,
                        history: false,
                        pluginData: false,
                        cookies: false,
                        cache: false,
                        fileSystems: false,
                        passwords: false,
                        downloads: false,
                        formData: false,
                        appCache: false,
                        indexDB: false,
                        localstorage: false,
                        cleanBrowserIn: 5,
                        qntCloseTabs: 1
                    },
                });
            }
        });
    }

    getAll() { return db.config.toArray(); }

    async update(name, value) {
        const config = await this.getAll();
        const cleaner = config[0].cleaner;

        const listFunctions = {
            sounds: function (value) { db.config.update(1, { sounds: value }); },
            notification: function (value) { db.config.update(1, { notification: value }) },
            cleaner: function (value) { cleaner.enable = value; db.config.update(1, { cleaner: cleaner }) },
            localstorage: function (value) { cleaner.localstorage = value; db.config.update(1, { cleaner: cleaner }) },
            appCache: function (value) { cleaner.appCache = value; db.config.update(1, { cleaner: cleaner }) },
            formData: function (value) { cleaner.formData = value; db.config.update(1, { cleaner: cleaner }) },
            downloads: function (value) { cleaner.downloads = value; db.config.update(1, { cleaner: cleaner }) },
            passwords: function (value) { cleaner.passwords = value; db.config.update(1, { cleaner: cleaner }) },
            fileSystems: function (value) { cleaner.fileSystems = value; db.config.update(1, { cleaner: cleaner }) },
            cache: function (value) { cleaner.cache = value; db.config.update(1, { cleaner: cleaner }) },
            cookies: function (value) { cleaner.cookies = value; db.config.update(1, { cleaner: cleaner }) },
            pluginData: function (value) { cleaner.pluginData = value; db.config.update(1, { cleaner: cleaner }) },
            history: function (value) { cleaner.history = value; db.config.update(1, { cleaner: cleaner }) },
            webSQL: function (value) { cleaner.webSQL = value; db.config.update(1, { cleaner: cleaner }) },
            indexDB: function (value) { cleaner.indexDB = value; db.config.update(1, { cleaner: cleaner }) },
            cleanBrowserIn: function (value) { cleaner.cleanBrowserIn = value; db.config.update(1, { cleaner: cleaner }) },
            qntCloseTabs: function (value) { cleaner.qntCloseTabs = value; db.config.update(1, { cleaner: cleaner }) }
        }

        listFunctions[name](value);
    }
}