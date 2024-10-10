import SettingsTab from "./SettingsTab.js";
import AppTab from "../AppTab.js";
import Interface from "../Interface.js";

/**
 * Webhook tab — Tab used to configure a predefined share target.
 */
export default class WebhookTab extends AppTab {

    /**
     * Retrieve the tab name, that will be used as identifier.
     *
     * @returns {string}
     *      This tab name
     */
    static getName() {
        return 'webhook';
    }

    /**
     * Create an application tab.
     *
     * @param {Application} application
     *      The application to which this tab will be associated.
     */
    constructor(application) {
        super(application, WebhookTab.getName());

        this.activeShareId = -1;

        this.btnSave   = Interface.createButton('Save');
        this.btnDelete = Interface.createButton('Delete');
        this.btnBack   = Interface.createButton('Back');

        this.inputName     = Interface.createInput('Share Name');
        this.inputUrl      = Interface.createInput('Webhook URL');
        this.inputIdentity = Interface.createInput('Identity')

        this.children = [
            this.inputName.element,
            this.inputUrl.element,
            this.inputIdentity.element,
            Interface.createFiller(),
            Interface.createSeparator(),
            this.btnSave,
            this.btnDelete,
            this.btnBack
        ];

        Interface.handleButtonClickSync(this.btnBack, () => this.showTab(SettingsTab.getName()));

        Interface.handleButtonClickAsync(this.btnSave, async () => {
            const share    = this.getShare();
            share.name     = this.inputName.value;
            share.url      = this.inputUrl.value;
            share.identity = this.inputIdentity.value;

            await this.application.settings.save();
            this.showTab(SettingsTab.getName());
        });

        Interface.handleButtonClickAsync(this.btnDelete, async () => {
            await this.application.settings.deleteShare(this.activeShareId);
            this.showTab(SettingsTab.getName());
        });
    }

    /**
     * @returns {DiscordShare}
     */
    getShare() {
        return this.application.settings.shares.findLast(share => share.id === this.activeShareId);
    }

    /**
     * Called right before the content of this tab is inserted into the DOM.
     *
     * @param {any} args
     *      Optional argument that can be provided to initialize the tab's UI.
     */
    async onShow(args) {
        this.activeShareId = args.id;
        const share        = this.getShare();

        this.inputName.value     = share.name;
        this.inputUrl.value      = share.url;
        this.inputIdentity.value = share.identity;
    }
}