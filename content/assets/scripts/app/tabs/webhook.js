import {ExtensionTab, Interface} from "../../popup.ui.js";
import SettingsTab from "./settings.js";

export default class WebhookTab extends ExtensionTab {

    static get name() {
        return 'webhook';
    }


    constructor(companion, name) {
        super(companion, name);

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

        this.btnSave.addEventListener('click', () => {
            const share    = this.getShare();
            share.name     = this.inputName.value;
            share.url      = this.inputUrl.value;
            share.identity = this.inputIdentity.value;

            this.companion.extension.settings.save().then(() => {
                this.companion.showTab(SettingsTab.name);
            });
        })

        this.btnBack.addEventListener('click', () => {
            this.companion.showTab(SettingsTab.name);
        });

        this.btnDelete.addEventListener('click', () => {
            Interface.handleButton(this.btnDelete, async () => {
                await this.companion.extension.settings.deleteShare(this.activeShareId);
                this.companion.showTab(SettingsTab.name);
            }, true).then()
        });
    }

    /**
     * @returns {DiscordShare}
     */
    getShare() {
        return this.companion.extension.settings.shares.findLast(share => share.id === this.activeShareId);
    }

    beforeShow(args) {

        this.activeShareId = args.id;
        const share        = this.getShare();

        this.inputName.value     = share.name;
        this.inputUrl.value      = share.url;
        this.inputIdentity.value = share.identity;
    }
}