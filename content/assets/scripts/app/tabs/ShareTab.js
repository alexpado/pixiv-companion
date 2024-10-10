import HomeTab from "./HomeTab.js";
import AppTab from "../AppTab.js";
import Interface from "../Interface.js";

/**
 * Share tab — Tab used to send artwork links to predefined share targets.
 */
export class ShareTab extends AppTab {

    /**
     * Retrieve the tab name, that will be used as identifier.
     *
     * @returns {string}
     *      This tab name
     */
    static getName() {
        return 'share'
    }

    /**
     * Create an application tab.
     *
     * @param {Application} application
     *      The application to which this tab will be associated.
     */
    constructor(application) {
        super(application, ShareTab.getName());

        this.artworkInfo = document.createElement('h2');
        this.btnBack     = Interface.createButton('Back');

        Interface.handleButtonClickSync(this.btnBack, () => this.showTab(HomeTab.getName()));
    }

    /**
     * Called right before the content of this tab is inserted into the DOM.
     *
     * @param {any} args
     *      Optional argument that can be provided to initialize the tab's UI.
     */
    async onShow(args) {

        this.shares = this.application.settings.shares
                          .filter(share => share.url !== null && share.url.length > 0)
                          .map(share => {
                              const name = share.name.length > 0 ? share.name : '< unnamed >';
                              const btn  = Interface.createButton(name);

                              Interface.handleButtonClickAsync(btn, async () => await this.application.shareArtwork(share.id), 'lock');
                              return btn;
                          });

        this.children = [
            this.artworkInfo,
            Interface.createFiller(),
            ...this.shares,
            Interface.createSeparator(),
            this.btnBack
        ];
    }

    /**
     * Called whenever a UI refresh is needed. This can be done from anywhere in the code as long a CustomEvent 'tick'
     * is being dispatched on the body.
     *
     * This method get also called right after onShow() automatically.
     */
    async onTick() {
        if (this.application.isPixivAvailable()) {
            this.artworkInfo.innerText = `Art by ${this.application.getPixiv().getAuthorName()}`;
        } else {
            this.showTab(HomeTab.getName());
        }
    }

}