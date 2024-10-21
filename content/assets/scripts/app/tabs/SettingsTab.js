import AppTab from "../AppTab.js";
import Interface from "../Interface.js";
import HomeTab from "./HomeTab.js";
import WebhookTab from "./WebhookTab.js";

/**
 * Settings tab — Tab used to configure proxy and shares.
 */
export default class SettingsTab extends AppTab {

    /**
     * Retrieve the tab name, that will be used as identifier.
     *
     * @returns {string}
     *      This tab name
     */
    static getName() {
        return 'settings'
    }

    /**
     * Create an application tab.
     *
     * @param {Application} application
     *      The application to which this tab will be associated.
     */
    constructor(application) {
        super(application, SettingsTab.getName());

        this.proxyInput = Interface.createInput('Proxy Domain');
        this.btnCreate  = Interface.createButton('New Share');
        this.btnBack    = Interface.createButton('Go Back');

        Interface.handleButtonClickSync(this.btnBack, () => this.showTab(HomeTab.getName()));

        Interface.handleButtonClickAsync(this.btnCreate, async () => {
            const id = await this.application.settings.createNewShare();
            this.showTab(WebhookTab.getName(), {id});
        });
    }

    /**
     * Called right before the content of this tab is inserted into the DOM.
     *
     * @param {any} args
     *      Optional argument that can be provided to initialize the tab's UI.
     */
    async onShow(args) {

        this.proxyInput.value = this.application.settings.proxy;

        this.shares = this.application.settings.shares.map(share => {
            const name = share.name.length > 0 ? share.name : '< unnamed >';
            const btn  = Interface.createButton(name);

            Interface.handleButtonClickSync(btn, () => this.showTab(WebhookTab.getName(), {id: share.id}));
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

    /**
     * Called right before the content of this tab is removed from the DOM.
     */
    async onHide() {
        await this.application.settings.setProxy(this.proxyInput.value);
    }
}
