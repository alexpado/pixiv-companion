/**
 * @typedef {Object} DiscordShare
 * @property {number} id                        The id
 * @property {string} name                      The display name
 * @property {string} url                       The webhook url
 * @property {string} identity                  The name that will be displayed as author
 */

export default class Settings {

    constructor() {
        this.proxy = null;
        /**
         * @type {DiscordShare[]}
         */
        this.shares = [];
    }

    getProxiedUrl(pixivUrl) {
        if (this.proxy) {
            return pixivUrl.replace('i.pximg.net', this.proxy);
        }
        return pixivUrl;
    }

    /**
     * Create a new share that can be then edited.
     * @returns {Promise<number>}
     */
    async createNewShare() {

        console.log('[Settings] Creating new share...')
        let id = 0;
        this.shares.forEach(share => id = Math.max(id, share.id));
        id++;

        this.shares.push(
            {
                id,
                name:     '',
                url:      '',
                identity: ''
            }
        )

        console.log('[Settings] New share id:', id);
        await this.save();
        return id;
    }

    async deleteShare(id) {
        console.log('[Settings] Deleting share id', id);
        this.shares = this.shares.filter(share => share.id !== id);
        await this.save();
    }

    async save() {
        console.log('[Settings] Saving...');
        await chrome.storage.sync.set(
            {
                settings: {
                    proxy:  this.proxy,
                    shares: this.shares
                }
            }
        );
        console.log('[Settings] Saved.');
    }

    async load() {
        console.log('[Settings] Loading...');
        const data  = await chrome.storage.sync.get('settings');
        this.proxy  = data.settings?.proxy;
        this.shares = data.settings?.shares ?? [];
        console.log('[Settings] Loaded.');
    }

}