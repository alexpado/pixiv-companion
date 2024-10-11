import Settings from "./Settings.js";
import HomeTab from "./tabs/HomeTab.js";
import {ShareTab} from "./tabs/ShareTab.js";
import SettingsTab from "./tabs/SettingsTab.js";
import WebhookTab from "./tabs/WebhookTab.js";
import PixivArtwork from "./PixivArtwork.js";
import Logger from "./Logger.js";

/**
 * @typedef {Object} ChromeTabQuery
 *
 * @property {boolean} success
 *      Whether the query was successful or not.
 * @property {string|null} message
 *      The error message associated to the failure, if success is false.
 * @property {PixivQuery|null} data
 *      The data associated to the query, if success is true.
 */

/**
 * @typedef {Object} ApplicationData
 *
 * @property {boolean} success
 *      Whether the query was successful or not.
 * @property {string|null} message
 *      The error message associated to the failure, if success is false.
 * @property {PixivArtwork} data
 *      The pixiv artwork. Always set.
 */

/**
 * Default entry point of the extension logic.
 */
export default class Application {

    /**
     * Query the content script in the Chrome tab.
     *
     * @param {string} action
     *      The action to send to the Chrome tab.
     * @param {any=} args
     *      Optional arguments that can be sent to the Chrome tab.
     * @returns {Promise<ChromeTabQuery>}
     *      A promise resolving to the result of the Chrome tab query.
     */
    static async queryBrowser(action, args = {}) {
        const queryOptions = {
            active:        true,
            currentWindow: true
        };

        Logger.log('Application', 'queryBrowser()', 'Sending tab query packet', queryOptions);
        const tabs = await chrome.tabs.query(queryOptions);
        if (tabs.length === 0) {
            Logger.error('Application', 'queryBrowser()', 'No tab found.');
            throw new Error('Unable to find an active tab');
        }
        const tab = tabs[0];

        try {
            const packet = {
                action:    action,
                arguments: args
            }

            Logger.log('Application', 'queryBrowser()', 'Sending packet to tab:', packet);
            const response = await chrome.tabs.sendMessage(tab.id, packet);

            if (response) {
                Logger.log('Application', 'queryBrowser()', 'Obtained response:', {...response});
                return response;
            }
        } catch (e) {

            Logger.error('Application', 'queryBrowser()', e.message);
        }

        Logger.error('Application', 'queryBrowser()', 'Data has not been loaded.');
        throw new Error('Unable to retrieve tab data. Make sure you focused the document before clicking the extension.')
    }

    /**
     * Define the user's clipboard content.
     *
     * @param {string} text
     *      The text to put inside the user's clipboard.
     * @returns {Promise<void>}
     *      A promise resolving when the clipboard content has been updated.
     */
    static async setClipboard(text) {
        Logger.log('Application', 'setClipboard()', 'Set clipboard to', text);
        const type = 'text/plain';
        const blob = new Blob([text], {type});
        const data = [new ClipboardItem({[type]: blob})]
        await navigator.clipboard.write(data);
    }

    /**
     * Download the provided base64 as a file.
     *
     * @param {string} content
     *      Content as base64.
     * @param {string} filename
     *      Filename to download the base64 under.
     */
    static async downloadContent(content, filename) {

        Logger.log('Application', 'downloadContent()', 'Downloading', filename);
        const a         = document.createElement('a');
        a.href          = content;
        a.download      = filename;
        a.style.display = 'none';

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    /**
     * Convert a fetch response to a base64 string with the data url prefix.
     *
     * @param {Response} response
     *      HTTP Response from a fetch request.
     * @returns {Promise<string>}
     *      A promise resolving to the base64 representation of the given response.
     */
    static toBase64(response) {
        return new Promise((resolve, reject) => {
            const reader     = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror   = reject
            response.blob().then(blob => reader.readAsDataURL(blob));
        });
    }

    constructor() {

        this.settings  = new Settings();
        this.container = document.getElementById('tab-content');

        /**
         * @type {ApplicationData}
         */
        this.content = {
            success: false,
            message: 'Data has not been loaded yet.',
            data:    new PixivArtwork()
        };

        /**
         * @type {AppTab[]}
         */
        this.tabs = [
            new HomeTab(this),
            new ShareTab(this),
            new SettingsTab(this),
            new WebhookTab(this)
        ];

        /**
         * @type {AppTab|null}
         */
        this.activeTab = null;

        document.body.addEventListener('tick', () => {
            if (this.activeTab) this.activeTab.onTick().then();
        });

        document.body.addEventListener('proxy-updated', () => {
            if (this.isPixivAvailable()) this.loadBackgroundImage().then();
        });
    }

    /**
     * Display a tab in the extension container. If the tab name send is the same as the one currently active, the tab
     * will still be destroyed then rebuilt, just like it was a different tab.
     *
     * @param {string} name
     *      The name of the tab to display.
     * @param {any=} args
     *      Optional arguments to send to the tab when displaying.
     * @returns {Promise<boolean>}
     *      A promise resolving to true when a tab change occurred, false otherwise.
     */
    async showTab(name, args = {}) {

        Logger.log('Application', 'showTab()', 'Trying to display tab', name, 'with args', {...args});

        for (let i = 0; i < this.tabs.length; i++) {
            const tab = this.tabs[i];

            if (tab.name === name) {
                Logger.log('Application', 'showTab()', 'Found matching tab at index', i);

                if (this.activeTab) {
                    Logger.log('Application', 'showTab()', `Calling 'onHide()' on current tab (${this.activeTab.name})`);
                    await this.activeTab.onHide();
                }

                Logger.log('Application', 'showTab()', "Calling 'onShow()' on new tab...");
                await tab.onShow(args);


                Logger.log('Application', 'showTab()', "Applying tab to DOM...");
                this.container.innerHTML = '';
                tab.children.forEach(node => this.container.appendChild(node));
                this.activeTab = tab;

                Logger.log('Application', 'showTab()', "Ticking tab...");
                await this.activeTab.onTick();

                Logger.log('Application', 'showTab()', "Done.");
                return true;
            }
        }
        Logger.error('Application', 'showTab()', 'No tab found matching the provided name.');
        return false;
    }

    /**
     * Load the pixiv preview image and set it as the extension background.
     *
     * @returns {Promise<void>}
     *      A promise resolving when the background has been updated.
     */
    async loadBackgroundImage() {
        Logger.log('Application', 'loadBackgroundImage()', 'Loading background image...');
        const background = document.getElementById('background');
        const picture    = await this.downloadPixivImage('preview');
        Logger.log('Application', 'loadBackgroundImage()', 'Image loaded !');
        background.style.backgroundImage = `url("${picture}")`;
    }

    /**
     * Download a Pixiv image given a resolution type.
     *
     * @param {'full'|'preview'} type
     *      The resolution type of the image to download.
     * @returns {Promise<string>}
     *      A promise resolving to the image as base64.
     */
    async downloadPixivImage(type) {

        const pixiv    = this.getPixiv();
        const fetchUrl = this.settings.getProxiedUrl(pixiv.getSource(type));
        Logger.log('Application', 'downloadPixivImage()', 'Downloading image...', {
            fetchUrl,
            type
        });
        const response = await fetch(fetchUrl, {
            method: 'GET',
            mode:   'cors'
        });
        Logger.log('Application', 'downloadPixivImage()', 'Converting to base64...');
        const b64 = await Application.toBase64(response);
        Logger.log('Application', 'downloadPixivImage()', 'Ok.');
        return b64;
    }

    /**
     * Share the current loaded artwork to a specific discord share.
     * @param {number} shareId
     *      Identifier of the discord share to which the image should be shared.
     * @param {boolean=} spoiler
     *      Define whether the image should be marked as spoiler.
     * @returns {Promise<void>}
     *      A promise resolving when the currently loaded artwork has been shared.
     */
    async shareArtwork(shareId, spoiler = false) {
        Logger.log('Application', 'shareArtwork()', 'Trying to share to id', shareId);

        const pixiv = this.getPixiv();
        const share = this.settings.shares.findLast(share => share.id === shareId);

        if (share === null) {
            Logger.error('Application', 'shareArtwork()', 'Share not found');
            throw new Error('Unable to find a share with id ' + shareId);
        }

        const link = pixiv.getPhixivUrl();
        Logger.log('Application', 'shareArtwork()', 'Sharing', link);

        await fetch(share.url, {
            method:  'POST',
            headers: new Headers({'content-type': 'application/json'}),
            body:    JSON.stringify(
                {
                    content:  spoiler ? `||${link}||` : link,
                    username: `Pixiv Companion — ${share.identity}`
                }
            )
        });

        Logger.log('Application', 'shareArtwork()', 'Ok.');
    }

    /**
     * Retrieve the current PixivArtwork instance, while making sure it is available.
     *
     * @returns {PixivArtwork}
     *      The currently loaded PixivArtwork, with populated data.
     */
    getPixiv() {
        if (!this.content.success || !this.content.data.isAvailable()) {
            throw new Error('Pixiv data unavailable at this time.');
        }

        return this.content.data;
    }

    /**
     * Check if the current PixivArtwork is available.
     *
     * @returns {boolean}
     *      True if the Pixiv Artwork instance can be safely retrieved.
     */
    isPixivAvailable() {
        return this.content.success && this.content.data.isAvailable();
    }

}