/**
 * @typedef {Object} DiscordShare
 * @property {number} id                        The id
 * @property {string} name                      The display name
 * @property {string} url                       The webhook url
 * @property {string} identity                  The name that will be displayed as author
 */
import Logger from "./Logger.js";

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

        Logger.log('Setting', 'createNewShare()', 'Creating new share...')
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

        Logger.log('Setting', 'createNewShare()', 'Created a new share with the id', id);
        await this.save();
        return id;
    }

    async deleteShare(id) {
        Logger.log('Setting', 'deleteShare()', 'Deleting share with id', id);
        this.shares = this.shares.filter(share => share.id !== id);
        await this.save();
    }

    /**
     * Set the proxy and update the settings, if necessary.
     *
     * @param proxy
     * @returns {Promise<void>}
     */
    async setProxy(proxy) {
        if (this.proxy !== proxy) {
            Logger.log('Setting', 'setProxy()', 'Updating proxy value to', proxy);
            this.proxy = proxy;
            await this.save();
            document.body.dispatchEvent(new CustomEvent('proxy-updated'));
        }
    }

    async save() {
        Logger.log('Setting', 'save()', 'Saving preferences...');
        await chrome.storage.sync.set(
            {
                settings: {
                    proxy:  this.proxy,
                    shares: this.shares
                }
            }
        );
        Logger.log('Setting', 'save()', 'Saved.');
    }

    async load() {
        Logger.log('Setting', 'save()', 'Loading preferences...');
        const data  = await chrome.storage.sync.get('settings');
        this.proxy  = data.settings?.proxy;
        this.shares = data.settings?.shares ?? [];
        Logger.log('Setting', 'save()', 'Loaded.', data.settings);
    }

}