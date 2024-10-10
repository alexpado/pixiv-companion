import Application from "../Application.js";
import AppTab from "../AppTab.js";
import Interface from "../Interface.js";
import {ShareTab} from "./ShareTab.js";
import SettingsTab from "./SettingsTab.js";

/**
 * Home tab — Default tab shown when the extension is opened
 */
export default class HomeTab extends AppTab {

    /**
     * Retrieve the tab name, that will be used as identifier.
     *
     * @returns {string}
     *      This tab name
     */
    static getName() {
        return 'home';
    }

    /**
     * Create an application tab.
     *
     * @param {Application} application
     *      The application to which this tab will be associated.
     */
    constructor(application) {
        super(application, HomeTab.getName());

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

        Interface.handleButtonClickSync(this.btnShare, () => this.showTab(ShareTab.getName()));
        Interface.handleButtonClickSync(this.btnSettings, () => this.showTab(SettingsTab.getName()));

        Interface.handleButtonClickAsync(this.btnSave, async () => await this.downloadPicture(), 'temporary');
        Interface.handleButtonClickAsync(this.btnLink, async () => await this.copyLink(), 'temporary')
    }

    /**
     * Initiate the download of the currently loaded artwork.
     *
     * @returns {Promise<void>}
     *      A promise resolving when the download has finished and the user is currently saving the file.
     */
    async downloadPicture() {
        const picture = await this.application.downloadPixivImage('full');
        await Application.downloadContent(picture, this.application.getPixiv().getFilename())
    }

    /**
     * Copy the Pixiv share link (Phixiv) to the clipboard.
     *
     * @returns {Promise<void>}
     *      A promise resolving when the clipboard content has been updated.
     */
    async copyLink() {
        await Application.setClipboard(this.application.getPixiv().getPhixivUrl());
    }

    /**
     * Called whenever a UI refresh is needed. This can be done from anywhere in the code as long a CustomEvent 'tick'
     * is being dispatched on the body.
     *
     * This method get also called right after onShow() automatically.
     */
    async onTick() {
        this.btnShare.disabled = this.application.isPixivAvailable();
        this.btnSave.disabled  = this.application.isPixivAvailable();
        this.btnLink.disabled  = this.application.isPixivAvailable();

        if (this.application.isPixivAvailable()) {
            const pixiv = this.application.getPixiv();

            this.btnShare.disabled     = false;
            this.btnSave.disabled      = false;
            this.btnLink.disabled      = false;
            this.artworkInfo.innerText = `Art by ${pixiv.getAuthorName()}`;
        } else {

            this.btnShare.disabled     = true;
            this.btnSave.disabled      = true;
            this.btnLink.disabled      = true;
            this.artworkInfo.innerText = 'No artwork available';
        }
    }
}