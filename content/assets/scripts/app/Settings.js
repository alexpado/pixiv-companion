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

    /**
     * Transform the provided pximg link into its proxied version. The proxied version allows to access artwork source
     * image directly, without playing around with headers.
     *
     * @param {string} pixivUrl
     *      The URL to proxy
     * @returns {string}
     *      The proxied URL is the proxy setting was set, the provided link otherwise.
     */
    getProxiedUrl(pixivUrl) {
        if (this.proxy) {
            return pixivUrl.replace('i.pximg.net', this.proxy);
        }
        return pixivUrl;
    }

    /**
     * Create a new share that can be then edited.
     *
     * @returns {Promise<number>}
     *      A promise resolving to the new share's id
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

    /**
     * Delete a share, matching with the provided id.
     *
     * @param {number} id
     *      The id of the share to delete.
     * @returns {Promise<void>}
     *      A promise resolving when the share has been deleted. Will resolve even if nothing has been deleted.
     */
    async deleteShare(id) {
        Logger.log('Setting', 'deleteShare()', 'Deleting share with id', id);
        this.shares = this.shares.filter(share => share.id !== id);
        await this.save();
    }

    /**
     * Set the proxy and update the settings, if necessary.
     *
     * @param {string} proxy
     *      The domain to use as proxy image server.
     * @returns {Promise<void>}
     *      A promise resolving when the setting has been updated. Will resolve even if nothing as been updated.
     */
    async setProxy(proxy) {
        if (this.proxy !== proxy) {
            Logger.log('Setting', 'setProxy()', 'Updating proxy value to', proxy);
            this.proxy = proxy;
            await this.save();
            document.body.dispatchEvent(new CustomEvent('proxy-updated'));
        }
    }

    /**
     * Save the settings to the browser.
     *
     * @returns {Promise<void>}
     *      A promise resolving when the settings have been saved.
     */
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

    /**
     * Load the settings from the browser.
     *
     * @returns {Promise<void>}
     *      A promise resolving when the settings have been loaded.
     */
    async load() {
        Logger.log('Setting', 'save()', 'Loading preferences...');
        const data  = await chrome.storage.sync.get('settings');
        this.proxy  = data.settings?.proxy;
        this.shares = data.settings?.shares ?? [];
        Logger.log('Setting', 'save()', 'Loaded.', data.settings);
    }

}