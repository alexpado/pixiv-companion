import {ExtensionTab, Interface} from "../../popup.ui.js";
import Extension from "../Extension.js";
import {ShareTab} from "./share.js";
import SettingsTab from "./settings.js";

/**
 * Home tab — Default tab showed when the extension is opened
 */
export default class HomeTab extends ExtensionTab {

    static get name() {
        return 'home';
    }

    /**
     * @param {PixivCompanion} companion
     * @param {string} name
     */
    constructor(companion, name) {
        super(companion, name);


        this.artworkInfo = document.createElement('h2');
        this.btnShare    = Interface.createButton('Share on Discord');
        this.btnSave     = Interface.createButton('Save Image');
        this.btnLink     = Interface.createButton('Copy Phixiv Link');
        this.btnSettings = Interface.createButton('Settings');

        this.children = [
            this.artworkInfo,
            Interface.createFiller(),
            this.btnShare,
            this.btnSave,
            this.btnLink,
            Interface.createSeparator(),
            this.btnSettings
        ];

        this.btnShare.addEventListener('click', () => {
            this.companion.showTab(ShareTab.name)
        });

        this.btnSave.addEventListener('click', () => {
            Interface.handleButton(this.btnSave, async () => {
                await this.downloadPicture();
            }, true).then();
        });

        this.btnLink.addEventListener('click', () => {
            Interface.handleButton(this.btnLink, async () => {
                await this.copyLink();
            }, true).then();
        });

        this.btnSettings.addEventListener('click', () => {
            this.companion.showTab(SettingsTab.name)
        });
    }

    /**
     * @returns {Promise<void>}
     */
    async downloadPicture() {
        if (!this.companion.pixiv.isAvailable()) {
            throw new Error('Not pixiv data available: Cannot download.');
        }

        const picture = await this.companion.downloadFull();
        Extension.download(picture, this.companion.pixiv.getFilename())
    }

    async copyLink() {
        await Extension.setClipboard(this.companion.pixiv.getPhixivUrl());
    }

    tick() {

        console.log('[HomeTab] Refreshing UI state...');
        console.log('>> Pixiv Available ?', this.companion.pixiv.isAvailable());

        this.btnShare.disabled = !this.companion.pixiv.isAvailable();
        this.btnSave.disabled  = !this.companion.pixiv.isAvailable();
        this.btnLink.disabled  = !this.companion.pixiv.isAvailable();

        if (this.companion.pixiv.isAvailable()) {
            this.artworkInfo.innerText = `Art by ${this.companion.pixiv.getAuthorName()}`;

        } else {
            this.artworkInfo.innerText = 'No artwork available'
        }

    }
}