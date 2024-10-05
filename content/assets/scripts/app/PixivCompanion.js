import Extension from "./Extension.js";
import HomeTab from "./tabs/home.js";
import {ShareTab} from "./tabs/share.js";
import SettingsTab from "./tabs/settings.js";
import WebhookTab from "./tabs/webhook.js";

export default class PixivCompanion {

    /**
     * @param {Extension} extension
     * @param {PixivArtwork} pixiv
     */
    constructor(extension, pixiv) {

        this.extension = extension;
        this.pixiv     = pixiv;
        this.container = document.getElementById('tab-content')

        /**
         * @type {ExtensionTab[]}
         */
        this.tabs = [
            new HomeTab(this, HomeTab.name),
            new ShareTab(this, ShareTab.name),
            new SettingsTab(this, SettingsTab.name),
            new WebhookTab(this, WebhookTab.name)
        ];
        /**
         * @type {ExtensionTab|null}
         */
        this.currentTab = null;
    }

    /**
     * @param {string} name
     * @param {*=} args
     */
    showTab(name, args) {

        for (let i = 0; i < this.tabs.length; i++) {
            const tab = this.tabs[i];

            if (tab.name === name) {
                if (this.currentTab) {
                    this.currentTab.beforeHide();
                }

                tab.beforeShow(args);
                this.container.innerHTML = '';
                tab.children.forEach(node => this.container.appendChild(node));
                this.currentTab = tab;
                this.currentTab.tick(); // Tick once at least
                break;
            }
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async defineBackgroundImage() {
        const background                 = document.getElementById('background');
        const picture                    = await this.downloadPreview();
        background.style.backgroundImage = `url("${picture}")`;
    }

    /**
     * @returns {Promise<string>}
     */
    async downloadPreview() {
        const url = this.extension.settings.getProxiedUrl(this.pixiv.getSource("preview"));

        const response = await fetch(url, {
            method: 'GET',
            mode:   'cors'
        });
        return await Extension.toBase64(response);
    }

    /**
     * @returns {Promise<string>}
     */
    async downloadFull() {
        const url = this.extension.settings.getProxiedUrl(this.pixiv.getSource("full"));

        const response = await fetch(url, {
            method: 'GET',
            mode:   'cors'
        });
        return await Extension.toBase64(response);
    }

    /**
     * Share the current loaded artwork to a specific share
     * @param {number} shareId
     * @returns {Promise<void>}
     */
    async shareArtwork(shareId) {

        const share = this.extension.settings.shares.findLast(share => share.id === shareId);
        if (share && this.pixiv.isAvailable()) {

            const artworkLink = this.pixiv.getPhixivUrl();

            await fetch(share.url, {
                method:  'POST',
                headers: new Headers({'content-type': 'application/json'}),
                body:    JSON.stringify(
                    {
                        content: artworkLink,
                        username: `Pixiv Companion — ${share.identity}`
                    }
                )
            });
        }
    }
}