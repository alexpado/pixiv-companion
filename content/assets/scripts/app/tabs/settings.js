import {ExtensionTab, Interface} from "../../popup.ui.js";
import HomeTab from "./home.js";

export default class SettingsTab extends ExtensionTab {

    static get name() {
        return 'settings'
    }

    constructor(companion, name) {
        super(companion, name);

        this.proxyInput = Interface.createInput('Proxy Domain');
        this.btnCreate  = Interface.createButton('New Share');
        this.btnBack    = Interface.createButton('Go Back');

        this.btnBack.addEventListener('click', () => {
            this.companion.showTab(HomeTab.name);
        });

        this.btnCreate.addEventListener('click', () => {
            Interface.handleButton(this.btnCreate, async () => {
                const id = await this.companion.extension.settings.createNewShare();
                this.companion.showTab('webhook', {id});
            }, true).then()
        })
    }


    beforeHide() {
        if (this.companion.extension.settings.proxy !== this.proxyInput.value) {
            this.companion.extension.settings.proxy = this.proxyInput.value;

            this.companion.extension.settings.save().then();
            this.companion.defineBackgroundImage().then();
        }
    }

    beforeShow(args) {

        this.proxyInput.value = this.companion.extension.settings.proxy;

        this.shares = this.companion.extension.settings.shares.map(share => {
            const btn = Interface.createButton(share.name.length > 0 ? share.name : '< unnamed >');

            btn.addEventListener('click', () => {
                this.companion.showTab('webhook', {id: share.id});
            });

            return btn;
        });

        this.children = [
            this.proxyInput.element,
            Interface.createFiller(),
            ...this.shares,
            Interface.createSeparator(),
            this.btnCreate,
            this.btnBack
        ]
    }
}